from typing import Literal

from fastapi import APIRouter, Request, Response
from pydantic import BaseModel

router = APIRouter(tags=["operations"])


class HealthResponse(BaseModel):
    status: Literal["alive"] = "alive"


class ReadinessResponse(BaseModel):
    status: Literal["ready", "not_ready"]
    scope: Literal["application"] = "application"
    checks: dict[str, str]


@router.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse()


@router.get(
    "/ready",
    response_model=ReadinessResponse,
    responses={503: {"model": ReadinessResponse}},
)
async def ready(request: Request, response: Response):
    response.headers["Cache-Control"] = "no-store"
    service = request.app.state.readiness
    if not service.started:
        response.status_code = 503
    return ReadinessResponse(
        status="ready" if service.started else "not_ready", checks=service.snapshot()
    )
