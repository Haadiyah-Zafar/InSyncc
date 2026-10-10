"""Verify executable versions against repository pins without network requests."""

import json
import shutil
import subprocess
import sys
import tomllib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> int:
    package = json.loads((ROOT / "package.json").read_text())
    backend = tomllib.loads((ROOT / "backend/pyproject.toml").read_text())
    expected = {
        "node": (ROOT / ".node-version").read_text().strip(),
        "npm": package["engines"]["npm"],
        "uv": backend["tool"]["uv"]["required-version"].removeprefix("=="),
    }
    python_pin = (ROOT / ".python-version").read_text().strip()
    errors = []
    if package["engines"]["node"] != expected["node"]:
        errors.append("Node pins disagree in package.json and .node-version")
    if package["packageManager"] != f"npm@{expected['npm']}":
        errors.append("npm pins disagree in package.json")
    if backend["project"]["requires-python"] != f"=={python_pin}":
        errors.append("Python pins disagree in pyproject.toml and .python-version")
    actual_python = ".".join(map(str, sys.version_info[:3]))
    if actual_python != python_pin:
        errors.append(f"Python: expected {python_pin}, found {actual_python}")
    for name, version in expected.items():
        executable = shutil.which(name)
        if executable is None:
            errors.append(f"{name}: missing from PATH (required {version})")
            continue
        try:
            result = subprocess.run(
                [executable, "--version"],
                check=True,
                capture_output=True,
                text=True,
                timeout=15,
            )
            actual = result.stdout.strip().split()[0 if name != "uv" else 1]
            actual = actual.removeprefix("v")
            if actual != version:
                errors.append(f"{name}: expected {version}, found {actual}")
        except (OSError, subprocess.SubprocessError, IndexError) as error:
            errors.append(f"{name}: version check failed ({error})")
    if errors:
        print("Toolchain check failed:\n- " + "\n- ".join(errors), file=sys.stderr)
        return 1
    print(
        f"Toolchain verified: Python {python_pin}; "
        + "; ".join(f"{name} {version}" for name, version in expected.items())
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
