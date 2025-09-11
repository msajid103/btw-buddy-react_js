import api from './api';

export const transactionService = {
  // Fetch transactions with pagination and filters
  async getTransactions(page = 1, filters = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        page_size: '20',
        ...filters
      });

      const response = await api.get(`/transaction/transactions/?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw new Error('Failed to load transactions');
    }
  },

  // Get transaction statistics
  async getTransactionStats(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await api.get(`/transaction/transactions/stats/?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction stats:', error);
      throw error;
    }
  },

  // Get single transaction by ID
  async getTransaction(id) {
    try {
      const response = await api.get(`/transaction/transactions/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw error;
    }
  },

  // Create new transaction
  async createTransaction(transactionData) {
    try {
      const response = await api.post('/transaction/transactions/', transactionData);
      return response.data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  },

  // Update transaction
  async updateTransaction(id, transactionData) {
    try {
      const response = await api.put(`/transaction/transactions/${id}/`, transactionData);
      return response.data;
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  },

  // Delete transaction
  async deleteTransaction(id) {
    try {
      await api.delete(`/transaction/transactions/${id}/`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  },

  // Bulk actions on transactions
  async bulkAction(transactionIds, action, data = {}) {
    try {
      const response = await api.post('/transaction/transactions/bulk_action/', {
        transaction_ids: transactionIds,
        action,
        ...data
      });
      return response.data;
    } catch (error) {
      console.error('Error performing bulk action:', error);
      throw new Error('Bulk action failed');
    }
  },

  // Export transactions
  async exportTransactions(filters = {}, selectedIds = []) {
    try {
      const queryParams = new URLSearchParams(filters);
      if (selectedIds.length > 0) {
        queryParams.set('ids', selectedIds.join(','));
      }

      const response = await api.get(`/transaction/transactions/export/?${queryParams}`, {
        responseType: 'blob',
      });

      // Create download link
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'transactions.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return { success: true };
    } catch (error) {
      console.error('Error exporting transactions:', error);
      throw new Error('Export failed');
    }
  },

  // Import transactions from CSV
  async importTransactionsCSV(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/transaction/transactions/import_csv/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error importing transactions:', error);
      throw new Error('Import failed');
    }
  },

  // Get accounts for dropdown/filter
  async getAccounts() {
    try {
      const response = await api.get('/transaction/accounts/');
      return response.data;
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw error;
    }
  },

  // Get categories for dropdown/filter
  async getCategories() {
    try {
      const response = await api.get('/transaction/categories/');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
};