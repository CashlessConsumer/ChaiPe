# ChaiPe Technical Documentation

## Technologies Used

### Core Technologies
- **JavaScript (ES6+)** - Pure vanilla JavaScript, no frameworks
- **CSS3** - Inline styles with modern features (flexbox, grid, CSS variables)
- **SVG** - For QR code generation (no canvas, no external libraries)

### Build Tools
- **Rollup** (v4.9.1) - Module bundler
- **@rollup/plugin-node-resolve** (v15.2.3) - Node module resolution
- **@rollup/plugin-terser** (v0.4.4) - Code minification

### Development Tools
- **http-server** (v14.1.1) - Local development server
- **npm** - Package management

### Testing Frameworks
- **Jest** (v30.2.0) - JavaScript testing framework for unit and integration tests
- **jest-environment-jsdom** (v30.2.0) - jsdom environment for browser-like testing
- **@jest/globals** (v30.2.0) - Jest global types and utilities
- **@playwright/test** (v1.57.0) - E2E testing framework for cross-browser testing
- **babel-jest** (v30.2.0) - Babel transpiler for Jest
- **@babel/preset-env** (v7.28.5) - Babel preset for ES6+ transpilation
- **@babel/core** (v7.28.5) - Babel core transpiler

### CI/CD Tools
- **GitHub Actions** - Automated testing and deployment pipeline
- **Codecov** - Code coverage reporting and tracking

### Browser APIs Used
- `localStorage` - Return visitor detection, supporter tracking
- `window.location.href` - Mobile deep link navigation
- `visibilitychange` event - Detect when user returns from UPI app
- `scroll` event - Scroll depth tracking
- `click` event - User interaction tracking
- `mouseout` event - Exit intent detection (desktop)

## Development Setup

### Prerequisites
- Node.js (v14 or higher recommended)
- npm or yarn

### Installation
```bash
npm install
```

### Development Commands
```bash
# Build the library
npm run build

# Build with watch mode
npm run build:watch

# Start local dev server (opens demo)
npm run dev

# Prepare for publishing
npm run prepublishOnly

# Testing commands
npm test              # Run all unit and integration tests
npm run test:unit     # Run unit tests only
npm run test:integration  # Run integration tests only
npm run test:performance  # Run performance tests only
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage report
npm run test:e2e       # Run E2E tests with Playwright
npm run test:e2e:ui    # Run E2E tests with UI
npm run test:e2e:debug  # Debug E2E tests
npm run test:all       # Run all tests (unit + integration + performance + E2E)
```

### Development Workflow
1. Make changes to source files in `src/`
2. Run `npm run build` to generate distribution files
3. Run `npm test` to ensure all tests pass
4. Test with `npm run dev` and open demo pages
5. Verify all three build outputs are generated correctly
6. Check coverage with `npm run test:coverage`

## Technical Constraints

### File Size
- Target: < 25KB minified (gzipped)
- Current: ~10KB minified
- No external dependencies to keep size minimal

### Browser Support
- Modern browsers (ES6+ support required)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- No IE support (no need for polyfills)

### UPI Link Format
```
upi://pay?pa={upiId}&pn={name}&am={amount}&cu={currency}&tn={note}
```

### QR Code Specifications
- Auto-detect type number (1-10)
- Error correction level: Medium (M)
- Output format: SVG data URL (base64 encoded)
- Default size: 200x200px

## Dependencies

### Runtime Dependencies
- **None** (pure vanilla JavaScript)

### Development Dependencies
```json
{
  "@rollup/plugin-node-resolve": "^15.2.3",
  "@rollup/plugin-terser": "^0.4.4",
  "http-server": "^14.1.1",
  "rollup": "^4.9.1",
  "jest": "^30.2.0",
  "jest-environment-jsdom": "^30.2.0",
  "@jest/globals": "^30.2.0",
  "babel-jest": "^30.2.0",
  "@babel/preset-env": "^7.28.5",
  "@babel/core": "^7.28.5",
  "@playwright/test": "^1.57.0"
}
```

### Peer Dependencies (Optional)
```json
{
  "react": ">=16.8.0",
  "react-dom": ">=16.8.0"
}
```
Note: React is optional, for future React component wrapper

## Tool Usage Patterns

### Rollup Build Configuration

#### UMD Build
```javascript
{
  input: 'src/index.js',
  output: {
    file: 'dist/chaipe.js',
    format: 'umd',
    name: 'ChaiPe',
    exports: 'named'
  }
}
```

#### Minified Build
Same as UMD but with Terser plugin for minification

#### ESM Build
```javascript
{
  input: 'src/index.js',
  output: {
    file: 'dist/chaipe.esm.js',
    format: 'es'
  }
}
```

### QR Code Generation Pattern
```javascript
const qr = new QRCodeGenerator(0, 'M'); // Auto-detect type
qr.addData(text);
qr.make();
const matrix = qr.modules;
// Render matrix as SVG
```

### Event Listener Pattern
```javascript
// Passive scroll listener for performance
window.addEventListener('scroll', trackScroll, { passive: true });

// One-time visibility change listener
document.addEventListener('visibilitychange', handleVisibilityChange);
document.removeEventListener('visibilitychange', handleVisibilityChange);
```

### DOM Manipulation Pattern
```javascript
// Create modal
const modal = document.createElement('div');
modal.className = 'ChaiPe-modal';
modal.innerHTML = `...`;
document.body.appendChild(modal);

// Animate with requestAnimationFrame
requestAnimationFrame(() => {
  modal.classList.add('active');
});

// Remove after animation
setTimeout(() => {
  modal.remove();
}, 300);
```

