import { apiService } from '../../services/api-service.js';

export class CatFact {
  paths = ['cat-fact'];
  title = 'Cat Facts - Random Cat Facts';
  description = 'Discover interesting and fun facts about cats. Learn something new about our feline friends!';

  catFact = null;
  error = null;
  loading = true;
  constructorPromise;

  // SEO Configuration
  seoConfig = {
    title: 'Cat Facts - Random Cat Facts',
    description: 'Discover interesting and fun facts about cats. Learn something new about our feline friends!',
    keywords: 'cat facts, cats, feline, animals, pets',
    image: '/assets/cat-facts-og.jpg',
    type: 'article'
  };

  constructor() {
    this.constructorPromise = this.loadCatFact();
  }

  async loadCatFact() {
    try {
      this.loading = true;
      this.error = null;

      const response = await apiService.get('https://catfact.ninja/fact');
      this.catFact = response.fact;
      this.loading = false;
    } catch (error) {
      console.error('Failed to load cat fact:', error);
      this.error = error.getUserMessage ? error.getUserMessage() : 'Failed to load cat fact. Please try again.';
      this.loading = false;
    }
  }

  async getPageContent() {
    await this.constructorPromise;

    if (this.loading) {
      return `
        <div class="page-container">
          <h1>Cat Fact</h1>
          <div class="loading-state">
            <p>Loading cat fact...</p>
          </div>
        </div>
      `;
    }

    if (this.error) {
      return `
        <div class="page-container">
          <h1>Cat Fact</h1>
          <div class="error-state" role="alert">
            <p class="error-message">${this.error}</p>
            <button onclick="location.reload()">Try Again</button>
          </div>
        </div>
      `;
    }

    return `
      <div class="page-container">
        <h1>Cat Fact</h1>
        <div class="cat-fact-content">
          <p class="cat-fact">${this.catFact}</p>
          <p class="hint"><i>The Cat Fact is reset only after the page reloads.</i></p>
        </div>
      </div>
    `;
  }
}