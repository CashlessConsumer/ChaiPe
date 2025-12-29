# ☕ ChaiPe

**A web monetisation enablement micropayment library for UPI**

ChaiPe is a lightweight, PSP-less JavaScript library for accepting UPI micropayments through behavioral nudging. Perfect for creators, bloggers, and content publishers in India.

## Features

- 🧠 **Behavioral Nudging** - Smart triggers based on scroll depth, time on page, and user engagement
- 📱 **Mobile + Desktop** - Deep links on mobile, QR codes on desktop
- ⚡ **Zero Dependencies** - ~25KB minified, pure JavaScript
- 🔓 **PSP-less** - No payment gateway needed, direct UPI links
- 🎨 **3 Themes** - Minimal, Toast, or Floating with dark mode support
- 📊 **Event Callbacks** - Track tips with onTipCompleted
- 🏺 **Tip Jar Mode** - Persistent floating button that's always visible for easy access to tipping

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

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `upiId` | string | *required* | Your UPI ID |
| `name` | string | 'Creator' | Display name |
| `amounts` | number[] | [10, 25, 50, 100] | Preset tip amounts |
| `theme` | string | 'minimal' | Theme: 'minimal', 'toast', 'floating' |
| `message` | string | 'Enjoying the content?' | Nudge message |
| `buttonText` | string | 'Buy me a coffee ☕' | Button text |
| `manualOnly` | boolean | false | Only show via manual ChaiPe.show() |

### Tip Jar Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `tipJar` | boolean | false | Enable persistent tip jar button |
| `tipJarIcon` | string | '☕' | Custom icon for tip jar button |
| `tipJarPosition` | string | 'bottom-right' | Position: 'bottom-right', 'bottom-left', 'top-right', 'top-left' |
| `tipJarSize` | string | 'medium' | Size: 'small', 'medium', 'large' |
| `tipJarColor` | string | '#4CAF50' | Button background color (hex, rgb, or named color) |
| `tipJarText` | string | 'Buy me a chai ☕' | Text shown on hover or for larger buttons |
| `tipJarShowOnMobile` | boolean | true | Show tip jar on mobile devices |
| `tipJarShowOnDesktop` | boolean | true | Show tip jar on desktop devices |

### Trigger Options

```javascript
ChaiPe.init({
  upiId: 'yourname@upi',
  triggers: {
    scrollDepth: 70,      // Trigger at 70% scroll (default)
    timeOnPage: 120,      // Or after 2 minutes (default)
    exitIntent: false     // Exit intent detection (desktop only)
  }
});
```

### Data Collection

```javascript
ChaiPe.init({
  upiId: 'yourname@upi',
  collectEmail: true,       // Optional email field
  collectName: true,        // Optional name field
  collectPhoneNumber: false,
  collectVPA: false,
  collectUPIUTR: true       // UPI transaction ID
});
```

### Callbacks

```javascript
ChaiPe.init({
  upiId: 'yourname@upi',
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

## API

| Method | Description |
|--------|-------------|
| `ChaiPe.init(config)` | Initialize with configuration |
| `ChaiPe.show()` | Manually show the tip modal |
| `ChaiPe.dismiss()` | Dismiss the modal |
| `ChaiPe.confirmPayment(amount)` | Confirm payment was completed |
| `ChaiPe.generateUpiLink({ amount })` | Generate a UPI payment link |
| `ChaiPe.showTipJar()` | Manually show the persistent tip jar button |
| `ChaiPe.hideTipJar()` | Manually hide the tip jar button |
| `ChaiPe.updateTipJar(options)` | Update tip jar configuration dynamically |

### Tip Jar API Methods

#### `ChaiPe.showTipJar()`
Displays the persistent tip jar button. Use this if you initially disabled the tip jar or hid it programmatically.

```javascript
// Show tip jar after user completes an action
document.getElementById('read-more').addEventListener('click', () => {
  ChaiPe.showTipJar();
});
```

#### `ChaiPe.hideTipJar()`
Hides the persistent tip jar button. Useful for temporarily removing the button during specific user flows.

```javascript
// Hide tip jar during checkout process
function startCheckout() {
  ChaiPe.hideTipJar();
  // ... checkout logic
}
```

#### `ChaiPe.updateTipJar(options)`
Updates the tip jar configuration dynamically without re-initializing ChaiPe. Accepts any tipJar configuration option.

```javascript
// Change tip jar position and color
ChaiPe.updateTipJar({
  position: 'top-right',
  color: '#ff6b6b'
});

