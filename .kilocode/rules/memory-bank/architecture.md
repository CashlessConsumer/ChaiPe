# ChaiPe Architecture

## System Architecture

ChaiPe follows a modular architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                     Entry Point                          │
│                    src/index.js                         │
│  - Exports ChaiPe static API                            │
│  - Manages singleton instance                           │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
┌──────────────┐ ┌──────────┐ ┌──────────┐
│  core.js     │ │ qrcode.js│ │ styles.js│
│  ChaiPeCore  │ │ QRCode   │ │ STYLES   │
│  Class       │ │ Generator│ │          │
└──────────────┘ └──────────┘ └──────────┘
```

## Source Code Paths

### Core Library
- [`src/index.js`](src/index.js:1) - Main entry point, exports static API
- [`src/lib/core.js`](src/lib/core.js:1) - ChaiPeCore class, main logic
- [`src/lib/qrcode.js`](src/lib/qrcode.js:1) - QR code generation
- [`src/lib/styles.js`](src/lib/styles.js:1) - Embedded CSS styles

### Build Configuration
- [`rollup.config.mjs`](rollup.config.mjs:1) - Rollup bundler configuration
- [`package.json`](package.json:1) - npm package configuration

### Documentation Website
- [`docs-site/index.html`](docs-site/index.html:1) - Main landing page with high-conversion UX and ChaiPe contribution
- [`docs-site/docs/index.html`](docs-site/docs/index.html:1) - Documentation home page
- [`docs-site/docs/api.html`](docs-site/docs/api.html:1) - Complete API reference
- [`docs-site/docs/configuration.html`](docs-site/docs/configuration.html:1) - Configuration options and examples
- [`docs-site/docs/integration.html`](docs-site/docs/integration.html:1) - Integration guides and best practices
- [`docs-site/docs/tipjar.html`](docs-site/docs/tipjar.html:1) - TipJar feature documentation
- [`docs-site/demos/playground.html`](docs-site/demos/playground.html:1) - Interactive configuration playground with tipJar examples
- [`docs-site/demos/blog-demo.html`](docs-site/demos/blog-demo.html:1) - Blog post with behavioral nudging
- [`docs-site/demos/edge-cases.html`](docs-site/demos/edge-cases.html:1) - Edge cases and advanced usage
- [`docs-site/legal/privacy.html`](docs-site/legal/privacy.html:1) - Privacy policy
- [`docs-site/legal/disclaimer.html`](docs-site/legal/disclaimer.html:1) - Legal disclaimer
- [`docs-site/legal/releases.html`](docs-site/legal/releases.html:1) - Release notes and changelog

### Documentation Site Structure
- [`docs-site/shared/css/common.css`](docs-site/shared/css/common.css:1) - Common CSS styles and variables
- [`docs-site/shared/css/components.css`](docs-site/shared/css/components.css:1) - Reusable UI components
- [`docs-site/shared/css/demo-components.css`](docs-site/shared/css/demo-components.css:1) - Demo-specific component styles
- [`docs-site/shared/css/docs-layout.css`](docs-site/shared/css/docs-layout.css:1) - Documentation layout and navigation styles
- [`docs-site/shared/js/docs-nav.js`](docs-site/shared/js/docs-nav.js:1) - Documentation navigation and active state management
- [`docs-site/shared/js/demo-utils.js`](docs-site/shared/js/demo-utils.js:1) - Demo utility functions
- [`docs-site/shared/js/chaipe-contribution-config.js`](docs-site/shared/js/chaipe-contribution-config.js:1) - ChaiPe contribution configuration
- [`docs-site/.nojekyll`](docs-site/.nojekyll:1) - GitHub Pages configuration file
- [`docs-site/package.json`](docs-site/package.json:1) - Documentation site package configuration
- [`docs-site/README.md`](docs-site/README.md:1) - Documentation site README

### Legacy Demo Files (Deprecated)
- [`demo/index.html`](demo/index.html:1) - Legacy landing page (use docs-site version)
- [`demo/playground.html`](demo/playground.html:1) - Legacy playground (use docs-site version)
- [`demo/blog-demo.html`](demo/blog-demo.html:1) - Legacy blog demo (use docs-site version)
- [`demo/documentation.html`](demo/documentation.html:1) - Legacy documentation (use docs-site version)
- [`demo/edge-cases.html`](demo/edge-cases.html:1) - Legacy edge cases (use docs-site version)
- [`demo/shared/css/common.css`](demo/shared/css/common.css:1) - Legacy common styles (use docs-site version)
- [`demo/shared/css/demo-components.css`](demo/shared/css/demo-components.css:1) - Legacy demo components (use docs-site version)
- [`demo/shared/js/demo-utils.js`](demo/shared/js/demo-utils.js:1) - Legacy demo utils (use docs-site version)

### Output (Generated)
- `dist/chaipe.js` - UMD build
- `dist/chaipe.min.js` - Minified UMD build
- `dist/chaipe.esm.js` - ES module build

### Testing Infrastructure
- [`tests/setup.js`](tests/setup.js:1) - Global test configuration and mocks
- [`tests/unit/`](tests/unit/) - Unit tests for individual modules
  - [`qrcode.test.js`](tests/unit/qrcode.test.js:1) - QR code generation tests (23 tests)
  - [`core.test.js`](tests/unit/core.test.js:1) - ChaiPeCore class tests (90+ tests)
  - [`core-coverage.test.js`](tests/unit/core-coverage.test.js:1) - Additional coverage tests (60+ tests)
  - [`index.test.js`](tests/unit/index.test.js:1) - Entry point tests (20+ tests)
  - [`tipjar.test.js`](tests/unit/tipjar.test.js:1) - TipJar functionality tests (175+ tests)
- [`tests/integration/`](tests/integration/) - Integration tests for component interactions
  - [`payment-flow.test.js`](tests/integration/payment-flow.test.js:1) - Payment flow integration tests
  - [`qrcode-integration.test.js`](tests/integration/qrcode-integration.test.js:1) - QR code integration tests (40+ tests)
  - [`tipjar-integration.test.js`](tests/integration/tipjar-integration.test.js:1) - TipJar integration tests
- [`tests/performance/`](tests/performance/) - Performance benchmarks
  - [`qrcode-performance.test.js`](tests/performance/qrcode-performance.test.js:1) - QR code performance tests (15+ tests)
- [`tests/e2e/`](tests/e2e/) - End-to-end tests with Playwright
  - [`payment-journey.spec.js`](tests/e2e/payment-journey.spec.js:1) - Complete user journey tests

### CI/CD Configuration
- [`.github/workflows/test.yml`](.github/workflows/test.yml:1) - GitHub Actions workflow
- [`jest.config.js`](jest.config.js:1) - Jest testing configuration
- [`playwright.config.js`](playwright.config.js:1) - Playwright E2E configuration
- [`babel.config.js`](babel.config.js:1) - Babel transpilation configuration

## Key Technical Decisions

### 1. Singleton Pattern
The library uses a singleton pattern via the static [`ChaiPe`](src/index.js:16) object:
- Only one instance of [`ChaiPeCore`](src/lib/core.js:13) is created
- Subsequent [`init()`](src/index.js:43) calls reuse the existing instance
- Simplifies integration for users

### 2. Pure Vanilla JavaScript
- No external dependencies for runtime
- Self-contained QR code generation
- Inline CSS styles
- Works in any browser without frameworks

### 3. Behavioral Tracking
Heuristics-based engagement tracking:
- Scroll depth percentage
- Time on page (seconds)
- User interaction count
- Return visitor detection (localStorage)

### 4. Mobile-First Design
- Auto-detects mobile devices via user agent
- Mobile: UPI deep links
- Desktop: QR code display
- Responsive themes

### 5. Trust-Based Payment System
- No backend verification required
- User self-confirms payment completion
- Optional UTR collection for record-keeping

## Design Patterns

### Module Pattern
- ES6 modules for code organization
- Named exports for tree-shaking
- Default export for convenience

### Observer Pattern
- Event callbacks for tracking:
  - [`onNudgeShown`](src/lib/core.js:51)
  - [`onNudgeDismissed`](src/lib/core.js:52)
  - [`onTipCompleted`](src/lib/core.js:50)
  - [`onTipJarShown`](src/lib/core.js:53)
  - [`onTipJarDismissed`](src/lib/core.js:54)
  - [`onTipJarOpened`](src/lib/core.js:55)

### Strategy Pattern
- Multiple themes (minimal, toast, floating)
- Different payment flows (mobile vs desktop)
- Configurable triggers

### Factory Pattern
- [`QRCode.generate()`](src/lib/qrcode.js:325) creates QR codes
- [`generateUpiLink()`](src/lib/core.js:162) creates payment links

## Component Relationships

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

### TipJar Flow
```
init() with tipJar config
    ↓
