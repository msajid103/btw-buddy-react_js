import React, { useState, useEffect } from 'react';
import {
  Plus,
  FileText,
  Download,
  Send,
  Edit,
  Eye,
  Trash2,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  Euro,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
  Mail,
  Printer,
  Copy,
  ExternalLink
} from 'lucide-react';
import { SideBar } from '../components/common/SideBar';
import InvoiceService from '../services/InvoiceService';

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [error, setError] = useState(null);

  // Statistics state
  const [stats, setStats] = useState({
    total_invoices: 0,
    total_amount: 0,
    paid_amount: 0,
    outstanding_amount: 0
  });

  // Create/Edit invoice state
  const [invoiceForm, setInvoiceForm] = useState({
    invoice_number: '',
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: '',
    customer_id: null,
    customer: {
      name: '',
      address: '',
      vat_number: '',
      chamber_of_commerce: ''
    },
    lines: [
      {
        description: '',
        quantity: 1,
        unit_price: 0,
        vat_rate: 21
      }
    ],
    notes: '',
    payment_instructions: 'Payment within 30 days of invoice date.'
  });

  // Additional state for customers
  const [customers, setCustomers] = useState([]);
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);

  useEffect(() => {
    initializePage();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectedMenu && !event.target.closest('.dropdown-menu')) {
        setSelectedMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [selectedMenu]);

  const initializePage = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadInvoices(),
        loadStats()
      ]);
    } catch (err) {
      console.error('Error initializing page:', err);
      setError('Failed to load invoices data');
    } finally {
      setLoading(false);
    }
  };

  const loadInvoices = async () => {
    try {
      const response = await InvoiceService.getInvoices();
      setInvoices(response.results || response);
    } catch (err) {
      console.error('Error loading invoices:', err);
      throw err;
    }
  };

  const loadStats = async () => {
    try {
      const response = await InvoiceService.getInvoiceStats();
      setStats(response);
    } catch (err) {
      console.error('Error loading stats:', err);
      // Use fallback stats calculation from loaded invoices
      calculateStatsFromInvoices();
    }
  };

  const calculateStatsFromInvoices = () => {
    if (!Array.isArray(invoices) || invoices.length === 0) {
      setStats({
        total_invoices: 0,
        total_amount: 0,
        paid_amount: 0,
        outstanding_amount: 0
      });
      return;
    }

    const totals = invoices.reduce((acc, invoice) => {
      acc.total_invoices += 1;
      acc.total_amount += parseFloat(invoice.total || 0);
      if (invoice.status === 'paid') {
        acc.paid_amount += parseFloat(invoice.total || 0);
      }
      return acc;
    }, {
      total_invoices: 0,
      total_amount: 0,
      paid_amount: 0,
      outstanding_amount: 0
    });

    totals.outstanding_amount = totals.total_amount - totals.paid_amount;
    setStats(totals);
  };

  const handleCreateInvoice = async () => {
    setSelectedInvoice(null);
    
    // Get next invoice number
    let nextNumber = '';
    try {
      nextNumber = await InvoiceService.getNextInvoiceNumber();
    } catch (err) {
      nextNumber = `INV-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-001`;
    }
    
    setInvoiceForm({
      invoice_number: nextNumber,
      invoice_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      customer_id: null,
      customer: {
        name: '',
        address: '',
        vat_number: '',
        chamber_of_commerce: ''
      },
      lines: [
        {
          description: '',
          quantity: 1,
          unit_price: 0,
          vat_rate: 21
        }
      ],
      notes: '',
      payment_instructions: 'Payment within 30 days of invoice date.'
    });
    setShowNewCustomerForm(false);
    setShowCreateModal(true);
  };

  const handleEditInvoice = async (invoice) => {
    try {
      // Load full invoice details including lines
      const fullInvoice = await InvoiceService.getInvoice(invoice.id);
      
      setSelectedInvoice(fullInvoice);
      setInvoiceForm({
        invoice_number: fullInvoice.invoice_number,
        invoice_date: fullInvoice.invoice_date,
        due_date: fullInvoice.due_date,
        customer_id: fullInvoice.customer?.id || null,
        customer: fullInvoice.customer || {
          name: '',
          address: '',
          vat_number: '',
          chamber_of_commerce: ''
        },
        lines: fullInvoice.lines && fullInvoice.lines.length > 0 ? fullInvoice.lines : [
          {
            description: '',
            quantity: 1,
            unit_price: 0,
            vat_rate: 21
          }
        ],
        notes: fullInvoice.notes || '',
        payment_instructions: fullInvoice.payment_instructions || 'Payment within 30 days of invoice date.'
      });
      setShowNewCustomerForm(!fullInvoice.customer?.id);
      setShowCreateModal(true);
    } catch (err) {
      console.error('Error loading invoice for edit:', err);
      setError('Failed to load invoice details');
    }
  };

  const handleCreateNewCustomer = async () => {
    try {
      const customerData = {
        name: invoiceForm.customer.name,
        address: invoiceForm.customer.address,
        vat_number: invoiceForm.customer.vat_number,
        chamber_of_commerce: invoiceForm.customer.chamber_of_commerce
      };

      const newCustomer = await InvoiceService.createCustomer(customerData);
      
      // Add to customers list and select it
      setCustomers(prev => [newCustomer, ...prev]);
      setInvoiceForm(prev => ({
        ...prev,
        customer_id: newCustomer.id,
        customer: newCustomer
      }));
      setShowNewCustomerForm(false);
      
    } catch (err) {
      console.error('Error creating customer:', err);
      setError('Failed to create customer');
    }
  };

  const handleCustomerSelect = (customerId) => {
    const selectedCustomer = customers.find(c => c.id === parseInt(customerId));
    if (selectedCustomer) {
      setInvoiceForm(prev => ({
        ...prev,
        customer_id: selectedCustomer.id,
        customer: selectedCustomer
      }));
      setShowNewCustomerForm(false);
    } else if (customerId === 'new') {
      setInvoiceForm(prev => ({
        ...prev,
        customer_id: null,
        customer: {
          name: '',
          address: '',
          vat_number: '',
          chamber_of_commerce: ''
        }
      }));
      setShowNewCustomerForm(true);
    }
  };

  const handleSaveInvoice = async () => {
    try {
      // If creating new customer, do that first
      let customerId = invoiceForm.customer_id;
      
      if (showNewCustomerForm && !customerId) {
        const customerData = {
          name: invoiceForm.customer.name,
          address: invoiceForm.customer.address,
          vat_number: invoiceForm.customer.vat_number,
          chamber_of_commerce: invoiceForm.customer.chamber_of_commerce
        };

        if (!customerData.name || !customerData.address) {
          setError('Customer name and address are required');
          return;
        }

        const newCustomer = await InvoiceService.createCustomer(customerData);
        customerId = newCustomer.id;
        setCustomers(prev => [newCustomer, ...prev]);
      }

      if (!customerId) {
        setError('Please select a customer or create a new one');
        return;
      }

      const totals = InvoiceService.calculateInvoiceTotals(invoiceForm.lines);
      const invoiceData = {
        invoice_number: invoiceForm.invoice_number,
        invoice_date: invoiceForm.invoice_date,
        due_date: invoiceForm.due_date,
        customer_id: customerId,
        lines: invoiceForm.lines,
        notes: invoiceForm.notes,
        payment_instructions: invoiceForm.payment_instructions,
        subtotal: totals.subtotal,
        total_vat: totals.totalVat,
        total: totals.total,
        vat_breakdown: totals.vatBreakdown
      };

      if (selectedInvoice) {
        await InvoiceService.updateInvoice(selectedInvoice.id, invoiceData);
      } else {
        await InvoiceService.createInvoice(invoiceData);
      }

      setShowCreateModal(false);
      await loadInvoices();
      await loadStats();
      setError(null);
    } catch (err) {
      console.error('Error saving invoice:', err);
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.message ||
                          Object.values(err.response?.data || {}).join(', ') ||
                          'Failed to save invoice';
      setError(errorMessage);
    }
  };

  const handleDeleteInvoice = async (invoice) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await InvoiceService.deleteInvoice(invoice.id);
        await loadInvoices();
        await loadStats();
      } catch (err) {
        console.error('Error deleting invoice:', err);
        setError('Failed to delete invoice');
      }
    }
  };

  const handleDownloadPDF = async (invoice) => {
    try {
      await InvoiceService.generateInvoicePDF(invoice.id);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      setError('Failed to generate PDF');
    }
  };

  const handleSendEmail = async (emailData) => {
    try {
      await InvoiceService.sendInvoiceEmail(selectedInvoice.id, emailData);
      setShowEmailModal(false);
      await loadInvoices();
    } catch (err) {
      console.error('Error sending email:', err);
      setError('Failed to send invoice email');
    }
  };

  const handleStatusChange = async (invoice, newStatus) => {
    try {
      await InvoiceService.updateInvoiceStatus(invoice.id, newStatus);
      await loadInvoices();
      await loadStats();
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update invoice status');
    }
  };

  const addInvoiceLine = () => {
    setInvoiceForm(prev => ({
      ...prev,
      lines: [
        ...prev.lines,
        {
          description: '',
          quantity: 1,
          unit_price: 0,
          vat_rate: 21
        }
      ]
    }));
  };

  const removeInvoiceLine = (index) => {
    setInvoiceForm(prev => ({
      ...prev,
      lines: prev.lines.filter((_, i) => i !== index)
    }));
  };

  const updateInvoiceLine = (index, field, value) => {
    setInvoiceForm(prev => ({
      ...prev,
      lines: prev.lines.map((line, i) => 
        i === index ? { ...line, [field]: value } : line
      )
    }));
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const config = InvoiceService.getStatusConfig(status);
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const totals = InvoiceService.calculateInvoiceTotals(invoiceForm.lines);

  const quickStats = [
    {
      title: 'Total Invoices',
      amount: (stats.total_invoices || 0).toString(),
      change: 'All time',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Total Revenue',
      amount: InvoiceService.formatCurrency(stats.total_amount || 0),
      change: 'Gross income',
      icon: Euro,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Paid Amount',
      amount: InvoiceService.formatCurrency(stats.paid_amount || 0),
      change: 'Received payments',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Outstanding',
      amount: InvoiceService.formatCurrency(stats.outstanding_amount || 0),
      change: 'Pending payments',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <SideBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading invoices...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SideBar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                Invoices 🧾
              </h1>
              <p className="text-gray-600 mt-1">Doeksen Digital • Create and manage professional invoices</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCreateInvoice}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>New Invoice</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
                <div>
                  <h4 className="text-red-800 font-medium">Error</h4>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
                <button 
                  onClick={() => setError(null)}
                  className="ml-auto text-red-600 hover:text-red-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              {quickStats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mb-1">{stat.amount}</p>
                      {stat.change && (
                        <p className={`text-xs ${stat.color}`}>{stat.change}</p>
                      )}
                    </div>
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                                            <div className="relative dropdown-menu">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search invoices by number or customer..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>
          </div>

          {/* Invoices List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Invoice Overview</h3>
            </div>
            
            {filteredInvoices.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Invoice
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredInvoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {invoice.invoice_number}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {invoice.customer_name || invoice.customer?.name || 'No customer'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(invoice.invoice_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(invoice.due_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {InvoiceService.formatCurrency(invoice.total)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(invoice.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={async () => {
                                try {
                                  const fullInvoice = await InvoiceService.getInvoice(invoice.id);
                                  setSelectedInvoice(fullInvoice);
                                  setShowViewModal(true);
                                } catch (err) {
                                  console.error('Error loading invoice details:', err);
                                  setError('Failed to load invoice details');
                                }
                              }}
                              className="text-gray-600 hover:text-gray-900 p-1 rounded"
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEditInvoice(invoice)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDownloadPDF(invoice)}
                              className="text-green-600 hover:text-green-900 p-1 rounded"
                              title="Download PDF"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedInvoice(invoice);
                                setShowEmailModal(true);
                              }}
                              className="text-purple-600 hover:text-purple-900 p-1 rounded"
                              title="Send Email"
                            >
                              <Mail className="h-4 w-4" />
                            </button>
                            <div className="relative group">
                              <button className="text-gray-600 hover:text-gray-900 p-1 rounded">
                                <MoreVertical className="h-4 w-4" />
                              </button>
                              <div className="absolute right-0 top-8 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                <div className="py-1">
                                  {invoice.status !== 'paid' && (
                                    <button
                                      onClick={() => handleStatusChange(invoice, 'paid')}
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                    >
                                      Mark as Paid
                                    </button>
                                  )}
                                  {invoice.status === 'draft' && (
                                    <button
                                      onClick={() => handleStatusChange(invoice, 'sent')}
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                    >
                                      Mark as Sent
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleDeleteInvoice(invoice)}
                                    className="block px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full text-left"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'No invoices match your current filters.' 
                    : 'Get started by creating your first invoice.'
                  }
                </p>
                {(!searchTerm && filterStatus === 'all') && (
                  <button
                    onClick={handleCreateInvoice}
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Invoice
                  </button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create/Edit Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedInvoice ? 'Edit Invoice' : 'Create New Invoice'}
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Invoice Header Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    value={invoiceForm.invoice_number}
                    onChange={(e) => setInvoiceForm(prev => ({...prev, invoice_number: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="INV-2025-001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invoice Date
                  </label>
                  <input
                    type="date"
                    value={invoiceForm.invoice_date}
                    onChange={(e) => setInvoiceForm(prev => ({...prev, invoice_date: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={invoiceForm.due_date}
                    onChange={(e) => setInvoiceForm(prev => ({...prev, due_date: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Customer Information */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-semibold text-gray-900">Customer Information</h4>
                  {!showNewCustomerForm && (
                    <button
                      type="button"
                      onClick={() => setShowNewCustomerForm(true)}
                      className="text-primary-600 hover:text-primary-700 text-sm"
                    >
                      + New Customer
                    </button>
                  )}
                </div>
                
                {!showNewCustomerForm ? (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Customer
                    </label>
                    <select
                      value={invoiceForm.customer_id || ''}
                      onChange={(e) => handleCustomerSelect(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    >
                      <option value="">Select a customer...</option>
                      {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name}
                        </option>
                      ))}
                      <option value="new">+ Create New Customer</option>
                    </select>
                  </div>
                ) : (
                  <div className="border rounded-lg p-4 bg-blue-50">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-sm font-semibold text-gray-900">New Customer</h5>
                      <button
                        type="button"
                        onClick={() => setShowNewCustomerForm(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Customer Name *
                        </label>
                        <input
                          type="text"
                          value={invoiceForm.customer.name}
                          onChange={(e) => setInvoiceForm(prev => ({
                            ...prev,
                            customer: {...prev.customer, name: e.target.value}
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Company Name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          VAT Number
                        </label>
                        <input
                          type="text"
                          value={invoiceForm.customer.vat_number}
                          onChange={(e) => setInvoiceForm(prev => ({
                            ...prev,
                            customer: {...prev.customer, vat_number: e.target.value}
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="NL123456789B01"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address *
                        </label>
                        <textarea
                          value={invoiceForm.customer.address}
                          onChange={(e) => setInvoiceForm(prev => ({
                            ...prev,
                            customer: {...prev.customer, address: e.target.value}
                          }))}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Street Address, City, Postal Code"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Chamber of Commerce
                        </label>
                        <input
                          type="text"
                          value={invoiceForm.customer.chamber_of_commerce}
                          onChange={(e) => setInvoiceForm(prev => ({
                            ...prev,
                            customer: {...prev.customer, chamber_of_commerce: e.target.value}
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="12345678"
                        />
                      </div>
                    </div>
                    
                    {showNewCustomerForm && (
                      <div className="mt-3">
                        <button
                          type="button"
                          onClick={handleCreateNewCustomer}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                          Save Customer
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Invoice Lines */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-semibold text-gray-900">Invoice Lines</h4>
                  <button
                    onClick={addInvoiceLine}
                    className="flex items-center space-x-2 px-3 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Line</span>
                  </button>
                </div>
                
                <div className="space-y-4">
                  {invoiceForm.lines.map((line, index) => (
                    <div key={index} className="grid grid-cols-12 gap-3 p-4 bg-gray-50 rounded-lg">
                      <div className="col-span-5">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          value={line.description}
                          onChange={(e) => updateInvoiceLine(index, 'description', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Service or product description"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Quantity
                        </label>
                        <input
                          type="number"
                          value={line.quantity}
                          onChange={(e) => updateInvoiceLine(index, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Unit Price
                        </label>
                        <input
                          type="number"
                          value={line.unit_price}
                          onChange={(e) => updateInvoiceLine(index, 'unit_price', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          VAT Rate
                        </label>
                        <select
                          value={line.vat_rate}
                          onChange={(e) => updateInvoiceLine(index, 'vat_rate', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value={0}>0%</option>
                          <option value={9}>9%</option>
                          <option value={21}>21%</option>
                        </select>
                      </div>
                      <div className="col-span-1 flex items-end">
                        {invoiceForm.lines.length > 1 && (
                          <button
                            onClick={() => removeInvoiceLine(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Invoice Totals Preview */}
              <div className="mb-6 bg-gray-50 rounded-lg p-4">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Invoice Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal (excl. VAT)</span>
                    <span className="font-medium">{InvoiceService.formatCurrency(totals.subtotal)}</span>
                  </div>
                  {Object.entries(totals.vatBreakdown).map(([rate, data]) => (
                    data.vat > 0 && (
                      <div key={rate} className="flex justify-between">
                        <span className="text-gray-600">VAT {rate}%</span>
                        <span className="font-medium">{InvoiceService.formatCurrency(data.vat)}</span>
                      </div>
                    )
                  ))}
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-semibold text-gray-900">Total (incl. VAT)</span>
                    <span className="text-lg font-bold text-gray-900">{InvoiceService.formatCurrency(totals.total)}</span>
                  </div>
                </div>
              </div>

              {/* Notes and Payment Instructions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={invoiceForm.notes}
                    onChange={(e) => setInvoiceForm(prev => ({...prev, notes: e.target.value}))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Additional notes or terms..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Instructions
                  </label>
                  <textarea
                    value={invoiceForm.payment_instructions}
                    onChange={(e) => setInvoiceForm(prev => ({...prev, payment_instructions: e.target.value}))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Payment terms and instructions..."
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveInvoice}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {selectedInvoice ? 'Update Invoice' : 'Create Invoice'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Invoice Modal */}
      {showViewModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Invoice {selectedInvoice.invoice_number}
                </h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Invoice Preview Content */}
              <div className="space-y-6">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">Invoice Details</h4>
                    <p className="text-sm text-gray-600">Number: {selectedInvoice.invoice_number}</p>
                    <p className="text-sm text-gray-600">Date: {new Date(selectedInvoice.invoice_date).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600">Due: {new Date(selectedInvoice.due_date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(selectedInvoice.status)}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Customer</h4>
                  <div className="text-sm text-gray-600">
                    <p>{selectedInvoice.customer?.name || 'No customer name'}</p>
                    <p className="whitespace-pre-line">{selectedInvoice.customer?.address || 'No address'}</p>
                    {selectedInvoice.customer?.vat_number && (
                      <p>VAT: {selectedInvoice.customer.vat_number}</p>
                    )}
                    {selectedInvoice.customer?.chamber_of_commerce && (
                      <p>CoC: {selectedInvoice.customer.chamber_of_commerce}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Invoice Lines</h4>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left">Description</th>
                          <th className="px-4 py-2 text-center">Qty</th>
                          <th className="px-4 py-2 text-right">Price</th>
                          <th className="px-4 py-2 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedInvoice.lines && selectedInvoice.lines.length > 0 ? (
                          selectedInvoice.lines.map((line, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2">{line.description || 'No description'}</td>
                              <td className="px-4 py-2 text-center">{line.quantity || 0}</td>
                              <td className="px-4 py-2 text-right">{InvoiceService.formatCurrency(line.unit_price || 0)}</td>
                              <td className="px-4 py-2 text-right">
                                {InvoiceService.formatCurrency((line.quantity || 0) * (line.unit_price || 0))}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="px-4 py-2 text-center text-gray-500">
                              No invoice lines found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-end">
                    <div className="w-64 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{InvoiceService.formatCurrency(selectedInvoice.subtotal || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>VAT:</span>
                        <span>{InvoiceService.formatCurrency(selectedInvoice.total_vat || 0)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>{InvoiceService.formatCurrency(selectedInvoice.total || 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => handleDownloadPDF(selectedInvoice)}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setShowEmailModal(true);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  <span>Send Email</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send Email Modal */}
      {showEmailModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Send Invoice</h3>
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                handleSendEmail({
                  to_email: formData.get('to_email'),
                  subject: formData.get('subject'),
                  message: formData.get('message')
                });
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      To Email
                    </label>
                    <input
                      type="email"
                      name="to_email"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="customer@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      defaultValue={`Invoice ${selectedInvoice.invoice_number} from Doeksen Digital`}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      defaultValue={`Dear ${selectedInvoice.customer?.name || 'Customer'},

Please find attached invoice ${selectedInvoice.invoice_number} for ${InvoiceService.formatCurrency(selectedInvoice.total)}.

Payment is due by ${new Date(selectedInvoice.due_date).toLocaleDateString()}.

Thank you for your business.

Best regards,
Doeksen Digital`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowEmailModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send Invoice</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicesPage;