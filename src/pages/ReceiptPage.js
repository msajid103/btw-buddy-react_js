import React, { useState, useEffect, useContext } from 'react';
import {
  Upload,
  FileText,
  Search,
  Eye,
  Download,
  Trash2,
  Link2,
  Euro,
  X,
  Check,
  AlertCircle,
  Clock,
  TrendingUp,
  Plus,
  Filter,
  MoreHorizontal,
  ExternalLink,
  Calendar,
  User,
  Building
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SideBar } from '../components/common/SideBar';
import Modal from '../components/common/Modal';
import ReceiptUploadForm from '../components/receipts/ReceiptUploadForm';
import receiptService from '../services/receiptService';
import { transactionService } from '../services/transactionService';
import { AuthContext } from '../context/AuthContext';

const ReceiptPage = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate();
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipts, setSelectedReceipts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [filterSupplier, setFilterSupplier] = useState('all');
  const [stats, setStats] = useState(null);
  const [recentUploads, setRecentUploads] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  // Modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showReceiptDetailModal, setShowReceiptDetailModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Pagination and filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);

  // Load data on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load receipts when filters change
  useEffect(() => {
    loadReceipts();
  }, [searchTerm, filterStatus, filterDate, filterSupplier, currentPage]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadReceipts(),
        loadStats(),
        loadRecentUploads(),
        loadTransactions(),
        loadCategories(),
        loadSuppliers()
      ]);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReceipts = async () => {
    try {
      const filters = {
        search: searchTerm || undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        date_filter: filterDate !== 'all' ? filterDate : undefined,
        supplier: filterSupplier !== 'all' ? filterSupplier : undefined,
        page: currentPage,
        page_size: pageSize,
        ordering: '-uploaded_at'
      };

      const result = await receiptService.getReceipts(filters);

      if (result.success) {
        setReceipts(result.data.results || result.data);
        setTotalPages(Math.ceil((result.data.count || result.data.length) / pageSize));
      } else {
        console.error('Error loading receipts:', result.error);
      }
    } catch (error) {
      console.error('Error loading receipts:', error);
    }
  };

  const loadStats = async () => {
    try {
      const result = await receiptService.getStats();
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadRecentUploads = async () => {
    try {
      const result = await receiptService.getRecentUploads();
      if (result.success) {
        setRecentUploads(result.data);
      }
    } catch (error) {
      console.error('Error loading recent uploads:', error);
    }
  };

  const loadTransactions = async () => {
    try {
      const result = await receiptService.getAvailableTransactions();
      if (result.success) {
        setTransactions(result.data.results || result.data);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await transactionService.getCategories();
      setCategories(data.results);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };
  const loadSuppliers = async () => {
    try {
      const result = await receiptService.getSuppliers();
      if (result.success) {
        setSuppliers(result.data);
      } else {
        // Fallback to extracting suppliers from receipts
        const supplierSet = new Set();
        receipts.forEach(receipt => {
          if (receipt.supplier) supplierSet.add(receipt.supplier);
        });
        setSuppliers(Array.from(supplierSet).map((s, i) => ({ id: i, name: s })));
      }
    } catch (error) {
      console.error('Error loading suppliers:', error);
    }
  };

  const handleUploadSubmit = async (data) => {
    setUploadLoading(true);
    try {
      const result = await receiptService.uploadReceipts(data.files, data.metadata);

      if (result.success) {
        setShowUploadModal(false);
        await loadReceipts();
        await loadStats();
        await loadRecentUploads();
        await loadSuppliers();
      } else {
        alert('Error uploading receipts: ' + result.error);
      }
    } catch (error) {
      console.error('Error uploading receipts:', error);
      alert('Error uploading receipts. Please try again.');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleLinkToTransaction = async (receiptId, transactionId) => {
    setActionLoading(true);
    try {
      const result = await receiptService.linkReceiptToTransaction(receiptId, transactionId);

      if (result.success) {
        setShowLinkModal(false);
        setSelectedReceipt(null);
        await loadReceipts();
        await loadStats();
      } else {
        alert('Error linking receipt: ' + result.error);
      }
    } catch (error) {
      console.error('Error linking receipt:', error);
      alert('Error linking receipt. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkLink = async () => {
    if (selectedReceipts.length === 0) {
      alert('Please select receipts to link');
      return;
    }

    const transactionId = prompt('Enter transaction ID to link to:');
    if (!transactionId) return;

    setActionLoading(true);
    try {
      const result = await receiptService.bulkLinkReceipts(selectedReceipts, transactionId);

      if (result.success) {
        setSelectedReceipts([]);
        await loadReceipts();
        await loadStats();
        alert(result.message);
      } else {
        alert('Error linking receipts: ' + result.error);
      }
    } catch (error) {
      console.error('Error linking receipts:', error);
      alert('Error linking receipts. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedReceipts.length === 0) {
      alert('Please select receipts to delete');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedReceipts.length} receipt(s)?`)) {
      return;
    }

    setActionLoading(true);
    try {
      const result = await receiptService.bulkDeleteReceipts(selectedReceipts);

      if (result.success) {
        setSelectedReceipts([]);
        await loadReceipts();
        await loadStats();
        alert(result.message);
      } else {
        alert('Error deleting receipts: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting receipts:', error);
      alert('Error deleting receipts. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadReceipt = async (receipt) => {
    try {
      const result = await receiptService.downloadReceipt(receipt.id, receipt.file_name);
      if (!result.success) {
        alert('Error downloading receipt: ' + result.error);
      }
    } catch (error) {
      console.error('Error downloading receipt:', error);
      alert('Error downloading receipt. Please try again.');
    }
  };

  const handleViewReceiptDetails = (receipt) => {
    setSelectedReceipt(receipt);
    setShowReceiptDetailModal(true);
  };

  const toggleReceiptSelection = (receiptId) => {
    setSelectedReceipts(prev =>
      prev.includes(receiptId)
        ? prev.filter(id => id !== receiptId)
        : [...prev, receiptId]
    );
  };

  const selectAllReceipts = () => {
    if (selectedReceipts.length === receipts.length) {
      setSelectedReceipts([]);
    } else {
      setSelectedReceipts(receipts.map(r => r.id));
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType === 'pdf') {
      return <div className="w-5 h-5 bg-red-100 rounded flex items-center justify-center text-red-600 text-xs font-bold">PDF</div>;
    }
    return <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center text-blue-600 text-xs font-bold">IMG</div>;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      processed: { color: 'bg-green-100 text-green-800', text: 'Processed' },
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      error: { color: 'bg-red-100 text-red-800', text: 'Error' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const quickStats = stats ? [
    {
      title: 'Total Receipts',
      amount: stats.total_receipts?.toString() || '0',
      change: '+3 this month',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Processed',
      amount: stats.processed_receipts?.toString() || '0',
      change: `${stats.total_receipts > 0 ? Math.round((stats.processed_receipts / stats.total_receipts) * 100) : 0}% complete`,
      icon: Check,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Pending Review',
      amount: stats.pending_receipts?.toString() || '0',
      change: 'Needs attention',
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
    {
      title: 'Total Amount',
      amount: `€${Number(stats.total_amount || 0).toFixed(2)}`,
      change: 'This period',
      icon: Euro,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    }
  ] : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
              <h1 className="text-2xl font-bold text-gray-900">
                Receipt Management
              </h1>
              <p className="text-gray-600 mt-1">{user.business_profile?.company_name} • Upload and manage your receipts</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Upload className="h-4 w-4" />
                <span>Upload receipt</span>
              </button>
              <button
                onClick={() => navigate('/transactions')}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>New Transaction</span>
              </button>
              {selectedReceipts.length > 0 && (
                <button
                  onClick={handleBulkLink}
                  disabled={actionLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  <Link2 className="h-4 w-4" />
                  <span>Bulk link</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Progress Status */}
          {stats && (
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-2">Receipt Processing Status</h2>
                  <p className="text-blue-100 flex items-center">
                    {stats.pending_receipts > 0
                      ? `${stats.pending_receipts} receipts need attention`
                      : 'All receipts processed! 🎉'
                    }
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold mb-1">
                    {stats.total_receipts > 0 ? Math.round((stats.processed_receipts / stats.total_receipts) * 100) : 0}%
                  </div>
                  <div className="text-blue-100 text-sm">processed</div>
                </div>
              </div>
              <div className="mt-4 bg-white/20 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${stats.total_receipts > 0 ? (stats.processed_receipts / stats.total_receipts) * 100 : 0}%`
                  }}
                ></div>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          {quickStats.length > 0 && (
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

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Receipt Table */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Table Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-gray-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Receipts</h3>
                      <span className="text-sm text-gray-500">({receipts.length})</span>
                    </div>
                    {selectedReceipts.length > 0 && (
                      <div className="flex gap-2">
                        <button
                          onClick={handleBulkLink}
                          disabled={actionLoading}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                          Bulk Link
                        </button>
                        <button
                          onClick={handleBulkDelete}
                          disabled={actionLoading}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50"
                        >
                          Delete ({selectedReceipts.length})
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Search and Filter */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search receipts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Status</option>
                        <option value="processed">Processed</option>
                        <option value="pending">Pending</option>
                        <option value="error">Error</option>
                      </select>
                      <select
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Dates</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                      </select>
                      <select
                        value={filterSupplier}
                        onChange={(e) => setFilterSupplier(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Suppliers</option>
                        {suppliers.map(supplier => (
                          <option key={supplier.id} value={supplier.name}>{supplier.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="w-12 px-6 py-3">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300"
                            checked={selectedReceipts.length === receipts.length && receipts.length > 0}
                            onChange={selectAllReceipts}
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          File
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Supplier
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
                      {receipts.map((receipt) => (
                        <tr key={receipt.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300"
                              checked={selectedReceipts.includes(receipt.id)}
                              onChange={() => toggleReceiptSelection(receipt.id)}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getFileIcon(receipt.file_type)}
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {receipt.file_name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {new Date(receipt.uploaded_at).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{receipt.supplier || 'Not extracted'}</div>
                            <div className="text-sm text-gray-500">{receipt.category_name || 'Uncategorized'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {receipt.formatted_amount}
                            </div>
                            <div className="text-sm text-gray-500">
                              VAT {receipt.vat_rate}%
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-1">
                              {getStatusBadge(receipt.status)}
                              {receipt.is_linked ? (
                                <div className="text-xs text-blue-600 flex items-center">
                                  <Link2 className="h-3 w-3 mr-1" />
                                  Linked to Transaction
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setSelectedReceipt(receipt);
                                    setShowLinkModal(true);
                                  }}
                                  className="text-xs text-blue-600 hover:text-blue-800"
                                >
                                  Link Transaction
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleViewReceiptDetails(receipt)}
                                className="text-gray-600 hover:text-gray-800"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              {receipt.file_url && (
                                <button
                                  onClick={() => window.open(receipt.file_url, '_blank')}
                                  className="text-blue-600 hover:text-blue-800"
                                  title="View Receipt"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDownloadReceipt(receipt)}
                                className="text-green-600 hover:text-green-800"
                                title="Download Receipt"
                              >
                                <Download className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => receiptService.deleteReceipt(receipt.id).then(() => loadReceipts())}
                                className="text-red-600 hover:text-red-800"
                                title="Delete Receipt"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Empty State */}
                  {receipts.length === 0 && (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-2">No receipts found</p>
                      <button
                        onClick={() => setShowUploadModal(true)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Upload your first receipt
                      </button>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="w-full flex items-center justify-between p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Upload className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Upload receipts</span>
                    </div>
                    <span className="text-gray-400">→</span>
                  </button>
                  <button
                    onClick={() => navigate('/transactions/create')}
                    className="w-full flex items-center justify-between p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Plus className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-900">New transaction</span>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => navigate('/transactions')}
                    className="w-full flex items-center justify-between p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Link2 className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-900">View transactions</span>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Recent Uploads */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Recent Uploads</h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentUploads.length > 0 ? recentUploads.map((receipt) => (
                      <div key={receipt.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 p-1 rounded-full bg-gray-100">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{receipt.file_name}</p>
                          <p className="text-sm text-gray-600">{receipt.supplier || 'Processing...'}</p>
                        </div>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {new Date(receipt.uploaded_at).toLocaleDateString()}
                        </span>
                      </div>
                    )) : (
                      <p className="text-gray-500 text-sm text-center py-4">
                        No recent uploads
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Receipts"
        size="lg"
      >
        <ReceiptUploadForm
          onSubmit={handleUploadSubmit}
          loading={uploadLoading}
          onClose={() => setShowUploadModal(false)}
          transactions={transactions}
          categories={categories}
        />
      </Modal>

      {/* Link Transaction Modal */}
      <Modal
        isOpen={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        title="Link Receipt to Transaction"
        size="lg"
      >
        {selectedReceipt && (
          <div>
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900">Selected Receipt:</h4>
              <p className="text-sm text-gray-600">{selectedReceipt.file_name}</p>
              <p className="text-sm text-gray-600">Amount: {selectedReceipt.formatted_amount}</p>
            </div>

            <div className="max-h-60 overflow-y-auto">
              <h4 className="font-medium text-gray-900 mb-3">Available Transactions:</h4>
              {transactions.length > 0 ? transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="border rounded-lg p-3 mb-2 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleLinkToTransaction(selectedReceipt.id, transaction.id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-600">{transaction.date}</p>
                      <p className="text-xs text-gray-500">Status: {transaction.status}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {transaction.formatted_amount}
                      </p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No available transactions found</p>
                  <button
                    onClick={() => {
                      setShowLinkModal(false);
                      navigate('/transactions/create');
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create New Transaction
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowLinkModal(false)}
                disabled={actionLoading}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Receipt Detail Modal */}
      <Modal
        isOpen={showReceiptDetailModal}
        onClose={() => setShowReceiptDetailModal(false)}
        title="Receipt Details"
        size="lg"
      >
        {selectedReceipt && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">File Information</h4>
                <p className="text-sm text-gray-600">Name: {selectedReceipt.file_name}</p>
                <p className="text-sm text-gray-600">Type: {selectedReceipt.file_type}</p>
                <p className="text-sm text-gray-600">
                  Uploaded: {new Date(selectedReceipt.uploaded_at).toLocaleString()}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Supplier Information</h4>
                <p className="text-sm text-gray-600">Name: {selectedReceipt.supplier || 'Not available'}</p>
                <p className="text-sm text-gray-600">Category: {selectedReceipt.category_name || 'Uncategorized'}</p>
                <p className="text-sm text-gray-600">Status: {selectedReceipt.status}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Financial Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Amount: {selectedReceipt.formatted_amount}</p>
                  <p className="text-sm text-gray-600">VAT Rate: {selectedReceipt.vat_rate}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    VAT Amount: €{(selectedReceipt.amount * (selectedReceipt.vat_rate / 100)).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Net Amount: €{(selectedReceipt.amount - (selectedReceipt.amount * (selectedReceipt.vat_rate / 100))).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {selectedReceipt.is_linked && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Linked Transaction</h4>
                <p className="text-sm text-blue-700">This receipt is linked to a transaction</p>
                <button
                  onClick={() => navigate(`/transactions/${selectedReceipt.transaction_id}`)}
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm flex items-center"
                >
                  View Transaction <ExternalLink className="h-3 w-3 ml-1" />
                </button>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setShowReceiptDetailModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
              <button
                onClick={() => handleDownloadReceipt(selectedReceipt)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Download
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReceiptPage;