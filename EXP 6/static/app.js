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
 * CARD PREVIEW MODAL — Interactive contact preview
 */
class CardPreviewModal {
  constructor() {
    this.modal = null;
    this.setupCardClicks();
  }

  setupCardClicks() {
    document.addEventListener('click', (e) => {
      const card = e.target.closest('.contact-card');
      if (card && !e.target.closest('.btn-card') && !e.target.closest('.card-footer')) {
        this.showPreview(card);
      }
    });
  }

  showPreview(card) {
    const name = card.querySelector('.card-name').textContent;
    const role = card.querySelector('.card-role').textContent;
    const phone = card.querySelector('.card-detail:nth-child(1) span:last-child').textContent;
    const email = card.querySelector('.card-detail:nth-child(2) span:last-child').textContent;
    const letter = card.querySelector('.avatar').textContent;

    const modalHTML = `
      <div class="modal-overlay" onclick="this.remove()">
        <div class="modal-content" onclick="event.stopPropagation()">
          <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</button>
          <div class="modal-header">
            <div class="modal-avatar">${letter}</div>
            <div class="modal-title">
              <h2>${name}</h2>
              <p class="modal-role">${role || 'Contact'}</p>
            </div>
          </div>
          <div class="modal-body">
            <div class="modal-detail">
              <span class="detail-label">Phone</span>
              <a href="tel:${phone}" class="detail-value">${phone}</a>
            </div>
            <div class="modal-detail">
              <span class="detail-label">Email</span>
              <a href="mailto:${email}" class="detail-value">${email}</a>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary btn-sm" onclick="document.location.href=this.dataset.editUrl" data-edit-url="">Edit Contact</button>
            <button class="btn btn-ghost btn-sm" onclick="this.closest('.modal-overlay').remove()">Close</button>
          </div>
        </div>
      </div>
    `;

    const overlay = document.createElement('div');
    overlay.innerHTML = modalHTML;
    document.body.appendChild(overlay);
  }
}

/**
 * LIVE SEARCH — Real-time search without page reload
 */
class LiveSearch {
  constructor() {
    this.searchInput = document.querySelector('.search-input');
    this.grid = document.querySelector('.contacts-grid');
    this.cards = document.querySelectorAll('.contact-card');
    this.initialize();
  }

  initialize() {
    if (!this.searchInput || !this.grid) return;

    this.searchInput.addEventListener('input', (e) => {
      this.performSearch(e.target.value.toLowerCase());
    });
  }

  performSearch(query) {
    if (!query) {
      this.cards.forEach(card => {
        card.style.display = '';
        card.classList.add('search-result-enter');
      });
      return;
    }

    let visibleCount = 0;
    this.cards.forEach(card => {
      const name = card.querySelector('.card-name').textContent.toLowerCase();
      const phone = card.querySelector('.card-detail:nth-child(1)')?.textContent.toLowerCase() || '';
      const email = card.querySelector('.card-detail:nth-child(2)')?.textContent.toLowerCase() || '';
      const role = card.querySelector('.card-role').textContent.toLowerCase();

      const matches = name.includes(query) || phone.includes(query) || email.includes(query) || role.includes(query);

      if (matches) {
        card.style.display = '';
        card.classList.add('search-result-enter');
        visibleCount++;
      } else {
        card.style.display = 'none';
        card.classList.remove('search-result-enter');
      }
    });

    this.showSearchFeedback(visibleCount, query);
  }

  showSearchFeedback(count, query) {
    let feedback = document.querySelector('.search-feedback');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.className = 'search-feedback';
      this.grid.parentElement.insertBefore(feedback, this.grid);
    }

    if (count === 0) {
      feedback.innerHTML = `<p>No contacts match "<strong>${query}</strong>"</p>`;
    } else {
      feedback.innerHTML = `<p>Found <strong>${count}</strong> contact${count !== 1 ? 's' : ''}</p>`;
    }
  }
}

/**
 * SORT & FILTER — Advanced sorting and filtering
 */
class SortAndFilter {
  constructor() {
    this.grid = document.querySelector('.contacts-grid');
    this.cards = Array.from(document.querySelectorAll('.contact-card'));
    this.setupSortControls();
  }

