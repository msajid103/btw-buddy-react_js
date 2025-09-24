import React from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  Shield,
  Zap,
  ArrowRight,
  BarChart3,
  FileText,
  CreditCard,
} from "lucide-react";

import vat from "../assets/vat.png";
import logo from "../assets/logo.png";

const LandingPage = () => {
  const features = [
    {
      icon: <CreditCard className="h-8 w-8 text-primary-600" />,
      title: "Smart Bank Integration",
      description:
        "Automatically import transactions via PSD2 or CSV uploads. Say goodbye to manual entry.",
    },
    {
      icon: <FileText className="h-8 w-8 text-primary-600" />,
      title: "Intelligent Document Management",
      description:
        "Upload receipts and invoices. Automatically link them to transactions for a complete overview.",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-primary-600" />,
      title: "Automated Reports",
      description:
        "Generate VAT reports and financial summaries per period. Export seamlessly to Excel or CSV.",
    },
    {
      icon: <Zap className="h-8 w-8 text-primary-600" />,
      title: "Smart Categorization Rules",
      description:
        "Set up rules for automatic categorization. Save time with intelligent suggestions.",
    },
  ];

  const benefits = [
    "Save hours with automation",
    "Error-free VAT management",
    "Secure EU-compliant storage",
    "Simple, modern interface",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center justify-center space-x-2">
              <img
                src={logo}
                alt="VAT Buddy Logo"
                className="w-12 h-12 object-contain"
              />
              <span className="text-xl font-bold text-gray-900">BTW Buddy</span>
            </div>


            {/* Nav links */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                Pricing
              </a>
              <a
                href="#contact"
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                Contact
              </a>
            </div>

            {/* Auth buttons */}
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                Log In
              </Link>
              <Link to="/register" className="btn-primary">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - text */}
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              VAT Management
              <span className="text-primary-600 block">Done Effortlessly</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-xl leading-relaxed">
              Automate your VAT workflow with smart banking connections,
              intelligent document management, and instant reporting. Save time
              and avoid costly mistakes with VAT Buddy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="btn-primary text-lg px-8 py-4 inline-flex items-center"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <button className="btn-secondary text-lg px-8 py-4">
                Watch Demo
              </button>
            </div>
          </div>

          {/* Right side - illustration / image */}
          <div className="relative">
            <img
              src={vat}
              alt="VAT Automation"
              className="w-full max-w-lg mx-auto drop-shadow-xl"
            />
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-4 bg-white/70 rounded-xl backdrop-blur-sm shadow-sm animate-slide-up hover:shadow-md transition-all"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CheckCircle className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-700">
                {benefit}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need for VAT compliance
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From bank integration to automated reporting — VAT Buddy handles
              your entire VAT process seamlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-400">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start your free trial today and experience effortless VAT management
            with VAT Buddy.
          </p>
          <Link
            to="/register"
            className="bg-white text-primary-600 hover:bg-gray-50 font-semibold py-4 px-8 rounded-lg transition-colors duration-200 inline-flex items-center text-lg"
          >
            Create Free Account
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <img
                  src={logo}
                  alt="VAT Buddy Logo"
                  className="w-12 h-12 object-contain"
                />
                <span className="text-xl font-bold">BTW Buddy</span>
              </div>
              <p className="text-gray-400 mb-4">
                The smartest way to manage your VAT. Automated, secure, and
                always up-to-date.
              </p>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-400" />
                <span className="text-sm text-gray-400">
                  EU-compliant & GDPR-proof
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#features" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 BTW Buddy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
