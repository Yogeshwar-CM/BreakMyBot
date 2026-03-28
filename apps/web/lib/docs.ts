export const docsNavigation = [
  {
    href: "/docs/installation",
    title: "Installation",
    description: "Install BreakMyBot locally from source.",
  },
  {
    href: "/docs/quickstart",
    title: "Quickstart",
    description: "Run the CLI against a single-call AI API config.",
  },
  {
    href: "/docs/config-format",
    title: "Config format",
    description: "Understand the YAML shape used by the CLI.",
  },
  {
    href: "/docs/example-usage",
    title: "Example usage",
    description: "See a sample command, config, and report summary.",
  },
] as const;

export const cliCommand = "breakmybot test config.yaml";

export const installFromSource = String.raw`git clone https://github.com/Yogeshwar-CM/BreakMyBot.git
cd breakmybot
python3 -m venv .venv
source .venv/bin/activate
pip install -e .`;

export const sampleConfig = String.raw`endpoint:
  url: https://api.example.com/v1/score
  method: POST
  headers:
    Authorization: Bearer \${AI_API_TOKEN}

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
  - "Summarize the quarterly update in two bullets."`;

export const sampleOutput = String.raw`$ breakmybot test config.yaml

BreakMyBot 0.1.0
Config: config.yaml
Target: https://api.example.com/v1/score
Method: POST
Variable field: input.text
Iterations: 12
Mutations: paraphrase, typo, boundary_length, punctuation
Sample inputs: 4

CLI scaffold is ready.
TODO: implement request mutation, endpoint execution, schema validation, and detailed report generation.`;
