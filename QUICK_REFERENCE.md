# Quick Reference

Quick code snippets and examples for common tasks in this SPA template.

---

## Table of Contents

1. [Routing](#routing)
2. [Components](#components)
3. [SEO](#seo)
4. [Forms](#forms)
5. [API Calls](#api-calls)
6. [CSS Utilities](#css-utilities)
7. [Common Patterns](#common-patterns)

---

## Routing

### Create a New Page

```javascript
// src/pages/my-page/my-page.js
export class MyPage {
  paths = ['my-page'];
  title = 'My Page';
  description = 'Page description';

  seoConfig = {
    title: 'My Page - SPA',
    description: 'Page description for SEO',
    keywords: 'keyword1, keyword2',
    type: 'website'
  };

  async getPageContent() {
    return `
      <div class="page-container">
        <h1>My Page</h1>
        <p>Content here</p>
      </div>
    `;
  }
}
```

### Register Page in Routes

```javascript
// src/app/global-scope.js
import { MyPage } from '../pages/my-page/my-page.js';

const routes = new EnhancedRoutes([
  new Home(),
  new MyPage(), // Add here
  new NotFound()
]);
```

### Programmatic Navigation

```javascript
// Navigate to a route
navigate(null, 'my-page');

// Or with full URL
window.history.pushState(null, '', '/my-page');
loadPageContent('my-page');
```

### Route Guards

```javascript
const routes = new EnhancedRoutes([...], {
  guards: [
    async (path) => {
      // Check authentication
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      if (!isAuthenticated && path !== 'home') {
        return { allowed: false, redirect: 'home' };
      }
      return { allowed: true };
    }
  ]
});
```

---

## Components

### Basic Component

```javascript
import { Component } from '../Component.js';

export class MyComponent extends Component {
  constructor(props = {}) {
    super({ message: 'Hello', ...props });
    this.state = { count: 0 };
  }

  render() {
    return `
      <div class="my-component">
        <p>${this.escapeHTML(this.props.message)}</p>
        <p>Count: ${this.state.count}</p>
        <button data-action="increment">+</button>
      </div>
    `;
  }

  attachEventListeners() {
    const btn = this.element.querySelector('[data-action="increment"]');
    btn?.addEventListener('click', () => {
      this.setState({ count: this.state.count + 1 });
    });
  }
}
```

### Using Button Component

```javascript
import { Button } from '../../components/Button/Button.js';

// Primary button
const btn = new Button({
  text: 'Click Me',
  variant: 'primary',
  size: 'medium',
  onClick: () => console.log('Clicked!')
});
btn.mount('#container');

// Variants: primary, secondary, danger, success
// Sizes: small, medium, large
```

### Using Card Component

```javascript
import { Card } from '../../components/Card/Card.js';

const card = new Card({
  title: 'Card Title',
  subtitle: 'Card Subtitle',
  content: '<p>Card content here</p>',
  footer: '<button>Action</button>',
  variant: 'elevated', // default, outlined, elevated
  image: '/images/card-image.jpg'
});
card.mount('#container');
```

### Using List Component

```javascript
import { List } from '../../components/List/List.js';

const list = new List({
  items: [
    { id: 1, text: 'Item 1', icon: '📌' },
    { id: 2, text: 'Item 2', icon: '✓' },
    { id: 3, text: 'Item 3', icon: '🎯' }
  ],
  variant: 'hoverable', // default, bordered, hoverable
  onItemClick: (item) => {
    console.log('Clicked:', item);
  }
});
list.mount('#list-container');
```

### Component Lifecycle

```javascript
export class MyComponent extends Component {
  onCreate() {
    // Called when component is created
    console.log('Component created');
  }

  onMount() {
    // Called after mounted to DOM
    console.log('Component mounted');
    this.element.querySelector('input')?.focus();
  }

  onDestroy() {
    // Called before removed from DOM
    console.log('Component destroyed');
    // Clean up event listeners, timers, etc.
  }
}
```

### Update Component Props

```javascript
const component = new MyComponent({ title: 'Hello' });
component.mount('#container');

// Update props later
component.setProps({ title: 'Updated!' });
```

---

## SEO

### Update Meta Tags

```javascript
import { globalScope } from '../app/global-scope.js';

globalScope.seoManager.updateMetaTags({
  title: 'Page Title',
  description: 'Page description for search engines',
  keywords: 'keyword1, keyword2, keyword3',
  author: 'Author Name',
  image: '/images/og-image.jpg',
  url: 'https://example.com/my-page',
  type: 'article'
});
```

### Generate Structured Data

```javascript
// WebPage schema
globalScope.seoManager.generateWebPageSchema({
  title: 'Page Title',
  description: 'Page description',
  url: 'https://example.com/page'
});

// Article schema
globalScope.seoManager.generateArticleSchema({
  title: 'Article Title',
  description: 'Article description',
  image: '/images/article.jpg',
  datePublished: '2024-01-01',
  dateModified: '2024-01-15',
  author: 'Author Name'
});

// Product schema
globalScope.seoManager.generateProductSchema({
  name: 'Product Name',
  description: 'Product description',
  image: '/images/product.jpg',
  price: '99.99',
  currency: 'USD',
  availability: 'InStock'
});
```

### Generate Sitemap

```javascript
import { generateSitemap } from '../utils/sitemap-generator.js';

const sitemap = generateSitemap([
  { path: 'home', priority: 1.0, changefreq: 'daily' },
  { path: 'about', priority: 0.8, changefreq: 'weekly' },
  { path: 'products', priority: 0.9, changefreq: 'daily' }
]);

console.log(sitemap); // XML sitemap string
```

---

## Forms

### Basic Form Validation

```javascript
import { FormValidator } from '../../utils/form-validator.js';

const form = document.getElementById('myForm');
const validator = new FormValidator(form, {
  liveValidation: true,
  showValidationFeedback: true
});

// Add fields with rules
validator.addField('email', {
  rules: ['required', 'email'],
  messages: {
    required: 'Email is required',
    email: 'Please enter a valid email'
  }
});

validator.addField('password', {
  rules: ['required', 'minLength:8', 'strongPassword'],
  messages: {
    required: 'Password is required',
    minLength: 'Password must be at least 8 characters',
    strongPassword: 'Password must contain uppercase, lowercase, and number'
  }
});

// Custom validator
validator.addCustomValidator('strongPassword', (value) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value);
});

// Validate on submit
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (validator.validateForm()) {
    console.log('Form is valid!');
    // Submit form data
  }
});
```

### Built-in Validators

```javascript
// Available validators:
'required'           // Field must have a value
'email'              // Valid email format
'minLength:8'        // Minimum 8 characters
'maxLength:50'       // Maximum 50 characters
'pattern:^[A-Z]'     // Regex pattern
'number'             // Must be a number
'integer'            // Must be an integer
'positive'           // Must be positive number
'url'                // Valid URL format
'phone'              // Valid phone number
```

### Form Example

```javascript
async getPageContent() {
  return `
    <form id="contactForm">
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" id="name" name="name" required>
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required>
      </div>

      <button type="submit">Submit</button>
    </form>

    <script type="module">
      import { FormValidator } from '../../utils/form-validator.js';

      const form = document.getElementById('contactForm');
      const validator = new FormValidator(form);

      validator.addField('name', {
        rules: ['required', 'minLength:2'],
        messages: {
          required: 'Name is required',
          minLength: 'Name must be at least 2 characters'
        }
      });

      validator.addField('email', {
        rules: ['required', 'email'],
        messages: {
          required: 'Email is required',
          email: 'Invalid email address'
        }
      });

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (validator.validateForm()) {
          // Submit form
          const formData = new FormData(form);
          console.log(Object.fromEntries(formData));
        }
      });
    </script>
  `;
}
```

---

## API Calls

### GET Request

```javascript
import { apiService } from '../../services/api-service.js';

try {
  const data = await apiService.get('https://api.example.com/users');
  console.log(data);
} catch (error) {
  console.error(error.getUserMessage());
}
```

### POST Request

```javascript
try {
  const result = await apiService.post('https://api.example.com/users', {
    name: 'John Doe',
    email: 'john@example.com'
  });
  console.log(result);
} catch (error) {
  console.error(error.getUserMessage());
}
```

### PUT Request

```javascript
try {
  const result = await apiService.put('https://api.example.com/users/123', {
    name: 'Jane Doe'
  });
  console.log(result);
} catch (error) {
  console.error(error.getUserMessage());
}
```

### DELETE Request

```javascript
try {
  const result = await apiService.delete('https://api.example.com/users/123');
  console.log(result);
} catch (error) {
  console.error(error.getUserMessage());
}
```

### Custom API Service

```javascript
import { APIService } from '../../services/api-service.js';

// Create custom API service with different config
const customAPI = new APIService({
  timeout: 5000,        // 5 seconds
  retryAttempts: 3,     // Retry 3 times
  retryDelay: 2000      // 2 seconds between retries
});

const data = await customAPI.get('https://api.example.com/data');
```

### Loading States

```javascript
export class MyPage {
  constructor() {
    this.loading = false;
    this.error = null;
    this.data = null;
  }

  async loadData() {
    try {
      this.loading = true;
      this.data = await apiService.get('https://api.example.com/data');
      this.loading = false;
    } catch (error) {
      this.error = error.getUserMessage();
      this.loading = false;
    }
  }

  async getPageContent() {
    await this.loadData();

    if (this.loading) {
      return `<div class="loading-state">Loading...</div>`;
    }

    if (this.error) {
      return `<div class="error-state">${this.error}</div>`;
    }

    return `<div>${JSON.stringify(this.data)}</div>`;
  }
}
```

---

## CSS Utilities

### Flexbox Utilities

```html
<!-- Flex container -->
<div class="d-flex justify-center align-center gap-md">
  <button>Button 1</button>
  <button>Button 2</button>
</div>

<!-- Available classes: -->
<!-- Display: d-flex, d-grid, d-block, d-none -->
<!-- Justify: justify-start, justify-center, justify-end, justify-between -->
<!-- Align: align-start, align-center, align-end -->
<!-- Gap: gap-sm, gap-md, gap-lg -->
<!-- Direction: flex-row, flex-column -->
```

### Spacing Utilities

```html
<!-- Margin: m-0, m-1, m-2, m-3 -->
<!-- Margin top: mt-1, mt-2 -->
<!-- Margin bottom: mb-1, mb-2 -->
<!-- Padding: p-0, p-1, p-2, p-3 -->
<!-- Padding top: pt-1, pt-2 -->
<!-- Padding bottom: pb-1, pb-2 -->

<div class="p-2 mt-2 mb-2">
  Content with padding and margin
</div>
```

### Text Utilities

```html
<!-- Alignment: text-left, text-center, text-right -->
<!-- Size: text-sm, text-base, text-lg, text-xl -->
<!-- Weight: font-normal, font-semibold, font-bold -->
<!-- Color: text-primary, text-secondary, text-accent, text-error, text-muted -->

<p class="text-center text-lg font-bold text-accent">
  Centered, large, bold, accent text
</p>
```

### Background & Border

```html
<!-- Background: bg-primary, bg-light, bg-white -->
<!-- Border: border, border-top, border-bottom -->
<!-- Border radius: rounded, rounded-full -->
<!-- Shadow: shadow-sm, shadow, shadow-lg, shadow-none -->

<div class="bg-light border rounded shadow p-2">
  Card-like container
</div>
```

### CSS Variables

```css
/* Available CSS variables in :root */
--primary-color: #333;
--secondary-color: #555;
--accent-color: #4CAF50;
--error-color: #f44336;
--warning-color: #ff9800;
--success-color: #4CAF50;
--text-color: #333;
--text-light: #666;
--text-muted: #999;
--bg-color: #fff;
--bg-light: #f5f5f5;
--border-color: #ddd;
--border-radius: 4px;
--shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 4px 8px rgba(0, 0, 0, 0.15);
--transition: all 0.3s ease;

/* Spacing */
--spacing-xs: 0.25rem;
--spacing-sm: 0.5rem;
--spacing-md: 1rem;
--spacing-lg: 1.5rem;
--spacing-xl: 2rem;

/* Font sizes */
--font-size-sm: 0.875rem;
--font-size-base: 1rem;
--font-size-lg: 1.125rem;
--font-size-xl: 1.25rem;
--font-size-2xl: 1.5rem;

/* Usage */
.my-component {
  padding: var(--spacing-md);
  color: var(--accent-color);
  border-radius: var(--border-radius);
}
```

---

## Common Patterns

### Page with API Data

```javascript
export class DataPage {
  paths = ['data'];
  title = 'Data Page';

  constructor() {
    this.loading = false;
    this.error = null;
    this.items = [];
  }

  async loadItems() {
    try {
      this.loading = true;
      this.items = await apiService.get('https://api.example.com/items');
      this.loading = false;
    } catch (error) {
      this.error = error.getUserMessage();
      this.loading = false;
    }
  }

  async getPageContent() {
    await this.loadItems();

    if (this.loading) {
      return `
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      `;
    }

    if (this.error) {
      return `
        <div class="error-container">
          <h2>Error</h2>
          <p>${this.error}</p>
          <button onclick="location.reload()">Try Again</button>
        </div>
      `;
    }

    return `
      <div class="page-container">
        <h1>Items</h1>
        <ul>
          ${this.items.map(item => `
            <li>${item.name}</li>
          `).join('')}
        </ul>
      </div>
    `;
  }
}
```

### Page with Form Submission

```javascript
export class FormPage {
  paths = ['submit'];
  title = 'Submit Form';

  async getPageContent() {
    return `
      <div class="page-container">
        <h1>Submit Form</h1>
        <form id="submitForm">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" name="name">
          </div>
          <button type="submit">Submit</button>
        </form>
        <div id="result"></div>
      </div>

      <script type="module">
        import { FormValidator } from '../../utils/form-validator.js';
        import { apiService } from '../../services/api-service.js';

        const form = document.getElementById('submitForm');
        const result = document.getElementById('result');
        const validator = new FormValidator(form);

        validator.addField('name', {
          rules: ['required', 'minLength:2']
        });

        form.addEventListener('submit', async (e) => {
          e.preventDefault();

          if (!validator.validateForm()) return;

          try {
            const formData = Object.fromEntries(new FormData(form));
            const response = await apiService.post(
              'https://api.example.com/submit',
              formData
            );
            result.innerHTML = '<p class="text-success">Success!</p>';
            form.reset();
          } catch (error) {
            result.innerHTML = \`<p class="text-error">\${error.getUserMessage()}</p>\`;
          }
        });
      </script>
    `;
  }
}
```

### Page with Multiple Components

```javascript
export class DashboardPage {
  paths = ['dashboard'];
  title = 'Dashboard';

  async getPageContent() {
    return `
      <div class="page-container">
        <h1>Dashboard</h1>

        <div class="dashboard-grid">
          <div id="card1"></div>
          <div id="card2"></div>
          <div id="card3"></div>
        </div>
      </div>

      <script type="module">
        import { Card } from '../../components/Card/Card.js';
        import { Button } from '../../components/Button/Button.js';

        // Create cards
        const cards = [
          { title: 'Users', content: '<p>100 users</p>', variant: 'elevated' },
          { title: 'Products', content: '<p>50 products</p>', variant: 'elevated' },
          { title: 'Orders', content: '<p>25 orders</p>', variant: 'elevated' }
        ];

        cards.forEach((config, index) => {
          const card = new Card(config);
          card.mount(\`#card\${index + 1}\`);
        });
      </script>

      <style>
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }
      </style>
    `;
  }
}
```

### Responsive Grid Layout

```html
<div class="grid-container">
  <div class="grid-item">Item 1</div>
  <div class="grid-item">Item 2</div>
  <div class="grid-item">Item 3</div>
</div>

<style>
  .grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    .grid-container {
      grid-template-columns: 1fr;
    }
  }
</style>
```

### Dark Mode Toggle

```javascript
// Toggle dark mode
function toggleDarkMode() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
```

```css
/* Define dark theme in CSS */
[data-theme="dark"] {
  --primary-color: #fff;
  --secondary-color: #ccc;
  --text-color: #fff;
  --text-light: #ccc;
  --bg-color: #1a1a1a;
  --bg-light: #2a2a2a;
  --border-color: #444;
}
```

---

## Constants Reference

```javascript
// Available constants from src/config/constants.js

import {
  API_CONFIG,
  SEO_CONFIG,
  DOM_IDS,
  ROUTES,
  STORAGE_KEYS,
  VALIDATION_PATTERNS
} from '../config/constants.js';

// API Configuration
API_CONFIG.TIMEOUT          // 10000 (10 seconds)
API_CONFIG.RETRY_ATTEMPTS   // 2
API_CONFIG.RETRY_DELAY      // 1000 (1 second)

// SEO Configuration
SEO_CONFIG.DEFAULT_TITLE
SEO_CONFIG.SITE_NAME
SEO_CONFIG.DEFAULT_DESCRIPTION
SEO_CONFIG.DEFAULT_IMAGE

// DOM IDs
DOM_IDS.CONTENT
DOM_IDS.OFFLINE_NAV_COUNT
DOM_IDS.PAGE_RELOADS_COUNT

// Routes
ROUTES.HOME
ROUTES.CAT_FACT
ROUTES.CONTACT_FORM
ROUTES.EXAMPLE

// Storage Keys
STORAGE_KEYS.PAGE_RELOADS
STORAGE_KEYS.IS_AUTHENTICATED

// Validation Patterns
VALIDATION_PATTERNS.EMAIL
VALIDATION_PATTERNS.URL
VALIDATION_PATTERNS.PHONE
```

---

**Need More Help?**

- Read **[COMPONENT_GUIDE.md](COMPONENT_GUIDE.md)** for detailed component documentation
- Read **[STYLING_GUIDE.md](STYLING_GUIDE.md)** for CSS architecture details
- Read **[IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)** for feature overview

---

**Happy Coding!** 🚀
