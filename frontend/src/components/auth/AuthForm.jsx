import React, { useState } from "react";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sprout,
  TrendingUp,
  Phone,
  MapPin,
  Building,
  Loader2
} from "lucide-react";

const AuthForm = ({ type, initialRole, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    location: "",
    organization: "",
    user_type: initialRole || "farmer"
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Registration-specific validations
    if (type === "register") {
      if (!formData.firstName) newErrors.firstName = "First name is required";
      if (!formData.lastName) newErrors.lastName = "Last name is required";
      if (!formData.phone) newErrors.phone = "Phone number is required";
      if (!formData.location) newErrors.location = "Location is required";
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords don't match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const InputField = ({ 
    icon: Icon, 
    type: inputType = "text", 
    name, 
    placeholder, 
    value, 
    onChange, 
    error,
    showToggle = false,
    showValue = false,
    onToggle
  }) => (
    <div className="space-y-2">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type={showToggle ? (showValue ? "text" : "password") : inputType}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full pl-12 pr-12 py-4 bg-white/50 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 ${
            error 
              ? "border-red-300 bg-red-50/50" 
              : "border-gray-200 hover:border-gray-300 focus:bg-white"
          }`}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showValue ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-sm flex items-center">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
          {error}
        </p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Role Selection for Registration */}
      {type === "register" && (
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            I want to join as:
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, user_type: "farmer" }))}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                formData.user_type === "farmer"
                  ? "border-green-500 bg-green-50 shadow-lg scale-105"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-md"
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  formData.user_type === "farmer" 
                    ? "bg-green-500 text-white" 
                    : "bg-gray-100 text-gray-600"
                }`}>
                  <Sprout className="h-6 w-6" />
                </div>
                <span className={`font-semibold ${
                  formData.user_type === "farmer" ? "text-green-700" : "text-gray-700"
                }`}>
                  Farmer
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, user_type: "investor" }))}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                formData.user_type === "investor"
                  ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-md"
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  formData.user_type === "investor" 
                    ? "bg-blue-500 text-white" 
                    : "bg-gray-100 text-gray-600"
                }`}>
                  <TrendingUp className="h-6 w-6" />
                </div>
                <span className={`font-semibold ${
                  formData.user_type === "investor" ? "text-blue-700" : "text-gray-700"
                }`}>
                  Investor
                </span>
              </div>
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Registration Fields */}
        {type === "register" && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                icon={User}
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                error={errors.firstName}
              />
              <InputField
                icon={User}
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                error={errors.lastName}
              />
            </div>

            <InputField
              icon={Phone}
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              error={errors.phone}
            />

            <InputField
              icon={MapPin}
              name="location"
              placeholder="Location (City, Country)"
              value={formData.location}
              onChange={handleInputChange}
              error={errors.location}
            />

            {formData.user_type === "investor" && (
              <InputField
                icon={Building}
                name="organization"
                placeholder="Organization (Optional)"
                value={formData.organization}
                onChange={handleInputChange}
              />
            )}
          </>
        )}

        {/* Common Fields */}
        <InputField
          icon={Mail}
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
        />

        <InputField
          icon={Lock}
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          error={errors.password}
          showToggle={true}
          showValue={showPassword}
          onToggle={() => setShowPassword(!showPassword)}
        />

        {type === "register" && (
          <InputField
            icon={Lock}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={errors.confirmPassword}
            showToggle={true}
            showValue={showConfirmPassword}
            onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="w-full py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:hover:scale-100"
        >
          {loading ? (
            <>
              <Loader2 className="mr-3 h-5 w-5 animate-spin" />
              {type === "login" ? "Signing In..." : "Creating Account..."}
            </>
          ) : (
            <>
              {type === "login" ? (
                <>
                  <Mail className="mr-3 h-5 w-5" />
                  Sign In
                </>
              ) : (
                <>
                  <User className="mr-3 h-5 w-5" />
                  Create Account
                </>
              )}
            </>
          )}
        </Button>

        {/* Additional Info for Registration */}
        {type === "register" && (
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <div className="text-sm">
                <p className="text-gray-700 font-medium mb-1">What happens next?</p>
                <ul className="text-gray-600 space-y-1">
                  <li>• Your account will be verified within 24 hours</li>
                  <li>• You'll receive an email confirmation</li>
                  <li>• Access to {formData.user_type === "farmer" ? "project creation tools" : "investment opportunities"}</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Login Help */}
        {type === "login" && (
          <div className="text-center">
            <button
              type="button"
              className="text-green-600 hover:text-green-700 font-medium text-sm transition-colors"
            >
              Forgot your password?
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default AuthForm;
