import React from 'react'

function PasswordStrength({ password }) {

    const passwordStrength = () => {
        if (password.length < 6)
            return { level: 0, text: "Too short", color: "text-red-500" };
        if (password.length < 8)
            return { level: 1, text: "Weak", color: "text-orange-500" };
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password))
            return { level: 2, text: "Medium", color: "text-yellow-500" };
        return { level: 3, text: "Strong", color: "text-green-500" };
    };

    return (
        <div className="mt-2 flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength().level === 0
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
    )
}

export default PasswordStrength