/**
 * ChaiPe Contribution Configuration
 * 
 * Standardized configuration for accepting ChaiPe contributions
 * across the documentation website.
 * 
 * UPI ID: srikanthlogic@icici
 * Purpose: Accept contributions to support ChaiPe development
 */

// Standard ChaiPe contribution configuration
const CHAIPE_CONTRIBUTION_CONFIG = {
  // Core payment configuration
  upiId: 'srikanthlogic@icici',
  name: 'ChaiPe',
  note: 'Contributing to ChaiPe itself for its work',
  amounts: [10, 25, 50, 100],
  currency: 'INR',
  theme: 'minimal',
  
  // Behavioral triggers - conservative approach for documentation
  triggers: {
    scrollDepth: 70,      // Show at 70% scroll depth
    timeOnPage: 120,      // Or after 2 minutes
    exitIntent: false
  },
  
  // TipJar configuration for persistent tipping
  tipJar: true,
  tipJarPosition: 'bottom-right',
  tipJarSize: 'medium',
  tipJarColor: '#667eea',
  tipJarIcon: '☕',
  tipJarText: 'Support ChaiPe',
  tipJarAutoShow: true,
  tipJarShowDelay: 30000,  // 30 seconds
  tipJarShowOnMobile: true,
  tipJarShowOnDesktop: true,
  
  // Data collection - minimal, privacy-focused
  collectEmail: false,
  collectName: false,
  collectPhoneNumber: false,
  collectVPA: false,
  collectUPIUTR: false,
  
  // Custom messages for high-conversion UX
  message: 'Found this helpful? Consider supporting ChaiPe development',
  buttonText: 'Support ChaiPe Development',
  
  // Event callbacks for tracking and thank you experience
  onNudgeShown: (data) => {
    console.log('[ChaiPe] Nudge shown:', data);
  },
  
  onNudgeDismissed: (data) => {
    console.log('[ChaiPe] Nudge dismissed:', data);
  },
  
  onTipCompleted: (data) => {
    console.log('[ChaiPe] Tip completed:', data);
    showThankYouModal(data.amount);
  },
  
  onTipJarShown: (data) => {
    console.log('[ChaiPe] TipJar shown:', data);
  },
  
  onTipJarDismissed: (data) => {
    console.log('[ChaiPe] TipJar dismissed:', data);
  },
  
  onTipJarOpened: (data) => {
    console.log('[ChaiPe] TipJar opened:', data);
  }
};

/**
 * Thank You Modal Experience
 * Shows personalized thank you message with impact statement
 */
