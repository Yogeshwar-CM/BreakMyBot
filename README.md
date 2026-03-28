<div align="center">
  <h1>BreakMyBot</h1>
  <p><strong>Let an AI agent break your AI API before production does.</strong></p>
  <p>
    BreakMyBot is an open-source CLI that asks for your AI provider, launches a
    separate local studio, and uses adaptive planning to stress test
    single-call AI endpoints.
  </p>
  <p>
    <a href="https://www.breakmybot.com">Website</a>
    ·
    <a href="https://www.breakmybot.com/docs/quickstart">Quickstart</a>
    ·
    <a href="https://www.breakmybot.com/docs/local-studio">Local Studio</a>
    ·
    <a href="https://github.com/Yogeshwar-CM/BreakMyBot/issues">Issues</a>
  </p>
  <p>
    <img alt="CI" src="https://img.shields.io/github/actions/workflow/status/Yogeshwar-CM/BreakMyBot/ci.yml?branch=main&label=ci" />
    <img alt="License" src="https://img.shields.io/github/license/Yogeshwar-CM/BreakMyBot" />
    <img alt="Python" src="https://img.shields.io/badge/python-3.11%2B-0f172a" />
    <img alt="Status" src="https://img.shields.io/badge/status-agent%20studio%20scaffold-334155" />
  </p>
</div>

## What is BreakMyBot?

BreakMyBot is a local-first developer tool for testing single-call AI APIs.

The flow is:

1. Install `breakmybot`
2. Choose the AI provider BreakMyBot should use for reasoning
3. Launch a separate local studio UI
4. Enter the target endpoint, auth, request shape, and optional response shape
5. Let the agent plan probes, run them, and report where the endpoint breaks

BreakMyBot works well for:

- scorers
- classifiers
- extractors
- moderation endpoints
- structured JSON generators
- evaluators and judges

It is not for:

- multi-turn chat systems
- browser automation
- chatbot UI scraping
- full agent workflows

## Why it exists

AI APIs often look fine in a few manual requests and still fail when inputs get
noisy, malformed, ambiguous, or only slightly different.

BreakMyBot is built to catch things like:

- malformed JSON responses
- schema mismatches and missing fields
- retry instability
- output drift across small wording changes
- edge-case breakdowns on empty, noisy, or boundary inputs

## Quickstart

Requirements:

- Python 3.11+
- Node.js 20+
- one provider key for BreakMyBot itself: OpenAI, Anthropic, or Groq

Install from source:

```bash
git clone https://github.com/Yogeshwar-CM/BreakMyBot.git
cd BreakMyBot
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
```

Choose the provider BreakMyBot should use for agent reasoning:

```bash
breakmybot setup
```

Launch the separate local studio:

```bash
breakmybot ui
```

The local studio runs separately from the public docs site and is where you:

- enter the target endpoint URL
- add target auth headers
- define the request template and variable input path
- optionally add a response schema
- run the agent and inspect the report

## Example setup flow

```text
$ breakmybot setup

Choose the provider BreakMyBot should use for agent reasoning:
  1. OpenAI (gpt-4o-mini)
  2. Anthropic (claude-3-5-haiku-latest)
  3. Groq (llama-3.3-70b-versatile)

Provider number: 1
OpenAI API key: ********************

BreakMyBot 0.1.0
Local agent runtime configured.
Provider: OpenAI
Model: gpt-4o-mini
Base URL: https://api.openai.com/v1

Next: run `breakmybot ui` to launch the local studio.
```

## Example target contract

```json
{
  "endpointUrl": "https://api.example.com/v1/moderate",
  "method": "POST",
  "headers": {
    "Authorization": "Bearer target-api-key"
  },
  "requestTemplate": {
    "input": {
      "text": "{{input}}"
    }
  },
  "variablePath": "input.text",
  "responseSchema": {
    "type": "object",
    "required": ["label", "score"]
  }
}
```

## Example report

```text
BreakMyBot report

Provider: openai / gpt-4o-mini
Mode: live plan
Target: POST https://api.example.com/v1/moderate

Attack families
- semantic drift
- schema pressure
- malformed structure
- retry instability

Summary
- 6 cases executed
- 2 malformed JSON responses
- 1 schema mismatch
- 2 retry drift signals
```

## Current status

This repo already includes:

- `breakmybot setup` for provider selection and local API key storage
- `breakmybot ui` for launching the separate local studio app
- a Next.js local studio for configuring the target endpoint
- provider-backed planning with OpenAI, Anthropic, and Groq
- target probing, basic schema checks, and retry drift detection
- a separate Next.js docs and marketing site

Still TODO:

- deeper report analysis and richer diffing
- stronger secret handling beyond local file permissions
- packaged distribution for the local studio outside source installs
- broader provider coverage and more advanced validation layers

## Local development

Install the CLI in editable mode:

```bash
.venv/bin/pip install -e .
```

Smoke-check the CLI:

```bash
.venv/bin/python -m breakmybot doctor --config-home /tmp/breakmybot-ci
```

Run the docs site:

```bash
cd apps/web
npm install
npm run dev
```

Run the local studio directly:

```bash
cd apps/studio
npm install
npm run dev
```

## Repository layout

```text
.
|-- apps/web              # Public docs and marketing site
|-- apps/studio           # Separate local studio UI
|-- cli/breakmybot        # Python CLI
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
python -m breakmybot doctor --config-home /tmp/breakmybot-ci
cd apps/web && npm install && npm run build
cd ../studio && npm install && npm run build
```

Keep changes aligned with the current product direction:

- CLI-first
- local-first
- provider-backed agent planning
- single-call AI endpoint testing

## License

MIT. See [LICENSE](./LICENSE).
