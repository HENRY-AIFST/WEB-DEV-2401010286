/* ================================================================
   NEXUS Contact OS — app.js
   Functionality: Interactions, validations, animations
   ================================================================ */

/**
 * FLASH MESSAGES — Auto dismiss with user interaction
 */
class FlashManager {
  constructor() {
    this.flashZone = document.querySelector('.flash-zone');
    this.initialize();
  }

  initialize() {
    if (!this.flashZone) return;
    
    const flashes = this.flashZone.querySelectorAll('.flash');
    flashes.forEach((flash, index) => {
      this.setupFlash(flash, index);
    });
  }

  setupFlash(flashEl, index) {
    // Auto dismiss after 5 seconds for success, 6 seconds for errors
    const isError = flashEl.classList.contains('flash-error');
    const duration = isError ? 6000 : 5000;
    
    const timeoutId = setTimeout(() => this.dismissFlash(flashEl), duration);
    
    // Manual dismiss on close button
    const closeBtn = flashEl.querySelector('.flash-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        clearTimeout(timeoutId);
        this.dismissFlash(flashEl);
      });
    }
    
    // Optional: dismiss on click anywhere on flash
    flashEl.addEventListener('click', (e) => {
      if (e.target !== closeBtn && !closeBtn.contains(e.target)) {
        clearTimeout(timeoutId);
      }
    });
  }

  dismissFlash(flashEl) {
    flashEl.style.animation = 'flashOut 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
    setTimeout(() => flashEl.remove(), 300);
  }
}

/**
 * FORM VALIDATION — Real-time validation with error states
 */
class FormValidator {
  constructor() {
    this.forms = document.querySelectorAll('form');
    this.initialize();
  }

  initialize() {
    this.forms.forEach(form => {
      this.setupFormValidation(form);
    });
  }

  setupFormValidation(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      // Real-time validation on blur
      input.addEventListener('blur', () => this.validateField(input));
      
      // Clear error on focus
      input.addEventListener('focus', () => this.clearFieldError(input));
      
      // Real-time validation for email
      if (input.type === 'email') {
        input.addEventListener('input', () => this.validateField(input));
      }
    });
    
    // Form submission validation
    form.addEventListener('submit', (e) => {
      if (!this.validateForm(form)) {
        e.preventDefault();
      }
    });
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name');
    
    const rules = {
      name: {
        required: true,
        minLength: 2,
        message: 'Full name required (min 2 characters)'
      },
      email: {
        required: true,
        email: true,
        message: 'Valid email required'
      },
      phone: {
        required: true,
        minLength: 6,
        message: 'Phone number required (min 6 digits)'
      },
      role: {
        minLength: 2,
        message: 'Role should be at least 2 characters'
      }
    };
    
    const rule = rules[fieldName];
    if (!rule) return true;
    
    let isValid = true;
    let errorMsg = '';
    
    if (rule.required && !value) {
      isValid = false;
      errorMsg = rule.message || `${fieldName} is required`;
    } else if (rule.minLength && value && value.length < rule.minLength) {
      isValid = false;
      errorMsg = rule.message;
    } else if (rule.email && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMsg = rule.message;
      }
    }
    
    this.setFieldError(field, !isValid, errorMsg);
    return isValid;
  }

  validateForm(form) {
    const inputs = form.querySelectorAll('input[required], input[type="email"]');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });
    
    return isValid;
  }

  setFieldError(field, hasError, message = '') {
    const group = field.closest('.form-group');
    if (!group) return;
    
    const errorEl = group.querySelector('.form-error');
    
    if (hasError) {
      field.classList.add('error');
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('show');
      }
    } else {
      field.classList.remove('error');
      if (errorEl) {
        errorEl.classList.remove('show');
      }
    }
  }

  clearFieldError(field) {
    const group = field.closest('.form-group');
    if (!group) return;
    
    field.classList.remove('error');
    const errorEl = group.querySelector('.form-error');
    if (errorEl) {
      errorEl.classList.remove('show');
    }
  }
}

/**
 * SEARCH FUNCTIONALITY — Enhanced search experience
 */
class SearchManager {
  constructor() {
    this.searchForm = document.querySelector('.search-form');
    this.searchInput = document.querySelector('.search-input');
    this.searchClear = document.querySelector('.search-clear');
    this.initialize();
  }

  initialize() {
    if (!this.searchInput) return;
    
    // Clear search
    if (this.searchClear) {
      this.searchClear.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = this.searchForm.getAttribute('action');
      });
    }
    
    // Focus styling
    this.searchInput.addEventListener('focus', () => {
      this.searchInput.parentElement.style.borderColor = 'var(--neon)';
    });
    
    this.searchInput.addEventListener('blur', () => {
      this.searchInput.parentElement.style.borderColor = '';
    });
  }
}

