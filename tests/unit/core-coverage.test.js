/**
 * Additional Unit Tests for ChaiPeCore Class
 * Focuses on improving coverage for mobile payment, QR display, and tracking
 */

import { ChaiPeCore } from '../../src/lib/core.js';

describe('ChaiPeCore Class - Coverage Improvements', () => {
  let core;
  let mockConfig;

  beforeEach(() => {
    core = new ChaiPeCore();
    mockConfig = {
      upiId: 'test@upi',
      name: 'Test Creator',
      amounts: [10, 25, 50, 100],
      theme: 'minimal',
      message: 'Test message',
      buttonText: 'Test Button',
      currency: 'INR',
      transactionNote: 'Test Note',
      onTipCompleted: jest.fn(),
      onNudgeShown: jest.fn(),
      onNudgeDismissed: jest.fn(),
      collectEmail: false,
      collectName: false,
      collectPhoneNumber: false,
      collectVPA: false,
      collectUPIUTR: false,
      triggers: {
        scrollDepth: 70,
        timeOnPage: 120,
        exitIntent: false
      },
      manualOnly: false
    };
    
    document.body.innerHTML = '';
  });

  afterEach(() => {
    const modal = document.getElementById('ChaiPe-modal');
    const overlay = document.getElementById('ChaiPe-overlay');
    if (modal) modal.remove();
    if (overlay) overlay.remove();
  });

  describe('Mobile Payment Flow', () => {
    test('should initiate mobile payment on mobile device', () => {
      // Mock mobile device
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true
      });

      core = new ChaiPeCore();
      core.init(mockConfig);
      core.show();

      const payButton = document.getElementById('ChaiPe-pay');
      expect(payButton).toBeDefined();
      
      payButton.click();
      
      // Should set paymentInProgress to true
      expect(core.paymentInProgress).toBe(true);
    });

    test('should generate UPI link for mobile payment', () => {
      core.init(mockConfig);
      const upiLink = core.generateUpiLink(50);
      
      expect(upiLink).toMatch(/^upi:\/\/pay\?/);
      expect(upiLink).toContain('am=50');
    });

    test('should handle visibility change after mobile payment', (done) => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true
      });

      core = new ChaiPeCore();
      core.init(mockConfig);
      core.show();
      
      const payButton = document.getElementById('ChaiPe-pay');
      payButton.click();
      
      // Verify payment was initiated
      expect(core.paymentInProgress).toBe(true);
      
      // Simulate visibility change - need to set visibilityState
      Object.defineProperty(document, 'visibilityState', {
        value: 'visible',
        configurable: true
      });
      document.dispatchEvent(new Event('visibilitychange'));
      
      // Wait for 500ms delay in _showMobileConfirmation
      setTimeout(() => {
        // Verify mobile confirmation modal was shown
        const modal = document.getElementById('ChaiPe-modal');
        expect(modal.innerHTML).toContain('Did you complete');
        done();
      }, 600);
    });

    test('should show mobile confirmation with UTR collection', (done) => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true
      });

      const configWithUTR = {
        ...mockConfig,
        collectUPIUTR: true
      };

      core = new ChaiPeCore();
      core.init(configWithUTR);
      core.show();
      
      const payButton = document.getElementById('ChaiPe-pay');
      payButton.click();
      
      setTimeout(() => {
        document.dispatchEvent(new Event('visibilitychange'));
        
        setTimeout(() => {
          const modal = document.getElementById('ChaiPe-modal');
          expect(modal.innerHTML).toContain('UPI Transaction ID (UTR)');
          done();
        }, 600);
      }, 100);
    });
  });

  describe('QR Code Display Flow', () => {
    test('should show QR code on desktop', () => {
      // Mock desktop device
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/96.0',
        configurable: true
      });

      core = new ChaiPeCore();
      core.init(mockConfig);
      core.show();
      
      const payButton = document.getElementById('ChaiPe-pay');
      payButton.click();
      
      // Should show QR code modal
      const modal = document.getElementById('ChaiPe-modal');
      expect(modal.innerHTML).toContain('Scan to Pay');
      expect(modal.innerHTML).toContain('img');
    });

    test('should generate QR code with correct size', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/96.0',
        configurable: true
      });

      core = new ChaiPeCore();
      core.init(mockConfig);
      core.show();
      
      const payButton = document.getElementById('ChaiPe-pay');
      payButton.click();
      
      const modal = document.getElementById('ChaiPe-modal');
      const img = modal.querySelector('img');
      
      expect(img).toBeDefined();
      expect(img.src).toMatch(/^data:image\/svg\+xml;base64,/);
    });

    test('should show QR code with UTR collection', () => {
      const configWithUTR = {
        ...mockConfig,
        collectUPIUTR: true
      };

      core.init(configWithUTR);
      core.show();
      
      const payButton = document.getElementById('ChaiPe-pay');
      payButton.click();
      
      const modal = document.getElementById('ChaiPe-modal');
      expect(modal.innerHTML).toContain('UPI Transaction ID (UTR)');
    });
  });

  describe('Exit Intent Trigger', () => {
    test('should trigger on exit intent when enabled', () => {
      const configWithExitIntent = {
        ...mockConfig,
        triggers: {
          scrollDepth: 70,
          timeOnPage: 120,
          exitIntent: true
        }
      };

      core.init(configWithExitIntent);
      core.show = jest.fn();
      
      // Simulate mouseout event at top of page
      const mouseoutEvent = new MouseEvent('mouseout', {
        clientY: -10,
        bubbles: true
      });
      document.dispatchEvent(mouseoutEvent);
      
      // Should show modal on exit intent
      expect(core.show).toHaveBeenCalled();
    });

    test('should not trigger exit intent on mobile', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true
      });

      const configWithExitIntent = {
        ...mockConfig,
        triggers: {
          scrollDepth: 70,
          timeOnPage: 120,
          exitIntent: true
        }
      };

      core = new ChaiPeCore();
      core.init(configWithExitIntent);
      core.show = jest.fn();
      
      const mouseoutEvent = new MouseEvent('mouseout', {
        clientY: -10,
        bubbles: true
      });
      document.dispatchEvent(mouseoutEvent);
      
      // Should not trigger on mobile
      expect(core.show).not.toHaveBeenCalled();
    });

    test('should not trigger exit intent when already shown', () => {
      const configWithExitIntent = {
        ...mockConfig,
        triggers: {
          scrollDepth: 70,
          timeOnPage: 120,
          exitIntent: true
        }
      };

      core.init(configWithExitIntent);
      core.hasShownNudge = true;
      core.show = jest.fn();
      
      const mouseoutEvent = new MouseEvent('mouseout', {
        clientY: -10,
        bubbles: true
      });
      document.dispatchEvent(mouseoutEvent);
      
      expect(core.show).not.toHaveBeenCalled();
    });

    test('should not trigger exit intent when clientY > 0', () => {
      const configWithExitIntent = {
        ...mockConfig,
        triggers: {
          scrollDepth: 70,
          timeOnPage: 120,
          exitIntent: true
        }
      };

      core.init(configWithExitIntent);
      core.show = jest.fn();
      
      const mouseoutEvent = new MouseEvent('mouseout', {
        clientY: 100,
        bubbles: true
      });
      document.dispatchEvent(mouseoutEvent);
      
      expect(core.show).not.toHaveBeenCalled();
    });
  });

  describe('Scroll Tracking Edge Cases', () => {
    test('should handle scroll with zero document height', () => {
      // Mock zero document height
      Object.defineProperty(document.documentElement, 'scrollHeight', {
        value: 0,
        configurable: true
      });
      Object.defineProperty(window, 'innerHeight', {
        value: 1000,
        configurable: true
      });

      core.init(mockConfig);
      
      // Should not throw error
      expect(() => {
        window.dispatchEvent(new Event('scroll'));
      }).not.toThrow();
    });

    test('should track scroll depth correctly', () => {
      core.init(mockConfig);
      
      // Simulate scroll to 50%
      Object.defineProperty(window, 'scrollY', {
        value: 500,
        configurable: true
      });
      Object.defineProperty(document.documentElement, 'scrollTop', {
        value: 500,
        configurable: true
      });
      Object.defineProperty(document.documentElement, 'scrollHeight', {
        value: 2000,
        configurable: true
      });
      Object.defineProperty(window, 'innerHeight', {
        value: 1000,
        configurable: true
      });

      window.dispatchEvent(new Event('scroll'));
      
      expect(core.heuristics.scrollDepth).toBe(50);
    });

    test('should update max scroll depth only when scrolling down', () => {
      core.init(mockConfig);
      
      // First scroll to 50%
      Object.defineProperty(window, 'scrollY', { value: 500, configurable: true });
      Object.defineProperty(document.documentElement, 'scrollTop', { value: 500, configurable: true });
      Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 1000, configurable: true });
      window.dispatchEvent(new Event('scroll'));
      
      const scrollDepth1 = core.heuristics.scrollDepth;
      
      // Scroll back to 30%
      Object.defineProperty(window, 'scrollY', { value: 300, configurable: true });
      Object.defineProperty(document.documentElement, 'scrollTop', { value: 300, configurable: true });
      window.dispatchEvent(new Event('scroll'));
      
      const scrollDepth2 = core.heuristics.scrollDepth;
      
      // Should keep max scroll depth
      expect(scrollDepth2).toBe(scrollDepth1);
    });
  });

  describe('Time Tracking Edge Cases', () => {
    test('should track time on page', (done) => {
      core.init(mockConfig);
      
      setTimeout(() => {
        expect(core.heuristics.timeOnPage).toBeGreaterThan(0);
        done();
      }, 6000);
    });

    test('should update time on page every 5 seconds', (done) => {
      core.init(mockConfig);
      
      const time1 = core.heuristics.timeOnPage;
      
      setTimeout(() => {
        const time2 = core.heuristics.timeOnPage;
        expect(time2).toBeGreaterThan(time1);
        done();
      }, 6000);
    });
  });

  describe('Interaction Tracking', () => {
    test('should track click interactions', () => {
      core.init(mockConfig);
      
      document.dispatchEvent(new Event('click'));
      
      expect(core.heuristics.interactions).toBe(1);
    });

    test('should track multiple interactions', () => {
      core.init(mockConfig);
      
      document.dispatchEvent(new Event('click'));
      document.dispatchEvent(new Event('click'));
      document.dispatchEvent(new Event('click'));
      
      expect(core.heuristics.interactions).toBe(3);
    });
  });

  describe('Trigger Conditions', () => {
    test('should trigger when scroll depth meets threshold', () => {
      core.init(mockConfig);
      core.show = jest.fn();
      
      core.heuristics.scrollDepth = 75;
      core._checkTriggers();
      
      expect(core.show).toHaveBeenCalled();
    });

    test('should trigger when time on page meets threshold', () => {
      core.init(mockConfig);
      core.show = jest.fn();
      
      core.heuristics.timeOnPage = 130;
      core._checkTriggers();
      
      expect(core.show).toHaveBeenCalled();
    });

    test('should trigger for return visitor with lower thresholds', () => {
      core.init(mockConfig);
      core.show = jest.fn();
      
      core.heuristics.isReturnVisitor = true;
      core.heuristics.scrollDepth = 55;
      core.heuristics.timeOnPage = 65;
      core._checkTriggers();
      
      expect(core.show).toHaveBeenCalled();
    });

    test('should not trigger when thresholds not met', () => {
      core.init(mockConfig);
      core.show = jest.fn();
      
      core.heuristics.scrollDepth = 50;
      core.heuristics.timeOnPage = 60;
      core._checkTriggers();
      
      expect(core.show).not.toHaveBeenCalled();
    });

    test('should not trigger when already shown', () => {
      core.init(mockConfig);
      core.hasShownNudge = true;
      core.show = jest.fn();
      
      core.heuristics.scrollDepth = 80;
      core._checkTriggers();
      
      expect(core.show).not.toHaveBeenCalled();
    });

    test('should not trigger in manual mode', () => {
      core.init({ ...mockConfig, manualOnly: true });
      core.show = jest.fn();
      
      core.heuristics.scrollDepth = 80;
      core._checkTriggers();
      
      expect(core.show).not.toHaveBeenCalled();
    });
  });

  describe('UTR Collection', () => {
    test('should collect UTR when confirming payment', () => {
      core.init({ ...mockConfig, collectUPIUTR: true });
      core.show();
      
      const payButton = document.getElementById('ChaiPe-pay');
      payButton.click();
      
      // Need to wait for modal to update with QR code view
      setTimeout(() => {
        const utrInput = document.getElementById('ChaiPe-utr');
        if (utrInput) {
          utrInput.value = '123456789012';
        }
        core.confirmPayment(50);
        
        expect(core.collectedData.upiUTR).toBe('123456789012');
      }, 50);
    });

    test('should not collect UTR when field is empty', () => {
      core.init({ ...mockConfig, collectUPIUTR: true });
      core.show();
      
      const payButton = document.getElementById('ChaiPe-pay');
      payButton.click();
      
      core.confirmPayment(50);
      
      expect(core.collectedData.upiUTR).toBeUndefined();
    });

    test('should not collect UTR when disabled', () => {
      core.init({ ...mockConfig, collectUPIUTR: false });
      core.show();
      
      const payButton = document.getElementById('ChaiPe-pay');
      payButton.click();
      
      core.confirmPayment(50);
      
      expect(core.collectedData.upiUTR).toBeUndefined();
    });
  });

  describe('Modal Rendering Edge Cases', () => {
    test('should handle modal when no amounts configured', () => {
      core.init({ ...mockConfig, amounts: [] });
      
      expect(() => core.show()).not.toThrow();
    });

    test('should handle single amount', () => {
      core.init({ ...mockConfig, amounts: [50] });
      core.show();
      
      const amountButtons = document.querySelectorAll('.ChaiPe-amount');
      expect(amountButtons.length).toBe(1);
    });

    test('should handle custom amount input', () => {
      core.init(mockConfig);
      core.show();
      
      const customInput = document.getElementById('ChaiPe-custom');
      customInput.value = '75';
      customInput.dispatchEvent(new Event('input'));
      
      expect(core.selectedAmount).toBe(75);
    });

    test('should clear preset selection when custom amount entered', () => {
      core.init(mockConfig);
      core.show();
      
      const amountButtons = document.querySelectorAll('.ChaiPe-amount');
      const firstButton = amountButtons[0];
      firstButton.click();
      
      expect(firstButton.classList.contains('selected')).toBe(true);
      
      const customInput = document.getElementById('ChaiPe-custom');
      customInput.value = '75';
      customInput.dispatchEvent(new Event('input'));
      
      expect(firstButton.classList.contains('selected')).toBe(false);
    });
  });

  describe('Config Merging Edge Cases', () => {
    test('should handle empty triggers object', () => {
      core.init({ ...mockConfig, triggers: {} });
      
      expect(core.config.triggers.scrollDepth).toBe(70);
      expect(core.config.triggers.timeOnPage).toBe(120);
      expect(core.config.triggers.exitIntent).toBe(false);
    });

    test('should handle partial triggers', () => {
      core.init({ ...mockConfig, triggers: { scrollDepth: 50 } });
      
      expect(core.config.triggers.scrollDepth).toBe(50);
      expect(core.config.triggers.timeOnPage).toBe(120);
      expect(core.config.triggers.exitIntent).toBe(false);
    });

    test('should handle all triggers', () => {
      core.init({
        ...mockConfig,
        triggers: {
          scrollDepth: 80,
          timeOnPage: 180,
          exitIntent: true
        }
      });
      
      expect(core.config.triggers.scrollDepth).toBe(80);
      expect(core.config.triggers.timeOnPage).toBe(180);
      expect(core.config.triggers.exitIntent).toBe(true);
    });
  });

  describe('Supporter Flag', () => {
    test('should set supporter flag on payment confirmation', () => {
      core.init(mockConfig);
      core.show();
      core.confirmPayment(50);
      
      expect(localStorage.getItem('ChaiPe_supporter')).toBe('true');
    });

    test('should handle localStorage error when setting supporter flag', () => {
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn(() => {
        throw new Error('Storage error');
      });
      
      core.init(mockConfig);
      core.show();
      
      expect(() => core.confirmPayment(50)).not.toThrow();
      
      localStorage.setItem = originalSetItem;
    });
  });

  describe('Overlay Click to Dismiss', () => {
    test('should dismiss modal when overlay is clicked', () => {
      core.init(mockConfig);
      core.show();
      
      const overlay = document.getElementById('ChaiPe-overlay');
      overlay.click();
      
      setTimeout(() => {
        const modal = document.getElementById('ChaiPe-modal');
        expect(modal.classList.contains('active')).toBe(false);
      }, 350);
    });
  });
});
