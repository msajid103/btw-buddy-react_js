import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import './index.css';
import TransactionsPage from './pages/TransactionsPage';
import ReceiptPage from './pages/ReceiptPage';
import VATReturnPage from './pages/VATReturnPage';
import SettingPage from './pages/SettingPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path='/transactions' element={<TransactionsPage />} />
          <Route path='/receipt' element={<ReceiptPage />} />
          <Route path='/vat-return' element={<VATReturnPage />} />
          <Route path='/setting' element={<SettingPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;