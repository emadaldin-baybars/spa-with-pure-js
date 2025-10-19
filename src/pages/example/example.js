/**
 * Example Page demonstrating component usage
 * This is a template showing how to use reusable components in a page
 */
export class Example {
  paths = ['example'];
  title = 'Component Example - Pure JS SPA';
  description = 'Example page demonstrating how to use reusable components';

  seoConfig = {
    title: 'Component Example - Pure JS SPA',
    description: 'Learn how to use reusable components in your pages',
    keywords: 'components, reusable, javascript, spa',
    type: 'article'
  };

  constructor() {}

  async getPageContent() {
    return `
      <div class="page-container">
        <header class="page-header">
          <h1>Component Usage Example</h1>
          <p class="subtitle">This page demonstrates how to use components in your pages</p>
        </header>

        <section class="example-section">
          <h2>Card Components</h2>
          <div id="card-container" class="card-grid"></div>
        </section>

        <section class="example-section">
          <h2>Button Components</h2>
          <div id="button-container" class="button-group"></div>
        </section>

        <section class="example-section">
          <h2>List Component</h2>
          <div id="list-container"></div>
        </section>
      </div>

      <script type="module">
        import { Card } from '../../components/Card/Card.js';
        import { Button } from '../../components/Button/Button.js';
        import { List } from '../../components/List/List.js';

        // Example 1: Create Cards
        const cards = [
          {
            title: 'Card 1',
            subtitle: 'First example card',
            content: '<p>This is a default card with border.</p>',
            variant: 'default'
          },
          {
            title: 'Card 2',
            subtitle: 'Second example card',
            content: '<p>This is an outlined card.</p>',
            variant: 'outlined'
          },
          {
            title: 'Card 3',
            subtitle: 'Third example card',
            content: '<p>This is an elevated card with hover effect.</p>',
            variant: 'elevated'
          }
        ];

        const cardContainer = document.getElementById('card-container');
        cards.forEach(cardData => {
          const tempDiv = document.createElement('div');
          const card = new Card(cardData);
          card.mount(tempDiv);
          cardContainer.appendChild(card.element);
        });

        // Example 2: Create Buttons
        const buttonContainer = document.getElementById('button-container');
        const buttons = [
          { text: 'Primary', variant: 'primary', onClick: () => alert('Primary clicked!') },
          { text: 'Secondary', variant: 'secondary', onClick: () => alert('Secondary clicked!') },
          { text: 'Danger', variant: 'danger', onClick: () => alert('Danger clicked!') },
          { text: 'Disabled', variant: 'primary', disabled: true }
        ];

        buttons.forEach(btnData => {
          const tempDiv = document.createElement('div');
          const btn = new Button(btnData);
          btn.mount(tempDiv);
          buttonContainer.appendChild(btn.element);
        });

        // Example 3: Create List
        const list = new List({
          items: [
            { id: 1, text: 'First item', icon: '📌' },
            { id: 2, text: 'Second item', icon: '✓' },
            { id: 3, text: 'Third item', icon: '🎯' }
          ],
          variant: 'hoverable',
          onItemClick: (item) => {
            console.log('Clicked:', item);
            alert(\`You clicked: \${item.text}\`);
          }
        });

        list.mount('#list-container');
      </script>

      <style>
        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin: 1.5rem 0;
        }

        .button-group {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          margin: 1.5rem 0;
        }

        .example-section {
          margin: 3rem 0;
        }

        .example-section h2 {
          color: var(--primary-color);
          margin-bottom: 1rem;
        }
      </style>
    `;
  }
}
