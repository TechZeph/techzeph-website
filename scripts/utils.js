/**
 * Utilities
 * Purpose: Small helper functions (debounce, HTML escaping, safe link opening, file downloads, reduced motion check)
 * Public API: debounce, escapeHtml, safeOpen, downloadFile, isReducedMotion
 * Last updated: 2025-01-27
 */

/**
 * Debounce a function call
 * @param {Function} fn - Function to debounce
 * @param {number} ms - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(fn, ms) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
}

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
export function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Safely open a URL in a new tab with security attributes
 * @param {string} url - URL to open
 */
export function safeOpen(url) {
  if (!url) return;
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.click();
}

/**
 * Download a file from a URL
 * @param {string} url - URL of file to download
 * @param {string} filename - Suggested filename
 */
export function downloadFile(url, filename) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || 'download';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Check if user prefers reduced motion
 * @returns {boolean} True if reduced motion is preferred
 */
export function isReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

