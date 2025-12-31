# ChaiPe Configuration Guide

Complete configuration reference for ChaiPe, including all available options for customization.

## Core Configuration Options

These are the primary configuration options passed to [`ChaiPe.init(config)`](API.md#chaipeinitconfig).

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `upiId` | string | *required* | Your UPI ID (e.g., `yourname@upi`) |
| `name` | string | `'Creator'` | Display name shown in payment prompts |
| `amounts` | number[] | `[10, 25, 50, 100]` | Preset tip amounts in rupees |
| `theme` | string | `'minimal'` | Theme: `'minimal'`, `'toast'`, or `'floating'` |
| `message` | string | `'Enjoying the content?'` | Nudge message displayed to users |
| `buttonText` | string | `'Buy me a coffee ☕'` | Primary button text |
| `manualOnly` | boolean | `false` | If `true`, only show modal via manual [`ChaiPe.show()`](API.md#chaipeshow) call |

### Example: Basic Configuration

```javascript
ChaiPe.init({
  upiId: 'yourname@upi',
  name: 'Your Name',
  amounts: [10, 25, 50, 100],
  theme: 'minimal'
});
```

---

## TipJar Configuration

TipJar provides a persistent payment button that's always visible. Configure it using the `tipJar` object.

### TipJar Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `tipJar` | boolean | `false` | Enable persistent tip jar button |
| `tipJarIcon` | string | `'☕'` | Custom icon for tip jar button |
| `tipJarPosition` | string | `'bottom-right'` | Position: `'bottom-right'`, `'bottom-left'`, `'top-right'`, `'top-left'` |
| `tipJarSize` | string | `'medium'` | Size: `'small'`, `'medium'`, `'large'` |
| `tipJarColor` | string | `'#4CAF50'` | Button background color (hex, rgb, or named color) |
| `tipJarText` | string | `'Buy me a chai ☕'` | Text shown on hover or for larger buttons |
| `tipJarShowOnMobile` | boolean | `true` | Show tip jar on mobile devices |
| `tipJarShowOnDesktop` | boolean | `true` | Show tip jar on desktop devices |

### Example: TipJar Configuration

```javascript
ChaiPe.init({
  upiId: 'yourname@upi',
  name: 'Your Name',
  tipJar: true,
  tipJarIcon: '💰',
  tipJarPosition: 'bottom-left',
  tipJarSize: 'large',
  tipJarColor: '#ff6b6b',
  tipJarText: 'Support Us',
  tipJarShowOnMobile: true,
  tipJarShowOnDesktop: true
});
```

---

## Trigger Configuration

Configure when the behavioral nudge modal should appear automatically using the `triggers` object.

### Trigger Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `triggers.scrollDepth` | number | `70` | Trigger at specified scroll depth percentage (0-100) |
| `triggers.timeOnPage` | number | `120` | Trigger after specified time in seconds |
| `triggers.exitIntent` | boolean | `false` | Enable exit intent detection (desktop only) |

### Example: Trigger Configuration

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

**Note:** The nudge will show when **any** of the enabled triggers are met. Set a value to `null` to disable a specific trigger.

---

## Data Collection Options

Optionally collect additional information from users when they complete a payment.

### Data Collection Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `collectEmail` | boolean | `false` | Show optional email field |
| `collectName` | boolean | `false` | Show optional name field |
| `collectPhoneNumber` | boolean | `false` | Show optional phone number field |
| `collectVPA` | boolean | `false` | Show optional VPA (UPI ID) field |
| `collectUPIUTR` | boolean | `false` | Show optional UPI transaction ID field |

### Example: Data Collection Configuration

```javascript
ChaiPe.init({
  upiId: 'yourname@upi',
  name: 'Your Name',
  collectEmail: true,       // Optional email field
  collectName: true,        // Optional name field
  collectPhoneNumber: false,
  collectVPA: false,
  collectUPIUTR: true       // UPI transaction ID
});
```

**Note:** All data collection fields are optional for users. They can skip providing any information.

---

## Event Callbacks

Configure callback functions to track user interactions and payment events.

### Callback Options

| Option | Type | Description |
|--------|------|-------------|
| `onNudgeShown` | function(data) | Called when nudge modal is displayed |
| `onNudgeDismissed` | function(data) | Called when user dismisses nudge |
| `onTipCompleted` | function(data) | Called when payment is completed |
| `onTipJarShown` | function(data) | Called when tip jar is displayed |
| `onTipJarDismissed` | function(data) | Called when tip jar is dismissed |
| `onTipJarOpened` | function(data) | Called when tip jar opens payment modal |

### Example: Callback Configuration

```javascript
ChaiPe.init({
  upiId: 'yourname@upi',
  name: 'Your Name',
  onNudgeShown: (data) => {
    console.log('Nudge shown', data.sessionId);
  },
  onNudgeDismissed: (data) => {
    console.log('Nudge dismissed');
  },
  onTipCompleted: (data) => {
    console.log('Tip received!', data.amount, data.customData);
    // Send to your analytics
  }
});
```

See [API Reference](API.md#event-callbacks) for detailed callback parameter information.

---

## Theme Configuration

ChaiPe supports three built-in themes with automatic dark mode support.

### Available Themes

#### Minimal Theme
- Clean, centered modal
- Subtle design
- Works well on professional sites

```javascript
ChaiPe.init({
  upiId: 'yourname@upi',
  theme: 'minimal'
});
```

#### Toast Theme
- Compact notification-style modal
- Less intrusive
- Good for frequent prompts

```javascript
ChaiPe.init({
  upiId: 'yourname@upi',
  theme: 'toast'
});
```

#### Floating Theme
- Floating modal with shadow
- More prominent
- Good for high-visibility prompts

```javascript
ChaiPe.init({
  upiId: 'yourname@upi',
  theme: 'floating'
});
```

### Dark Mode

All themes automatically support dark mode through CSS media queries. The theme adapts based on user's system preference.

---

## Complete Configuration Example

```javascript
ChaiPe.init({
  // Core options
  upiId: 'yourname@upi',
  name: 'Your Name',
  amounts: [10, 25, 50, 100],
  theme: 'minimal',
  message: 'Enjoying the content?',
  buttonText: 'Buy me a coffee ☕',
  manualOnly: false,
  
  // TipJar configuration
  tipJar: true,
  tipJarIcon: '☕',
  tipJarPosition: 'bottom-right',
  tipJarSize: 'medium',
  tipJarColor: '#4CAF50',
  tipJarText: 'Buy me a chai ☕',
  tipJarShowOnMobile: true,
  tipJarShowOnDesktop: true,
  
  // Trigger configuration
  triggers: {
    scrollDepth: 70,
    timeOnPage: 120,
    exitIntent: false
  },
  
  // Data collection
  collectEmail: true,
  collectName: true,
  collectPhoneNumber: false,
  collectVPA: false,
  collectUPIUTR: true,
  
  // Event callbacks
  onNudgeShown: (data) => {
    console.log('Nudge shown:', data.sessionId);
  },
  onNudgeDismissed: (data) => {
    console.log('Nudge dismissed:', data.sessionId);
  },
  onTipCompleted: (data) => {
    console.log('Tip completed:', data.amount, data.customData);
  },
  onTipJarShown: (data) => {
    console.log('Tip jar shown:', data.sessionId);
  },
  onTipJarDismissed: (data) => {
    console.log('Tip jar dismissed:', data.sessionId);
  },
  onTipJarOpened: (data) => {
    console.log('Tip jar opened:', data.sessionId);
  }
});
```

---

## Configuration Best Practices

### 1. Start Simple

Begin with basic configuration and add complexity as needed:

```javascript
// Start with this
ChaiPe.init({
  upiId: 'yourname@upi',
  name: 'Your Name'
});

// Then add tipJar
ChaiPe.init({
  upiId: 'yourname@upi',
  name: 'Your Name',
  tipJar: true
});

// Then customize further
ChaiPe.init({
  upiId: 'yourname@upi',
  name: 'Your Name',
  tipJar: true,
  tipJarColor: '#your-brand-color',
  amounts: [10, 25, 50, 100]
});
```

### 2. Match Your Brand

Use colors and text that match your brand identity:

```javascript
ChaiPe.init({
  upiId: 'yourname@upi',
  name: 'Your Brand',
  tipJarColor: '#your-brand-color',
  buttonText: 'Support Our Work',
  message: 'Love this content? Consider supporting us!'
});
```

### 3. Test Triggers

Experiment with different trigger values to find what works for your audience:

```javascript
// Conservative approach
triggers: {
  scrollDepth: 80,
  timeOnPage: 180  // 3 minutes
}

// Moderate approach (default)
triggers: {
  scrollDepth: 70,
  timeOnPage: 120  // 2 minutes
}

// Aggressive approach
triggers: {
  scrollDepth: 50,
  timeOnPage: 60   // 1 minute
}
```

### 4. Use TipJar for Persistent Access

Combine TipJar with behavioral triggers for maximum effectiveness:

```javascript
ChaiPe.init({
  upiId: 'yourname@upi',
  tipJar: true,              // Always visible
  triggers: {
    scrollDepth: 70,         // Also show modal at 70% scroll
    timeOnPage: 120          // Or after 2 minutes
  }
});
```

### 5. Collect Only What You Need

Only enable data collection fields that provide value:

```javascript
// For email newsletter integration
collectEmail: true,
collectUPIUTR: true

// For personal acknowledgment
collectName: true,
collectEmail: true

// For minimal privacy
collectUPIUTR: true  // Just transaction ID
```

---

## Related Documentation

- [API Reference](API.md) - Complete API method documentation
- [TipJar Guide](TIPJAR.md) - TipJar usage, examples, and best practices
- [Development Guide](DEVELOPMENT.md) - Development setup and contribution
