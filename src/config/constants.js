/**
 * Application Constants
 * Centralized configuration values
 */

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 2,
  RETRY_DELAY: 1000, // 1 second
  MAX_RETRY_DELAY: 5000 // 5 seconds
};

// SEO Configuration
export const SEO_CONFIG = {
  DEFAULT_TITLE: 'Single Page Application (SPA) With Pure Javascript',
  DEFAULT_DESCRIPTION: 'A modern SPA built with vanilla JavaScript, HTML, and CSS featuring client-side routing and dynamic content loading.',
  SITE_NAME: 'Pure JS SPA',
  DEFAULT_AUTHOR: 'SPA Developer',
  DEFAULT_TWITTER_HANDLE: '@yourhandle',
  DEFAULT_OG_IMAGE: '/assets/og-image.jpg'
};

// Environment URLs
export const ENVIRONMENT = {
  PRODUCTION_URL: 'https://spa-with-pure-javascript.s3-website-us-east-1.amazonaws.com',
  DEVELOPMENT_URL: 'http://localhost:8080',
  CURRENT_ENV: window.location.hostname === 'localhost' ? 'development' : 'production'
};

// Storage Keys
export const STORAGE_KEYS = {
  PAGE_RELOADS: 'page-reloads-count',
  IS_AUTHENTICATED: 'isAuthenticated',
  USER_DATA: 'user',
  PERMISSIONS: 'permissions'
};

// DOM Element IDs
export const DOM_IDS = {
  CONTENT: 'content',
  OFFLINE_NAV_COUNT: 'offline-navigation-count-value',
  PAGE_RELOADS_COUNT: 'page-reloads-count-value'
};

// Route Names
export const ROUTES = {
  HOME: 'home',
  CAT_FACT: 'cat-fact',
  CONTACT_FORM: 'contact-form',
  NOT_FOUND: 'not-found'
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TIMEOUT: 408,
  SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

// Form Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required.',
  EMAIL: 'Please enter a valid email address.',
  MIN_LENGTH: (min) => `Minimum length is ${min} characters.`,
  MAX_LENGTH: (max) => `Maximum length is ${max} characters.`,
  MIN_VALUE: (min) => `Minimum value is ${min}.`,
  MAX_VALUE: (max) => `Maximum value is ${max}.`,
  PATTERN: 'Invalid format.',
  URL: 'Please enter a valid URL.',
  PHONE: 'Please enter a valid phone number.'
};

// App Metadata
export const APP_META = {
  VERSION: '1.0.0',
  NAME: 'SPA with Pure JS',
  DESCRIPTION: 'A production-ready Single Page Application built with vanilla JavaScript'
};
