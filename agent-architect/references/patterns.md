# Agent Architecture Patterns

## Standard Agent Pattern (SAP)

The Agent Architect skill scaffolds agents following the Standard Agent Pattern:

### 1. Configuration (`config.json`)
Separates runtime configuration (model, tools) from logic. This allows dynamic adjustments without code changes.

### 2. Entry Point (`main.py`)
A uniform interface class that handles:
- Initialization
- Input processing
- Tool execution loop
- Response generation

### 3. Documentation (`README.md`)
Every agent must have self-contained documentation explaining its specific purpose and instructions.

## Integration
These agents are designed to be pluggable. The `opencode` main system can import the `Agent` class from any sub-folder in `agents/` and execute it as a tool.
