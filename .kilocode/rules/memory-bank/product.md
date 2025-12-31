# ChaiPe Product Documentation

## Why This Project Exists

ChaiPe addresses the monetization challenge faced by Indian content creators, bloggers, and publishers who need to accept small payments (₹10-₹100) from their audience. Traditional payment gateways have high transaction fees and complex onboarding make micropayments impractical.

## Problems It Solves

1. **High Transaction Costs**: Payment gateways typically charge 2-3% + GST, making small tips unviable
2. **Complex Setup**: Requiring merchant accounts, KYC, and integration work
3. **Poor UX**: Interruptive donation forms that break reading flow
4. **Mobile-First Gap**: India's mobile-first audience needs seamless mobile payment experience
5. **Tip First**: Gives user the choice to tip, trusts them if they have made payment, no backend verification needed.

## How It Works

ChaiPe uses behavioral nudging and persistent tip jars to show payment prompts at optimal moments:

### Behavioral Nudges
- **Scroll Depth**: When user has read 70% of content (configurable)
- **Time on Page**: After 2 minutes of engagement (configurable)
- **Exit Intent**: When user is about to leave (desktop only, optional)
- **Manual Trigger**: Via `ChaiPe.show()` API call

### TipJar (Persistent Payment Button)
- **Floating Button**: Always-visible button fixed to viewport corners
- **Inline Widget**: Embedded widget within page content
- **Custom Container**: User-defined container element
- **Auto-Show**: Configurable delay before showing tipJar
- **Manual Control**: API methods to show, hide, toggle, or remove tipJar

### Payment Flow

1. **Mobile**: Deep link to UPI app (GPay, PhonePe, Paytm, etc.)
2. **Desktop**: QR code that can be scanned with any UPI app
3. **Confirmation**: User confirms payment completion
4. **Callback**: `onTipCompleted` event fires with payment details

## User Experience Goals

- **Non-Intrusive**: Nudges appear at natural breakpoints, not interrupting reading
- **Persistent Option**: TipJar provides always-available payment option without being intrusive
- **Frictionless**: One-click payment on mobile, scan-and-pay on desktop
- **Trustworthy**: No data collection beyond what's explicitly enabled
- **Fast**: < 25KB minified, instant loading
- **Accessible**: Works without JavaScript frameworks, pure vanilla JS
- **Customizable**: Three themes (minimal, toast, floating) with dark mode
- **Flexible tipJar**: Configurable positioning, colors, sizes, icons, and animations

## Target Users

- Bloggers and content publishers in India
- Open source maintainers seeking donations
- News websites with paywall alternatives
- Educational content creators
- Any creator with Indian audience

## Key Differentiators

- **Payment Aggregator-less**: Direct UPI links, no payment gateway integration needed
- **Behavioral Intelligence**: Smart triggers based on user engagement
- **Persistent TipJar**: Always-available payment option with flexible positioning and customization
- **Zero Dependencies**: Pure JavaScript, no external libraries
- **Privacy-First**: No tracking, no analytics, no external services
- **Open Source**: MIT licensed, fully transparent
