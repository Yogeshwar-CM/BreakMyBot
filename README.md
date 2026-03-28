<div align="center">
  <h1>BreakMyBot</h1>
  <p><strong>Stress test your AI API before production.</strong></p>
  <p>
    An open-source CLI for finding instability, schema failures, malformed
    responses, and edge-case breakdowns in single-call AI endpoints.
  </p>
  <p>
    <a href="https://www.breakmybot.com">Website</a>
    ·
    <a href="https://www.breakmybot.com/docs/quickstart">Quickstart</a>
    ·
    <a href="https://github.com/Yogeshwar-CM/BreakMyBot/issues">Issues</a>
  </p>
  <p>
    <img alt="CI" src="https://img.shields.io/github/actions/workflow/status/Yogeshwar-CM/BreakMyBot/ci.yml?branch=main&label=ci" />
    <img alt="License" src="https://img.shields.io/github/license/Yogeshwar-CM/BreakMyBot" />
    <img alt="Python" src="https://img.shields.io/badge/python-3.11%2B-0f172a" />
    <img alt="Status" src="https://img.shields.io/badge/status-CLI%20scaffold-334155" />
  </p>
</div>

## What is BreakMyBot?

BreakMyBot is a CLI-first developer tool for stress testing single-call AI APIs.

You point it at an external endpoint, define a request template, describe the
response shape you expect, and run repeated or mutated tests locally to expose
where the API becomes unreliable.

It is built for endpoints like:

- scorers
- classifiers
- extractors
- moderation APIs
- structured JSON generators
- evaluators and judges

## What does it help find?

- inconsistent outputs across repeated runs
- schema mismatches and missing fields
- malformed or invalid JSON responses
- sensitivity to small input changes
- edge-case breakdowns on short, noisy, empty, or ambiguous inputs

## What is it not for?

- multi-turn chat systems
- browser automation
- chatbot UI scraping
- full agent workflows

## How it works

1. Define a YAML config with the endpoint, headers, request template, and sample inputs.
2. Run `breakmybot test config.yaml`.
3. Inspect the failures, instability, and schema issues before production traffic hits the API.

## Quickstart

Requirements:

- Python 3.11+
- Node.js 20+ only if you want to run the docs site locally

Install the CLI from source:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
```

Copy the example config:

```bash
cp examples/config.example.yaml config.yaml
```

Update these fields in `config.yaml`:

- `endpoint.url`
- `endpoint.headers`
- `request.template`
- `request.variable`

Run the CLI:

```bash
breakmybot test config.yaml
```

## Example Config

```yaml
endpoint:
  url: https://api.example.com/v1/score
  method: POST
  headers:
    Authorization: Bearer ${AI_API_TOKEN}

request:
  template:
    input:
      text: "{{text}}"
  variable: input.text

expectations:
  response_schema:
    type: object
    required:
      - label
      - score

run:
  iterations: 12
  mutations:
    - paraphrase
    - typo
    - boundary_length
    - punctuation

sample_inputs:
  - "This product launch copy sounds safe and polished."
  - "worst experience ever???"
  - ""
  - "Summarize the quarterly update in two bullets."
```

## Current Output

```text
$ breakmybot test config.yaml

BreakMyBot 0.1.0
Config: config.yaml
Target: https://api.example.com/v1/score
Method: POST
Variable field: input.text
Iterations: 12
Mutations: paraphrase, typo, boundary_length, punctuation
Sample inputs: 4

CLI scaffold is ready.
TODO: implement request mutation, endpoint execution, schema validation, and detailed report generation.
```

## Current Status

The repo is honest about its state.

Today it includes:

- the Python CLI entrypoint
- YAML config loading and validation
- example config and local smoke path
- docs and marketing site
- GitHub CI and basic OSS repo setup

Not implemented yet:

- request mutation engine
- real endpoint execution
- response validation against returned payloads
- report generation with concrete failing cases

## Local Development

Run the CLI smoke path:

```bash
.venv/bin/python -m breakmybot test examples/config.example.yaml
```

Run the docs site:

```bash
cd apps/web
npm install
npm run dev
```

Build the docs site:

```bash
cd apps/web
npm run build
```

## Repository Layout

```text
.
|-- apps/web              # Next.js docs and marketing site
|-- cli/breakmybot        # Python CLI package
|-- examples              # Sample configs
|-- .github               # CI, issue templates, PR template
|-- LICENSE
|-- README.md
`-- pyproject.toml
```

## Contributing

Issues and pull requests are welcome.

Before opening a PR, run:

```bash
pip install -e .
python -m breakmybot test examples/config.example.yaml
cd apps/web
npm install
npm run build
```

Keep changes aligned with the current product direction: a CLI-first tool for
testing single-call AI APIs.

## Roadmap

- implement request mutation strategies
- execute repeated tests against real endpoints
- validate returned payloads against response schema hints
- generate useful failure and instability reports
- publish the CLI to PyPI when the runner is stable

## License

MIT. See [LICENSE](./LICENSE).
