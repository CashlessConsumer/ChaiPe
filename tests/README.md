# ChaiPe Testing Strategy

## Overview

ChaiPe follows a comprehensive testing strategy with three layers of testing:

1. **Unit Tests** - Test individual functions and classes in isolation
2. **Integration Tests** - Test interactions between components
3. **End-to-End (E2E) Tests** - Test complete user journeys in real browsers

## Test Structure

```
tests/
├── setup.js              # Global test setup and mocks
├── unit/                 # Unit tests
│   ├── qrcode.test.js    # QR code generation tests
│   ├── core.test.js      # ChaiPeCore class tests
│   ├── core-coverage.test.js  # Additional coverage tests for core
│   └── index.test.js    # Main entry point tests
├── integration/          # Integration tests
│   ├── payment-flow.test.js  # Payment flow integration tests
│   └── qrcode-integration.test.js  # QR code integration tests
├── performance/          # Performance tests
│   └── qrcode-performance.test.js  # QR code performance benchmarks
└── e2e/                 # E2E tests (Playwright)
    └── payment-journey.spec.js  # Complete user journey tests
```

## Coverage Requirements

- **Minimum Coverage**: 90% for all metrics (branches, functions, lines, statements)
- **Critical Files**: 90% coverage required for:
  - `src/lib/core.js`
  - `src/lib/qrcode.js`
  - `src/index.js`

## Running Tests

### All Tests
```bash
npm test
```

### Unit Tests Only
```bash
npm run test:unit
```

### Integration Tests Only
```bash
npm run test:integration
```

### Performance Tests Only
```bash
npm run test:performance
```

### Watch Mode
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

### E2E Tests
```bash
npm run test:e2e
```

### E2E Tests with UI
```bash
npm run test:e2e:ui
```

### All Tests (Unit + E2E)
```bash
npm run test:all
```

## Test Frameworks

### Jest (Unit & Integration)
- **Environment**: jsdom (browser-like environment)
- **Configuration**: `jest.config.js`
- **Setup**: `tests/setup.js`
- **Coverage**: Built-in with Istanbul

### Playwright (E2E)
- **Browsers**: Chromium, Firefox, WebKit
- **Mobile**: Pixel 5, iPhone 12
- **Configuration**: `playwright.config.js`
- **Reports**: HTML, JSON, JUnit

## Writing Tests

### Unit Test Example
```javascript
import { QRCode } from '../../src/lib/qrcode.js';

describe('QRCode Module', () => {
  test('should generate QR code for valid text', () => {
    const result = QRCode.generate('test', 200);
    expect(result).toMatch(/^data:image\/svg\+xml;base64,/);
  });
});
```

### Integration Test Example
```javascript
import { ChaiPe } from '../../src/index.js';

describe('Payment Flow Integration', () => {
  test('should complete full payment flow', (done) => {
    ChaiPe.init({ upiId: 'test@upi' });
    ChaiPe.show();
    // ... test flow
  });
});
```

### E2E Test Example
```javascript
import { test, expect } from '@playwright/test';

test('should display payment modal', async ({ page }) => {
  await page.goto('/demo/index-new.html');
  await page.click('button:has-text("Show Payment Modal")');
  await expect(page.locator('.ChaiPe-modal')).toBeVisible();
});
```

## Test Naming Conventions

- **Unit Tests**: `*.test.js`
- **E2E Tests**: `*.spec.js` (Playwright convention)
- **Describe Blocks**: Describe what is being tested
- **Test Names**: Should start with "should" and describe the behavior

## Mocking

### localStorage
Automatically mocked in `tests/setup.js`:
```javascript
localStorage.setItem('key', 'value');
localStorage.getItem('key'); // 'value'
```

### window.location
Mocked for mobile payment tests:
```javascript
window.location.href = 'upi://pay?...';
```

### Browser APIs
All browser APIs are available via jsdom environment.

## Coverage Reports

### HTML Report
After running `npm run test:coverage`, open:
```
coverage/lcov-report/index.html
```

### Terminal Report
Coverage summary is displayed in terminal after test run.

### CI/CD
Coverage is automatically uploaded to Codecov and checked against 90% threshold.

## CI/CD Pipeline

### GitHub Actions
- **Triggers**: Push to main/develop, Pull Requests
- **Jobs**:
  1. **Test**: Runs unit and integration tests with coverage
  2. **E2E**: Runs Playwright tests across browsers
  3. **Coverage Check**: Merges coverage and validates thresholds

### Coverage Enforcement
- Fails PR if coverage drops below 90%
- Comments coverage on PR
- Uploads artifacts for debugging

## Best Practices

1. **Test One Thing**: Each test should verify one behavior
2. **Arrange-Act-Assert**: Structure tests clearly
3. **Descriptive Names**: Test names should explain what they test
4. **Independent Tests**: Tests should not depend on each other
5. **Mock External Dependencies**: Use mocks for localStorage, network, etc.
6. **Test Edge Cases**: Include null, undefined, empty values
7. **Test Error Handling**: Verify graceful error handling
8. **Keep Tests Fast**: Unit tests should run in milliseconds
9. **Use beforeEach**: Reset state before each test
10. **Clean Up**: Remove created elements in afterEach

## Debugging Tests

### Jest Debug Mode
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Playwright Debug Mode
```bash
npm run test:e2e:debug
```

### Playwright UI Mode
```bash
npm run test:e2e:ui
```

## Continuous Improvement

- Review coverage reports regularly
- Add tests for new features
- Update tests when refactoring
- Maintain 90%+ coverage
- Fix failing tests immediately

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
