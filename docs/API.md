# ChaiPe API Reference

Complete API reference for ChaiPe, a lightweight UPI micropayment library.

## Static Methods

### `ChaiPe.init(config)`

Initializes ChaiPe with the provided configuration. Creates a singleton instance that is reused on subsequent calls.

**Parameters:**
- `config` (object) - Configuration object. See [Configuration Guide](CONFIGURATION.md) for all options.

**Returns:**
- `undefined`

**Example:**
```javascript
ChaiPe.init({
  upiId: 'yourname@upi',
  name: 'Your Name',
  amounts: [10, 25, 50, 100],
  theme: 'minimal'
});
```

---

### `ChaiPe.show()`

Manually displays the tip modal. Useful for custom triggers or user-initiated actions.

**Parameters:**
- None

**Returns:**
- `undefined`

**Example:**
```javascript
document.getElementById('tip-button').addEventListener('click', () => {
  ChaiPe.show();
});
```

---

### `ChaiPe.dismiss()`

Dismisses/hides the currently visible tip modal.

**Parameters:**
- None

**Returns:**
- `undefined`

**Example:**
```javascript
ChaiPe.dismiss();
```

---

### `ChaiPe.confirmPayment(amount)`

Confirms that a payment was completed. This method is typically called automatically by the library when the user confirms payment, but can be called manually if needed.

**Parameters:**
- `amount` (number) - The payment amount to confirm

**Returns:**
- `undefined`

**Example:**
```javascript
ChaiPe.confirmPayment(50);
```

---

### `ChaiPe.generateUpiLink({ amount })`

Generates a UPI payment link for the specified amount. Useful for creating custom payment buttons or links.

**Parameters:**
- `options` (object)
  - `amount` (number) - The payment amount

**Returns:**
- `string` - The UPI payment link

**Example:**
```javascript
const link = ChaiPe.generateUpiLink({ amount: 100 });
console.log(link); // upi://pay?pa=yourname@upi&pn=Your+Name&am=100&cu=INR&tn=...
```

---

## TipJar API Methods

### `ChaiPe.showTipJar()`

Displays the persistent tip jar button. Use this if you initially disabled the tip jar or hid it programmatically.

**Parameters:**
- None

**Returns:**
- `undefined`

**Example:**
```javascript
// Show tip jar after user completes an action
document.getElementById('read-more').addEventListener('click', () => {
  ChaiPe.showTipJar();
});
```

---

### `ChaiPe.hideTipJar()`

Hides the persistent tip jar button. Useful for temporarily removing the button during specific user flows.

**Parameters:**
- None

**Returns:**
- `undefined`

**Example:**
```javascript
// Hide tip jar during checkout process
function startCheckout() {
  ChaiPe.hideTipJar();
  // ... checkout logic
}
```

---

### `ChaiPe.toggleTipJar()`

Toggles the tip jar's visibility state. If the tip jar is hidden, it will be shown. If it's visible, it will be hidden.

**Parameters:**
- None

**Returns:**
- `undefined`

**Example:**
```javascript
document.getElementById('toggle-tipjar').addEventListener('click', () => {
  ChaiPe.toggleTipJar();
});
```

---

### `ChaiPe.openTipJar()`

Opens the tip jar and displays the payment modal. This is equivalent to clicking the tip jar button.

**Parameters:**
- None

**Returns:**
- `undefined`

**Example:**
```javascript
document.getElementById('tip-now').addEventListener('click', () => {
  ChaiPe.openTipJar();
});
```

---

### `ChaiPe.closeTipJar()`

Closes the tip jar. This is different from hiding - it removes the tip jar from the DOM.

**Parameters:**
- None

**Returns:**
- `undefined`

**Example:**
```javascript
ChaiPe.closeTipJar();
```

---

### `ChaiPe.removeTipJar()`

Removes the tip jar from the DOM completely. This is useful when you want to permanently remove the tip jar.

**Parameters:**
- None

**Returns:**
- `undefined`

**Example:**
```javascript
ChaiPe.removeTipJar();
```

---

### `ChaiPe.updateTipJar(options)`

Updates the tip jar configuration dynamically without re-initializing ChaiPe. Accepts any tipJar configuration option.

