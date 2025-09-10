import { CheckCircle } from 'lucide-react';
import React from 'react'

export default function ProgressBar({currentStep}) {
  return (
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
}
