import pb, { handleApiError } from './pocketbase';
import { formatISO } from 'date-fns';

// Sessions API service
const sessionsService = {
  /**
   * Get all sessions
   * @param {Object} options - Query options (filter, sort, etc.)
   * @returns {Promise<Array>} - List of sessions
   */
  async getSessions(options = {}) {
    try {
      const records = await pb.collection('sessions').getList(1, 100, {
        expand: 'user_id',
        sort: '-created',
        ...options
      });
      return records;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get a session by ID
   * @param {string} id - The session ID
   * @returns {Promise<Object>} - The session data
   */
  async getSessionById(id) {
    try {
      const record = await pb.collection('sessions').getOne(id, {
        expand: 'user_id'
      });
      return record;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create a new session
   * @param {Object} sessionData - The session data
   * @returns {Promise<Object>} - The created session data
   */
  async createSession(sessionData) {
    try {
      // Ensure start_time is in ISO format
      if (sessionData.start_time && !(sessionData.start_time instanceof Date)) {
        sessionData.start_time = formatISO(new Date(sessionData.start_time));
      } else if (!sessionData.start_time) {
        sessionData.start_time = formatISO(new Date());
      }
      
      // Set default status if not provided
      if (!sessionData.status) {
        sessionData.status = 'Active';
      }
      
      const record = await pb.collection('sessions').create(sessionData);
      return record;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update a session
   * @param {string} id - The session ID
   * @param {Object} sessionData - The session data to update
   * @returns {Promise<Object>} - The updated session data
   */
  async updateSession(id, sessionData) {
    try {
      // Format dates if provided
      if (sessionData.start_time && !(sessionData.start_time instanceof Date)) {
        sessionData.start_time = formatISO(new Date(sessionData.start_time));
      }
      
      if (sessionData.end_time && !(sessionData.end_time instanceof Date)) {
        sessionData.end_time = formatISO(new Date(sessionData.end_time));
      }
      
      const record = await pb.collection('sessions').update(id, sessionData);
      return record;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * End a session
   * @param {string} id - The session ID
   * @param {number} amountBilled - The amount billed for the session
   * @returns {Promise<Object>} - The updated session data
   */
  async endSession(id, amountBilled) {
    try {
      const now = new Date();
      const endTime = formatISO(now);
      
      // Get the session to calculate duration
      const session = await pb.collection('sessions').getOne(id);
      const startTime = new Date(session.start_time);
      const durationMs = now.getTime() - startTime.getTime();
      const durationMinutes = Math.round(durationMs / (1000 * 60));
      
      const record = await pb.collection('sessions').update(id, {
        end_time: endTime,
        duration: durationMinutes,
        amount_billed: amountBilled,
        status: 'Closed'
      });
      
      return record;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete a session
   * @param {string} id - The session ID
   * @returns {Promise<boolean>} - True if deleted successfully
   */
  async deleteSession(id) {
    try {
      await pb.collection('sessions').delete(id);
      return true;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get active sessions
   * @returns {Promise<Array>} - List of active sessions
   */
  async getActiveSessions() {
    try {
      const records = await pb.collection('sessions').getList(1, 100, {
        filter: 'status = "Active"',
        expand: 'user_id',
        sort: '-created'
      });
      return records;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get sessions by user
   * @param {string} userId - The user ID
   * @returns {Promise<Array>} - List of sessions for the user
   */
  async getSessionsByUser(userId) {
    try {
      const records = await pb.collection('sessions').getList(1, 100, {
        filter: `user_id = "${userId}"`,
        expand: 'user_id',
        sort: '-created'
      });
      return records;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Merge sessions
   * @param {string} sourceId - The source session ID to merge from
   * @param {string} targetId - The target session ID to merge into
   * @returns {Promise<Object>} - The merged session data
   */
  async mergeSessions(sourceId, targetId) {
    try {
      // Get both sessions
      const sourceSession = await pb.collection('sessions').getOne(sourceId);
      const targetSession = await pb.collection('sessions').getOne(targetId);
      
      // Calculate total duration
      const sourceDuration = sourceSession.duration || 0;
      const targetDuration = targetSession.duration || 0;
      const totalDuration = sourceDuration + targetDuration;
      
      // Calculate total amount
      const sourceAmount = sourceSession.amount_billed || 0;
      const targetAmount = targetSession.amount_billed || 0;
      const totalAmount = sourceAmount + targetAmount;
      
      // Update target session
      const updatedTarget = await pb.collection('sessions').update(targetId, {
        duration: totalDuration,
        amount_billed: totalAmount
      });
      
      // Mark source session as merged
      await pb.collection('sessions').update(sourceId, {
        status: 'Merged'
      });
      
      return updatedTarget;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Calculate session cost based on duration and pricing
   * @param {number} durationMinutes - The session duration in minutes
   * @param {number} hourlyRate - The hourly rate
   * @param {number} minimumBilling - The minimum billing amount
   * @returns {number} - The calculated cost
   */
  calculateSessionCost(durationMinutes, hourlyRate, minimumBilling = 70) {
    // Convert minutes to hours
    const hours = durationMinutes / 60;
    
    // Calculate cost based on hourly rate
    let cost = hours * hourlyRate;
    
    // Round up to nearest 10
    cost = Math.ceil(cost / 10) * 10;
    
    // Apply minimum billing
    if (cost < minimumBilling) {
      cost = minimumBilling;
    }
    
    return cost;
  }
};

export default sessionsService;
