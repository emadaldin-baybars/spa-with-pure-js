/**
 * Base Component Class
 * Provides a foundation for creating reusable UI components
 */
export class Component {
  constructor(props = {}) {
    this.props = props;
    this.state = {};
    this.element = null;
    this._mounted = false;
  }

  /**
   * Lifecycle: Called when component is created
   */
  onCreate() {
    // Override in child classes
  }

  /**
   * Lifecycle: Called after component is mounted to DOM
   */
  onMount() {
    // Override in child classes
  }

  /**
   * Lifecycle: Called before component is removed from DOM
   */
  onDestroy() {
    // Override in child classes
  }

  /**
   * Update component state and re-render
   * @param {Object} newState - New state values
   */
  setState(newState) {
    this.state = { ...this.state, ...newState };
    if (this._mounted) {
      this.update();
    }
  }

  /**
   * Update component props and re-render
   * @param {Object} newProps - New prop values
   */
  setProps(newProps) {
    this.props = { ...this.props, ...newProps };
    if (this._mounted) {
      this.update();
    }
  }

  /**
   * Render the component (must be implemented by child classes)
   * @returns {string} HTML string
   */
  render() {
    throw new Error('Component must implement render() method');
  }

  /**
   * Mount component to a DOM element
   * @param {HTMLElement|string} target - Target element or selector
   */
  mount(target) {
    const container = typeof target === 'string'
      ? document.querySelector(target)
      : target;

    if (!container) {
      throw new Error(`Mount target not found: ${target}`);
    }

    this.onCreate();
    container.innerHTML = this.render();
    this.element = container.firstElementChild;
    this._mounted = true;
    this.attachEventListeners();
    this.onMount();
  }

  /**
   * Update component (re-render)
   */
  update() {
    if (!this.element) return;

    const parent = this.element.parentElement;
    const oldElement = this.element;

    // Create temporary container for new content
    const temp = document.createElement('div');
    temp.innerHTML = this.render();
    const newElement = temp.firstElementChild;

    // Replace old element with new one
    parent.replaceChild(newElement, oldElement);
    this.element = newElement;

    // Reattach event listeners
    this.attachEventListeners();
  }

  /**
   * Remove component from DOM
   */
  unmount() {
    if (this.element) {
      this.onDestroy();
      this.element.remove();
      this.element = null;
      this._mounted = false;
    }
  }

  /**
   * Attach event listeners (override in child classes)
   */
  attachEventListeners() {
    // Override in child classes to add event listeners
  }

  /**
   * Helper: Create element with classes
   * @param {string} tag - HTML tag name
   * @param {Array<string>} classes - CSS classes
   * @param {string} content - Inner content
   * @returns {string} HTML string
   */
  createElement(tag, classes = [], content = '') {
    const classAttr = classes.length ? ` class="${classes.join(' ')}"` : '';
    return `<${tag}${classAttr}>${content}</${tag}>`;
  }

  /**
   * Helper: Escape HTML to prevent XSS
   * @param {string} str - String to escape
   * @returns {string} Escaped string
   */
  escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}
