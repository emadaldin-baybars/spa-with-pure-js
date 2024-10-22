import { globalScope } from './global-scope.js';

// Function (event onclick menu) to handle navigation with URL updates and history state
export async function navigate(event, page) {
    event.preventDefault(); // Prevent full page reload
    window.history.pushState({ page }, '', `/${page}`); // Update URL without reloading, adds a new entry to the history stack
    await loadPageContent(page); // Load content dynamically
}

// Function to load page content based on the route
async function loadPageContent(page) {
    globalScope.count = globalScope.count + 1;

    const countValue = document.getElementById("offline-navigation-count-value");
    countValue.innerHTML = globalScope.count;
    
    await globalScope.routes.updatePageContent(page);
}

// Handle the back/forward buttons
window.onpopstate = async (event) => {
    const page = window.location.pathname.substring(1) || window.location.hash.substring(1) || 'home';
    await loadPageContent(page);
};

// On initial page load, determine which page to load (pagepath is equal to #pagepath)
let initialPage = 'home';
if(window.location.pathname.substring(1)) {
    initialPage = window.location.pathname.substring(1);
    if(window.location.pathname.substring(1) == 'index.html') {
        initialPage = 'home';
        window.history.replaceState({ initialPage }, '', `/${initialPage}`);
    }
} else if(window.location.hash.substring(1)) { // It is neecessary when running with http-server (npm package)
    initialPage = window.location.hash.substring(1)
    // If the request come from 404.html page (with "#",  ex. "#contact"), replace history from #page to page
    window.history.replaceState({ initialPage }, '', `/${initialPage}`);
} else {
    initialPage = 'home';
    window.history.replaceState({ initialPage }, '', `/${initialPage}`);
}

loadPageContent(initialPage);

window.navigate = navigate

const pageReloadsCount = sessionStorage.getItem("page-reloads-count");
let pageReloadsCountPlus1;
if(pageReloadsCount) {
    pageReloadsCountPlus1 = (parseInt(pageReloadsCount) + 1).toString();
    sessionStorage.setItem("page-reloads-count", pageReloadsCountPlus1);
} else {
    pageReloadsCountPlus1 = "1";
    sessionStorage.setItem("page-reloads-count", pageReloadsCountPlus1);
}

const countValue = document.getElementById("page-reloads-count-value");
countValue.innerHTML = pageReloadsCountPlus1;