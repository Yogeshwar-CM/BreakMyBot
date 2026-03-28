# BreakMyBot

BreakMyBot is an open-source CLI for stress testing single-call AI APIs before production.

It is built for endpoints like scorers, classifiers, extractors, moderation APIs, structured JSON generators, and evaluators. The goal is simple: run repeated and mutated tests locally so you can catch reliability failures before real traffic does.

## What it helps find

- inconsistent outputs across repeated runs
- schema mismatches and missing fields
- malformed or invalid JSON responses
- sensitivity to small input changes
- edge-case breakdowns on short, noisy, empty, or ambiguous inputs

## What it is not for

- multi-turn chat systems
- browser automation
- chatbot UI scraping
- full agent workflows

## Installation

Requirements:

- Python 3.11+
- Node.js 20+ if you want to run the docs site locally

Install the CLI from source:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
```

## Quickstart

Copy the example config:

```bash
cp examples/config.example.yaml config.yaml
```

Update:

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

## Current CLI Output

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

## Project Layout

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
cd apps/web && npm install && npm run build
```

Keep changes scoped to the current product direction: a CLI-first tool for testing single-call AI APIs.

## Roadmap

- implement request mutation strategies
- execute repeated tests against real endpoints
- validate returned payloads against response schema hints
- generate useful failure and instability reports
- publish the CLI to PyPI when the runner is stable

## Scope Note

BreakMyBot is currently focused on single-call AI API testing. Multi-turn chatbot testing is future work.

## License

MIT. See [LICENSE](./LICENSE).
