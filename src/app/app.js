import { globalScope } from './global-scope.js';
import { DOM_IDS, ROUTES, STORAGE_KEYS } from '../config/constants.js';

/**
 * Navigate to a page with URL updates and history state
 * @param {Event} event - Click event
 * @param {string} page - Page route name
 */
export async function navigate(event, page) {
    try {
        event.preventDefault(); // Prevent full page reload
        window.history.pushState({ page }, '', `/${page}`); // Update URL without reloading
        await loadPageContent(page); // Load content dynamically
    } catch (error) {
        console.error('Navigation error:', error);
        // Show user-friendly error
        showNavigationError(error);
    }
}

/**
 * Load page content based on the route
 * @param {string} page - Page route name
 */
async function loadPageContent(page) {
    try {
        // Update offline navigation count
        globalScope.count = globalScope.count + 1;

        const countValue = document.getElementById(DOM_IDS.OFFLINE_NAV_COUNT);
        if (countValue) {
            countValue.textContent = globalScope.count; // Use textContent for safety
        }

        // Update page content using enhanced routes
        await globalScope.routes.updatePageContent(page);
    } catch (error) {
        console.error('Error loading page content:', error);
        throw error; // Re-throw to be caught by navigate
    }
}

/**
 * Show navigation error to user
 * @param {Error} error - Error object
 */
function showNavigationError(error) {
    const contentDiv = document.getElementById(DOM_IDS.CONTENT);
    if (contentDiv) {
        contentDiv.innerHTML = `
            <div class="error-container" role="alert">
                <h1>Navigation Error</h1>
                <p>Failed to load the page. Please try again.</p>
                <button onclick="location.reload()" class="btn">Reload Page</button>
                <button onclick="window.history.back()" class="btn btn-secondary">Go Back</button>
            </div>
        `;
    }
}

// Handle the back/forward buttons
window.onpopstate = async (event) => {
    try {
        const page = window.location.pathname.substring(1) ||
                     window.location.hash.substring(1) ||
                     ROUTES.HOME;
        await loadPageContent(page);
    } catch (error) {
        console.error('Browser navigation error:', error);
        showNavigationError(error);
    }
};

/**
 * Initialize page on load
 */
function initializePage() {
    try {
        // Determine initial page
        let initialPage = ROUTES.HOME;
        const pathname = window.location.pathname.substring(1);
        const hash = window.location.hash.substring(1);

        if (pathname) {
            initialPage = pathname === 'index.html' ? ROUTES.HOME : pathname;
            window.history.replaceState({ page: initialPage }, '', `/${initialPage}`);
        } else if (hash) {
            // Necessary when running with http-server (npm package)
            // If request comes from 404.html with "#", replace history
            initialPage = hash;
            window.history.replaceState({ page: initialPage }, '', `/${initialPage}`);
        } else {
            window.history.replaceState({ page: initialPage }, '', `/${initialPage}`);
        }

        // Load initial page
        loadPageContent(initialPage);

        // Update page reloads count
        updatePageReloadsCount();
    } catch (error) {
        console.error('Initialization error:', error);
        showNavigationError(error);
    }
}

/**
 * Update page reloads count in session storage and DOM
 */
function updatePageReloadsCount() {
    try {
        const currentCount = sessionStorage.getItem(STORAGE_KEYS.PAGE_RELOADS);
        const newCount = currentCount ? parseInt(currentCount) + 1 : 1;

        sessionStorage.setItem(STORAGE_KEYS.PAGE_RELOADS, newCount.toString());

        const countElement = document.getElementById(DOM_IDS.PAGE_RELOADS_COUNT);
        if (countElement) {
            countElement.textContent = newCount.toString(); // Use textContent for safety
        }
    } catch (error) {
        console.error('Error updating page reloads count:', error);
    }
}

// Expose navigate function globally for onclick handlers
window.navigate = navigate;

// Initialize page on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}