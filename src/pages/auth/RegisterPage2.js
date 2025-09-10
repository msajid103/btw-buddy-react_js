import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  AlertCircle,
  CheckCircle,
  Building
} from "lucide-react";
import ProgressBar from "../../components/auth/ProgressBar";
import PasswordStrength from "../../components/auth/PasswordStrength";

const RegisterPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Personal Info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Business Info
  const [companyName, setCompanyName] = useState('');
  const [kvkNumber, setKvkNumber] = useState('');
  const [legalForm, setLegalForm] = useState('');
  const [reportingPeriod, setReportingPeriod] = useState('quarter');

  // Terms
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);




  const passwordStrength = () => {
    if (password.length < 6)
      return { level: 0, text: "Too short", color: "text-red-500" };
    if (password.length < 8)
      return { level: 1, text: "Weak", color: "text-orange-500" };
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password))
      return { level: 2, text: "Medium", color: "text-yellow-500" };
    return { level: 3, text: "Strong", color: "text-green-500" };
  };

  const isStep1Valid =
    firstName && lastName && email && password && confirmPassword && password === confirmPassword;
  const isStep2Valid = companyName && kvkNumber && legalForm;
  const isStep3Valid = agreeTerms;

  const handleNextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };




  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registration completed");
    // Registration logic here
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-2xl">B</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Create Your Account
          </h1>
          <p className="text-gray-600 mt-2">
            Start your free trial of <span className="font-semibold">VAT Buddy</span>
          </p>
        </div>

        <div className="card shadow-lg border border-gray-200 animate-fade-in">
          <ProgressBar currentStep={currentStep} />

          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleNextStep();
              }}
            >
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Personal Information
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="input-field"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="input-field"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field pl-10"
                      placeholder="you@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field pl-10 pr-10"
                      placeholder="At least 8 characters"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {password && (                  
                   
                    <PasswordStrength password={password} />
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="input-field pl-10 pr-10"
                      placeholder="Repeat your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <div className="mt-2 flex items-center space-x-2 text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">Passwords do not match</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary text-lg py-3"
                  disabled={!isStep1Valid}
                >
                  Next Step
                </button>
              </div>
            </form>
          )}



          {/* Step 2: Business Information */}
          {currentStep === 2 && (
            <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}>
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h2>

                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="companyName"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="input-field pl-10"
                      placeholder="Your Company Ltd."
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="kvkNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Chamber of Commerce (KvK) Number
                  </label>
                  <input
                    id="kvkNumber"
                    type="text"
                    value={kvkNumber}
                    onChange={(e) => setKvkNumber(e.target.value.replace(/\D/g, '').slice(0, 8))}
                    className="input-field"
                    placeholder="12345678"
                    maxLength="8"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="legalForm" className="block text-sm font-medium text-gray-700 mb-2">
                    Legal Form
                  </label>
                  <select
                    id="legalForm"
                    value={legalForm}
                    onChange={(e) => setLegalForm(e.target.value)}
                    className="input-field"
                    required
                  >
                    <option value="">Select legal form</option>
                    <option value="sole_proprietorship">Sole Proprietorship</option>
                    <option value="bv">Private Limited Company (B.V.)</option>
                    <option value="nv">Public Limited Company (N.V.)</option>
                    <option value="vof">General Partnership (V.O.F.)</option>
                    <option value="cv">Limited Partnership (C.V.)</option>
                    <option value="foundation">Foundation</option>
                    <option value="association">Association</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    VAT Filing Period
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'month', label: 'Monthly' },
                      { value: 'quarter', label: 'Quarterly' },
                      { value: 'year', label: 'Yearly' }
                    ].map((period) => (
                      <label key={period.value} className="flex items-center">
                        <input
                          type="radio"
                          name="reportingPeriod"
                          value={period.value}
                          checked={reportingPeriod === period.value}
                          onChange={(e) => setReportingPeriod(e.target.value)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{period.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex-1 btn-secondary"
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary"
                    disabled={!isStep2Valid}
                  >
                    Next Step
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Step 3: Terms & Confirmation */}
          {currentStep === 3 && (
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Confirmation</h2>

                {/* Summary */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <h3 className="font-medium text-gray-900">Summary</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Name:</span> {firstName} {lastName}</p>
                    <p><span className="font-medium">Email:</span> {email}</p>
                    <p><span className="font-medium">Company:</span> {companyName}</p>
                    <p><span className="font-medium">KvK:</span> {kvkNumber}</p>
                    <p><span className="font-medium">Legal Form:</span> {legalForm}</p>
                    <p><span className="font-medium">VAT Period:</span> {
                      reportingPeriod === 'month' ? 'Monthly' :
                        reportingPeriod === 'quarter' ? 'Quarterly' : 'Yearly'
                    }</p>
                  </div>
                </div>

                {/* Terms */}
                <div className="space-y-4">
                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                    />
                    <span className="text-sm text-gray-700">
                      I agree with the{' '}
                      <Link to="/terms" className="text-primary-600 hover:text-primary-700 underline">
                        Terms & Conditions
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-primary-600 hover:text-primary-700 underline">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>

                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={agreeMarketing}
                      onChange={(e) => setAgreeMarketing(e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                    />
                    <span className="text-sm text-gray-700">
                      I want to receive updates about new features and tips (optional)
                    </span>
                  </label>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Free Trial - 30 Days</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Try all features for free. No credit card required.
                        Cancel anytime.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex-1 btn-secondary"
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary"
                    disabled={!isStep3Valid}
                  >
                    Create Account
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Security Notice */}
        <div className="mt-8 flex items-center justify-center space-x-2 text-sm text-gray-500">
          <Lock className="h-4 w-4" />
          <span>Your data is stored securely in compliance with GDPR</span>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
