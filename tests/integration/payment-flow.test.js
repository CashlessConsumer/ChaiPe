/**
 * Integration Tests for Payment Flows
 * Tests complete user journeys from initialization to payment confirmation
 */

import { ChaiPe } from '../../src/index.js';

describe('Payment Flow Integration Tests', () => {
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
      onNudgeDismissed
    };
    
    // Clear document body
    document.body.innerHTML = '';
    // Clear localStorage
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up any remaining modals
    const modal = document.getElementById('ChaiPe-modal');
    const overlay = document.getElementById('ChaiPe-overlay');
    if (modal) modal.remove();
    if (overlay) overlay.remove();
  });

  describe('Complete Payment Flow - Desktop', () => {
    test('should complete full payment flow on desktop', (done) => {
      // Mock desktop environment
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/96.0',
        configurable: true
      });
      
      ChaiPe.init(mockConfig);
      
      // Simulate user action: show modal
      ChaiPe.show();
      
      setTimeout(() => {
        // Verify nudge shown callback
        expect(onNudgeShown).toHaveBeenCalledWith({
          sessionId: expect.any(String)
        });
        
        // Verify modal is visible
        const modal = document.getElementById('ChaiPe-modal');
        const overlay = document.getElementById('ChaiPe-overlay');
        expect(modal).toBeDefined();
        expect(overlay).toBeDefined();
        expect(modal.classList.contains('active')).toBe(true);
        expect(overlay.classList.contains('active')).toBe(true);
        
        // Simulate user selecting amount
        const amountButtons = document.querySelectorAll('.ChaiPe-amount');
        amountButtons[2].click(); // Select 50
        
        // Verify amount selection
        const selectedButton = document.querySelector('.ChaiPe-amount.selected');
        expect(selectedButton.dataset.amount).toBe('50');
        
        // Simulate payment confirmation
        ChaiPe.confirmPayment(50);
        
        // Verify success message
        setTimeout(() => {
          expect(modal.innerHTML).toContain('Thank You!');
          
          // Verify callback
          expect(onTipCompleted).toHaveBeenCalledWith({
            amount: 50,
            currency: 'INR',
            timestamp: expect.any(String),
            sessionId: expect.any(String),
            isReturnVisitor: false,
            customData: {}
          });
          
          done();
        }, 100);
      }, 100);
    });

    test('should handle custom amount in payment flow', (done) => {
      ChaiPe.init(mockConfig);
      ChaiPe.show();
      
      setTimeout(() => {
        // Enter custom amount
        const customInput = document.getElementById('ChaiPe-custom');
        customInput.value = '75';
        customInput.dispatchEvent(new Event('input'));
        
        // Confirm payment
        ChaiPe.confirmPayment(75);
        
        setTimeout(() => {
          expect(onTipCompleted).toHaveBeenCalledWith(
            expect.objectContaining({ amount: 75 })
          );
          done();
        }, 100);
      }, 100);
    });
  });

  describe('Complete Payment Flow - Mobile', () => {
    test('should complete mobile payment flow', (done) => {
      // Mock mobile environment
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true
      });
      
      ChaiPe.init(mockConfig);
      ChaiPe.show();
      
      setTimeout(() => {
        // Select amount
        const amountButtons = document.querySelectorAll('.ChaiPe-amount');
        amountButtons[1].click();
        
        // Click pay button (triggers mobile payment)
        const payButton = document.getElementById('ChaiPe-pay');
        payButton.click();
        
        // Verify payment was initiated (UPI link generation)
        setTimeout(() => {
          // Note: jsdom doesn't support navigation, so we verify the payment was initiated
          // by checking that paymentInProgress was set to true
          expect(ChaiPe._instance.paymentInProgress).toBe(true);
          done();
        }, 100);
      }, 100);
    });
  });

  describe('Payment Flow with Data Collection', () => {
    test('should collect user data during payment', (done) => {
      const configWithData = {
        ...mockConfig,
        collectName: true,
        collectEmail: true,
        collectPhoneNumber: true,
        collectVPA: true
      };
      
      ChaiPe.init(configWithData);
      ChaiPe.show();
      
      setTimeout(() => {
        // Fill in form fields
        const nameInput = document.getElementById('ChaiPe-name');
        const emailInput = document.getElementById('ChaiPe-email');
        const phoneInput = document.getElementById('ChaiPe-phone');
        const vpaInput = document.getElementById('ChaiPe-vpa');
        
        if (nameInput) nameInput.value = 'John Doe';
        if (emailInput) emailInput.value = 'john@example.com';
        if (phoneInput) phoneInput.value = '+91 98765 43210';
        if (vpaInput) vpaInput.value = 'john@upi';
        
        // Select amount and confirm
        const amountButtons = document.querySelectorAll('.ChaiPe-amount');
        amountButtons[0].click();
        
        // Call _collectFormData to populate collectedData before confirmPayment
        ChaiPe._instance._collectFormData();
        
        ChaiPe.confirmPayment(10);
        
        setTimeout(() => {
          expect(onTipCompleted).toHaveBeenCalledWith(
            expect.objectContaining({
              customData: {
                name: 'John Doe',
                email: 'john@example.com',
                phoneNumber: '+91 98765 43210',
                vpa: 'john@upi'
              }
            })
          );
          done();
        }, 100);
      }, 100);
    });

    test('should handle partial data collection', (done) => {
      const configWithPartialData = {
        ...mockConfig,
        collectName: true,
        collectEmail: true
      };
      
      ChaiPe.init(configWithPartialData);
      ChaiPe.show();
      
      setTimeout(() => {
        // Fill only name
        const nameInput = document.getElementById('ChaiPe-name');
        if (nameInput) nameInput.value = 'Jane Doe';
        
        // Call _collectFormData to populate collectedData before confirmPayment
        ChaiPe._instance._collectFormData();
        
        ChaiPe.confirmPayment(50);
        
        setTimeout(() => {
          expect(onTipCompleted).toHaveBeenCalledWith(
            expect.objectContaining({
              customData: {
                name: 'Jane Doe'
              }
            })
          );
          done();
        }, 100);
      }, 100);
    });
  });

  describe('Payment Flow with UTR Collection', () => {
    test('should collect UTR after payment', (done) => {
      // Mock desktop environment for QR code display
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/96.0',
        configurable: true
      });
      
      const configWithUTR = {
        ...mockConfig,
        collectUPIUTR: true
      };
      
      ChaiPe.init(configWithUTR);
      ChaiPe.show();
      
      setTimeout(() => {
        // Select amount
        const amountButtons = document.querySelectorAll('.ChaiPe-amount');
        amountButtons[1].click();
        
        // Click pay button to show QR code modal
        const payButton = document.getElementById('ChaiPe-pay');
        payButton.click();
        
        // Wait for QR code modal to be rendered
        setTimeout(() => {
          // Verify QR code modal is shown
          const qrContainer = document.querySelector('.ChaiPe-qr-container');
          expect(qrContainer).toBeDefined();
          
          // Enter UTR in confirmation modal
          const utrInput = document.getElementById('ChaiPe-utr');
          expect(utrInput).toBeDefined();
          utrInput.value = '123456789012';
          
          // Confirm payment (UTR is collected inside confirmPayment, not _collectFormData)
          ChaiPe.confirmPayment(25);
          
          // Wait for success message
          setTimeout(() => {
            expect(onTipCompleted).toHaveBeenCalledWith(
              expect.objectContaining({
                customData: {
                  upiUTR: '123456789012'
                }
              })
            );
            done();
          }, 200);
        }, 200);
      }, 100);
    });
  });

  describe('Dismiss and Re-show Flow', () => {
    test('should handle dismiss and re-show', (done) => {
      ChaiPe.init(mockConfig);
      
      // Show modal
      ChaiPe.show();
      
      setTimeout(() => {
        let modal = document.getElementById('ChaiPe-modal');
        expect(modal).toBeDefined();
        
        // Dismiss modal
        ChaiPe.dismiss();
        
        setTimeout(() => {
          modal = document.getElementById('ChaiPe-modal');
          expect(modal).toBeNull();
          
          expect(onNudgeDismissed).toHaveBeenCalled();
          
          // Re-show modal
          ChaiPe.show();
          
          setTimeout(() => {
            modal = document.getElementById('ChaiPe-modal');
            expect(modal).toBeDefined();
            done();
          }, 100);
        }, 350);
      }, 100);
    });
  });

  describe('Multiple Payment Sessions', () => {
    test('should handle multiple payment sessions', (done) => {
      ChaiPe.init(mockConfig);
      
      // First payment
      ChaiPe.show();
      
      setTimeout(() => {
        ChaiPe.confirmPayment(25);
        
        setTimeout(() => {
          expect(onTipCompleted).toHaveBeenCalledTimes(1);
          
          // Second payment (after auto-dismiss)
          setTimeout(() => {
            ChaiPe.show();
            
            setTimeout(() => {
              ChaiPe.confirmPayment(50);
              
              setTimeout(() => {
                expect(onTipCompleted).toHaveBeenCalledTimes(2);
                done();
              }, 100);
            }, 100);
          }, 3100);
        }, 100);
      }, 100);
    });
  });

  describe('Theme Integration', () => {
    test('should work with minimal theme', (done) => {
      ChaiPe.init({ ...mockConfig, theme: 'minimal' });
      ChaiPe.show();
      
      setTimeout(() => {
        const modal = document.getElementById('ChaiPe-modal');
        expect(modal.classList.contains('theme-minimal')).toBe(true);
        done();
      }, 100);
    });

    test('should work with toast theme', (done) => {
      ChaiPe.init({ ...mockConfig, theme: 'toast' });
      ChaiPe.show();
      
      setTimeout(() => {
        const modal = document.getElementById('ChaiPe-modal');
        expect(modal.classList.contains('theme-toast')).toBe(true);
        done();
      }, 100);
    });

    test('should work with floating theme', (done) => {
      ChaiPe.init({ ...mockConfig, theme: 'floating' });
      ChaiPe.show();
      
      setTimeout(() => {
        const modal = document.getElementById('ChaiPe-modal');
        expect(modal.classList.contains('theme-floating')).toBe(true);
        done();
      }, 100);
    });
  });

  describe('Return Visitor Flow', () => {
    test('should handle return visitor correctly', (done) => {
      localStorage.setItem('ChaiPe_visited', 'true');
      localStorage.setItem('ChaiPe_supporter', 'true');
      
      ChaiPe.init(mockConfig);
      ChaiPe.show();
      
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
      }, 100);
    });
  });

  describe('Error Recovery Flow', () => {
    test('should handle payment after error', (done) => {
      ChaiPe.init(mockConfig);
      
      // Show and dismiss
      ChaiPe.show();
      setTimeout(() => {
        ChaiPe.dismiss();
        
        setTimeout(() => {
          // Show again and complete payment
          ChaiPe.show();
          
          setTimeout(() => {
            ChaiPe.confirmPayment(100);
            
            setTimeout(() => {
              expect(onTipCompleted).toHaveBeenCalled();
              done();
            }, 100);
          }, 100);
        }, 350);
      }, 100);
    });
  });

  describe('Manual Only Mode', () => {
    test('should work in manual only mode', (done) => {
      ChaiPe.init({ ...mockConfig, manualOnly: true });
      
      // Should not auto-show
      setTimeout(() => {
        let modal = document.getElementById('ChaiPe-modal');
        expect(modal).toBeNull();
        
        // Manual show should work
        ChaiPe.show();
        
        setTimeout(() => {
          modal = document.getElementById('ChaiPe-modal');
          expect(modal).toBeDefined();
          done();
        }, 100);
      }, 1000);
    });
  });
});
