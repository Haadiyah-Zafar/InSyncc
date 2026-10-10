import pytest
from app.config import Settings
from app.main import create_app
from fastapi.testclient import TestClient


@pytest.fixture
def app():
    return create_app(Settings(environment="test", _env_file=None))


@pytest.fixture
def client(app):
    with TestClient(app) as client:
        yield client
