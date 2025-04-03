import pb, { handleApiError } from './pocketbase';

// Users API service
const usersService = {
  /**
   * Get all users
   * @param {Object} options - Query options (filter, sort, etc.)
   * @returns {Promise<Array>} - List of users
   */
  async getUsers(options = {}) {
    try {
      const records = await pb.collection('xtreme_users').getList(1, 50, options);
      return records;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get a user by ID
   * @param {string} id - The user ID
   * @returns {Promise<Object>} - The user data
   */
  async getUserById(id) {
    try {
      const record = await pb.collection('xtreme_users').getOne(id);
      return record;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create a new user
   * @param {Object} userData - The user data
   * @returns {Promise<Object>} - The created user data
   */
  async createUser(userData) {
    try {
      const record = await pb.collection('xtreme_users').create(userData);
      return record;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update a user
   * @param {string} id - The user ID
   * @param {Object} userData - The user data to update
   * @returns {Promise<Object>} - The updated user data
   */
  async updateUser(id, userData) {
    try {
      const record = await pb.collection('xtreme_users').update(id, userData);
      return record;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete a user
   * @param {string} id - The user ID
   * @returns {Promise<boolean>} - True if deleted successfully
   */
  async deleteUser(id) {
    try {
      await pb.collection('xtreme_users').delete(id);
      return true;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get clients (users with role 'Client')
   * @returns {Promise<Array>} - List of clients
   */
  async getClients() {
    try {
      const records = await pb.collection('xtreme_users').getList(1, 100, {
        filter: 'role = "Client"'
      });
      return records;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get staff members (users with role 'Staff')
   * @returns {Promise<Array>} - List of staff members
   */
  async getStaff() {
    try {
      const records = await pb.collection('xtreme_users').getList(1, 100, {
        filter: 'role = "Staff"'
      });
      return records;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get admins (users with role 'Admin')
   * @returns {Promise<Array>} - List of admins
   */
  async getAdmins() {
    try {
      const records = await pb.collection('xtreme_users').getList(1, 100, {
        filter: 'role = "Admin"'
      });
      return records;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update user balance
   * @param {string} id - The user ID
   * @param {number} amount - The amount to add (positive) or subtract (negative)
   * @returns {Promise<Object>} - The updated user data
   */
  async updateBalance(id, amount) {
    try {
      // First get the current user to get the current balance
      const user = await pb.collection('xtreme_users').getOne(id);
      const currentBalance = user.balance || 0;
      const newBalance = currentBalance + amount;
      
      // Update the user with the new balance
      const record = await pb.collection('xtreme_users').update(id, {
        balance: newBalance
      });
      
      return record;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

export default usersService;
