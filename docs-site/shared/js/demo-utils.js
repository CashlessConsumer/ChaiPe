/**
 * ChaiPe Demo - Common Utilities
 * Shared JavaScript functionality across all demo pages
 */

// ============================================
// CONSOLE LOGGING
// ============================================
class DemoConsole {
  constructor(options = {}) {
    this.maxLogs = options.maxLogs || 50;
    this.container = options.container || this.createDefaultContainer();
    this.logs = [];
  }

  createDefaultContainer() {
    const container = document.createElement('div');
    container.className = 'demo-console';
    container.innerHTML = `
      <div class="demo-console-header">
        <span class="demo-console-title">🔍 ChaiPe Console</span>
        <button class="demo-console-clear" aria-label="Clear logs">✕</button>
      </div>
      <div class="demo-console-logs"></div>
    `;
    document.body.appendChild(container);
    return container.querySelector('.demo-console-logs');
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = { message, type, timestamp };
    this.logs.push(logEntry);

    // Create log element
    const logEl = document.createElement('div');
    logEl.className = `demo-console-log demo-console-log--${type}`;
    logEl.innerHTML = `<span class="demo-console-time">${timestamp}</span> ${this.formatMessage(message)}`;
    this.container.appendChild(logEl);

    // Auto-scroll to bottom
    this.container.scrollTop = this.container.scrollHeight;

    // Trim old logs
    while (this.container.children.length > this.maxLogs) {
      this.container.removeChild(this.container.firstChild);
    }
  }

  formatMessage(message) {
    if (typeof message === 'object') {
      return `<pre class="demo-console-json">${JSON.stringify(message, null, 2)}</pre>`;
    }
    return String(message);
  }

  clear() {
    this.logs = [];
    this.container.innerHTML = '';
  }

  info(message) { this.log(message, 'info'); }
  success(message) { this.log(message, 'success'); }
  warning(message) { this.log(message, 'warning'); }
  error(message) { this.log(message, 'error'); }
  event(message) { this.log(message, 'event'); }
}

// ============================================
// THEME MANAGER
// ============================================
class ThemeManager {
  constructor(options = {}) {
    this.storageKey = options.storageKey || 'chaipe-demo-theme';
    this.defaultTheme = options.defaultTheme || 'dark';
    this.currentTheme = this.loadTheme();
    this.callbacks = [];
  }

  loadTheme() {
    try {
      return localStorage.getItem(this.storageKey) || this.defaultTheme;
    } catch {
      return this.defaultTheme;
    }
  }

  saveTheme(theme) {
    try {
      localStorage.setItem(this.storageKey, theme);
    } catch (e) {
      console.warn('Failed to save theme preference:', e);
    }
  }

  setTheme(theme) {
    if (theme !== 'dark' && theme !== 'light') {
      throw new Error('Theme must be "dark" or "light"');
    }

    this.currentTheme = theme;
    this.saveTheme(theme);

    // Update DOM
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }

    // Update ChaiPe if available
    if (window.ChaiPe && typeof ChaiPe.setDarkMode === 'function') {
      ChaiPe.setDarkMode(theme === 'dark');
    }

    // Notify callbacks
    this.callbacks.forEach(cb => cb(theme));
  }

  toggle() {
    this.setTheme(this.currentTheme === 'dark' ? 'light' : 'dark');
  }

  onChange(callback) {
    this.callbacks.push(callback);
  }

  init() {
    this.setTheme(this.currentTheme);
  }
}

// ============================================
// SCROLL TRACKER
// ============================================
class ScrollTracker {
  constructor(options = {}) {
    this.onScroll = options.onScroll || (() => {});
    this.onThreshold = options.onThreshold || (() => {});
    this.thresholds = options.thresholds || [25, 50, 75, 100];
    this.triggeredThresholds = new Set();
    this.maxScroll = 0;
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
  }

  handleScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;

    // Track max scroll
    if (scrollPercent > this.maxScroll) {
      this.maxScroll = scrollPercent;
    }

    // Check thresholds
    this.thresholds.forEach(threshold => {
      if (scrollPercent >= threshold && !this.triggeredThresholds.has(threshold)) {
        this.triggeredThresholds.add(threshold);
        this.onThreshold(threshold, scrollPercent);
      }
    });

    this.onScroll(scrollPercent, this.maxScroll);
  }

  getMaxScroll() {
    return this.maxScroll;
  }

  reset() {
    this.maxScroll = 0;
    this.triggeredThresholds.clear();
  }
}

// ============================================
// TIME TRACKER
// ============================================
class TimeTracker {
  constructor(options = {}) {
    this.onUpdate = options.onUpdate || (() => {});
    this.onThreshold = options.onThreshold || (() => {});
    this.thresholds = options.thresholds || [30, 60, 120, 300];
    this.triggeredThresholds = new Set();
    this.startTime = Date.now();
    this.elapsed = 0;
    this.init();
  }

