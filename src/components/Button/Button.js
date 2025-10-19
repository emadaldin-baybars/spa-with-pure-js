import { Component } from '../Component.js';

/**
 * Button Component
 * Reusable button with different variants
 *
 * @example
 * const btn = new Button({
 *   text: 'Click Me',
 *   variant: 'primary',
 *   onClick: () => console.log('Clicked!')
 * });
 * btn.mount('#container');
 */
export class Button extends Component {
  constructor(props = {}) {
    super({
      text: 'Button',
      variant: 'primary', // primary, secondary, danger, success
      size: 'medium', // small, medium, large
      disabled: false,
      icon: null,
      onClick: null,
      ...props
    });
  }

  render() {
    const { text, variant, size, disabled, icon } = this.props;
    const classes = ['btn', `btn-${variant}`, `btn-${size}`];

    if (disabled) classes.push('btn-disabled');

    const iconHTML = icon ? `<span class="btn-icon">${icon}</span>` : '';
    const disabledAttr = disabled ? ' disabled' : '';

    return `
      <button class="${classes.join(' ')}" data-component="button"${disabledAttr}>
        ${iconHTML}
        <span class="btn-text">${this.escapeHTML(text)}</span>
      </button>
    `;
  }

  attachEventListeners() {
    if (this.element && this.props.onClick && !this.props.disabled) {
      this.element.addEventListener('click', this.props.onClick);
    }
  }
}
