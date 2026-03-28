from __future__ import annotations

import argparse
import sys
from pathlib import Path

from breakmybot import __version__
from breakmybot.config import ConfigError, load_config


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="breakmybot",
        description="Stress test single-call AI APIs before production.",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    test_parser = subparsers.add_parser(
        "test",
        help="Load a BreakMyBot config and prepare a stress-test run.",
    )
    test_parser.add_argument(
        "config",
        type=Path,
        help="Path to a BreakMyBot YAML config file.",
    )
    test_parser.set_defaults(handler=run_test)

    return parser


def run_test(args: argparse.Namespace) -> int:
    try:
        config = load_config(args.config)
    except ConfigError as error:
        print(f"Configuration error: {error}", file=sys.stderr)
        return 2

    print(f"BreakMyBot {__version__}")
    print(f"Config: {args.config}")
    print(f"Target: {config.endpoint.url}")
    print(f"Method: {config.endpoint.method}")
    print(f"Variable field: {config.request.variable}")
    print(f"Iterations: {config.run.iterations}")

    if config.run.mutations:
        print(f"Mutations: {', '.join(config.run.mutations)}")
    else:
        print("Mutations: none configured")

    print(f"Sample inputs: {len(config.sample_inputs)}")
    print()
    print("CLI scaffold is ready.")
    print(
        "TODO: implement request mutation, endpoint execution, schema validation, "
        "and detailed report generation."
    )
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    handler = getattr(args, "handler", None)
    if handler is None:
        parser.print_help()
        return 1
    return handler(args)
