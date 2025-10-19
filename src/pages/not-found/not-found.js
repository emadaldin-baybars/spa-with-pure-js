export class NotFound {
  paths = ['not-found'];
  title = '404 - Page Not Found';
  description = 'The page you are looking for could not be found.';

  // SEO Configuration
  seoConfig = {
    title: '404 - Page Not Found',
    description: 'The page you are looking for could not be found.',
    robots: 'noindex, nofollow'
  };

  constructor() { }

  async getPageContent() {
    return `
      <div class="page-container not-found-page">
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for doesn't exist or has been moved.</p>
        <div class="not-found-actions">
          <a href="/home" onclick="navigate(event, 'home')" class="btn">Go to Home</a>
          <button onclick="history.back()" class="btn btn-secondary">Go Back</button>
        </div>
      </div>
    `;
  }
}
  