// Update multiple properties
ChaiPe.updateTipJar({
  icon: '💰',
  text: 'Support Us',
  size: 'large'
});
```

## Tip Jar Usage Examples

### Basic Tip Jar Setup

Enable the tip jar with default settings:

```javascript
ChaiPe.init({
  upiId: 'yourname@upi',
  name: 'Your Name',
  tipJar: true
});
```

This creates a medium-sized, purple coffee icon button in the bottom-right corner that's visible on both mobile and desktop.

### Advanced Tip Jar Configuration

Customize the tip jar appearance and behavior:

```javascript
ChaiPe.init({
  upiId: 'yourname@upi',
  name: 'Your Name',
  amounts: [10, 25, 50, 100],
  tipJar: true,
  tipJarIcon: '💰',
  tipJarPosition: 'bottom-left',
  tipJarSize: 'large',
  tipJarColor: '#ff6b6b',
  tipJarText: 'Support',
  tipJarShowOnMobile: true,
  tipJarShowOnDesktop: true
});
```

### Dynamic Tip Jar Update

Change tip jar configuration based on user behavior:

```javascript
// Initialize with basic config
ChaiPe.init({
  upiId: 'yourname@upi',
  name: 'Your Name',
  tipJar: true,
  tipJarPosition: 'bottom-right'
});

// Update after user scrolls 50%
window.addEventListener('scroll', () => {
  const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  if (scrollPercent > 50) {
    ChaiPe.updateTipJar({
      size: 'large',
      color: '#10b981',
      text: 'Enjoyed? Tip us!'
    });
  }
});
```

### Tip Jar with Different Themes

The tip jar works seamlessly with all ChaiPe themes:

```javascript
// Minimal theme with tip jar
ChaiPe.init({
  upiId: 'yourname@upi',
  name: 'Your Name',
  theme: 'minimal',
  tipJar: true,
  tipJarIcon: '☕',
  tipJarColor: '#6366f1'
});

// Toast theme with tip jar
ChaiPe.init({
  upiId: 'yourname@upi',
  name: 'Your Name',
  theme: 'toast',
  tipJar: true,
  tipJarIcon: '💖',
  tipJarColor: '#ec4899'
});

// Floating theme with tip jar
ChaiPe.init({
  upiId: 'yourname@upi',
  name: 'Your Name',
  theme: 'floating',
  tipJar: true,
  tipJarIcon: '🎉',
  tipJarColor: '#f59e0b'
});
```

### Tip Jar with Data Collection

Combine tip jar with optional data collection:

```javascript
ChaiPe.init({
  upiId: 'yourname@upi',
  name: 'Your Name',
  tipJar: true,
  collectEmail: true,
  collectName: true,
  collectUPIUTR: true,
  onTipCompleted: (data) => {
    console.log('Tip received:', {
      amount: data.amount,
      email: data.customData?.email,
      name: data.customData?.name,
      utr: data.customData?.utr
    });
    // Send to your backend or analytics
  }
});
```

### Conditional Tip Jar Display

Show tip jar only on specific pages or conditions:

```javascript
// Show tip jar only on blog posts
if (window.location.pathname.startsWith('/blog/')) {
  ChaiPe.init({
    upiId: 'yourname@upi',
    name: 'Your Name',
    tipJar: true
  });
}

