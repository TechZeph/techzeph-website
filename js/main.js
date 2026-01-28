/**
 * Main Application Entry Point
 * Initializes terminal and handles UI interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Terminal
  const terminal = new Terminal();

  // Navigation button handlers
  const btnAbout = document.getElementById('btn-about');
  const btnPricing = document.getElementById('btn-pricing');

  if (btnAbout) {
    btnAbout.addEventListener('click', () => {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (btnPricing) {
    btnPricing.addEventListener('click', () => {
      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Pricing button click handlers
  const pricingBtns = document.querySelectorAll('.pricing-btn');
  pricingBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // You can customize this action - open a contact form, email, etc.
      alert('Thank you for your interest! Please contact me via GitHub or email to discuss your project.');
    });
  });

  // Terminal header button animations (cosmetic)
  const terminalBtns = document.querySelectorAll('.terminal-btn');
  terminalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      // Add subtle animation feedback
      btn.style.transform = 'scale(0.9)';
      setTimeout(() => {
        btn.style.transform = 'scale(1)';
      }, 100);
    });
  });

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Focus terminal input on load
  setTimeout(() => {
    document.getElementById('terminal-input')?.focus();
  }, 500);
});
