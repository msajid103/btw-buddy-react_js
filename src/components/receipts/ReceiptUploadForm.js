import React, { useState, useRef } from 'react';
import { Upload, X, AlertCircle, Plus, Link2 } from 'lucide-react';

const ReceiptUploadForm = ({ 
  onSubmit, 
  loading, 
  onClose,
  transactions = [],
  categories = [],
  preselectedTransaction = null
}) => {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    supplier: '',
    amount: '',
    receipt_date: '',
    category: '',
    transaction: preselectedTransaction || '',
    vat_rate: '21.00'
  });
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const handleFileChange = (selectedFiles) => {
    const validFiles = Array.from(selectedFiles).filter(file => {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      return validTypes.includes(file.type) && file.size <= maxSize;
    });

    setFiles(prevFiles => [...prevFiles, ...validFiles]);
    setErrors(prev => ({ ...prev, files: null }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = e.dataTransfer.files;
    handleFileChange(droppedFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (files.length === 0) {
      newErrors.files = 'Please select at least one file';
    }

    if (formData.amount && isNaN(parseFloat(formData.amount))) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (formData.receipt_date && new Date(formData.receipt_date) > new Date()) {
      newErrors.receipt_date = 'Receipt date cannot be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const submitData = {
      files,
      metadata: {
        ...formData,
        amount: formData.amount ? parseFloat(formData.amount) : null,
        category: formData.category || null,
        transaction: formData.transaction || null,
        vat_rate: parseFloat(formData.vat_rate)
      }
    };

    await onSubmit(submitData);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file) => {
    if (file.type === 'application/pdf') {
      return <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center text-red-600 text-xs font-bold">PDF</div>;
    }
    return <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-blue-600 text-xs font-bold">IMG</div>;
  };

  return (
    <div className="space-y-6">
      {/* File Upload Area */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Files *
        </label>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver 
              ? 'border-blue-500 bg-blue-50' 
              : errors.files 
                ? 'border-red-300 bg-red-50' 
                : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className={`h-8 w-8 mx-auto mb-2 ${errors.files ? 'text-red-400' : 'text-gray-400'}`} />
          <p className={`text-sm mb-2 ${errors.files ? 'text-red-600' : 'text-gray-600'}`}>
            Drag and drop files here, or click to select
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={(e) => handleFileChange(e.target.files)}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              errors.files 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-orange-600 hover:bg-orange-700 text-white'
            }`}
          >
            Select Files
          </button>
          <p className="text-xs text-gray-500 mt-1">
            Supported: JPG, PNG, PDF (max 10MB each)
          </p>
        </div>
        {errors.files && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.files}
          </p>
        )}
      </div>

      {/* Selected Files */}
      {files.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Selected Files ({files.length})
          </h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getFileIcon(file)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Supplier */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Supplier
          </label>
          <input
            type="text"
            name="supplier"
            value={formData.supplier}
            onChange={handleInputChange}
            placeholder="Enter supplier name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount (€)
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.amount ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
          )}
        </div>

        {/* Receipt Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Receipt Date
          </label>
          <input
            type="date"
            name="receipt_date"
            value={formData.receipt_date}
            onChange={handleInputChange}
            max={new Date().toISOString().split('T')[0]}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.receipt_date ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.receipt_date && (
            <p className="mt-1 text-sm text-red-600">{errors.receipt_date}</p>
          )}
        </div>

        {/* VAT Rate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            VAT Rate (%)
          </label>
          <select
            name="vat_rate"
            value={formData.vat_rate}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="0">0% (Exempt)</option>
            <option value="9">9% (Low rate)</option>
            <option value="21">21% (Standard rate)</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Transaction Link */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Link to Transaction (Optional)
          </label>
          <select
            name="transaction"
            value={formData.transaction}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select transaction</option>
            {transactions.map(transaction => (
              <option key={transaction.id} value={transaction.id}>
                {transaction.date} - {transaction.description} - {transaction.formatted_amount}
              </option>
            ))}
          </select>
          {formData.transaction && (
            <div className="mt-1 text-xs text-blue-600 flex items-center">
              <Link2 className="h-3 w-3 mr-1" />
              Will be automatically linked and marked as processed
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || files.length === 0}
          className="flex items-center space-x-2 px-6 py-2 bg-orange-600  text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              <span>Upload Receipt{files.length > 1 ? 's' : ''}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ReceiptUploadForm;