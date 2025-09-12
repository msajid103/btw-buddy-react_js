import api from './api';

export const receiptService = {
  // Get all receipts for current user
  async getReceipts(params = {}) {
    try {
      const response = await api.get('/transaction/receipts/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching receipts:', error);
      throw new Error('Failed to load receipts');
    }
  },

  // Get single receipt by ID
  async getReceipt(id) {
    try {
      const response = await api.get(`/transaction/receipts/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching receipt:', error);
      throw error;
    }
  },

  // Upload receipt for a transaction
  async uploadReceipt(transactionId, file) {
    try {
      const formData = new FormData();
      formData.append('transaction_id', transactionId);
      formData.append('file', file);

      const response = await api.post('/transaction/receipts/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading receipt:', error);
      throw new Error('Upload failed');
    }
  },

  // Delete receipt
  async deleteReceipt(id) {
    try {
      await api.delete(`/transaction/receipts/${id}/`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting receipt:', error);
      throw error;
    }
  },

  // Download receipt file
  async downloadReceipt(id) {
    try {
      const response = await api.get(`/transaction/receipts/${id}/download/`, {
        responseType: 'blob',
      });

      // Create download link
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `receipt-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return { success: true };
    } catch (error) {
      console.error('Error downloading receipt:', error);
      throw new Error('Download failed');
    }
  },

  // Bulk delete receipts
  async bulkDelete(receiptIds) {
    try {
      const response = await api.post('/transaction/receipts/bulk_delete/', {
        receipt_ids: receiptIds,
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk deleting receipts:', error);
      throw new Error('Bulk delete failed');
    }
  }
};