// Show tip jar after user reads for 2 minutes
setTimeout(() => {
  ChaiPe.showTipJar();
}, 120000);
```

## Tip Jar Best Practices

### When to Use Tip Jar vs Behavioral Triggers

**Use Tip Jar When:**
- You want a constant, non-intrusive tipping option
- Your content is evergreen and users return frequently
- You want to maximize visibility of tipping option
- Behavioral triggers might feel too aggressive

**Use Behavioral Triggers When:**
- You want to show prompts at optimal engagement moments
- Your content has a clear reading journey
- You want to avoid visual clutter
- You're targeting first-time visitors

**Use Both Together:**
```javascript
ChaiPe.init({
  upiId: 'yourname@upi',
  name: 'Your Name',
  tipJar: true,              // Always visible
  triggers: {
    scrollDepth: 70,         // Also show modal at 70% scroll
    timeOnPage: 120          // Or after 2 minutes
  }
});
```

### Positioning for Best UX

**Bottom-Right (Default)**
- Best for most use cases
- Doesn't interfere with navigation
- Familiar pattern for users

**Bottom-Left**
- Good for RTL languages
- Avoids conflict with chat widgets

**Top-Right**
- High visibility
- Good for urgent calls-to-action
- May interfere with navigation menus

**Top-Left**
- Alternative for RTL languages
- Less common pattern

### Choosing Size and Color

**Size Guidelines:**
- `small`: Minimal footprint, good for professional sites
- `medium` (default): Balanced visibility and subtlety
- `large`: Maximum visibility, good for campaigns

**Color Guidelines:**
- Match your brand colors for consistency
- Use contrasting colors for better visibility
- Consider accessibility (WCAG AA contrast ratio)
- Test on different backgrounds

### Accessibility Considerations

```javascript
ChaiPe.init({
  upiId: 'yourname@upi',
  name: 'Your Name',
  tipJar: true,
  tipJarText: 'Tip the creator',  // Clear, descriptive text
  tipJarIcon: '☕',                 // Icon + text combination
  tipJarSize: 'medium'             // Adequate touch target size
});
```

**Accessibility Best Practices:**
- Always provide `tipJarText` for screen readers
- Use `medium` or `large` size for adequate touch targets (44px+)
- Ensure sufficient color contrast
- Test with keyboard navigation

### Mobile vs Desktop Recommendations

**Mobile:**
- Use `medium` or `large` size for touch-friendly targets
- Consider `bottom-right` or `bottom-left` to avoid thumb strain
- Enable `tipJarShowOnMobile: true` for mobile users
- Test on actual devices for touch responsiveness

**Desktop:**
- `small` or `medium` size works well
- All positions are viable
- Enable `tipJarShowOnDesktop: true` for desktop users
- Consider screen real estate and existing UI elements

### Performance Tips

```javascript
// Lazy load tip jar after initial page load
window.addEventListener('load', () => {
  setTimeout(() => {
    ChaiPe.init({
      upiId: 'yourname@upi',
      name: 'Your Name',
      tipJar: true
    });
  }, 1000); // 1 second delay
});

// Hide tip jar during heavy operations
function performHeavyTask() {
  ChaiPe.hideTipJar();
  // ... heavy task
  ChaiPe.showTipJar();
}
```

## Tip Jar FAQ

### Common Questions

**Q: Can I use tip jar and behavioral triggers together?**
A: Yes! You can enable both `tipJar: true` and configure `triggers` for the best of both worlds.

**Q: Will tip jar interfere with my existing UI?**
A: The tip jar is positioned with CSS and includes z-index management. Choose a position that doesn't conflict with your existing elements.

**Q: Can I change the tip jar appearance after initialization?**
A: Yes, use `ChaiPe.updateTipJar(options)` to dynamically update any tipJar configuration option.

**Q: Does tip jar work on mobile devices?**
A: Yes, tip jar is fully responsive. Use `tipJarShowOnMobile` and `tipJarShowOnDesktop` to control visibility per device type.

**Q: What's the difference between tip jar and the floating theme?**
A: Tip jar is a persistent button that's always visible. The floating theme affects how the payment modal appears when triggered.

**Q: Can I use custom icons or images?**
A: Yes, `tipJarIcon` accepts any emoji or text. For custom images, you can modify the CSS after initialization.

**Q: How do I track tip jar interactions?**
A: Use the `onTipCompleted` callback to track when users complete tips through the tip jar.

**Q: Is tip jar accessible to screen readers?**
A: Yes, ensure you provide `tipJarText` for screen readers. The button includes proper ARIA attributes.

**Q: Can I hide tip jar on specific pages?**
A: Yes, initialize ChaiPe without `tipJar: true` on pages where you don't want it, or use `ChaiPe.hideTipJar()` programmatically.

**Q: What's the performance impact of tip jar?**
A: Minimal. The tip jar is lightweight and only adds a single DOM element. It doesn't impact page load performance.

### Troubleshooting

**Tip jar not appearing:**
- Ensure `tipJar: true` is set in configuration
- Check that `tipJarShowOnMobile` and `tipJarShowOnDesktop` are enabled for your device
- Verify no CSS is hiding the button (check z-index conflicts)
- Ensure ChaiPe initialized successfully (check console for errors)

**Tip jar positioned incorrectly:**
- Check for conflicting CSS in your stylesheet
- Verify `tipJarPosition` is set correctly
- Test different positions to find the best fit

**Tip jar not responding to clicks:**
- Check for JavaScript errors in console
- Ensure no other elements are covering the button (z-index issue)
- Verify ChaiPe initialized properly

**Tip jar color not applying:**
- Ensure color format is valid (hex, rgb, or named color)
- Check for CSS specificity conflicts
- Try a different color to test

**Tip jar text not showing:**
- Ensure `tipJarText` is set in configuration
- For `small` size, text may not be visible by design
- Try `medium` or `large` size to show text

## ES Module Usage

```javascript
import { ChaiPe } from 'chaipe';

ChaiPe.init({
  upiId: 'yourname@upi',
  name: 'Your Name',
  tipJar: true
});
```

## License

MIT

---

Made with ☕ for Indian creators
