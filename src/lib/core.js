/**
 * ChaiPe.js - Core Module
 * Main ChaiPeCore class with behavioral tracking and payment UI
 * @module lib/core
 */

import { QRCode } from './qrcode.js';
import { STYLES } from './styles.js';

/**
 * ChaiPeCore - Main class handling payment modals and behavioral tracking
 */
export class ChaiPeCore {
    constructor() {
        this.config = null;
        this.sessionId = this._generateSessionId();
        this.heuristics = {
            scrollDepth: 0,
            timeOnPage: 0,
            isReturnVisitor: false,
            interactions: 0,
            articleCompleted: false
        };
        this.hasShownNudge = false;
        this.isMobile = this._detectMobile();
        this.paymentInProgress = false;
        this.selectedAmount = null;
        this.collectedData = {};
        
        // TipJar state
        this.tipJarElement = null;
        this.tipJarVisible = false;
    }

    _generateSessionId() {
        return 'np_' + Math.random().toString(36).substr(2, 9);
    }

    _detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    init(config) {
        this.config = {
            upiId: config.upiId,
            name: config.name || 'Creator',
            amounts: config.amounts || [10, 25, 50, 100],
            theme: config.theme || 'minimal',
            message: config.message || 'Enjoying the content?',
            buttonText: config.buttonText || 'Buy me a coffee ☕',
            currency: config.currency || 'INR',
            transactionNote: config.transactionNote || 'Tip via ChaiPe',

            // Callbacks
            onTipCompleted: config.onTipCompleted || null,
            onNudgeShown: config.onNudgeShown || null,
            onNudgeDismissed: config.onNudgeDismissed || null,

            // Data collection
            collectEmail: config.collectEmail || false,
            collectName: config.collectName || false,
            collectPhoneNumber: config.collectPhoneNumber || false,
            collectVPA: config.collectVPA || false,
            collectUPIUTR: config.collectUPIUTR || false,

            // Trigger settings
            triggers: {
                scrollDepth: config.triggers?.scrollDepth ?? 70,
                timeOnPage: config.triggers?.timeOnPage ?? 120,
                exitIntent: config.triggers?.exitIntent ?? false,
                ...config.triggers
            },

            // Manual mode
            manualOnly: config.manualOnly || false,

            // TipJar settings
            tipJar: config.tipJar || false,
            tipJarIcon: config.tipJarIcon || '☕',
            tipJarPosition: config.tipJarPosition || 'bottom-right',
            tipJarSize: config.tipJarSize || 'medium',
            tipJarColor: config.tipJarColor || '#4CAF50',
            tipJarText: config.tipJarText || 'Buy me a chai ☕',
            tipJarShowOnMobile: config.tipJarShowOnMobile !== undefined ? config.tipJarShowOnMobile : true,
            tipJarShowOnDesktop: config.tipJarShowOnDesktop !== undefined ? config.tipJarShowOnDesktop : true
        };

        this._injectStyles();
        this._checkReturnVisitor();

        if (!this.config.manualOnly) {
            this._startTracking();
        }

        // Initialize TipJar if enabled
        if (this.config.tipJar) {
            this._renderTipJar();
        }

        try {
            localStorage.setItem('ChaiPe_visited', 'true');
        } catch (e) { }

        console.log('ChaiPe initialized', { sessionId: this.sessionId, isMobile: this.isMobile });
        return this;
    }

    _injectStyles() {
        if (document.getElementById('ChaiPe-styles')) return;
        const style = document.createElement('style');
        style.id = 'ChaiPe-styles';
        style.textContent = STYLES;
        document.head.appendChild(style);
    }

    _checkReturnVisitor() {
        try {
            this.heuristics.isReturnVisitor = localStorage.getItem('ChaiPe_visited') === 'true';
        } catch (e) {
            this.heuristics.isReturnVisitor = false;
        }
    }

