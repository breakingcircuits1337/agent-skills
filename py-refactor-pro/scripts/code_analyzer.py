#!/usr/bin/env python3
"""
Portable Code Analyzer for py-refactor-pro skill.
Combines logic from Big Pickle's analyzer to provide metrics and suggestions.
"""

import ast
import os
import sys
import json
from pathlib import Path
from dataclasses import dataclass, field, asdict
from typing import List, Dict, Any, Optional

# --- Models ---

@dataclass
class Vulnerability:
    type: str
    description: str
    line: int
    severity: str
    recommendation: str

@dataclass
class FunctionMetrics:
    name: str
    line: int
    complexity: int
    docstring: bool
    args: List[str]

@dataclass
class FileMetrics:
    file_path: str
    lines_of_code: int
    complexity: int
    maintainability: float
    functions: List[FunctionMetrics]
    vulnerabilities: List[Vulnerability]
    score: float

# --- Analyzer Logic ---

class CodeAnalyzer:
    def analyze_file(self, file_path: Path) -> FileMetrics:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            tree = ast.parse(content)
            lines = content.splitlines()
            loc = len([l for l in lines if l.strip() and not l.strip().startswith('#')])
            
            functions = self._analyze_functions(tree)
            total_complexity = sum(f.complexity for f in functions)
            vulnerabilities = self._scan_vulnerabilities(content)
            
            maintainability = self._calculate_mi(loc, total_complexity, len(functions))
            score = max(0, 100 - (total_complexity * 0.5) - (len(vulnerabilities) * 5))

            return FileMetrics(
                file_path=str(file_path),
                lines_of_code=loc,
                complexity=total_complexity,
                maintainability=round(maintainability, 2),
                functions=functions,
                vulnerabilities=vulnerabilities,
                score=round(score, 2)
            )
        except Exception as e:
            return FileMetrics(str(file_path), 0, 0, 0.0, [], [], 0.0)

    def _analyze_functions(self, tree: ast.AST) -> List[FunctionMetrics]:
        funcs = []
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                complexity = self._calculate_complexity(node)
                funcs.append(FunctionMetrics(
                    name=node.name,
                    line=node.lineno,
                    complexity=complexity,
                    docstring=ast.get_docstring(node) is not None,
                    args=[a.arg for a in node.args.args]
                ))
        return funcs

    def _calculate_complexity(self, node: ast.AST) -> int:
        complexity = 1
        for child in ast.walk(node):
            if isinstance(child, (ast.If, ast.While, ast.For, ast.AsyncFor, ast.ExceptHandler)):
                complexity += 1
            elif isinstance(child, ast.BoolOp):
                complexity += len(child.values) - 1
        return complexity

    def _scan_vulnerabilities(self, content: str) -> List[Vulnerability]:
        vulns = []
        lines = content.splitlines()
        for i, line in enumerate(lines, 1):
            if 'eval(' in line:
                vulns.append(Vulnerability('eval_usage', 'Use of eval() detected', i, 'HIGH', 'Avoid eval()'))
            if 'exec(' in line:
                vulns.append(Vulnerability('exec_usage', 'Use of exec() detected', i, 'HIGH', 'Avoid exec()'))
            if 'password =' in line.replace(' ', '') or "secret =" in line.replace(' ', ''):
                 vulns.append(Vulnerability('hardcoded_secret', 'Potential hardcoded secret', i, 'CRITICAL', 'Use env vars'))
        return vulns

    def _calculate_mi(self, loc: int, complexity: int, num_funcs: int) -> float:
        if loc == 0: return 100.0
        # Simplified Maintainability Index
        # MI = 171 - 5.2 * ln(avg_vol) - 0.23 * avg_cyclomatic - 16.2 * ln(loc)
        # This is a rough approximation for the script
        return max(0, 171 - 5.2 * (loc * 0.1) - 0.23 * complexity - 16.2 * (loc ** 0.5))

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 code_analyzer.py <path_to_file_or_dir>")
        sys.exit(1)
        
    path = Path(sys.argv[1])
    analyzer = CodeAnalyzer()
    
    results = []
    if path.is_file():
        results.append(asdict(analyzer.analyze_file(path)))
    else:
        for file_path in path.rglob("*.py"):
            results.append(asdict(analyzer.analyze_file(file_path)))
            
    print(json.dumps(results, indent=2))

if __name__ == "__main__":
    main()
