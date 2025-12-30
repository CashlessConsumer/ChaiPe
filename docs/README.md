# ChaiPe Documentation

Complete documentation for ChaiPe, a lightweight UPI micropayment library.

## Quick Links

- 🏠 [Main README](../README.md) - Project overview and quick start
- 📖 [API Reference](API.md) - Complete API method documentation
- ⚙️ [Configuration Guide](CONFIGURATION.md) - All configuration options
- 🏺 [TipJar Guide](TIPJAR.md) - TipJar usage, examples, and best practices
- 🛠️ [Development Guide](DEVELOPMENT.md) - Development setup and contribution guidelines

## Documentation Index

### Getting Started

- [Main README](../README.md) - Project overview, installation, and quick start guide
- [Configuration Guide](CONFIGURATION.md) - Complete configuration options and examples

### API Reference

- [API Reference](API.md) - Complete API method documentation
  - Static methods ([`ChaiPe.init()`](API.md#chaipeinitconfig), [`ChaiPe.show()`](API.md#chaipeshow), etc.)
  - TipJar API methods ([`ChaiPe.showTipJar()`](API.md#chaipeshowtipjar), [`ChaiPe.updateTipJar()`](API.md#chaipeupdatetipjaroptions), etc.)
  - Event callbacks ([`onTipCompleted`](API.md#ontipcompleteddata), [`onNudgeShown`](API.md#onnudgeshown), etc.)

### Feature Guides

- [TipJar Guide](TIPJAR.md) - Comprehensive guide to TipJar feature
  - Basic setup and configuration
  - TipJar API methods
  - Usage examples
  - Best practices
  - FAQ and troubleshooting

### Development

- [Development Guide](DEVELOPMENT.md) - Guide for contributors
  - Prerequisites and installation
  - Development commands
  - Testing guidelines
  - Code style and conventions
  - Pull request process
  - Bug reporting and feature requests

## Key Concepts

### Behavioral Nudging

ChaiPe uses intelligent triggers to show payment prompts at optimal moments:

- **Scroll Depth**: When user has read 70% of content (configurable)
- **Time on Page**: After 2 minutes of engagement (configurable)
- **Exit Intent**: When user is about to leave (desktop only, optional)
- **Manual Trigger**: Via [`ChaiPe.show()`](API.md#chaipeshow) API call

### TipJar

TipJar provides a persistent floating button that's always visible:

- **Floating Button**: Always-visible button fixed to viewport corners
- **Customizable**: Position, size, color, icon, and text
- **Device-Specific**: Show/hide on mobile or desktop independently
- **Dynamic Updates**: Update configuration with [`ChaiPe.updateTipJar()`](API.md#chaipeupdatetipjaroptions)

### Payment Flow

1. **Mobile**: Deep link to UPI app (GPay, PhonePe, Paytm, etc.)
2. **Desktop**: QR code that can be scanned with any UPI app
3. **Confirmation**: User confirms payment completion
4. **Callback**: [`onTipCompleted`](API.md#ontipcompleteddata) event fires with payment details

## Configuration Overview

### Core Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `upiId` | string | *required* | Your UPI ID |
| `name` | string | `'Creator'` | Display name |
| `amounts` | number[] | `[10, 25, 50, 100]` | Preset tip amounts |
| `theme` | string | `'minimal'` | Theme: `'minimal'`, `'toast'`, `'floating'` |

### TipJar Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `tipJar` | boolean | `false` | Enable persistent tip jar button |
| `tipJarPosition` | string | `'bottom-right'` | Position: `'bottom-right'`, `'bottom-left'`, `'top-right'`, `'top-left'` |
| `tipJarSize` | string | `'medium'` | Size: `'small'`, `'medium'`, `'large'` |
| `tipJarColor` | string | `'#4CAF50'` | Button background color |

### Trigger Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `triggers.scrollDepth` | number | `70` | Trigger at scroll depth percentage |
| `triggers.timeOnPage` | number | `120` | Trigger after time in seconds |
| `triggers.exitIntent` | boolean | `false` | Enable exit intent detection |

For complete configuration options, see the [Configuration Guide](CONFIGURATION.md).

## Common Use Cases

### Blog or Content Site

```javascript
ChaiPe.init({
  upiId: 'yourname@upi',
  name: 'Your Name',
  theme: 'minimal',
  tipJar: true,
  triggers: {
    scrollDepth: 70,
    timeOnPage: 120
  }
});
```

### Educational Content

```javascript
ChaiPe.init({
  upiId: 'yourname@upi',
  name: 'Your Name',
  amounts: [10, 20, 50],
  theme: 'toast',
  tipJar: true,
  tipJarIcon: '📚',
  tipJarColor: '#6366f1'
});
```

### Open Source Project

```javascript
ChaiPe.init({
  upiId: 'project@upi',
  name: 'Project Name',
  amounts: [25, 50, 100, 500],
  theme: 'floating',
  tipJar: true,
  tipJarIcon: '💖',
  tipJarColor: '#ec4899',
  collectUPIUTR: true
});
```

## Support and Resources

### Documentation

- 📖 [API Reference](API.md) - Complete API documentation
- ⚙️ [Configuration Guide](CONFIGURATION.md) - Configuration options
- 🏺 [TipJar Guide](TIPJAR.md) - TipJar usage and best practices
- 🛠️ [Development Guide](DEVELOPMENT.md) - Development and contribution

### Demos

- [Main Demo](../demo/index-new.html) - Landing page with TipJar integration
- [Playground](../demo/playground.html) - Interactive configuration playground
- [Blog Demo](../demo/blog-demo.html) - Blog post with behavioral nudging
- [Documentation Demo](../demo/documentation.html) - Complete API documentation
- [Edge Cases](../demo/edge-cases.html) - Advanced usage examples

### Community

- [GitHub Issues](../../issues) - Bug reports and feature requests
- [GitHub Discussions](../../discussions) - Questions and discussions
- [Pull Requests](../../pulls) - Contribute to the project

## License

ChaiPe is licensed under the MIT License. See [LICENSE](../LICENSE) for details.

---

**[← Back to Main README](../README.md)**
