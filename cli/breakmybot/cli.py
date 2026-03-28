from __future__ import annotations

import argparse
import getpass
import shutil
import sys

from breakmybot import __version__
from breakmybot.models import PROVIDER_CATALOG, ProviderName
from breakmybot.runtime import (
    RuntimeConfigError,
    build_runtime_config,
    get_provider,
    load_runtime_summary,
    mask_secret,
    save_runtime_config,
)
from breakmybot.studio import StudioLaunchError, launch_studio, resolve_studio_path


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="breakmybot",
        description="Set up BreakMyBot and launch the local agent studio.",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    setup_parser = subparsers.add_parser(
        "setup",
        help="Choose your AI provider and save the local agent runtime config.",
    )
    setup_parser.add_argument(
        "--provider",
        choices=sorted(PROVIDER_CATALOG.keys()),
        help="AI provider to use for agent reasoning.",
    )
    setup_parser.add_argument(
        "--api-key",
        help="Provider API key. If omitted, BreakMyBot will prompt securely.",
    )
    setup_parser.add_argument(
        "--model",
        help="Override the default model for the selected provider.",
    )
    setup_parser.add_argument(
        "--base-url",
        help="Override the provider base URL.",
    )
    setup_parser.add_argument(
        "--config-home",
        help="Override the local BreakMyBot config directory.",
    )
    setup_parser.set_defaults(handler=run_setup)

    ui_parser = subparsers.add_parser(
        "ui",
        help="Launch the local BreakMyBot Studio UI.",
    )
    ui_parser.add_argument(
        "--host",
        default="127.0.0.1",
        help="Host to bind the local studio to. Defaults to 127.0.0.1.",
    )
    ui_parser.add_argument(
        "--port",
        type=int,
        default=3020,
        help="Port to bind the local studio to. Defaults to 3020.",
    )
    ui_parser.add_argument(
        "--config-home",
        help="Override the local BreakMyBot config directory.",
    )
    ui_parser.add_argument(
        "--no-open",
        action="store_true",
        help="Do not try to open a browser automatically.",
    )
    ui_parser.add_argument(
        "--skip-install",
        action="store_true",
        help="Skip npm install even if studio dependencies are missing.",
    )
    ui_parser.set_defaults(handler=run_ui)

    doctor_parser = subparsers.add_parser(
        "doctor",
        help="Inspect local setup status for the provider runtime and studio app.",
    )
    doctor_parser.add_argument(
        "--config-home",
        help="Override the local BreakMyBot config directory.",
    )
    doctor_parser.set_defaults(handler=run_doctor)

    return parser


def run_setup(args: argparse.Namespace) -> int:
    try:
        provider = _resolve_provider(args.provider)
        provider_entry = get_provider(provider)
        api_key = (args.api_key or "").strip() or getpass.getpass(
            f"{provider_entry.display_name} API key: "
        ).strip()
        if not api_key:
            raise RuntimeConfigError("API key cannot be empty.")

        runtime_config = build_runtime_config(
            provider=provider,
            api_key=api_key,
            model=args.model,
            base_url=args.base_url,
        )
        config_path = save_runtime_config(runtime_config, args.config_home)
    except (RuntimeConfigError, KeyboardInterrupt) as error:
        print(f"Setup failed: {error}", file=sys.stderr)
        return 2

    print(f"BreakMyBot {__version__}")
    print("Local agent runtime configured.")
    print(f"Provider: {provider_entry.display_name}")
    print(f"Model: {runtime_config.model}")
    print(f"Base URL: {runtime_config.base_url}")
    print(f"API key: {mask_secret(runtime_config.api_key)}")
    print(f"Config path: {config_path}")
    print()
    print("Next: run `breakmybot ui` to launch the local studio.")
    return 0


def run_ui(args: argparse.Namespace) -> int:
    try:
        return launch_studio(
            config_home=args.config_home,
            host=args.host,
            port=args.port,
            open_browser=not args.no_open,
            install_if_needed=not args.skip_install,
        )
    except (RuntimeConfigError, StudioLaunchError) as error:
        print(f"Unable to launch studio: {error}", file=sys.stderr)
        return 2


def run_doctor(args: argparse.Namespace) -> int:
    summary = load_runtime_summary(args.config_home)
    studio_path = resolve_studio_path()

    print(f"BreakMyBot {__version__}")
    print(f"Python: {sys.executable}")
    print(f"npm: {shutil.which('npm') or 'not found'}")
    print(f"Studio path: {studio_path}")
    print(f"Provider config path: {summary.config_path}")

    if summary.configured:
        provider = get_provider(summary.provider)
        print(
            f"Provider runtime: configured ({provider.display_name}, {summary.model})"
        )
    else:
        print("Provider runtime: missing")

    if studio_path.exists():
        print("Studio app: found")
    else:
        print("Studio app: missing")

    return 0


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    handler = getattr(args, "handler", None)
    if handler is None:
        parser.print_help()
        return 1
    return handler(args)


def _resolve_provider(provider_arg: str | None) -> ProviderName:
    if provider_arg:
        return provider_arg  # type: ignore[return-value]

    options = list(PROVIDER_CATALOG.values())
    print("Choose the provider BreakMyBot should use for agent reasoning:")
    for index, option in enumerate(options, start=1):
        print(
            f"  {index}. {option.display_name} ({option.default_model})"
        )

    while True:
        choice = input("Provider number: ").strip()
        if not choice.isdigit():
            print("Enter a valid number.", file=sys.stderr)
            continue

        index = int(choice)
        if 1 <= index <= len(options):
            return options[index - 1].name

        print("Provider number is out of range.", file=sys.stderr)
