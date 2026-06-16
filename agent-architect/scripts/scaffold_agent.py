#!/usr/bin/env python3
"""
Agent Scaffold Generator
Creates the directory structure and boilerplate for a new AI Agent.
"""

import os
import sys
import argparse
from pathlib import Path

AGENT_TEMPLATE = """
import os
import sys
from typing import Dict, Any

class {class_name}:
    def __init__(self):
        self.name = "{agent_name}"
        self.instructions = """{instructions}"""
        
    def run(self, input_text: str) -> str:
        # Implement agent logic here
        print(f"[{agent_name}] Processing: {{input_text}}")
        return "I am ready."

if __name__ == "__main__":
    agent = {class_name}()
    if len(sys.argv) > 1:
        print(agent.run(sys.argv[1]))
    else:
        print(f"Agent {agent_name} initialized.")
"""

CONFIG_TEMPLATE = """
{
    "name": "{agent_name}",
    "model": "{model}",
    "tools": [],
    "memory_persistence": true
}
"""

README_TEMPLATE = """
# {agent_name}

{instructions}

## Usage
```bash
python3 main.py "your command"
```
"""

def create_agent(name, instructions, model, output_dir):
    path = Path(output_dir) / name
    path.mkdir(parents=True, exist_ok=True)
    
    class_name = "".join(x.title() for x in name.split('_')) + "Agent"
    
    # Write main.py
    with open(path / "main.py", "w") as f:
        f.write(AGENT_TEMPLATE.format(
            class_name=class_name,
            agent_name=name,
            instructions=instructions
        ))
        
    # Write config.json
    with open(path / "config.json", "w") as f:
        f.write(CONFIG_TEMPLATE.format(
            agent_name=name,
            model=model
        ))
        
    # Write README.md
    with open(path / "README.md", "w") as f:
        f.write(README_TEMPLATE.format(
            agent_name=name,
            instructions=instructions
        ))
        
    print(f"✅ Agent '{name}' created at {path}")

def main():
    parser = argparse.ArgumentParser(description="Scaffold a new AI Agent")
    parser.add_argument("name", help="Name of the agent (snake_case)")
    parser.add_argument("--instructions", default="You are a helpful assistant.", help="System prompt")
    parser.add_argument("--model", default="gemini-2.5-flash", help="Model ID")
    parser.add_argument("--out", default="agents", help="Output directory")
    
    args = parser.parse_args()
    create_agent(args.name, args.instructions, args.model, args.out)

if __name__ == "__main__":
    main()
