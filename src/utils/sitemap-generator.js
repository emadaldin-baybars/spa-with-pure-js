/**
 * Sitemap Generator - Generates sitemap.xml for SEO
 */

export class SitemapGenerator {
  constructor(baseUrl) {
    this.baseUrl = baseUrl || window.location.origin;
    this.urls = [];
  }

  /**
   * Add URL to sitemap
   * @param {Object} config - URL configuration
   */
  addUrl(config) {
    const urlConfig = {
      loc: `${this.baseUrl}${config.path}`,
      lastmod: config.lastmod || new Date().toISOString().split('T')[0],
      changefreq: config.changefreq || 'weekly',
      priority: config.priority || 0.5,
      ...config
    };

    this.urls.push(urlConfig);
  }

  /**
   * Generate sitemap XML
   * @returns {string} Sitemap XML string
   */
  generate() {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    for (const url of this.urls) {
      xml += '  <url>\n';
      xml += `    <loc>${this.escapeXml(url.loc)}</loc>\n`;
      xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
      xml += `    <priority>${url.priority}</priority>\n`;
      xml += '  </url>\n';
    }

    xml += '</urlset>';
    return xml;
  }

  /**
   * Escape XML special characters
   * @param {string} str - String to escape
   * @returns {string} Escaped string
   */
  escapeXml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * Download sitemap as file
   */
  download() {
    const xml = this.generate();
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Generate sitemap from routes
   * @param {Array<string>} routes - Array of route paths
   * @param {Object} priorityMap - Map of route priorities
   */
  static generateFromRoutes(routes, priorityMap = {}) {
    const generator = new SitemapGenerator();

    // Default priorities for common pages
    const defaultPriorities = {
      '/home': 1.0,
      '/': 1.0,
      '/about': 0.8,
      '/contact': 0.7,
      '/cat-fact': 0.6,
      'default': 0.5
    };

    for (const route of routes) {
      if (route === 'not-found' || route === '404') {
        continue; // Skip error pages
      }

      const path = route === 'home' ? '/' : `/${route}`;
      const priority = priorityMap[path] || defaultPriorities[path] || defaultPriorities.default;

      generator.addUrl({
        path: path,
        priority: priority,
        changefreq: priority >= 0.8 ? 'daily' : 'weekly'
      });
    }

    return generator.generate();
  }
}

/**
 * Pre-generated sitemap for static deployment
 * This should be run during build time
 */
export const STATIC_SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://spa-with-pure-javascript.s3-website-us-east-1.amazonaws.com/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://spa-with-pure-javascript.s3-website-us-east-1.amazonaws.com/home</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://spa-with-pure-javascript.s3-website-us-east-1.amazonaws.com/cat-fact</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://spa-with-pure-javascript.s3-website-us-east-1.amazonaws.com/contact.html</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;
