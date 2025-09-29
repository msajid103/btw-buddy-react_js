import api from './api';

class VATReturnService {
  // Get all VAT returns for the user
  async getVATReturns() {
    try {
      const response = await api.get('/vat-returns/');
      console.log('Fetched VAT returns:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching VAT returns:', error);
      throw error;
    }
  }

  // Get a specific VAT return by ID
  async getVATReturn(id) {
    try {
      const response = await api.get(`/vat-returns/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching VAT return:', error);
      throw error;
    }
  }

  // Get current period VAT return
  async getCurrentPeriodReturn() {
    try {
      const response = await api.get('/vat-returns/current_period/');
      return response.data;
    } catch (error) {
      console.error('Error fetching current period return:', error);
      throw error;
    }
  }

  // Get available periods for selection
  async getAvailablePeriods() {
    try {
      const response = await api.get('/vat-returns/available_periods/');
      return response.data;
    } catch (error) {
      console.error('Error fetching available periods:', error);
      throw error;
    }
  }

  // Create a new VAT return
  async createVATReturn(data) {
    try {
      const response = await api.post('/vat-returns/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating VAT return:', error);
      throw error;
    }
  }

  // Update a VAT return
  async updateVATReturn(id, data) {
    try {
      const response = await api.patch(`/vat-returns/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating VAT return:', error);
      throw error;
    }
  }

  // Submit a VAT return
  async submitVATReturn(id, data = {}) {
    try {
      const response = await api.post(`/vat-returns/${id}/submit/`, {
        confirmation: true,
        ...data
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting VAT return:', error);
      throw error;
    }
  }

  // Recalculate VAT amounts
  async recalculateVATReturn(id) {
    try {
      const response = await api.post(`/vat-returns/${id}/recalculate/`);
      console.log('Recalculated VAT return:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error recalculating VAT return:', error);
      throw error;
    }
  }

  // Export VAT return as PDF
  async exportVATReturnPDF(id) {
    try {
      const response = await api.get(`/vat-returns/${id}/export_pdf/`);
      return response.data;
    } catch (error) {
      console.error('Error exporting VAT return PDF:', error);
      throw error;
    }
  }

  // Get VAT statistics
  async getVATStatistics() {
    try {
      const response = await api.get('/vat-returns/statistics/');
      return response.data;
    } catch (error) {
      console.error('Error fetching VAT statistics:', error);
      throw error;
    }
  }

  // Get VAT return by period
  async getVATReturnByPeriod(period, year) {
    try {
      const response = await api.get(`/vat-returns/?period=${period}&year=${year}`);
      return response.data.results && response.data.results.length > 0 
        ? response.data.results[0] 
        : null;
    } catch (error) {
      console.error('Error fetching VAT return by period:', error);
      throw error;
    }
  }

  // Create or get VAT return for specific period
  async getOrCreateVATReturn(period, year) {
    try {
      // First try to get existing return
      let vatReturn = await this.getVATReturnByPeriod(period, year);
      
      if (!vatReturn) {
        // Create new return if doesn't exist
        vatReturn = await this.createVATReturn({
          period: period,
          year: year
        });
      }
      
      return vatReturn;
    } catch (error) {
      console.error('Error getting or creating VAT return:', error);
      throw error;
    }
  }

  // Format VAT amount for display
  formatVATAmount(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  // Get dashboard summary (most recent return)
  async getDashboardSummary() {
    try {
      const response = await api.get('/vat-returns/?page_size=1&ordering=-created_at');
      return {
        success: true,
        data: response.data.results?.[0] || null
      };
    } catch (error) {
      console.error('Error fetching VAT return summary:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch VAT summary'
      };
    }
  }

  // Calculate days until due date
  calculateDaysUntilDue(dueDate) {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  // Get status badge configuration
  getStatusBadgeConfig(status) {
    const configs = {
      draft: { color: 'bg-yellow-100 text-yellow-800', text: 'Draft' },
      submitted: { color: 'bg-blue-100 text-blue-800', text: 'Submitted' },
      paid: { color: 'bg-green-100 text-green-800', text: 'Paid' },
      overdue: { color: 'bg-red-100 text-red-800', text: 'Overdue' }
    };
    return configs[status] || configs.draft;
  }

  // Parse period string (e.g., "Q3 2025" -> {period: "Q3", year: 2025})
  parsePeriodString(periodString) {
    const parts = periodString.split(' ');
    return {
      period: parts[0],
      year: parseInt(parts[1])
    };
  }

  // Format period for display
  formatPeriodForDisplay(period, year) {
    return `${period} ${year}`;
  }
}

export default new VATReturnService();