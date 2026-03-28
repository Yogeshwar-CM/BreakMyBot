# BreakMyBot — Agent Instructions

You are helping build **BreakMyBot**.

## Product Summary

BreakMyBot is an open-source CLI for stress testing single-call AI APIs before production.

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
   The CLI is the core product. The website exists to explain, document, and drive GitHub adoption.

2. **Black-box first**
   Use only what the external API exposes.

3. **Small and useful**
   Prefer a smaller clean implementation over broad scaffolding.

4. **Concrete output**
   Reports should show failures, instability, and breakpoints with useful examples.

5. **Open-source friendly**
   Keep the repo understandable, runnable, and easy to modify locally.

## Website Direction

The website should:

- explain what BreakMyBot does
- show why it is useful
- link to GitHub
- link to installation and quickstart docs
- avoid pretending there is a hosted app

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
  cli/
  README.md
```

Remove dead SaaS-era code when it is no longer relevant.

## Implementation Priorities

1. CLI package and config flow
2. README and docs
3. Docs/marketing site
4. Request mutation and endpoint execution
5. Local report generation

## Output Style

When implementing:

- favor runnable code
- add clear TODOs where core CLI behavior is not implemented yet
- keep copy honest
- avoid overengineering
- choose the smaller shippable version when uncertain