/**
 * DELETE CONFIRMATION — Enhanced delete experience
 */
class DeleteManager {
  constructor() {
    this.setupDeleteHandlers();
  }

  setupDeleteHandlers() {
    const deleteButtons = document.querySelectorAll('.btn-delete-card');
    
    deleteButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const contactName = btn.closest('.contact-card')
          .querySelector('.card-name')
          .textContent;
        return this.showConfirmation(contactName);
      });
    });
  }

  showConfirmation(name) {
    const message = `Remove "${name}" from NEXUS?\n\nThis action cannot be undone.`;
    return confirm(message);
  }
}

/**
 * CONTACT CARD ANIMATIONS — Interactive card effects
 */
class CardAnimations {
  constructor() {
    this.cards = document.querySelectorAll('.contact-card');
    this.initialize();
  }

  initialize() {
    this.cards.forEach((card, index) => {
      this.setupCardAnimations(card, index);
    });
  }

  setupCardAnimations(card, index) {
    // Staggered entrance animation (already in CSS but we can enhance)
    card.style.animationDelay = `${index * 0.06}s`;
    
    // Enhanced hover effect
    card.addEventListener('mouseenter', () => {
      card.style.zIndex = '10';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.zIndex = '1';
    });
  }
}

/**
 * BUTTON INTERACTIONS — Enhanced button feedback
 */
class ButtonManager {
  constructor() {
    this.buttons = document.querySelectorAll('.btn, .btn-card, button');
    this.initialize();
  }

  initialize() {
    this.buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.addClickFeedback(btn, e);
      });
    });
  }

  addClickFeedback(btn, e) {
    // Add ripple effect on click
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.style.position = 'absolute';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.width = '10px';
    ripple.style.height = '10px';
    ripple.style.background = 'rgba(255, 255, 255, 0.5)';
    ripple.style.borderRadius = '50%';
    ripple.style.pointerEvents = 'none';
    ripple.style.animation = 'ripple 0.6s ease-out';
    
    // Only add ripple effect to certain buttons
    if (btn.classList.contains('btn-primary') || 
        btn.classList.contains('btn-edit-card')) {
      if (btn.style.position === '' || btn.style.position === 'static') {
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
      }
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    }
  }
}

/**
 * KEYBOARD SHORTCUTS — Power-user shortcuts
 */
class KeyboardShortcuts {
  constructor() {
    this.initialize();
  }

  initialize() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + K for search focus
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.search-input');
        if (searchInput) searchInput.focus();
      }
      
      // Ctrl/Cmd + N for new contact
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        const addLink = document.querySelector('a[href*="add"]');
        if (addLink) window.location.href = addLink.href;
      }
      
      // Escape to clear search
      if (e.key === 'Escape') {
        const searchInput = document.querySelector('.search-input');
        if (searchInput && searchInput.value) {
          searchInput.value = '';
          searchInput.blur();
        }
      }
    });
  }
}

/**
 * PAGE TRANSITIONS — Smooth page load animations
 */
class PageTransitions {
  constructor() {
    this.initialize();
  }

  initialize() {
    // Add fade-in animation to main content
    const main = document.querySelector('.main');
    if (main) {
      main.style.animation = 'fadeUp 0.5s ease-out';
    }
    
    // Add page load class
    document.body.classList.add('page-loaded');
  }
}

/**
 * ACCESSIBILITY — Enhanced accessibility features
 */
class AccessibilityManager {
  constructor() {
    this.initialize();
  }

  initialize() {
    // Add ARIA labels to interactive elements
    const cards = document.querySelectorAll('.contact-card');
    cards.forEach(card => {
      const name = card.querySelector('.card-name').textContent;
      card.setAttribute('role', 'article');
      card.setAttribute('aria-label', `Contact: ${name}`);
    });
    
    // Enhance button accessibility
    const buttons = document.querySelectorAll('.btn-card, .btn');
    buttons.forEach(btn => {
      if (!btn.getAttribute('aria-label')) {
        const text = btn.textContent.trim();
        if (text) btn.setAttribute('aria-label', text);
      }
    });
  }
}

/**
 * INIT — Initialize all managers on DOM ready
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all managers
  new FlashManager();
  new FormValidator();
  new SearchManager();
  new DeleteManager();
  new CardAnimations();
  new ButtonManager();
  new KeyboardShortcuts();
  new PageTransitions();
  new AccessibilityManager();
  
  console.log('✦ NEXUS Contact OS initialized');
});

/**
 * ERROR HANDLING — Global error handler
 */
window.addEventListener('error', (e) => {
  console.error('Application error:', e.error);
  // Silently log, don't interrupt user experience
});

/**
 * PERFORMANCE — Add performance tracking
 */
if (window.performance && window.performance.timing) {
  window.addEventListener('load', () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`✦ Page loaded in ${pageLoadTime}ms`);
  });
}
