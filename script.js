/**
 * @fileoverview Portfolio application with scroll animations, contact form, and back-to-top functionality.
 * @author Jeremie
 */

/**
 * Main Portfolio Application Class
 * Handles all interactive features of the portfolio website
 */
class PortfolioApp {
  /**
   * Initialize the Portfolio Application
   */
  constructor() {
    this.sections = document.querySelectorAll('section');
    this.backToTopButton = document.getElementById('back-to-top');
    this.contactForm = document.querySelector('.contact-form form');
    this.successMessage = document.getElementById('successMessage');
    this.errorMessage = this.createErrorMessage();
    this.contactSectionTitle = document.querySelector('#contact h2');
    this.contactContent = document.getElementById('contactContent');
    this.contactToggleIcon = document.getElementById('contactToggleIcon');
    
    // Configuration
    this.SCROLL_THRESHOLD = 300; // Pixels to scroll before showing back-to-top button
    this.MESSAGE_DISPLAY_TIME = 5000; // Time to display success/error messages (ms)
    this.INTERSECTION_THRESHOLD = 0.1; // 10% of section visible to trigger animation
  }

  /**
   * Create error message element dynamically
   * @private
   * @returns {HTMLElement} Error message element
   */
  createErrorMessage() {
    const errorDiv = document.createElement('div');
    errorDiv.id = 'errorMessage';
    errorDiv.className = 'message error-message hidden';
    errorDiv.setAttribute('aria-live', 'polite');
    
    if (this.successMessage && this.successMessage.parentNode) {
      this.successMessage.parentNode.insertBefore(errorDiv, this.successMessage.nextSibling);
    }
    
    return errorDiv;
  }

  /**
   * Initialize all application features
   * @public
   */
  init() {
    this.setupScrollAnimations();
    this.setupBackToTop();
    this.setupContactForm();
    this.setupContactSection();
  }

  /**
   * Setup Intersection Observer for scroll animations
   * @private
   */
  setupScrollAnimations() {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: this.INTERSECTION_THRESHOLD
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, observerOptions);

    this.sections.forEach(section => {
      observer.observe(section);
    });
  }

  /**
   * Setup back-to-top button functionality
   * @private
   */
  setupBackToTop() {
    if (!this.backToTopButton) {
      console.warn('Back to top button not found');
      return;
    }

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
      if (window.scrollY > this.SCROLL_THRESHOLD) {
        this.backToTopButton.style.display = 'block';
      } else {
        this.backToTopButton.style.display = 'none';
      }
    });

    // Scroll to top on click
    this.backToTopButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /**
   * Setup contact form with validation and submission handling
   * @private
   */
  setupContactForm() {
    if (!this.contactForm) {
      console.warn('Contact form not found');
      return;
    }

    this.contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      // Validate form before submission
      if (!this.validateForm()) {
        return;
      }

      await this.handleFormSubmission();
    });
  }

  /**
   * Validate contact form fields
   * @private
   * @returns {boolean} True if form is valid, false otherwise
   */
  validateForm() {
    const nameInput = this.contactForm.querySelector('input[name="name"]');
    const emailInput = this.contactForm.querySelector('input[name="email"]');
    const messageInput = this.contactForm.querySelector('textarea[name="message"]');

    // Clear previous error states
    this.clearFormErrors();

    let isValid = true;
    const errors = [];

    // Validate name
    if (!nameInput || !nameInput.value.trim()) {
      errors.push('Le nom est requis');
      if (nameInput) this.markFieldAsError(nameInput);
      isValid = false;
    }

    // Validate email
    if (!emailInput || !emailInput.value.trim()) {
      errors.push('L\'email est requis');
      if (emailInput) this.markFieldAsError(emailInput);
      isValid = false;
    } else if (!this.isValidEmail(emailInput.value)) {
      errors.push('L\'email n\'est pas valide');
      this.markFieldAsError(emailInput);
      isValid = false;
    }

    // Validate message
    if (!messageInput || !messageInput.value.trim()) {
      errors.push('Le message est requis');
      if (messageInput) this.markFieldAsError(messageInput);
      isValid = false;
    }

    if (!isValid) {
      this.showError(errors.join('. '));
    }

    return isValid;
  }

  /**
   * Validate email format
   * @private
   * @param {string} email - Email address to validate
   * @returns {boolean} True if email is valid
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Mark a form field as having an error
   * @private
   * @param {HTMLElement} field - Form field element
   */
  markFieldAsError(field) {
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
  }

  /**
   * Clear all form error states
   * @private
   */
  clearFormErrors() {
    const fields = this.contactForm.querySelectorAll('.error');
    fields.forEach(field => {
      field.classList.remove('error');
      field.removeAttribute('aria-invalid');
    });
  }

  /**
   * Handle form submission with error handling
   * @private
   */
  async handleFormSubmission() {
    const formData = new FormData(this.contactForm);
    
    try {
      const response = await fetch(this.contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        this.handleSubmissionSuccess();
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || 'Échec de la soumission du formulaire. Veuillez réessayer.';
        this.showError(errorMessage);
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
      this.showError('Impossible de se connecter au service d\'envoi. Vérifiez votre connexion Internet.');
    }
  }

  /**
   * Handle successful form submission
   * @private
   */
  handleSubmissionSuccess() {
    this.contactForm.reset();
    this.clearFormErrors();
    
    if (this.successMessage) {
      this.successMessage.classList.remove('hidden');
      this.successMessage.classList.add('show');
      
      setTimeout(() => {
        this.successMessage.classList.remove('show');
        this.successMessage.classList.add('hidden');
      }, this.MESSAGE_DISPLAY_TIME);
    }
  }

  /**
   * Display error message to user
   * @private
   * @param {string} message - Error message to display
   */
  showError(message) {
    if (this.errorMessage) {
      this.errorMessage.textContent = message;
      this.errorMessage.classList.remove('hidden');
      this.errorMessage.classList.add('show');
      
      setTimeout(() => {
        this.errorMessage.classList.remove('show');
        this.errorMessage.classList.add('hidden');
      }, this.MESSAGE_DISPLAY_TIME);
    } else {
      // Fallback to alert if error message element doesn't exist
      alert(message);
    }
  }

  /**
   * Setup collapsible contact section
   * @private
   */
  setupContactSection() {
    if (!this.contactSectionTitle || !this.contactContent || !this.contactToggleIcon) {
      console.warn('Contact section elements not found');
      return;
    }

    this.contactSectionTitle.addEventListener('click', () => {
      this.contactContent.classList.toggle('expanded');
      this.contactToggleIcon.classList.toggle('rotated');
    });
  }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new PortfolioApp();
  app.init();
});
