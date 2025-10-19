/**
 * Form Validator - Comprehensive form validation library with real-time validation
 */

/**
 * Built-in validation rules
 */
export const ValidationRules = {
  required: (value) => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined && value !== '';
  },

  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  minLength: (min) => (value) => {
    return value && value.length >= min;
  },

  maxLength: (max) => (value) => {
    return !value || value.length <= max;
  },

  min: (minValue) => (value) => {
    return Number(value) >= minValue;
  },

  max: (maxValue) => (value) => {
    return Number(value) <= maxValue;
  },

  pattern: (regex) => (value) => {
    return regex.test(value);
  },

  url: (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },

  phone: (value) => {
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    return phoneRegex.test(value);
  },

  alphanumeric: (value) => {
    return /^[a-zA-Z0-9]+$/.test(value);
  },

  numeric: (value) => {
    return /^[0-9]+$/.test(value);
  },

  match: (fieldName) => (value, formData) => {
    return value === formData[fieldName];
  }
};

/**
 * Error messages for validation rules
 */
export const DefaultErrorMessages = {
  required: 'This field is required.',
  email: 'Please enter a valid email address.',
  minLength: (min) => `Minimum length is ${min} characters.`,
  maxLength: (max) => `Maximum length is ${max} characters.`,
  min: (minValue) => `Minimum value is ${minValue}.`,
  max: (maxValue) => `Maximum value is ${maxValue}.`,
  pattern: 'Invalid format.',
  url: 'Please enter a valid URL.',
  phone: 'Please enter a valid phone number.',
  alphanumeric: 'Only letters and numbers are allowed.',
  numeric: 'Only numbers are allowed.',
  match: (fieldName) => `Must match ${fieldName}.`
};

/**
 * FormValidator class
 */
export class FormValidator {
  constructor(formElement, config = {}) {
    this.form = formElement;
    this.fields = new Map();
    this.errors = new Map();
    this.touched = new Set();
    this.config = {
      validateOnInput: true,
      validateOnBlur: true,
      showErrorsImmediately: false,
      ...config
    };

    this.init();
  }

  /**
   * Initialize form validation
   */
  init() {
    this.form.noValidate = true; // Disable native HTML5 validation

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    // Add event listeners for real-time validation
    this.form.querySelectorAll('input, textarea, select').forEach((field) => {
      if (this.config.validateOnInput) {
        field.addEventListener('input', () => this.validateField(field.name));
      }

      if (this.config.validateOnBlur) {
        field.addEventListener('blur', () => {
          this.touched.add(field.name);
          this.validateField(field.name);
        });
      }
    });
  }

  /**
   * Add validation rule for a field
   * @param {string} fieldName - Field name
   * @param {Array} rules - Array of validation rules
   * @param {Object} messages - Custom error messages
   */
  addField(fieldName, rules = [], messages = {}) {
    this.fields.set(fieldName, {
      rules,
      messages
    });
  }

  /**
   * Validate a single field
   * @param {string} fieldName - Field name
   * @returns {boolean} Is field valid
   */
  validateField(fieldName) {
    const fieldConfig = this.fields.get(fieldName);
    if (!fieldConfig) return true;

    const field = this.form.elements[fieldName];
    if (!field) return true;

    const value = field.value;
    const formData = this.getFormData();

    // Clear previous errors
    this.errors.delete(fieldName);

    // Run through all validation rules
    for (const rule of fieldConfig.rules) {
      const { validator, message, ruleName, params } = this.parseRule(rule);

      if (!validator(value, formData)) {
        const errorMessage = fieldConfig.messages[ruleName] || message;
        this.errors.set(fieldName, errorMessage);
        this.displayError(field, errorMessage);
        return false;
      }
    }

    this.clearError(field);
    return true;
  }

  /**
   * Parse validation rule
   * @param {Object|Function} rule - Validation rule
   * @returns {Object} Parsed rule object
   */
  parseRule(rule) {
    if (typeof rule === 'function') {
      return {
        validator: rule,
        message: 'Validation failed.',
        ruleName: 'custom'
      };
    }

    if (typeof rule === 'object') {
      const ruleName = rule.name;
      const params = rule.params || [];

      let validator = ValidationRules[ruleName];
      let message = DefaultErrorMessages[ruleName];

      // Handle rules that return a function (with parameters)
      if (typeof validator === 'function' && params.length > 0) {
        validator = validator(...params);
      }

      // Handle messages that are functions
      if (typeof message === 'function') {
        message = message(...params);
      }

      return {
        validator,
        message: rule.message || message,
        ruleName,
        params
      };
    }

    throw new Error('Invalid rule format');
  }

