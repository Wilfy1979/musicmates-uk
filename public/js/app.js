/**
 * Music Mates UK - App JavaScript
 * Progressive enhancement for auth status and API integration
 */

(function () {
  'use strict';

  const API_BASE = '/api';

  /**
   * Make an API request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise<Object>} Response data
   */
  async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  }

  /**
   * Check authentication status
   * @returns {Promise<Object|null>} User data or null
   */
  async function checkAuth() {
    try {
      const data = await apiRequest('/auth/me');
      return data.user;
    } catch (_error) {
      return null;
    }
  }

  /**
   * Update UI based on auth status
   * @param {Object|null} user - User data or null
   */
  function updateAuthUI(user) {
    const authStatusEl = document.getElementById('auth-status');
    if (!authStatusEl) return;

    if (user) {
      authStatusEl.innerHTML = `
        <span style="color: #4CAF50;">✓ Logged in as ${user.email}</span>
        <button id="logout-btn" class="button" style="margin-left: 10px; padding: 5px 10px; font-size: 0.8rem;">Logout</button>
      `;

      const logoutBtn = document.getElementById('logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
      }
    } else {
      authStatusEl.innerHTML = `
        <a href="signup.html" class="button" style="padding: 5px 10px; font-size: 0.8rem;">Sign Up / Login</a>
      `;
    }
  }

  /**
   * Handle logout
   */
  async function handleLogout() {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
      window.location.reload();
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed. Please try again.');
    }
  }

  /**
   * Initialize the app
   */
  async function init() {
    // Check auth status and update UI
    const user = await checkAuth();
    updateAuthUI(user);

    console.log('Music Mates UK app initialized');
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose API functions globally for other scripts
  window.MusicMatesAPI = {
    checkAuth,
    apiRequest,
  };
})();
