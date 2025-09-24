// services/receiptService.js
import api from "./api";

class ReceiptService {
  // Get all receipts with filtering and pagination
  async getReceipts(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      // Add filters to params
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });

      const response = await api.get(`/receipts/?${params.toString()}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching receipts:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch receipts'
      };
    }
  }

  // Upload receipt(s) - handle multiple files with metadata
  async uploadReceipts(files, metadata = {}) {
    try {
      const uploadPromises = Array.from(files).map(file => {
        const formData = new FormData();
        formData.append('file', file);
        
        // Add metadata if provided
        Object.keys(metadata).forEach(key => {
          if (metadata[key] !== undefined && metadata[key] !== null && metadata[key] !== '') {
            formData.append(key, metadata[key]);
          }
        });

        return api.post('/receipts/upload/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      });

      const responses = await Promise.all(uploadPromises);
      
      return {
        success: true,
        data: responses.map(response => response.data),
        message: `${responses.length} receipt(s) uploaded successfully`
      };
    } catch (error) {
      console.error('Error uploading receipts:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.response?.data?.message || 'Failed to upload receipts'
      };
    }
  }

  // Get receipt statistics
  async getStats() {
    try {
      const response = await api.get('/receipts/stats/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch statistics'
      };
    }
  }

  // Get recent uploads
  async getRecentUploads() {
    try {
      const response = await api.get('/receipts/recent_uploads/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching recent uploads:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch recent uploads'
      };
    }
  }

  // Link receipt to transaction
  async linkReceiptToTransaction(receiptId, transactionId) {
    try {
      const response = await api.post(`/receipts/${receiptId}/link_transaction/`, {
        transaction_id: transactionId
      });
      return {
        success: true,
        data: response.data,
        message: 'Receipt linked successfully'
      };
    } catch (error) {
      console.error('Error linking receipt:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.response?.data?.message || 'Failed to link receipt'
      };
    }
  }

  // Bulk link receipts to transaction
  async bulkLinkReceipts(receiptIds, transactionId) {
    try {
      const response = await api.post('/receipts/bulk_link/', {
        receipt_ids: receiptIds,
        transaction_id: transactionId
      });
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Receipts linked successfully'
      };
    } catch (error) {
      console.error('Error bulk linking receipts:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.response?.data?.message || 'Failed to link receipts'
      };
    }
  }

  // Unlink receipt from transaction
  async unlinkReceipt(receiptId) {
    try {
      const response = await api.post(`/receipts/${receiptId}/unlink_transaction/`);
      return {
        success: true,
        data: response.data,
        message: 'Receipt unlinked successfully'
      };
    } catch (error) {
      console.error('Error unlinking receipt:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.response?.data?.message || 'Failed to unlink receipt'
      };
    }
  }

  // Delete single receipt
  async deleteReceipt(receiptId) {
    try {
      await api.delete(`/receipts/${receiptId}/`);
      return {
        success: true,
        message: 'Receipt deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting receipt:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.response?.data?.message || 'Failed to delete receipt'
      };
    }
  }

  // Bulk delete receipts
  async bulkDeleteReceipts(receiptIds) {
    try {
      const response = await api.delete('/receipts/bulk_delete/', {
        data: { receipt_ids: receiptIds }
      });
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Receipts deleted successfully'
      };
    } catch (error) {
      console.error('Error bulk deleting receipts:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.response?.data?.message || 'Failed to delete receipts'
      };
    }
  }

  // Download receipt file
  async downloadReceipt(receiptId, fileName) {
    try {
      const response = await api.get(`/receipts/${receiptId}/download/`, {
        responseType: 'blob'
      });
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return {
        success: true,
        message: 'Receipt downloaded successfully'
      };
    } catch (error) {
      console.error('Error downloading receipt:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.response?.data?.message || 'Failed to download receipt'
      };
    }
  }

  // Update receipt details
  async updateReceipt(receiptId, data) {
    try {
      const response = await api.patch(`/receipts/${receiptId}/`, data);
      return {
        success: true,
        data: response.data,
        message: 'Receipt updated successfully'
      };
    } catch (error) {
      console.error('Error updating receipt:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.response?.data?.message || 'Failed to update receipt'
      };
    }
  }

  // Get single receipt details
  async getReceipt(receiptId) {
    try {
      const response = await api.get(`/receipts/${receiptId}/`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching receipt:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch receipt'
      };
    }
  }

  // Get available transactions for linking (transactions without receipts or specific filters)
  async getAvailableTransactions(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      // Default filters for transactions that might need receipts
      const defaultFilters = {
        ordering: '-date',
        page_size: 50,
        ...filters
      };
      
      Object.keys(defaultFilters).forEach(key => {
        if (defaultFilters[key] !== undefined && defaultFilters[key] !== null && defaultFilters[key] !== '') {
          params.append(key, defaultFilters[key]);
        }
      });

      const response = await api.get(`/transactions/?${params.toString()}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch transactions'
      };
    }
  }

  // Search receipts with query and filters
  async searchReceipts(query, filters = {}) {
    try {
      const searchFilters = {
        search: query,
        ...filters
      };
      
      return await this.getReceipts(searchFilters);
    } catch (error) {
      console.error('Error searching receipts:', error);
      return {
        success: false,
        error: 'Failed to search receipts'
      };
    }
  }

  // Get receipts by status
  async getReceiptsByStatus(status) {
    try {
      return await this.getReceipts({ status });
    } catch (error) {
      console.error('Error fetching receipts by status:', error);
      return {
        success: false,
        error: `Failed to fetch ${status} receipts`
      };
    }
  }

  // Get unlinked receipts (receipts without transactions)
  async getUnlinkedReceipts() {
    try {
      return await this.getReceipts({ is_linked: false });
    } catch (error) {
      console.error('Error fetching unlinked receipts:', error);
      return {
        success: false,
        error: 'Failed to fetch unlinked receipts'
      };
    }
  }

  // Process receipt (trigger OCR or reprocessing)
  async processReceipt(receiptId) {
    try {
      const response = await api.post(`/receipts/${receiptId}/process/`);
      return {
        success: true,
        data: response.data,
        message: 'Receipt processing started'
      };
    } catch (error) {
      console.error('Error processing receipt:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.response?.data?.message || 'Failed to process receipt'
      };
    }
  }
  async getDashboardStats() {
    try {
      const response = await api.get('/receipts/dashboard_stats/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching dashboard receipt stats:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch receipt statistics'
      };
    }
  }

  // Get recent receipt uploads for dashboard
  async getRecentUploads(limit = 5) {
    try {
      const response = await api.get(`/receipts/?page_size=${limit}&ordering=-uploaded_at`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching recent uploads:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch recent uploads'
      };
    }
  }
  
  // Get count of unlinked receipts
  async getUnlinkedCount() {
    try {
      const response = await api.get('/receipts/?is_linked=false&page_size=1');
      return {
        success: true,
        count: response.data.count || 0
      };
    } catch (error) {
      console.error('Error fetching unlinked count:', error);
      return {
        success: false,
        count: 0
      };
    }
  }

  // Validate receipt data before upload
  validateReceiptData(file, metadata = {}) {
    const errors = [];

    // File validation
    if (!file) {
      errors.push('File is required');
    } else {
      // Check file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        errors.push('Only PDF, JPG, and PNG files are allowed');
      }

      // Check file size (10MB limit)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        errors.push('File size must be less than 10MB');
      }
    }

    // Amount validation
    if (metadata.amount && (isNaN(parseFloat(metadata.amount)) || parseFloat(metadata.amount) < 0)) {
      errors.push('Amount must be a valid positive number');
    }

    // Date validation
    if (metadata.receipt_date && new Date(metadata.receipt_date) > new Date()) {
      errors.push('Receipt date cannot be in the future');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export default new ReceiptService();
