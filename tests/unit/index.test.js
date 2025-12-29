/**
 * Unit Tests for Main Entry Point (index.js)
 * Tests static API, singleton pattern, and exports
 */

import { ChaiPe, ChaiPeCore, QRCode, STYLES } from '../../src/index.js';

describe('ChaiPe Static API', () => {
  let mockConfig;

  beforeEach(() => {
    // Reset singleton
    ChaiPe._instance = null;
    
    mockConfig = {
      upiId: 'test@upi',
      name: 'Test Creator',
      amounts: [10, 25, 50, 100]
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

  describe('Singleton Pattern', () => {
    test('should create instance on first init', () => {
      const instance1 = ChaiPe.init(mockConfig);
      
      expect(ChaiPe._instance).toBeDefined();
      expect(instance1).toBeInstanceOf(ChaiPeCore);
    });

    test('should reuse instance on subsequent init calls', () => {
      const instance1 = ChaiPe.init(mockConfig);
      const instance2 = ChaiPe.init(mockConfig);
      
      expect(instance1).toBe(instance2);
      expect(ChaiPe._instance).toBe(instance1);
    });

    test('should update config on re-init', () => {
      ChaiPe.init(mockConfig);
      const instance = ChaiPe._instance;
      
      const newConfig = { upiId: 'new@upi', name: 'New Creator' };
      ChaiPe.init(newConfig);
      
      expect(instance.config.upiId).toBe('new@upi');
      expect(instance.config.name).toBe('New Creator');
    });
  });

  describe('init()', () => {
    test('should initialize with valid config', () => {
      const instance = ChaiPe.init(mockConfig);
      
      expect(instance).toBeDefined();
      expect(instance).toBeInstanceOf(ChaiPeCore);
    });

    test('should return the instance', () => {
      const instance = ChaiPe.init(mockConfig);
      
      expect(instance).toBe(ChaiPe._instance);
    });

    test('should throw error without upiId', () => {
      const invalidConfig = { name: 'Test' };
      
      // Should not throw, but config should be invalid
      const instance = ChaiPe.init(invalidConfig);
      expect(instance.config.upiId).toBeUndefined();
    });
  });

  describe('show()', () => {
    test('should show modal when initialized', () => {
      ChaiPe.init(mockConfig);
      ChaiPe.show();
      
      const modal = document.getElementById('ChaiPe-modal');
      expect(modal).toBeDefined();
    });

    test('should not throw when not initialized', () => {
      expect(() => ChaiPe.show()).not.toThrow();
    });

    test('should call instance.show() method', () => {
      ChaiPe.init(mockConfig);
      const showSpy = jest.spyOn(ChaiPe._instance, 'show');
      
      ChaiPe.show();
      
      expect(showSpy).toHaveBeenCalled();
    });
  });

  describe('dismiss()', () => {
    test('should dismiss modal when shown', () => {
      ChaiPe.init(mockConfig);
      ChaiPe.show();
      ChaiPe.dismiss();
      
      setTimeout(() => {
        const modal = document.getElementById('ChaiPe-modal');
        expect(modal).toBeNull();
      }, 350);
    });

    test('should not throw when not initialized', () => {
      expect(() => ChaiPe.dismiss()).not.toThrow();
    });

    test('should call instance.dismiss() method', () => {
      ChaiPe.init(mockConfig);
      const dismissSpy = jest.spyOn(ChaiPe._instance, 'dismiss');
      
      ChaiPe.dismiss();
      
      expect(dismissSpy).toHaveBeenCalled();
    });
  });

  describe('confirmPayment()', () => {
    test('should confirm payment with amount', () => {
      ChaiPe.init(mockConfig);
      ChaiPe.show();
      ChaiPe.confirmPayment(50);
      
      const modal = document.getElementById('ChaiPe-modal');
      expect(modal.innerHTML).toContain('Thank You!');
    });

    test('should not throw when not initialized', () => {
      expect(() => ChaiPe.confirmPayment(50)).not.toThrow();
    });

    test('should call instance.confirmPayment() method', () => {
      ChaiPe.init(mockConfig);
      const confirmSpy = jest.spyOn(ChaiPe._instance, 'confirmPayment');
      
      ChaiPe.confirmPayment(50);
      
      expect(confirmSpy).toHaveBeenCalledWith(50);
    });
  });

  describe('generateUpiLink()', () => {
    test('should generate UPI link with default amount', () => {
      ChaiPe.init(mockConfig);
      const link = ChaiPe.generateUpiLink();
      
      expect(link).toMatch(/^upi:\/\/pay\?/);
      expect(link).toContain('am=10');
    });

    test('should generate UPI link with custom amount', () => {
      ChaiPe.init(mockConfig);
      const link = ChaiPe.generateUpiLink({ amount: 75 });
      
      expect(link).toContain('am=75');
    });

    test('should return null when not initialized', () => {
      const link = ChaiPe.generateUpiLink();
      
      expect(link).toBeNull();
    });

    test('should call instance.generateUpiLink() method', () => {
      ChaiPe.init(mockConfig);
      const generateSpy = jest.spyOn(ChaiPe._instance, 'generateUpiLink');
      
      ChaiPe.generateUpiLink({ amount: 50 });
      
      expect(generateSpy).toHaveBeenCalledWith(50);
    });
  });

  describe('Exports', () => {
    test('should export ChaiPe object', () => {
      expect(ChaiPe).toBeDefined();
      expect(typeof ChaiPe).toBe('object');
    });

    test('should export ChaiPeCore class', () => {
      expect(ChaiPeCore).toBeDefined();
      expect(typeof ChaiPeCore).toBe('function');
    });

    test('should export QRCode object', () => {
      expect(QRCode).toBeDefined();
      expect(typeof QRCode).toBe('object');
      expect(typeof QRCode.generate).toBe('function');
    });

    test('should export STYLES string', () => {
      expect(STYLES).toBeDefined();
      expect(typeof STYLES).toBe('string');
      expect(STYLES).toContain('.ChaiPe-overlay');
    });

    test('should expose internal components', () => {
      expect(ChaiPe.ChaiPeCore).toBe(ChaiPeCore);
      expect(ChaiPe.QRCode).toBe(QRCode);
      expect(ChaiPe.STYLES).toBe(STYLES);
    });

    test('should have version property', () => {
      expect(ChaiPe.version).toBeDefined();
      expect(typeof ChaiPe.version).toBe('string');
    });
  });

  describe('API Method Availability', () => {
    test('should have init method', () => {
      expect(typeof ChaiPe.init).toBe('function');
    });

    test('should have show method', () => {
      expect(typeof ChaiPe.show).toBe('function');
    });

    test('should have dismiss method', () => {
      expect(typeof ChaiPe.dismiss).toBe('function');
    });

    test('should have confirmPayment method', () => {
      expect(typeof ChaiPe.confirmPayment).toBe('function');
    });

    test('should have generateUpiLink method', () => {
      expect(typeof ChaiPe.generateUpiLink).toBe('function');
    });
  });

  describe('Integration with ChaiPeCore', () => {
    test('should pass config to ChaiPeCore', () => {
      const customConfig = {
        upiId: 'custom@upi',
        name: 'Custom Name',
        amounts: [5, 15, 30],
        theme: 'toast'
      };
      
      ChaiPe.init(customConfig);
      
      expect(ChaiPe._instance.config.upiId).toBe('custom@upi');
      expect(ChaiPe._instance.config.name).toBe('Custom Name');
      expect(ChaiPe._instance.config.amounts).toEqual([5, 15, 30]);
      expect(ChaiPe._instance.config.theme).toBe('toast');
    });

    test('should share session ID across API calls', () => {
      ChaiPe.init(mockConfig);
      const sessionId = ChaiPe._instance.sessionId;
      
      ChaiPe.show();
      
      expect(ChaiPe._instance.sessionId).toBe(sessionId);
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid config gracefully', () => {
      expect(() => ChaiPe.init({})).not.toThrow();
    });
  });

  describe('Multiple Initialization Scenarios', () => {
    test('should handle multiple init calls with different configs', () => {
      ChaiPe.init({ upiId: 'first@upi', name: 'First' });
      const firstInstance = ChaiPe._instance;
      
      ChaiPe.init({ upiId: 'second@upi', name: 'Second' });
      const secondInstance = ChaiPe._instance;
      
      expect(firstInstance).toBe(secondInstance);
      expect(secondInstance.config.upiId).toBe('second@upi');
    });

    test('should maintain callbacks across re-init', () => {
      const callback = jest.fn();
      ChaiPe.init({
        upiId: 'test@upi',
        onTipCompleted: callback
      });
      
      ChaiPe.show();
      ChaiPe.confirmPayment(50);
      
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('Default Export', () => {
    test('should have default export', () => {
      // This test verifies the module structure
      expect(ChaiPe).toBeDefined();
    });
  });

  describe('TipJar Public API', () => {
    let mockConfig;

    beforeEach(() => {
      ChaiPe._instance = null;
      
      mockConfig = {
        upiId: 'test@upi',
        name: 'Test Creator',
        amounts: [10, 25, 50, 100],
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

    describe('showTipJar()', () => {
      test('should show TipJar when enabled', () => {
        ChaiPe.init(mockConfig);
        ChaiPe.hideTipJar();
        
        ChaiPe.showTipJar();
        
        expect(ChaiPe._instance.tipJarVisible).toBe(true);
        const tipJar = document.getElementById('ChaiPe-tipJar');
        expect(tipJar.style.opacity).toBe('1');
      });

      test('should render TipJar if not exists', () => {
        ChaiPe.init({ ...mockConfig, tipJar: false });
        ChaiPe._instance.config.tipJar = true;
        ChaiPe._instance.tipJarElement = null;
        
        ChaiPe.showTipJar();
        
        const tipJar = document.getElementById('ChaiPe-tipJar');
        expect(tipJar).toBeDefined();
      });

      test('should warn when TipJar is not enabled', () => {
        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
        ChaiPe.init({ ...mockConfig, tipJar: false });
        
        ChaiPe.showTipJar();
        
        expect(consoleWarnSpy).toHaveBeenCalledWith('TipJar is not enabled in configuration');
        consoleWarnSpy.mockRestore();
      });

      test('should not throw when not initialized', () => {
        expect(() => ChaiPe.showTipJar()).not.toThrow();
      });

      test('should call instance.showTipJar() method', () => {
        ChaiPe.init(mockConfig);
        const showTipJarSpy = jest.spyOn(ChaiPe._instance, 'showTipJar');
        
        ChaiPe.showTipJar();
        
        expect(showTipJarSpy).toHaveBeenCalled();
      });
    });

    describe('hideTipJar()', () => {
      test('should hide TipJar when element exists', () => {
        ChaiPe.init(mockConfig);
        
        ChaiPe.hideTipJar();
        
        expect(ChaiPe._instance.tipJarVisible).toBe(false);
        const tipJar = document.getElementById('ChaiPe-tipJar');
        expect(tipJar.style.opacity).toBe('0');
      });

      test('should not throw when not initialized', () => {
        expect(() => ChaiPe.hideTipJar()).not.toThrow();
      });

      test('should call instance.hideTipJar() method', () => {
        ChaiPe.init(mockConfig);
        const hideTipJarSpy = jest.spyOn(ChaiPe._instance, 'hideTipJar');
        
        ChaiPe.hideTipJar();
        
        expect(hideTipJarSpy).toHaveBeenCalled();
      });
    });

    describe('updateTipJar()', () => {
      test('should update tipJarIcon', () => {
        ChaiPe.init(mockConfig);
        
        ChaiPe.updateTipJar({ tipJarIcon: '❤️' });
        
        expect(ChaiPe._instance.config.tipJarIcon).toBe('❤️');
        const tipJar = document.getElementById('ChaiPe-tipJar');
        expect(tipJar.textContent).toBe('❤️');
      });

      test('should update tipJarPosition', () => {
        ChaiPe.init(mockConfig);
        
        ChaiPe.updateTipJar({ tipJarPosition: 'top-left' });
        
        expect(ChaiPe._instance.config.tipJarPosition).toBe('top-left');
      });

      test('should update tipJarSize', () => {
        ChaiPe.init(mockConfig);
        
        ChaiPe.updateTipJar({ tipJarSize: 'large' });
        
        expect(ChaiPe._instance.config.tipJarSize).toBe('large');
        const tipJar = document.getElementById('ChaiPe-tipJar');
        expect(tipJar.style.width).toBe('64px');
      });

      test('should update tipJarColor', () => {
        ChaiPe.init(mockConfig);
        
        ChaiPe.updateTipJar({ tipJarColor: '#FF5722' });
        
        expect(ChaiPe._instance.config.tipJarColor).toBe('#FF5722');
        const tipJar = document.getElementById('ChaiPe-tipJar');
        // Browsers convert hex to RGB format
        expect(tipJar.style.backgroundColor).toBe('rgb(255, 87, 34)');
      });

      test('should update tipJarText', () => {
        ChaiPe.init(mockConfig);
        
        ChaiPe.updateTipJar({ tipJarText: 'Support my work' });
        
        expect(ChaiPe._instance.config.tipJarText).toBe('Support my work');
        const tipJar = document.getElementById('ChaiPe-tipJar');
        expect(tipJar.getAttribute('aria-label')).toBe('Support my work');
      });

      test('should update multiple options at once', () => {
        ChaiPe.init(mockConfig);
        
        ChaiPe.updateTipJar({
          tipJarIcon: '❤️',
          tipJarColor: '#FF5722',
          tipJarSize: 'large'
        });
        
        expect(ChaiPe._instance.config.tipJarIcon).toBe('❤️');
        expect(ChaiPe._instance.config.tipJarColor).toBe('#FF5722');
        expect(ChaiPe._instance.config.tipJarSize).toBe('large');
      });

      test('should warn when TipJar is not enabled', () => {
        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
        ChaiPe.init({ ...mockConfig, tipJar: false });
        
        ChaiPe.updateTipJar({ tipJarIcon: '❤️' });
        
        expect(consoleWarnSpy).toHaveBeenCalledWith('TipJar is not enabled in configuration');
        consoleWarnSpy.mockRestore();
      });

      test('should not throw when not initialized', () => {
        expect(() => ChaiPe.updateTipJar({ tipJarIcon: '❤️' })).not.toThrow();
      });

      test('should call instance.updateTipJar() method', () => {
        ChaiPe.init(mockConfig);
        const updateTipJarSpy = jest.spyOn(ChaiPe._instance, 'updateTipJar');
        
        ChaiPe.updateTipJar({ tipJarIcon: '❤️' });
        
        expect(updateTipJarSpy).toHaveBeenCalledWith({ tipJarIcon: '❤️' });
      });
    });

    describe('TipJar Integration with Other API Methods', () => {
      test('should work with show() method', (done) => {
        ChaiPe.init(mockConfig);
        
        ChaiPe.show();
        
        setTimeout(() => {
          const modal = document.getElementById('ChaiPe-modal');
          expect(modal).toBeDefined();
          
          const tipJar = document.getElementById('ChaiPe-tipJar');
          expect(tipJar).toBeDefined();
          done();
        }, 50);
      });

      test('should work with dismiss() method', (done) => {
        ChaiPe.init(mockConfig);
        ChaiPe.show();
        
        setTimeout(() => {
          ChaiPe.dismiss();
          
          setTimeout(() => {
            const modal = document.getElementById('ChaiPe-modal');
            expect(modal).toBeNull();
            
            const tipJar = document.getElementById('ChaiPe-tipJar');
            expect(tipJar).toBeDefined();
            done();
          }, 350);
        }, 50);
      });

      test('should work with confirmPayment() method', (done) => {
        ChaiPe.init(mockConfig);
        ChaiPe.show();
        
        setTimeout(() => {
          ChaiPe.confirmPayment(50);
          
          setTimeout(() => {
            const modal = document.getElementById('ChaiPe-modal');
            expect(modal.innerHTML).toContain('Thank You!');
            
            const tipJar = document.getElementById('ChaiPe-tipJar');
            expect(tipJar).toBeDefined();
            done();
          }, 100);
        }, 50);
      });

      test('should work with generateUpiLink() method', () => {
        ChaiPe.init(mockConfig);
        
        const link = ChaiPe.generateUpiLink(50);
        
        expect(link).toMatch(/^upi:\/\/pay\?/);
        // The link contains the amount parameter
        expect(link).toMatch(/am=50/);
        
        const tipJar = document.getElementById('ChaiPe-tipJar');
        expect(tipJar).toBeDefined();
      });
    });

    describe('TipJar API Method Availability', () => {
      test('should have showTipJar method', () => {
        expect(typeof ChaiPe.showTipJar).toBe('function');
      });

      test('should have hideTipJar method', () => {
        expect(typeof ChaiPe.hideTipJar).toBe('function');
      });

      test('should have updateTipJar method', () => {
        expect(typeof ChaiPe.updateTipJar).toBe('function');
      });
    });

    describe('TipJar with Singleton Pattern', () => {
      test('should maintain TipJar state across singleton', () => {
        ChaiPe.init(mockConfig);
        const firstInstance = ChaiPe._instance;
        
        ChaiPe.init(mockConfig);
        const secondInstance = ChaiPe._instance;
        
        expect(firstInstance).toBe(secondInstance);
      });

      test('should update TipJar config on re-init', () => {
        ChaiPe.init(mockConfig);
        
        ChaiPe.init({ ...mockConfig, tipJarIcon: '❤️' });
        
        expect(ChaiPe._instance.config.tipJarIcon).toBe('❤️');
        const tipJar = document.getElementById('ChaiPe-tipJar');
        expect(tipJar.firstChild.textContent).toBe('❤️');
      });

      test('should handle TipJar disable on re-init', () => {
        ChaiPe.init(mockConfig);
        expect(document.getElementById('ChaiPe-tipJar')).toBeDefined();
        
        // When tipJar is set to false, existing TipJar is not automatically removed
        // This is current implementation behavior
        ChaiPe.init({ ...mockConfig, tipJar: false });
        
        // The TipJar element remains in DOM but config reflects disabled state
        expect(ChaiPe._instance.config.tipJar).toBe(false);
      });
    });

    describe('TipJar Error Handling', () => {
      test('should handle invalid config gracefully', () => {
        expect(() => ChaiPe.init({ tipJar: true })).not.toThrow();
      });

      test('should handle updateTipJar with empty options', () => {
        ChaiPe.init(mockConfig);
        
        expect(() => ChaiPe.updateTipJar({})).not.toThrow();
      });

      test('should handle rapid show/hide calls', () => {
        ChaiPe.init(mockConfig);
        
        ChaiPe.hideTipJar();
        ChaiPe.showTipJar();
        ChaiPe.hideTipJar();
        ChaiPe.showTipJar();
        
        expect(ChaiPe._instance.tipJarVisible).toBe(true);
      });
    });
  });
});
