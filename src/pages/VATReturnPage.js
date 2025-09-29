import React, { useState, useEffect } from 'react';
import {
  Calculator,
  FileText,
  Download,
  Send,
  CheckCircle,
  AlertTriangle,
  Clock,
  Euro,
  TrendingUp,
  TrendingDown,
  Calendar,
  Edit,
  Printer,
  X,
  RefreshCw,
  Loader
} from 'lucide-react';
import { SideBar } from '../components/common/SideBar';
import VATReturnService from '../services/VATReturnService';
import { transactionService } from '../services/transactionService';

const VATReturnPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [availablePeriods, setAvailablePeriods] = useState([]);
  const [currentVATReturn, setCurrentVATReturn] = useState(null);
  const [previousReturns, setPreviousReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    initializePage();
  }, []);

  useEffect(() => {
    if (selectedPeriod) {
      loadVATReturnForPeriod();
    }
  }, [selectedPeriod]);

  const initializePage = async () => {
    try {
      setLoading(true);

      // Load available periods
      const periods = await VATReturnService.getAvailablePeriods();
      setAvailablePeriods(periods);

      // Set current period as default
      const currentPeriod = periods.find(p => p.is_current);
      if (currentPeriod) {
        setSelectedPeriod(`${currentPeriod.period} ${currentPeriod.year}`);
      } else if (periods.length > 0) {
        setSelectedPeriod(`${periods[0].period} ${periods[0].year}`);
      }

      // Load previous returns
      await loadPreviousReturns();

    } catch (err) {
      console.error('Error initializing page:', err);
      setError('Failed to load VAT return data');
    } finally {
      setLoading(false);
    }
  };

  const loadVATReturnForPeriod = async () => {
    try {
      if (!selectedPeriod) return;

      const { period, year } = VATReturnService.parsePeriodString(selectedPeriod);

      // Get or create VAT return for the selected period
      const vatReturn = await VATReturnService.getOrCreateVATReturn(period, year);
      setCurrentVATReturn(vatReturn);
      setError(null);

    } catch (err) {
      console.error('Error loading VAT return:', err);
      setError('Failed to load VAT return for selected period');
    }
  };

  const loadPreviousReturns = async () => {
    try {
      const response = await VATReturnService.getVATReturns();
      // Take the last 3 returns, excluding current draft
      const returns = response.results || response;
      const filteredReturns = returns
        .filter(r => r.status !== 'draft')
        .slice(0, 3);
      setPreviousReturns(filteredReturns);
    } catch (err) {
      console.error('Error loading previous returns:', err);
    }
  };

  const handleRecalculate = async () => {
    if (!currentVATReturn) return;

    try {
      setLoading(true);
      const updatedReturn = await VATReturnService.recalculateVATReturn(currentVATReturn.id);
      setCurrentVATReturn(updatedReturn.data);
    } catch (err) {
      console.error('Error recalculating:', err);
      setError('Failed to recalculate VAT return');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!currentVATReturn) return;

    try {
      setSubmitLoading(true);
      await VATReturnService.submitVATReturn(currentVATReturn.id);

      // Refresh the return data
      await loadVATReturnForPeriod();
      await loadPreviousReturns();

      setShowSubmitModal(false);
    } catch (err) {
      console.error('Error submitting VAT return:', err);
      setError('Failed to submit VAT return');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!currentVATReturn) return;

    try {
      await VATReturnService.exportVATReturnPDF(currentVATReturn.id);
    } catch (err) {
      console.error('Error exporting PDF:', err);
      setError('Failed to export PDF');
    }
  };

  const getStatusBadge = (status) => {
    const config = VATReturnService.getStatusBadgeConfig(status);
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const formatAmount = (amount) => {
    return VATReturnService.formatVATAmount(amount || 0);
  };

  // Show loading state
  if (loading && !currentVATReturn) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <SideBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader className="h-6 w-6 animate-spin" />
            <span>Loading VAT return data...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !currentVATReturn) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <SideBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={initializePage}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentVATReturn) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <SideBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No VAT Return Data</h2>
            <p className="text-gray-600">Please select a period to view VAT return information.</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate totals and values from the VAT return data with safe defaults
  const totalSalesVAT = currentVATReturn?.total_output_vat || 0;
  const totalPurchasesVAT = currentVATReturn?.total_input_vat || 0;
  const netVAT = currentVATReturn?.net_vat || 0; // Note: changed from net_vat to net_vat_due to match your service
  const daysUntilDue = currentVATReturn?.due_date ?
    VATReturnService.calculateDaysUntilDue(currentVATReturn.due_date) : 30; // Default 30 days
  const quickStats = [
    {
      title: 'VAT to Pay',
      amount: formatAmount(netVAT),
      change: netVAT >= 0 ? 'Amount owed' : 'Reclaim due',
      icon: Euro,
      trend: netVAT >= 0 ? 'up' : 'down',
      color: netVAT >= 0 ? 'text-red-600' : 'text-green-600',
      bgColor: netVAT >= 0 ? 'bg-red-50' : 'bg-green-50',
      iconColor: netVAT >= 0 ? 'text-red-600' : 'text-green-600'
    },
    {
      title: 'Sales VAT',
      amount: formatAmount(totalSalesVAT),
      change: 'Output VAT collected',
      icon: TrendingUp,
      trend: 'up',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Purchase VAT',
      amount: formatAmount(totalPurchasesVAT),
      change: 'Input VAT reclaimable',
      icon: TrendingDown,
      trend: 'down',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Return Status',
      amount: currentVATReturn.status.charAt(0).toUpperCase() + currentVATReturn.status?.slice(1),
      change: currentVATReturn.status === 'draft' ? 'Ready to submit' : 'Completed',
      icon: CheckCircle,
      trend: 'ready',
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      iconColor: 'text-primary-600'
    }
  ];

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
                VAT Return 📊
              </h1>
              <p className="text-gray-600 mt-1">Prepare and submit VAT returns</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRecalculate}
                disabled={loading || currentVATReturn.status !== 'draft'}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Recalculate</span>
              </button>
              {/* <button 
                onClick={handleExportPDF}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export PDF</span>
              </button> */}
              <button
                onClick={() => setShowSubmitModal(true)}
                disabled={currentVATReturn.status !== 'draft'}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
                <span>Submit Return</span>
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

          {/* VAT Return Status */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">VAT Return {currentVATReturn.period_display}</h2>
                <p className="text-primary-100 flex items-center">
                  {netVAT >= 0
                    ? `${formatAmount(netVAT)} VAT to pay by ${new Date(currentVATReturn.due_date).toLocaleDateString()}`
                    : `${formatAmount(Math.abs(netVAT))} VAT reclaim expected`
                  }
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold mb-1">
                  {currentVATReturn.status.charAt(0).toUpperCase() + currentVATReturn.status.slice(1)}
                </div>
                <div className="text-primary-100 text-sm">
                  {daysUntilDue > 0 ? `${daysUntilDue} days remaining` :
                    daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` :
                      'Due today'}
                </div>
              </div>
            </div>
            <div className="mt-4 bg-white/20 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{
                  width: currentVATReturn.status === 'draft' ? '80%' : '100%'
                }}
              ></div>
            </div>
          </div>

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
            {/* VAT Calculation */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calculator className="h-5 w-5 text-primary-600" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        VAT Calculation - {currentVATReturn.period_display}
                      </h3>
                    </div>
                    <select
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {availablePeriods.map((period) => (
                        <option key={`${period.period}-${period.year}`} value={`${period.period} ${period.year}`}>
                          {period.display}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Sales (Output VAT) */}
                <div className="p-6 border-b border-gray-200">
                  <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                    Sales (Output VAT)
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="text-sm font-medium text-gray-900">Standard Rate (21%)</span>
                        <p className="text-xs text-gray-500">Goods and services at standard rate</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{formatAmount(currentVATReturn.sales_standard_rate)}</div>
                        <div className="text-xs text-green-600">+{formatAmount(currentVATReturn.output_vat_standard)} VAT</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="text-sm font-medium text-gray-900">Reduced Rate (9%)</span>
                        <p className="text-xs text-gray-500">Food, books, medicines</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{formatAmount(currentVATReturn.sales_reduced_rate)}</div>
                        <div className="text-xs text-green-600">+{formatAmount(currentVATReturn.output_vat_reduced)} VAT</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="text-sm font-medium text-gray-900">Zero Rate (0%)</span>
                        <p className="text-xs text-gray-500">Exports, certain supplies</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{formatAmount(currentVATReturn.sales_zero_rate)}</div>
                        <div className="text-xs text-gray-600">{formatAmount(currentVATReturn.output_vat_zero)} VAT</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">Total Output VAT</span>
                      <span className="text-lg font-bold text-green-600">{formatAmount(totalSalesVAT)}</span>
                    </div>
                  </div>
                </div>

                {/* Purchases (Input VAT) */}
                <div className="p-6 border-b border-gray-200">
                  <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                    <TrendingDown className="h-4 w-4 text-blue-600 mr-2" />
                    Purchases (Input VAT)
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="text-sm font-medium text-gray-900">Standard Rate (21%)</span>
                        <p className="text-xs text-gray-500">Business purchases and expenses</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{formatAmount(currentVATReturn.purchases_standard_rate)}</div>
                        <div className="text-xs text-blue-600">-{formatAmount(currentVATReturn.input_vat_standard)} VAT</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="text-sm font-medium text-gray-900">Capital Goods</span>
                        <p className="text-xs text-gray-500">Equipment, machinery, vehicles</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{formatAmount(currentVATReturn.purchases_capital)}</div>
                        <div className="text-xs text-blue-600">-{formatAmount(currentVATReturn.input_vat_capital)} VAT</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">Total Input VAT</span>
                      <span className="text-lg font-bold text-blue-600">{formatAmount(totalPurchasesVAT)}</span>
                    </div>
                  </div>
                </div>

                {/* Final Calculation */}
                <div className="p-6">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Output VAT (Sales)</span>
                        <span className="text-sm font-medium">{formatAmount(totalSalesVAT)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Input VAT (Purchases)</span>
                        <span className="text-sm font-medium">-{formatAmount(totalPurchasesVAT)}</span>
                      </div>
                      {currentVATReturn.adjustments !== 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Adjustments</span>
                          <span className="text-sm font-medium">{formatAmount(currentVATReturn.adjustments)}</span>
                        </div>
                      )}
                      <div className="border-t border-gray-300 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-gray-900">
                            {netVAT >= 0 ? 'VAT to Pay' : 'VAT Reclaim'}
                          </span>
                          <span className={`text-xl font-bold ${netVAT >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {formatAmount(Math.abs(netVAT))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Return Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Return Actions</h3>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <button
                    onClick={() => setShowSubmitModal(true)}
                    disabled={currentVATReturn.status !== 'draft'}
                    className="w-full flex items-center justify-between p-3 text-left bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center space-x-3">
                      <Send className="h-5 w-5 text-orange-600" />
                      <span className="font-medium text-orange-900">Submit Return</span>
                    </div>
                    <span className="text-orange-600">→</span>
                  </button>
                  <button
                    onClick={handleExportPDF}
                    className="w-full flex items-center justify-between p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Download className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Download PDF</span>
                    </div>
                    <span className="text-gray-400">→</span>
                  </button>
                  <button className="w-full flex items-center justify-between p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <Printer className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Print Return</span>
                    </div>
                    <span className="text-gray-400">→</span>
                  </button>
                  <button
                    onClick={handleRecalculate}
                    disabled={loading || currentVATReturn.status !== 'draft'}
                    className="w-full flex items-center justify-between p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center space-x-3">
                      <RefreshCw className={`h-5 w-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
                      <span className="font-medium text-gray-900">Recalculate</span>
                    </div>
                    <span className="text-gray-400">→</span>
                  </button>
                </div>
              </div>

              {/* Previous Returns */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Previous Returns</h3>
                  </div>
                </div>
                <div className="p-6">
                  {previousReturns.length > 0 ? (
                    <div className="space-y-4">
                      {previousReturns.map((returnItem) => (
                        <div key={returnItem.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{returnItem.period_display}</p>
                              <p className="text-xs text-gray-500">Due: {new Date(returnItem.due_date).toLocaleDateString()}</p>
                            </div>
                            {getStatusBadge(returnItem.status)}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              {returnItem.net_vat >= 0 ? 'Paid' : 'Reclaimed'}
                            </span>
                            <span className={`text-sm font-medium ${returnItem.net_vat >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {formatAmount(Math.abs(returnItem.net_vat))}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">No previous returns found</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Important Dates */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Important Dates</h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Period</span>
                      <span className="text-sm font-medium">{currentVATReturn.period_display}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Submission Due</span>
                      <span className={`text-sm font-medium ${daysUntilDue < 0 ? 'text-red-600' : daysUntilDue < 7 ? 'text-orange-600' : 'text-gray-900'}`}>
                        {new Date(currentVATReturn.due_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Payment Due</span>
                      <span className={`text-sm font-medium ${daysUntilDue < 0 ? 'text-red-600' : daysUntilDue < 7 ? 'text-orange-600' : 'text-gray-900'}`}>
                        {new Date(currentVATReturn.due_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Days Remaining</span>
                        <span className={`text-sm font-bold ${daysUntilDue < 0 ? 'text-red-600' : daysUntilDue < 7 ? 'text-orange-600' : 'text-green-600'}`}>
                          {daysUntilDue > 0 ? `${daysUntilDue} days` :
                            daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` :
                              'Due today'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Submit VAT Return</h3>
              <button
                onClick={() => setShowSubmitModal(false)}
                disabled={submitLoading}
                className="text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 mr-3" />
                  <div>
                    <h4 className="text-sm font-medium text-orange-800">Confirm Submission</h4>
                    <p className="text-sm text-orange-700 mt-1">
                      You are about to submit your VAT return for {currentVATReturn.period_display}. This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Return Summary:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Period:</span>
                    <span className="font-medium">{currentVATReturn.period_display}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Output VAT:</span>
                    <span className="font-medium">{formatAmount(totalSalesVAT)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Input VAT:</span>
                    <span className="font-medium">{formatAmount(totalPurchasesVAT)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 mt-2">
                    <span className="font-medium text-gray-900">
                      {netVAT >= 0 ? 'Amount to Pay:' : 'Reclaim Amount:'}
                    </span>
                    <span className={`font-bold ${netVAT >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {formatAmount(Math.abs(netVAT))}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                disabled={submitLoading}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitLoading}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitLoading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Return
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VATReturnPage;