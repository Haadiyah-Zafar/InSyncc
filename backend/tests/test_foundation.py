import asyncio
import logging
from uuid import UUID, uuid4

import httpx
import pytest
from app.config import ConfigurationError, Settings, load_settings
from app.main import create_app
from fastapi import HTTPException, Request
from fastapi.responses import StreamingResponse
from fastapi.testclient import TestClient
from pydantic import BaseModel

SECRET = "private-credential-should-never-appear"


def test_health_and_readiness_lifecycle(app):
    with TestClient(app) as client:
        assert client.get("/health").json() == {"status": "alive"}
        response = client.get("/ready")
        assert response.status_code == 200
        assert response.json() == {
            "status": "ready",
            "scope": "application",
            "checks": {"application": "ready"},
        }
    # Outside the lifespan: alive is distinct from ready, including after shutdown.
    client = TestClient(app)
    assert client.get("/health").status_code == 200
    assert client.get("/ready").status_code == 503


def test_not_ready_before_startup(app):
    assert TestClient(app).get("/ready").status_code == 503


@pytest.mark.parametrize("value", [None, "", SECRET])
def test_missing_or_invalid_configuration_is_safe(monkeypatch, value):
    monkeypatch.setitem(Settings.model_config, "env_file", None)
    monkeypatch.delenv("INSYNC_ENVIRONMENT", raising=False)
    if value is not None:
        monkeypatch.setenv("INSYNC_ENVIRONMENT", value)
    with pytest.raises(ConfigurationError) as error:
        load_settings()
    assert str(error.value) == "Missing or invalid configuration: INSYNC_ENVIRONMENT"
    assert SECRET not in str(error.value)


def test_environment_overrides_dotenv(monkeypatch, tmp_path):
    file = tmp_path / ".env"
    file.write_text("INSYNC_ENVIRONMENT=development\n")
    monkeypatch.setenv("INSYNC_ENVIRONMENT", "production")
    assert Settings(_env_file=file).environment == "production"


@pytest.mark.parametrize(
    "environment,expected", [("development", 200), ("test", 404), ("production", 404)]
)
def test_docs_exposure(environment, expected):
    app = create_app(Settings(environment=environment, _env_file=None))
    with TestClient(app) as client:
        assert client.get("/docs").status_code == expected
        assert client.get("/openapi.json").status_code == expected


def test_unknown_route_and_wrong_method(client):
    response = client.get("/missing")
    assert response.status_code == 404
    assert response.json()["error"]["code"] == "http_error"
    assert response.json()["error"]["request_id"] == response.headers["x-request-id"]
    response = client.post("/health")
    assert response.status_code == 405
    assert "GET" in response.headers["allow"]


def test_http_exception_detail_is_not_exposed(app):
    @app.get("/test-denied")
    def denied():
        raise HTTPException(401, detail=SECRET, headers={"WWW-Authenticate": "Bearer"})

    with TestClient(app) as client:
        response = client.get("/test-denied")
    assert response.status_code == 401
    assert response.headers["www-authenticate"] == "Bearer"
    assert SECRET not in response.text


def test_validation_and_malformed_json_do_not_echo_inputs(app, caplog):
    class Input(BaseModel):
        count: int

    @app.post("/test-input")
    def receive(body: Input):
        return body

    with TestClient(app) as client, caplog.at_level(logging.INFO, logger="insync"):
        for arguments in [
            {"json": {"count": SECRET}},
            {"content": SECRET, "headers": {"Content-Type": "application/json"}},
        ]:
            response = client.post("/test-input", **arguments)
            assert response.status_code == 422
            assert response.json()["error"]["code"] == "validation_error"
            assert (
                response.json()["error"]["request_id"]
                == response.headers["x-request-id"]
            )
            assert SECRET not in response.text
    assert SECRET not in caplog.text


def test_unhandled_failure_is_safe_and_correlated(app, caplog):
    @app.get("/test-failure")
    def fail():
        raise RuntimeError(SECRET)

    request_id = str(uuid4())
    with TestClient(app) as client, caplog.at_level(logging.INFO, logger="insync"):
        response = client.get(
            "/test-failure",
            headers={"X-Request-ID": request_id, "Authorization": SECRET},
        )
    assert response.status_code == 500
    assert response.headers["x-request-id"] == request_id
    assert response.json() == {
        "error": {
            "code": "internal_error",
            "message": "Internal server error.",
            "request_id": request_id,
        }
    }
    assert request_id in caplog.text
    assert SECRET not in response.text + caplog.text
    assert all(
        record.exc_info is None
        for record in caplog.records
        if record.name.startswith("insync")
    )


@pytest.mark.parametrize("supplied", [SECRET, "x" * 500, "123", ""])
def test_invalid_request_id_is_replaced(client, supplied):
    response = client.get("/health", headers={"X-Request-ID": supplied})
    assert (
        str(UUID(response.headers["x-request-id"])) == response.headers["x-request-id"]
    )
    assert response.headers["x-request-id"] != supplied


def test_duplicate_request_ids_are_replaced(client):
    value = str(uuid4())
    response = client.get(
        "/health", headers=[("X-Request-ID", value), ("X-Request-ID", value)]
    )
    assert response.headers["x-request-id"] != value


def test_concurrent_requests_keep_separate_context(app):
    @app.get("/test-context")
    async def context(request: Request):
        await asyncio.sleep(0)
        return {"request_id": request.state.request_id}

    async def run():
        async with httpx.AsyncClient(
            transport=httpx.ASGITransport(app=app), base_url="http://test"
        ) as client:
            ids = [str(uuid4()) for _ in range(12)]
            results = await asyncio.gather(
                *(
                    client.get("/test-context", headers={"X-Request-ID": value})
                    for value in ids
                )
            )
            for value, response in zip(ids, results, strict=True):
                assert response.headers["x-request-id"] == value
                assert response.json()["request_id"] == value

    asyncio.run(run())


def test_streaming_failure_does_not_expose_exception(app, caplog):
    @app.get("/test-stream")
    def stream():
        async def body():
            yield b"started"
            raise RuntimeError(SECRET)

        return StreamingResponse(body())

    with TestClient(app) as client, pytest.raises(RuntimeError) as error:
        client.get("/test-stream")
    assert "Response interrupted; request_id=" in str(error.value)
    assert SECRET not in str(error.value) + caplog.text