    _startTracking() {
        let maxScroll = 0;
        const trackScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;

            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                this.heuristics.scrollDepth = maxScroll;
                this._checkTriggers();
            }
        };
        window.addEventListener('scroll', trackScroll, { passive: true });

        const startTime = Date.now();
        setInterval(() => {
            this.heuristics.timeOnPage = Math.floor((Date.now() - startTime) / 1000);
            this._checkTriggers();
        }, 5000);

        document.addEventListener('click', () => {
            this.heuristics.interactions++;
        });

        if (!this.isMobile && this.config.triggers.exitIntent) {
            document.addEventListener('mouseout', (e) => {
                if (e.clientY <= 0 && !this.hasShownNudge) {
                    this.show();
                }
            });
        }
    }

    _checkTriggers() {
        if (this.hasShownNudge || this.config.manualOnly) return;

        const { scrollDepth, timeOnPage } = this.config.triggers;

        if (this.heuristics.scrollDepth >= scrollDepth) {
            this.show();
            return;
        }

        if (this.heuristics.timeOnPage >= timeOnPage) {
            this.show();
            return;
        }

        if (this.heuristics.isReturnVisitor &&
            this.heuristics.scrollDepth >= 50 &&
            this.heuristics.timeOnPage >= 60) {
            this.show();
            return;
        }
    }

    generateUpiLink(amount) {
        const params = new URLSearchParams({
            pa: this.config.upiId,
            pn: this.config.name,
            am: amount.toString(),
            cu: this.config.currency,
            tn: this.config.transactionNote
        });
        return `upi://pay?${params.toString()}`;
    }

    show() {
        if (this.hasShownNudge) {
            this.hasShownNudge = false; // Allow re-showing
        }
        this.hasShownNudge = true;
        this.selectedAmount = this.config.amounts[1] || this.config.amounts[0];

        this._renderModal();

        if (this.config.onNudgeShown) {
            this.config.onNudgeShown({ sessionId: this.sessionId });
        }
    }

    _renderModal() {
        this._removeModal();

        const needsDataCollection = this.config.collectEmail ||
            this.config.collectName ||
            this.config.collectPhoneNumber ||
            this.config.collectVPA;

        const overlay = document.createElement('div');
        overlay.className = 'ChaiPe-overlay';
        overlay.id = 'ChaiPe-overlay';
        document.body.appendChild(overlay);

        const modal = document.createElement('div');
        modal.className = `ChaiPe-modal theme-${this.config.theme}`;
        modal.id = 'ChaiPe-modal';

        modal.innerHTML = `
        <button class="ChaiPe-close" onclick="ChaiPe.dismiss()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
        
        <div class="ChaiPe-header">
          <div class="ChaiPe-icon">☕</div>
          <h3 class="ChaiPe-title">${this.config.message}</h3>
          <p class="ChaiPe-subtitle">Support ${this.config.name}'s work</p>
        </div>
        
        <div class="ChaiPe-amounts" id="ChaiPe-amounts">
          ${this.config.amounts.map(amt => `
            <button class="ChaiPe-amount ${amt === this.selectedAmount ? 'selected' : ''}" 
                    data-amount="${amt}">₹${amt}</button>
          `).join('')}
        </div>
        
        <input type="number" 
               class="ChaiPe-custom-input" 
               id="ChaiPe-custom" 
               placeholder="Or enter custom amount"
               min="1">
        
        ${needsDataCollection ? this._renderDataForm() : ''}
        
        <button class="ChaiPe-btn ChaiPe-btn-primary" id="ChaiPe-pay">
          ${this.config.buttonText}
        </button>
      `;

        document.body.appendChild(modal);

        requestAnimationFrame(() => {
            overlay.classList.add('active');
            modal.classList.add('active');
        });

        this._attachModalEvents();
    }

    _renderDataForm() {
        let html = '<div class="ChaiPe-divider"><span>Your details (optional)</span></div>';

        if (this.config.collectName) {
            html += `
          <div class="ChaiPe-form-group">
            <label>Your Name</label>
            <input type="text" id="ChaiPe-name" placeholder="John Doe">
          </div>
        `;
        }

        if (this.config.collectEmail) {
            html += `
          <div class="ChaiPe-form-group">
            <label>Email</label>
            <input type="email" id="ChaiPe-email" placeholder="you@example.com">
          </div>
        `;
        }

        if (this.config.collectPhoneNumber) {
            html += `
          <div class="ChaiPe-form-group">
            <label>Phone Number</label>
            <input type="tel" id="ChaiPe-phone" placeholder="+91 98765 43210">
          </div>
        `;
        }

        if (this.config.collectVPA) {
            html += `
          <div class="ChaiPe-form-group">
            <label>Your UPI ID</label>
            <input type="text" id="ChaiPe-vpa" placeholder="yourname@upi">
          </div>
        `;
        }

        return html;
    }

    _attachModalEvents() {
        const amountBtns = document.querySelectorAll('.ChaiPe-amount');
        amountBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                amountBtns.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.selectedAmount = parseInt(btn.dataset.amount);
                document.getElementById('ChaiPe-custom').value = '';
            });
        });

        const customInput = document.getElementById('ChaiPe-custom');
        customInput.addEventListener('input', (e) => {
            if (e.target.value) {
                this.selectedAmount = parseInt(e.target.value) || this.selectedAmount;
                amountBtns.forEach(b => b.classList.remove('selected'));
            }
        });

        const payBtn = document.getElementById('ChaiPe-pay');
        payBtn.addEventListener('click', () => this._initiatePayment());

        const overlay = document.getElementById('ChaiPe-overlay');
        overlay.addEventListener('click', () => this.dismiss());
    }

    _collectFormData() {
        const data = {};

        if (this.config.collectName) {
            const el = document.getElementById('ChaiPe-name');
            if (el && el.value) data.name = el.value;
        }
        if (this.config.collectEmail) {
            const el = document.getElementById('ChaiPe-email');
            if (el && el.value) data.email = el.value;
        }
        if (this.config.collectPhoneNumber) {
            const el = document.getElementById('ChaiPe-phone');
            if (el && el.value) data.phoneNumber = el.value;
        }
        if (this.config.collectVPA) {
            const el = document.getElementById('ChaiPe-vpa');
            if (el && el.value) data.vpa = el.value;
        }

        this.collectedData = data;
        return data;
    }

    _initiatePayment() {
        this._collectFormData();
        const amount = this.selectedAmount;

        if (this.isMobile) {
            this._initiateMobilePayment(amount);
        } else {
            this._showQRCode(amount);
        }
    }

    _initiateMobilePayment(amount) {
        const upiLink = this.generateUpiLink(amount);

        this.paymentInProgress = true;
        const paymentStartTime = Date.now();

        window.location.href = upiLink;

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && this.paymentInProgress) {
                this.paymentInProgress = false;
                document.removeEventListener('visibilitychange', handleVisibilityChange);

                setTimeout(() => {
                    this._showMobileConfirmation(amount, paymentStartTime);
                }, 500);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    _showMobileConfirmation(amount, startTime) {
        const modal = document.getElementById('ChaiPe-modal');
        if (!modal) return;

        const needsUTR = this.config.collectUPIUTR;

        modal.innerHTML = `
        <button class="ChaiPe-close" onclick="ChaiPe.dismiss()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
        
        <div class="ChaiPe-header">
          <div class="ChaiPe-icon">🙏</div>
          <h3 class="ChaiPe-title">Did you complete the payment?</h3>
          <p class="ChaiPe-subtitle">Amount: ₹${amount}</p>
        </div>
        
        ${needsUTR ? `
          <div class="ChaiPe-form-group">
            <label>UPI Transaction ID (UTR) - Optional</label>
            <input type="text" id="ChaiPe-utr" placeholder="Enter UTR for your records">
          </div>
        ` : ''}
        
        <button class="ChaiPe-btn ChaiPe-btn-confirm" onclick="ChaiPe.confirmPayment(${amount})">
          Yes, I've Paid! 🎉
        </button>
        
        <button class="ChaiPe-btn" style="background: #f0f0f0; color: #666; margin-top: 8px;" 
                onclick="ChaiPe.dismiss()">
          Not Yet
        </button>
      `;
    }

    _showQRCode(amount) {
        const upiLink = this.generateUpiLink(amount);
        const qrDataUrl = QRCode.generate(upiLink, 200);

        const modal = document.getElementById('ChaiPe-modal');
        if (!modal) return;

        const needsUTR = this.config.collectUPIUTR;

        modal.innerHTML = `
        <button class="ChaiPe-close" onclick="ChaiPe.dismiss()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
        
        <div class="ChaiPe-header">
          <h3 class="ChaiPe-title">Scan to Pay ₹${amount}</h3>
          <p class="ChaiPe-subtitle">Use any UPI app to scan</p>
        </div>
        
        <div class="ChaiPe-qr-container">
          <img src="${qrDataUrl}" alt="UPI QR Code">
          <p class="ChaiPe-qr-hint">GPay • PhonePe • Paytm • Any UPI App</p>
        </div>
        
        ${needsUTR ? `
          <div class="ChaiPe-form-group">
            <label>UPI Transaction ID (UTR) - Optional</label>
            <input type="text" id="ChaiPe-utr" placeholder="Enter UTR for your records">
          </div>
        ` : ''}
        
        <button class="ChaiPe-btn ChaiPe-btn-confirm" onclick="ChaiPe.confirmPayment(${amount})">
          I've Paid ✓
        </button>
      `;
    }

    confirmPayment(amount) {
        if (this.config.collectUPIUTR) {
            const utrEl = document.getElementById('ChaiPe-utr');
            if (utrEl && utrEl.value) {
                this.collectedData.upiUTR = utrEl.value;
            }
        }

        this._showSuccess(amount);

        if (this.config.onTipCompleted) {
            this.config.onTipCompleted({
                amount,
                currency: this.config.currency,
                timestamp: new Date().toISOString(),
                sessionId: this.sessionId,
                isReturnVisitor: this.heuristics.isReturnVisitor,
                customData: this.collectedData
            });
        }

        try {
            localStorage.setItem('ChaiPe_supporter', 'true');
        } catch (e) { }
    }

    _showSuccess(amount) {
        const modal = document.getElementById('ChaiPe-modal');
        if (!modal) return;

        modal.innerHTML = `
        <div class="ChaiPe-success">
          <div class="ChaiPe-success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          <h3 class="ChaiPe-title">Thank You! 🎉</h3>
          <p class="ChaiPe-subtitle">Your support of ₹${amount} means a lot!</p>
        </div>
      `;

        setTimeout(() => this.dismiss(), 3000);
    }

    dismiss() {
        const overlay = document.getElementById('ChaiPe-overlay');
        const modal = document.getElementById('ChaiPe-modal');

        if (overlay) overlay.classList.remove('active');
        if (modal) modal.classList.remove('active');

        setTimeout(() => {
            this._removeModal();
        }, 300);

        if (this.config?.onNudgeDismissed) {
            this.config.onNudgeDismissed({ sessionId: this.sessionId });
        }
    }

    _removeModal() {
        const overlay = document.getElementById('ChaiPe-overlay');
        const modal = document.getElementById('ChaiPe-modal');
        if (overlay) overlay.remove();
        if (modal) modal.remove();
    }

    /**
     * Render the TipJar persistent floating button
     * @private
     */
    _renderTipJar() {
        // Check if TipJar should be shown on current device
        const shouldShow = this.isMobile ? this.config.tipJarShowOnMobile : this.config.tipJarShowOnDesktop;
        if (!shouldShow) {
            return;
        }

        // Remove existing TipJar if any
        this._removeTipJar();

        // Get size in pixels
        const sizeMap = {
            small: 48,
            medium: 56,
            large: 64
        };
        const size = sizeMap[this.config.tipJarSize] || 56;

        // Get position styles
        const positionStyles = this._getTipJarPositionStyles();

        // Create TipJar element
        const tipJar = document.createElement('div');
        tipJar.id = 'ChaiPe-tipJar';
        tipJar.className = 'ChaiPe-tipJar';
        tipJar.setAttribute('role', 'button');
        tipJar.setAttribute('aria-label', this.config.tipJarText);
        tipJar.setAttribute('tabindex', '0');
        
        // Apply inline styles (CSS will be added in separate task)
        tipJar.style.cssText = `
            position: fixed;
            ${positionStyles}
            width: ${size}px;
            height: ${size}px;
            background-color: ${this.config.tipJarColor};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 9998;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transition: all 0.3s ease;
            font-size: ${size * 0.5}px;
            opacity: 0;
            transform: translateY(20px);
            pointer-events: none;
        `;

        // Add icon
        tipJar.innerHTML = this.config.tipJarIcon;

        // Add tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'ChaiPe-tipJar-tooltip';
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 14px;
            white-space: nowrap;
            opacity: 0;
            transition: opacity 0.2s ease;
            pointer-events: none;
            z-index: 9999;
        `;
        tooltip.textContent = this.config.tipJarText;

        // Position tooltip based on tipJar position
        if (this.config.tipJarPosition.includes('bottom')) {
            tooltip.style.bottom = '100%';
            tooltip.style.marginBottom = '8px';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translateX(-50%)';
        } else {
            tooltip.style.top = '100%';
            tooltip.style.marginTop = '8px';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translateX(-50%)';
        }

        // Add tooltip to tipJar
        tipJar.appendChild(tooltip);

        // Append to document
        document.body.appendChild(tipJar);
        this.tipJarElement = tipJar;

        // Attach events
        this._attachTipJarEvents();

        // Show with animation
        this._showTipJar();
    }

    /**
     * Get position styles for TipJar based on configuration
     * @private
     * @returns {string} CSS position styles
     */
    _getTipJarPositionStyles() {
        const positions = {
            'bottom-right': 'bottom: 24px; right: 24px;',
            'bottom-left': 'bottom: 24px; left: 24px;',
            'top-right': 'top: 24px; right: 24px;',
            'top-left': 'top: 24px; left: 24px;'
        };
        return positions[this.config.tipJarPosition] || positions['bottom-right'];
    }

    /**
     * Show the TipJar button with animation
     * @private
     */
    _showTipJar() {
        if (!this.tipJarElement) return;

        this.tipJarElement.style.opacity = '1';
        this.tipJarElement.style.transform = 'translateY(0)';
        this.tipJarElement.style.pointerEvents = 'auto';
        this.tipJarVisible = true;
    }

    /**
     * Hide the TipJar button with animation
     * @private
     */
    _hideTipJar() {
        if (!this.tipJarElement) return;

        this.tipJarElement.style.opacity = '0';
        this.tipJarElement.style.transform = 'translateY(20px)';
        this.tipJarElement.style.pointerEvents = 'none';
        this.tipJarVisible = false;
    }

    /**
     * Handle TipJar click event
     * @private
     */
    _handleTipJarClick() {
        // Show payment modal
        this.show();
    }

    /**
     * Attach event listeners to TipJar
     * @private
     */
    _attachTipJarEvents() {
        if (!this.tipJarElement) return;

        // Click event
        this.tipJarElement.addEventListener('click', () => this._handleTipJarClick());

        // Keyboard accessibility
        this.tipJarElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this._handleTipJarClick();
            }
        });

        // Hover events for tooltip
        const tooltip = this.tipJarElement.querySelector('.ChaiPe-tipJar-tooltip');
        
        this.tipJarElement.addEventListener('mouseenter', () => {
            if (tooltip) {
                tooltip.style.opacity = '1';
            }
        });

        this.tipJarElement.addEventListener('mouseleave', () => {
            if (tooltip) {
                tooltip.style.opacity = '0';
            }
        });

        // Focus events for keyboard navigation
        this.tipJarElement.addEventListener('focus', () => {
            if (tooltip) {
                tooltip.style.opacity = '1';
            }
        });

        this.tipJarElement.addEventListener('blur', () => {
            if (tooltip) {
                tooltip.style.opacity = '0';
            }
        });
    }

    /**
     * Update TipJar position dynamically
     * @private
     */
    _updateTipJarPosition() {
        if (!this.tipJarElement) return;

        const positionStyles = this._getTipJarPositionStyles();
        
        // Reset position styles
        this.tipJarElement.style.bottom = '';
        this.tipJarElement.style.top = '';
        this.tipJarElement.style.left = '';
        this.tipJarElement.style.right = '';

        // Apply new position
        const styleEl = document.createElement('style');
        styleEl.textContent = `#ChaiPe-tipJar { ${positionStyles} }`;
        document.head.appendChild(styleEl);
        
        // Update tooltip position
        const tooltip = this.tipJarElement.querySelector('.ChaiPe-tipJar-tooltip');
        if (tooltip) {
            tooltip.style.bottom = '';
            tooltip.style.top = '';
            tooltip.style.marginBottom = '';
            tooltip.style.marginTop = '';

            if (this.config.tipJarPosition.includes('bottom')) {
                tooltip.style.bottom = '100%';
                tooltip.style.marginBottom = '8px';
            } else {
                tooltip.style.top = '100%';
                tooltip.style.marginTop = '8px';
            }
        }
    }

    /**
     * Remove TipJar from DOM
     * @private
     */
    _removeTipJar() {
        if (this.tipJarElement) {
            this.tipJarElement.remove();
            this.tipJarElement = null;
            this.tipJarVisible = false;
        }
    }

    /**
     * Public API: Show TipJar
     */
    showTipJar() {
        if (!this.config.tipJar) {
            console.warn('TipJar is not enabled in configuration');
            return;
        }
        
        if (!this.tipJarElement) {
            this._renderTipJar();
        } else {
            this._showTipJar();
        }
    }

    /**
     * Public API: Hide TipJar
     */
    hideTipJar() {
        if (this.tipJarElement) {
            this._hideTipJar();
        }
    }

    /**
     * Public API: Update TipJar configuration dynamically
     * @param {Object} options - Configuration options to update
     */
    updateTipJar(options) {
        if (!this.config.tipJar) {
            console.warn('TipJar is not enabled in configuration');
            return;
        }

        // Update configuration
        if (options.tipJarIcon !== undefined) {
            this.config.tipJarIcon = options.tipJarIcon;
            if (this.tipJarElement) {
                this.tipJarElement.innerHTML = this.config.tipJarIcon;
            }
        }

        if (options.tipJarPosition !== undefined) {
            this.config.tipJarPosition = options.tipJarPosition;
            this._updateTipJarPosition();
        }

        if (options.tipJarSize !== undefined) {
            this.config.tipJarSize = options.tipJarSize;
            if (this.tipJarElement) {
                const sizeMap = { small: 48, medium: 56, large: 64 };
                const size = sizeMap[this.config.tipJarSize] || 56;
                this.tipJarElement.style.width = `${size}px`;
                this.tipJarElement.style.height = `${size}px`;
                this.tipJarElement.style.fontSize = `${size * 0.5}px`;
            }
        }

        if (options.tipJarColor !== undefined) {
            this.config.tipJarColor = options.tipJarColor;
            if (this.tipJarElement) {
                this.tipJarElement.style.backgroundColor = this.config.tipJarColor;
            }
        }

        if (options.tipJarText !== undefined) {
            this.config.tipJarText = options.tipJarText;
            if (this.tipJarElement) {
                this.tipJarElement.setAttribute('aria-label', this.config.tipJarText);
                const tooltip = this.tipJarElement.querySelector('.ChaiPe-tipJar-tooltip');
                if (tooltip) {
                    tooltip.textContent = this.config.tipJarText;
                }
            }
        }

        if (options.tipJarShowOnMobile !== undefined || options.tipJarShowOnDesktop !== undefined) {
            const shouldShow = this.isMobile ?
                (options.tipJarShowOnMobile !== undefined ? options.tipJarShowOnMobile : this.config.tipJarShowOnMobile) :
                (options.tipJarShowOnDesktop !== undefined ? options.tipJarShowOnDesktop : this.config.tipJarShowOnDesktop);
            
            this.config.tipJarShowOnMobile = options.tipJarShowOnMobile !== undefined ? options.tipJarShowOnMobile : this.config.tipJarShowOnMobile;
            this.config.tipJarShowOnDesktop = options.tipJarShowOnDesktop !== undefined ? options.tipJarShowOnDesktop : this.config.tipJarShowOnDesktop;

            if (shouldShow) {
                this.showTipJar();
            } else {
                this.hideTipJar();
            }
        }
    }
}

export default ChaiPeCore;
