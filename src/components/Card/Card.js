import { Component } from '../Component.js';

/**
 * Card Component
 * Reusable card container for content
 *
 * @example
 * const card = new Card({
 *   title: 'Card Title',
 *   content: '<p>Card content here</p>',
 *   footer: '<button>Action</button>'
 * });
 * card.mount('#container');
 */
export class Card extends Component {
  constructor(props = {}) {
    super({
      title: '',
      subtitle: '',
      content: '',
      footer: '',
      image: null,
      variant: 'default', // default, outlined, elevated
      ...props
    });
  }

  render() {
    const { title, subtitle, content, footer, image, variant } = this.props;
    const classes = ['card', `card-${variant}`];

    const imageHTML = image ? `
      <div class="card-image">
        <img src="${image}" alt="${this.escapeHTML(title)}" />
      </div>
    ` : '';

    const headerHTML = title || subtitle ? `
      <div class="card-header">
        ${title ? `<h3 class="card-title">${this.escapeHTML(title)}</h3>` : ''}
        ${subtitle ? `<p class="card-subtitle">${this.escapeHTML(subtitle)}</p>` : ''}
      </div>
    ` : '';

    const footerHTML = footer ? `
      <div class="card-footer">
        ${footer}
      </div>
    ` : '';

    return `
      <div class="${classes.join(' ')}" data-component="card">
        ${imageHTML}
        ${headerHTML}
        <div class="card-content">
          ${content}
        </div>
        ${footerHTML}
      </div>
    `;
  }
}
