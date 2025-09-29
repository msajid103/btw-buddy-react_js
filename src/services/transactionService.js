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

      const response = await api.get(`/transactions/?${queryParams}`);
      console.log('Fetched transactions:', response.data);
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
      const response = await api.get(`/transactions/stats/?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction stats:', error);
      throw error;
    }
  },

  // Get single transaction by ID
  async getTransaction(id) {
    try {
      const response = await api.get(`/transactions/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw error;
    }
  },

  // Create new transaction
  async createTransaction(transactionData) {
    try {
      const response = await api.post('/transactions/', transactionData);
      return response.data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  },

  // Update transaction
  async updateTransaction(id, transactionData) {
    try {
      const response = await api.put(`/transactions/${id}/`, transactionData);
      return response.data;
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  },

  // Delete transaction
  async deleteTransaction(id) {
    try {
      await api.delete(`/transactions/${id}/`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  },

  // Bulk actions on transactions
  async bulkAction(transactionIds, action, data = {}) {
    try {
      const response = await api.post('/transactions/bulk_action/', {
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

      const response = await api.get(`/transactions/export/?${queryParams}`, {
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

      const response = await api.post('/transactions/import_csv/', formData, {
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
      const response = await api.get('/accounts/');
      return response.data;
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw error;
    }
  },

  // Get categories for dropdown/filter
  async getCategories() {
    try {
      const response = await api.get('/categories/');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  async getDashboardStats(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await api.get(`/transactions/dashboard_stats/?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard transaction stats:', error);
      throw error;
    }
  },

  // Get recent transactions for dashboard
  async getRecentTransactions(limit = 5) {
    try {
      const response = await api.get(`/transactions/?page_size=${limit}&ordering=-updated_at&status=labeled`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent transactions:', error);
      throw error;
    }
  },

  // Get transaction counts by status
  async getTransactionCounts() {
    try {
      const response = await api.get('/transactions/stats/');
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction counts:', error);
      throw error;
    }
  },
  // Get transactions for a specific period (useful for VAT calculations)
  async getTransactionsByPeriod(period, year) {
    try {
      // Calculate date range based on period
      const dateRanges = {
        'Q1': { start: `${year}-01-01`, end: `${year}-03-31` },
        'Q2': { start: `${year}-04-01`, end: `${year}-06-30` },
        'Q3': { start: `${year}-07-01`, end: `${year}-09-30` },
        'Q4': { start: `${year}-10-01`, end: `${year}-12-31` }
      };

      const range = dateRanges[period];
      if (!range) {
        throw new Error('Invalid period specified');
      }

      const response = await api.get('/transactions/', {
        params: {
          date_after: range.start,
          date_before: range.end,
          page_size: 1000, // Get all transactions for the period
          ordering: 'date'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching transactions by period:', error);
      throw error;
    }
  },

  // Get VAT summary for a specific period
  async getVATSummaryByPeriod(period, year) {
    try {
      const transactions = await this.getTransactionsByPeriod(period, year);

      // Process transactions to calculate VAT totals
      const summary = {
        income: {
          standardRate: { amount: 0, vat: 0 },
          reducedRate: { amount: 0, vat: 0 },
          zeroRate: { amount: 0, vat: 0 }
        },
        expenses: {
          standardRate: { amount: 0, vat: 0 },
          capital: { amount: 0, vat: 0 }
        },
        totals: {
          outputVAT: 0,
          inputVAT: 0,
          netVAT: 0
        }
      };

      const transactionList = transactions.results || transactions;

      transactionList.forEach(transaction => {
        const amount = Math.abs(parseFloat(transaction.amount) || 0);
        const vatAmount = Math.abs(parseFloat(transaction.vat_amount) || 0);
        const vatRate = parseFloat(transaction.vat_rate) || 0;

        if (transaction.transaction_type === 'income') {
          if (vatRate >= 20.5 && vatRate <= 21.5) {
            summary.income.standardRate.amount += amount;
            summary.income.standardRate.vat += vatAmount;
          } else if (vatRate >= 8.5 && vatRate <= 9.5) {
            summary.income.reducedRate.amount += amount;
            summary.income.reducedRate.vat += vatAmount;
          } else if (vatRate <= 0.1) {
            summary.income.zeroRate.amount += amount;
            summary.income.zeroRate.vat += vatAmount;
          }
          summary.totals.outputVAT += vatAmount;
        } else if (transaction.transaction_type === 'expense') {
          if (transaction.category_name?.toLowerCase().includes('equipment') ||
            transaction.category_name?.toLowerCase().includes('capital')) {
            summary.expenses.capital.amount += amount;
            summary.expenses.capital.vat += vatAmount;
          } else {
            summary.expenses.standardRate.amount += amount;
            summary.expenses.standardRate.vat += vatAmount;
          }
          summary.totals.inputVAT += vatAmount;
        }
      });

      summary.totals.netVAT = summary.totals.outputVAT - summary.totals.inputVAT;

      return summary;
    } catch (error) {
      console.error('Error calculating VAT summary:', error);
      throw error;
    }
  },

  // Format currency for display
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0);
  },


};
