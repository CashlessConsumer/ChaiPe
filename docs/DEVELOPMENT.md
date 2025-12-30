# ChaiPe Development Guide

Guide for developers who want to contribute to ChaiPe or set up a local development environment.

## Prerequisites

- **Node.js** (v14 or higher recommended)
- **npm** or **yarn**
- Git

## Installation

### Clone the Repository

```bash
git clone https://github.com/yourusername/chaipe.git
cd chaipe
```

### Install Dependencies

```bash
npm install
```

## Development Commands

### Build the Library

```bash
npm run build
```

This generates three output files in the `dist/` directory:
- `chaipe.js` - UMD build for browsers and Node.js
- `chaipe.min.js` - Minified UMD build for production
- `chaipe.esm.js` - ES module build for modern bundlers

### Build with Watch Mode

```bash
npm run build:watch
```

Automatically rebuilds when source files change.

### Start Local Dev Server

```bash
npm run dev
```

Starts a local development server and opens the demo page in your browser.

### Prepare for Publishing

```bash
npm run prepublishOnly
```

Runs build and tests before publishing to npm.

## Testing

### Run All Tests

```bash
npm test
```

Runs all unit and integration tests.

### Run Unit Tests Only

```bash
npm run test:unit
```

### Run Integration Tests Only

```bash
npm run test:integration
```

### Run Performance Tests Only

```bash
npm run test:performance
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

Automatically re-runs tests when files change.

### Run Tests with Coverage Report

```bash
npm run test:coverage
```

Generates a coverage report in the `coverage/` directory.

### Run E2E Tests

```bash
npm run test:e2e
```

Runs end-to-end tests with Playwright.

### Run E2E Tests with UI

```bash
npm run test:e2e:ui
```

Opens Playwright's test runner UI.

### Debug E2E Tests

```bash
npm run test:e2e:debug
```

Runs E2E tests in debug mode.

### Run All Tests

```bash
npm run test:all
```

Runs unit, integration, performance, and E2E tests.

## Development Workflow

1. **Make changes** to source files in `src/`
2. **Build** the library: `npm run build`
3. **Run tests**: `npm test` to ensure all tests pass
4. **Test locally**: `npm run dev` and open demo pages
5. **Verify outputs**: Check that all three build files are generated correctly
6. **Check coverage**: `npm run test:coverage` to maintain high code coverage

## Project Structure

```
chaipe/
├── src/
│   ├── index.js          # Entry point, static API
│   └── lib/
│       ├── core.js       # ChaiPeCore class
│       ├── qrcode.js     # QR code generator
│       └── styles.js     # Embedded CSS
├── dist/                 # Generated build outputs
│   ├── chaipe.js         # UMD build
│   ├── chaipe.min.js     # Minified UMD build
│   └── chaipe.esm.js     # ES module build
├── tests/
│   ├── setup.js          # Global test configuration
│   ├── unit/             # Unit tests
│   ├── integration/      # Integration tests
│   ├── performance/      # Performance benchmarks
│   └── e2e/              # End-to-end tests
├── demo/                 # Demo pages
├── docs/                 # Documentation
├── rollup.config.mjs     # Rollup bundler configuration
├── jest.config.js        # Jest testing configuration
├── playwright.config.js  # Playwright E2E configuration
└── package.json          # npm package configuration
```

## Code Style

### JavaScript

- Use **ES6+** features
- Follow **camelCase** for methods and variables
- Use **PascalCase** for classes
- Prefix private methods with underscore: `_methodName`
- Use **UPPER_SNAKE_CASE** for constants

### CSS

- Use **PascalCase** with prefix for classes: `.ChaiPe-modal`
- Follow BEM naming convention where appropriate
- Use CSS variables for theme colors

### Naming Conventions

- Classes: `ChaiPeCore`, `QRCodeGenerator`
- Methods: `initiatePayment`, `showModal`
- Private methods: `_initiatePayment`, `_showModal`
- Constants: `STYLES`, `DEFAULT_CONFIG`
- CSS classes: `.ChaiPe-modal`, `.ChaiPe-button`

## Testing Guidelines

### Test Coverage

- **Target**: 90%+ code coverage
- **Current**: 99.47% coverage across all critical files
- **Enforcement**: CI/CD pipeline enforces minimum 90% coverage

### Test Types

#### Unit Tests
- Test individual functions and methods in isolation
- Mock external dependencies
- Located in `tests/unit/`

#### Integration Tests
- Test component interactions and workflows
- Test complete payment flows
- Located in `tests/integration/`

#### Performance Tests
- Benchmark critical operations
- Test with different data sizes
- Located in `tests/performance/`

#### E2E Tests
- Test complete user journeys
- Cross-browser compatibility
- Located in `tests/e2e/`

### Writing Tests

```javascript
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';

