#!/bin/bash
# Continuous Learning v2 - Simplified Observation Hook

set -e

CONFIG_DIR="${HOME}/.claude/homunculus"
OBSERVATIONS_FILE="${CONFIG_DIR}/observations.jsonl"

# Ensure directory exists
mkdir -p "$CONFIG_DIR"

# Read JSON from stdin
INPUT_JSON=$(cat)

# Exit if no input
if [ -z "$INPUT_JSON" ]; then
  exit 0
fi

# Simple observation - just log that a tool was used
timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
echo "{\"timestamp\":\"$timestamp\",\"event\":\"tool_use\",\"raw_input_length\":${#INPUT_JSON}}" >> "$OBSERVATIONS_FILE"

exit 0