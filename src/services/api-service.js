import { API_CONFIG, HTTP_STATUS } from '../config/constants.js';

/**
 * API Service - Centralized API handling with error management, retries, and timeouts
 */
export class APIService {
  constructor(config = {}) {
    this.baseURL = config.baseURL || '';
    this.timeout = config.timeout || API_CONFIG.TIMEOUT;
    this.retryAttempts = config.retryAttempts || API_CONFIG.RETRY_ATTEMPTS;
    this.retryDelay = config.retryDelay || API_CONFIG.RETRY_DELAY;
    this.headers = config.headers || {
      'Content-Type': 'application/json'
    };
  }

  /**
   * Main request method with error handling, timeout, and retry logic
   * @param {string} url - API endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise<Object>} Response data
   */
  async request(url, options = {}) {
    const fullUrl = this.baseURL ? `${this.baseURL}${url}` : url;
    const config = {
      ...options,
      headers: {
        ...this.headers,
        ...options.headers
      }
    };

    let lastError;

    // Retry logic
    for (let attempt = 0; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await this.fetchWithTimeout(fullUrl, config, this.timeout);
        return await this.handleResponse(response);
      } catch (error) {
        lastError = error;

        // Don't retry on client errors (4xx) or last attempt
        if (error.status >= 400 && error.status < 500) {
          throw error;
        }

        if (attempt < this.retryAttempts) {
          await this.delay(this.retryDelay * (attempt + 1));
          continue;
        }
      }
    }

    throw lastError;
  }

  /**
   * Fetch with timeout
   * @param {string} url - URL to fetch
   * @param {Object} config - Fetch config
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<Response>}
   */
  async fetchWithTimeout(url, config, timeout) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new APIError('Request timeout', 'TIMEOUT', 408);
      }
      throw new APIError('Network error', 'NETWORK_ERROR', 0, error);
    }
  }

  /**
   * Handle response and validate status
   * @param {Response} response - Fetch response
   * @returns {Promise<Object>} Parsed response data
   */
  async handleResponse(response) {
    // Check if response is ok (status 200-299)
    if (!response.ok) {
      const errorData = await this.parseResponse(response);
      throw new APIError(
        errorData.message || `HTTP Error ${response.status}`,
        'HTTP_ERROR',
        response.status,
        errorData
      );
    }

    return await this.parseResponse(response);
  }

  /**
   * Parse response based on content type
   * @param {Response} response - Fetch response
   * @returns {Promise<any>} Parsed data
   */
  async parseResponse(response) {
    const contentType = response.headers.get('content-type');

    try {
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      return await response.text();
    } catch (error) {
      throw new APIError('Failed to parse response', 'PARSE_ERROR', response.status, error);
    }
  }

  /**
   * Delay helper for retry logic
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise<void>}
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * GET request
   * @param {string} url - API endpoint
   * @param {Object} config - Additional config
   * @returns {Promise<Object>}
   */
  async get(url, config = {}) {
    return this.request(url, {
      ...config,
      method: 'GET'
    });
  }

  /**
   * POST request
   * @param {string} url - API endpoint
   * @param {Object} data - Request body
   * @param {Object} config - Additional config
   * @returns {Promise<Object>}
   */
  async post(url, data, config = {}) {
    return this.request(url, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * PUT request
   * @param {string} url - API endpoint
   * @param {Object} data - Request body
   * @param {Object} config - Additional config
   * @returns {Promise<Object>}
   */
  async put(url, data, config = {}) {
    return this.request(url, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  /**
   * DELETE request
   * @param {string} url - API endpoint
   * @param {Object} config - Additional config
   * @returns {Promise<Object>}
   */
  async delete(url, config = {}) {
    return this.request(url, {
      ...config,
      method: 'DELETE'
    });
  }

  /**
   * PATCH request
   * @param {string} url - API endpoint
   * @param {Object} data - Request body
   * @param {Object} config - Additional config
   * @returns {Promise<Object>}
   */
  async patch(url, data, config = {}) {
    return this.request(url, {
      ...config,
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }
}

/**
 * Custom API Error class
 */
export class APIError extends Error {
  constructor(message, code, status, details = null) {
    super(message);
    this.name = 'APIError';
    this.code = code;
    this.status = status;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }

  /**
   * Check if error is a network error
   * @returns {boolean}
   */
  isNetworkError() {
    return this.code === 'NETWORK_ERROR' || this.code === 'TIMEOUT';
  }

  /**
   * Check if error is a client error (4xx)
   * @returns {boolean}
   */
  isClientError() {
    return this.status >= HTTP_STATUS.BAD_REQUEST && this.status < HTTP_STATUS.SERVER_ERROR;
  }

  /**
   * Check if error is a server error (5xx)
   * @returns {boolean}
   */
  isServerError() {
    return this.status >= HTTP_STATUS.SERVER_ERROR;
  }

  /**
   * Get user-friendly error message
   * @returns {string}
   */
  getUserMessage() {
    if (this.isNetworkError()) {
      return 'Network error. Please check your internet connection.';
    }
    if (this.code === 'TIMEOUT') {
      return 'Request timed out. Please try again.';
    }
    if (this.isServerError()) {
      return 'Server error. Please try again later.';
    }
    return this.message || 'An unexpected error occurred.';
  }
}

/**
 * Create a default API service instance
 */
export const apiService = new APIService();
