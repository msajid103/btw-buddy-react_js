import React from 'react';
import { 
  Edit,
  Calendar,
  Loader2,
  Building,
  Tag,
  Receipt,
  Trash2
} from 'lucide-react';

const TransactionDetailView = ({ transaction, loading, onEdit,onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // const formatCurrency = (amount) => {
  //   return new Intl.NumberFormat('en-US', {
  //     style: 'currency',
  //     currency: 'EUR'
  //   }).format(amount);
  // };

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

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!transaction) return null;

  return (

    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
            <p className="text-lg font-semibold text-gray-900">{transaction.description}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Amount</label>
            <p className={`text-2xl font-bold ${transaction.transaction_type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
              {transaction.formatted_amount || `€${transaction.amount}`}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Date</label>
            <p className="text-gray-900 flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              {formatDate(transaction.date)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
            <div>{getStatusBadge(transaction.status)}</div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Account</label>
            <p className="text-gray-900 flex items-center">
              <Building className="h-4 w-4 mr-2 text-gray-400" />
              {transaction.account_name || 'Not specified'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Category</label>
            <p className="text-gray-900 flex items-center">
              <Tag className="h-4 w-4 mr-2 text-gray-400" />
              {transaction.category_name || 'Uncategorized'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">VAT Amount</label>
            <p className="text-gray-900">€{parseFloat(transaction.vat_amount || 0).toFixed(2)}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Type</label>
            <p className="text-gray-900 capitalize">{transaction.transaction_type}</p>
          </div>
        </div>
      </div>

      {/* Receipt Info */}
      {transaction.has_receipt && (
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center space-x-2 text-blue-600">
            <Receipt className="h-5 w-5" />
            <span className="font-medium">Receipt Available</span>
          </div>
        </div>
      )}

      {/* Notes */}
      {transaction.notes && (
        <div className="border-t border-gray-200 pt-6">
          <label className="block text-sm font-medium text-gray-500 mb-2">Notes</label>
          <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{transaction.notes}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
        >
          <Edit className="h-4 w-4" />
          <span>Edit Transaction</span>
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete</span>
        </button>
      </div>
    </div>

  );
};

export default TransactionDetailView;