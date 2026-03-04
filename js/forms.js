/**
 * Gumruyan Campaign Website - Form Interactions
 * Email capture, volunteer signup, donation UI, toast notifications
 * No external dependencies.
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /*  Constants                                                         */
  /* ------------------------------------------------------------------ */
  var FORMSPREE_EMAIL = 'https://formspree.io/f/YOUR_FORM_ID';
  var FORMSPREE_VOLUNTEER = 'https://formspree.io/f/YOUR_FORM_ID';
  var DONATE_URL = 'https://donate.stripe.com/placeholder';
  var TOAST_DURATION = 4000;

  /* ------------------------------------------------------------------ */
  /*  DOM Ready                                                         */
  /* ------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', function () {
    initEmailCapture();
    initVolunteerForm();
    initDonateUI();
  });

  /* ================================================================== */
  /*  TOAST NOTIFICATIONS                                               */
  /* ================================================================== */

  /**
   * Show a toast notification.
   * @param {string} message - Text to display.
   * @param {'success'|'error'} type - Visual style.
   */
  function showToast(message, type) {
    type = type || 'success';

    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');

    var icon = type === 'success'
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';

    toast.innerHTML =
      '<span class="toast-icon">' + icon + '</span>' +
      '<span class="toast-message">' + escapeHTML(message) + '</span>' +
      '<button class="toast-close" aria-label="Dismiss">&times;</button>';

    // Inject styles once
    ensureToastStyles();

    document.body.appendChild(toast);

    // Trigger slide-in on next frame
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        toast.classList.add('toast-visible');
      });
    });

    // Close button
    var closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', function () {
      removeToast(toast);
    });

    // Auto-remove
    setTimeout(function () {
      removeToast(toast);
    }, TOAST_DURATION);
  }

  function removeToast(toast) {
    if (!toast || !toast.parentNode) return;
    toast.classList.remove('toast-visible');
    toast.classList.add('toast-hiding');
    setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 350);
  }

  var toastStylesInjected = false;
  function ensureToastStyles() {
    if (toastStylesInjected) return;
    toastStylesInjected = true;

    var css =
      '.toast {' +
        'position: fixed;' +
        'bottom: 24px;' +
        'right: 24px;' +
        'z-index: 10000;' +
        'display: flex;' +
        'align-items: center;' +
        'gap: 10px;' +
        'padding: 14px 20px;' +
        'border-radius: 8px;' +
        'font-family: inherit;' +
        'font-size: 15px;' +
        'line-height: 1.4;' +
        'color: #fff;' +
        'box-shadow: 0 4px 20px rgba(0,0,0,0.18);' +
        'transform: translateX(120%);' +
        'opacity: 0;' +
        'transition: transform 0.35s cubic-bezier(0.21,1.02,0.73,1), opacity 0.35s ease;' +
        'max-width: 420px;' +
      '}' +
      '.toast-visible {' +
        'transform: translateX(0);' +
        'opacity: 1;' +
      '}' +
      '.toast-hiding {' +
        'transform: translateX(120%);' +
        'opacity: 0;' +
      '}' +
      '.toast-success {' +
        'background: #16a34a;' +
      '}' +
      '.toast-error {' +
        'background: #dc2626;' +
      '}' +
      '.toast-icon {' +
        'flex-shrink: 0;' +
        'display: flex;' +
        'align-items: center;' +
      '}' +
      '.toast-message {' +
        'flex: 1;' +
      '}' +
      '.toast-close {' +
        'background: none;' +
        'border: none;' +
        'color: rgba(255,255,255,0.8);' +
        'font-size: 20px;' +
        'cursor: pointer;' +
        'padding: 0 0 0 8px;' +
        'line-height: 1;' +
      '}' +
      '.toast-close:hover {' +
        'color: #fff;' +
      '}' +
      /* Inline validation error styles */
      '.field-error {' +
        'color: #dc2626;' +
        'font-size: 13px;' +
        'margin-top: 4px;' +
        'display: block;' +
      '}' +
      '.field-invalid {' +
        'border-color: #dc2626 !important;' +
        'box-shadow: 0 0 0 2px rgba(220,38,38,0.15) !important;' +
      '}' +
      /* Mobile toast positioning */
      '@media (max-width: 480px) {' +
        '.toast {' +
          'left: 12px;' +
          'right: 12px;' +
          'bottom: 12px;' +
          'max-width: none;' +
        '}' +
      '}';

    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  /* ================================================================== */
  /*  EMAIL CAPTURE FORM                                                */
  /* ================================================================== */
  function initEmailCapture() {
    var forms = document.querySelectorAll('.email-capture-form');
    if (forms.length === 0) return;

    forms.forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        var emailInput = form.querySelector('input[type="email"], input[name="email"]');
        if (!emailInput) return;

        var email = emailInput.value.trim();

        // Validate email
        if (!isValidEmail(email)) {
          showToast('Please enter a valid email address.', 'error');
          emailInput.focus();
          return;
        }

        // Disable form during submission
        var submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
        var originalText = '';
        if (submitBtn) {
          originalText = submitBtn.textContent || submitBtn.value;
          setButtonLoading(submitBtn, true);
        }

        // Submit to Formspree
        var formData = new FormData();
        formData.append('email', email);

        fetch(FORMSPREE_EMAIL, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        })
          .then(function (response) {
            if (response.ok) {
              showToast("Thanks for joining! We'll be in touch.", 'success');
              form.reset();
            } else {
              throw new Error('Submission failed');
            }
          })
          .catch(function () {
            showToast('Something went wrong. Please try again.', 'error');
          })
          .finally(function () {
            if (submitBtn) {
              setButtonLoading(submitBtn, false, originalText);
            }
          });
      });
    });
  }

  /* ================================================================== */
  /*  VOLUNTEER FORM                                                    */
  /* ================================================================== */
  function initVolunteerForm() {
    var form = document.getElementById('volunteer-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearAllErrors(form);

      // Gather fields
      var nameField = form.querySelector('[name="name"]');
      var emailField = form.querySelector('[name="email"]');
      var phoneField = form.querySelector('[name="phone"]');
      var zipField = form.querySelector('[name="zip"]');
      var interestCheckboxes = form.querySelectorAll('input[name="interest"]:checked, input[name="interests"]:checked, input[name="interest[]"]:checked');

      var isValid = true;

      // Name: required
      if (nameField && !nameField.value.trim()) {
        showFieldError(nameField, 'Name is required.');
        isValid = false;
      }

      // Email: required + format
      if (emailField) {
        var emailVal = emailField.value.trim();
        if (!emailVal) {
          showFieldError(emailField, 'Email is required.');
          isValid = false;
        } else if (!isValidEmail(emailVal)) {
          showFieldError(emailField, 'Please enter a valid email address.');
          isValid = false;
        }
      }

      // ZIP: required, 5 digits
      if (zipField) {
        var zipVal = zipField.value.trim();
        if (!zipVal) {
          showFieldError(zipField, 'ZIP code is required.');
          isValid = false;
        } else if (!/^\d{5}$/.test(zipVal)) {
          showFieldError(zipField, 'Please enter a valid 5-digit ZIP code.');
          isValid = false;
        }
      }

      // At least one interest checkbox
      if (interestCheckboxes.length === 0) {
        // Find the checkbox container to attach the error
        var checkboxGroup =
          form.querySelector('.interest-group') ||
          form.querySelector('.checkbox-group') ||
          form.querySelector('fieldset');
        if (checkboxGroup) {
          showFieldError(checkboxGroup, 'Please select at least one area of interest.');
        } else {
          showToast('Please select at least one area of interest.', 'error');
        }
        isValid = false;
      }

      if (!isValid) {
        // Focus the first invalid field
        var firstError = form.querySelector('.field-invalid');
        if (firstError) firstError.focus();
        return;
      }

      // Build form data
      var submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
      var originalText = '';
      if (submitBtn) {
        originalText = submitBtn.textContent || submitBtn.value;
        setButtonLoading(submitBtn, true);
      }

      var formData = new FormData(form);

      fetch(FORMSPREE_VOLUNTEER, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            showToast('Thank you for volunteering! We will be in touch soon.', 'success');
            form.reset();
            clearAllErrors(form);
          } else {
            throw new Error('Submission failed');
          }
        })
        .catch(function () {
          showToast('Something went wrong. Please try again.', 'error');
        })
        .finally(function () {
          if (submitBtn) {
            setButtonLoading(submitBtn, false, originalText);
          }
        });
    });

    // Clear inline errors on input change
    form.addEventListener('input', function (e) {
      clearFieldError(e.target);
    });
    form.addEventListener('change', function (e) {
      clearFieldError(e.target);
    });
  }

  /* ================================================================== */
  /*  DONATE AMOUNT SELECTION UI                                        */
  /* ================================================================== */
  function initDonateUI() {
    var amountButtons = document.querySelectorAll('.amount-btn');
    var customButton = document.querySelector('.amount-btn-custom');
    var customInput = document.querySelector('.custom-amount-input, #custom-amount');
    var donateButton = document.querySelector('.donate-btn, #donate-btn');
    var recurringToggle = document.querySelector('.recurring-toggle');

    if (amountButtons.length === 0) return;

    var selectedAmount = null;

    // Preset amount buttons
    amountButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        // Deselect all
        amountButtons.forEach(function (b) {
          b.classList.remove('selected');
        });
        if (customButton) customButton.classList.remove('selected');

        // Select this one
        btn.classList.add('selected');

        // If this is not the custom button, hide custom input and store amount
        if (!btn.classList.contains('amount-btn-custom')) {
          hideCustomInput();
          selectedAmount = btn.getAttribute('data-amount') || btn.textContent.replace(/[^0-9.]/g, '');
        }
      });
    });

    // Custom amount button
    if (customButton) {
      customButton.addEventListener('click', function () {
        // Deselect all preset buttons
        amountButtons.forEach(function (b) {
          b.classList.remove('selected');
        });
        customButton.classList.add('selected');
        showCustomInput();
        selectedAmount = null;
      });
    }

    // Custom input changes
    if (customInput) {
      customInput.addEventListener('input', function () {
        selectedAmount = customInput.value.replace(/[^0-9.]/g, '');
      });
    }

    // Donate button click
    if (donateButton) {
      donateButton.addEventListener('click', function (e) {
        e.preventDefault();

        // Get custom input value if visible
        if (customInput && customInput.offsetParent !== null) {
          var val = customInput.value.replace(/[^0-9.]/g, '');
          if (!val || parseFloat(val) <= 0) {
            showToast('Please enter a donation amount.', 'error');
            customInput.focus();
            return;
          }
          selectedAmount = val;
        }

        if (!selectedAmount) {
          showToast('Please select a donation amount.', 'error');
          return;
        }

        // Build the donate URL with the amount
        var url = DONATE_URL;
        if (url.indexOf('?') === -1) {
          url += '?amount=' + encodeURIComponent(selectedAmount);
        } else {
          url += '&amount=' + encodeURIComponent(selectedAmount);
        }

        // Check recurring
        if (recurringToggle && recurringToggle.checked) {
          url += '&recurring=monthly';
        }

        window.open(url, '_blank', 'noopener');
      });
    }

    // Recurring toggle: update button text
    if (recurringToggle && donateButton) {
      var originalButtonText = donateButton.textContent;

      recurringToggle.addEventListener('change', function () {
        if (recurringToggle.checked) {
          donateButton.textContent = 'Donate Monthly';
        } else {
          donateButton.textContent = originalButtonText || 'Donate';
        }
      });
    }

    function showCustomInput() {
      if (!customInput) return;
      customInput.style.display = '';
      customInput.removeAttribute('hidden');
      customInput.focus();

      // Also show a wrapper if present
      var wrapper = customInput.closest('.custom-amount-wrapper');
      if (wrapper) {
        wrapper.style.display = '';
        wrapper.removeAttribute('hidden');
      }
    }

    function hideCustomInput() {
      if (!customInput) return;
      customInput.style.display = 'none';
      customInput.value = '';

      var wrapper = customInput.closest('.custom-amount-wrapper');
      if (wrapper) {
        wrapper.style.display = 'none';
      }
    }

    // Initialize: hide custom input
    hideCustomInput();
  }

  /* ================================================================== */
  /*  INLINE VALIDATION HELPERS                                         */
  /* ================================================================== */

  /**
   * Show an inline error below a form field.
   */
  function showFieldError(field, message) {
    field.classList.add('field-invalid');

    // Create error message element
    var errorEl = document.createElement('span');
    errorEl.className = 'field-error';
    errorEl.textContent = message;
    errorEl.setAttribute('role', 'alert');

    // Insert after the field (or after its parent if it is a checkbox group)
    if (field.tagName === 'FIELDSET' || field.classList.contains('interest-group') || field.classList.contains('checkbox-group')) {
      field.appendChild(errorEl);
    } else {
      field.parentNode.insertBefore(errorEl, field.nextSibling);
    }
  }

  /**
   * Clear the inline error for a specific field.
   */
  function clearFieldError(field) {
    if (!field) return;
    field.classList.remove('field-invalid');

    var parent = field.parentNode;
    if (!parent) return;
    var errorEl = parent.querySelector('.field-error');
    if (errorEl) parent.removeChild(errorEl);
  }

  /**
   * Clear all inline errors in a form.
   */
  function clearAllErrors(form) {
    var errors = form.querySelectorAll('.field-error');
    errors.forEach(function (el) {
      el.parentNode.removeChild(el);
    });
    var invalids = form.querySelectorAll('.field-invalid');
    invalids.forEach(function (el) {
      el.classList.remove('field-invalid');
    });
  }

  /* ================================================================== */
  /*  UTILITY FUNCTIONS                                                 */
  /* ================================================================== */

  /**
   * Validate email format.
   * Uses a practical regex that covers the vast majority of valid addresses.
   */
  function isValidEmail(email) {
    if (!email) return false;
    // Standard email validation pattern
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  /**
   * Escape HTML special characters to prevent XSS in toast messages.
   */
  function escapeHTML(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  /**
   * Set a button into a loading/disabled state.
   */
  function setButtonLoading(btn, loading, originalText) {
    if (loading) {
      btn.disabled = true;
      btn.setAttribute('data-original-text', btn.textContent || btn.value);
      if (btn.tagName === 'INPUT') {
        btn.value = 'Submitting...';
      } else {
        btn.textContent = 'Submitting...';
      }
    } else {
      btn.disabled = false;
      var text = originalText || btn.getAttribute('data-original-text') || 'Submit';
      if (btn.tagName === 'INPUT') {
        btn.value = text;
      } else {
        btn.textContent = text;
      }
    }
  }

  /* ================================================================== */
  /*  EXPOSE showToast globally (other scripts may use it)              */
  /* ================================================================== */
  window.showToast = showToast;
})();
