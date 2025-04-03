import pb, { handleApiError } from './pocketbase';

// Groups API service
const groupsService = {
  /**
   * Get all groups
   * @param {Object} options - Query options (filter, sort, etc.)
   * @returns {Promise<Array>} - List of groups
   */
  async getGroups(options = {}) {
    try {
      const records = await pb.collection('groups').getList(1, 100, {
        sort: 'group_name',
        ...options
      });
      return records;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get a group by ID
   * @param {string} id - The group ID
   * @returns {Promise<Object>} - The group data
   */
  async getGroupById(id) {
    try {
      const record = await pb.collection('groups').getOne(id);
      return record;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create a new group
   * @param {Object} groupData - The group data
   * @returns {Promise<Object>} - The created group data
   */
  async createGroup(groupData) {
    try {
      // Set default status if not provided
      if (!groupData.status) {
        groupData.status = 'Active';
      }
      
      const record = await pb.collection('groups').create(groupData);
      return record;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update a group
   * @param {string} id - The group ID
   * @param {Object} groupData - The group data to update
   * @returns {Promise<Object>} - The updated group data
   */
  async updateGroup(id, groupData) {
    try {
      const record = await pb.collection('groups').update(id, groupData);
      return record;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete a group
   * @param {string} id - The group ID
   * @returns {Promise<boolean>} - True if deleted successfully
   */
  async deleteGroup(id) {
    try {
      await pb.collection('groups').delete(id);
      return true;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get active groups
   * @returns {Promise<Array>} - List of active groups
   */
  async getActiveGroups() {
    try {
      const records = await pb.collection('groups').getList(1, 100, {
        filter: 'status = "Active"',
        sort: 'group_name'
      });
      return records;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get pricing for a group
   * @param {string} groupId - The group ID
   * @returns {Promise<Object>} - The pricing data
   */
  async getGroupPricing(groupId) {
    try {
      const records = await pb.collection('pricing').getList(1, 1, {
        filter: `group_id = "${groupId}"`
      });
      
      if (records.items.length > 0) {
        return records.items[0];
      }
      
      // If no pricing found, return default pricing
      return {
        group_id: groupId,
        price_per_hour: { standard: 100 },
        dynamic_pricing_rule: null
      };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update pricing for a group
   * @param {string} groupId - The group ID
   * @param {Object} pricingData - The pricing data
   * @returns {Promise<Object>} - The updated pricing data
   */
  async updateGroupPricing(groupId, pricingData) {
    try {
      // Check if pricing exists for this group
      const records = await pb.collection('pricing').getList(1, 1, {
        filter: `group_id = "${groupId}"`
      });
      
      if (records.items.length > 0) {
        // Update existing pricing
        const pricingId = records.items[0].id;
        const record = await pb.collection('pricing').update(pricingId, {
          ...pricingData,
          group_id: groupId
        });
        return record;
      } else {
        // Create new pricing
        const record = await pb.collection('pricing').create({
          ...pricingData,
          group_id: groupId
        });
        return record;
      }
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get terminals in a group
   * @param {string} groupId - The group ID
   * @returns {Promise<Array>} - List of terminals in the group
   */
  async getGroupTerminals(groupId) {
    try {
      const records = await pb.collection('inventory').getList(1, 100, {
        filter: `group_id = "${groupId}" && category = "Terminal"`,
        sort: 'item_name'
      });
      return records;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

export default groupsService;
