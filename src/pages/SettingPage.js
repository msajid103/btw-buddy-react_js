import React, { useContext, useState } from 'react';
import {
    User,
    Building,
    Shield,
    Bell,
    CreditCard,
    Lock,
    Save,
    LogOut ,
    Download,
    Trash2,
    Smartphone,
    Calendar,
    Clock,
    Database,
    FileText,
    CheckCircle,
    X
} from 'lucide-react';
import { SideBar } from '../components/dashboard/SideBar';
import { AuthContext } from '../context/AuthContext';

const SettingPage = () => {
    const { logout, user } = useContext(AuthContext)
    const [activeTab, setActiveTab] = useState('profile');
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [show2FAModal, setShow2FAModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    console.log("User detail=",user)
    // User profile state
    const [userProfile, setUserProfile] = useState({
        firstName: 'John',
        lastName: 'Doeksen',
        email: 'john@doeksendigital.com',
        phone: '+31 6 1234 5678',
        language: 'nl',
        timezone: 'Europe/Amsterdam'
    });

    // Business profile state
    const [businessProfile, setBusinessProfile] = useState({
        companyName: 'Doeksen Digital',
        vatNumber: 'NL123456789B01',
        chamberOfCommerce: '12345678',
        legalForm: 'BV',
        address: 'Amsterdamseweg 123',
        postalCode: '1234 AB',
        city: 'Amsterdam',
        country: 'Netherlands',
        reportingPeriod: 'quarterly',
        accountingYear: 'calendar'
    });

    // Security settings state
    const [securitySettings, setSecuritySettings] = useState({
        twoFactorEnabled: true,
        emailNotifications: true,
        smsNotifications: false,
        loginAlerts: true,
        sessionTimeout: 60
    });

    // Notification settings state
    const [notificationSettings, setNotificationSettings] = useState({
        vatDeadlines: true,
        newTransactions: false,
        weeklyReports: true,
        monthlyReports: true,
        systemUpdates: true,
        marketingEmails: false
    });

    // Password change state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const quickStats = [
        {
            title: 'Account Created',
            amount: 'Mar 2024',
            change: '6 months ago',
            icon: Calendar,
            trend: 'neutral',
            color: 'text-primary-600',
            bgColor: 'bg-primary-50',
            iconColor: 'text-primary-600'
        },
        {
            title: 'Data Usage',
            amount: '2.4 GB',
            change: '15% of limit',
            icon: Database,
            trend: 'up',
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600'
        },
        {
            title: 'Last Backup',
            amount: 'Today',
            change: 'Auto-backup enabled',
            icon: Shield,
            trend: 'up',
            color: 'text-primary-600',
            bgColor: 'bg-primary-50',
            iconColor: 'text-primary-600'
        },
        {
            title: 'Security Score',
            amount: '95%',
            change: 'Excellent',
            icon: Lock,
            trend: 'up',
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600'
        }
    ];

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'business', label: 'Business', icon: Building },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'integrations', label: 'Integrations', icon: CreditCard },
        { id: 'data', label: 'Data & Privacy', icon: Database }
    ];

    const handleLogout = () => {
        logout();
    };
    const handleSave = () => {
        console.log("saved");
    };

    const handlePasswordChange = () => {
        // Password change logic
        console.log('Changing password...');
        setShowPasswordModal(false);
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
    };

    const handle2FAChange = () => {
        // 2FA change logic
        setSecuritySettings({
            ...securitySettings,
            twoFactorEnabled: !securitySettings.twoFactorEnabled
        });
        setShow2FAModal(false);
    };

    const handleDeleteAccount = () => {
        // Account deletion logic
        console.log('Deleting account...');
        setShowDeleteModal(false);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-primary-700 mb-2">First Name</label>
                                <input
                                    type="text"
                                    value={userProfile.firstName}
                                    onChange={(e) => setUserProfile({ ...userProfile, firstName: e.target.value })}
                                    className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-primary-700 mb-2">Last Name</label>
                                <input
                                    type="text"
                                    value={userProfile.lastName}
                                    onChange={(e) => setUserProfile({ ...userProfile, lastName: e.target.value })}
                                    className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-primary-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={userProfile.email}
                                onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                                className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-primary-700 mb-2">Phone Number</label>
                            <input
                                type="tel"
                                value={userProfile.phone}
                                onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                                className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-primary-700 mb-2">Language</label>
                                <select
                                    value={userProfile.language}
                                    onChange={(e) => setUserProfile({ ...userProfile, language: e.target.value })}
                                    className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                >
                                    <option value="nl">Dutch</option>
                                    <option value="en">English</option>
                                    <option value="de">German</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-primary-700 mb-2">Timezone</label>
                                <select
                                    value={userProfile.timezone}
                                    onChange={(e) => setUserProfile({ ...userProfile, timezone: e.target.value })}
                                    className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                >
                                    <option value="Europe/Amsterdam">Amsterdam</option>
                                    <option value="Europe/Brussels">Brussels</option>
                                    <option value="Europe/Berlin">Berlin</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );

            case 'business':
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-primary-700 mb-2">Company Name</label>
                            <input
                                type="text"
                                value={businessProfile.companyName}
                                onChange={(e) => setBusinessProfile({ ...businessProfile, companyName: e.target.value })}
                                className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-primary-700 mb-2">VAT Number</label>
                                <input
                                    type="text"
                                    value={businessProfile.vatNumber}
                                    onChange={(e) => setBusinessProfile({ ...businessProfile, vatNumber: e.target.value })}
                                    className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-primary-700 mb-2">Chamber of Commerce</label>
                                <input
                                    type="text"
                                    value={businessProfile.chamberOfCommerce}
                                    onChange={(e) => setBusinessProfile({ ...businessProfile, chamberOfCommerce: e.target.value })}
                                    className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-primary-700 mb-2">Business Address</label>
                            <input
                                type="text"
                                value={businessProfile.address}
                                onChange={(e) => setBusinessProfile({ ...businessProfile, address: e.target.value })}
                                className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Street and number"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-primary-700 mb-2">Postal Code</label>
                                <input
                                    type="text"
                                    value={businessProfile.postalCode}
                                    onChange={(e) => setBusinessProfile({ ...businessProfile, postalCode: e.target.value })}
                                    className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-primary-700 mb-2">City</label>
                                <input
                                    type="text"
                                    value={businessProfile.city}
                                    onChange={(e) => setBusinessProfile({ ...businessProfile, city: e.target.value })}
                                    className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-primary-700 mb-2">Legal Form</label>
                                <select
                                    value={businessProfile.legalForm}
                                    onChange={(e) => setBusinessProfile({ ...businessProfile, legalForm: e.target.value })}
                                    className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                >
                                    <option value="BV">BV (Private Limited)</option>
                                    <option value="NV">NV (Public Limited)</option>
                                    <option value="VOF">VOF (Partnership)</option>
                                    <option value="ZZP">ZZP (Sole Proprietor)</option>
                                    <option value="Stichting">Stichting (Foundation)</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-primary-700 mb-2">VAT Reporting Period</label>
                                <select
                                    value={businessProfile.reportingPeriod}
                                    onChange={(e) => setBusinessProfile({ ...businessProfile, reportingPeriod: e.target.value })}
                                    className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                >
                                    <option value="monthly">Monthly</option>
                                    <option value="quarterly">Quarterly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-primary-700 mb-2">Accounting Year</label>
                                <select
                                    value={businessProfile.accountingYear}
                                    onChange={(e) => setBusinessProfile({ ...businessProfile, accountingYear: e.target.value })}
                                    className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                >
                                    <option value="calendar">Calendar Year (Jan-Dec)</option>
                                    <option value="fiscal">Fiscal Year (Apr-Mar)</option>
                                    <option value="custom">Custom Period</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );

            case 'security':
                return (
                    <div className="space-y-6">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex">
                                <Shield className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
                                <div>
                                    <h4 className="text-sm font-medium text-yellow-800">Security Status</h4>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        Your account security score: 95% - Excellent protection enabled
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <Smartphone className="h-5 w-5 text-primary-600" />
                                    <div>
                                        <span className="font-medium text-primary-900">Two-Factor Authentication</span>
                                        <p className="text-sm text-primary-500">Add an extra layer of security</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    {securitySettings.twoFactorEnabled && (
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                    )}
                                    <button
                                        onClick={() => setShow2FAModal(true)}
                                        className={`px-3 py-1 text-sm rounded-lg ${securitySettings.twoFactorEnabled
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-primary-200 text-primary-600'
                                            }`}
                                    >
                                        {securitySettings.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <Lock className="h-5 w-5 text-primary-600" />
                                    <div>
                                        <span className="font-medium text-primary-900">Change Password</span>
                                        <p className="text-sm text-primary-500">Update your account password</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowPasswordModal(true)}
                                    className="px-3 py-1 text-sm bg-primary-100 text-primary-800 rounded-lg hover:bg-primary-200"
                                >
                                    Change
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <Bell className="h-5 w-5 text-primary-600" />
                                    <div>
                                        <span className="font-medium text-primary-900">Login Alerts</span>
                                        <p className="text-sm text-primary-500">Get notified of suspicious login attempts</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={securitySettings.loginAlerts}
                                        onChange={(e) => setSecuritySettings({ ...securitySettings, loginAlerts: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-primary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-primary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <Clock className="h-5 w-5 text-primary-600" />
                                    <div>
                                        <span className="font-medium text-primary-900">Session Timeout</span>
                                        <p className="text-sm text-primary-500">Automatically log out after inactivity</p>
                                    </div>
                                </div>
                                <select
                                    value={securitySettings.sessionTimeout}
                                    onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) })}
                                    className="px-3 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                >
                                    <option value={15}>15 minutes</option>
                                    <option value={30}>30 minutes</option>
                                    <option value={60}>1 hour</option>
                                    <option value={120}>2 hours</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );

            case 'notifications':
                return (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h4 className="text-md font-semibold text-primary-900">Email Notifications</h4>
                            {Object.entries({
                                'VAT Deadlines': 'vatDeadlines',
                                'New Transactions': 'newTransactions',
                                'Weekly Reports': 'weeklyReports',
                                'Monthly Reports': 'monthlyReports',
                                'System Updates': 'systemUpdates',
                                'Marketing Emails': 'marketingEmails'
                            }).map(([label, key]) => (
                                <div key={key} className="flex items-center justify-between p-4 bg-primary-50 rounded-lg">
                                    <div>
                                        <span className="font-medium text-primary-900">{label}</span>
                                        <p className="text-sm text-primary-500">
                                            {key === 'vatDeadlines' && 'Important VAT submission deadlines'}
                                            {key === 'newTransactions' && 'Notification when new transactions are imported'}
                                            {key === 'weeklyReports' && 'Weekly summary of your financial activity'}
                                            {key === 'monthlyReports' && 'Monthly business performance reports'}
                                            {key === 'systemUpdates' && 'Updates about new features and maintenance'}
                                            {key === 'marketingEmails' && 'Product updates and promotional content'}
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={notificationSettings[key]}
                                            onChange={(e) => setNotificationSettings({ ...notificationSettings, [key]: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-primary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-primary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'integrations':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="border border-primary-200 rounded-lg p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <CreditCard className="h-8 w-8 text-primary-600" />
                                        <div>
                                            <h4 className="font-medium text-primary-900">Bank Connection</h4>
                                            <p className="text-sm text-primary-500">ABN AMRO</p>
                                        </div>
                                    </div>
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                </div>
                                <div className="text-sm text-primary-600 mb-4">
                                    Last sync: Today at 09:30
                                </div>
                                <button className="w-full px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                                    Manage Connection
                                </button>
                            </div>

                            <div className="border border-primary-200 rounded-lg p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <FileText className="h-8 w-8 text-primary-400" />
                                        <div>
                                            <h4 className="font-medium text-primary-900">Accounting Software</h4>
                                            <p className="text-sm text-primary-500">Not connected</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-sm text-primary-600 mb-4">
                                    Connect to MoneyBird, Exact, or other software
                                </div>
                                <button className="w-full px-3 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200">
                                    Add Integration
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'data':
                return (
                    <div className="space-y-6">
                        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                            <div className="flex">
                                <Database className="h-5 w-5 text-primary-600 mt-0.5 mr-3" />
                                <div>
                                    <h4 className="text-sm font-medium text-primary-800">Data Retention</h4>
                                    <p className="text-sm text-primary-700 mt-1">
                                        Your data is stored securely in EU servers and retained for 7 years as required by Dutch law
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <Download className="h-5 w-5 text-primary-600" />
                                    <div>
                                        <span className="font-medium text-primary-900">Export Data</span>
                                        <p className="text-sm text-primary-500">Download all your data in CSV/JSON format</p>
                                    </div>
                                </div>
                                <button className="px-3 py-1 text-sm bg-primary-100 text-primary-800 rounded-lg hover:bg-primary-200">
                                    Export
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <LogOut  className="h-5 w-5 text-primary-600" />
                                    <div>
                                        <span className="font-medium text-primary-900">Backup Data</span>
                                        <p className="text-sm text-primary-500">Create a backup of your current data</p>
                                    </div>
                                </div>
                                <button className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-lg hover:bg-green-200">
                                    Backup Now
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                                <div className="flex items-center space-x-3">
                                    <Trash2 className="h-5 w-5 text-red-600" />
                                    <div>
                                        <span className="font-medium text-red-900">Delete Account</span>
                                        <p className="text-sm text-red-700">Permanently delete your account and all data</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-lg hover:bg-red-200"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                );

            default:
                return <div>Select a tab</div>;
        }
    };

    // Modal Components
    const PasswordModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Change Password</h3>
                    <button onClick={() => setShowPasswordModal(false)} className="text-primary-500 hover:text-primary-700">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-primary-700 mb-1">Current Password</label>
                        <input
                            type={passwordVisible ? "text" : "password"}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-primary-700 mb-1">New Password</label>
                        <input
                            type={passwordVisible ? "text" : "password"}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-primary-700 mb-1">Confirm New Password</label>
                        <input
                            type={passwordVisible ? "text" : "password"}
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={passwordVisible}
                            onChange={() => setPasswordVisible(!passwordVisible)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-primary-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-primary-700">Show passwords</label>
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        onClick={() => setShowPasswordModal(false)}
                        className="px-4 py-2 text-primary-700 hover:bg-primary-100 rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handlePasswordChange}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                        Update Password
                    </button>
                </div>
            </div>
        </div>
    );

    const TwoFAModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                        {securitySettings.twoFactorEnabled ? 'Disable' : 'Enable'} Two-Factor Authentication
                    </h3>
                    <button onClick={() => setShow2FAModal(false)} className="text-primary-500 hover:text-primary-700">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <p className="text-primary-600 mb-4">
                    {securitySettings.twoFactorEnabled
                        ? 'Are you sure you want to disable two-factor authentication? This will make your account less secure.'
                        : 'Enabling two-factor authentication adds an extra layer of security to your account.'}
                </p>
                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        onClick={() => setShow2FAModal(false)}
                        className="px-4 py-2 text-primary-700 hover:bg-primary-100 rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handle2FAChange}
                        className={`px-4 py-2 rounded-lg ${securitySettings.twoFactorEnabled
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-primary-600 text-white hover:bg-primary-700'
                            }`}
                    >
                        {securitySettings.twoFactorEnabled ? 'Disable' : 'Enable'}
                    </button>
                </div>
            </div>
        </div>
    );

    const DeleteAccountModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-red-600">Delete Account</h3>
                    <button onClick={() => setShowDeleteModal(false)} className="text-primary-500 hover:text-primary-700">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <p className="text-primary-600 mb-4">
                    Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently removed.
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-red-700">
                        <strong>Warning:</strong> This will immediately delete all your data, including transactions, reports, and settings.
                    </p>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        onClick={() => setShowDeleteModal(false)}
                        className="px-4 py-2 text-primary-700 hover:bg-primary-100 rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDeleteAccount}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-primary-50 flex">
            <SideBar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white border-b border-primary-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-primary-900 flex items-center">
                                Settings ⚙️
                            </h1>
                            <p className="text-primary-600 mt-1">Doeksen Digital • Manage your account and preferences</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 px-4 py-2 text-primary-700 hover:bg-primary-100 rounded-lg transition-colors">
                                <LogOut  className="h-4 w-4" />
                                <span>Logout</span>
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                            >
                                <Save className="h-4 w-4" />
                                <span>Save Changes</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-6">
                    {/* Settings Status */}
                    <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold mb-2">Account Configuration</h2>
                                <p className="text-primary-100 flex items-center">
                                    Profile setup complete • Security enabled • Ready for VAT management 🎉
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold mb-1">100%</div>
                                <div className="text-primary-100 text-sm">configured</div>
                            </div>
                        </div>
                        <div className="mt-4 bg-white/20 rounded-full h-2">
                            <div className="bg-white h-2 rounded-full w-full"></div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                        {quickStats.map((stat, index) => (
                            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-primary-200 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm text-primary-600 mb-1">{stat.title}</p>
                                        <p className="text-2xl font-bold text-primary-900 mb-1">{stat.amount}</p>
                                        {stat.change && (
                                            <p className={`text-xs ${stat.color}`}>{stat.change}</p>
                                        )}
                                    </div>
                                    <div className={`flex items-center justify-center h-10 w-10 rounded-lg ${stat.bgColor}`}>
                                        <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tabs Navigation */}
                    <div className="mb-8">
                        <nav className="flex space-x-2 overflow-x-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${activeTab === tab.id
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-white text-primary-700 hover:bg-primary-100'
                                        }`}
                                >
                                    <tab.icon className="h-5 w-5" />
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
                        {renderTabContent()}
                    </div>
                </main>
            </div>

            {/* Modals */}
            {showPasswordModal && <PasswordModal />}
            {show2FAModal && <TwoFAModal />}
            {showDeleteModal && <DeleteAccountModal />}
        </div>
    );
};

export default SettingPage;