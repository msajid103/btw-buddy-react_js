import api from './api';

class InvoiceService {
  // Get all invoices for the user
  async getInvoices(page = 1, filters = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        page_size: '20',
        ...filters
      });

      const response = await api.get(`/invoices/?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  }

  // Get single invoice by ID
  async getInvoice(id) {
    try {
      const response = await api.get(`/invoices/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching invoice:', error);
      throw error;
    }
  }

  // Create new invoice
  async createInvoice(invoiceData) {
    try {
      const response = await api.post('/invoices/', invoiceData);
      return response.data;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  }

  // Update invoice
  async updateInvoice(id, invoiceData) {
    try {
      const response = await api.patch(`/invoices/${id}/`, invoiceData);
      return response.data;
    } catch (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }
  }

  // Delete invoice
  async deleteInvoice(id) {
    try {
      await api.delete(`/invoices/${id}/`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  }

  // Generate PDF for invoice
  async generateInvoicePDF(id) {
    try {
      const response = await api.get(`/invoices/${id}/pdf/`, {
        responseType: 'blob'
      });
      
      // Create download link
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `invoice-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return { success: true };
    } catch (error) {
      console.error('Error generating invoice PDF:', error);
      throw error;
    }
  }

  // Send invoice by email
  async sendInvoiceEmail(id, emailData) {
    try {
      const response = await api.post(`/invoices/${id}/send_email/`, emailData);
      return response.data;
    } catch (error) {
      console.error('Error sending invoice email:', error);
      throw error;
    }
  }

  // Update invoice status
  async updateInvoiceStatus(id, status) {
    try {
      const response = await api.patch(`/invoices/${id}/`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating invoice status:', error);
      throw error;
    }
  }

  // Create new customer
  async createCustomer(customerData) {
    try {
      const response = await api.post('/customers/', customerData);
      return response.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  // Get customers for dropdown
  async getCustomers() {
    try {
      const response = await api.get('/customers/');
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  }

  // Get next invoice number
  async getNextInvoiceNumber() {
    try {
      const response = await api.get('/invoices/next_number/');
      return response.data.next_number;
    } catch (error) {
      console.error('Error fetching next invoice number:', error);
      // Fallback to current date based number
      const date = new Date();
      return `INV-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-001`;
    }
  }

  // Calculate invoice totals
  calculateInvoiceTotals(lines) {
    const totals = {
      subtotal: 0,
      vatBreakdown: {
        '0': { amount: 0, vat: 0 },
        '9': { amount: 0, vat: 0 },
        '21': { amount: 0, vat: 0 }
      },
      totalVat: 0,
      total: 0
    };

    lines.forEach(line => {
      const lineTotal = (parseFloat(line.quantity) || 0) * (parseFloat(line.unit_price) || 0);
      const vatRate = parseFloat(line.vat_rate) || 0;
      const vatAmount = lineTotal * (vatRate / 100);

      totals.subtotal += lineTotal;
      
      const vatRateKey = vatRate.toString();
      if (totals.vatBreakdown[vatRateKey]) {
        totals.vatBreakdown[vatRateKey].amount += lineTotal;
        totals.vatBreakdown[vatRateKey].vat += vatAmount;
      }

      totals.totalVat += vatAmount;
    });

    totals.total = totals.subtotal + totals.totalVat;

    // Round according to Dutch VAT rules
    totals.subtotal = Math.round(totals.subtotal * 100) / 100;
    totals.totalVat = Math.round(totals.totalVat * 100) / 100;
    totals.total = Math.round(totals.total * 100) / 100;

    Object.keys(totals.vatBreakdown).forEach(rate => {
      totals.vatBreakdown[rate].amount = Math.round(totals.vatBreakdown[rate].amount * 100) / 100;
      totals.vatBreakdown[rate].vat = Math.round(totals.vatBreakdown[rate].vat * 100) / 100;
    });

    return totals;
  }

  // Format currency
  formatCurrency(amount) {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0);
  }

  // Get invoice status configuration
  getStatusConfig(status) {
    const configs = {
      draft: { color: 'bg-yellow-100 text-yellow-800', text: 'Draft', icon: 'edit' },
      sent: { color: 'bg-blue-100 text-blue-800', text: 'Sent', icon: 'send' },
      paid: { color: 'bg-green-100 text-green-800', text: 'Paid', icon: 'check' },
      overdue: { color: 'bg-red-100 text-red-800', text: 'Overdue', icon: 'alert' },
      cancelled: { color: 'bg-gray-100 text-gray-800', text: 'Cancelled', icon: 'x' }
    };
    return configs[status] || configs.draft;
  }

  // Get dashboard summary
  async getDashboardSummary() {
    try {
      const response = await api.get('/invoices/dashboard_summary/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching invoice dashboard summary:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch invoice summary'
      };
    }
  }

  // Get invoice statistics
  async getInvoiceStats() {
    try {
      const response = await api.get('/invoices/statistics/');
      return response.data;
    } catch (error) {
      console.error('Error fetching invoice statistics:', error);
      throw error;
    }
  }
}

export default new InvoiceService();