describe('ChaiPeCore', () => {
  let chaipe;

  beforeEach(() => {
    chaipe = new ChaiPeCore();
  });

  afterEach(() => {
    chaipe.destroy();
  });

  test('should initialize with default config', () => {
    chaipe.init({ upiId: 'test@upi' });
    expect(chaipe.config.upiId).toBe('test@upi');
  });
});
```

## Pull Request Process

### Before Submitting a PR

1. **Fork** the repository
2. **Create a branch** for your feature or bugfix
3. **Make changes** following the code style guidelines
4. **Write tests** for new functionality
5. **Run tests**: `npm run test:all`
6. **Check coverage**: `npm run test:coverage`
7. **Build**: `npm run build`
8. **Test locally**: `npm run dev`
9. **Commit** with clear, descriptive messages
10. **Push** to your fork
11. **Create a PR** with a clear description

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Tests added/updated for new functionality
- [ ] All tests pass (`npm run test:all`)
- [ ] Coverage remains at 90%+ (`npm run test:coverage`)
- [ ] Build succeeds (`npm run build`)
- [ ] Documentation updated (if needed)
- [ ] Demo pages tested (if UI changes)
- [ ] Commit messages are clear and descriptive

### Commit Message Format

```
type(scope): subject

body

footer
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build process or auxiliary tool changes

**Example:**
```
feat(tipjar): add dynamic update method

Add ChaiPe.updateTipJar() method to allow dynamic
configuration updates without re-initialization.

Closes #123
```

## Bug Reporting

### Before Reporting a Bug

1. **Search existing issues** to avoid duplicates
2. **Check the documentation** to ensure it's not a configuration issue
3. **Test with the latest version** to see if it's already fixed
4. **Create a minimal reproduction** if possible

### Bug Report Template

```markdown
**Description**
A clear and concise description of the bug.

**Steps to Reproduce**
1. Initialize ChaiPe with config: ...
2. Perform action: ...
3. See error: ...

**Expected Behavior**
What should happen.

**Actual Behavior**
What actually happens.

**Environment**
- ChaiPe version: ...
- Browser: ...
- OS: ...

**Additional Context**
Any other relevant information, screenshots, or code snippets.
```

## Feature Requests

### Before Requesting a Feature

1. **Search existing issues** and PRs
2. **Check the roadmap** (if available)
3. **Consider if it fits** the project's goals
4. **Think about implementation** and potential issues

### Feature Request Template

```markdown
**Feature Description**
A clear and concise description of the feature.

**Problem Statement**
What problem does this feature solve?

**Proposed Solution**
How should this feature work?

**Alternatives Considered**
What other approaches did you consider?

**Additional Context**
Any other relevant information, examples, or use cases.
```

## Architecture Overview

ChaiPe follows a modular architecture with clear separation of concerns:

### Core Components

- **[`src/index.js`](../src/index.js:1)** - Entry point, exports static API
- **[`src/lib/core.js`](../src/lib/core.js:1)** - ChaiPeCore class, main logic
- **[`src/lib/qrcode.js`](../src/lib/qrcode.js:1)** - QR code generation
- **[`src/lib/styles.js`](../src/lib/styles.js:1)** - Embedded CSS styles

