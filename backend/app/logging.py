"""Configure only the application's logger; leave server/root logging alone."""

import logging


def configure_logging() -> None:
    logger = logging.getLogger("insync")
    if not logger.handlers:
        handler = logging.StreamHandler()
        handler.setFormatter(logging.Formatter("%(levelname)s %(name)s %(message)s"))
        logger.addHandler(handler)
    logger.setLevel(logging.INFO)
