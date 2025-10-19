import { Component } from '../Component.js';

/**
 * List Component
 * Renders a list of items with optional icons and actions
 *
 * @example
 * const list = new List({
 *   items: [
 *     { id: 1, text: 'Item 1', icon: '📌' },
 *     { id: 2, text: 'Item 2', icon: '✓' }
 *   ],
 *   onItemClick: (item) => console.log(item)
 * });
 * list.mount('#container');
 */
export class List extends Component {
  constructor(props = {}) {
    super({
      items: [],
      ordered: false,
      variant: 'default', // default, bordered, hoverable
      onItemClick: null,
      ...props
    });
  }

  render() {
    const { items, ordered, variant } = this.props;
    const tag = ordered ? 'ol' : 'ul';
    const classes = ['list', `list-${variant}`];

    const itemsHTML = items.map((item, index) => {
      const itemClasses = ['list-item'];
      const icon = item.icon ? `<span class="list-item-icon">${item.icon}</span>` : '';
      const text = `<span class="list-item-text">${this.escapeHTML(item.text)}</span>`;

      return `
        <li class="${itemClasses.join(' ')}" data-index="${index}" data-id="${item.id || index}">
          ${icon}
          ${text}
        </li>
      `;
    }).join('');

    return `
      <${tag} class="${classes.join(' ')}" data-component="list">
        ${itemsHTML}
      </${tag}>
    `;
  }

  attachEventListeners() {
    if (this.element && this.props.onItemClick) {
      this.element.querySelectorAll('.list-item').forEach(item => {
        item.addEventListener('click', (e) => {
          const index = parseInt(item.dataset.index);
          this.props.onItemClick(this.props.items[index], index);
        });
      });
    }
  }
}
