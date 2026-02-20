"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function AuthInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  name,
  autoComplete,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={name} className="paragraph-s font-medium text-gray-900">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={name}
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className={`w-full bg-gray-100 rounded-xl px-4 py-3.5 paragraph text-gray-900 placeholder:text-gray-400 outline-none transition-all
            ${error ? "ring-2 ring-red-400" : "focus:ring-2 focus:ring-primary/40"}
            ${isPassword ? "pr-12" : ""}
          `}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
      {error && <p className="small text-red-500">{error}</p>}
    </div>
  );
}

export function AuthButton({
  children,
  isLoading,
  type = "submit",
  onClick,
  variant = "primary",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading}
      className={`w-full py-3.5 rounded-full font-semibold paragraph transition-all active:scale-95
        ${
          variant === "primary"
            ? "bg-primary hover:bg-orange-600 text-white shadow-sm"
            : "border border-gray-200 bg-white text-gray-900 hover:bg-gray-50"
        }
        ${isLoading ? "opacity-70 cursor-not-allowed" : ""}
      `}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          Please wait...
        </span>
      ) : (
        children
      )}
    </button>
  );
}

export function OrDivider({ label }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-gray-200" />
      <span className="small text-gray-400 whitespace-nowrap">{label}</span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

export function GoogleButton({ label }) {
  return (
    <button
      type="button"
      className="w-full flex items-center justify-center gap-3 py-3.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-all active:scale-95"
    >
      {/* Google SVG icon */}
      <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
        <path
          d="M47.532 24.552c0-1.636-.132-3.2-.38-4.704H24.48v9.02h12.944c-.568 2.988-2.24 5.52-4.752 7.22v6.004h7.692c4.496-4.14 7.168-10.244 7.168-17.54z"
          fill="#4285F4"
        />
        <path
          d="M24.48 48c6.48 0 11.916-2.148 15.888-5.828l-7.692-6.004c-2.144 1.436-4.888 2.288-8.196 2.288-6.304 0-11.644-4.26-13.556-9.988H3.008v6.196C6.964 42.892 15.132 48 24.48 48z"
          fill="#34A853"
        />
        <path
          d="M10.924 28.468A14.42 14.42 0 0 1 10 24c0-1.556.268-3.068.924-4.468v-6.196H3.008A23.956 23.956 0 0 0 .48 24c0 3.876.932 7.544 2.528 10.664l7.916-6.196z"
          fill="#FBBC05"
        />
        <path
          d="M24.48 9.544c3.552 0 6.74 1.22 9.252 3.624l6.908-6.908C36.392 2.38 30.96 0 24.48 0 15.132 0 6.964 5.108 3.008 13.336l7.916 6.196c1.912-5.728 7.252-9.988 13.556-9.988z"
          fill="#EA4335"
        />
      </svg>
      <span className="paragraph font-semibold text-gray-900">{label}</span>
    </button>
  );
}

export function AuthFooter({ text, linkText, href }) {
  return (
    <p className="paragraph-s text-gray-500 text-center">
      {text}{" "}
      <a href={href} className="text-primary font-semibold hover:underline">
        {linkText}
      </a>
    </p>
  );
}

export function BackButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
      aria-label="Go back"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M10 12L6 8l4-4"
          stroke="#111"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
