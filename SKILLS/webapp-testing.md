---
name: webapp-testing
description: Test local web applications using a real browser via Playwright. Use when verifying UI behavior, running end-to-end tests, or checking that frontend changes work correctly in a real browser environment.
---

# Webapp Testing Skill (Playwright)

## Source
Anthropic official skill — gives Claude browser control via Playwright to interact with local apps during development.

## When to Use
- Verifying a frontend feature works end-to-end in a real browser
- Running or writing E2E tests
- Checking that UI changes didn't break existing flows
- Testing forms, navigation, and interactive components
- Validating API responses through the UI layer

## Prerequisites
```bash
npm install playwright
npx playwright install  # installs browser binaries
```

## Steps

### 1. Identify What to Test
Define the test scenario:
- **URL**: where does the flow start?
- **Actions**: what does a user do? (click, type, submit)
- **Assertions**: what should be true after the actions?

### 2. Launch Browser
```javascript
const { chromium } = require('playwright');
const browser = await chromium.launch({ headless: false }); // headless: true for CI
const page = await browser.newPage();
```

### 3. Navigate and Interact
```javascript
await page.goto('http://localhost:3000');
await page.fill('[data-testid="email"]', 'user@example.com');
await page.fill('[data-testid="password"]', 'secret');
await page.click('[data-testid="submit"]');
await page.waitForURL('**/dashboard');
```

### 4. Assert
```javascript
await expect(page.locator('h1')).toHaveText('Welcome back');
await expect(page.locator('[data-testid="user-name"]')).toBeVisible();
```

### 5. Test the Unhappy Path
Always test failure cases:
- Invalid input
- Network errors (use `page.route()` to mock)
- Empty states
- Permission-denied states

### 6. Screenshot on Failure
```javascript
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    await page.screenshot({ path: `failures/${testInfo.title}.png` });
  }
});
```

## Test Selector Priority
Prefer in this order:
1. `data-testid` attributes (most stable)
2. ARIA roles (`getByRole('button', { name: 'Submit' })`)
3. Text content (`getByText('Submit')`)
4. CSS selectors (fragile — avoid)

## Quality Gates
- [ ] Dev server running before tests execute
- [ ] Unhappy path (failure case) tested for every flow
- [ ] Selectors use `data-testid` or ARIA roles (not CSS classes)
- [ ] Screenshots captured on failure
- [ ] Tests pass in headless mode (not just headed)

## Anti-Patterns
| Anti-Pattern | Consequence |
|-------------|-------------|
| `page.waitForTimeout(2000)` | Flaky tests; use `waitForSelector` or `waitForURL` |
| CSS class selectors (`'.btn-primary'`) | Break on style changes |
| Testing only happy path | Misses most real bugs |
| Not cleaning up test data | Tests affect each other |

## References
- [Anthropic Official Skills Repo](https://github.com/anthropics/skills)
- [Playwright Docs](https://playwright.dev/docs/intro)
- [Firecrawl: Best Claude Code Skills 2026](https://www.firecrawl.dev/blog/best-claude-code-skills)