## Code Organization

### Module Structure
```
src/
├── index.js          # Entry point, static API
└── lib/
    ├── core.js       # ChaiPeCore class
    ├── qrcode.js     # QR code generator
    └── styles.js     # Embedded CSS
```

### Export Strategy
- Named exports for ES modules: `export { ChaiPe, ChaiPeCore, QRCode, STYLES }`
- Default export for convenience: `export default ChaiPe`
- UMD exposes global `window.ChaiPe`

### Naming Conventions
- Classes: PascalCase (`ChaiPeCore`, `QRCodeGenerator`)
- Methods: camelCase with leading underscore for private (`_initiatePayment`)
- Constants: UPPER_SNAKE_CASE (`STYLES`)
- CSS classes: PascalCase with prefix (`.ChaiPe-modal`)

## Performance Considerations

### Scroll Tracking
- Passive event listener for non-blocking scroll
- Throttled check (every scroll event, but lightweight)
- Tracks max scroll depth only

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

## Testing Strategy

### Test Coverage
- **Total Tests**: 410+ passing tests
- **Coverage**: 99.47% achieved across all critical files
- **Test Types**:
  - Unit tests for individual modules
  - Integration tests for component interactions
  - Performance tests for benchmarks
  - E2E tests for complete user journeys

### Unit Tests
- **QRCode Module**: 23 tests covering QR code generation, SVG format, edge cases
- **ChaiPeCore Class**: 90+ tests covering initialization, configuration, payment flows, data collection, themes, triggers, session management
- **Core Coverage Tests**: 60+ additional coverage tests
- **Main Entry Point**: 20+ tests covering singleton pattern, API methods, exports, error handling
- **TipJar Module**: 175+ tests covering tipJar initialization, rendering, events, state management, API methods

### Integration Tests
- Complete payment flows (desktop and mobile)
- Data collection with various field combinations
- Theme integration (minimal, toast, floating)
- Return visitor handling
- Multiple payment sessions
- QR code integration (40+ tests)
- TipJar integration tests

### Performance Tests
- QR code generation benchmarks (15+ tests)
- Execution speed measurements
- Performance with different data sizes
- Memory efficiency tests
- Edge case performance

### E2E Tests
- Modal display and interaction
- Amount selection and custom input
- QR code display (desktop)
- Theme switching
- Data collection forms
- Responsive design (mobile, tablet, desktop)
- Cross-browser compatibility (Chrome, Firefox, Safari)
- Accessibility (keyboard navigation, ARIA labels)

### Manual Testing Checklist
- [ ] Mobile: Deep link opens UPI app
- [ ] Desktop: QR code displays correctly
- [ ] All three themes render properly
- [ ] Dark mode works automatically
- [ ] Scroll trigger fires at correct depth
- [ ] Time trigger fires after configured seconds
- [ ] Exit intent triggers on desktop
- [ ] Data collection fields work correctly
- [ ] Callbacks fire with correct data
- [ ] Modal can be dismissed
- [ ] Multiple init calls reuse instance

### Browser Testing
- Chrome (desktop + mobile)
- Firefox (desktop)
- Safari (desktop + iOS)
- Edge (desktop)

### Demo Pages
- `demo/index-new.html` - Main landing page with tipJar integration
- `demo/playground.html` - Interactive configuration playground with tipJar examples
- `demo/blog-demo.html` - Blog post with behavioral nudging
- `demo/documentation.html` - Complete API documentation including tipJar
- `demo/edge-cases.html` - Edge cases and advanced usage

## tipJar Configuration

### tipJar Modes
- **Floating Button**: Persistent button fixed to viewport corners
- **Inline Widget**: Embedded widget within page content
- **Custom Container**: User-defined container element

### tipJar Configuration Options
```javascript
{
  tipJar: {
    enabled: true,              // Enable tipJar feature
    mode: 'floating',           // 'floating', 'inline', or 'custom'
    position: 'bottom-right',   // 'bottom-left', 'bottom-right', 'top-left', 'top-right'
    autoShow: true,             // Auto-show tipJar on page load
    showDelay: 2000,            // Delay before auto-show (ms)
    icon: '☕',                 // Icon to display
    label: 'Tip',               // Button label
    colors: {
      primary: '#4CAF50',       // Primary color
      secondary: '#45a049',     // Secondary color
      text: '#ffffff'           // Text color
    },
    size: 'medium',             // 'small', 'medium', 'large'
    animation: 'bounce',         // 'fade', 'slide', 'bounce', 'none'
    container: null,            // Custom container selector (for 'custom' mode)
    onTipJarShown: () => {},    // Callback when tipJar is shown
    onTipJarDismissed: () => {}, // Callback when tipJar is dismissed
    onTipJarOpened: () => {}    // Callback when tipJar opens payment modal
  }
}
```

### tipJar API Methods
- `ChaiPe.toggleTipJar()` - Toggle tipJar open/close state
- `ChaiPe.openTipJar()` - Open tipJar and payment modal
- `ChaiPe.closeTipJar()` - Close tipJar
- `ChaiPe.showTipJar()` - Show tipJar if hidden
- `ChaiPe.hideTipJar()` - Hide tipJar
- `ChaiPe.removeTipJar()` - Remove tipJar from DOM
