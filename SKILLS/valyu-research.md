---
name: valyu-research
description: Connect to live web search and 36+ specialized data sources including SEC filings, PubMed, ChEMBL, ClinicalTrials.gov, FRED economic indicators, and academic publishers. Use when the task requires real-time or domain-specific data beyond the training cutoff.
---

# Valyu — Live Data Research Skill

## When to Use
- Question requires data beyond knowledge cutoff (May 2026)
- User asks about current stock prices, economic indicators, or market data
- Biomedical or clinical research queries (drug data, trials, papers)
- Financial filings or regulatory documents
- Academic paper lookup or citation
- Any task where "I don't have current data" would be the default answer

## Data Sources (36+)

### Financial & Economic
| Source | What's Available |
|--------|-----------------|
| SEC EDGAR | 10-K, 10-Q, 8-K, proxy filings |
| FRED (Federal Reserve) | 800,000+ economic time series |
| Web search | Real-time news, prices, company data |

### Biomedical
| Source | What's Available |
|--------|-----------------|
| PubMed | 35M+ biomedical abstracts |
| ChEMBL | Drug compound bioactivity data |
| ClinicalTrials.gov | Active and completed trial data |

### Academic
- CrossRef (DOI resolution)
- Semantic Scholar
- arXiv preprints

## Steps

### 1. Identify Data Need
Classify the query:
- **Factual/current**: Use web search first
- **Financial**: SEC or FRED depending on company vs. macro
- **Biomedical**: PubMed for literature, ChEMBL for compounds, ClinicalTrials for trials
- **Academic**: Semantic Scholar or arXiv

### 2. Query Construction
Be specific. Vague queries return noisy results.
```
BAD:  "tell me about cancer drugs"
GOOD: "phase 3 clinical trials for KRAS G12C inhibitors 2025-2026"
```

### 3. Source Attribution
Always cite:
- Source name and URL
- Publication date or data vintage
- Any caveats (e.g., preliminary data, not peer-reviewed)

### 4. Cross-Validation
For high-stakes queries, verify across 2+ independent sources before reporting.

## Quality Gates
- [ ] Source attributed for every factual claim
- [ ] Data vintage noted (when was this data collected/published?)
- [ ] Contradictions between sources flagged explicitly
- [ ] User warned if only one source available for critical data

## Anti-Patterns
| Bad | Good |
|-----|------|
| Citing training data for current events | Always fetch live for post-cutoff queries |
| Single source for financial decisions | Cross-validate SEC + web + FRED |
| Unsourced statistics | Every number has a source and date |

## References
- [VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills)
- [Valyu Data Platform](https://valyu.network)
