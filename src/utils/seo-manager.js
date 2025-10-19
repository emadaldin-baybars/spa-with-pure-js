import { SEO_CONFIG } from '../config/constants.js';

/**
 * SEO Manager - Handles dynamic meta tags and structured data for better SEO
 */
export class SEOManager {
  constructor() {
    this.defaultConfig = {
      title: SEO_CONFIG.DEFAULT_TITLE,
      description: SEO_CONFIG.DEFAULT_DESCRIPTION,
      image: SEO_CONFIG.DEFAULT_OG_IMAGE,
      url: window.location.origin,
      siteName: SEO_CONFIG.SITE_NAME,
      author: SEO_CONFIG.DEFAULT_AUTHOR,
      twitterHandle: SEO_CONFIG.DEFAULT_TWITTER_HANDLE,
      type: 'website'
    };
    // Cache window.location.origin for performance
    this.origin = window.location.origin;
  }

  /**
   * Update page meta tags dynamically
   * @param {Object} config - SEO configuration for the current page
   */
  updateMetaTags(config = {}) {
    const seoConfig = { ...this.defaultConfig, ...config };
    const currentUrl = `${this.origin}${window.location.pathname}`;

    // Update title
    document.title = seoConfig.title;

    // Update or create meta tags
    this.setMetaTag('description', seoConfig.description);
    this.setMetaTag('author', seoConfig.author);
    this.setMetaTag('robots', seoConfig.robots || 'index, follow');

    // Keywords (if provided)
    if (seoConfig.keywords) {
      this.setMetaTag('keywords', seoConfig.keywords);
    }

    // Canonical URL
    this.setLinkTag('canonical', currentUrl);

    // Open Graph tags
    this.setMetaTag('og:type', seoConfig.type, 'property');
    this.setMetaTag('og:title', seoConfig.title, 'property');
    this.setMetaTag('og:description', seoConfig.description, 'property');
    this.setMetaTag('og:url', currentUrl, 'property');
    this.setMetaTag('og:image', `${this.origin}${seoConfig.image}`, 'property');
    this.setMetaTag('og:site_name', seoConfig.siteName, 'property');

    // Twitter Card tags
    this.setMetaTag('twitter:card', 'summary_large_image', 'name');
    this.setMetaTag('twitter:title', seoConfig.title, 'name');
    this.setMetaTag('twitter:description', seoConfig.description, 'name');
    this.setMetaTag('twitter:image', `${this.origin}${seoConfig.image}`, 'name');

    if (seoConfig.twitterHandle) {
      this.setMetaTag('twitter:creator', seoConfig.twitterHandle, 'name');
    }
  }

  /**
   * Set or update a meta tag
   * @param {string} name - Meta tag name or property
   * @param {string} content - Meta tag content
   * @param {string} attribute - 'name' or 'property'
   */
  setMetaTag(name, content, attribute = 'name') {
    let metaTag = document.querySelector(`meta[${attribute}="${name}"]`);

    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute(attribute, name);
      document.head.appendChild(metaTag);
    }

    metaTag.setAttribute('content', content);
  }

  /**
   * Set or update a link tag (e.g., canonical)
   * @param {string} rel - Link relation type
   * @param {string} href - Link href
   */
  setLinkTag(rel, href) {
    let linkTag = document.querySelector(`link[rel="${rel}"]`);

    if (!linkTag) {
      linkTag = document.createElement('link');
      linkTag.setAttribute('rel', rel);
      document.head.appendChild(linkTag);
    }

    linkTag.setAttribute('href', href);
  }

  /**
   * Add JSON-LD structured data
   * @param {Object} data - Structured data object
   */
  addStructuredData(data) {
    // Remove existing structured data script if present
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Create new structured data script
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  /**
   * Generate breadcrumb structured data
   * @param {Array} breadcrumbs - Array of {name, url} objects
   */
  generateBreadcrumbs(breadcrumbs) {
    const breadcrumbList = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': crumb.name,
        'item': `${window.location.origin}${crumb.url}`
      }))
    };

    this.addStructuredData(breadcrumbList);
  }

  /**
   * Generate WebPage structured data
   * @param {Object} config - Page configuration
   */
  generateWebPageSchema(config) {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': config.title || this.defaultConfig.title,
      'description': config.description || this.defaultConfig.description,
      'url': `${window.location.origin}${window.location.pathname}`,
      'inLanguage': 'en-US',
      'isPartOf': {
        '@type': 'WebSite',
        'name': this.defaultConfig.siteName,
        'url': window.location.origin
      }
    };

    if (config.datePublished) {
      schema.datePublished = config.datePublished;
    }

    if (config.dateModified) {
      schema.dateModified = config.dateModified;
    }

    this.addStructuredData(schema);
  }

  /**
   * Pre-render optimization hint for search engines
   */
  addPrerendingHints() {
    // Add meta tag to indicate SPA
    this.setMetaTag('fragment', '!');

    // Add preconnect for external APIs
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://catfact.ninja';
    document.head.appendChild(preconnect);
  }
}