  setupSortControls() {
    if (!this.grid) return;

    const sortHTML = `
      <div class="sort-controls">
        <button class="sort-btn" data-sort="name">A-Z Name</button>
        <button class="sort-btn" data-sort="role">By Role</button>
        <button class="sort-btn" data-sort="recent">Recent</button>
      </div>
    `;

    const container = this.grid.parentElement;
    const existing = container.querySelector('.sort-controls');
    if (!existing) {
      container.insertAdjacentHTML('beforeend', sortHTML);

      container.querySelectorAll('.sort-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          this.sortCards(btn.dataset.sort);
          btn.classList.add('active');
          container.querySelectorAll('.sort-btn').forEach(b => {
            if (b !== btn) b.classList.remove('active');
          });
        });
      });
    }
  }

  sortCards(sortBy) {
    let sorted = [...this.cards];

    switch (sortBy) {
      case 'name':
        sorted.sort((a, b) => {
          const nameA = a.querySelector('.card-name').textContent;
          const nameB = b.querySelector('.card-name').textContent;
          return nameA.localeCompare(nameB);
        });
        break;
      case 'role':
        sorted.sort((a, b) => {
          const roleA = a.querySelector('.card-role').textContent;
          const roleB = b.querySelector('.card-role').textContent;
          return roleA.localeCompare(roleB);
        });
        break;
      case 'recent':
        sorted.reverse();
        break;
    }

    sorted.forEach((card, index) => {
      card.style.order = index;
      card.classList.add('sort-animate');
    });
  }
}

/**
 * PARALLAX & SCROLL EFFECTS — Advanced scroll animations
 */
class ScrollEffects {
  constructor() {
    this.initialize();
  }

  initialize() {
    window.addEventListener('scroll', () => this.handleScroll());
  }

  handleScroll() {
    const cards = document.querySelectorAll('.contact-card');
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const opacity = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / window.innerHeight));
      card.style.opacity = Math.max(0.3, opacity);
    });
  }
}

/**
 * THEME SWITCHER — Dark/Light mode toggle
 */
class ThemeSwitcher {
  constructor() {
    this.currentTheme = localStorage.getItem('nexus-theme') || 'dark';
    this.setupThemeToggle();
    this.applyTheme(this.currentTheme);
  }

  setupThemeToggle() {
    const navbar = document.querySelector('.navbar-inner');
    if (!navbar) return;

    const themeBtn = document.createElement('button');
    themeBtn.className = 'theme-toggle';
    themeBtn.innerHTML = this.currentTheme === 'dark' 
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
      : '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    
    themeBtn.addEventListener('click', () => this.toggleTheme());
    navbar.appendChild(themeBtn);
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('nexus-theme', this.currentTheme);
    this.applyTheme(this.currentTheme);
  }

  applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
      document.body.style.filter = 'invert(0.95) hue-rotate(180deg)';
    } else {
      root.removeAttribute('data-theme');
      document.body.style.filter = 'none';
    }
  }
}

/**
 * STATS ANIMATION — Animate numbers on page load
 */
class StatsAnimation {
  constructor() {
    this.animateStats();
  }

  animateStats() {
    const stats = document.querySelectorAll('.stat-num');
    stats.forEach(stat => {
      const finalValue = stat.textContent;
      if (finalValue === '∞') return;

      const numValue = parseInt(finalValue);
      if (isNaN(numValue)) return;

      let current = 0;
      const increment = Math.ceil(numValue / 20);
      const interval = setInterval(() => {
        current += increment;
        if (current >= numValue) {
          stat.textContent = numValue;
          clearInterval(interval);
        } else {
          stat.textContent = current;
        }
      }, 20);
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
  
  // New advanced features
  new CardPreviewModal();
  new LiveSearch();
  new SortAndFilter();
  new ScrollEffects();
  new ThemeSwitcher();
  new StatsAnimation();
  
  console.log('✦ NEXUS Contact OS - Next Level initialized');
});

/**
 * ERROR HANDLING — Global error handler
 */
window.addEventListener('error', (e) => {
  console.error('Application error:', e.error);
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
