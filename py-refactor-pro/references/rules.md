# Refactoring Rules Reference

## Complexity Rules

| Rule ID | Name | Trigger | Recommendation |
|---------|------|---------|----------------|
| C001 | High Function Complexity | Cyclomatic Complexity > 10 | Extract sub-methods or simplify logic. |
| C002 | Large Class | Methods > 15 | Split into smaller classes (SRP). |
| C003 | Deep Nesting | Nesting Levels > 4 | Return early or extract methods. |

## Security Rules

| Rule ID | Name | Trigger | Recommendation |
|---------|------|---------|----------------|
| S001 | No Eval | `eval()` usage | Use `ast.literal_eval` or specific parsers. |
| S002 | No Exec | `exec()` usage | Avoid dynamic code execution. |
| S003 | Secrets | Hardcoded passwords | Use `os.environ.get()`. |

## Style Rules (PEP 8)

| Rule ID | Name | Trigger | Recommendation |
|---------|------|---------|----------------|
| D001 | Missing Docstring | Public function missing docstring | Add Google or NumPy style docstrings. |
| N001 | Naming Convention | Non-snake_case variables | Rename to follow `snake_case`. |
