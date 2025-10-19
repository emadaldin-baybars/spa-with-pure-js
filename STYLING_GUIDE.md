# Styling Guide

Complete guide to styling your SPA for large-scale projects.

---

## Table of Contents

1. [CSS Architecture](#css-architecture)
2. [Naming Conventions](#naming-conventions)
3. [Theming with CSS Variables](#theming-with-css-variables)
4. [Responsive Design](#responsive-design)
5. [Component Styling](#component-styling)
6. [Utility Classes](#utility-classes)
7. [Best Practices](#best-practices)

---

## CSS Architecture

### File Structure

```
src/styles/
├── main.css              # Main stylesheet (imports all others)
├── variables.css         # CSS variables and theme
├── reset.css             # CSS reset/normalize
├── utilities.css         # Utility classes
├── layout.css            # Layout helpers (grid, flex)
└── animations.css        # Reusable animations

src/components/
├── Button/
│   ├── Button.js
│   └── Button.css        # Component-specific styles
├── Card/
│   ├── Card.js
│   └── Card.css
```

### Main CSS Structure

**src/styles/main.css:**

```css
/* CSS Architecture - Load order matters */

/* 1. Variables first */
@import url('./variables.css');

/* 2. Reset/normalize */
@import url('./reset.css');

/* 3. Base styles */
/* ... base styles ... */

/* 4. Layout */
@import url('./layout.css');

/* 5. Components */
@import url('../components/Button/Button.css');
@import url('../components/Card/Card.css');
/* Add more components here */

/* 6. Utilities last */
@import url('./utilities.css');

/* 7. Animations */
@import url('./animations.css');
```

---

## Naming Conventions

### BEM (Block Element Modifier)

Use BEM for predictable, scalable CSS:

```css
/* Block */
.card { }

/* Element (child of block) */
.card__header { }
.card__title { }
.card__content { }
.card__footer { }

/* Modifier (variation of block/element) */
.card--primary { }
.card--large { }
.card__title--highlighted { }
```

**Example Usage:**

```html
<div class="card card--primary">
  <div class="card__header">
    <h3 class="card__title card__title--highlighted">Title</h3>
  </div>
  <div class="card__content">Content here</div>
</div>
```

### Component Prefixing

Prefix component classes to avoid conflicts:

```css
/* Component: Button */
.btn { }
.btn--primary { }
.btn--large { }

/* Component: Card */
.card { }
.card--elevated { }
.card__title { }

/* Component: Form */
.form-group { }
.form-label { }
.form-input { }
```

---

## Theming with CSS Variables

### Define Theme Variables

**src/styles/variables.css:**

```css
:root {
  /* Colors */
  --primary-color: #333;
  --secondary-color: #555;
  --accent-color: #4CAF50;
  --error-color: #f44336;
  --warning-color: #ff9800;
  --success-color: #4CAF50;
  --info-color: #2196F3;

  /* Text */
  --text-color: #333;
  --text-light: #666;
  --text-muted: #999;

  /* Background */
  --bg-color: #fff;
  --bg-light: #f5f5f5;
  --bg-dark: #1a1a1a;

  /* Border */
  --border-color: #ddd;
  --border-radius: 4px;

  /* Shadow */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 4px 8px rgba(0, 0, 0, 0.15);
  --shadow-xl: 0 8px 16px rgba(0, 0, 0, 0.2);

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;

  /* Typography */
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 2rem;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition: 300ms ease;
  --transition-slow: 500ms ease;

  /* Z-index scale */
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
}
```

### Dark Theme

```css
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

**Toggle Dark Theme:**

```javascript
// In your app
document.documentElement.setAttribute('data-theme', 'dark');
```

### Using Variables

```css
.button {
  background-color: var(--accent-color);
  color: white;
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--border-radius);
  transition: var(--transition);
  box-shadow: var(--shadow);
}

.button:hover {
  box-shadow: var(--shadow-lg);
}
```

---

## Responsive Design

### Mobile-First Approach

```css
/* Base styles (mobile) */
.container {
  padding: 1rem;
  max-width: 100%;
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
    max-width: 720px;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container {
    padding: 3rem;
    max-width: 960px;
  }
}

/* Large desktop */
@media (min-width: 1280px) {
  .container {
    max-width: 1200px;
  }
}
```

### Breakpoint Variables

```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}
```

### Common Responsive Patterns

```css
/* Responsive Grid */
.grid {
  display: grid;
  grid-template-columns: 1fr; /* Mobile: 1 column */
  gap: 1rem;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr); /* Tablet: 2 columns */
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr); /* Desktop: 3 columns */
  }
}

/* Or use auto-fit */
.grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

/* Responsive Typography */
.heading {
  font-size: 1.5rem; /* Mobile */
}

@media (min-width: 768px) {
  .heading {
    font-size: 2rem; /* Tablet */
  }
}

@media (min-width: 1024px) {
  .heading {
    font-size: 2.5rem; /* Desktop */
  }
}

/* Or use clamp() */
.heading-fluid {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
}
```

---

## Component Styling

### Scoped Component Styles

Each component should have its own CSS file with scoped styles:

**Button.css:**

```css
/* Button Component */
.btn {
  /* Base styles */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md) var(--spacing-lg);
  border: none;
  border-radius: var(--border-radius);
  font-family: inherit;
  font-size: var(--font-size-base);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  text-decoration: none;
  box-shadow: var(--shadow);
}

/* Variants */
.btn-primary {
  background-color: var(--accent-color);
  color: white;
}

.btn-primary:hover {
  background-color: #45a049;
  box-shadow: var(--shadow-lg);
}

.btn-secondary {
  background-color: var(--secondary-color);
  color: white;
}

/* Sizes */
.btn-small {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-sm);
}

