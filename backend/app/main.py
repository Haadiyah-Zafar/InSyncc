"""ASGI factory: uvicorn app.main:create_app --factory --app-dir backend."""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException

from app.api.health import router
from app.config import Settings, load_settings
from app.errors import http_error, validation_error
from app.logging import configure_logging
from app.middleware import RequestContextMiddleware
from app.services.readiness import Readiness

logger = logging.getLogger("insync.lifecycle")


def create_app(settings: Settings | None = None) -> FastAPI:
    settings = settings if settings is not None else load_settings()
    configure_logging()
    readiness = Readiness()

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        # Initialize future required integrations here before setting readiness.
        readiness.started = True
        logger.info("application_started")
        try:
            yield
        finally:
            readiness.started = False
            logger.info("application_stopped")

    app = FastAPI(
        title="InSync API",
        version="0.0.0",
        lifespan=lifespan,
        debug=False,
        docs_url="/docs" if settings.environment == "development" else None,
        redoc_url=None,
        openapi_url="/openapi.json" if settings.environment == "development" else None,
    )
    app.state.readiness = readiness
    app.add_middleware(RequestContextMiddleware)
    app.add_exception_handler(HTTPException, http_error)
    app.add_exception_handler(RequestValidationError, validation_error)
    app.include_router(router)
    return app
