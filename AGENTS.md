# BreakMyBot — Agent Instructions

You are helping build **BreakMyBot**.

## Product Summary

BreakMyBot is an open-source CLI that asks the user for an AI provider, stores
that provider config locally, launches a separate local studio UI, and uses an
agent to stress test single-call AI APIs before production.

Primary promise:

> Stress test your AI API before production.

## Product Scope

BreakMyBot helps developers find:

- inconsistent outputs
- schema failures
- unstable results
- malformed responses
- sensitivity to input changes
- edge-case breakdowns

It works best for APIs such as:

- scorers
- classifiers
- extractors
- moderation endpoints
- structured JSON generators
- evaluator/judge endpoints

Core flow:

1. User installs `breakmybot`
2. User runs `breakmybot setup`
3. User chooses provider and adds the provider API key
4. User runs `breakmybot ui`
5. Local studio opens
6. User enters the target endpoint, auth, request format, and optional response contract
7. BreakMyBot's agent plans and runs probes
8. Local report shows failures and breakpoints

## Non-Goals

Do not position or build BreakMyBot as:

- a hosted SaaS product
- a dashboard platform
- a chatbot testing suite
- a browser automation tool
- a full agent-system evaluator
- an enterprise governance product

Do not build:

- multi-turn chat simulation
- UI scraping
- browser automation
- billing
- auth/account systems
- team management
- hosted-only flows

## Product Principles

1. **CLI-first**
   The CLI is the entrypoint. It handles provider setup and launches the local studio.

2. **Local-first**
   The testing UI is a separate local app, not a hosted dashboard.

3. **Black-box first**
   Use only what the external API exposes.

4. **Agent-driven**
   The testing logic should use the configured provider to think through attacks, not just replay a fixed mutation list.

5. **Concrete output**
   Reports should show failures, instability, and breakpoints with useful examples.

6. **Open-source friendly**
   Keep the repo understandable, runnable, and easy to modify locally.

## Website Direction

The website should:

- explain what BreakMyBot does
- show why it is useful
- link to GitHub
- link to installation, provider setup, and local studio docs
- avoid pretending there is a hosted dashboard
- clearly explain that the actual testing flow happens in the separate local studio

Tone:

- technical
- clear
- confident
- not hypey

## Repo Direction

Prefer a structure like:

```text
/
  apps/
    web/
    studio/
  cli/
  README.md
```

Remove dead SaaS-era code when it is no longer relevant.

## Implementation Priorities

1. CLI setup flow
2. Local studio
3. Agent planning and endpoint execution
4. Local report generation
5. Docs/marketing site

## Output Style

When implementing:

- favor runnable code
- add clear TODOs where core CLI behavior is not implemented yet
- keep copy honest
- avoid overengineering
- choose the smaller shippable version when uncertain
