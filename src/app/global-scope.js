import { EnhancedRoutes } from './enhanced-routes.js';
import { SEOManager } from '../utils/seo-manager.js';
import { Home } from '../pages/home/home.js';
import { NotFound } from '../pages/not-found/not-found.js';
import { CatFact } from '../pages/cat-fact/cat-fact.js';
import { ContactForm } from '../pages/contact-form/contact-form.js';
import { Example } from '../pages/example/example.js';

// Initialize SEO Manager
const seoManager = new SEOManager();

// Configure routes with SEO integration
const routes = new EnhancedRoutes(
    [
        new Home(),
        new CatFact(),
        new ContactForm(),
        new Example(),
        new NotFound()
    ],
    {
        // Hook to update SEO tags after navigation
        onAfterNavigate: async (path) => {
            const routeConfig = routes.getRouteConfig(path);

            if (routeConfig && routeConfig.seoConfig) {
                seoManager.updateMetaTags(routeConfig.seoConfig);
                seoManager.generateWebPageSchema(routeConfig.seoConfig);
            }
        },
        // Error handler
        onError: (error, path) => {
            console.error(`Navigation error on "${path}":`, error);
        }
    }
);

export const globalScope = {
    count: -1,
    routes: routes,
    seoManager: seoManager
};