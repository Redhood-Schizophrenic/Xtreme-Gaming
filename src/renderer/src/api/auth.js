import pb, { handleApiError } from './pocketbase';

// Authentication API service
const authService = {
  /**
   * Login with username and password
   * @param {string} username - The username
   * @param {string} password - The password
   * @returns {Promise<Object>} - The authenticated user data
   */
  async login(username, password) {
    try {
      const authData = await pb.collection('users').authWithPassword(username, password);
      return authData;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Register a new user
   * @param {Object} userData - The user data
   * @returns {Promise<Object>} - The created user data
   */
  async register(userData) {
    try {
      const user = await pb.collection('users').create(userData);
      return user;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Logout the current user
   */
  logout() {
    pb.authStore.clear();
  },

  /**
   * Get the current authenticated user
   * @returns {Object|null} - The current user or null if not authenticated
   */
  getCurrentUser() {
    return pb.authStore.isValid ? pb.authStore.model : null;
  },

  /**
   * Check if the user is authenticated
   * @returns {boolean} - True if authenticated, false otherwise
   */
  isAuthenticated() {
    return pb.authStore.isValid;
  },

  /**
   * Update user profile
   * @param {string} userId - The user ID
   * @param {Object} userData - The user data to update
   * @returns {Promise<Object>} - The updated user data
   */
  async updateProfile(userId, userData) {
    try {
      const user = await pb.collection('users').update(userId, userData);
      return user;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Change user password
   * @param {string} userId - The user ID
   * @param {string} currentPassword - The current password
   * @param {string} newPassword - The new password
   * @returns {Promise<Object>} - The updated user data
   */
  async changePassword(userId, currentPassword, newPassword) {
    try {
      // pdate the password
      const user = await pb.collection('users').update(userId, {
        password: newPassword,
        passwordConfirm: newPassword
      });

      return user;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

export default authService;
