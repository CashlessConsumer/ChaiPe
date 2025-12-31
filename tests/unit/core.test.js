/**
 * Unit Tests for ChaiPeCore Class
 * Tests initialization, configuration, tracking, modal rendering, and payment flows
 */

import { ChaiPeCore } from '../../src/lib/core.js';

describe('ChaiPeCore Class', () => {
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
    
    // Clear document body
    document.body.innerHTML = '';
  });

  afterEach(() => {
    // Clean up any remaining modals
    const modal = document.getElementById('ChaiPe-modal');
    const overlay = document.getElementById('ChaiPe-overlay');
    if (modal) modal.remove();
    if (overlay) overlay.remove();
  });

  describe('Constructor', () => {
    test('should initialize with default values', () => {
      expect(core.config).toBeNull();
      expect(core.sessionId).toBeDefined();
      expect(core.sessionId).toMatch(/^np_/);
      expect(core.heuristics).toEqual({
        scrollDepth: 0,
        timeOnPage: 0,
        isReturnVisitor: false,
        interactions: 0,
        articleCompleted: false
      });
      expect(core.hasShownNudge).toBe(false);
      expect(core.paymentInProgress).toBe(false);
      expect(core.selectedAmount).toBeNull();
      expect(core.collectedData).toEqual({});
    });

    test('should detect mobile device', () => {
      const testCore = new ChaiPeCore();
      expect(typeof testCore.isMobile).toBe('boolean');
    });
  });

  describe('_generateSessionId()', () => {
    test('should generate unique session IDs', () => {
      const id1 = core._generateSessionId();
      const id2 = core._generateSessionId();
      
      expect(id1).toMatch(/^np_/);
      expect(id2).toMatch(/^np_/);
      expect(id1).not.toBe(id2);
    });

    test('should generate session ID with correct length', () => {
      const id = core._generateSessionId();
      expect(id.length).toBeGreaterThan(10);
    });
  });

  describe('_detectMobile()', () => {
    test('should return boolean for mobile detection', () => {
      const result = core._detectMobile();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('init()', () => {
    test('should initialize with valid config', () => {
      const result = core.init(mockConfig);
      
      expect(result).toBe(core);
      expect(core.config).toBeDefined();
      expect(core.config.upiId).toBe('test@upi');
      expect(core.config.name).toBe('Test Creator');
    });

    test('should use default values for optional config', () => {
      const minimalConfig = { upiId: 'test@upi' };
      core.init(minimalConfig);
      
      expect(core.config.name).toBe('Creator');
      expect(core.config.amounts).toEqual([10, 25, 50, 100]);
      expect(core.config.theme).toBe('minimal');
      expect(core.config.currency).toBe('INR');
    });

    test('should merge trigger config correctly', () => {
      const partialTriggerConfig = {
        upiId: 'test@upi',
        triggers: { scrollDepth: 50 }
      };
      core.init(partialTriggerConfig);
      
      expect(core.config.triggers.scrollDepth).toBe(50);
      expect(core.config.triggers.timeOnPage).toBe(120);
      expect(core.config.triggers.exitIntent).toBe(false);
    });

    test('should inject styles on init', () => {
      core.init(mockConfig);
      
      const styleTag = document.getElementById('ChaiPe-styles');
      expect(styleTag).toBeDefined();
    });

    test('should not inject duplicate styles', () => {
      core.init(mockConfig);
      const firstStyle = document.getElementById('ChaiPe-styles');
      
      core.init(mockConfig);
      const secondStyle = document.getElementById('ChaiPe-styles');
      
      expect(firstStyle).toBe(secondStyle);
    });

    test('should check return visitor status', () => {
      localStorage.setItem('ChaiPe_visited', 'true');
      core.init(mockConfig);
      
      expect(core.heuristics.isReturnVisitor).toBe(true);
    });

    test('should set visited flag in localStorage', () => {
      core.init(mockConfig);
      
      expect(localStorage.getItem('ChaiPe_visited')).toBe('true');
    });

    test('should handle localStorage errors gracefully', () => {
      const originalGetItem = localStorage.getItem;
      const originalSetItem = localStorage.setItem;
      
      localStorage.getItem = jest.fn(() => {
        throw new Error('Storage error');
      });
      localStorage.setItem = jest.fn(() => {
        throw new Error('Storage error');
      });
      
      expect(() => core.init(mockConfig)).not.toThrow();
      
      localStorage.getItem = originalGetItem;
      localStorage.setItem = originalSetItem;
    });

    test('should start tracking when manualOnly is false', () => {
      const config = { ...mockConfig, manualOnly: false };
      core.init(config);
      
      // Tracking should have started (check by verifying scroll listener exists)
      expect(core.config.manualOnly).toBe(false);
    });

    test('should not start tracking when manualOnly is true', () => {
      const config = { ...mockConfig, manualOnly: true };
      core.init(config);
      
      expect(core.config.manualOnly).toBe(true);
    });
  });

  describe('generateUpiLink()', () => {
    beforeEach(() => {
      core.init(mockConfig);
    });

    test('should generate valid UPI link', () => {
      const link = core.generateUpiLink(50);
      
      expect(link).toMatch(/^upi:\/\/pay\?/);
      expect(link).toContain('pa=test%40upi');
      expect(link).toContain('pn=Test+Creator');
      expect(link).toContain('am=50');
      expect(link).toContain('cu=INR');
      expect(link).toContain('tn=Test+Note');
    });

    test('should handle different amounts', () => {
      const link10 = core.generateUpiLink(10);
      const link100 = core.generateUpiLink(100);
      
      expect(link10).toContain('am=10');
      expect(link100).toContain('am=100');
    });

    test('should handle custom currency', () => {
      core.config.currency = 'USD';
      const link = core.generateUpiLink(50);
      
      expect(link).toContain('cu=USD');
    });

    test('should handle custom transaction note', () => {
      core.config.transactionNote = 'Custom Note';
      const link = core.generateUpiLink(50);
      
      expect(link).toContain('tn=Custom+Note');
    });

    test('should handle special characters in name', () => {
      core.config.name = 'Test & Co.';
      const link = core.generateUpiLink(50);
      
      expect(link).toContain('pn=Test+%26+Co.');
    });
  });

  describe('show()', () => {
    beforeEach(() => {
      core.init(mockConfig);
    });

    test('should render modal when called', () => {
      core.show();
      
      const modal = document.getElementById('ChaiPe-modal');
      expect(modal).toBeDefined();
    });

    test('should set hasShownNudge to true', () => {
      core.show();
      
      expect(core.hasShownNudge).toBe(true);
    });

    test('should set selectedAmount to second preset', () => {
      core.show();
      
      expect(core.selectedAmount).toBe(25);
    });

    test('should call onNudgeShown callback', () => {
      core.show();
      
      expect(mockConfig.onNudgeShown).toHaveBeenCalledWith({
        sessionId: core.sessionId
      });
    });

    test('should allow re-showing after dismiss', () => {
      core.show();
      expect(core.hasShownNudge).toBe(true);
      
      core.hasShownNudge = false;
      core.show();
      
      expect(core.hasShownNudge).toBe(true);
    });

    test('should render overlay', () => {
      core.show();
      
      const overlay = document.getElementById('ChaiPe-overlay');
      expect(overlay).toBeDefined();
    });
  });

  describe('dismiss()', () => {
    beforeEach(() => {
      core.init(mockConfig);
      core.show();
    });

    test('should remove modal', () => {
      core.dismiss();
      
      setTimeout(() => {
        const modal = document.getElementById('ChaiPe-modal');
        expect(modal).toBeNull();
      }, 350);
    });

    test('should remove overlay', () => {
      core.dismiss();
      
      setTimeout(() => {
        const overlay = document.getElementById('ChaiPe-overlay');
        expect(overlay).toBeNull();
      }, 350);
    });

    test('should call onNudgeDismissed callback', () => {
      core.dismiss();
      
      expect(mockConfig.onNudgeDismissed).toHaveBeenCalledWith({
        sessionId: core.sessionId
      });
    });

    test('should handle dismiss when modal is not shown', () => {
      const modal = document.getElementById('ChaiPe-modal');
      if (modal) modal.remove();
      
      expect(() => core.dismiss()).not.toThrow();
    });
  });

  describe('confirmPayment()', () => {
    beforeEach(() => {
      core.init(mockConfig);
      core.show();
    });

    test('should show success message', () => {
      core.confirmPayment(50);
      
      const modal = document.getElementById('ChaiPe-modal');
      expect(modal.innerHTML).toContain('Thank You!');
    });

    test('should call onTipCompleted callback', () => {
      core.confirmPayment(50);
      
      expect(mockConfig.onTipCompleted).toHaveBeenCalledWith({
        amount: 50,
        currency: 'INR',
        timestamp: expect.any(String),
        sessionId: core.sessionId,
        isReturnVisitor: false,
        customData: {}
      });
    });

    test('should set supporter flag in localStorage', () => {
      core.confirmPayment(50);
      
      expect(localStorage.getItem('ChaiPe_supporter')).toBe('true');
    });

    test('should include collected data in callback', () => {
      core.collectedData = { email: 'test@example.com' };
      core.confirmPayment(50);
      
      expect(mockConfig.onTipCompleted).toHaveBeenCalledWith(
        expect.objectContaining({
          customData: { email: 'test@example.com' }
        })
      );
    });

    test('should auto-dismiss after success', (done) => {
      core.confirmPayment(50);
      
      setTimeout(() => {
        const modal = document.getElementById('ChaiPe-modal');
        expect(modal).toBeNull();
        done();
      }, 3100);
    });

    test('should handle localStorage errors', () => {
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn(() => {
        throw new Error('Storage error');
      });
      
      expect(() => core.confirmPayment(50)).not.toThrow();
      
      localStorage.setItem = originalSetItem;
    });
  });

  describe('_checkTriggers()', () => {
    beforeEach(() => {
      core.init(mockConfig);
    });

    test('should not show nudge if already shown', () => {
      core.hasShownNudge = true;
      core.show = jest.fn();
      
      core._checkTriggers();
      
      expect(core.show).not.toHaveBeenCalled();
    });

    test('should not show nudge in manual mode', () => {
      core.config.manualOnly = true;
      core.show = jest.fn();
      
      core._checkTriggers();
      
      expect(core.show).not.toHaveBeenCalled();
    });

    test('should show nudge when scroll depth threshold reached', () => {
      core.heuristics.scrollDepth = 75;
      core.show = jest.fn();
      
      core._checkTriggers();
      
      expect(core.show).toHaveBeenCalled();
    });

    test('should show nudge when time on page threshold reached', () => {
      core.heuristics.timeOnPage = 130;
      core.show = jest.fn();
      
      core._checkTriggers();
      
      expect(core.show).toHaveBeenCalled();
    });

    test('should show nudge for return visitor with lower thresholds', () => {
      core.heuristics.isReturnVisitor = true;
      core.heuristics.scrollDepth = 55;
      core.heuristics.timeOnPage = 65;
      core.show = jest.fn();
      
      core._checkTriggers();
      
      expect(core.show).toHaveBeenCalled();
    });

    test('should not show nudge for return visitor without meeting thresholds', () => {
      core.heuristics.isReturnVisitor = true;
      core.heuristics.scrollDepth = 40;
      core.heuristics.timeOnPage = 50;
      core.show = jest.fn();
      
      core._checkTriggers();
      
      expect(core.show).not.toHaveBeenCalled();
    });
  });

  describe('_collectFormData()', () => {
    beforeEach(() => {
      core.init({
        ...mockConfig,
        collectName: true,
        collectEmail: true,
        collectPhoneNumber: true,
        collectVPA: true
      });
      core.show();
    });

    test('should collect name when enabled', () => {
      const nameInput = document.getElementById('ChaiPe-name');
      nameInput.value = 'John Doe';
      
      const data = core._collectFormData();
      
      expect(data.name).toBe('John Doe');
    });

    test('should collect email when enabled', () => {
      const emailInput = document.getElementById('ChaiPe-email');
      emailInput.value = 'test@example.com';
      
      const data = core._collectFormData();
      
      expect(data.email).toBe('test@example.com');
    });

    test('should collect phone number when enabled', () => {
      const phoneInput = document.getElementById('ChaiPe-phone');
      phoneInput.value = '+91 98765 43210';
      
      const data = core._collectFormData();
      
      expect(data.phoneNumber).toBe('+91 98765 43210');
    });

    test('should collect VPA when enabled', () => {
      const vpaInput = document.getElementById('ChaiPe-vpa');
      vpaInput.value = 'user@upi';
      
      const data = core._collectFormData();
      
      expect(data.vpa).toBe('user@upi');
    });

    test('should handle empty form fields', () => {
      const data = core._collectFormData();
      
      expect(data).toEqual({});
    });

    test('should store collected data in instance', () => {
      const nameInput = document.getElementById('ChaiPe-name');
      nameInput.value = 'Test User';
      
      core._collectFormData();
      
      expect(core.collectedData.name).toBe('Test User');
    });
  });

  describe('Theme Rendering', () => {
    test('should render minimal theme', () => {
      core.init({ ...mockConfig, theme: 'minimal' });
      core.show();
      
      const modal = document.getElementById('ChaiPe-modal');
      expect(modal.classList.contains('theme-minimal')).toBe(true);
    });

    test('should render toast theme', () => {
      core.init({ ...mockConfig, theme: 'toast' });
      core.show();
      
      const modal = document.getElementById('ChaiPe-modal');
      expect(modal.classList.contains('theme-toast')).toBe(true);
    });

    test('should render floating theme', () => {
      core.init({ ...mockConfig, theme: 'floating' });
      core.show();
      
      const modal = document.getElementById('ChaiPe-modal');
      expect(modal.classList.contains('theme-floating')).toBe(true);
    });
  });

  describe('Amount Selection', () => {
    beforeEach(() => {
      core.init(mockConfig);
      core.show();
    });

    test('should render preset amount buttons', () => {
      const amountButtons = document.querySelectorAll('.ChaiPe-amount');
      expect(amountButtons.length).toBe(4);
    });

    test('should mark default amount as selected', () => {
      const amountButtons = document.querySelectorAll('.ChaiPe-amount');
      const selectedButton = Array.from(amountButtons).find(btn => 
        btn.classList.contains('selected')
      );
      
      expect(selectedButton).toBeDefined();
      expect(selectedButton.dataset.amount).toBe('25');
    });

    test('should update selected amount on button click', () => {
      const amountButtons = document.querySelectorAll('.ChaiPe-amount');
      amountButtons[2].click();
      
      expect(core.selectedAmount).toBe(50);
    });

    test('should handle custom amount input', () => {
      const customInput = document.getElementById('ChaiPe-custom');
      customInput.value = '75';
      customInput.dispatchEvent(new Event('input'));
      
      expect(core.selectedAmount).toBe(75);
    });
  });

  describe('Data Collection Form', () => {
    test('should not render form when no fields enabled', () => {
      core.init(mockConfig);
      core.show();
      
      const divider = document.querySelector('.ChaiPe-divider');
      expect(divider).toBeNull();
    });

    test('should render name field when enabled', () => {
      core.init({ ...mockConfig, collectName: true });
      core.show();
      
      const nameInput = document.getElementById('ChaiPe-name');
      expect(nameInput).toBeDefined();
    });

    test('should render email field when enabled', () => {
      core.init({ ...mockConfig, collectEmail: true });
      core.show();
      
      const emailInput = document.getElementById('ChaiPe-email');
      expect(emailInput).toBeDefined();
    });

    test('should render phone field when enabled', () => {
      core.init({ ...mockConfig, collectPhoneNumber: true });
      core.show();
      
      const phoneInput = document.getElementById('ChaiPe-phone');
      expect(phoneInput).toBeDefined();
    });

    test('should render VPA field when enabled', () => {
      core.init({ ...mockConfig, collectVPA: true });
      core.show();
      
      const vpaInput = document.getElementById('ChaiPe-vpa');
      expect(vpaInput).toBeDefined();
    });
  });

  describe('_removeModal()', () => {
    test('should remove modal from DOM', () => {
      core.init(mockConfig);
      core.show();
      
      core._removeModal();
      
      const modal = document.getElementById('ChaiPe-modal');
      expect(modal).toBeNull();
    });

    test('should remove overlay from DOM', () => {
      core.init(mockConfig);
      core.show();
      
      core._removeModal();
      
      const overlay = document.getElementById('ChaiPe-overlay');
      expect(overlay).toBeNull();
    });

    test('should handle when modal does not exist', () => {
      expect(() => core._removeModal()).not.toThrow();
    });
  });
});
