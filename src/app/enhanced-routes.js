/**
 * Enhanced Routes class with error boundaries, loading states, and route guards
 */
export class EnhancedRoutes {
  constructor(classPagesList, config = {}) {
    this.pages = new Map();
    this.routeConfig = new Map();
    this.config = {
      onBeforeNavigate: null,
      onAfterNavigate: null,
      onError: null,
      ...config
    };

    // Register pages and their configurations
    for (let instanceClassPage of classPagesList) {
      const getPageContentFunction = async () => {
        return instanceClassPage.getPageContent();
      };

      for (let path of instanceClassPage.paths) {
        this.pages.set(path, getPageContentFunction);

        // Store route configuration (meta tags, guards, etc.)
        this.routeConfig.set(path, {
          title: instanceClassPage.title || 'Page',
          description: instanceClassPage.description || '',
          requiresAuth: instanceClassPage.requiresAuth || false,
          guards: instanceClassPage.guards || [],
          meta: instanceClassPage.meta || {},
          seoConfig: instanceClassPage.seoConfig || null
        });
      }
    }
  }

  /**
   * Get route configuration
   * @param {string} path - Route path
   * @returns {Object} Route configuration
   */
  getRouteConfig(path) {
    return this.routeConfig.get(path) || this.routeConfig.get('not-found');
  }

  /**
   * Get page content with error handling
   * @param {string} path - Route path
   * @returns {Promise<string>} Page content HTML
   */
  async getPageContent(path) {
    try {
      const getPageContent = this.pages.get(path) || this.pages.get('not-found');
      return await getPageContent();
    } catch (error) {
      console.error(`Error loading page content for "${path}":`, error);

      if (this.config.onError) {
        this.config.onError(error, path);
      }

      return this.getErrorPageContent(error);
    }
  }

  /**
   * Update page content with loading state and error boundary
   * @param {string} path - Route path
   * @returns {Promise<void>}
   */
  async updatePageContent(path) {
    const contentDiv = document.getElementById('content');

    // Run route guards
    const canNavigate = await this.runGuards(path);
    if (!canNavigate) {
      return;
    }

    // Call onBeforeNavigate hook
    if (this.config.onBeforeNavigate) {
      await this.config.onBeforeNavigate(path);
    }

    try {
      // Show loading state
      this.showLoadingState(contentDiv);

      // Load content
      const content = await this.getPageContent(path);

      // Update content
      contentDiv.innerHTML = content;

      // Call onAfterNavigate hook
      if (this.config.onAfterNavigate) {
        await this.config.onAfterNavigate(path);
      }
    } catch (error) {
      console.error('Error updating page content:', error);
      contentDiv.innerHTML = this.getErrorPageContent(error);

      if (this.config.onError) {
        this.config.onError(error, path);
      }
    }
  }

  /**
   * Run route guards
   * @param {string} path - Route path
   * @returns {Promise<boolean>} Can navigate to route
   */
  async runGuards(path) {
    const config = this.getRouteConfig(path);

    if (!config || !config.guards || config.guards.length === 0) {
      return true;
    }

    for (const guard of config.guards) {
      const canProceed = await guard(path, config);

      if (!canProceed) {
        console.warn(`Route guard blocked navigation to "${path}"`);
        return false;
      }
    }

    return true;
  }

  /**
   * Show loading state
   * @param {HTMLElement} container - Container element
   */
  showLoadingState(container) {
    container.innerHTML = `
      <div class="loading-container" role="status" aria-live="polite">
        <div class="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    `;
  }

  /**
   * Get error page content
   * @param {Error} error - Error object
   * @returns {string} Error page HTML
   */
  getErrorPageContent(error) {
    return `
      <div class="error-container" role="alert">
        <h1>Something went wrong</h1>
        <p>We encountered an error while loading this page.</p>
        <details>
          <summary>Error details</summary>
          <pre>${error.message}</pre>
          ${error.stack ? `<pre>${error.stack}</pre>` : ''}
        </details>
        <button onclick="location.reload()">Reload Page</button>
      </div>
    `;
  }

  /**
   * Check if route exists
   * @param {string} path - Route path
   * @returns {boolean}
   */
  hasRoute(path) {
    return this.pages.has(path);
  }

  /**
   * Register a new route dynamically
   * @param {string} path - Route path
   * @param {Function} getContentFunction - Function that returns page content
   * @param {Object} config - Route configuration
   */
  registerRoute(path, getContentFunction, config = {}) {
    this.pages.set(path, getContentFunction);
    this.routeConfig.set(path, {
      title: config.title || 'Page',
      description: config.description || '',
      requiresAuth: config.requiresAuth || false,
      guards: config.guards || [],
      meta: config.meta || {},
      seoConfig: config.seoConfig || null
    });
  }

  /**
   * Get all registered routes
   * @returns {Array<string>} Array of route paths
   */
  getAllRoutes() {
    return Array.from(this.pages.keys());
  }
}

/**
 * Common route guards
 */
export const RouteGuards = {
  /**
   * Authentication guard
   * @param {string} path - Route path
   * @param {Object} config - Route config
   * @returns {boolean}
   */
  authGuard: (path, config) => {
    if (config.requiresAuth) {
      // Check if user is authenticated
      const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';

      if (!isAuthenticated) {
        // Redirect to login
        window.history.pushState({ page: 'login' }, '', '/login');
        return false;
      }
    }

    return true;
  },

  /**
   * Example: Check if user has specific permission
   * @param {Array<string>} permissions - Required permissions
   * @returns {Function}
   */
  permissionGuard: (permissions) => {
    return (path, config) => {
      const userPermissions = JSON.parse(sessionStorage.getItem('permissions') || '[]');

      for (const permission of permissions) {
        if (!userPermissions.includes(permission)) {
          console.warn(`User lacks permission: ${permission}`);
          return false;
        }
      }

      return true;
    };
  }
};