_initTipJar()
    ↓
_renderTipJar() (floating/inline/custom)
    ↓
_attachTipJarEvents()
    ↓
User clicks tipJar
    ↓
toggleTipJar() or openTipJar()
    ↓
show() (opens payment modal)
    ↓
User completes payment
    ↓
onTipCompleted callback
```

### Payment Flow (Mobile)
```
User clicks amount
    ↓
_initiatePayment()
    ↓
_initiateMobilePayment()
    ↓
window.location.href = upiLink
    ↓
visibilitychange event
    ↓
_showMobileConfirmation()
    ↓
User confirms
    ↓
confirmPayment()
    ↓
_showSuccess()
    ↓
onTipCompleted callback
```

### Payment Flow (Desktop)
```
User clicks amount
    ↓
_initiatePayment()
    ↓
_showQRCode()
    ↓
QRCode.generate(upiLink)
    ↓
User scans and pays
    ↓
User confirms
    ↓
confirmPayment()
    ↓
_showSuccess()
    ↓
onTipCompleted callback
```

## Critical Implementation Paths

### Behavioral Triggers
- [`_startTracking()`](src/lib/core.js:105) - Sets up scroll, time, and exit listeners
- [`_checkTriggers()`](src/lib/core.js:139) - Evaluates if nudge should show
- [`show()`](src/lib/core.js:173) - Displays the modal

### Modal Rendering
- [`_renderModal()`](src/lib/core.js:187) - Creates DOM elements
- [`_renderDataForm()`](src/lib/core.js:247) - Optional data collection fields
- [`_attachModalEvents()`](src/lib/core.js:289) - Event listeners

### TipJar Implementation
- [`_initTipJar()`](src/lib/core.js:95) - Initializes tipJar based on configuration
- [`_renderTipJar()`](src/lib/core.js:101) - Renders floating button, inline widget, or custom container
- [`_attachTipJarEvents()`](src/lib/core.js:107) - Attaches click and interaction events
- [`toggleTipJar()`](src/lib/core.js:113) - Opens/closes tipJar
- [`openTipJar()`](src/lib/core.js:119) - Opens tipJar and payment modal
- [`closeTipJar()`](src/lib/core.js:125) - Closes tipJar
- [`showTipJar()`](src/lib/core.js:131) - Shows tipJar if hidden
- [`hideTipJar()`](src/lib/core.js:137) - Hides tipJar
- [`removeTipJar()`](src/lib/core.js:143) - Removes tipJar from DOM

### QR Code Generation
- [`QRCode.generate()`](src/lib/qrcode.js:325) - Public API
- [`generateSVG()`](src/lib/qrcode.js:291) - Creates SVG data URL
- [`QRCodeGenerator`](src/lib/qrcode.js:8) - Core QR logic

## Data Flow

### Configuration
```
User config object
    ↓
