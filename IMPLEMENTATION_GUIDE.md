# Implementation Guide

This document provides a comprehensive overview of all features implemented in this Pure JavaScript SPA template.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Core Features](#core-features)
3. [File Structure](#file-structure)
4. [Key Systems](#key-systems)
5. [Getting Started](#getting-started)
6. [Development Workflow](#development-workflow)

---

## Project Overview

This is a **production-ready** Single Page Application template built with pure HTML, CSS, and JavaScript. It includes:

- ✅ Client-side routing with error boundaries
- ✅ Component system with lifecycle management
- ✅ SEO optimization with dynamic meta tags
- ✅ API service with retry logic and timeouts
- ✅ Form validation library
- ✅ Docker setup with hot reload
- ✅ Security headers and XSS prevention
- ✅ Comprehensive documentation

---

## Core Features

### 1. Enhanced Routing System

**Location:** `src/app/enhanced-routes.js`

**Features:**
- Client-side navigation without page reloads
- Error boundaries to catch navigation errors
- Loading states during page transitions
- Route guards for authentication/authorization
- Navigation hooks (onBeforeNavigate, onAfterNavigate)
- 404 handling for unknown routes

**Usage:**
```javascript
const routes = new EnhancedRoutes([
  new Home(),
  new CatFact(),
  new ContactForm(),
  new Example(),
  new NotFound()
], {
  onBeforeNavigate: async (path) => {
    // Called before navigation
  },
  onAfterNavigate: async (path) => {
    // Called after navigation
  }
});
```

### 2. SEO Manager

**Location:** `src/utils/seo-manager.js`

**Features:**
- Dynamic meta tag updates
- Open Graph tags for social media
- Twitter Card support
- JSON-LD structured data generation
- Sitemap generator
- Canonical URL management

**Usage:**
```javascript
seoManager.updateMetaTags({
  title: 'My Page Title',
  description: 'Page description',
  keywords: 'keyword1, keyword2',
  image: '/images/og-image.jpg'
});

seoManager.generateWebPageSchema({
  title: 'My Page',
  description: 'Description',
  url: 'https://example.com/my-page'
});
```

### 3. API Service

**Location:** `src/services/api-service.js`

**Features:**
- Centralized HTTP request handling
- Automatic retry on failure (configurable attempts)
- Request timeout handling (default: 10 seconds)
- User-friendly error messages
- JSON parsing with error handling

**Usage:**
```javascript
import { apiService } from '../../services/api-service.js';

// GET request
const data = await apiService.get('https://api.example.com/data');

// POST request
const result = await apiService.post('https://api.example.com/submit', {
  name: 'John',
  email: 'john@example.com'
});

// Error handling
try {
  const data = await apiService.get('https://api.example.com/data');
} catch (error) {
  console.error(error.getUserMessage()); // User-friendly error
  console.error(error.code); // Error code: TIMEOUT, NETWORK_ERROR, etc.
}
```

### 4. Form Validator

**Location:** `src/utils/form-validator.js`

**Features:**
- Real-time field validation
- Built-in validators (required, email, minLength, maxLength, pattern, etc.)
- Custom validators support
- ARIA accessibility attributes
- Error message display
- Valid/invalid visual feedback

**Built-in Validators:**
- `required` - Field must have a value
- `email` - Valid email format
- `minLength:n` - Minimum character length
- `maxLength:n` - Maximum character length
- `pattern:regex` - Custom regex pattern
- `number` - Must be a number
- `integer` - Must be an integer
- `positive` - Must be positive number
- `url` - Valid URL format
- `phone` - Valid phone number

**Usage:**
```javascript
import { FormValidator } from '../../utils/form-validator.js';

const validator = new FormValidator(form, {
  liveValidation: true,
  showValidationFeedback: true,
  scrollToFirstError: true
});

validator.addField('email', {
  rules: ['required', 'email'],
  messages: {
    required: 'Email is required',
    email: 'Please enter a valid email'
  }
});

validator.addField('password', {
  rules: ['required', 'minLength:8'],
  messages: {
    required: 'Password is required',
    minLength: 'Password must be at least 8 characters'
  }
});

// Custom validator
validator.addCustomValidator('strongPassword', (value) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value);
});

// Validate on submit
if (validator.validateForm()) {
  // Form is valid, submit
}
```

### 5. Component System

**Location:** `src/components/Component.js`

**Features:**
- Base Component class with lifecycle methods
- State management with setState()
- Props system for configuration
- Event handling
- XSS protection with escapeHTML()
- Automatic re-rendering on state changes

**Lifecycle Methods:**
- `onCreate()` - Called when component is created
- `onMount()` - Called after component is added to DOM
- `onDestroy()` - Called before component is removed

**Example Components:**
- **Button** (`src/components/Button/`) - Reusable button with variants
- **Card** (`src/components/Card/`) - Card layout with header, content, footer
- **List** (`src/components/List/`) - List with icons and click handlers

**Usage:**
```javascript
import { Component } from '../Component.js';

export class MyComponent extends Component {
  constructor(props = {}) {
    super({
      title: 'Default Title',
      ...props
    });

    this.state = {
      count: 0
    };
  }

  render() {
    return `
      <div class="my-component">
        <h3>${this.escapeHTML(this.props.title)}</h3>
        <p>Count: ${this.state.count}</p>
        <button data-action="increment">Increment</button>
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

// Usage
const component = new MyComponent({ title: 'Hello World' });
component.mount('#container');
```

### 6. Configuration Management

**Location:** `src/config/constants.js`

**Features:**
- Centralized configuration
- No magic numbers in code
- Easy to update settings

**Constants:**
```javascript
// API Configuration
API_CONFIG = {
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 2,
  RETRY_DELAY: 1000
}

// SEO Configuration
SEO_CONFIG = {
  DEFAULT_TITLE: 'Single Page Application (SPA) With Pure Javascript',
  SITE_NAME: 'Pure JS SPA',
  DEFAULT_DESCRIPTION: '...',
  DEFAULT_IMAGE: '/assets/og-image.jpg'
}

// DOM IDs
DOM_IDS = {
  CONTENT: 'content',
  OFFLINE_NAV_COUNT: 'offline-navigation-count-value',
  PAGE_RELOADS_COUNT: 'page-reloads-count-value'
}

// Routes
ROUTES = {
  HOME: 'home',
  CAT_FACT: 'cat-fact',
  CONTACT_FORM: 'contact-form',
  EXAMPLE: 'example'
}
```

---

## File Structure

```
spa-with-pure-js/
├── src/
│   ├── index.html              # Main entry point
│   ├── styles/
│   │   └── main.css           # Global styles + CSS variables
│   ├── components/             # Reusable components
│   │   ├── Component.js       # Base component class
│   │   ├── Button/
│   │   │   ├── Button.js
│   │   │   └── Button.css
│   │   ├── Card/
│   │   │   ├── Card.js
│   │   │   └── Card.css
│   │   └── List/
│   │       ├── List.js
│   │       └── List.css
│   ├── pages/                  # Page components
│   │   ├── home/home.js
│   │   ├── cat-fact/cat-fact.js
│   │   ├── contact-form/contact-form.js
│   │   ├── example/example.js  # Component usage example
│   │   └── not-found/not-found.js
│   ├── app/                    # Core application logic
│   │   ├── app.js             # Entry point & navigation
│   │   ├── enhanced-routes.js # Routing with guards
│   │   └── global-scope.js    # Global state
│   ├── services/               # Services
│   │   └── api-service.js     # API handling
│   ├── utils/                  # Utilities
│   │   ├── seo-manager.js     # SEO management
│   │   ├── form-validator.js  # Form validation
│   │   └── sitemap-generator.js
│   └── config/
│       └── constants.js       # Configuration constants
├── docker-compose.yml          # Docker configuration with watch
├── Dockerfile                  # Docker image
├── nginx.conf                  # Nginx with security headers
├── package.json               # NPM dependencies
├── .gitignore                 # Git ignore rules
├── favicon.svg                # Favicon
├── README.md                  # Main documentation
├── COMPONENT_GUIDE.md         # Component system guide
├── STYLING_GUIDE.md           # CSS architecture guide
├── PROJECT_ANALYSIS.md        # Initial project analysis
├── CODE_REVIEW.md             # Code review findings
├── DOCKER_FIX.md              # Docker troubleshooting
└── IMPLEMENTATION_GUIDE.md    # This file
```

---

## Key Systems

### Error Handling

**Application-level:**
- Error boundaries in routing system
- Graceful error pages with user-friendly messages
- Console logging for debugging
- Error recovery strategies

**API-level:**
- Custom APIError class with error codes
- User-friendly error messages
- Network error handling
- Timeout handling

**Form-level:**
- Field-level validation errors
- Real-time validation feedback
- ARIA attributes for accessibility

### Security

**XSS Prevention:**
- HTML escaping in components (`escapeHTML()`)
- `textContent` instead of `innerHTML` where appropriate
- Form input sanitization

**HTTP Security Headers:**
```nginx
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'; ...
```

**Docker Security:**
- Non-root user (nginx)
- Health checks
- Minimal attack surface
- Proper file permissions

### Performance

**Optimizations:**
- Client-side routing (no page reloads)
- CSS variables for theming
- Lazy loading of page content
- Minimal JavaScript bundle (no frameworks)
- Gzip compression in nginx
- Browser caching headers

### Accessibility

**Features:**
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Skip to content link
- Form error announcements
- Reduced motion support

---

## Getting Started

### Prerequisites

- Docker (recommended) or Node.js 16+

### Installation

```bash
# Clone repository
git clone https://github.com/elidaniel92/spa-with-pure-js.git
cd spa-with-pure-js

# Option 1: Run with Docker (recommended)
docker-compose up

# Option 2: Run with npm
npm install
npm start
```

### Access Application

Open http://localhost:8080 in your browser

---

## Development Workflow

### 1. Creating a New Page

```javascript
// src/pages/my-page/my-page.js
export class MyPage {
  paths = ['my-page'];
  title = 'My Page Title';
  description = 'Page description for SEO';

  seoConfig = {
    title: 'My Page - SPA',
    description: 'This is my custom page',
    keywords: 'custom, page, spa'
  };

  async getPageContent() {
    return `
      <div class="page-container">
        <h1>Welcome to My Page</h1>
      </div>
    `;
  }
}
```

**Register in global-scope.js:**
```javascript
import { MyPage } from '../pages/my-page/my-page.js';

const routes = new EnhancedRoutes([
  new Home(),
  new MyPage(), // Add here
  new NotFound()
]);
```

**Add navigation link:**
```html
<nav>
  <a href="/my-page" onclick="navigate(event, 'my-page')">My Page</a>
</nav>
```

### 2. Creating a New Component

**Step 1:** Create folder `src/components/MyComponent/`

**Step 2:** Create `MyComponent.js`:
```javascript
import { Component } from '../Component.js';

export class MyComponent extends Component {
  constructor(props = {}) {
    super({ title: 'Default', ...props });
    this.state = { count: 0 };
  }

  render() {
    return `
      <div class="my-component">
        <h3>${this.escapeHTML(this.props.title)}</h3>
        <p>Count: ${this.state.count}</p>
        <button data-action="increment">Increment</button>
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

**Step 3:** Create `MyComponent.css`:
```css
.my-component {
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
}
```

**Step 4:** Import CSS in `main.css`:
```css
@import url('../components/MyComponent/MyComponent.css');
```

### 3. Using Components in Pages

```javascript
export class MyPage {
  async getPageContent() {
    return `
      <div class="page-container">
        <div id="component-container"></div>
      </div>

      <script type="module">
        import { MyComponent } from '../../components/MyComponent/MyComponent.js';

        const component = new MyComponent({ title: 'Hello' });
        component.mount('#component-container');
      </script>
    `;
  }
}
```

### 4. Docker Hot Reload

```bash
# Start with watch mode
docker-compose watch

# Edit files in src/ - changes sync automatically!
```

### 5. npm Scripts

```bash
# Development server
npm start

# Linting
npm run lint

# Formatting
npm run format

# Docker
npm run docker:build
npm run docker:up
npm run docker:watch
```

---

## Best Practices

### 1. Always Escape User Input
```javascript
// ✅ Good
return `<div>${this.escapeHTML(userInput)}</div>`;

// ❌ Bad (XSS vulnerability)
return `<div>${userInput}</div>`;
```

### 2. Use Constants Instead of Magic Numbers
```javascript
// ✅ Good
timeout: API_CONFIG.TIMEOUT

// ❌ Bad
timeout: 10000
```

### 3. Clean Up Resources
```javascript
onMount() {
  this.timer = setInterval(() => this.update(), 1000);
}

onDestroy() {
  clearInterval(this.timer); // Always clean up
}
```

### 4. Handle Errors Gracefully
```javascript
try {
  const data = await apiService.get(url);
  // Use data
} catch (error) {
  // Show user-friendly error
  console.error(error.getUserMessage());
}
```

### 5. Use CSS Variables for Consistency
```css
/* ✅ Good */
.button {
  color: var(--accent-color);
  padding: var(--spacing-md);
}

/* ❌ Bad */
.button {
  color: #4CAF50;
  padding: 16px;
}
```

---

## Additional Resources

- **[README.md](README.md)** - Quick start and template usage
- **[COMPONENT_GUIDE.md](COMPONENT_GUIDE.md)** - Component system details
- **[STYLING_GUIDE.md](STYLING_GUIDE.md)** - CSS architecture
- **[PROJECT_ANALYSIS.md](PROJECT_ANALYSIS.md)** - Initial analysis
- **[CODE_REVIEW.md](CODE_REVIEW.md)** - Code review findings

---

**Happy Coding!** 🚀
