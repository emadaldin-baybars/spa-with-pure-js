export class ContactForm {
  paths = ['contact-form'];
  title = 'Contact Us - Get in Touch';
  description = 'Contact us using our form. We would love to hear from you!';

  // SEO Configuration
  seoConfig = {
    title: 'Contact Us - Get in Touch',
    description: 'Contact us using our form. We would love to hear from you!',
    keywords: 'contact, contact form, get in touch, feedback',
    image: '/assets/contact-og.jpg',
    type: 'website'
  };

  constructor() { }

  async getPageContent() {
    // Return form HTML - validation will be attached via separate script
    return `
      <div class="page-container">
        <header class="page-header">
          <h1>Contact Us</h1>
          <p class="subtitle">Fill out the form below and we'll get back to you soon!</p>
        </header>

        <form id="contact-form" class="contact-form" novalidate>
          <div class="form-group">
            <label for="name">Name <span class="required">*</span></label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Your full name"
              required
              aria-required="true"
            >
          </div>

          <div class="form-group">
            <label for="email">Email <span class="required">*</span></label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="your.email@example.com"
              required
              aria-required="true"
            >
          </div>

          <div class="form-group">
            <label for="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="+1 (555) 123-4567"
            >
          </div>

          <div class="form-group">
            <label for="subject">Subject <span class="required">*</span></label>
            <input
              type="text"
              id="subject"
              name="subject"
              placeholder="Brief description of your inquiry"
              required
              aria-required="true"
            >
          </div>

          <div class="form-group">
            <label for="message">Message <span class="required">*</span></label>
            <textarea
              id="message"
              name="message"
              rows="6"
              placeholder="Your message here..."
              required
              aria-required="true"
            ></textarea>
          </div>

          <div class="form-group">
            <label>
              <input
                type="checkbox"
                id="subscribe"
                name="subscribe"
              >
              Subscribe to our newsletter
            </label>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn">Send Message</button>
            <button type="reset" class="btn btn-secondary">Reset Form</button>
          </div>

          <div id="form-status" role="status" aria-live="polite"></div>
        </form>

        <script type="module">
          import { FormValidator, ValidationRules } from '../../utils/form-validator.js';
          import { apiService } from '../../services/api-service.js';

          // Initialize form validator
          const form = document.getElementById('contact-form');
          const validator = new FormValidator(form, {
            validateOnInput: true,
            validateOnBlur: true,

            // Handle successful form submission
            onSubmit: async (formData) => {
              const statusDiv = document.getElementById('form-status');
              statusDiv.innerHTML = '<p class="loading-state">Sending message...</p>';

              try {
                // Simulate API call (replace with actual endpoint)
                await new Promise(resolve => setTimeout(resolve, 1500));

                // In a real app, you would do:
                // await apiService.post('/api/contact', formData);

                statusDiv.innerHTML = '<p class="success-message">Message sent successfully! We will get back to you soon.</p>';
                form.reset();
                validator.reset();
              } catch (error) {
                statusDiv.innerHTML = '<p class="error-message">Failed to send message. Please try again.</p>';
              }
            },

            // Handle validation failure
            onValidationFailed: (errors) => {
              const statusDiv = document.getElementById('form-status');
              statusDiv.innerHTML = '<p class="error-message">Please fix the errors above before submitting.</p>';
            }
          });

          // Add validation rules
          validator.addField('name', [
            { name: 'required', message: 'Name is required.' },
            { name: 'minLength', params: [2], message: 'Name must be at least 2 characters.' },
            { name: 'maxLength', params: [50], message: 'Name must not exceed 50 characters.' }
          ]);

          validator.addField('email', [
            { name: 'required', message: 'Email is required.' },
            { name: 'email', message: 'Please enter a valid email address.' }
          ]);

          validator.addField('phone', [
            // Phone is optional, but if provided, must be valid
            (value) => {
              if (!value) return true; // Optional field
              return ValidationRules.phone(value);
            }
          ], {
            custom: 'Please enter a valid phone number.'
          });

          validator.addField('subject', [
            { name: 'required', message: 'Subject is required.' },
            { name: 'minLength', params: [5], message: 'Subject must be at least 5 characters.' },
            { name: 'maxLength', params: [100], message: 'Subject must not exceed 100 characters.' }
          ]);

          validator.addField('message', [
            { name: 'required', message: 'Message is required.' },
            { name: 'minLength', params: [10], message: 'Message must be at least 10 characters.' },
            { name: 'maxLength', params: [1000], message: 'Message must not exceed 1000 characters.' }
          ]);
        </script>

        <style>
          .contact-form {
            max-width: 600px;
            margin: 2rem auto;
          }

          .required {
            color: var(--error-color);
          }

          .form-actions {
            display: flex;
            gap: 1rem;
            margin-top: 2rem;
          }

          #form-status {
            margin-top: 1rem;
            padding: 1rem;
            border-radius: var(--border-radius);
          }

          .success-message {
            color: var(--success-color);
            background-color: #f0f9f0;
            padding: 1rem;
            border-radius: var(--border-radius);
            border-left: 3px solid var(--success-color);
          }
        </style>
      </div>
    `;
  }
}
