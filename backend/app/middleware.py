"""ASGI request correlation and safe completion logging, including failures."""

import logging
from time import monotonic
from uuid import UUID, uuid4

from starlette.datastructures import Headers, MutableHeaders
from starlette.types import ASGIApp, Receive, Scope, Send

from app.errors import error_response

logger = logging.getLogger("insync.requests")


def correlation_id(headers: Headers) -> str:
    values = headers.getlist("x-request-id")
    if len(values) == 1 and len(values[0]) == 36:
        try:
            return str(UUID(values[0]))
        except ValueError:
            pass
    return str(uuid4())


class RequestContextMiddleware:
    def __init__(self, app: ASGIApp):
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return
        request_id = correlation_id(Headers(scope=scope))
        scope.setdefault("state", {})["request_id"] = request_id
        started = monotonic()
        status = 500
        response_started = False

        async def correlated_send(message):
            nonlocal status, response_started
            if message["type"] == "http.response.start":
                response_started = True
                status = message["status"]
                MutableHeaders(scope=message)["X-Request-ID"] = request_id
            await send(message)

        try:
            await self.app(scope, receive, correlated_send)
        except Exception:
            # Do not log exception text/tracebacks, URLs, headers, or request bodies:
            # these can contain credentials or private learner input.
            logger.error("request_failed request_id=%s", request_id)
            if response_started:
                # A streaming response cannot be replaced after headers were sent.
                # Raise a sanitized exception so the server can abort the connection.
                raise RuntimeError(
                    "Response interrupted; request_id=" + request_id
                ) from None
            await error_response(
                500, "internal_error", "Internal server error.", request_id
            )(scope, receive, correlated_send)
        finally:
            logger.info(
                "request_complete request_id=%s status=%s duration_ms=%.2f",
                request_id,
                status,
                (monotonic() - started) * 1000,
            )
