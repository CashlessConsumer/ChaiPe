/**
 * ChaiPe.js - Main Entry Point (ES Module)
 * Behavioral UPI Micropayments Library
 * @version 1.0.0
 * @license MIT
 */

import { ChaiPeCore } from './lib/core.js';
import { QRCode } from './lib/qrcode.js';
import { STYLES } from './lib/styles.js';

/**
 * Static API for ChaiPe
 * Provides a simple interface for initializing and controlling the payment modal
 */
const ChaiPe = {
    _instance: null,

    /**
     * Initialize ChaiPe with configuration
     * @param {Object} config - Configuration options
     * @param {string} config.upiId - Your UPI ID (required)
     * @param {string} [config.name='Creator'] - Display name
     * @param {number[]} [config.amounts=[10,25,50,100]] - Preset tip amounts
     * @param {string} [config.theme='minimal'] - Modal theme: 'minimal', 'toast', 'floating'
     * @param {string} [config.message='Enjoying the content?'] - Nudge message
     * @param {string} [config.buttonText='Buy me a coffee ☕'] - Button text
     * @param {Function} [config.onTipCompleted] - Callback when tip is completed
     * @param {Function} [config.onNudgeShown] - Callback when nudge is shown
     * @param {Function} [config.onNudgeDismissed] - Callback when nudge is dismissed
     * @param {boolean} [config.collectEmail=false] - Collect email address
     * @param {boolean} [config.collectName=false] - Collect name
     * @param {boolean} [config.collectPhoneNumber=false] - Collect phone number
     * @param {boolean} [config.collectVPA=false] - Collect UPI VPA
     * @param {boolean} [config.collectUPIUTR=false] - Collect UPI transaction ID
     * @param {Object} [config.triggers] - Behavioral trigger settings
     * @param {number} [config.triggers.scrollDepth=70] - Scroll depth percentage to trigger
     * @param {number} [config.triggers.timeOnPage=120] - Seconds on page to trigger
     * @param {boolean} [config.triggers.exitIntent=false] - Enable exit intent detection
     * @param {boolean} [config.manualOnly=false] - Only show via manual show() call
     * @param {boolean} [config.tipJar=false] - Enable persistent TipJar floating button
     * @param {string} [config.tipJarIcon='☕'] - Custom icon for TipJar
     * @param {string} [config.tipJarPosition='bottom-right'] - Position: 'bottom-right', 'bottom-left', 'top-right', 'top-left'
     * @param {string} [config.tipJarSize='medium'] - Size: 'small', 'medium', 'large'
     * @param {string} [config.tipJarColor='#4CAF50'] - Background color
     * @param {string} [config.tipJarText='Buy me a chai ☕'] - Tooltip text
     * @param {boolean} [config.tipJarShowOnMobile=true] - Show TipJar on mobile devices
     * @param {boolean} [config.tipJarShowOnDesktop=true] - Show TipJar on desktop devices
     * @returns {ChaiPeCore} The initialized instance
     */
    init: function (config) {
        if (!this._instance) {
            this._instance = new ChaiPeCore();
        }
        this._instance.init(config);
        return this._instance;
    },

    /**
     * Manually show the payment modal
     */
    show: function () {
        if (this._instance) {
            this._instance.show();
        }
    },

    /**
     * Dismiss the payment modal
     */
    dismiss: function () {
        if (this._instance) {
            this._instance.dismiss();
        }
    },

    /**
     * Confirm that payment was completed
     * @param {number} amount - The amount that was paid
     */
    confirmPayment: function (amount) {
        if (this._instance) {
            this._instance.confirmPayment(amount);
        }
    },

    /**
     * Generate a UPI payment link
     * @param {Object} options - Options with amount
     * @returns {string|null} The UPI link or null if not initialized
     */
    generateUpiLink: function (options) {
        if (this._instance) {
            return this._instance.generateUpiLink(options?.amount || 10);
        }
        return null;
    },

    /**
     * Show the TipJar floating button
     */
    showTipJar: function () {
        if (this._instance) {
            this._instance.showTipJar();
        }
    },

    /**
     * Hide the TipJar floating button
     */
    hideTipJar: function () {
        if (this._instance) {
            this._instance.hideTipJar();
        }
    },

    /**
     * Update TipJar configuration dynamically
     * @param {Object} options - Configuration options to update
     * @param {string} [options.tipJarIcon] - Custom icon for TipJar
     * @param {string} [options.tipJarPosition] - Position: 'bottom-right', 'bottom-left', 'top-right', 'top-left'
     * @param {string} [options.tipJarSize] - Size: 'small', 'medium', 'large'
     * @param {string} [options.tipJarColor] - Background color
     * @param {string} [options.tipJarText] - Tooltip text
     * @param {boolean} [options.tipJarShowOnMobile] - Show TipJar on mobile devices
     * @param {boolean} [options.tipJarShowOnDesktop] - Show TipJar on desktop devices
     */
    updateTipJar: function (options) {
        if (this._instance) {
            this._instance.updateTipJar(options);
        }
    },

    // Expose internal components for advanced usage
    ChaiPeCore: ChaiPeCore,
    QRCode: QRCode,
    STYLES: STYLES,

    // Version info
    version: '1.0.0'
};

// Named exports for ES module usage
export { ChaiPe, ChaiPeCore, QRCode, STYLES };
export default ChaiPe;
