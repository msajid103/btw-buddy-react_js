// services/dashboardService.js
import api from './api';

class DashboardService {
  // Get dashboard statistics
  async getDashboardStats() {
    try {
      const response = await api.get('/dashboard/stats/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch dashboard statistics'
      };
    }
  }

  // Get recent activity
  async getRecentActivity(limit = 10) {
    try {
      const response = await api.get(`/dashboard/recent_activity/?limit=${limit}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch recent activity'
      };
    }
  }

  // Get todo items
  async getTodoItems() {
    try {
      const response = await api.get('/dashboard/todo_items/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching todo items:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch todo items'
      };
    }
  }

  // Get current VAT return status
  async getCurrentVATReturn() {
    try {
      const response = await api.get('/dashboard/current_vat_return/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching VAT return status:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch VAT return status'
      };
    }
  }

  // Get available periods for VAT returns
  async getAvailablePeriods() {
    try {
      const response = await api.get('/vat-returns/available_periods/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching available periods:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch available periods'
      };
    }
  }

  // Format currency amount
  formatAmount(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  // Format percentage change
  formatPercentageChange(change) {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change}% vs previous month`;
  }

  // Get period date ranges
  getPeriodDateRange(period) {
    const [quarter, year] = period.split(' ');
    const yearNum = parseInt(year);
    
    const quarterMap = {
      'Q1': { start: `${yearNum}-01-01`, end: `${yearNum}-03-31`, dueDate: `${yearNum}-04-30` },
      'Q2': { start: `${yearNum}-04-01`, end: `${yearNum}-06-30`, dueDate: `${yearNum}-07-31` },
      'Q3': { start: `${yearNum}-07-01`, end: `${yearNum}-09-30`, dueDate: `${yearNum}-10-31` },
      'Q4': { start: `${yearNum}-10-01`, end: `${yearNum}-12-31`, dueDate: `${yearNum + 1}-01-31` }
    };
    
    return quarterMap[quarter] || quarterMap['Q1'];
  }

  // Format date for display
  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}

export default new DashboardService();