import React, { useState, useEffect } from 'react';
import { transactionService } from '../services/transactionService';
import {
  FileText,
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  ChevronDown,
  MoreHorizontal,
  Eye,
  Edit,
  Link2,
  Calendar,
  ArrowUpDown,
  Bell,
  Loader2,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { SideBar } from '../components/common/SideBar';
import Modal from '../components/common/Modal';
import TransactionForm from '../components/transactions/TransactionForm';
import TransactionDetailView from '../components/transactions/TransactionDetailView';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    current_page: 1,
    total_pages: 1
  });

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('last30');
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);

  // Modal states
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    transaction_type: 'expense',
    date: new Date().toISOString().split('T')[0],
    category: '',
    account: '',
    vat_rate: '21',
    notes: '',
    status: 'unlabeled'
  });

  // Build filters object
  const buildFilters = () => {
    const filters = {};
    if (searchQuery) filters.search = searchQuery;
    if (filterStatus !== 'all') filters.status = filterStatus;
    if (dateRange !== 'all') filters.date_range = dateRange;
    return filters;
  };

  // Fetch data functions using service
  const fetchTransactions = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const filters = buildFilters();
      console.log("Filter--", filters)
      const data = await transactionService.getTransactions(page, filters);

      setTransactions(data.results);
      setPagination({
        count: data.count,
        next: data.next,
        previous: data.previous,
        current_page: page,
        total_pages: Math.ceil(data.count / 20)
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const filters = buildFilters();
      const data = await transactionService.getTransactionStats(filters);
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchAccounts = async () => {
    try {
      const data = await transactionService.getAccounts();
      setAccounts(data.results);
    } catch (err) {
      console.error('Error fetching accounts:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await transactionService.getCategories();
      setCategories(data.results);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchTransactions();
    fetchStats();
    fetchAccounts();
    fetchCategories();
  }, []);

  // Refetch when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchTransactions(1);
      fetchStats();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, filterStatus, dateRange]);

  // Form handlers
  const resetForm = () => {
    setFormData({
      description: '',
      amount: '',
      transaction_type: 'expense',
      date: new Date().toISOString().split('T')[0],
      category: '',
      account: '',
      vat_rate: '21',
      notes: '',
      status: 'unlabeled'
    });
  };

  const handleAddTransaction = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEditTransaction = (transaction) => {
    // console.log("Accounts in form", accounts)
    console.log("User account in form", transaction)
    setSelectedTransaction(transaction);
    setFormData({
      description: transaction.description || '',
      amount: transaction.amount || '',
      transaction_type: transaction.transaction_type || 'expense',
      date: transaction.date || new Date().toISOString().split('T')[0],
      category: transaction.category || '',
      account: transaction.account || '',
      vat_rate: transaction.vat_rate || '21',
      notes: transaction.notes || '',
      status: transaction.status || 'unlabeled'
    });
    setShowEditModal(true);
  };

  const handleViewTransaction = async (transaction) => {
    try {
      setFormLoading(true);
      const fullTransaction = await transactionService.getTransaction(transaction.id);
      setSelectedTransaction(fullTransaction);
      setShowViewModal(true);
    } catch (err) {
      console.error('Error fetching transaction details:', err);
      alert('Error loading transaction details');
    } finally {
      setFormLoading(false);
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      if (showEditModal && selectedTransaction) {
        await transactionService.updateTransaction(selectedTransaction.id, formData);
        setShowEditModal(false);
      } else {
        await transactionService.createTransaction(formData);
        setShowAddModal(false);
      }

      // Refresh data
      fetchTransactions(pagination.current_page);
      fetchStats();
      resetForm();
      setSelectedTransaction(null);
    } catch (err) {
      console.error('Error saving transaction:', err);
      alert('Error saving transaction: ' + err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      await transactionService.deleteTransaction(transactionId);
      fetchTransactions(pagination.current_page);
      fetchStats();
    } catch (err) {
      console.error('Error deleting transaction:', err);
      alert('Error deleting transaction: ' + err.message);
    }
  };

  // Event handlers
  const handleSelectAll = () => {
    if (selectedTransactions.length === transactions.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(transactions.map(t => t.id));
    }
  };

  const handleSelectTransaction = (id) => {
    setSelectedTransactions(prev =>
      prev.includes(id)
        ? prev.filter(tid => tid !== id)
        : [...prev, id]
    );
  };

  const handleBulkAction = async (action, data = {}) => {
    setBulkActionLoading(true);
    try {
      const result = await transactionService.bulkAction(selectedTransactions, action, data);

      alert(result.message || 'Action completed successfully');

      setSelectedTransactions([]);
      fetchTransactions(pagination.current_page);
      fetchStats();
    } catch (err) {
      alert('Error performing bulk action: ' + err.message);
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const filters = buildFilters();
      await transactionService.exportTransactions(filters, selectedTransactions);
    } catch (err) {
      alert('Export failed: ' + err.message);
    }
  };

  const handleImportCSV = async (file) => {
    try {
      const result = await transactionService.importTransactionsCSV(file);
      alert(`Import completed: ${result.stats.successful_rows} successful, ${result.stats.failed_rows} failed`);

      fetchTransactions();
      fetchStats();
    } catch (err) {
      alert('Import failed: ' + err.message);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      labeled: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      unlabeled: 'bg-red-100 text-red-800'
    };

    const labels = {
      labeled: 'Labeled',
      pending: 'Pending',
      unlabeled: 'Needs Label'
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 bg-white border-r border-gray-200">
        <SideBar />
      </div>

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
              <p className="text-gray-600 mt-1">
                Manage and categorize your business transactions
                {stats && (
                  <span className="ml-2 text-sm">
                    • {stats.total_transactions} total • {stats.unlabeled_count} unlabeled
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                <Upload className="h-4 w-4" />
                <span>Import CSV</span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => e.target.files[0] && handleImportCSV(e.target.files[0])}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleAddTransaction}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Transaction</span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Filters & Search */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>

              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="labeled">Labeled</option>
                  <option value="pending">Pending</option>
                  <option value="unlabeled">Unlabeled</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>

              <div className="relative">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="last7">Last 7 days</option>
                  <option value="last30">Last 30 days</option>
                  <option value="last90">Last 90 days</option>
                  <option value="this_month">This month</option>
                  <option value="last_month">Last month</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Filter className="h-4 w-4" />
                <span>More Filters</span>
              </button>
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedTransactions.length > 0 && (
          <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-blue-900">
                  {selectedTransactions.length} transaction{selectedTransactions.length > 1 ? 's' : ''} selected
                </span>
                <button
                  onClick={() => setSelectedTransactions([])}
                  className="text-sm text-blue-700 hover:text-blue-800 font-medium"
                >
                  Clear selection
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkAction('change_status', { status: 'labeled' })}
                  disabled={bulkActionLoading}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-1"
                >
                  {bulkActionLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                  <span>Label as...</span>
                </button>
                <button
                  onClick={() => handleBulkAction('export')}
                  className="px-3 py-1 text-sm bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Export selected
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  disabled={bulkActionLoading}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span className="text-gray-600">Loading transactions...</span>
            </div>
          </div>
        )}

        {/* Transaction Table */}
        {!loading && (
          <div className="flex-1 overflow-auto">
            <div className="bg-white">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedTransactions.length === transactions.length && transactions.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button className="flex items-center space-x-1 hover:text-gray-700">
                        <span>Date</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button className="flex items-center space-x-1 hover:text-gray-700">
                        <span>Amount</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      VAT
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
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedTransactions.includes(transaction.id)}
                          onChange={() => handleSelectTransaction(transaction.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          {formatDate(transaction.date)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex items-center">
                          <div>
                            <div className="font-medium">{transaction.description}</div>
                            <div className="text-gray-500">{transaction.account_name}</div>
                          </div>
                          {transaction.has_receipt && (
                            <FileText className="h-4 w-4 text-blue-600 ml-2" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.category_name || (
                          <span className="text-gray-400 italic">Uncategorized</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={transaction.transaction_type === 'expense' ? 'text-red-600' : 'text-green-600'}>
                          {transaction.formatted_amount}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        €{parseFloat(transaction.vat_amount || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(transaction.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewTransaction(transaction)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditTransaction(transaction)}
                            className="text-gray-600 hover:text-gray-800 transition-colors"
                            title="Edit Transaction"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTransaction(transaction.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Delete Transaction"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600 transition-colors">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Empty state */}
              {transactions.length === 0 && !loading && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
                  <p className="text-gray-500 mb-6">Try adjusting your filters or import some transactions.</p>
                  <button
                    onClick={handleAddTransaction}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    Add Transaction
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer/Pagination */}
        {!loading && transactions.length > 0 && (
          <div className="bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">
                  {(pagination.current_page - 1) * 20 + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(pagination.current_page * 20, pagination.count)}
                </span>{' '}
                of <span className="font-medium">{pagination.count}</span> transactions
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => fetchTransactions(pagination.current_page - 1)}
                  disabled={!pagination.previous}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {/* Page numbers */}
                {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => fetchTransactions(pageNum)}
                      className={`px-3 py-1 text-sm rounded ${pagination.current_page === pageNum
                        ? 'bg-orange-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {pagination.total_pages > 5 && (
                  <>
                    <span className="px-2 text-gray-500">...</span>
                    <button
                      onClick={() => fetchTransactions(pagination.total_pages)}
                      className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                    >
                      {pagination.total_pages}
                    </button>
                  </>
                )}

                <button
                  onClick={() => fetchTransactions(pagination.current_page + 1)}
                  disabled={!pagination.next}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Transaction"
        size="lg"
      >
        <TransactionForm
          onSubmit={handleSubmitForm}
          loading={formLoading}
          formData={formData}
          setFormData={setFormData}
          accounts={accounts}
          categories={categories}
          onClose={() => setShowAddModal(false)}
        />
      </Modal>

      {/* Edit Transaction Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Transaction"
        size="lg"
      >
        <TransactionForm
          onSubmit={handleSubmitForm}
          loading={formLoading}
          formData={formData}
          setFormData={setFormData}
          accounts={accounts}
          categories={categories}
          isEdit={true}
          onClose={() => setShowEditModal(false)}
        />
      </Modal>

      {/* View Transaction Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Transaction Details"
        size="lg"
      >
        <TransactionDetailView
          transaction={selectedTransaction}
          loading={formLoading}
          onEdit={() => {
            setShowViewModal(false);
            handleEditTransaction(selectedTransaction);
          }}
          onDelete={() => {
            setShowViewModal(false);
            handleDeleteTransaction(selectedTransaction.id);
          }}
        />
      </Modal>
    </div>
  );
};

export default TransactionsPage;