### Key Design Patterns

- **Singleton Pattern**: Single ChaiPe instance reused across init calls
- **Observer Pattern**: Event callbacks for tracking user interactions
- **Strategy Pattern**: Multiple themes and payment flows
- **Factory Pattern**: QR code and payment link generation

### Initialization Flow

```
ChaiPe.init(config)
    ↓
new ChaiPeCore() (if first time)
    ↓
instance.init(config)
    ↓
_injectStyles()
    ↓
_checkReturnVisitor()
    ↓
_initTipJar() (if tipJar enabled)
    ↓
_startTracking()
```

For more details, see the [Architecture Documentation](../.kilocode/rules/memory-bank/architecture.md).

## Performance Considerations

### Scroll Tracking
- Passive event listener for non-blocking scroll
- Tracks max scroll depth only
- Lightweight check on each scroll event

### Time Tracking
- Interval every 5 seconds (not 1 second to save CPU)
- Simple elapsed time calculation

### QR Code Generation
- Only generated when needed (on desktop payment)
- SVG format is lightweight and scalable
- Auto-detects minimum QR type for data size

### Style Injection
- Checks for existing styles before injecting
- Single injection per page load
- Uses unique ID to prevent duplication

## Security Considerations

### XSS Prevention
- User input is only collected, not rendered unsafely
- All HTML is generated via template literals with controlled content
- No `innerHTML` with user-provided data

### Data Privacy
- No external API calls
- No tracking/analytics
- Local storage only for visitor detection (optional)
- All data stays client-side

### Payment Security
- Trust-based system (no backend verification)
- UPI links are standard, no custom protocols
- No sensitive data stored or transmitted

## Browser Support

### Supported Browsers
- Chrome (desktop + mobile)
- Firefox (desktop)
- Safari (desktop + iOS)
- Edge (desktop)

### Requirements
- ES6+ support required
- Modern JavaScript features
- No IE support (no polyfills needed)

## Deployment

### Publishing to npm

1. **Update version** in `package.json`
2. **Run tests**: `npm run test:all`
3. **Build**: `npm run build`
4. **Commit and push** changes
5. **Create a tag**: `git tag v1.0.0`
6. **Push tag**: `git push origin v1.0.0`
7. **Publish**: `npm publish`

### CI/CD Pipeline

The project uses GitHub Actions for automated testing and deployment:

- **On push**: Runs all tests
- **On pull request**: Runs all tests and coverage checks
- **On tag**: Prepares for publishing

## Resources

### Documentation
- [API Reference](API.md) - Complete API documentation
- [Configuration Guide](CONFIGURATION.md) - Configuration options
- [TipJar Guide](TIPJAR.md) - TipJar usage and best practices
- [Main README](../README.md) - Project overview and quick start

### Internal Documentation
- [Architecture](../.kilocode/rules/memory-bank/architecture.md) - System architecture
- [Technical Specs](../.kilocode/rules/memory-bank/tech.md) - Technical documentation
- [Product Info](../.kilocode/rules/memory-bank/product.md) - Product documentation
- [Context](../.kilocode/rules/memory-bank/context.md) - Current project state

### Demo Pages
- [Main Demo](../demo/index-new.html) - Landing page with tipJar
- [Playground](../demo/playground.html) - Interactive configuration
- [Blog Demo](../demo/blog-demo.html) - Blog post with nudging
- [Documentation Demo](../demo/documentation.html) - Complete API demo
- [Edge Cases](../demo/edge-cases.html) - Advanced usage examples

## Getting Help

### Questions?
- Check the [documentation](../README.md)
- Search [existing issues](../../issues)
- Ask in [discussions](../../discussions)

### Contributing?
- Read this guide
- Check the [code of conduct](../../CODE_OF_CONDUCT.md) (if available)
- Review [existing PRs](../../pulls) for examples

## License

ChaiPe is licensed under the MIT License. See [LICENSE](../../LICENSE) for details.
