import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

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
  const [companyName, setCompanyName] = useState("");
  const [kvkNumber, setKvkNumber] = useState("");
  const [legalForm, setLegalForm] = useState("");

  // Terms
  const [agreeTerms, setAgreeTerms] = useState(false);

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

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep
                  ? "bg-primary-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {step < currentStep ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                step
              )}
            </div>
            {step < 3 && (
              <div
                className={`w-16 h-1 mx-2 rounded ${
                  step < currentStep ? "bg-primary-600" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-600">
        <span>Personal</span>
        <span>Business</span>
        <span>Confirm</span>
      </div>
    </div>
  );

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
          {renderProgressBar()}

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
                    <div className="mt-2 flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            passwordStrength().level === 0
                              ? "w-1/4 bg-red-500"
                              : passwordStrength().level === 1
                              ? "w-2/4 bg-orange-500"
                              : passwordStrength().level === 2
                              ? "w-3/4 bg-yellow-500"
                              : "w-full bg-green-500"
                          }`}
                        />
                      </div>
                      <span
                        className={`text-sm ${passwordStrength().color}`}
                      >
                        {passwordStrength().text}
                      </span>
                    </div>
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

          {/* Step 2 & Step 3 logic stays the same, just update text to English */}
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
