import pb, { handleApiError } from './pocketbase';

// Pricing API service
const pricingService = {
  /**
   * Get all pricing records
   * @param {Object} options - Query options (filter, sort, etc.)
   * @returns {Promise<Array>} - List of pricing records
   */
  async getAllPricing(options = {}) {
    try {
      const records = await pb.collection('pricing').getList(1, 100, {
        expand: 'group_id',
        ...options
      });
      return records;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get pricing by ID
   * @param {string} id - The pricing ID
   * @returns {Promise<Object>} - The pricing data
   */
  async getPricingById(id) {
    try {
      const record = await pb.collection('pricing').getOne(id, {
        expand: 'group_id'
      });
      return record;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get pricing by group ID
   * @param {string} groupId - The group ID
   * @returns {Promise<Object>} - The pricing data
   */
  async getPricingByGroup(groupId) {
    try {
      const records = await pb.collection('pricing').getList(1, 1, {
        filter: `group_id = "${groupId}"`,
        expand: 'group_id'
      });
      
      if (records.items.length > 0) {
        return records.items[0];
      }
      
      return null;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create a new pricing record
   * @param {Object} pricingData - The pricing data
   * @returns {Promise<Object>} - The created pricing data
   */
  async createPricing(pricingData) {
    try {
      const record = await pb.collection('pricing').create(pricingData);
      return record;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update a pricing record
   * @param {string} id - The pricing ID
   * @param {Object} pricingData - The pricing data to update
   * @returns {Promise<Object>} - The updated pricing data
   */
  async updatePricing(id, pricingData) {
    try {
      const record = await pb.collection('pricing').update(id, pricingData);
      return record;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete a pricing record
   * @param {string} id - The pricing ID
   * @returns {Promise<boolean>} - True if deleted successfully
   */
  async deletePricing(id) {
    try {
      await pb.collection('pricing').delete(id);
      return true;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Calculate price based on time and pricing rules
   * @param {Date} startTime - The start time
   * @param {Date} endTime - The end time
   * @param {Object} pricingRules - The pricing rules
   * @returns {number} - The calculated price
   */
  calculatePrice(startTime, endTime, pricingRules) {
    // Calculate duration in minutes
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationMinutes = Math.ceil(durationMs / (1000 * 60));
    const durationHours = durationMinutes / 60;
    
    // Get standard hourly rate
    const hourlyRate = pricingRules.price_per_hour?.standard || 100;
    
    // Check if dynamic pricing applies
    if (pricingRules.dynamic_pricing_rule) {
      const rules = pricingRules.dynamic_pricing_rule;
      
      // Check time-based rules
      const hour = startTime.getHours();
      
      if (rules.hourly && rules.hourly[hour]) {
        return rules.hourly[hour] * durationHours;
      }
      
      // Check duration-based rules
      if (rules.duration) {
        for (const [threshold, rate] of Object.entries(rules.duration)) {
          if (durationHours >= parseFloat(threshold)) {
            return rate * durationHours;
          }
        }
      }
      
      // Check day-based rules
      const day = startTime.getDay(); // 0 = Sunday, 1 = Monday, etc.
      if (rules.daily && rules.daily[day]) {
        return rules.daily[day] * durationHours;
      }
    }
    
    // Default to standard hourly rate
    let price = hourlyRate * durationHours;
    
    // Round up to nearest 10
    price = Math.ceil(price / 10) * 10;
    
    // Apply minimum billing (₹70)
    const minimumBilling = 70;
    if (price < minimumBilling) {
      price = minimumBilling;
    }
    
    return price;
  }
};

export default pricingService;
