"""Process readiness only; external service checks arrive with their integrations."""

from dataclasses import dataclass


@dataclass
class Readiness:
    started: bool = False

    def snapshot(self) -> dict[str, str]:
        return {"application": "ready" if self.started else "not_ready"}
