import React, { useContext } from 'react';
import {
  LayoutDashboard,
  CreditCard,
  ReceiptEuro,
  Calculator,
  FileCheck,
  Settings,
  User,
  LogOut
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

export const SideBar = () => {
  const { user, logout } = useContext(AuthContext)
  const location = useLocation(); // 👈 get current route

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
    { icon: CreditCard, label: 'Transactions', to: '/transactions' },
    { icon: ReceiptEuro, label: 'Receipts', to: '/receipt' },
    { icon: FileCheck, label: 'Invoices', to: '/invoice' },
    { icon: Calculator, label: 'VAT Return', to: '/vat-return' },
    { icon: Settings, label: 'Settings', to: '/setting' },
  ];

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <img
            src={logo}
            alt="VAT Buddy Logo"
            className="w-12 h-12 object-contain"
          />
          <div>
            <h1 className="font-bold text-gray-900">BTW-Buddy</h1>
            {/* <p className="text-xs text-gray-500">VAT return in 5 minutes</p> */}
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
