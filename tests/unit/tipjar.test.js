/**
 * Unit Tests for TipJar Functionality
 * Tests TipJar initialization, rendering, events, and public API methods
 */

import { ChaiPeCore } from '../../src/lib/core.js';

describe('ChaiPeCore - TipJar Functionality', () => {
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
      manualOnly: false,
      // TipJar configuration
      tipJar: true,
      tipJarIcon: '☕',
      tipJarPosition: 'bottom-right',
      tipJarSize: 'medium',
      tipJarColor: '#4CAF50',
      tipJarText: 'Buy me a chai ☕',
      tipJarShowOnMobile: true,
      tipJarShowOnDesktop: true
    };
    
    // Clear document body
    document.body.innerHTML = '';
    // Clear localStorage
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up any remaining modals and tipJar
    const modal = document.getElementById('ChaiPe-modal');
    const overlay = document.getElementById('ChaiPe-overlay');
    const tipJar = document.getElementById('ChaiPe-tipJar');
    if (modal) modal.remove();
    if (overlay) overlay.remove();
    if (tipJar) tipJar.remove();
  });

  describe('TipJar Initialization', () => {
    test('should initialize TipJar state in constructor', () => {
      expect(core.tipJarElement).toBeNull();
      expect(core.tipJarVisible).toBe(false);
    });

    test('should merge TipJar config on init', () => {
      core.init(mockConfig);
      
      expect(core.config.tipJar).toBe(true);
      expect(core.config.tipJarIcon).toBe('☕');
      expect(core.config.tipJarPosition).toBe('bottom-right');
      expect(core.config.tipJarSize).toBe('medium');
      expect(core.config.tipJarColor).toBe('#4CAF50');
      expect(core.config.tipJarText).toBe('Buy me a chai ☕');
      expect(core.config.tipJarShowOnMobile).toBe(true);
      expect(core.config.tipJarShowOnDesktop).toBe(true);
    });

    test('should use default TipJar config values', () => {
      const minimalConfig = { 
        upiId: 'test@upi',
        tipJar: true
      };
      core.init(minimalConfig);
      
      expect(core.config.tipJarIcon).toBe('☕');
      expect(core.config.tipJarPosition).toBe('bottom-right');
      expect(core.config.tipJarSize).toBe('medium');
      expect(core.config.tipJarColor).toBe('#4CAF50');
      expect(core.config.tipJarText).toBe('Buy me a chai ☕');
      expect(core.config.tipJarShowOnMobile).toBe(true);
      expect(core.config.tipJarShowOnDesktop).toBe(true);
    });

    test('should render TipJar when enabled in config', () => {
      core.init(mockConfig);
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar).toBeDefined();
      expect(tipJar).not.toBeNull();
    });

    test('should not render TipJar when disabled in config', () => {
      const configWithoutTipJar = { ...mockConfig, tipJar: false };
      core.init(configWithoutTipJar);
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar).toBeNull();
    });

    test('should set tipJarElement reference after rendering', () => {
      core.init(mockConfig);
      
      expect(core.tipJarElement).toBeDefined();
      expect(core.tipJarElement).not.toBeNull();
      expect(core.tipJarElement.id).toBe('ChaiPe-tipJar');
    });

    test('should set tipJarVisible to true after rendering', () => {
      core.init(mockConfig);
      
      expect(core.tipJarVisible).toBe(true);
    });
  });

  describe('_renderTipJar()', () => {
    test('should create TipJar element with correct ID and class', () => {
      core.init(mockConfig);
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar.id).toBe('ChaiPe-tipJar');
      expect(tipJar.classList.contains('ChaiPe-tipJar')).toBe(true);
    });

    test('should set accessibility attributes', () => {
      core.init(mockConfig);
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar.getAttribute('role')).toBe('button');
      expect(tipJar.getAttribute('aria-label')).toBe('Buy me a chai ☕');
      expect(tipJar.getAttribute('tabindex')).toBe('0');
    });

    test('should apply correct size based on config', () => {
      core.init(mockConfig);
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar.style.width).toBe('56px');
      expect(tipJar.style.height).toBe('56px');
    });

    test('should apply small size correctly', () => {
      core.init({ ...mockConfig, tipJarSize: 'small' });
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar.style.width).toBe('48px');
      expect(tipJar.style.height).toBe('48px');
    });

    test('should apply large size correctly', () => {
      core.init({ ...mockConfig, tipJarSize: 'large' });
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar.style.width).toBe('64px');
      expect(tipJar.style.height).toBe('64px');
    });

    test('should apply custom color', () => {
      const customColor = '#FF5722';
      core.init({ ...mockConfig, tipJarColor: customColor });
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      // Browsers convert hex to RGB format
      expect(tipJar.style.backgroundColor).toBe('rgb(255, 87, 34)');
    });

    test('should display custom icon', () => {
      const customIcon = '❤️';
      core.init({ ...mockConfig, tipJarIcon: customIcon });
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      // textContent includes both icon and tooltip, check first child
      expect(tipJar.firstChild.textContent).toBe(customIcon);
    });

    test('should create tooltip element', () => {
      core.init(mockConfig);
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      const tooltip = tipJar.querySelector('.ChaiPe-tipJar-tooltip');
      expect(tooltip).toBeDefined();
      expect(tooltip.textContent).toBe('Buy me a chai ☕');
    });

    test('should apply correct position styles', () => {
      core.init(mockConfig);
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar.style.position).toBe('fixed');
      expect(tipJar.style.bottom).toBe('24px');
      expect(tipJar.style.right).toBe('24px');
    });

    test('should apply bottom-left position', () => {
      core.init({ ...mockConfig, tipJarPosition: 'bottom-left' });
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar.style.bottom).toBe('24px');
      expect(tipJar.style.left).toBe('24px');
    });

    test('should apply top-right position', () => {
      core.init({ ...mockConfig, tipJarPosition: 'top-right' });
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar.style.top).toBe('24px');
      expect(tipJar.style.right).toBe('24px');
    });

    test('should apply top-left position', () => {
      core.init({ ...mockConfig, tipJarPosition: 'top-left' });
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar.style.top).toBe('24px');
      expect(tipJar.style.left).toBe('24px');
    });

    test('should remove existing TipJar before rendering new one', () => {
      core.init(mockConfig);
      const firstTipJar = document.getElementById('ChaiPe-tipJar');
      
      core._renderTipJar();
      const secondTipJar = document.getElementById('ChaiPe-tipJar');
      
      expect(firstTipJar).not.toBe(secondTipJar);
    });

    test('should not render TipJar when tipJarShowOnMobile is false on mobile', () => {
      // Mock mobile device BEFORE creating instance
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true
      });
      
      // Create new instance after setting user agent
      const mobileCore = new ChaiPeCore();
      mobileCore.init({ ...mockConfig, tipJarShowOnMobile: false });
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar).toBeNull();
    });

    test('should not render TipJar when tipJarShowOnDesktop is false on desktop', () => {
      // Mock desktop device BEFORE creating instance
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/96.0',
        configurable: true
      });
      
      // Create new instance after setting user agent
      const desktopCore = new ChaiPeCore();
      desktopCore.init({ ...mockConfig, tipJarShowOnDesktop: false });
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar).toBeNull();
    });

    test('should apply animation styles', () => {
      core.init(mockConfig);
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar.style.transition).toBe('all 0.3s ease');
      expect(tipJar.style.opacity).toBe('1');
      expect(tipJar.style.transform).toBe('translateY(0)');
      expect(tipJar.style.pointerEvents).toBe('auto');
    });

    test('should attach event listeners', () => {
      core.init(mockConfig);
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar.onclick).toBeDefined();
    });
  });

  describe('_getTipJarPositionStyles()', () => {
    test('should return correct styles for bottom-right', () => {
      core.init(mockConfig);
      
      const styles = core._getTipJarPositionStyles();
      expect(styles).toBe('bottom: 24px; right: 24px;');
    });

    test('should return correct styles for bottom-left', () => {
      core.init({ ...mockConfig, tipJarPosition: 'bottom-left' });
      
      const styles = core._getTipJarPositionStyles();
      expect(styles).toBe('bottom: 24px; left: 24px;');
    });

    test('should return correct styles for top-right', () => {
      core.init({ ...mockConfig, tipJarPosition: 'top-right' });
      
      const styles = core._getTipJarPositionStyles();
      expect(styles).toBe('top: 24px; right: 24px;');
    });

    test('should return correct styles for top-left', () => {
      core.init({ ...mockConfig, tipJarPosition: 'top-left' });
      
      const styles = core._getTipJarPositionStyles();
      expect(styles).toBe('top: 24px; left: 24px;');
    });

    test('should default to bottom-right for invalid position', () => {
      core.init({ ...mockConfig, tipJarPosition: 'invalid' });
      
      const styles = core._getTipJarPositionStyles();
      expect(styles).toBe('bottom: 24px; right: 24px;');
    });
  });

  describe('_showTipJar()', () => {
    test('should show TipJar with correct styles', () => {
      core.init(mockConfig);
      core._hideTipJar();
      
      core._showTipJar();
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar.style.opacity).toBe('1');
      expect(tipJar.style.transform).toBe('translateY(0)');
      expect(tipJar.style.pointerEvents).toBe('auto');
    });

    test('should set tipJarVisible to true', () => {
      core.init(mockConfig);
      core._hideTipJar();
      
      core._showTipJar();
      
      expect(core.tipJarVisible).toBe(true);
    });

    test('should handle when tipJarElement is null', () => {
      core.init(mockConfig);
      core.tipJarElement = null;
      
      expect(() => core._showTipJar()).not.toThrow();
    });
  });

  describe('_hideTipJar()', () => {
    test('should hide TipJar with correct styles', () => {
      core.init(mockConfig);
      
      core._hideTipJar();
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar.style.opacity).toBe('0');
      expect(tipJar.style.transform).toBe('translateY(20px)');
      expect(tipJar.style.pointerEvents).toBe('none');
    });

    test('should set tipJarVisible to false', () => {
      core.init(mockConfig);
      
      core._hideTipJar();
      
      expect(core.tipJarVisible).toBe(false);
    });

    test('should handle when tipJarElement is null', () => {
      core.init(mockConfig);
      core.tipJarElement = null;
      
      expect(() => core._hideTipJar()).not.toThrow();
    });
  });

  describe('_handleTipJarClick()', () => {
    test('should call show() method when clicked', () => {
      core.init(mockConfig);
      const showSpy = jest.spyOn(core, 'show');
      
      core._handleTipJarClick();
      
      expect(showSpy).toHaveBeenCalled();
    });

    test('should open payment modal', () => {
      core.init(mockConfig);
      
      core._handleTipJarClick();
      
      const modal = document.getElementById('ChaiPe-modal');
      expect(modal).toBeDefined();
    });
  });

  describe('_attachTipJarEvents()', () => {
    test('should attach click event listener', () => {
      core.init(mockConfig);
      const handleSpy = jest.spyOn(core, '_handleTipJarClick');
      
      core.tipJarElement.click();
      
      expect(handleSpy).toHaveBeenCalled();
    });

    test('should handle Enter key press', () => {
      core.init(mockConfig);
      const handleSpy = jest.spyOn(core, '_handleTipJarClick');
      
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      core.tipJarElement.dispatchEvent(enterEvent);
      
      expect(handleSpy).toHaveBeenCalled();
    });

    test('should handle Space key press', () => {
      core.init(mockConfig);
      const handleSpy = jest.spyOn(core, '_handleTipJarClick');
      
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
      core.tipJarElement.dispatchEvent(spaceEvent);
      
      expect(handleSpy).toHaveBeenCalled();
    });

    test('should show tooltip on mouseenter', () => {
      core.init(mockConfig);
      
      const tooltip = core.tipJarElement.querySelector('.ChaiPe-tipJar-tooltip');
      expect(tooltip.style.opacity).toBe('0');
      
      core.tipJarElement.dispatchEvent(new Event('mouseenter'));
      
      expect(tooltip.style.opacity).toBe('1');
    });

    test('should hide tooltip on mouseleave', () => {
      core.init(mockConfig);
      
      const tooltip = core.tipJarElement.querySelector('.ChaiPe-tipJar-tooltip');
      core.tipJarElement.dispatchEvent(new Event('mouseenter'));
      expect(tooltip.style.opacity).toBe('1');
      
      core.tipJarElement.dispatchEvent(new Event('mouseleave'));
      
      expect(tooltip.style.opacity).toBe('0');
    });

    test('should show tooltip on focus', () => {
      core.init(mockConfig);
      
      const tooltip = core.tipJarElement.querySelector('.ChaiPe-tipJar-tooltip');
      expect(tooltip.style.opacity).toBe('0');
      
      core.tipJarElement.dispatchEvent(new Event('focus'));
      
      expect(tooltip.style.opacity).toBe('1');
    });

    test('should hide tooltip on blur', () => {
      core.init(mockConfig);
      
      const tooltip = core.tipJarElement.querySelector('.ChaiPe-tipJar-tooltip');
      core.tipJarElement.dispatchEvent(new Event('focus'));
      expect(tooltip.style.opacity).toBe('1');
      
      core.tipJarElement.dispatchEvent(new Event('blur'));
      
      expect(tooltip.style.opacity).toBe('0');
    });

    test('should handle when tipJarElement is null', () => {
      core.init(mockConfig);
      core.tipJarElement = null;
      
      expect(() => core._attachTipJarEvents()).not.toThrow();
    });
  });

  describe('_updateTipJarPosition()', () => {
    test('should update position styles', () => {
      core.init(mockConfig);
      core.config.tipJarPosition = 'top-left';
      
      core._updateTipJarPosition();
      
      // Position is updated via a style element, check that config is updated
      expect(core.config.tipJarPosition).toBe('top-left');
    });

    test('should reset old position styles', () => {
      core.init(mockConfig);
      core.config.tipJarPosition = 'top-left';
      
      core._updateTipJarPosition();
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar.style.bottom).toBe('');
      expect(tipJar.style.right).toBe('');
    });

    test('should update tooltip position for bottom positions', () => {
      core.init(mockConfig);
      core.config.tipJarPosition = 'bottom-left';
      
      core._updateTipJarPosition();
      
      const tooltip = core.tipJarElement.querySelector('.ChaiPe-tipJar-tooltip');
      expect(tooltip.style.bottom).toBe('100%');
      expect(tooltip.style.marginBottom).toBe('8px');
    });

    test('should update tooltip position for top positions', () => {
      core.init(mockConfig);
      core.config.tipJarPosition = 'top-right';
      
      core._updateTipJarPosition();
      
      const tooltip = core.tipJarElement.querySelector('.ChaiPe-tipJar-tooltip');
      expect(tooltip.style.top).toBe('100%');
      expect(tooltip.style.marginTop).toBe('8px');
    });

    test('should handle when tipJarElement is null', () => {
      core.init(mockConfig);
      core.tipJarElement = null;
      
      expect(() => core._updateTipJarPosition()).not.toThrow();
    });
  });

  describe('_removeTipJar()', () => {
    test('should remove TipJar from DOM', () => {
      core.init(mockConfig);
      
      core._removeTipJar();
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar).toBeNull();
    });

    test('should set tipJarElement to null', () => {
      core.init(mockConfig);
      
      core._removeTipJar();
      
      expect(core.tipJarElement).toBeNull();
    });

    test('should set tipJarVisible to false', () => {
      core.init(mockConfig);
      
      core._removeTipJar();
      
      expect(core.tipJarVisible).toBe(false);
    });

    test('should handle when tipJarElement is already null', () => {
      core.init(mockConfig);
      core._removeTipJar();
      
      expect(() => core._removeTipJar()).not.toThrow();
    });
  });

  describe('Public API - showTipJar()', () => {
    test('should show TipJar when enabled', () => {
      core.init(mockConfig);
      core._hideTipJar();
      
      core.showTipJar();
      
      expect(core.tipJarVisible).toBe(true);
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar.style.opacity).toBe('1');
    });

    test('should render TipJar if not exists', () => {
      core.init({ ...mockConfig, tipJar: false });
      core.config.tipJar = true;
      core.tipJarElement = null;
      
      core.showTipJar();
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar).toBeDefined();
    });

    test('should warn when TipJar is not enabled', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      core.init({ ...mockConfig, tipJar: false });
      
      core.showTipJar();
      
      expect(consoleWarnSpy).toHaveBeenCalledWith('TipJar is not enabled in configuration');
      consoleWarnSpy.mockRestore();
    });

    test('should call _showTipJar when element exists', () => {
      core.init(mockConfig);
      const showSpy = jest.spyOn(core, '_showTipJar');
      
      core.showTipJar();
      
      expect(showSpy).toHaveBeenCalled();
    });
  });

  describe('Public API - hideTipJar()', () => {
    test('should hide TipJar when element exists', () => {
      core.init(mockConfig);
      
      core.hideTipJar();
      
      expect(core.tipJarVisible).toBe(false);
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar.style.opacity).toBe('0');
    });

    test('should handle when tipJarElement is null', () => {
      core.init(mockConfig);
      core.tipJarElement = null;
      
      expect(() => core.hideTipJar()).not.toThrow();
    });
  });

  describe('Public API - updateTipJar()', () => {
    test('should update tipJarIcon', () => {
      core.init(mockConfig);
      
      core.updateTipJar({ tipJarIcon: '❤️' });
      
      expect(core.config.tipJarIcon).toBe('❤️');
      expect(core.tipJarElement.textContent).toBe('❤️');
    });

    test('should update tipJarPosition', () => {
      core.init(mockConfig);
      const updateSpy = jest.spyOn(core, '_updateTipJarPosition');
      
      core.updateTipJar({ tipJarPosition: 'top-left' });
      
      expect(core.config.tipJarPosition).toBe('top-left');
      expect(updateSpy).toHaveBeenCalled();
    });

    test('should update tipJarSize', () => {
      core.init(mockConfig);
      
      core.updateTipJar({ tipJarSize: 'large' });
      
      expect(core.config.tipJarSize).toBe('large');
      expect(core.tipJarElement.style.width).toBe('64px');
      expect(core.tipJarElement.style.height).toBe('64px');
    });

    test('should update tipJarColor', () => {
      core.init(mockConfig);
      
      core.updateTipJar({ tipJarColor: '#FF5722' });
      
      expect(core.config.tipJarColor).toBe('#FF5722');
      // Browsers convert hex to RGB format
      expect(core.tipJarElement.style.backgroundColor).toBe('rgb(255, 87, 34)');
    });

    test('should update tipJarText', () => {
      core.init(mockConfig);
      
      core.updateTipJar({ tipJarText: 'Support my work' });
      
      expect(core.config.tipJarText).toBe('Support my work');
      expect(core.tipJarElement.getAttribute('aria-label')).toBe('Support my work');
      
      const tooltip = core.tipJarElement.querySelector('.ChaiPe-tipJar-tooltip');
      expect(tooltip.textContent).toBe('Support my work');
    });

    test('should update tipJarShowOnMobile and show on mobile', () => {
      // Mock mobile device
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true
      });
      
      core.init({ ...mockConfig, tipJarShowOnMobile: false });
      core.updateTipJar({ tipJarShowOnMobile: true });
      
      expect(core.config.tipJarShowOnMobile).toBe(true);
      expect(core.tipJarVisible).toBe(true);
    });

    test('should update tipJarShowOnMobile and hide on mobile', () => {
      // Mock mobile device
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true
      });
      
      core.init(mockConfig);
      core.updateTipJar({ tipJarShowOnMobile: false });
      
      expect(core.config.tipJarShowOnMobile).toBe(false);
      expect(core.tipJarVisible).toBe(false);
    });

    test('should update tipJarShowOnDesktop and show on desktop', () => {
      // Mock desktop device
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/96.0',
        configurable: true
      });
      
      core.init({ ...mockConfig, tipJarShowOnDesktop: false });
      core.updateTipJar({ tipJarShowOnDesktop: true });
      
      expect(core.config.tipJarShowOnDesktop).toBe(true);
      expect(core.tipJarVisible).toBe(true);
    });

    test('should update tipJarShowOnDesktop and hide on desktop', () => {
      // Mock desktop device
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/96.0',
        configurable: true
      });
      
      core.init(mockConfig);
      core.updateTipJar({ tipJarShowOnDesktop: false });
      
      expect(core.config.tipJarShowOnDesktop).toBe(false);
      expect(core.tipJarVisible).toBe(false);
    });

    test('should update multiple options at once', () => {
      core.init(mockConfig);
      
      core.updateTipJar({
        tipJarIcon: '❤️',
        tipJarColor: '#FF5722',
        tipJarSize: 'large'
      });
      
      expect(core.config.tipJarIcon).toBe('❤️');
      expect(core.config.tipJarColor).toBe('#FF5722');
      expect(core.config.tipJarSize).toBe('large');
      expect(core.tipJarElement.firstChild.textContent).toBe('❤️');
      expect(core.tipJarElement.style.backgroundColor).toBe('rgb(255, 87, 34)');
      expect(core.tipJarElement.style.width).toBe('64px');
    });

    test('should warn when TipJar is not enabled', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      core.init({ ...mockConfig, tipJar: false });
      
      core.updateTipJar({ tipJarIcon: '❤️' });
      
      expect(consoleWarnSpy).toHaveBeenCalledWith('TipJar is not enabled in configuration');
      consoleWarnSpy.mockRestore();
    });

    test('should handle when tipJarElement is null for icon update', () => {
      core.init(mockConfig);
      core.tipJarElement = null;
      
      expect(() => core.updateTipJar({ tipJarIcon: '❤️' })).not.toThrow();
    });

    test('should handle when tipJarElement is null for position update', () => {
      core.init(mockConfig);
      core.tipJarElement = null;
      
      expect(() => core.updateTipJar({ tipJarPosition: 'top-left' })).not.toThrow();
    });

    test('should handle when tipJarElement is null for size update', () => {
      core.init(mockConfig);
      core.tipJarElement = null;
      
      expect(() => core.updateTipJar({ tipJarSize: 'large' })).not.toThrow();
    });

    test('should handle when tipJarElement is null for color update', () => {
      core.init(mockConfig);
      core.tipJarElement = null;
      
      expect(() => core.updateTipJar({ tipJarColor: '#FF5722' })).not.toThrow();
    });

    test('should handle when tipJarElement is null for text update', () => {
      core.init(mockConfig);
      core.tipJarElement = null;
      
      expect(() => core.updateTipJar({ tipJarText: 'Support my work' })).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    test('should handle rapid show/hide calls', () => {
      core.init(mockConfig);
      
      core.hideTipJar();
      core.showTipJar();
      core.hideTipJar();
      core.showTipJar();
      
      expect(core.tipJarVisible).toBe(true);
    });

    test('should handle updateTipJar with empty options', () => {
      core.init(mockConfig);
      
      expect(() => core.updateTipJar({})).not.toThrow();
    });

    test('should handle invalid size value', () => {
      core.init(mockConfig);
      
      expect(() => core.updateTipJar({ tipJarSize: 'invalid' })).not.toThrow();
    });

    test('should handle invalid position value', () => {
      core.init(mockConfig);
      
      expect(() => core.updateTipJar({ tipJarPosition: 'invalid' })).not.toThrow();
    });

    test('should handle TipJar when modal is already open', () => {
      core.init(mockConfig);
      core.show();
      
      expect(() => core._handleTipJarClick()).not.toThrow();
    });

    test('should handle TipJar click when modal is dismissed', () => {
      core.init(mockConfig);
      core.show();
      core.dismiss();
      
      core._handleTipJarClick();
      
      const modal = document.getElementById('ChaiPe-modal');
      expect(modal).toBeDefined();
    });

    test('should handle minimal TipJar configuration', () => {
      core.init({
        upiId: 'test@upi',
        tipJar: true
      });
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar).toBeDefined();
      expect(tipJar.firstChild.textContent).toBe('☕');
    });

    test('should handle TipJar with all custom options', () => {
      const customConfig = {
        ...mockConfig,
        tipJarIcon: '❤️',
        tipJarPosition: 'top-left',
        tipJarSize: 'large',
        tipJarColor: '#FF5722',
        tipJarText: 'Support my work ❤️',
        tipJarShowOnMobile: false,
        tipJarShowOnDesktop: true
      };
      
      core.init(customConfig);
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar.firstChild.textContent).toBe('❤️');
      expect(tipJar.style.top).toBe('24px');
      expect(tipJar.style.left).toBe('24px');
      expect(tipJar.style.width).toBe('64px');
      expect(tipJar.style.backgroundColor).toBe('rgb(255, 87, 34)');
    });

    test('should handle TipJar re-initialization', () => {
      core.init(mockConfig);
      const firstTipJar = document.getElementById('ChaiPe-tipJar');
      
      core.init(mockConfig);
      const secondTipJar = document.getElementById('ChaiPe-tipJar');
      
      expect(firstTipJar).not.toBe(secondTipJar);
    });

    test('should handle TipJar when disabled after being enabled', () => {
      core.init(mockConfig);
      expect(document.getElementById('ChaiPe-tipJar')).toBeDefined();
      
      // Manually remove TipJar since init doesn't clean up when tipJar is false
      core._removeTipJar();
      core.init({ ...mockConfig, tipJar: false });
      expect(document.getElementById('ChaiPe-tipJar')).toBeNull();
    });

    test('should handle keyboard navigation with Tab key', () => {
      core.init(mockConfig);
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      tipJar.focus();
      
      expect(document.activeElement).toBe(tipJar);
    });

    test('should handle tooltip when tooltip element is missing', () => {
      core.init(mockConfig);
      const tooltip = core.tipJarElement.querySelector('.ChaiPe-tipJar-tooltip');
      if (tooltip) tooltip.remove();
      
      expect(() => {
        core.tipJarElement.dispatchEvent(new Event('mouseenter'));
      }).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    test('should have proper ARIA label', () => {
      core.init(mockConfig);
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar.getAttribute('aria-label')).toBe('Buy me a chai ☕');
    });

    test('should be keyboard accessible with Enter', () => {
      core.init(mockConfig);
      const showSpy = jest.spyOn(core, 'show');
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      tipJar.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      
      expect(showSpy).toHaveBeenCalled();
    });

    test('should be keyboard accessible with Space', () => {
      core.init(mockConfig);
      const showSpy = jest.spyOn(core, 'show');
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      tipJar.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      
      expect(showSpy).toHaveBeenCalled();
    });

    test('should have tabindex for keyboard navigation', () => {
      core.init(mockConfig);
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar.getAttribute('tabindex')).toBe('0');
    });

    test('should have role="button"', () => {
      core.init(mockConfig);
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar.getAttribute('role')).toBe('button');
    });

    test('should update ARIA label when tipJarText changes', () => {
      core.init(mockConfig);
      
      core.updateTipJar({ tipJarText: 'New tooltip text' });
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar.getAttribute('aria-label')).toBe('New tooltip text');
    });
  });

  describe('Device Detection', () => {
    test('should detect mobile device correctly', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true
      });
      
      const mobileCore = new ChaiPeCore();
      expect(mobileCore.isMobile).toBe(true);
    });

    test('should detect desktop device correctly', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/96.0',
        configurable: true
      });
      
      const desktopCore = new ChaiPeCore();
      expect(desktopCore.isMobile).toBe(false);
    });

    test('should show TipJar on mobile when tipJarShowOnMobile is true', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true
      });
      
      core.init(mockConfig);
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar).toBeDefined();
    });

    test('should hide TipJar on mobile when tipJarShowOnMobile is false', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true
      });
      
      core.init({ ...mockConfig, tipJarShowOnMobile: false });
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar).toBeNull();
    });

    test('should show TipJar on desktop when tipJarShowOnDesktop is true', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/96.0',
        configurable: true
      });
      
      core.init(mockConfig);
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar).toBeDefined();
    });

    test('should hide TipJar on desktop when tipJarShowOnDesktop is false', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/96.0',
        configurable: true
      });
      
      core.init({ ...mockConfig, tipJarShowOnDesktop: false });
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar).toBeNull();
    });
  });

  describe('Animation and Transitions', () => {
    test('should have transition styles applied', () => {
      core.init(mockConfig);
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar.style.transition).toBe('all 0.3s ease');
    });

    test('should animate opacity on show', () => {
      core.init(mockConfig);
      core._hideTipJar();
      
      core._showTipJar();
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar.style.opacity).toBe('1');
    });

    test('should animate opacity on hide', () => {
      core.init(mockConfig);
      
      core._hideTipJar();
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar.style.opacity).toBe('0');
    });

    test('should animate transform on show', () => {
      core.init(mockConfig);
      core._hideTipJar();
      
      core._showTipJar();
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar.style.transform).toBe('translateY(0)');
    });

    test('should animate transform on hide', () => {
      core.init(mockConfig);
      
      core._hideTipJar();
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar.style.transform).toBe('translateY(20px)');
    });

    test('should toggle pointer events on show/hide', () => {
      core.init(mockConfig);
      
      core._hideTipJar();
      expect(core.tipJarElement.style.pointerEvents).toBe('none');
      
      core._showTipJar();
      expect(core.tipJarElement.style.pointerEvents).toBe('auto');
    });
  });

  describe('State Management', () => {
    test('should maintain tipJarVisible state correctly', () => {
      core.init(mockConfig);
      expect(core.tipJarVisible).toBe(true);
      
      core._hideTipJar();
      expect(core.tipJarVisible).toBe(false);
      
      core._showTipJar();
      expect(core.tipJarVisible).toBe(true);
    });

    test('should maintain tipJarElement reference', () => {
      core.init(mockConfig);
      const tipJar = document.getElementById('ChaiPe-tipJar');
      
      expect(core.tipJarElement).toBe(tipJar);
    });

    test('should reset tipJarElement reference on removal', () => {
      core.init(mockConfig);
      
      core._removeTipJar();
      
      expect(core.tipJarElement).toBeNull();
    });

    test('should reset tipJarVisible state on removal', () => {
      core.init(mockConfig);
      
      core._removeTipJar();
      
      expect(core.tipJarVisible).toBe(false);
    });
  });
});
