import React from 'react'
import { Smartphone, Loader2 } from 'lucide-react'; // Add Loader2 import

function TwoFactorAuthForm({ twoFactorCode, setTwoFactorCode, onClose, onSubmit, loading, email }) {
  return (
    <form onSubmit={onSubmit} className="card bg-white/90 backdrop-blur-xl border border-gray-200 animate-slide-up">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Smartphone className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Two-Factor Authentication</h2>
        <p className="text-gray-600">
          Enter the 6-digit code sent to <span className="font-medium">{email}</span>
        </p>
      </div>

      <div className="space-y-6">
        <input
          id="twoFactorCode"
          name="two_factor_code"
          type="text"
          inputMode="numeric" // Add this for mobile keyboards
          value={twoFactorCode}
          onChange={(e) => {
            // Only allow numbers and limit to 6 digits
            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
            setTwoFactorCode(value);
          }}
          className="input-field text-center text-2xl tracking-widest"
          placeholder="••••••"
          maxLength="6"
          required
          disabled={loading} // Disable during loading
        />

        <button
          type="submit"
          className="w-full btn-primary text-lg py-3 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
          disabled={twoFactorCode.length !== 6 || loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Verifying...</span>
            </>
          ) : (
            "Verify"
          )}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-full btn-secondary"
          disabled={loading} // Disable during loading
        >
          Back to Login
        </button>
      </div>
    </form>
  )
}

export default TwoFactorAuthForm