function showThankYouModal(amount) {
  // Create modal if it doesn't exist
  let modal = document.getElementById('chaipe-thank-you-modal');
  
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'chaipe-thank-you-modal';
    modal.className = 'chaipe-thank-you-modal';
    modal.innerHTML = `
      <div class="chaipe-thank-you-overlay"></div>
      <div class="chaipe-thank-you-content">
        <div class="chaipe-thank-you-close" onclick="closeThankYouModal()">&times;</div>
        <div class="chaipe-thank-you-icon">☕</div>
        <h2>Thank You for Your Support!</h2>
        <p class="chaipe-thank-you-amount">You tipped ₹${amount}</p>
        <p class="chaipe-thank-you-message">Your contribution helps us maintain and improve ChaiPe for thousands of Indian creators.</p>
        <div class="chaipe-thank-you-impact">
          <p><strong>Impact:</strong></p>
          <ul>
            <li>🚀 Helps keep ChaiPe free and open source</li>
            <li>📚 Supports documentation and examples</li>
            <li>🔧 Funds bug fixes and new features</li>
            <li>🌍 Enables development of new themes and integrations</li>
          </ul>
        </div>
        <div class="chaipe-thank-you-actions">
          <p class="chaipe-thank-you-social-proof">Join 500+ developers supporting ChaiPe</p>
          <div class="chaipe-thank-you-buttons">
            <a href="https://github.com/CashlessConsumer/ChaiPe" target="_blank" class="chaipe-thank-you-btn chaipe-thank-you-btn-primary">
              ⭐ Star on GitHub
            </a>
            <a href="https://github.com/CashlessConsumer/ChaiPe/issues" target="_blank" class="chaipe-thank-you-btn chaipe-thank-you-btn-secondary">
              🐛 Report Issues
            </a>
            <button onclick="closeThankYouModal()" class="chaipe-thank-you-btn chaipe-thank-you-btn-secondary">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add styles if not already present
    if (!document.getElementById('chaipe-thank-you-styles')) {
      const styles = document.createElement('style');
      styles.id = 'chaipe-thank-you-styles';
      styles.textContent = `
        .chaipe-thank-you-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: chaipeFadeIn 0.3s ease;
        }
        
        .chaipe-thank-you-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(5px);
        }
        
        .chaipe-thank-you-content {
          background: white;
          border-radius: 16px;
          padding: 40px;
          max-width: 500px;
          width: 90%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          position: relative;
          animation: chaipeSlideUp 0.4s ease;
        }
        
        .chaipe-thank-you-close {
          position: absolute;
          top: 16px;
          right: 16px;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          transition: color 0.2s;
          line-height: 1;
          padding: 4px;
          border-radius: 4px;
        }
        
        .chaipe-thank-you-close:hover {
          color: #333;
          background: #f0f0f0;
        }
        
        .chaipe-thank-you-icon {
          font-size: 48px;
          margin-bottom: 20px;
          text-align: center;
        }
        
        .chaipe-thank-you-content h2 {
          margin: 0 0 20px 0;
          color: #667eea;
          font-size: 24px;
          font-weight: 700;
          text-align: center;
        }
        
        .chaipe-thank-you-amount {
          font-size: 32px;
          font-weight: 700;
          color: #667eea;
          text-align: center;
          margin-bottom: 20px;
        }
        
        .chaipe-thank-you-message {
          font-size: 16px;
          color: #333;
          text-align: center;
          margin-bottom: 30px;
          line-height: 1.6;
        }
        
        .chaipe-thank-you-impact {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 30px;
        }
        
        .chaipe-thank-you-impact p {
          margin: 8px 0;
          color: #555;
          font-size: 14px;
        }
        
        .chaipe-thank-you-impact strong {
          color: #667eea;
        }
        
        .chaipe-thank-you-impact ul {
          margin: 0;
          padding-left: 20px;
          color: #333;
          font-size: 14px;
        }
        
        .chaipe-thank-you-impact li {
          margin-bottom: 8px;
        }
        
        .chaipe-thank-you-social-proof {
          text-align: center;
          font-size: 14px;
          color: #667eea;
          font-weight: 600;
          margin-bottom: 20px;
        }
        
        .chaipe-thank-you-buttons {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .chaipe-thank-you-btn {
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: all 0.2s ease;
        }
        
        .chaipe-thank-you-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        
        .chaipe-thank-you-btn-primary {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
        }
        
        .chaipe-thank-you-btn-secondary {
          background: #f0f0f0;
          color: #333;
          border: 1px solid #ddd;
        }
        
        @keyframes chaipeFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes chaipeSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 600px) {
          .chaipe-thank-you-content {
            width: 95%;
            padding: 30px;
          }
        }
      `;
      document.head.appendChild(styles);
    }
    
    // Show modal with animation
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);
  }
}

/**
 * Close thank you modal
 */
function closeThankYouModal() {
  const modal = document.getElementById('chaipe-thank-you-modal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.remove();
    }, 300);
  }
}

/**
 * Initialize ChaiPe with contribution configuration
 * Call this function on each page to set up ChaiPe for contributions
 */
function initChaiPeContribution() {
  try {
    ChaiPe.init(CHAIPE_CONTRIBUTION_CONFIG);
    console.log('[ChaiPe] Initialized with contribution configuration');
    console.log('[ChaiPe] UPI ID:', CHAIPE_CONTRIBUTION_CONFIG.upiId);
    console.log('[ChaiPe] Note:', CHAIPE_CONTRIBUTION_CONFIG.note);
  } catch (error) {
    console.error('[ChaiPe] Failed to initialize:', error);
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CHAIPE_CONTRIBUTION_CONFIG,
    showThankYouModal,
    closeThankYouModal,
    initChaiPeContribution
  };
}