Merged with defaults
    ↓
Stored in this.config
    ↓
Used throughout lifecycle
```

### Session Data
```
Session ID (generated)
    ↓
Heuristics tracked
    ↓
Collected data (optional)
    ↓
Passed to callbacks
```

## CSS Architecture

### Theme System
- Base styles for common elements
- Theme-specific overrides (`.theme-minimal`, `.theme-toast`, `.theme-floating`)
- Dark mode support via `@media (prefers-color-scheme: dark)`
- Responsive breakpoints for mobile

### TipJar Styles
- Floating button styles with positioning options (bottom-left, bottom-right, top-left, top-right)
- Inline widget styles for embedded containers
- Custom container styles for user-defined elements
- Animation effects (fade, slide, bounce)
- Icon customization support

### Style Injection
- [`_injectStyles()`](src/lib/core.js:89) injects styles once
- Checks for existing style tag to avoid duplication
- Uses unique ID `ChaiPe-styles`

## Build System

### Rollup Configuration
- Three output formats:
  1. UMD (chaipe.js) - For browsers and Node.js
  2. UMD minified (chaipe.min.js) - Production
  3. ES Module (chaipe.esm.js) - Modern bundlers

### Plugins Used
- `@rollup/plugin-node-resolve` - Module resolution
- `@rollup/plugin-terser` - Minification

### Global Exposure
Footer ensures `window.ChaiPe` is available in browsers:
```javascript
window.ChaiPe = ChaiPe.ChaiPe || ChaiPe.default || ChaiPe;
```