  /**
   * Validate all fields in the form
   * @returns {boolean} Is form valid
   */
  validateAll() {
    let isValid = true;

    for (const [fieldName] of this.fields) {
      const fieldValid = this.validateField(fieldName);
      if (!fieldValid) {
        isValid = false;
      }
    }

    return isValid;
  }

  /**
   * Handle form submission
   */
  async handleSubmit() {
    // Mark all fields as touched
    for (const [fieldName] of this.fields) {
      this.touched.add(fieldName);
    }

    const isValid = this.validateAll();

    if (isValid) {
      const formData = this.getFormData();

      // Trigger custom submit handler if provided
      if (this.config.onSubmit) {
        try {
          await this.config.onSubmit(formData);
        } catch (error) {
          if (this.config.onError) {
            this.config.onError(error);
          }
        }
      }
    } else {
      // Focus on first error field
      const firstErrorField = Array.from(this.errors.keys())[0];
      const field = this.form.elements[firstErrorField];
      if (field) {
        field.focus();
      }

      if (this.config.onValidationFailed) {
        this.config.onValidationFailed(this.errors);
      }
    }
  }

  /**
   * Display error message for a field
   * @param {HTMLElement} field - Form field element
   * @param {string} message - Error message
   */
  displayError(field, message) {
    // Add error class to field
    field.classList.add('invalid');
    field.classList.remove('valid');
    field.setAttribute('aria-invalid', 'true');

    // Find or create error message element
    let errorElement = field.parentElement.querySelector('.error-message');

    if (!errorElement) {
      errorElement = document.createElement('span');
      errorElement.className = 'error-message';
      errorElement.setAttribute('role', 'alert');
      errorElement.setAttribute('aria-live', 'polite');
      field.parentElement.appendChild(errorElement);
    }

    errorElement.textContent = message;
    field.setAttribute('aria-describedby', errorElement.id || `${field.name}-error`);
  }

  /**
   * Clear error message for a field
   * @param {HTMLElement} field - Form field element
   */
  clearError(field) {
    field.classList.remove('invalid');
    field.classList.add('valid');
    field.setAttribute('aria-invalid', 'false');

    const errorElement = field.parentElement.querySelector('.error-message');
    if (errorElement) {
      errorElement.textContent = '';
    }
  }

  /**
   * Get form data as object
   * @returns {Object} Form data
   */
  getFormData() {
    const formData = {};
    const elements = this.form.elements;

    for (let i = 0; i < elements.length; i++) {
      const field = elements[i];

      if (field.name && field.type !== 'submit' && field.type !== 'button') {
        if (field.type === 'checkbox') {
          formData[field.name] = field.checked;
        } else if (field.type === 'radio') {
          if (field.checked) {
            formData[field.name] = field.value;
          }
        } else {
          formData[field.name] = field.value;
        }
      }
    }

    return formData;
  }

  /**
   * Reset form validation state
   */
  reset() {
    this.errors.clear();
    this.touched.clear();

    this.form.querySelectorAll('.invalid, .valid').forEach((field) => {
      field.classList.remove('invalid', 'valid');
      field.removeAttribute('aria-invalid');
    });

    this.form.querySelectorAll('.error-message').forEach((el) => {
      el.textContent = '';
    });

    this.form.reset();
  }

  /**
   * Check if form is valid
   * @returns {boolean}
   */
  isValid() {
    return this.errors.size === 0;
  }

  /**
   * Get all errors
   * @returns {Map}
   */
  getErrors() {
    return this.errors;
  }

  /**
   * Set custom error for a field
   * @param {string} fieldName - Field name
   * @param {string} message - Error message
   */
  setError(fieldName, message) {
    const field = this.form.elements[fieldName];
    if (field) {
      this.errors.set(fieldName, message);
      this.displayError(field, message);
    }
  }

  /**
   * Add custom validator
   * @param {string} name - Validator name
   * @param {Function} validator - Validator function
   * @param {string} defaultMessage - Default error message
   */
  static addCustomValidator(name, validator, defaultMessage) {
    ValidationRules[name] = validator;
    DefaultErrorMessages[name] = defaultMessage;
  }
}

/**
 * Utility function to sanitize input (XSS prevention)
 * @param {string} input - User input
 * @returns {string} Sanitized input
 */
export function sanitizeInput(input) {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}
