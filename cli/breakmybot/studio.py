from __future__ import annotations

import os
import shutil
import subprocess
import sys
import webbrowser
from pathlib import Path

from breakmybot.runtime import load_runtime_config, resolve_runtime_config_path


class StudioLaunchError(RuntimeError):
    pass


def resolve_repo_root() -> Path:
    return Path(__file__).resolve().parents[2]


def resolve_studio_path() -> Path:
    return resolve_repo_root() / "apps" / "studio"


def launch_studio(
    config_home: str | None,
    host: str,
    port: int,
    open_browser: bool,
    install_if_needed: bool,
) -> int:
    runtime_config = load_runtime_config(config_home)
    studio_path = resolve_studio_path()

    if not studio_path.exists():
        raise StudioLaunchError(f"Local studio app was not found at {studio_path}.")

    npm = shutil.which("npm")
    if npm is None:
        raise StudioLaunchError("npm was not found on PATH. Install Node.js and npm first.")

    if install_if_needed and not (studio_path / "node_modules").exists():
        install = subprocess.run(
            [npm, "install"],
            cwd=studio_path,
            check=False,
        )
        if install.returncode != 0:
            raise StudioLaunchError("npm install failed for the local studio app.")

    url = f"http://{host}:{port}"
    env = os.environ.copy()
    env["BREAKMYBOT_CONFIG_PATH"] = str(resolve_runtime_config_path(config_home))
    env["BREAKMYBOT_PROVIDER_NAME"] = runtime_config.provider
    env["BREAKMYBOT_PROVIDER_MODEL"] = runtime_config.model

    print(f"Launching BreakMyBot Studio at {url}")
    print(
        f"Agent runtime: {runtime_config.provider} ({runtime_config.model})"
    )
    print("Press Ctrl+C to stop the studio.")

    if open_browser:
        try:
            webbrowser.open(url)
        except Exception:
            print(f"Unable to open a browser automatically. Visit {url} manually.")

    command = [npm, "run", "dev", "--", "--hostname", host, "--port", str(port)]
    return subprocess.run(command, cwd=studio_path, env=env, check=False).returncode
