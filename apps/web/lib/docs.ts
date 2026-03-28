export const docsNavigation = [
  {
    href: "/docs/installation",
    title: "Installation",
    description: "Install BreakMyBot locally from source.",
  },
  {
    href: "/docs/provider-setup",
    title: "Provider setup",
    description: "Choose the agent provider and save the API key locally.",
  },
  {
    href: "/docs/quickstart",
    title: "Quickstart",
    description: "Run setup, launch the studio, and start your first session.",
  },
  {
    href: "/docs/local-studio",
    title: "Local studio",
    description: "Configure the target endpoint in the Postman-style local UI.",
  },
  {
    href: "/docs/example-run",
    title: "Example run",
    description: "See an example setup flow and a sample report.",
  },
] as const;

export const installFromSource = String.raw`git clone https://github.com/Yogeshwar-CM/BreakMyBot.git
cd BreakMyBot
python3 -m venv .venv
source .venv/bin/activate
pip install -e .`;

export const setupCommand = String.raw`$ breakmybot setup

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

Next: run \`breakmybot ui\` to launch the local studio.`;

export const uiCommand = String.raw`$ breakmybot ui

Launching BreakMyBot Studio at http://127.0.0.1:3020
Agent runtime: openai (gpt-4o-mini)
Press Ctrl+C to stop the studio.`;

export const sampleStudioContract = String.raw`{
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
}`;

export const sampleReport = String.raw`BreakMyBot report

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

Result
- The endpoint looked stable on clean inputs
- It broke on noisy punctuation and empty payloads
- Label output drifted across repeated runs`;