**Parameters:**
- `options` (object) - TipJar configuration options to update. See [Configuration Guide](CONFIGURATION.md#tipjar-configuration) for available options.

**Returns:**
- `undefined`

**Example:**
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

---

## Event Callbacks

ChaiPe provides several callback functions that you can use to track user interactions and payment events.

### `onNudgeShown(data)`

Called when the behavioral nudge modal is displayed to the user.

**Parameters:**
- `data` (object)
  - `sessionId` (string) - Unique session identifier

**Example:**
```javascript
ChaiPe.init({
  upiId: 'yourname@upi',
  onNudgeShown: (data) => {
    console.log('Nudge shown', data.sessionId);
    // Track with your analytics
    analytics.track('Nudge Shown', { sessionId: data.sessionId });
  }
});
```

---

### `onNudgeDismissed(data)`

Called when the user dismisses the nudge modal without completing a payment.

**Parameters:**
- `data` (object)
  - `sessionId` (string) - Unique session identifier

**Example:**
```javascript
ChaiPe.init({
  upiId: 'yourname@upi',
  onNudgeDismissed: (data) => {
    console.log('Nudge dismissed');
    analytics.track('Nudge Dismissed', { sessionId: data.sessionId });
  }
});
```

---

### `onTipCompleted(data)`

Called when a user successfully completes a payment.

**Parameters:**
- `data` (object)
  - `amount` (number) - The payment amount
  - `sessionId` (string) - Unique session identifier
  - `customData` (object) - Optional collected data (email, name, phone, VPA, UTR)

**Example:**
```javascript
ChaiPe.init({
  upiId: 'yourname@upi',
  onTipCompleted: (data) => {
    console.log('Tip received!', data.amount, data.customData);
    // Send to your analytics or backend
    analytics.track('Tip Completed', {
      amount: data.amount,
      email: data.customData?.email,
      name: data.customData?.name,
      utr: data.customData?.utr
    });
  }
});
```

---

### `onTipJarShown(data)`

Called when the tip jar is displayed to the user.

**Parameters:**
- `data` (object)
  - `sessionId` (string) - Unique session identifier

**Example:**
```javascript
ChaiPe.init({
  upiId: 'yourname@upi',
  tipJar: true,
  onTipJarShown: (data) => {
    console.log('Tip jar shown');
    analytics.track('Tip Jar Shown', { sessionId: data.sessionId });
  }
});
```

---

### `onTipJarDismissed(data)`

Called when the tip jar is dismissed or hidden.

**Parameters:**
- `data` (object)
  - `sessionId` (string) - Unique session identifier

**Example:**
```javascript
ChaiPe.init({
  upiId: 'yourname@upi',
  tipJar: true,
  onTipJarDismissed: (data) => {
    console.log('Tip jar dismissed');
    analytics.track('Tip Jar Dismissed', { sessionId: data.sessionId });
  }
});
```

---

### `onTipJarOpened(data)`

Called when the user clicks the tip jar and opens the payment modal.

**Parameters:**
- `data` (object)
  - `sessionId` (string) - Unique session identifier

**Example:**
```javascript
ChaiPe.init({
  upiId: 'yourname@upi',
  tipJar: true,
  onTipJarOpened: (data) => {
    console.log('Tip jar opened');
    analytics.track('Tip Jar Opened', { sessionId: data.sessionId });
  }
});
```

---

## Complete Example

```javascript
import { ChaiPe } from 'chaipe';

ChaiPe.init({
  upiId: 'yourname@upi',
  name: 'Your Name',
  amounts: [10, 25, 50, 100],
  theme: 'minimal',
  tipJar: true,
  
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

// Manual control
document.getElementById('custom-tip-button').addEventListener('click', () => {
  ChaiPe.show();
});

// Generate custom payment link
const paymentLink = ChaiPe.generateUpiLink({ amount: 50 });
```

---

## Related Documentation

- [Configuration Guide](CONFIGURATION.md) - Complete configuration options
- [TipJar Guide](TIPJAR.md) - TipJar usage and best practices
- [Development Guide](DEVELOPMENT.md) - Development setup and contribution