  init() {
    this.timer = setInterval(() => this.tick(), 1000);
  }

  tick() {
    this.elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    this.onUpdate(this.elapsed);

    // Check thresholds
    this.thresholds.forEach(threshold => {
      if (this.elapsed >= threshold && !this.triggeredThresholds.has(threshold)) {
        this.triggeredThresholds.add(threshold);
        this.onThreshold(threshold, this.elapsed);
      }
    });
  }

  getElapsed() {
    return this.elapsed;
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  reset() {
    this.startTime = Date.now();
    this.elapsed = 0;
    this.triggeredThresholds.clear();
  }
}

// ============================================
// CONFIG PREVIEW
// ============================================
class ConfigPreview {
  constructor(options = {}) {
    this.container = options.container || this.createDefaultContainer();
    this.config = {};
  }

  createDefaultContainer() {
    const container = document.createElement('div');
    container.className = 'config-preview';
    container.innerHTML = `
      <div class="config-preview-header">
        <span class="config-preview-title">⚙️ Current Configuration</span>
        <button class="config-preview-copy" aria-label="Copy configuration">📋</button>
      </div>
      <pre class="config-preview-content"></pre>
    `;
    document.body.appendChild(container);

    // Add copy functionality
    container.querySelector('.config-preview-copy').addEventListener('click', () => {
      this.copyToClipboard();
    });

    return container.querySelector('.config-preview-content');
  }

  update(config) {
    this.config = config;
    this.container.textContent = JSON.stringify(config, null, 2);
  }

  copyToClipboard() {
    const text = JSON.stringify(this.config, null, 2);
    navigator.clipboard.writeText(text).then(() => {
      this.showCopySuccess();
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  }

  showCopySuccess() {
    const btn = this.container.parentElement.querySelector('.config-preview-copy');
    const originalText = btn.textContent;
    btn.textContent = '✓';
    setTimeout(() => {
      btn.textContent = originalText;
    }, 1500);
  }
}

// ============================================
// DEVICE DETECTION
// ============================================
class DeviceDetector {
  static isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  static isTablet() {
    const userAgent = navigator.userAgent;
    return /iPad|Android(?!.*Mobile)/i.test(userAgent) ||
           (window.innerWidth >= 768 && window.innerWidth <= 1024);
  }

  static isDesktop() {
    return !this.isMobile() && !this.isTablet();
  }

  static getDeviceType() {
    if (this.isMobile()) return 'mobile';
    if (this.isTablet()) return 'tablet';
    return 'desktop';
  }

  static isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }
}

// ============================================
// EVENT TRACKER
// ============================================
class EventTracker {
  constructor(console) {
    this.console = console;
    this.events = [];
  }

  track(eventName, data = {}) {
    const event = {
      name: eventName,
      timestamp: new Date().toISOString(),
      data
    };
    this.events.push(event);
    this.console.event(`📡 ${eventName}`, data);
  }

  getEvents() {
    return this.events;
  }

  getEventsByName(name) {
    return this.events.filter(e => e.name === name);
  }

  clear() {
    this.events = [];
  }
}

// ============================================
// BEHAVIORAL TRACKER
// ============================================
class BehavioralTracker {
  constructor(options = {}) {
    this.console = options.console;
    this.scrollTracker = new ScrollTracker({
      onScroll: (current, max) => this.onScroll(current, max),
      onThreshold: (threshold) => this.onScrollThreshold(threshold)
    });
    this.timeTracker = new TimeTracker({
      onUpdate: (elapsed) => this.onTimeUpdate(elapsed),
      onThreshold: (threshold) => this.onTimeThreshold(threshold)
    });
    this.interactionCount = 0;
    this.init();
  }

  init() {
    // Track user interactions
    document.addEventListener('click', () => {
      this.interactionCount++;
    }, { passive: true });
  }

  onScroll(current, max) {
    if (this.console && current % 10 === 0) {
      this.console.info(`📜 Scroll: ${current}% (max: ${max}%)`);
    }
  }

  onScrollThreshold(threshold) {
    if (this.console) {
      this.console.warning(`📜 Scroll threshold: ${threshold}%`);
    }
  }

  onTimeUpdate(elapsed) {
    if (this.console && elapsed % 30 === 0) {
      this.console.info(`⏱️ Time: ${this.timeTracker.formatTime(elapsed)}`);
    }
  }

  onTimeThreshold(threshold) {
    if (this.console) {
      this.console.warning(`⏱️ Time threshold: ${threshold}s`);
    }
  }

  getStats() {
    return {
      maxScroll: this.scrollTracker.getMaxScroll(),
      elapsedTime: this.timeTracker.getElapsed(),
      interactions: this.interactionCount
    };
  }
}

// ============================================
// EXPORTS
// ============================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    DemoConsole,
    ThemeManager,
    ScrollTracker,
    TimeTracker,
    ConfigPreview,
    DeviceDetector,
    EventTracker,
    BehavioralTracker
  };
}
