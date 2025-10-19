# Component Guide

Complete guide to creating and using reusable components in this SPA template.

---

## Table of Contents

1. [Component System Overview](#component-system-overview)
2. [Creating a New Component](#creating-a-new-component)
3. [Using Components in Pages](#using-components-in-pages)
4. [Component Lifecycle](#component-lifecycle)
5. [Component State Management](#component-state-management)
6. [Styling Components](#styling-components)
7. [Best Practices](#best-practices)

---

## Component System Overview

This template includes a lightweight component system built on pure JavaScript with these features:

- **Base Component Class** - Foundation for all components
- **Lifecycle Methods** - onCreate, onMount, onDestroy
- **State Management** - Built-in state handling with setState()
- **Props System** - Pass configuration via props
- **Event Handling** - Easy event listener attachment
- **XSS Protection** - Built-in HTML escaping
- **Reusability** - Use components anywhere in your app

---

## Creating a New Component

### Step 1: Create Component Folder

Create a folder in `src/components/` with your component name:

```bash
src/components/
└── MyComponent/
    ├── MyComponent.js    # Component logic
    └── MyComponent.css   # Component styles
```

### Step 2: Create Component Class

**src/components/MyComponent/MyComponent.js:**

```javascript
import { Component } from '../Component.js';

/**
 * MyComponent - Description of what it does
 *
 * @example
 * const comp = new MyComponent({
 *   title: 'Hello',
 *   onClick: () => console.log('clicked')
 * });
 * comp.mount('#container');
 */
export class MyComponent extends Component {
  constructor(props = {}) {
    super({
      // Default props
      title: 'Default Title',
      content: '',
      variant: 'default',
      onClick: null,
      ...props // Override with passed props
    });

    // Initialize state
    this.state = {
      isActive: false,
      count: 0
    };
  }

  /**
   * Render method - returns HTML string
   */
  render() {
    const { title, content, variant } = this.props;
    const { isActive, count } = this.state;

    return `
      <div class="my-component my-component-${variant}" data-component="my-component">
        <h3 class="my-component-title">${this.escapeHTML(title)}</h3>
        <div class="my-component-content">
          ${content}
        </div>
        <p>Count: ${count}</p>
        <button class="my-component-btn">Click Me</button>
      </div>
    `;
  }

  /**
   * Attach event listeners after mount
   */
  attachEventListeners() {
    const btn = this.element.querySelector('.my-component-btn');

    if (btn) {
      btn.addEventListener('click', () => {
        // Update state (this triggers re-render)
        this.setState({ count: this.state.count + 1 });

        // Call prop callback if provided
        if (this.props.onClick) {
          this.props.onClick(this.state);
        }
      });
    }
  }

  /**
   * Lifecycle: Called when component is created
   */
  onCreate() {
    console.log('Component created');
  }

  /**
   * Lifecycle: Called after mount to DOM
   */
  onMount() {
    console.log('Component mounted');
  }

  /**
   * Lifecycle: Called before removal from DOM
   */
  onDestroy() {
    console.log('Component destroyed');
  }
}
```

### Step 3: Create Component Styles

**src/components/MyComponent/MyComponent.css:**

```css
/* MyComponent Styles */

.my-component {
  padding: 1.5rem;
  border-radius: var(--border-radius);
  background-color: white;
  border: 1px solid var(--border-color);
}

.my-component-title {
  margin: 0 0 1rem;
  color: var(--text-color);
}

.my-component-content {
  margin: 1rem 0;
  color: var(--text-light);
}

.my-component-btn {
  padding: 0.5rem 1rem;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
}

.my-component-btn:hover {
  background-color: #45a049;
}

/* Variants */
.my-component-primary {
  border-color: var(--accent-color);
}

.my-component-secondary {
  border-color: var(--secondary-color);
}
```

### Step 4: Import Styles in Main CSS

**src/styles/main.css:**

```css
/* Import component styles */
@import url('../components/Button/Button.css');
@import url('../components/Card/Card.css');
@import url('../components/MyComponent/MyComponent.css'); /* Add this */
```

---

## Using Components in Pages

### Method 1: Direct Mount

```javascript
import { MyComponent } from '../../components/MyComponent/MyComponent.js';

export class MyPage {
  paths = ['my-page'];

  async getPageContent() {
    return `
      <div class="page-container">
        <h1>My Page</h1>
        <div id="component-container"></div>
      </div>

      <script type="module">
        import { MyComponent } from '../../components/MyComponent/MyComponent.js';

        const component = new MyComponent({
          title: 'Hello World',
          content: 'This is my component',
          onClick: () => console.log('Clicked!')
        });

        component.mount('#component-container');
      </script>
    `;
  }
}
```

### Method 2: Render Multiple Components

```javascript
async getPageContent() {
  return `
    <div class="page-container">
      <h1>Component Grid</h1>
      <div id="grid-container" class="grid"></div>
    </div>

    <script type="module">
      import { Card } from '../../components/Card/Card.js';

      const cards = [
        { title: 'Card 1', content: '<p>Content 1</p>' },
        { title: 'Card 2', content: '<p>Content 2</p>' },
        { title: 'Card 3', content: '<p>Content 3</p>' }
      ];

      const container = document.getElementById('grid-container');

      cards.forEach(cardData => {
        const tempDiv = document.createElement('div');
        const card = new Card(cardData);
        card.mount(tempDiv);
        container.appendChild(card.element);
      });
    </script>

    <style>
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
      }
    </style>
  `;
}
```

### Method 3: Component with State

```javascript
async getPageContent() {
  return `
    <div class="page-container">
      <h1>Interactive Component</h1>
      <div id="interactive-component"></div>
    </div>

    <script type="module">
      import { Button } from '../../components/Button/Button.js';

      let count = 0;
      const btn = new Button({
        text: \`Clicks: \${count}\`,
        variant: 'primary',
        onClick: () => {
          count++;
          btn.setProps({ text: \`Clicks: \${count}\` });
        }
      });

      btn.mount('#interactive-component');
    </script>
  `;
}
```

---

## Component Lifecycle

Components have three lifecycle methods:

### onCreate()

Called when component instance is created, **before** rendering.

**Use for:**
- Initial setup
- Data fetching
- Event subscription

```javascript
onCreate() {
  // Fetch initial data
  this.fetchData();

  // Subscribe to events
  window.addEventListener('resize', this.handleResize);
}
```

### onMount()

Called **after** component is added to DOM.

**Use for:**
- DOM manipulation
- Focus management
- Animations

```javascript
onMount() {
  // Focus an input
  const input = this.element.querySelector('input');
  if (input) input.focus();

  // Start animation
  this.element.classList.add('fade-in');
}
```

### onDestroy()

Called **before** component is removed from DOM.

**Use for:**
- Cleanup
- Unsubscribe events
- Cancel timers

```javascript
onDestroy() {
  // Remove event listeners
  window.removeEventListener('resize', this.handleResize);

  // Clear timers
  if (this.timer) clearTimeout(this.timer);
}
```

---

## Component State Management

### setState(newState)

Updates component state and triggers re-render.

```javascript
constructor(props) {
  super(props);
  this.state = {
    count: 0,
    isActive: false
  };
}

incrementCount() {
  this.setState({ count: this.state.count + 1 });
  // Component automatically re-renders
}
```

### setProps(newProps)

Updates component props and triggers re-render.

```javascript
const btn = new Button({ text: 'Click Me' });
btn.mount('#container');

// Later, update props
btn.setProps({ text: 'Updated!', variant: 'danger' });
```

---

## Styling Components

### Approach 1: Component-Specific Styles

Create a CSS file alongside your component:

```
MyComponent/
├── MyComponent.js
└── MyComponent.css
```

**MyComponent.css:**
```css
.my-component {
  /* Component styles here */
}
```

Import in main.css:
```css
@import url('../components/MyComponent/MyComponent.css');
```

### Approach 2: CSS Variables

Use CSS variables for theming:

```css
.my-component {
  background-color: var(--component-bg, white);
  color: var(--component-text, #333);
  border: 1px solid var(--component-border, #ddd);
}
```

Define in :root (main.css):
```css
:root {
  --component-bg: white;
  --component-text: #333;
  --component-border: #ddd;
}
```

### Approach 3: BEM Naming Convention

Use Block Element Modifier pattern:

```css
/* Block */
.card { }

/* Element */
.card__title { }
.card__content { }

/* Modifier */
.card--primary { }
.card--large { }
```

---

## Best Practices

### 1. Always Escape User Input

```javascript
render() {
  // ✅ Good - Escaped
  return `<div>${this.escapeHTML(userInput)}</div>`;

  // ❌ Bad - XSS vulnerability
  return `<div>${userInput}</div>`;
}
```

### 2. Use Data Attributes for Selection

```javascript
render() {
  return `
    <div class="my-component" data-component="my-component" data-id="${this.props.id}">
      <button data-action="delete">Delete</button>
    </div>
  `;
}

attachEventListeners() {
  const deleteBtn = this.element.querySelector('[data-action="delete"]');
  // ...
}
```

### 3. Clean Up in onDestroy

```javascript
onMount() {
  this.timer = setInterval(() => this.update(), 1000);
  window.addEventListener('resize', this.handleResize);
}

onDestroy() {
  clearInterval(this.timer);
  window.removeEventListener('resize', this.handleResize);
}
```

### 4. Keep Components Small and Focused

Each component should do one thing well.

```javascript
// ✅ Good - Focused components
Button, Card, List, Input

// ❌ Bad - Too much responsibility
SuperDashboardComponentWithEverything
```

### 5. Document Component Props

```javascript
/**
 * Button Component
 *
 * @param {Object} props
 * @param {string} props.text - Button text
 * @param {string} props.variant - Button style (primary, secondary, danger)
 * @param {Function} props.onClick - Click handler
 * @param {boolean} props.disabled - Disabled state
 */
```

### 6. Use Composition Over Inheritance

```javascript
// ✅ Good - Composition
const card = new Card({
  content: `
    ${new Button({ text: 'Action' }).render()}
    ${new List({ items: [...] }).render()}
  `
});

// ❌ Bad - Deep inheritance
class SpecialButtonCard extends ButtonCard extends Card { }
```

### 7. Provide Default Props

```javascript
constructor(props = {}) {
  super({
    variant: 'default',  // Default values
    size: 'medium',
    disabled: false,
    ...props  // Override with user props
  });
}
```

---

## Example: Complete Component

See **src/pages/example/example.js** for a complete working example demonstrating:
- Multiple components on one page
- Component interaction
- State management
- Event handling

---

## Next Steps

1. **Explore Existing Components:**
   - `src/components/Button/Button.js`
   - `src/components/Card/Card.js`
   - `src/components/List/List.js`

2. **Create Your Own Components:**
   - Follow the structure above
   - Add styles
   - Test in a page

3. **Read More Documentation:**
   - `STYLING_GUIDE.md` - Styling best practices
   - `QUICK_REFERENCE.md` - Code snippets
   - `PROJECT_ANALYSIS.md` - Architecture details

---

**Happy Component Building!** 🎉
