export class Home {
  paths = ['home', 'index.html'];
  title = 'Home - Pure JavaScript SPA';
  description = 'Welcome to our Single Page Application built with pure JavaScript, HTML, and CSS. Fast, modern, and SEO-friendly.';

  // SEO Configuration
  seoConfig = {
    title: 'Home - Pure JavaScript SPA',
    description: 'Welcome to our Single Page Application built with pure JavaScript, HTML, and CSS. Fast, modern, and SEO-friendly.',
    keywords: 'javascript, spa, single page application, web development, vanilla js',
    image: '/assets/home-og.jpg',
    type: 'website'
  };

  constructor() { }

  async getPageContent() {
    return `
      <div class="page-container">
        <header class="page-header">
          <h1>Welcome to the Home Page</h1>
          <p class="subtitle">A modern Single Page Application built with pure JavaScript</p>
        </header>

        <section class="features">
          <h2>Features</h2>
          <ul>
            <li><strong>Client-Side Routing:</strong> Fast navigation without page reloads</li>
            <li><strong>SEO Optimized:</strong> Dynamic meta tags for better search engine visibility</li>
            <li><strong>API Integration:</strong> Robust error handling and loading states</li>
            <li><strong>Form Validation:</strong> Comprehensive validation library included</li>
            <li><strong>Accessible:</strong> Built with ARIA labels and semantic HTML</li>
          </ul>
        </section>

        <section class="cta">
          <p>This SPA demonstrates modern web development practices without frameworks.</p>
          <a href="/cat-fact" onclick="navigate(event, 'cat-fact')" class="btn">Try Cat Facts</a>
        </section>
      </div>
    `;
  }
}
  