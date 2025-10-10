import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  CheckCircle,
  Building
} from "lucide-react";
import ProgressBar from "../../components/auth/ProgressBar";
import PasswordStrength from "../../components/auth/PasswordStrength";
import useForm from "../../hooks/useForm";
import useApi from "../../hooks/useApi";
import { authService } from "../../services/authService";
import logo from "../../assets/logo.png";
import {
  registerStep1Validator,
  registerStep2Validator
} from "../../utils/validators";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { callApi, loading } = useApi();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form state and validation
  const step1Form = useForm({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: ""
  }, registerStep1Validator);

  const step2Form = useForm({
    company_name: '',
    kvk_number: '',
    legal_form: '',
    reporting_period: 'quarter'
  }, registerStep2Validator);

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);

  const handleNextStep = async () => {
    if (currentStep === 1) {
      const errors = registerStep1Validator(step1Form.values);

      if (Object.keys(errors).length === 0) {
        try {
          const response = await callApi(authService.step1validation, step1Form.values);

          console.log("Validation success:", response);
          setCurrentStep(2);

        } catch (err) {
          // If backend says email already exists
          if (err.response?.status === 400 && err.response.data?.email) {          
            step1Form.setFieldError("email", err.response.data.email[0]);
              step1Form.setFieldTouched("email", true);
          } else {
            console.error("Unexpected error:", err);
          }
        }
      } else {
        step1Form.setAllErrors(errors);
      }
    } else if (currentStep === 2) {
      const errors = registerStep2Validator(step2Form.values);
      if (Object.keys(errors).length === 0) {
        setCurrentStep(3);
      } else {
        step2Form.setAllErrors(errors);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreeTerms) {
      alert("Please agree to the terms and conditions");
      return;
    }

    try {
      const userData = {
        ...step1Form.values,
        ...step2Form.values
      };

      delete userData.confirmPassword;

      await callApi(authService.register, userData);
      callApi(authService.sendVerificationEmail, step1Form.values.email);
      navigate("/email-verification", {
        state: { email: step1Form.values.email }
      });
    } catch (err) {
      // Error is handled by useApi hook
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src={logo}
            alt="VAT Buddy Logo"
            className="w-[6rem] h-[6rem] object-contain item-center mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-gray-900">
            Create Your Account
          </h1>
          <p className="text-gray-600 mt-2">
            Start your free trial of <span className="font-semibold">BTW Buddy</span>
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
              <div className="space-y-6 p-6">
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
                      name="first_name"
                      type="text"
                      value={step1Form.values.first_name}
                      onChange={step1Form.handleChange}
                      onBlur={step1Form.handleBlur}
                      className={`input-field ${step1Form.errors.firstName && step1Form.touched.firstName ? 'border-red-500' : ''}`}
                      placeholder="John"
                    />
                    {step1Form.errors.firstName && step1Form.touched.firstName && (
                      <p className="mt-1 text-sm text-red-600">{step1Form.errors.firstName}</p>
                    )}
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
                      name="last_name"
                      type="text"
                      value={step1Form.values.last_name}
                      onChange={step1Form.handleChange}
                      onBlur={step1Form.handleBlur}
                      className={`input-field ${step1Form.errors.lastName && step1Form.touched.lastName ? 'border-red-500' : ''}`}
                      placeholder="Doe"
                    />
                    {step1Form.errors.lastName && step1Form.touched.lastName && (
                      <p className="mt-1 text-sm text-red-600">{step1Form.errors.lastName}</p>
                    )}
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
                      name="email"
                      type="email"
                      value={step1Form.values.email}
                      onChange={step1Form.handleChange}
                      onBlur={step1Form.handleBlur}
                      className={`input-field pl-10 ${step1Form.errors.email && step1Form.touched.email ? 'border-red-500' : ''}`}
                      placeholder="you@email.com"
                    />
                  </div>
                  {step1Form.errors.email && step1Form.touched.email && (
                    <p className="mt-1 text-sm text-red-600">{step1Form.errors.email}</p>
                  )}
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
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={step1Form.values.password}
                      onChange={step1Form.handleChange}
                      onBlur={step1Form.handleBlur}
                      className={`input-field pl-10 pr-10 ${step1Form.errors.password && step1Form.touched.password ? 'border-red-500' : ''}`}
                      placeholder="At least 8 characters"
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
                  {step1Form.values.password && (
                    <PasswordStrength password={step1Form.values.password} />
                  )}
                  {step1Form.errors.password && step1Form.touched.password && (
                    <p className="mt-1 text-sm text-red-600">{step1Form.errors.password}</p>
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
                      name="confirm_password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={step1Form.values.confirm_password}
                      onChange={step1Form.handleChange}
                      onBlur={step1Form.handleBlur}
                      className={`input-field pl-10 pr-10 ${step1Form.errors.confirmPassword && step1Form.touched.confirmPassword ? 'border-red-500' : ''}`}
                      placeholder="Repeat your password"
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
                  {step1Form.errors.confirmPassword && step1Form.touched.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{step1Form.errors.confirmPassword}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary text-lg py-3"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Next Step'}
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Business Information */}
          {currentStep === 2 && (
            <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}>
              <div className="space-y-6 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h2>

                <div>
                  <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="company_name"
                      name="company_name"
                      type="text"
                      value={step2Form.values.company_name}
                      onChange={step2Form.handleChange}
                      onBlur={step2Form.handleBlur}
                      className={`input-field pl-10 ${step2Form.errors.company_name && step2Form.touched.company_name ? 'border-red-500' : ''}`}
                      placeholder="Your Company Ltd."
                    />
                  </div>
                  {step2Form.errors.company_name && step2Form.touched.company_name && (
                    <p className="mt-1 text-sm text-red-600">{step2Form.errors.company_name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="kvk_number" className="block text-sm font-medium text-gray-700 mb-2">
                    Chamber of Commerce (KvK) Number
                  </label>
                  <input
                    id="kvk_number"
                    name="kvk_number"
                    type="text"
                    value={step2Form.values.kvk_number}
                    onChange={step2Form.handleChange}
                    onBlur={step2Form.handleBlur}
                    className={`input-field ${step2Form.errors.kvk_number && step2Form.touched.kvk_number ? 'border-red-500' : ''}`}
                    placeholder="12345678"
                    maxLength="8"
                  />
                  {step2Form.errors.kvk_number && step2Form.touched.kvk_number && (
                    <p className="mt-1 text-sm text-red-600">{step2Form.errors.kvk_number}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="legal_form" className="block text-sm font-medium text-gray-700 mb-2">
                    Legal Form
                  </label>
                  <select
                    id="legal_form"
                    name="legal_form"
                    value={step2Form.values.legal_form}
                    onChange={step2Form.handleChange}
                    onBlur={step2Form.handleBlur}
                    className={`input-field ${step2Form.errors.legal_form && step2Form.touched.legal_form ? 'border-red-500' : ''}`}
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
                  {step2Form.errors.legal_form && step2Form.touched.legal_form && (
                    <p className="mt-1 text-sm text-red-600">{step2Form.errors.legal_form}</p>
                  )}
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
                          name="reporting_period"
                          value={period.value}
                          checked={step2Form.values.reporting_period === period.value}
                          onChange={step2Form.handleChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{period.label}</span>
                      </label>
                    ))}
                  </div>
                  {step2Form.errors.reporting_period && (
                    <p className="mt-1 text-sm text-red-600">{step2Form.errors.reporting_period}</p>
                  )}
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex-1 btn-secondary"
                    disabled={loading}
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Next Step'}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Step 3: Terms & Confirmation */}
          {currentStep === 3 && (
            <form onSubmit={handleSubmit}>
              <div className="space-y-6 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Confirmation</h2>

                {/* Summary */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <h3 className="font-medium text-gray-900">Summary</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Name:</span> {step1Form.values.firstName} {step1Form.values.lastName}</p>
                    <p><span className="font-medium">Email:</span> {step1Form.values.email}</p>
                    <p><span className="font-medium">Company:</span> {step2Form.values.company_name}</p>
                    <p><span className="font-medium">KvK:</span> {step2Form.values.kvk_number}</p>
                    <p><span className="font-medium">Legal Form:</span> {step2Form.values.legal_form}</p>
                    <p><span className="font-medium">VAT Period:</span> {
                      step2Form.values.reporting_period === 'month' ? 'Monthly' :
                        step2Form.values.reporting_period === 'quarter' ? 'Quarterly' : 'Yearly'
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
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                    />
                    <span className="text-sm text-gray-700">
                      I agree with the{' '}
                      <Link to="/terms" className="text-blue-600 hover:text-blue-700 underline">
                        Terms & Conditions
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-blue-600 hover:text-blue-700 underline">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>

                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={agreeMarketing}
                      onChange={(e) => setAgreeMarketing(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
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
                    disabled={loading}
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary"
                    disabled={loading || !agreeTerms}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
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