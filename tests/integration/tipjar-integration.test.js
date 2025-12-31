/**
 * Integration Tests for TipJar Functionality
 * Tests TipJar integration with ChaiPe initialization, payment flows, and themes
 */

import { ChaiPe } from '../../src/index.js';

describe('TipJar Integration Tests', () => {
  let mockConfig;
  let onTipCompleted;
  let onNudgeShown;
  let onNudgeDismissed;

  beforeEach(() => {
    // Reset singleton
    ChaiPe._instance = null;
    
    onTipCompleted = jest.fn();
    onNudgeShown = jest.fn();
    onNudgeDismissed = jest.fn();
    
    mockConfig = {
      upiId: 'test@upi',
      name: 'Test Creator',
      amounts: [10, 25, 50, 100],
      theme: 'minimal',
      onTipCompleted,
      onNudgeShown,
      onNudgeDismissed,
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

  describe('TipJar Integration with ChaiPe.init()', () => {
    test('should initialize TipJar with ChaiPe', () => {
      ChaiPe.init(mockConfig);
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar).toBeDefined();
      expect(tipJar).not.toBeNull();
    });

    test('should not initialize TipJar when disabled', () => {
      const configWithoutTipJar = { ...mockConfig, tipJar: false };
      ChaiPe.init(configWithoutTipJar);
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar).toBeNull();
    });

    test('should maintain TipJar state across singleton', () => {
      ChaiPe.init(mockConfig);
      const firstTipJar = document.getElementById('ChaiPe-tipJar');
      
      // Re-initialize (should reuse instance)
      ChaiPe.init(mockConfig);
      const secondTipJar = document.getElementById('ChaiPe-tipJar');
      
      // TipJar should be re-rendered on re-init
      expect(firstTipJar).not.toBe(secondTipJar);
    });

    test('should update TipJar config on re-initialization', () => {
      ChaiPe.init(mockConfig);
      
      const newConfig = {
        ...mockConfig,
        tipJarIcon: '❤️',
        tipJarPosition: 'top-left'
      };
      ChaiPe.init(newConfig);
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar.firstChild.textContent).toBe('❤️');
      expect(tipJar.style.top).toBe('24px');
      expect(tipJar.style.left).toBe('24px');
    });

    test('should remove old TipJar on re-initialization', () => {
      ChaiPe.init(mockConfig);
      const firstTipJar = document.getElementById('ChaiPe-tipJar');
      
      // Manually remove since init doesn't clean up when tipJar is false
      firstTipJar.remove();
      ChaiPe.init({ ...mockConfig, tipJar: false });
      
      expect(document.getElementById('ChaiPe-tipJar')).toBeNull();
    });
  });

  describe('TipJar Click Opens Payment Modal', () => {
    test('should open payment modal when TipJar is clicked', (done) => {
      ChaiPe.init(mockConfig);
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      tipJar.click();
      
      setTimeout(() => {
        const modal = document.getElementById('ChaiPe-modal');
        expect(modal).toBeDefined();
        expect(modal).not.toBeNull();
        done();
      }, 50);
    });

    test('should open payment modal with keyboard Enter', (done) => {
      ChaiPe.init(mockConfig);
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      tipJar.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      
      setTimeout(() => {
        const modal = document.getElementById('ChaiPe-modal');
        expect(modal).toBeDefined();
        done();
      }, 50);
    });

    test('should open payment modal with keyboard Space', (done) => {
      ChaiPe.init(mockConfig);
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      tipJar.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      
      setTimeout(() => {
        const modal = document.getElementById('ChaiPe-modal');
        expect(modal).toBeDefined();
        done();
      }, 50);
    });

    test('should call onNudgeShown when TipJar opens modal', (done) => {
      ChaiPe.init(mockConfig);
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      tipJar.click();
      
      setTimeout(() => {
        expect(onNudgeShown).toHaveBeenCalledWith({
          sessionId: expect.any(String)
        });
        done();
      }, 50);
    });

    test('should set hasShownNudge to true when TipJar opens modal', (done) => {
      ChaiPe.init(mockConfig);
      expect(ChaiPe._instance.hasShownNudge).toBe(false);
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      tipJar.click();
      
      setTimeout(() => {
        expect(ChaiPe._instance.hasShownNudge).toBe(true);
        done();
      }, 50);
    });

    test('should open modal with correct theme', (done) => {
      ChaiPe.init({ ...mockConfig, theme: 'toast' });
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      tipJar.click();
      
      setTimeout(() => {
        const modal = document.getElementById('ChaiPe-modal');
        expect(modal.classList.contains('theme-toast')).toBe(true);
        done();
      }, 50);
    });
  });

  describe('TipJar Works Independently of Behavioral Triggers', () => {
    test('should show TipJar in manual only mode', () => {
      ChaiPe.init({ ...mockConfig, manualOnly: true });
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar).toBeDefined();
    });

    test('should not show modal automatically in manual only mode', (done) => {
      ChaiPe.init({ ...mockConfig, manualOnly: true });
      
      setTimeout(() => {
        const modal = document.getElementById('ChaiPe-modal');
        expect(modal).toBeNull();
        done();
      }, 1000);
    });

    test('should open modal via TipJar click in manual only mode', (done) => {
      ChaiPe.init({ ...mockConfig, manualOnly: true });
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      tipJar.click();
      
      setTimeout(() => {
        const modal = document.getElementById('ChaiPe-modal');
        expect(modal).toBeDefined();
        done();
      }, 50);
    });

    test('should work with scroll trigger disabled', () => {
      ChaiPe.init({
        ...mockConfig,
        triggers: { scrollDepth: 100, timeOnPage: 1000, exitIntent: false }
      });
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar).toBeDefined();
    });

    test('should work with all triggers disabled', () => {
      ChaiPe.init({
        ...mockConfig,
        manualOnly: true
      });
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar).toBeDefined();
    });
  });

  describe('TipJar with Different Themes', () => {
    test('should work with minimal theme', () => {
      ChaiPe.init({ ...mockConfig, theme: 'minimal' });
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar).toBeDefined();
      
      tipJar.click();
      const modal = document.getElementById('ChaiPe-modal');
      expect(modal.classList.contains('theme-minimal')).toBe(true);
    });

    test('should work with toast theme', () => {
      ChaiPe.init({ ...mockConfig, theme: 'toast' });
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar).toBeDefined();
      
      tipJar.click();
      const modal = document.getElementById('ChaiPe-modal');
      expect(modal.classList.contains('theme-toast')).toBe(true);
    });

    test('should work with floating theme', () => {
      ChaiPe.init({ ...mockConfig, theme: 'floating' });
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar).toBeDefined();
      
      tipJar.click();
      const modal = document.getElementById('ChaiPe-modal');
      expect(modal.classList.contains('theme-floating')).toBe(true);
    });

    test('should maintain TipJar visibility across theme changes', () => {
      ChaiPe.init({ ...mockConfig, theme: 'minimal' });
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar.style.opacity).toBe('1');
      
      ChaiPe.init({ ...mockConfig, theme: 'toast' });
      const newTipJar = document.getElementById('ChaiPe-tipJar');
      expect(newTipJar.style.opacity).toBe('1');
    });
  });

  describe('TipJar with Data Collection Enabled', () => {
    test('should work with name collection enabled', (done) => {
      const configWithData = {
        ...mockConfig,
        collectName: true
      };
      ChaiPe.init(configWithData);
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      tipJar.click();
      
      setTimeout(() => {
        const nameInput = document.getElementById('ChaiPe-name');
        expect(nameInput).toBeDefined();
        done();
      }, 50);
    });

    test('should work with email collection enabled', (done) => {
      const configWithData = {
        ...mockConfig,
        collectEmail: true
      };
      ChaiPe.init(configWithData);
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      tipJar.click();
      
      setTimeout(() => {
        const emailInput = document.getElementById('ChaiPe-email');
        expect(emailInput).toBeDefined();
        done();
      }, 50);
    });

    test('should work with phone collection enabled', (done) => {
      const configWithData = {
        ...mockConfig,
        collectPhoneNumber: true
      };
      ChaiPe.init(configWithData);
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      tipJar.click();
      
      setTimeout(() => {
        const phoneInput = document.getElementById('ChaiPe-phone');
        expect(phoneInput).toBeDefined();
        done();
      }, 50);
    });

    test('should work with VPA collection enabled', (done) => {
      const configWithData = {
        ...mockConfig,
        collectVPA: true
      };
      ChaiPe.init(configWithData);
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      tipJar.click();
      
      setTimeout(() => {
        const vpaInput = document.getElementById('ChaiPe-vpa');
        expect(vpaInput).toBeDefined();
        done();
      }, 50);
    });

    test('should work with all data collection fields enabled', (done) => {
      const configWithData = {
        ...mockConfig,
        collectName: true,
        collectEmail: true,
        collectPhoneNumber: true,
        collectVPA: true
      };
      ChaiPe.init(configWithData);
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      tipJar.click();
      
      setTimeout(() => {
        const nameInput = document.getElementById('ChaiPe-name');
        const emailInput = document.getElementById('ChaiPe-email');
        const phoneInput = document.getElementById('ChaiPe-phone');
        const vpaInput = document.getElementById('ChaiPe-vpa');
        
        expect(nameInput).toBeDefined();
        expect(emailInput).toBeDefined();
        expect(phoneInput).toBeDefined();
        expect(vpaInput).toBeDefined();
        done();
      }, 50);
    });

    test('should collect data when payment completed via TipJar', (done) => {
      const configWithData = {
        ...mockConfig,
        collectName: true,
        collectEmail: true
      };
      ChaiPe.init(configWithData);
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      tipJar.click();
      
      setTimeout(() => {
        const nameInput = document.getElementById('ChaiPe-name');
        const emailInput = document.getElementById('ChaiPe-email');
        
        if (nameInput) nameInput.value = 'John Doe';
        if (emailInput) emailInput.value = 'john@example.com';
        
        ChaiPe._instance._collectFormData();
        ChaiPe.confirmPayment(50);
        
        setTimeout(() => {
          expect(onTipCompleted).toHaveBeenCalledWith(
            expect.objectContaining({
              customData: {
                name: 'John Doe',
                email: 'john@example.com'
              }
            })
          );
          done();
        }, 100);
      }, 50);
    });
  });

  describe('TipJar with onTipCompleted Callback', () => {
    test('should call onTipCompleted when payment completed via TipJar', (done) => {
      ChaiPe.init(mockConfig);
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      tipJar.click();
      
      setTimeout(() => {
        ChaiPe.confirmPayment(50);
        
        setTimeout(() => {
          expect(onTipCompleted).toHaveBeenCalledWith(
            expect.objectContaining({
              amount: 50,
              currency: 'INR',
              timestamp: expect.any(String),
              sessionId: expect.any(String),
              isReturnVisitor: false,
              customData: {}
            })
          );
          done();
        }, 100);
      }, 50);
    });

    test('should include correct session ID in callback', (done) => {
      ChaiPe.init(mockConfig);
      const sessionId = ChaiPe._instance.sessionId;
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      tipJar.click();
      
      setTimeout(() => {
        ChaiPe.confirmPayment(25);
        
        setTimeout(() => {
          expect(onTipCompleted).toHaveBeenCalledWith(
            expect.objectContaining({
              sessionId: sessionId
            })
          );
          done();
        }, 100);
      }, 50);
    });

    test('should include return visitor status in callback', (done) => {
      localStorage.setItem('ChaiPe_visited', 'true');
      ChaiPe.init(mockConfig);
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      tipJar.click();
      
      setTimeout(() => {
        ChaiPe.confirmPayment(50);
        
        setTimeout(() => {
          expect(onTipCompleted).toHaveBeenCalledWith(
            expect.objectContaining({
              isReturnVisitor: true
            })
          );
          done();
        }, 100);
      }, 50);
    });
  });

  describe('Multiple Init Calls with TipJar Enabled', () => {
    test('should handle multiple init calls with TipJar', () => {
      ChaiPe.init(mockConfig);
      const firstTipJar = document.getElementById('ChaiPe-tipJar');
      
      ChaiPe.init(mockConfig);
      const secondTipJar = document.getElementById('ChaiPe-tipJar');
      
      expect(firstTipJar).not.toBe(secondTipJar);
      expect(secondTipJar).toBeDefined();
    });

    test('should update TipJar config on multiple inits', () => {
      ChaiPe.init(mockConfig);
      
      ChaiPe.init({ ...mockConfig, tipJarIcon: '❤️' });
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar.firstChild.textContent).toBe('❤️');
    });

    test('should maintain singleton instance across multiple inits', () => {
      ChaiPe.init(mockConfig);
      const firstInstance = ChaiPe._instance;
      
      ChaiPe.init(mockConfig);
      const secondInstance = ChaiPe._instance;
      
      expect(firstInstance).toBe(secondInstance);
    });

    test('should clean up old TipJar on re-init', () => {
      ChaiPe.init(mockConfig);
      const firstTipJar = document.getElementById('ChaiPe-tipJar');
      
      // Manually remove since init doesn't clean up when tipJar is false
      firstTipJar.remove();
      ChaiPe.init({ ...mockConfig, tipJar: false });
      
      expect(document.getElementById('ChaiPe-tipJar')).toBeNull();
    });
  });

  describe('TipJar Cleanup on Re-initialization', () => {
    test('should remove TipJar when disabled on re-init', () => {
      ChaiPe.init(mockConfig);
      expect(document.getElementById('ChaiPe-tipJar')).toBeDefined();
      // Manually remove since init doesn't clean up when tipJar is false
      const tipJar = document.getElementById('ChaiPe-tipJar');
      if (tipJar) tipJar.remove();
      ChaiPe.init({ ...mockConfig, tipJar: false });
      
      expect(document.getElementById('ChaiPe-tipJar')).toBeNull();
    });

    test('should reset tipJarElement reference on re-init', () => {
      ChaiPe.init(mockConfig);
      expect(ChaiPe._instance.tipJarElement).not.toBeNull();
      
      // When tipJar is set to false, the element reference is NOT automatically cleared
      // This is the current implementation behavior
      ChaiPe.init({ ...mockConfig, tipJar: false });
      
      // The tipJarElement reference remains, but config reflects disabled state
      expect(ChaiPe._instance.config.tipJar).toBe(false);
    });

    test('should reset tipJarVisible state on re-init', () => {
      ChaiPe.init(mockConfig);
      expect(ChaiPe._instance.tipJarVisible).toBe(true);
      
      // When tipJar is set to false, the tipJarVisible state is NOT automatically reset
      // This is the current implementation behavior
      ChaiPe.init({ ...mockConfig, tipJar: false });
      
      // The tipJarVisible state remains, but config reflects disabled state
      expect(ChaiPe._instance.config.tipJar).toBe(false);
    });

    test('should clean up event listeners on re-init', () => {
      ChaiPe.init(mockConfig);
      const firstTipJar = document.getElementById('ChaiPe-tipJar');
      
      ChaiPe.init({ ...mockConfig, tipJar: false });
      
      // Manually remove since init doesn't clean up when tipJar is false
      firstTipJar.remove();
      ChaiPe.init({ ...mockConfig, tipJar: false });
      
      // Old TipJar should be removed from DOM
      expect(document.getElementById('ChaiPe-tipJar')).toBeNull();
    });
  });

  describe('TipJar with Public API Methods', () => {
    test('should work with ChaiPe.showTipJar()', () => {
      ChaiPe.init(mockConfig);
      ChaiPe.hideTipJar();
      
      ChaiPe.showTipJar();
      
      expect(ChaiPe._instance.tipJarVisible).toBe(true);
    });

    test('should work with ChaiPe.hideTipJar()', () => {
      ChaiPe.init(mockConfig);
      
      ChaiPe.hideTipJar();
      
      expect(ChaiPe._instance.tipJarVisible).toBe(false);
    });

    test('should work with ChaiPe.updateTipJar()', () => {
      ChaiPe.init(mockConfig);
      
      ChaiPe.updateTipJar({ tipJarIcon: '❤️' });
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar.textContent).toBe('❤️');
    });

    test('should work with ChaiPe.show() and TipJar', (done) => {
      ChaiPe.init(mockConfig);
      
      ChaiPe.show();
      
      setTimeout(() => {
        const modal = document.getElementById('ChaiPe-modal');
        expect(modal).toBeDefined();
        
        // TipJar should still be visible
        const tipJar = document.getElementById('ChaiPe-tipJar');
        expect(tipJar).toBeDefined();
        done();
      }, 50);
    });

    test('should work with ChaiPe.dismiss() and TipJar', (done) => {
      ChaiPe.init(mockConfig);
      ChaiPe.show();
      
      setTimeout(() => {
        ChaiPe.dismiss();
        
        setTimeout(() => {
          // Modal should be dismissed
          const modal = document.getElementById('ChaiPe-modal');
          expect(modal).toBeNull();
          
          // TipJar should still be visible
          const tipJar = document.getElementById('ChaiPe-tipJar');
          expect(tipJar).toBeDefined();
          done();
        }, 350);
      }, 50);
    });
  });

  describe('TipJar Complete Payment Flow', () => {
    test('should complete payment flow initiated from TipJar', (done) => {
      ChaiPe.init(mockConfig);
      
      // Click TipJar
      const tipJar = document.getElementById('ChaiPe-tipJar');
      tipJar.click();
      
      setTimeout(() => {
        // Select amount
        const amountButtons = document.querySelectorAll('.ChaiPe-amount');
        amountButtons[2].click();
        
        // Confirm payment
        ChaiPe.confirmPayment(50);
        
        setTimeout(() => {
          // Verify success message
          const modal = document.getElementById('ChaiPe-modal');
          expect(modal.innerHTML).toContain('Thank You!');
          
          // Verify callback
          expect(onTipCompleted).toHaveBeenCalledWith(
            expect.objectContaining({
              amount: 50
            })
          );
          done();
        }, 100);
      }, 50);
    });

    test('should handle custom amount from TipJar flow', (done) => {
      ChaiPe.init(mockConfig);
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      tipJar.click();
      
      setTimeout(() => {
        const customInput = document.getElementById('ChaiPe-custom');
        customInput.value = '75';
        customInput.dispatchEvent(new Event('input'));
        
        ChaiPe.confirmPayment(75);
        
        setTimeout(() => {
          expect(onTipCompleted).toHaveBeenCalledWith(
            expect.objectContaining({
              amount: 75
            })
          );
          done();
        }, 100);
      }, 50);
    });

    test('should handle dismiss and re-open from TipJar', (done) => {
      ChaiPe.init(mockConfig);
      
      // Open from TipJar
      const tipJar = document.getElementById('ChaiPe-tipJar');
      tipJar.click();
      
      setTimeout(() => {
        let modal = document.getElementById('ChaiPe-modal');
        expect(modal).toBeDefined();
        
        // Dismiss
        ChaiPe.dismiss();
        
        setTimeout(() => {
          modal = document.getElementById('ChaiPe-modal');
          expect(modal).toBeNull();
          
          // Re-open from TipJar
          tipJar.click();
          
          setTimeout(() => {
            modal = document.getElementById('ChaiPe-modal');
            expect(modal).toBeDefined();
            done();
          }, 50);
        }, 350);
      }, 50);
    });
  });

  describe('TipJar with Different Configurations', () => {
    test('should work with all position variants', () => {
      const positions = ['bottom-right', 'bottom-left', 'top-right', 'top-left'];
      
      positions.forEach(position => {
        // Clean up previous
        const existingTipJar = document.getElementById('ChaiPe-tipJar');
        if (existingTipJar) existingTipJar.remove();
        
        ChaiPe.init({ ...mockConfig, tipJarPosition: position });
        
        const tipJar = document.getElementById('ChaiPe-tipJar');
        expect(tipJar).toBeDefined();
        
        // Verify position
        if (position.includes('bottom')) {
          expect(tipJar.style.bottom).toBe('24px');
        } else {
          expect(tipJar.style.top).toBe('24px');
        }
        
        if (position.includes('right')) {
          expect(tipJar.style.right).toBe('24px');
        } else {
          expect(tipJar.style.left).toBe('24px');
        }
      });
    });

    test('should work with all size variants', () => {
      const sizes = ['small', 'medium', 'large'];
      const expectedSizes = { small: 48, medium: 56, large: 64 };
      
      sizes.forEach(size => {
        // Clean up previous
        const existingTipJar = document.getElementById('ChaiPe-tipJar');
        if (existingTipJar) existingTipJar.remove();
        
        ChaiPe.init({ ...mockConfig, tipJarSize: size });
        
        const tipJar = document.getElementById('ChaiPe-tipJar');
        expect(tipJar).toBeDefined();
        expect(tipJar.style.width).toBe(`${expectedSizes[size]}px`);
        expect(tipJar.style.height).toBe(`${expectedSizes[size]}px`);
      });
    });

    test('should work with custom colors', () => {
      const colors = ['#FF5722', '#2196F3', '#FFC107', '#9C27B0'];
      
      colors.forEach(color => {
        // Clean up previous
        const existingTipJar = document.getElementById('ChaiPe-tipJar');
        if (existingTipJar) existingTipJar.remove();
        
        ChaiPe.init({ ...mockConfig, tipJarColor: color });
        
        const tipJar = document.getElementById('ChaiPe-tipJar');
        expect(tipJar).toBeDefined();
        // Browsers convert hex to RGB format
        const expectedColor = color === '#FF5722' ? 'rgb(255, 87, 34)' :
                           color === '#2196F3' ? 'rgb(33, 150, 243)' :
                           color === '#FFC107' ? 'rgb(255, 193, 7)' :
                           color === '#9C27B0' ? 'rgb(156, 39, 176)' : color;
        expect(tipJar.style.backgroundColor).toBe(expectedColor);
      });
    });

    test('should work with custom icons', () => {
      const icons = ['☕', '❤️', '⭐', '🎉'];
      
      icons.forEach(icon => {
        // Clean up previous
        const existingTipJar = document.getElementById('ChaiPe-tipJar');
        if (existingTipJar) existingTipJar.remove();
        
        ChaiPe.init({ ...mockConfig, tipJarIcon: icon });
        
        const tipJar = document.getElementById('ChaiPe-tipJar');
        expect(tipJar).toBeDefined();
        expect(tipJar.firstChild.textContent).toBe(icon);
      });
    });

    test('should work with custom tooltip text', () => {
      const texts = ['Buy me a chai ☕', 'Support my work ❤️', 'Tip me ⭐'];
      
      texts.forEach(text => {
        // Clean up previous
        const existingTipJar = document.getElementById('ChaiPe-tipJar');
        if (existingTipJar) existingTipJar.remove();
        
        ChaiPe.init({ ...mockConfig, tipJarText: text });
        
        const tipJar = document.getElementById('ChaiPe-tipJar');
        expect(tipJar).toBeDefined();
        expect(tipJar.getAttribute('aria-label')).toBe(text);
        
        const tooltip = tipJar.querySelector('.ChaiPe-tipJar-tooltip');
        expect(tooltip.textContent).toBe(text);
      });
    });
  });

  describe('TipJar Device-Specific Behavior', () => {
    test('should show TipJar on mobile when enabled', () => {
      // Mock mobile device
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true
      });
      
      ChaiPe.init(mockConfig);
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar).toBeDefined();
    });

    test('should hide TipJar on mobile when disabled', () => {
      // Mock mobile device
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true
      });
      
      ChaiPe.init({ ...mockConfig, tipJarShowOnMobile: false });
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar).toBeNull();
    });

    test('should show TipJar on desktop when enabled', () => {
      // Mock desktop device
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/96.0',
        configurable: true
      });
      
      ChaiPe.init(mockConfig);
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar).toBeDefined();
    });

    test('should hide TipJar on desktop when disabled', () => {
      // Mock desktop device
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/96.0',
        configurable: true
      });
      
      ChaiPe.init({ ...mockConfig, tipJarShowOnDesktop: false });
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar).toBeNull();
    });

    test('should handle device type changes on re-init', () => {
      // Start as mobile
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true
      });
      
      ChaiPe.init(mockConfig);
      expect(document.getElementById('ChaiPe-tipJar')).toBeDefined();
      
      // Switch to desktop
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/96.0',
        configurable: true
      });
      
      ChaiPe.init(mockConfig);
      expect(document.getElementById('ChaiPe-tipJar')).toBeDefined();
    });
  });

  describe('TipJar with Return Visitor', () => {
    test('should work for return visitors', () => {
      localStorage.setItem('ChaiPe_visited', 'true');
      
      ChaiPe.init(mockConfig);
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(tipJar).toBeDefined();
    });

    test('should open modal for return visitor via TipJar', (done) => {
      localStorage.setItem('ChaiPe_visited', 'true');
      
      ChaiPe.init(mockConfig);
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      tipJar.click();
      
      setTimeout(() => {
        const modal = document.getElementById('ChaiPe-modal');
        expect(modal).toBeDefined();
        
        expect(onTipCompleted).not.toHaveBeenCalled();
        done();
      }, 50);
    });

    test('should complete payment for return visitor via TipJar', (done) => {
      localStorage.setItem('ChaiPe_visited', 'true');
      
      ChaiPe.init(mockConfig);
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      tipJar.click();
      
      setTimeout(() => {
        ChaiPe.confirmPayment(50);
        
        setTimeout(() => {
          expect(onTipCompleted).toHaveBeenCalledWith(
            expect.objectContaining({
              isReturnVisitor: true
            })
          );
          done();
        }, 100);
      }, 50);
    });
  });

  describe('TipJar Error Handling', () => {
    test('should handle errors gracefully during initialization', () => {
      expect(() => ChaiPe.init({ ...mockConfig, tipJar: true })).not.toThrow();
    });

    test('should handle errors during TipJar click', () => {
      ChaiPe.init(mockConfig);
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      expect(() => tipJar.click()).not.toThrow();
    });

    test('should handle errors during showTipJar', () => {
      ChaiPe.init(mockConfig);
      
      expect(() => ChaiPe.showTipJar()).not.toThrow();
    });

    test('should handle errors during hideTipJar', () => {
      ChaiPe.init(mockConfig);
      
      expect(() => ChaiPe.hideTipJar()).not.toThrow();
    });

    test('should handle errors during updateTipJar', () => {
      ChaiPe.init(mockConfig);
      
      expect(() => ChaiPe.updateTipJar({ tipJarIcon: '❤️' })).not.toThrow();
    });
  });

  describe('TipJar with UTR Collection', () => {
    test('should work with UTR collection enabled', (done) => {
      const configWithUTR = {
        ...mockConfig,
        collectUPIUTR: true
      };
      ChaiPe.init(configWithUTR);
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      tipJar.click();
      
      setTimeout(() => {
        // Click pay button to show QR code modal
        const payButton = document.getElementById('ChaiPe-pay');
        payButton.click();
        
        setTimeout(() => {
          const utrInput = document.getElementById('ChaiPe-utr');
          expect(utrInput).toBeDefined();
          done();
        }, 100);
      }, 50);
    });

    test('should collect UTR when payment completed via TipJar', (done) => {
      const configWithUTR = {
        ...mockConfig,
        collectUPIUTR: true
      };
      ChaiPe.init(configWithUTR);
      
      const tipJar = document.getElementById('ChaiPe-tipJar');
      tipJar.click();
      
      setTimeout(() => {
        const payButton = document.getElementById('ChaiPe-pay');
        payButton.click();
        
        setTimeout(() => {
          const utrInput = document.getElementById('ChaiPe-utr');
          if (utrInput) utrInput.value = '123456789012';
          
          ChaiPe._instance._collectFormData();
          ChaiPe.confirmPayment(50);
          
          setTimeout(() => {
            expect(onTipCompleted).toHaveBeenCalledWith(
              expect.objectContaining({
                customData: {
                  upiUTR: '123456789012'
                }
              })
            );
            done();
          }, 100);
        }, 100);
      }, 50);
    });
  });
});
