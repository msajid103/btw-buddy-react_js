import React, { useState } from 'react';
import {
  CreditCard,
  Calculator,
  Upload,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Link2,
  Bell
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SideBar } from '../components/dashboard/SideBar';

const DashboardPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Q4 2024');



  const quickStats = [
    {
      title: 'Revenue this month',
      amount: '€23.00',
      change: '+12% vs previous month',
      icon: TrendingUp,
      trend: 'up',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Expenses this month',
      amount: '€34.00',
      change: '-6% vs previous month',
      icon: TrendingDown,
      trend: 'down',
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      iconColor: 'text-primary-600'
    },
    {
      title: 'VAT position',
      amount: '€55.00 to pay',
      change: '',
      icon: AlertTriangle,
      trend: 'neutral',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
    {
      title: 'Labeled transactions',
      amount: '100%',
      change: '11/11 complete',
      icon: CheckCircle,
      trend: 'complete',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    }
  ];

  const todoItems = [
    {
      id: 1,
      title: 'Link receipts',
      description: '2 receipts to link to transactions',
      count: 2,
      action: 'Link now',
      actionColor: 'bg-blue'
    },
    {
      id: 2,
      title: 'Check requirements',
      description: '',
      count: 2,
      action: 'Check',
      actionColor: 'bg-red'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'transaction',
      title: 'Transaction labeled',
      description: 'Computer shop Amsterdam - €1500.00',
      time: '19 aug',
      icon: CheckCircle,
      iconColor: 'text-green-600'
    },
    {
      id: 2,
      type: 'transaction',
      title: 'Transaction labeled',
      description: 'XYZ Company - €850.00',
      time: '19 aug',
      icon: CheckCircle,
      iconColor: 'text-green-600'
    },
    {
      id: 3,
      type: 'receipt',
      title: 'Receipt uploaded',
      description: 'KPN',
      time: '19 aug',
      icon: Upload,
      iconColor: 'text-purple-600'
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
                Welcome back! 👋
              </h1>
              <p className="text-gray-600 mt-1">Doeksen Digital • Q3 2025</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Upload className="h-4 w-4" />
                <span>Upload receipt</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors">
                <Calculator className="h-4 w-4" />
                <span>Start return</span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="flex-1 p-6">
          {/* VAT Return Status */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">VAT Return Q3 2025</h2>
                <p className="text-primary-100 flex items-center">
                  Ready to submit! 🎉
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold mb-1">100%</div>
                <div className="text-primary-100 text-sm">complete</div>
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
            {/* To Do Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    <h3 className="text-lg font-semibold text-gray-900">To Do</h3>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {todoItems.map((item) => (
                    <div key={item.id} className={`flex items-center justify-between p-4 ${item.actionColor}-100 rounded-lg`}>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-primary-100 rounded-lg">
                          <Link2 className="h-4 w-4 text-primary-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{item.title}</h4>
                          {item.description && (
                            <p className="text-sm text-gray-600">{item.description}</p>
                          )}
                        </div>
                        {item.count && (
                          <span className="bg-primary-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                            {item.count}
                          </span>
                        )}
                      </div>
                      <button className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${item.actionColor}-600 hover:${item.actionColor}-700`}>
                        {item.action}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 p-1 rounded-full bg-gray-100`}>
                        <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-600 truncate">{activity.description}</p>
                      </div>
                      <span className="text-xs text-gray-500 flex-shrink-0">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info Cards */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <Upload className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Upload receipts</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
                <button className="w-full flex items-center justify-between p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Import transactions</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
                <button className="w-full flex items-center justify-between p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <Calculator className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Generate VAT report</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
              </div>
            </div>

            {/* Period Selector */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reporting Period</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Period
                  </label>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="Q4 2024">Q4 2024</option>
                    <option value="Q3 2024">Q3 2024</option>
                    <option value="Q2 2024">Q2 2024</option>
                    <option value="Q1 2024">Q1 2024</option>
                  </select>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="flex justify-between">
                    <span>Period start:</span>
                    <span className="font-medium">Oct 1, 2024</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Period end:</span>
                    <span className="font-medium">Dec 31, 2024</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Due date:</span>
                    <span className="font-medium text-orange-600">Jan 31, 2025</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;