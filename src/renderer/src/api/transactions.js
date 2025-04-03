import pb, { handleApiError } from './pocketbase';

// Transactions API service
const transactionsService = {
  /**
   * Get all transactions
   * @param {Object} options - Query options (filter, sort, etc.)
   * @returns {Promise<Array>} - List of transactions
   */
  async getTransactions(options = {}) {
    try {
      const records = await pb.collection('transaction').getList(1, 100, {
        expand: 'session_id,snacks_id,billed_by',
        sort: '-created',
        ...options
      });
      return records;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get a transaction by ID
   * @param {string} id - The transaction ID
   * @returns {Promise<Object>} - The transaction data
   */
  async getTransactionById(id) {
    try {
      const record = await pb.collection('transaction').getOne(id, {
        expand: 'session_id,snacks_id,billed_by'
      });
      return record;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create a new transaction
   * @param {Object} transactionData - The transaction data
   * @returns {Promise<Object>} - The created transaction data
   */
  async createTransaction(transactionData) {
    try {
      // Calculate total amount if not provided
      if (!transactionData.total_amount) {
        const sessionAmount = transactionData.session_amount || 0;
        const snacksTotal = transactionData.snacks_total || 0;
        const discount = transactionData.discount || 0;
        
        transactionData.total_amount = sessionAmount + snacksTotal - discount;
      }
      
      // Set default payment status if not provided
      if (!transactionData.payment_status) {
        transactionData.payment_status = 'Unpaid';
      }
      
      // Set billed_by to current user if not provided
      if (!transactionData.billed_by && pb.authStore.isValid) {
        transactionData.billed_by = pb.authStore.model.id;
      }
      
      const record = await pb.collection('transaction').create(transactionData);
      return record;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update a transaction
   * @param {string} id - The transaction ID
   * @param {Object} transactionData - The transaction data to update
   * @returns {Promise<Object>} - The updated transaction data
   */
  async updateTransaction(id, transactionData) {
    try {
      // Recalculate total amount if any component changes
      if (
        transactionData.session_amount !== undefined ||
        transactionData.snacks_total !== undefined ||
        transactionData.discount !== undefined
      ) {
        // Get current transaction data
        const currentTransaction = await pb.collection('transaction').getOne(id);
        
        // Calculate new total
        const sessionAmount = transactionData.session_amount !== undefined
          ? transactionData.session_amount
          : currentTransaction.session_amount || 0;
          
        const snacksTotal = transactionData.snacks_total !== undefined
          ? transactionData.snacks_total
          : currentTransaction.snacks_total || 0;
          
        const discount = transactionData.discount !== undefined
          ? transactionData.discount
          : currentTransaction.discount || 0;
        
        transactionData.total_amount = sessionAmount + snacksTotal - discount;
      }
      
      const record = await pb.collection('transaction').update(id, transactionData);
      return record;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete a transaction
   * @param {string} id - The transaction ID
   * @returns {Promise<boolean>} - True if deleted successfully
   */
  async deleteTransaction(id) {
    try {
      await pb.collection('transaction').delete(id);
      return true;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get transactions by session
   * @param {string} sessionId - The session ID
   * @returns {Promise<Array>} - List of transactions for the session
   */
  async getTransactionsBySession(sessionId) {
    try {
      const records = await pb.collection('transaction').getList(1, 100, {
        filter: `session_id = "${sessionId}"`,
        expand: 'snacks_id,billed_by',
        sort: '-created'
      });
      return records;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get transactions by date range
   * @param {Date} startDate - The start date
   * @param {Date} endDate - The end date
   * @returns {Promise<Array>} - List of transactions in the date range
   */
  async getTransactionsByDateRange(startDate, endDate) {
    try {
      // Format dates for PocketBase filter
      const start = startDate.toISOString();
      const end = endDate.toISOString();
      
      const records = await pb.collection('transaction').getList(1, 100, {
        filter: `created >= "${start}" && created <= "${end}"`,
        expand: 'session_id,snacks_id,billed_by',
        sort: '-created'
      });
      return records;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get transactions by payment method
   * @param {string} paymentMethod - The payment method
   * @returns {Promise<Array>} - List of transactions with the payment method
   */
  async getTransactionsByPaymentMethod(paymentMethod) {
    try {
      const records = await pb.collection('transaction').getList(1, 100, {
        filter: `payment_method = "${paymentMethod}"`,
        expand: 'session_id,snacks_id,billed_by',
        sort: '-created'
      });
      return records;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get transactions by payment status
   * @param {string} paymentStatus - The payment status
   * @returns {Promise<Array>} - List of transactions with the payment status
   */
  async getTransactionsByPaymentStatus(paymentStatus) {
    try {
      const records = await pb.collection('transaction').getList(1, 100, {
        filter: `payment_status = "${paymentStatus}"`,
        expand: 'session_id,snacks_id,billed_by',
        sort: '-created'
      });
      return records;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get daily sales summary
   * @param {Date} date - The date to get summary for
   * @returns {Promise<Object>} - The daily sales summary
   */
  async getDailySalesSummary(date = new Date()) {
    try {
      // Format date for PocketBase filter
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      const start = startOfDay.toISOString();
      const end = endOfDay.toISOString();
      
      // Get all transactions for the day
      const transactions = await pb.collection('transaction').getFullList({
        filter: `created >= "${start}" && created <= "${end}"`,
        expand: 'session_id,snacks_id'
      });
      
      // Calculate totals
      let totalRevenue = 0;
      let sessionRevenue = 0;
      let snacksRevenue = 0;
      let discountTotal = 0;
      
      transactions.forEach(transaction => {
        totalRevenue += transaction.total_amount || 0;
        sessionRevenue += transaction.session_amount || 0;
        snacksRevenue += transaction.snacks_total || 0;
        discountTotal += transaction.discount || 0;
      });
      
      return {
        date: date.toISOString().split('T')[0],
        transactionCount: transactions.length,
        totalRevenue,
        sessionRevenue,
        snacksRevenue,
        discountTotal,
        transactions
      };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Export transactions to CSV
   * @param {Date} startDate - The start date
   * @param {Date} endDate - The end date
   * @returns {Promise<string>} - CSV string
   */
  async exportToCSV(startDate, endDate) {
    try {
      // Format dates for PocketBase filter
      const start = startDate.toISOString();
      const end = endDate.toISOString();
      
      const transactions = await pb.collection('transaction').getFullList({
        filter: `created >= "${start}" && created <= "${end}"`,
        expand: 'session_id,snacks_id,billed_by'
      });
      
      // Convert records to CSV
      const headers = [
        'Transaction ID',
        'Date',
        'Session Amount',
        'Snacks Total',
        'Discount',
        'Total Amount',
        'Payment Method',
        'Payment Status',
        'Billed By'
      ];
      
      const rows = transactions.map(transaction => [
        transaction.id,
        new Date(transaction.created).toLocaleString(),
        transaction.session_amount || 0,
        transaction.snacks_total || 0,
        transaction.discount || 0,
        transaction.total_amount || 0,
        transaction.payment_method || '',
        transaction.payment_status || '',
        transaction.expand?.billed_by?.name || ''
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

export default transactionsService;
