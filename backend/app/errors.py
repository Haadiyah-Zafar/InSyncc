"""Public error envelopes deliberately exclude exception/input contents."""

from http import HTTPStatus

from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException


def error_response(status: int, code: str, message: str, request_id: str):
    return JSONResponse(
        status_code=status,
        headers={"Cache-Control": "no-store"},
        content={"error": {"code": code, "message": message, "request_id": request_id}},
    )


async def http_error(request: Request, error: HTTPException):
    try:
        message = HTTPStatus(error.status_code).phrase
    except ValueError:
        message = "Request failed"
    response = error_response(
        error.status_code, "http_error", message, request.state.request_id
    )
    # Preserve protocol headers such as Allow/WWW-Authenticate supplied by the server.
    if error.headers:
        response.headers.update(error.headers)
    return response


async def validation_error(request: Request, error: RequestValidationError):
    return error_response(
        422, "validation_error", "Invalid request.", request.state.request_id
    )
