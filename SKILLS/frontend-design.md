---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use when building web components, pages, or applications. Generates creative, polished code that avoids generic AI aesthetics.
---

# Frontend Design Skill

## When to Use
- User asks to build a UI component, page, or web application
- Any task involving HTML, CSS, React, Vue, Svelte, or similar
- Redesigning or improving existing visual interfaces

## Philosophy
AI-generated frontends default to bland, template-looking output. This skill enforces a design-first mindset before any code is written.

## Steps

### 1. Establish Design Intent
Before writing code, define:
- **Visual tone**: bold / minimal / editorial / playful / enterprise
- **Color system**: primary, accent, neutral, background — with contrast ratios
- **Typography**: heading/body pairing, scale, weight hierarchy
- **Spacing rhythm**: 4px or 8px base grid

### 2. Component Architecture
- Prefer composition over configuration
- Extract design tokens as CSS custom properties or theme variables
- Separate layout (structure) from skin (color/typography)

### 3. Quality Gates
- [ ] No default `blue #0000ff` or generic Bootstrap-looking output
- [ ] Responsive from 320px to 1440px+
- [ ] WCAG AA contrast on all text
- [ ] Hover/focus/active states on all interactive elements
- [ ] Dark mode considered (even if not implemented)

### 4. Anti-Patterns to Avoid
| Bad | Good |
|-----|------|
| `color: blue` | Named design token `var(--color-accent)` |
| `margin: 10px` | Grid-aligned `margin: var(--space-2)` |
| Generic card shadows | Intentional elevation system |
| Default font stack | Deliberate type pairing |

## Output Format
Always deliver:
1. Full working code (not pseudocode)
2. Inline design rationale comments where choices aren't obvious
3. Preview description: "This feels like ___" to communicate aesthetic intent

## References
- [Anthropic Official Skill — anthropics/skills](https://github.com/anthropics/skills)
- [277,000+ installs as of March 2026 — most-installed Claude Code skill]
