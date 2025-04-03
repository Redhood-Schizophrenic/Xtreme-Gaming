import pb, { handleApiError } from './pocketbase';

// Inventory API service
const inventoryService = {
  /**
   * Get all inventory items
   * @param {Object} options - Query options (filter, sort, etc.)
   * @returns {Promise<Array>} - List of inventory items
   */
  async getItems(options = {}) {
    try {
      const records = await pb.collection('inventory').getList(1, 100, options);
      return records;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get an inventory item by ID
   * @param {string} id - The item ID
   * @returns {Promise<Object>} - The item data
   */
  async getItemById(id) {
    try {
      const record = await pb.collection('inventory').getOne(id, {
        expand: 'group_id'
      });
      return record;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create a new inventory item
   * @param {Object} itemData - The item data
   * @returns {Promise<Object>} - The created item data
   */
  async createItem(itemData) {
    try {
      const record = await pb.collection('inventory').create(itemData);
      return record;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update an inventory item
   * @param {string} id - The item ID
   * @param {Object} itemData - The item data to update
   * @returns {Promise<Object>} - The updated item data
   */
  async updateItem(id, itemData) {
    try {
      const record = await pb.collection('inventory').update(id, itemData);
      return record;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete an inventory item
   * @param {string} id - The item ID
   * @returns {Promise<boolean>} - True if deleted successfully
   */
  async deleteItem(id) {
    try {
      await pb.collection('inventory').delete(id);
      return true;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update stock count
   * @param {string} id - The item ID
   * @param {number} quantity - The quantity to add (positive) or subtract (negative)
   * @returns {Promise<Object>} - The updated item data
   */
  async updateStock(id, quantity) {
    try {
      // First get the current item to get the current stock count
      const item = await pb.collection('inventory').getOne(id);
      const currentStock = item.stock_count || 0;
      const newStock = currentStock + quantity;
      
      if (newStock < 0) {
        throw new Error('Stock cannot be negative');
      }
      
      // Update the item with the new stock count
      const record = await pb.collection('inventory').update(id, {
        stock_count: newStock
      });
      
      return record;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get items by category
   * @param {string} category - The category to filter by
   * @returns {Promise<Array>} - List of items in the category
   */
  async getItemsByCategory(category) {
    try {
      const records = await pb.collection('inventory').getList(1, 100, {
        filter: `category = "${category}"`
      });
      return records;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get items by location
   * @param {string} location - The location to filter by (Stock or Fridge)
   * @returns {Promise<Array>} - List of items in the location
   */
  async getItemsByLocation(location) {
    try {
      const records = await pb.collection('inventory').getList(1, 100, {
        filter: `stock_location = "${location}"`
      });
      return records;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get items with low stock
   * @param {number} threshold - The stock threshold
   * @returns {Promise<Array>} - List of items with stock below threshold
   */
  async getLowStockItems(threshold = 10) {
    try {
      const records = await pb.collection('inventory').getList(1, 100, {
        filter: `stock_count < ${threshold}`
      });
      return records;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Export inventory to CSV
   * @returns {Promise<string>} - CSV string
   */
  async exportToCSV() {
    try {
      const records = await pb.collection('inventory').getFullList();
      
      // Convert records to CSV
      const headers = ['Item Name', 'Category', 'Sub Category', 'Stock Count', 'Cost Price', 'Selling Price', 'Location', 'Status'];
      const rows = records.map(item => [
        item.item_name,
        item.category,
        item.sub_category,
        item.stock_count,
        item.cost_price,
        item.selling_price,
        item.stock_location,
        item.status
      ]);
      
      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
      
      return csvContent;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

export default inventoryService;