.btn-large {
  padding: var(--spacing-lg) var(--spacing-xl);
  font-size: var(--font-size-lg);
}

/* States */
.btn-disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}
```

---

## Utility Classes

Create reusable utility classes for common patterns:

**src/styles/utilities.css:**

```css
/* Display */
.d-none { display: none; }
.d-block { display: block; }
.d-flex { display: flex; }
.d-grid { display: grid; }

/* Flexbox */
.flex-row { flex-direction: row; }
.flex-column { flex-direction: column; }
.justify-start { justify-content: flex-start; }
.justify-center { justify-content: center; }
.justify-end { justify-content: flex-end; }
.justify-between { justify-content: space-between; }
.align-start { align-items: flex-start; }
.align-center { align-items: center; }
.align-end { align-items: flex-end; }
.gap-sm { gap: var(--spacing-sm); }
.gap-md { gap: var(--spacing-md); }
.gap-lg { gap: var(--spacing-lg); }

/* Spacing */
.m-0 { margin: 0; }
.m-1 { margin: var(--spacing-sm); }
.m-2 { margin: var(--spacing-md); }
.m-3 { margin: var(--spacing-lg); }
.mt-1 { margin-top: var(--spacing-sm); }
.mt-2 { margin-top: var(--spacing-md); }
.mb-1 { margin-bottom: var(--spacing-sm); }
.mb-2 { margin-bottom: var(--spacing-md); }

.p-0 { padding: 0; }
.p-1 { padding: var(--spacing-sm); }
.p-2 { padding: var(--spacing-md); }
.p-3 { padding: var(--spacing-lg); }
.pt-1 { padding-top: var(--spacing-sm); }
.pt-2 { padding-top: var(--spacing-md); }
.pb-1 { padding-bottom: var(--spacing-sm); }
.pb-2 { padding-bottom: var(--spacing-md); }

/* Text */
.text-left { text-align: left; }
.text-center { text-align: center; }
.text-right { text-align: right; }
.text-sm { font-size: var(--font-size-sm); }
.text-base { font-size: var(--font-size-base); }
.text-lg { font-size: var(--font-size-lg); }
.text-xl { font-size: var(--font-size-xl); }
.font-bold { font-weight: 700; }
.font-semibold { font-weight: 600; }
.font-normal { font-weight: 400; }

/* Colors */
.text-primary { color: var(--primary-color); }
.text-secondary { color: var(--secondary-color); }
.text-accent { color: var(--accent-color); }
.text-error { color: var(--error-color); }
.text-success { color: var(--success-color); }
.text-muted { color: var(--text-muted); }

.bg-primary { background-color: var(--primary-color); }
.bg-light { background-color: var(--bg-light); }
.bg-white { background-color: white; }

/* Borders */
.border { border: 1px solid var(--border-color); }
.border-top { border-top: 1px solid var(--border-color); }
.border-bottom { border-bottom: 1px solid var(--border-color); }
.rounded { border-radius: var(--border-radius); }
.rounded-full { border-radius: 9999px; }

/* Shadow */
.shadow-sm { box-shadow: var(--shadow-sm); }
.shadow { box-shadow: var(--shadow); }
.shadow-lg { box-shadow: var(--shadow-lg); }
.shadow-none { box-shadow: none; }
```

**Usage:**

```html
<div class="d-flex justify-center align-center gap-md p-2 bg-light rounded shadow">
  <span class="text-accent font-bold">Hello!</span>
</div>
```

---

## Best Practices

### 1. Use CSS Variables for Consistency

```css
/* ✅ Good */
.button {
  padding: var(--spacing-md);
  color: var(--accent-color);
}

/* ❌ Bad */
.button {
  padding: 16px;
  color: #4CAF50;
}
```

### 2. Mobile-First Responsive Design

```css
/* ✅ Good - Mobile first */
.container {
  width: 100%;
}

@media (min-width: 768px) {
  .container {
    width: 750px;
  }
}

/* ❌ Bad - Desktop first */
.container {
  width: 1200px;
}

@media (max-width: 768px) {
  .container {
    width: 100%;
  }
}
```

### 3. Avoid Magic Numbers

```css
/* ✅ Good */
.element {
  margin: var(--spacing-md);
  z-index: var(--z-modal);
}

/* ❌ Bad */
.element {
  margin: 17px;
  z-index: 9999;
}
```

### 4. Use Logical Properties

```css
/* ✅ Good - Works with RTL */
.element {
  margin-inline-start: 1rem;
  padding-block: 1rem;
}

/* ❌ Bad - Fixed direction */
.element {
  margin-left: 1rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
}
```

### 5. Prefer Classes Over IDs

```css
/* ✅ Good */
.header { }
.nav-item { }

/* ❌ Bad */
#header { }
#nav-item { }
```

### 6. Avoid Deep Nesting

```css
/* ✅ Good - Flat structure */
.card { }
.card__header { }
.card__title { }

/* ❌ Bad - Deep nesting */
.card .header .title { }
```

### 7. Use Semantic Class Names

```css
/* ✅ Good */
.btn-primary { }
.card-elevated { }
.text-highlighted { }

/* ❌ Bad */
.blue-button { }
.box-with-shadow { }
.big-text { }
```

---

## Quick Tips

1. **Performance:** Use `transform` and `opacity` for animations (GPU-accelerated)
2. **Accessibility:** Always provide `:focus` styles
3. **Organization:** Group related styles together
4. **Documentation:** Comment complex CSS logic
5. **Testing:** Test in multiple browsers and screen sizes

---

**Next Steps:**

- Read `COMPONENT_GUIDE.md` for component styling
- Check `main.css` for current variable definitions
- Explore existing component CSS files for examples

---

**Happy Styling!** 🎨
