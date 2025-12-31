# ☕ ChaiPe

**A lightweight, PSP-less JavaScript library for accepting UPI micropayments through behavioral nudging.**

ChaiPe is perfect for creators, bloggers, and content publishers in India who need to accept small payments (₹10-₹100) from their audience without the complexity and high fees of traditional payment gateways.

## Features

- 🧠 **Behavioral Nudging** - Smart triggers based on scroll depth, time on page, and user engagement
- 🏺 **TipJar Mode** - Persistent floating button that's always visible for easy access to tipping
- 📱 **Mobile + Desktop** - Deep links on mobile, QR codes on desktop
- ⚡ **Zero Dependencies** - ~10KB minified, pure JavaScript
- 🔓 **PSP-less** - No payment gateway needed, direct UPI links
- 🎨 **3 Themes** - Minimal, Toast, or Floating with dark mode support
- 📊 **Event Callbacks** - Track tips with comprehensive analytics hooks

## Installation

### CDN

```html
<script src="https://unpkg.com/chaipe@latest/dist/chaipe.min.js"></script>
```

### npm

```bash
npm install chaipe
```

## Quick Start

### Basic Setup

```html
<script src="chaipe.min.js"></script>
<script>
  ChaiPe.init({
    upiId: 'yourname@upi',
    name: 'Your Name',
    amounts: [10, 25, 50, 100],
    theme: 'minimal'
  });
</script>
```

### With TipJar

```html
<script src="chaipe.min.js"></script>
<script>
  ChaiPe.init({
    upiId: 'yourname@upi',
    name: 'Your Name',
    amounts: [10, 25, 50, 100],
    theme: 'minimal',
    tipJar: true  // Enable persistent tip jar button
  });
</script>
```

### ES Module

```javascript
import { ChaiPe } from 'chaipe';

ChaiPe.init({
  upiId: 'yourname@upi',
  name: 'Your Name',
  amounts: [10, 25, 50, 100],
  theme: 'minimal',
  tipJar: true
});
```

## How It Works

ChaiPe uses behavioral nudging and persistent tip jars to show payment prompts at optimal moments:

1. **Behavioral Nudges** - Show prompts when users scroll to 70% of content, spend 2 minutes on page, or attempt to leave
2. **TipJar** - Persistent floating button that's always visible for instant access
3. **Mobile** - Deep link to UPI app (GPay, PhonePe, Paytm, etc.)
4. **Desktop** - QR code that can be scanned with any UPI app
5. **Confirmation** - User confirms payment completion
6. **Callback** - `onTipCompleted` event fires with payment details

## Documentation

- 📖 [API Reference](docs/API.md) - Complete API method documentation
- ⚙️ [Configuration Guide](docs/CONFIGURATION.md) - All configuration options
- 🏺 [TipJar Guide](docs/TIPJAR.md) - TipJar usage, examples, and best practices
- 🛠️ [Development Guide](docs/DEVELOPMENT.md) - Development setup and contribution guidelines

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `upiId` | string | *required* | Your UPI ID |
| `name` | string | `'Creator'` | Display name |
| `amounts` | number[] | `[10, 25, 50, 100]` | Preset tip amounts |
| `theme` | string | `'minimal'` | Theme: `'minimal'`, `'toast'`, `'floating'` |
| `message` | string | `'Enjoying the content?'` | Nudge message |
| `buttonText` | string | `'Buy me a coffee ☕'` | Button text |
| `manualOnly` | boolean | `false` | Only show via manual [`ChaiPe.show()`](docs/API.md#chaipeshow) call |
| `tipJar` | boolean | `false` | Enable persistent tip jar button |

For complete configuration options, see the [Configuration Guide](docs/CONFIGURATION.md).

## API Methods

| Method | Description |
|--------|-------------|
| [`ChaiPe.init(config)`](docs/API.md#chaipeinitconfig) | Initialize with configuration |
| [`ChaiPe.show()`](docs/API.md#chaipeshow) | Manually show the tip modal |
| [`ChaiPe.dismiss()`](docs/API.md#chaipedismiss) | Dismiss the modal |
| [`ChaiPe.confirmPayment(amount)`](docs/API.md#chapeconfirmpaymentamount) | Confirm payment was completed |
| [`ChaiPe.generateUpiLink({ amount })`](docs/API.md#chapegenerateupilink-amount-) | Generate a UPI payment link |
| [`ChaiPe.showTipJar()`](docs/API.md#chaipeshowtipjar) | Manually show the persistent tip jar button |
| [`ChaiPe.hideTipJar()`](docs/API.md#chaipehidetipjar) | Manually hide the tip jar button |
| [`ChaiPe.updateTipJar(options)`](docs/API.md#chaipeupdatetipjaroptions) | Update tip jar configuration dynamically |

For complete API documentation, see the [API Reference](docs/API.md).

## Examples

### Basic TipJar Setup

```javascript
ChaiPe.init({
  upiId: 'yourname@upi',
  name: 'Your Name',
  tipJar: true
});
```

### Custom TipJar Appearance

```javascript
ChaiPe.init({
  upiId: 'yourname@upi',
  name: 'Your Name',
  tipJar: true,
  tipJarIcon: '💰',
  tipJarPosition: 'bottom-left',
  tipJarSize: 'large',
  tipJarColor: '#ff6b6b',
  tipJarText: 'Support'
});
```

### With Data Collection

```javascript
ChaiPe.init({
  upiId: 'yourname@upi',
  name: 'Your Name',
  tipJar: true,
  collectEmail: true,
  collectName: true,
  collectUPIUTR: true,
  onTipCompleted: (data) => {
    console.log('Tip received:', data.amount, data.customData);
  }
});
```

### Custom Triggers

```javascript
ChaiPe.init({
  upiId: 'yourname@upi',
  name: 'Your Name',
  triggers: {
    scrollDepth: 70,      // Trigger at 70% scroll
    timeOnPage: 120,      // Or after 2 minutes
    exitIntent: false     // Exit intent detection (desktop only)
  }
});
```

For more examples and best practices, see the [TipJar Guide](docs/TIPJAR.md).

## Browser Support

- Chrome (desktop + mobile)
- Firefox (desktop)
- Safari (desktop + iOS)
- Edge (desktop)

Requires ES6+ support. No IE support.

## Contributing

We welcome contributions! Please see the [Development Guide](docs/DEVELOPMENT.md) for details on:

- Setting up a development environment
- Running tests
- Code style guidelines
- Pull request process
- Bug reporting and feature requests

### Quick Start for Contributors

```bash
# Clone the repository
git clone https://github.com/srikanthlogic/ChaiPe.git
cd chaipe

# Install dependencies
npm install

# Run tests
npm test

# Start dev server
npm run dev
```

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

Made with ☕ for Indian creators

---

**[View Documentation](docs/)** | **[Demo](demo/)** | **[GitHub Issues](../../issues)**
