"""Validated process configuration; never render rejected environment values."""

from pathlib import Path
from typing import Literal

from pydantic import ValidationError
from pydantic_settings import BaseSettings, SettingsConfigDict

ENV_FILE = Path(__file__).resolve().parents[1] / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_prefix="INSYNC_",
        env_file=ENV_FILE,
        extra="ignore",
        hide_input_in_errors=True,
    )
    environment: Literal["development", "test", "production"]


class ConfigurationError(RuntimeError):
    """Safe to report at startup; includes field names, never input values."""


def load_settings() -> Settings:
    try:
        return Settings()
    except ValidationError as error:
        fields = sorted(
            {"INSYNC_" + str(item["loc"][0]).upper() for item in error.errors()}
        )
        raise ConfigurationError(
            "Missing or invalid configuration: " + ", ".join(fields)
        ) from None
