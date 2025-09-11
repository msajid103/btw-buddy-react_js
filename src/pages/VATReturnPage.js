import React, { useState } from 'react';
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
} from 'lucide-react';
import { SideBar } from '../components/common/SideBar';

const VATReturnPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Q3 2025');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  
  // VAT calculation data
  const vatData = {
    'Q3 2025': {
      sales: {
        standardRate: { amount: 15420.50, vat: 3238.31 },
        reducedRate: { amount: 850.00, vat: 76.50 },
        zeroRate: { amount: 1200.00, vat: 0 },
        exempt: { amount: 0, vat: 0 }
      },
      purchases: {
        standardRate: { amount: 8750.00, vat: 1837.50 },
        reducedRate: { amount: 0, vat: 0 },
        zeroRate: { amount: 0, vat: 0 },
        capital: { amount: 2500.00, vat: 525.00 }
      },
      adjustments: 0,
      previousCorrections: 0
    },
    'Q2 2025': {
      sales: {
        standardRate: { amount: 15420.50, vat: 3238.31 },
        reducedRate: { amount: 850.00, vat: 76.50 },
        zeroRate: { amount: 1200.00, vat: 0 },
        exempt: { amount: 0, vat: 0 }
      },
      purchases: {
        standardRate: { amount: 8750.00, vat: 1837.50 },
        reducedRate: { amount: 0, vat: 0 },
        zeroRate: { amount: 0, vat: 0 },
        capital: { amount: 2500.00, vat: 525.00 }
      },
      adjustments: 0,
      previousCorrections: 0
    },
    'Q1 2025': {
      sales: {
        standardRate: { amount: 15420.50, vat: 3238.31 },
        reducedRate: { amount: 850.00, vat: 76.50 },
        zeroRate: { amount: 1200.00, vat: 0 },
        exempt: { amount: 0, vat: 0 }
      },
      purchases: {
        standardRate: { amount: 8750.00, vat: 1837.50 },
        reducedRate: { amount: 0, vat: 0 },
        zeroRate: { amount: 0, vat: 0 },
        capital: { amount: 2500.00, vat: 525.00 }
      },
      adjustments: 0,
      previousCorrections: 0
    }
  };

  const currentData = vatData[selectedPeriod];
  const totalSalesVAT = Object.values(currentData.sales).reduce((sum, item) => sum + item.vat, 0);
  const totalPurchasesVAT = Object.values(currentData.purchases).reduce((sum, item) => sum + item.vat, 0);
  const netVAT = totalSalesVAT - totalPurchasesVAT + currentData.adjustments + currentData.previousCorrections;

  const [previousReturns] = useState([
    {
      id: 'VAT-2025-Q2',
      period: 'Q2 2025',
      dueDate: '2025-07-31',
      submittedDate: '2025-07-28',
      status: 'submitted',
      amount: 892.45,
      vatOwed: 892.45,
      vatReclaim: 0
    },
    {
      id: 'VAT-2025-Q1',
      period: 'Q1 2025',
      dueDate: '2025-04-30',
      submittedDate: '2025-04-25',
      status: 'paid',
      amount: 1245.80,
      vatOwed: 1245.80,
      vatReclaim: 0
    },
    {
      id: 'VAT-2024-Q4',
      period: 'Q4 2024',
      dueDate: '2025-01-31',
      submittedDate: '2025-01-29',
      status: 'paid',
      amount: -156.30,
      vatOwed: 890.20,
      vatReclaim: 1046.50
    }
  ]);

  const quickStats = [
    {
      title: 'VAT to Pay',
      amount: `€${netVAT.toFixed(2)}`,
      change: netVAT >= 0 ? 'Amount owed' : 'Reclaim due',
      icon: Euro,
      trend: netVAT >= 0 ? 'up' : 'down',
      color: netVAT >= 0 ? 'text-red-600' : 'text-green-600',
      bgColor: netVAT >= 0 ? 'bg-red-50' : 'bg-green-50',
      iconColor: netVAT >= 0 ? 'text-red-600' : 'text-green-600'
    },
    {
      title: 'Sales VAT',
      amount: `€${totalSalesVAT.toFixed(2)}`,
      change: 'Output VAT collected',
      icon: TrendingUp,
      trend: 'up',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Purchase VAT',
      amount: `€${totalPurchasesVAT.toFixed(2)}`,
      change: 'Input VAT reclaimable',
      icon: TrendingDown,
      trend: 'down',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Return Status',
      amount: 'Draft',
      change: 'Ready to submit',
      icon: CheckCircle,
      trend: 'ready',
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      iconColor: 'text-primary-600'
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { color: 'bg-yellow-100 text-yellow-800', text: 'Draft' },
      submitted: { color: 'bg-blue-100 text-blue-800', text: 'Submitted' },
      paid: { color: 'bg-green-100 text-green-800', text: 'Paid' },
      overdue: { color: 'bg-red-100 text-red-800', text: 'Overdue' }
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const handleSubmit = () => {
    // Here you would typically submit to the API
    console.log('Submitting VAT return for', selectedPeriod);
    setShowSubmitModal(false);
    // Show success message or redirect
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
                VAT Return 📊
              </h1>
              <p className="text-gray-600 mt-1">Doeksen Digital • Prepare and submit VAT returns</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Download className="h-4 w-4" />
                <span>Export PDF</span>
              </button>
              <button 
                onClick={() => setShowSubmitModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
              >
                <Send className="h-4 w-4" />
                <span>Submit Return</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* VAT Return Status */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">VAT Return {selectedPeriod}</h2>
                <p className="text-primary-100 flex items-center">
                  {netVAT >= 0 
                    ? `€${netVAT.toFixed(2)} VAT to pay by Oct 31, 2025`
                    : `€${Math.abs(netVAT).toFixed(2)} VAT reclaim expected`
                  }
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold mb-1">Ready</div>
                <div className="text-primary-100 text-sm">to submit</div>
              </div>
            </div>
            <div className="mt-4 bg-white/20 rounded-full h-2">
              <div className="bg-white h-2 rounded-full w-full"></div>
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
                      <h3 className="text-lg font-semibold text-gray-900">VAT Calculation - {selectedPeriod}</h3>
                    </div>
                    <select
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="Q3 2025">Q3 2025</option>
                      <option value="Q2 2025">Q2 2025</option>
                      <option value="Q1 2025">Q1 2025</option>
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
                        <div className="text-sm font-medium text-gray-900">€{currentData.sales.standardRate.amount.toFixed(2)}</div>
                        <div className="text-xs text-green-600">+€{currentData.sales.standardRate.vat.toFixed(2)} VAT</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="text-sm font-medium text-gray-900">Reduced Rate (9%)</span>
                        <p className="text-xs text-gray-500">Food, books, medicines</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">€{currentData.sales.reducedRate.amount.toFixed(2)}</div>
                        <div className="text-xs text-green-600">+€{currentData.sales.reducedRate.vat.toFixed(2)} VAT</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="text-sm font-medium text-gray-900">Zero Rate (0%)</span>
                        <p className="text-xs text-gray-500">Exports, certain supplies</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">€{currentData.sales.zeroRate.amount.toFixed(2)}</div>
                        <div className="text-xs text-gray-600">€{currentData.sales.zeroRate.vat.toFixed(2)} VAT</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">Total Output VAT</span>
                      <span className="text-lg font-bold text-green-600">€{totalSalesVAT.toFixed(2)}</span>
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
                        <div className="text-sm font-medium text-gray-900">€{currentData.purchases.standardRate.amount.toFixed(2)}</div>
                        <div className="text-xs text-blue-600">-€{currentData.purchases.standardRate.vat.toFixed(2)} VAT</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="text-sm font-medium text-gray-900">Capital Goods</span>
                        <p className="text-xs text-gray-500">Equipment, machinery, vehicles</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">€{currentData.purchases.capital.amount.toFixed(2)}</div>
                        <div className="text-xs text-blue-600">-€{currentData.purchases.capital.vat.toFixed(2)} VAT</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">Total Input VAT</span>
                      <span className="text-lg font-bold text-blue-600">€{totalPurchasesVAT.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Final Calculation */}
                <div className="p-6">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Output VAT (Sales)</span>
                        <span className="text-sm font-medium">€{totalSalesVAT.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Input VAT (Purchases)</span>
                        <span className="text-sm font-medium">-€{totalPurchasesVAT.toFixed(2)}</span>
                      </div>
                      {currentData.adjustments !== 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Adjustments</span>
                          <span className="text-sm font-medium">€{currentData.adjustments.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="border-t border-gray-300 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-gray-900">
                            {netVAT >= 0 ? 'VAT to Pay' : 'VAT Reclaim'}
                          </span>
                          <span className={`text-xl font-bold ${netVAT >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                            €{Math.abs(netVAT).toFixed(2)}
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
                    className="w-full flex items-center justify-between p-3 text-left bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-200"
                  >
                    <div className="flex items-center space-x-3">
                      <Send className="h-5 w-5 text-orange-600" />
                      <span className="font-medium text-orange-900">Submit Return</span>
                    </div>
                    <span className="text-orange-600">→</span>
                  </button>
                  <button className="w-full flex items-center justify-between p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
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
                  <button className="w-full flex items-center justify-between p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <Edit className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Edit Details</span>
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
                  <div className="space-y-4">
                    {previousReturns.slice(0, 3).map((returnItem) => (
                      <div key={returnItem.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{returnItem.period}</p>
                            <p className="text-xs text-gray-500">Due: {returnItem.dueDate}</p>
                          </div>
                          {getStatusBadge(returnItem.status)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            {returnItem.amount >= 0 ? 'Paid' : 'Reclaimed'}
                          </span>
                          <span className={`text-sm font-medium ${returnItem.amount >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                            €{Math.abs(returnItem.amount).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
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
                      <span className="text-sm text-gray-600">Period End</span>
                      <span className="text-sm font-medium">Sep 30, 2025</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Submission Due</span>
                      <span className="text-sm font-medium text-orange-600">Oct 31, 2025</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Payment Due</span>
                      <span className="text-sm font-medium text-red-600">Oct 31, 2025</span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Days Remaining</span>
                        <span className="text-sm font-bold text-orange-600">27 days</span>
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
                className="text-gray-400 hover:text-gray-600"
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
                      You are about to submit your VAT return for {selectedPeriod}. This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Return Summary:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Period:</span>
                    <span className="font-medium">{selectedPeriod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Output VAT:</span>
                    <span className="font-medium">€{totalSalesVAT.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Input VAT:</span>
                    <span className="font-medium">€{totalPurchasesVAT.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 mt-2">
                    <span className="font-medium text-gray-900">
                      {netVAT >= 0 ? 'Amount to Pay:' : 'Reclaim Amount:'}
                    </span>
                    <span className={`font-bold ${netVAT >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                      €{Math.abs(netVAT).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Submit Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VATReturnPage;