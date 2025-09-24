import React, { useState,useContext, useEffect } from 'react';
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
  Bell,
  Loader
} from 'lucide-react';
import { SideBar } from '../components/common/SideBar';
import dashboardService from '../services/dashboardService';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: null,
    recentActivity: [],
    todoItems: [],
    vatReturn: null
  });
  const [selectedPeriod, setSelectedPeriod] = useState('Q4 2024');
  const [availablePeriods, setAvailablePeriods] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    fetchAvailablePeriods();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [statsResult, activityResult, todoResult, vatResult] = await Promise.all([
        dashboardService.getDashboardStats(),
        dashboardService.getRecentActivity(6),
        dashboardService.getTodoItems(),
        dashboardService.getCurrentVATReturn()
      ]);

      if (!statsResult.success || !activityResult.success || !todoResult.success || !vatResult.success) {
        throw new Error('Failed to load dashboard data');
      }

      setDashboardData({
        stats: statsResult.data,
        recentActivity: activityResult.data,
        todoItems: todoResult.data,
        vatReturn: vatResult.data
      });
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailablePeriods = async () => {
    try {
      const result = await dashboardService.getAvailablePeriods();
      if (result.success) {
        setAvailablePeriods(result.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch available periods:', err);
    }
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    // You can add logic here to filter data by period if needed
  };

  const getQuickStats = () => {
    if (!dashboardData.stats) return [];

    return [
      {
        title: 'Revenue this month',
        amount: dashboardData.stats.revenue.formatted_amount,
        change: dashboardService.formatPercentageChange(dashboardData.stats.revenue.change),
        icon: TrendingUp,
        trend: dashboardData.stats.revenue.change >= 0 ? 'up' : 'down',
        color: dashboardData.stats.revenue.change >= 0 ? 'text-green-600' : 'text-red-600',
        bgColor: dashboardData.stats.revenue.change >= 0 ? 'bg-green-50' : 'bg-red-50',
        iconColor: dashboardData.stats.revenue.change >= 0 ? 'text-green-600' : 'text-red-600'
      },
      {
        title: 'Expenses this month',
        amount: dashboardData.stats.expenses.formatted_amount,
        change: dashboardService.formatPercentageChange(dashboardData.stats.expenses.change),
        icon: dashboardData.stats.expenses.change <= 0 ? TrendingDown : TrendingUp,
        trend: dashboardData.stats.expenses.change <= 0 ? 'down' : 'up',
        color: 'text-primary-600',
        bgColor: 'bg-primary-50',
        iconColor: 'text-primary-600'
      },
      {
        title: 'VAT position',
        amount: dashboardData.stats.vat_position.formatted_amount,
        change: '',
        icon: AlertTriangle,
        trend: 'neutral',
        color: dashboardData.stats.vat_position.status === 'pay' ? 'text-orange-600' : 'text-green-600',
        bgColor: dashboardData.stats.vat_position.status === 'pay' ? 'bg-orange-50' : 'bg-green-50',
        iconColor: dashboardData.stats.vat_position.status === 'pay' ? 'text-orange-600' : 'text-green-600'
      },
      {
        title: 'Labeled transactions',
        amount: `${dashboardData.stats.transaction_labeling.percentage}%`,
        change: dashboardData.stats.transaction_labeling.formatted,
        icon: CheckCircle,
        trend: 'complete',
        color: dashboardData.stats.transaction_labeling.percentage === 100 ? 'text-green-600' : 'text-orange-600',
        bgColor: dashboardData.stats.transaction_labeling.percentage === 100 ? 'bg-green-50' : 'bg-orange-50',
        iconColor: dashboardData.stats.transaction_labeling.percentage === 100 ? 'text-green-600' : 'text-orange-600'
      }
    ];
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'transaction':
        return CheckCircle;
      case 'receipt':
        return Upload;
      default:
        return Clock;
    }
  };

  const getActivityIconColor = (type) => {
    switch (type) {
      case 'transaction':
        return 'text-green-600';
      case 'receipt':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const getPeriodDateRange = () => {
    if (!selectedPeriod) return { start: '', end: '', due: '' };

    const range = dashboardService.getPeriodDateRange(selectedPeriod);
    return {
      start: dashboardService.formatDate(range.start),
      end: dashboardService.formatDate(range.end),
      due: dashboardService.formatDate(range.dueDate)
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <SideBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader className="h-6 w-6 animate-spin text-primary-600" />
            <span>Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <SideBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const quickStats = getQuickStats();
  const dateRange = getPeriodDateRange();

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
              <p className="text-gray-600 mt-1">
                {user.business_profile.company_name} • {dashboardData.vatReturn?.period || 'Q3 2025'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate('/vat-return')} className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors">
                <Calculator className="h-4 w-4" />
                <span>Start return</span>
              </button>
              <button onClick={()=>navigate('/setting')} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
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
                <h2 className="text-xl font-bold mb-2">
                  VAT Return {dashboardData.vatReturn?.period || 'Q3 2025'}
                </h2>
                <p className="text-primary-100 flex items-center">
                  {dashboardData.vatReturn?.status_message || 'Ready to submit!'} {dashboardData.vatReturn?.completion_percentage === 100 ? '🎉' : ''}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold mb-1">
                  {dashboardData.vatReturn?.completion_percentage || 0}%
                </div>
                <div className="text-primary-100 text-sm">complete</div>
              </div>
            </div>
            <div className="mt-4 bg-white/20 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${dashboardData.vatReturn?.completion_percentage || 0}%` }}
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
                  {dashboardData.todoItems.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                      <p>All caught up! No pending tasks.</p>
                    </div>
                  ) : (
                    dashboardData.todoItems.map((item) => (
                      <div key={item.id} className={`flex items-center justify-between p-4 rounded-lg ${item.action_color === 'blue' ? 'bg-blue-50' :
                          item.action_color === 'orange' ? 'bg-orange-50' :
                            item.action_color === 'red' ? 'bg-red-50' : 'bg-gray-50'
                        }`}>
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
                        <button className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${item.action_color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' :
                            item.action_color === 'orange' ? 'bg-orange-600 hover:bg-orange-700' :
                              item.action_color === 'red' ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'
                          }`}>
                          {item.action}
                        </button>
                      </div>
                    ))
                  )}
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
                  {dashboardData.recentActivity.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      <p>No recent activity</p>
                    </div>
                  ) : (
                    dashboardData.recentActivity.map((activity) => {
                      const IconComponent = getActivityIcon(activity.type);
                      return (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 p-1 rounded-full bg-gray-100">
                            <IconComponent className={`h-4 w-4 ${getActivityIconColor(activity.type)}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                            <p className="text-sm text-gray-600 truncate">{activity.description}</p>
                          </div>
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {activity.formatted_time}
                          </span>
                        </div>
                      );
                    })
                  )}
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
                <button onClick={() => navigate('/receipt')} className="w-full flex items-center justify-between p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <Upload className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Upload receipts</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
                <button onClick={() => navigate('/transactions')} className="w-full flex items-center justify-between p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Import transactions</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
                <button onClick={() => navigate('/vat-return')} className="w-full flex items-center justify-between p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
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
                    onChange={(e) => handlePeriodChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {availablePeriods.length > 0 ? (
                      availablePeriods.map(period => {
                        // Handle both string and object period formats
                        const periodValue = typeof period === 'string' ? period : period.display || `${period.period} ${period.year}`;
                        const periodKey = typeof period === 'string' ? period : `${period.period}-${period.year}`;
                        return (
                          <option key={periodKey} value={periodValue}>
                            {periodValue}
                          </option>
                        );
                      })
                    ) : (
                      <>
                        <option value="Q4 2024">Q4 2024</option>
                        <option value="Q3 2024">Q3 2024</option>
                        <option value="Q2 2024">Q2 2024</option>
                        <option value="Q1 2024">Q1 2024</option>
                      </>
                    )}
                  </select>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="flex justify-between">
                    <span>Period start:</span>
                    <span className="font-medium">{dateRange.start}</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Period end:</span>
                    <span className="font-medium">{dateRange.end}</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Due date:</span>
                    <span className="font-medium text-orange-600">{dateRange.due}</span>
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