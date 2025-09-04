import React, { useState, useRef } from 'react';
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
  TrendingUp
} from 'lucide-react';
import { SideBar } from '../components/dashboard/SideBar';

const ReceiptPage = () => {
  const [receipts, setReceipts] = useState([
    {
      id: 1,
      fileName: 'invoice_2024_001.pdf',
      uploadDate: '2024-03-15',
      supplier: 'Office Supplies BV',
      amount: 245.50,
      date: '2024-03-14',
      vatRate: 21,
      category: 'Office Supplies',
      linkedTransaction: 'TXN-789456',
      status: 'processed',
      fileType: 'pdf'
    },
    {
      id: 2,
      fileName: 'receipt_hardware_store.jpg',
      uploadDate: '2024-03-14',
      supplier: 'Hardware Store',
      amount: 89.99,
      date: '2024-03-14',
      vatRate: 21,
      category: 'Equipment',
      linkedTransaction: null,
      status: 'pending',
      fileType: 'jpg'
    },
    {
      id: 3,
      fileName: 'fuel_receipt.png',
      uploadDate: '2024-03-13',
      supplier: 'Shell Station',
      amount: 75.20,
      date: '2024-03-13',
      vatRate: 21,
      category: 'Transport',
      linkedTransaction: 'TXN-789123',
      status: 'processed',
      fileType: 'png'
    }
  ]);

  const [selectedReceipts, setSelectedReceipts] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Mock transactions for linking
  const [availableTransactions] = useState([
    { id: 'TXN-789456', date: '2024-03-14', amount: -245.50, description: 'Office Supplies BV' },
    { id: 'TXN-789123', date: '2024-03-13', amount: -75.20, description: 'Shell Station' },
    { id: 'TXN-788999', date: '2024-03-12', amount: -150.00, description: 'Software License' },
    { id: 'TXN-788777', date: '2024-03-11', amount: -89.99, description: 'Equipment Purchase' }
  ]);

  const quickStats = [
    {
      title: 'Total Receipts',
      amount: receipts.length.toString(),
      change: '+3 this month',
      icon: FileText,
      trend: 'up',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Processed',
      amount: receipts.filter(r => r.status === 'processed').length.toString(),
      change: `${Math.round((receipts.filter(r => r.status === 'processed').length / receipts.length) * 100)}% complete`,
      icon: Check,
      trend: 'up',
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      iconColor: 'text-primary-600'
    },
    {
      title: 'Pending Review',
      amount: receipts.filter(r => r.status === 'pending').length.toString(),
      change: 'Needs attention',
      icon: AlertCircle,
      trend: 'neutral',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
    {
      title: 'Total Amount',
      amount: `€${receipts.reduce((sum, r) => sum + r.amount, 0).toFixed(2)}`,
      change: 'This period',
      icon: Euro,
      trend: 'neutral',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    }
  ];

  const handleFileUpload = (files) => {
    const newReceipts = Array.from(files).map((file, index) => ({
      id: receipts.length + index + 1,
      fileName: file.name,
      uploadDate: new Date().toISOString().split('T')[0],
      supplier: '',
      amount: 0,
      date: '',
      vatRate: 21,
      category: '',
      linkedTransaction: null,
      status: 'pending',
      fileType: file.type.includes('pdf') ? 'pdf' : file.type.includes('image') ? 'jpg' : 'other'
    }));
    
    setReceipts([...receipts, ...newReceipts]);
    setShowUploadModal(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const filteredReceipts = receipts.filter(receipt => {
    const matchesSearch = receipt.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         receipt.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || receipt.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const toggleReceiptSelection = (receiptId) => {
    setSelectedReceipts(prev => 
      prev.includes(receiptId) 
        ? prev.filter(id => id !== receiptId)
        : [...prev, receiptId]
    );
  };

  const linkReceiptToTransaction = (receiptId, transactionId) => {
    setReceipts(prev => prev.map(receipt => 
      receipt.id === receiptId 
        ? { ...receipt, linkedTransaction: transactionId, status: 'processed' }
        : receipt
    ));
    setShowLinkModal(false);
    setSelectedReceipt(null);
  };

  const getFileIcon = (fileType) => {
    return <FileText className="h-5 w-5 text-blue-500" />;
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
                Receipt Management
              </h1>
              <p className="text-gray-600 mt-1">Upload and manage your receipts</p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowUploadModal(true)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Upload className="h-4 w-4" />
                <span>Upload receipt</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors">
                <Link2 className="h-4 w-4" />
                <span>Bulk link</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Receipt Progress Status */}
          {/* <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">Receipt Processing Status</h2>
                <p className="text-primary-100 flex items-center">
                  {receipts.filter(r => r.status === 'pending').length > 0 
                    ? `${receipts.filter(r => r.status === 'pending').length} receipts need attention`
                    : 'All receipts processed! 🎉'
                  }
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold mb-1">
                  {Math.round((receipts.filter(r => r.status === 'processed').length / receipts.length) * 100)}%
                </div>
                <div className="text-primary-100 text-sm">processed</div>
              </div>
            </div>
            <div className="mt-4 bg-white/20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(receipts.filter(r => r.status === 'processed').length / receipts.length) * 100}%` }}
              ></div>
            </div>
          </div> */}

          {/* Stats Grid */}
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
                    </div>
                    {selectedReceipts.length > 0 && (
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                          Bulk Link
                        </button>
                        <button className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700">
                          Delete
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
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="processed">Processed</option>
                      <option value="pending">Pending</option>
                      <option value="error">Error</option>
                    </select>
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
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedReceipts(filteredReceipts.map(r => r.id));
                              } else {
                                setSelectedReceipts([]);
                              }
                            }}
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
                      {filteredReceipts.map((receipt) => (
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
                              {getFileIcon(receipt.fileType)}
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {receipt.fileName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {receipt.uploadDate}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{receipt.supplier || 'Not extracted'}</div>
                            <div className="text-sm text-gray-500">{receipt.category}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              €{receipt.amount.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-500">
                              VAT {receipt.vatRate}%
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-1">
                              {getStatusBadge(receipt.status)}
                              {receipt.linkedTransaction ? (
                                <div className="text-xs text-blue-600 flex items-center">
                                  <Link2 className="h-3 w-3 mr-1" />
                                  {receipt.linkedTransaction}
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
                              <button className="text-blue-600 hover:text-blue-800">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-800">
                                <Download className="h-4 w-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-800">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
                  <button className="w-full flex items-center justify-between p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <Link2 className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Auto-link receipts</span>
                    </div>
                    <span className="text-gray-400">→</span>
                  </button>
                  <button className="w-full flex items-center justify-between p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <Download className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Export receipts</span>
                    </div>
                    <span className="text-gray-400">→</span>
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
                    {receipts.slice(0, 3).map((receipt) => (
                      <div key={receipt.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 p-1 rounded-full bg-gray-100">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{receipt.fileName}</p>
                          <p className="text-sm text-gray-600">{receipt.supplier || 'Processing...'}</p>
                        </div>
                        <span className="text-xs text-gray-500 flex-shrink-0">{receipt.uploadDate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Upload Receipts</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                Drag and drop files here, or click to select
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Select Files
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Supported formats: JPG, PNG, PDF
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Link Transaction Modal */}
      {showLinkModal && selectedReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Link Receipt to Transaction
              </h3>
              <button
                onClick={() => setShowLinkModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900">Selected Receipt:</h4>
              <p className="text-sm text-gray-600">{selectedReceipt.fileName}</p>
              <p className="text-sm text-gray-600">Amount: €{selectedReceipt.amount}</p>
            </div>

            <div className="max-h-60 overflow-y-auto">
              <h4 className="font-medium text-gray-900 mb-3">Available Transactions:</h4>
              {availableTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="border rounded-lg p-3 mb-2 hover:bg-gray-50 cursor-pointer"
                  onClick={() => linkReceiptToTransaction(selectedReceipt.id, transaction.id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{transaction.id}</p>
                      <p className="text-sm text-gray-600">{transaction.description}</p>
                      <p className="text-xs text-gray-500">{transaction.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        €{Math.abs(transaction.amount).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptPage;