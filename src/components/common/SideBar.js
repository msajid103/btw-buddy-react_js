import React, { useContext } from 'react';
import {
  LayoutDashboard,
  CreditCard,
  FileText,
  Calculator,
  Settings,
  User,
  LogOut
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export const SideBar = () => {
  const {user, logout } = useContext(AuthContext)
  const location = useLocation(); // 👈 get current route

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
    { icon: CreditCard, label: 'Transactions', to: '/transactions' },
    { icon: FileText, label: 'Receipts', to: '/receipt' },
    { icon: Calculator, label: 'VAT Return', to: '/vat-return' },
    { icon: Settings, label: 'Settings', to: '/setting' },
  ];

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <div>
            <h1 className="font-bold text-gray-900">BTW-Buddy</h1>
            <p className="text-xs text-gray-500">VAT return in 5 minutes</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            NAVIGATION
          </h2>
          <ul className="space-y-1">
            {sidebarItems.map((item, index) => {
              const isActive = location.pathname === item.to; // 👈 check active route
              return (
                <li key={index}>
                  <Link
                    to={item.to}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Quick Stats in Sidebar */}
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            QUICK STATS
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">To label</span>
              <span className="text-sm font-semibold text-orange-600">12</span>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Quarter</span>
                <span className="text-sm font-semibold text-gray-900">Q4 2024</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user.full_name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => logout()}
          className="flex items-center space-x-2 px-2 py-4 text-primary-700 hover:bg-primary-100 rounded-lg transition-colors">
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};
