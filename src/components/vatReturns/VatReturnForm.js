// components/VatReturnForm.js
import React, { useState, useEffect } from 'react';
import vatReturnService from '../../services/vatReturnService';

const VatReturnForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    period_type: 'quarterly',
    period_year: new Date().getFullYear(),
    period_quarter: Math.floor((new Date().getMonth()) / 3) + 1,
    start_date: '',
    end_date: '',
    due_date: ''
  });

  const [periods, setPeriods] = useState([]);

  useEffect(() => {
    loadPeriodSuggestions();
  }, []);

  const loadPeriodSuggestions = async () => {
    try {
      const response = await vatReturnService.getCurrentPeriod();
      setFormData(prev => ({
        ...prev,
        ...response.data
      }));
    } catch (error) {
      console.error('Error loading period suggestions:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Period Type</label>
          <select
            value={formData.period_type}
            onChange={(e) => setFormData({...formData, period_type: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="quarterly">Quarterly</option>
            <option value="monthly">Monthly</option>
            <option value="annual">Annual</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Year</label>
          <input
            type="number"
            value={formData.period_year}
            onChange={(e) => setFormData({...formData, period_year: parseInt(e.target.value)})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Additional form fields for dates */}
      
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create Return
        </button>
      </div>
    </form>
  );
};

export default VatReturnForm;