/**
 * ChaiPe.js - Embedded CSS Styles
 * All styles for the payment modal, themes, and animations
 * @module lib/styles
 */

export const STYLES = `
.ChaiPe-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 999998;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.ChaiPe-overlay.active {
  opacity: 1;
}

.ChaiPe-modal {
  position: fixed;
  z-index: 999999;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  transform: translateY(20px);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.ChaiPe-modal.active {
  transform: translateY(0);
  opacity: 1;
}

/* Minimal Theme */
.ChaiPe-modal.theme-minimal {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.9);
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 380px;
  width: 90%;
}
.ChaiPe-modal.theme-minimal.active {
  transform: translate(-50%, -50%) scale(1);
}

/* Toast Theme */
.ChaiPe-modal.theme-toast {
  bottom: 24px;
  right: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.4);
  max-width: 340px;
}
.ChaiPe-modal.theme-toast .ChaiPe-title,
.ChaiPe-modal.theme-toast .ChaiPe-subtitle {
  color: #fff;
}

/* Floating Theme */
.ChaiPe-modal.theme-floating {
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  background: #1a1a2e;
  border-radius: 50px;
  padding: 16px 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 16px;
}
.ChaiPe-modal.theme-floating.active {
  transform: translateX(-50%) translateY(0);
}
.ChaiPe-modal.theme-floating .ChaiPe-title {
  color: #fff;
  margin: 0;
  font-size: 14px;
}

.ChaiPe-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.ChaiPe-close:hover {
  background: rgba(0, 0, 0, 0.1);
}
.ChaiPe-close svg {
  width: 16px;
  height: 16px;
  stroke: #666;
}
.theme-toast .ChaiPe-close,
.theme-floating .ChaiPe-close {
  background: rgba(255, 255, 255, 0.2);
}
.theme-toast .ChaiPe-close:hover,
.theme-floating .ChaiPe-close:hover {
  background: rgba(255, 255, 255, 0.3);
}
.theme-toast .ChaiPe-close svg,
.theme-floating .ChaiPe-close svg {
  stroke: #fff;
}

.ChaiPe-header {
  text-align: center;
  margin-bottom: 24px;
}

.ChaiPe-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-size: 28px;
}

.ChaiPe-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0 0 8px;
}

.ChaiPe-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.ChaiPe-amounts {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.ChaiPe-amount {
  flex: 1;
  min-width: 60px;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  background: #fff;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
}
.ChaiPe-amount:hover {
  border-color: #667eea;
  background: #f8f9ff;
}
.ChaiPe-amount.selected {
  border-color: #667eea;
  background: #667eea;
  color: #fff;
}

.ChaiPe-custom-input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 16px;
  margin-bottom: 16px;
  box-sizing: border-box;
  transition: border-color 0.2s;
}
.ChaiPe-custom-input:focus {
  outline: none;
  border-color: #667eea;
}

.ChaiPe-qr-container {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  margin-bottom: 16px;
}

.ChaiPe-qr-container img {
  width: 180px;
  height: 180px;
  border-radius: 8px;
  image-rendering: pixelated;
}

.ChaiPe-qr-hint {
  font-size: 13px;
  color: #888;
  margin-top: 12px;
}

.ChaiPe-btn {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.ChaiPe-btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}
.ChaiPe-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.ChaiPe-btn-confirm {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: #fff;
  margin-top: 12px;
}
.ChaiPe-btn-confirm:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(56, 239, 125, 0.4);
}

.ChaiPe-form-group {
  margin-bottom: 12px;
}

.ChaiPe-form-group label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #555;
  margin-bottom: 6px;
}

.ChaiPe-form-group input {
  width: 100%;
  padding: 12px 14px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
  transition: border-color 0.2s;
}
.ChaiPe-form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.ChaiPe-divider {
  display: flex;
  align-items: center;
  margin: 16px 0;
  color: #999;
  font-size: 12px;
}
.ChaiPe-divider::before,
.ChaiPe-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e0e0e0;
}
.ChaiPe-divider span {
  padding: 0 12px;
}

.ChaiPe-success {
  text-align: center;
  padding: 20px;
}

.ChaiPe-success-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.ChaiPe-success-icon svg {
  width: 32px;
  height: 32px;
  stroke: #fff;
}

@media (max-width: 480px) {
  .ChaiPe-modal.theme-minimal {
    width: 95%;
    padding: 24px;
  }
  .ChaiPe-modal.theme-toast {
    left: 12px;
    right: 12px;
    bottom: 12px;
    max-width: none;
  }
  .ChaiPe-modal.theme-floating {
    left: 12px;
    right: 12px;
    transform: translateY(20px);
    max-width: none;
    border-radius: 24px;
    justify-content: center;
  }
  .ChaiPe-modal.theme-floating.active {
    transform: translateY(0);
  }
}

@media (prefers-color-scheme: dark) {
  .ChaiPe-modal.theme-minimal {
    background: #1a1a2e;
  }
  .ChaiPe-modal.theme-minimal .ChaiPe-title {
    color: #fff;
  }
  .ChaiPe-modal.theme-minimal .ChaiPe-subtitle {
    color: #aaa;
  }
  .ChaiPe-modal.theme-minimal .ChaiPe-amount {
    background: #2a2a4e;
    border-color: #3a3a5e;
    color: #fff;
  }
  .ChaiPe-modal.theme-minimal .ChaiPe-amount:hover {
    border-color: #667eea;
    background: #3a3a6e;
  }
  .ChaiPe-modal.theme-minimal .ChaiPe-amount.selected {
    background: #667eea;
  }
  .ChaiPe-modal.theme-minimal .ChaiPe-custom-input,
  .ChaiPe-modal.theme-minimal .ChaiPe-form-group input {
    background: #2a2a4e;
    border-color: #3a3a5e;
    color: #fff;
  }
  .ChaiPe-modal.theme-minimal .ChaiPe-qr-container {
    background: #2a2a4e;
  }
  .ChaiPe-modal.theme-minimal .ChaiPe-close {
    background: rgba(255, 255, 255, 0.1);
  }
  .ChaiPe-modal.theme-minimal .ChaiPe-close svg {
    stroke: #fff;
  }
}

/* TipJar Styles */
.ChaiPe-tipJar {
  position: fixed;
  z-index: 999997;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  --ChaiPe-tipJar-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --ChaiPe-tipJar-color: #fff;
  --ChaiPe-tipJar-size: 56px;
  --ChaiPe-tipJar-icon-size: 24px;
}

/* Size Variants */
.ChaiPe-tipJar.size-small {
  --ChaiPe-tipJar-size: 44px;
  --ChaiPe-tipJar-icon-size: 20px;
}

.ChaiPe-tipJar.size-medium {
  --ChaiPe-tipJar-size: 56px;
  --ChaiPe-tipJar-icon-size: 24px;
}

.ChaiPe-tipJar.size-large {
  --ChaiPe-tipJar-size: 68px;
  --ChaiPe-tipJar-icon-size: 28px;
}

/* Apply size variables */
.ChaiPe-tipJar {
  width: var(--ChaiPe-tipJar-size);
  height: var(--ChaiPe-tipJar-size);
  background: var(--ChaiPe-tipJar-bg);
  color: var(--ChaiPe-tipJar-color);
}

/* Position Variants */
.ChaiPe-tipJar.position-bottom-right {
  bottom: 24px;
  right: 24px;
}

.ChaiPe-tipJar.position-bottom-left {
  bottom: 24px;
  left: 24px;
}

.ChaiPe-tipJar.position-top-right {
  top: 24px;
  right: 24px;
}

.ChaiPe-tipJar.position-top-left {
  top: 24px;
  left: 24px;
}

/* Icon styling */
.ChaiPe-tipJar svg {
  width: var(--ChaiPe-tipJar-icon-size);
  height: var(--ChaiPe-tipJar-icon-size);
  fill: currentColor;
  pointer-events: none;
}

/* Tooltip */
.ChaiPe-tipJar-tooltip {
  position: absolute;
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.3s ease, transform 0.3s ease;
  z-index: 999998;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Tooltip positioning based on button position */
.ChaiPe-tipJar.position-bottom-right .ChaiPe-tipJar-tooltip {
  right: calc(var(--ChaiPe-tipJar-size) + 12px);
  bottom: 50%;
  transform: translateY(50%) translateX(10px);
}

.ChaiPe-tipJar.position-bottom-left .ChaiPe-tipJar-tooltip {
  left: calc(var(--ChaiPe-tipJar-size) + 12px);
  bottom: 50%;
  transform: translateY(50%) translateX(-10px);
}

.ChaiPe-tipJar.position-top-right .ChaiPe-tipJar-tooltip {
  right: calc(var(--ChaiPe-tipJar-size) + 12px);
  top: 50%;
  transform: translateY(-50%) translateX(10px);
}

.ChaiPe-tipJar.position-top-left .ChaiPe-tipJar-tooltip {
  left: calc(var(--ChaiPe-tipJar-size) + 12px);
  top: 50%;
  transform: translateY(-50%) translateX(-10px);
}

/* Tooltip visible state */
.ChaiPe-tipJar:hover .ChaiPe-tipJar-tooltip,
.ChaiPe-tipJar:focus-within .ChaiPe-tipJar-tooltip {
  opacity: 1;
}

.ChaiPe-tipJar.position-bottom-right:hover .ChaiPe-tipJar-tooltip,
.ChaiPe-tipJar.position-bottom-right:focus-within .ChaiPe-tipJar-tooltip {
  transform: translateY(50%) translateX(0);
}

.ChaiPe-tipJar.position-bottom-left:hover .ChaiPe-tipJar-tooltip,
.ChaiPe-tipJar.position-bottom-left:focus-within .ChaiPe-tipJar-tooltip {
  transform: translateY(50%) translateX(0);
}

.ChaiPe-tipJar.position-top-right:hover .ChaiPe-tipJar-tooltip,
.ChaiPe-tipJar.position-top-right:focus-within .ChaiPe-tipJar-tooltip {
  transform: translateY(-50%) translateX(0);
}

.ChaiPe-tipJar.position-top-left:hover .ChaiPe-tipJar-tooltip,
.ChaiPe-tipJar.position-top-left:focus-within .ChaiPe-tipJar-tooltip {
  transform: translateY(-50%) translateX(0);
}

/* Tooltip arrow */
.ChaiPe-tipJar-tooltip::before {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.85) transparent transparent transparent;
  border-width: 6px 6px 0 6px;
}

.ChaiPe-tipJar.position-bottom-right .ChaiPe-tipJar-tooltip::before,
.ChaiPe-tipJar.position-bottom-left .ChaiPe-tipJar-tooltip::before {
  top: 50%;
  transform: translateY(-50%);
  left: -6px;
  border-color: transparent rgba(0, 0, 0, 0.85) transparent transparent;
  border-width: 6px 6px 6px 0;
}

.ChaiPe-tipJar.position-top-right .ChaiPe-tipJar-tooltip::before,
.ChaiPe-tipJar.position-top-left .ChaiPe-tipJar-tooltip::before {
  top: 50%;
  transform: translateY(-50%);
  left: -6px;
  border-color: transparent rgba(0, 0, 0, 0.85) transparent transparent;
  border-width: 6px 6px 6px 0;
}

/* Animation Classes */
.ChaiPe-tipJar.ChaiPe-tipJar-showing {
  animation: tipJarShow 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.ChaiPe-tipJar.ChaiPe-tipJar-hiding {
  animation: tipJarHide 0.3s ease forwards;
}

.ChaiPe-tipJar.ChaiPe-tipJar-visible {
  opacity: 1;
  transform: scale(1);
}

.ChaiPe-tipJar.ChaiPe-tipJar-hidden {
  opacity: 0;
  transform: scale(0.8);
  pointer-events: none;
}

/* Keyframe animations */
@keyframes tipJarShow {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes tipJarHide {
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
  }
}

/* Hover Effects */
.ChaiPe-tipJar:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

.ChaiPe-tipJar:active {
  transform: scale(0.95);
}

/* Focus States */
.ChaiPe-tipJar:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.4), 0 4px 12px rgba(0, 0, 0, 0.15);
}

.ChaiPe-tipJar:focus-visible {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}

/* Pulse animation for attention */
.ChaiPe-tipJar.pulse {
  animation: tipJarPulse 2s ease-in-out infinite;
}

@keyframes tipJarPulse {
  0%, 100% {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  50% {
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  }
}

/* Responsive Behavior */
@media (max-width: 768px) {
  .ChaiPe-tipJar {
    --ChaiPe-tipJar-size: 48px;
    --ChaiPe-tipJar-icon-size: 22px;
  }

  .ChaiPe-tipJar.position-bottom-right {
    bottom: 16px;
    right: 16px;
  }

  .ChaiPe-tipJar.position-bottom-left {
    bottom: 16px;
    left: 16px;
  }

  .ChaiPe-tipJar.position-top-right {
    top: 16px;
    right: 16px;
  }

  .ChaiPe-tipJar.position-top-left {
    top: 16px;
    left: 16px;
  }

  .ChaiPe-tipJar-tooltip {
    font-size: 12px;
    padding: 6px 10px;
  }
}

@media (max-width: 480px) {
  .ChaiPe-tipJar {
    --ChaiPe-tipJar-size: 44px;
    --ChaiPe-tipJar-icon-size: 20px;
  }

  .ChaiPe-tipJar.position-bottom-right {
    bottom: 12px;
    right: 12px;
  }

  .ChaiPe-tipJar.position-bottom-left {
    bottom: 12px;
    left: 12px;
  }

  .ChaiPe-tipJar.position-top-right {
    top: 12px;
    right: 12px;
  }

  .ChaiPe-tipJar.position-top-left {
    top: 12px;
    left: 12px;
  }

  /* Hide tooltip on very small screens to prevent overlap */
  .ChaiPe-tipJar-tooltip {
    display: none;
  }

  .ChaiPe-tipJar:hover {
    transform: scale(1.05);
  }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  .ChaiPe-tipJar {
    --ChaiPe-tipJar-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --ChaiPe-tipJar-color: #fff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  }

  .ChaiPe-tipJar:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
  }

  .ChaiPe-tipJar:focus {
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.5), 0 4px 12px rgba(0, 0, 0, 0.4);
  }

  .ChaiPe-tipJar-tooltip {
    background: rgba(255, 255, 255, 0.95);
    color: #1a1a2e;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  }

  .ChaiPe-tipJar.position-bottom-right .ChaiPe-tipJar-tooltip::before,
  .ChaiPe-tipJar.position-bottom-left .ChaiPe-tipJar-tooltip::before,
  .ChaiPe-tipJar.position-top-right .ChaiPe-tipJar-tooltip::before,
  .ChaiPe-tipJar.position-top-left .ChaiPe-tipJar-tooltip::before {
    border-color: transparent rgba(255, 255, 255, 0.95) transparent transparent;
  }
}

/* Accessibility: Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .ChaiPe-tipJar,
  .ChaiPe-tipJar-tooltip,
  .ChaiPe-tipJar:hover,
  .ChaiPe-tipJar:active,
  .ChaiPe-tipJar:focus {
    transition: none;
    animation: none;
  }

  .ChaiPe-tipJar:hover {
    transform: none;
  }

  .ChaiPe-tipJar.ChaiPe-tipJar-showing,
  .ChaiPe-tipJar.ChaiPe-tipJar-hiding {
    animation: none;
  }

  .ChaiPe-tipJar.pulse {
    animation: none;
  }
}
`;

export default STYLES;
