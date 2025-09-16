import React, { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useNotification } from "../hooks/useNotification";
import AuthForm from "../components/auth/AuthForm";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import {
  Sprout,
  TrendingUp,
  ArrowRight,
  Users,
  Shield,
  Zap,
  ChevronLeft,
  Welcome,
  UserPlus,
  LogIn
} from "lucide-react";

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();
  const [currentView, setCurrentView] = useState('welcome'); // 'welcome', 'login', 'register'

  const pathSegments = location.pathname.split("/");
  const type = pathSegments[pathSegments.length - 1];
  const role = searchParams.get("role") || "farmer";

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      let u;
      if (currentView === "login") {
        u = await login(formData);
        showNotification("Success", "Logged in successfully", "success");
      } else {
        u = await register(formData);
        showNotification("Success", "Account created successfully", "success");
      }
      navigate(`/dashboard/${u.user_type}`);
    } catch (error) {
      showNotification("Error", error.message || "An error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  const WelcomeView = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 bg-blue-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse delay-700"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative">
        <Card variant="glass" shadow="2xl" padding="xl" className="backdrop-blur-xl border border-white/20">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse">
              <Sprout className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Welcome to 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                {" "}AgriMarket
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Your gateway to AI-powered agricultural investments. Whether you're a farmer seeking funding or an investor looking for impact opportunities, we're here to connect you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Secure & Trusted</h3>
              <p className="text-gray-600 text-sm">Bank-level security with transparent escrow system</p>
            </div>
            
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">AI-Powered</h3>
              <p className="text-gray-600 text-sm">Smart risk analysis and ROI predictions</p>
            </div>
            
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Community Driven</h3>
              <p className="text-gray-600 text-sm">Join 2,500+ farmers and investors</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Are you new to AgriMarket?
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => setCurrentView('register')}
                className="px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <UserPlus className="mr-3 h-6 w-6" />
                Yes, Create Account
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                onClick={() => setCurrentView('login')}
                className="px-8 py-4 text-lg font-semibold bg-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2"
              >
                <LogIn className="mr-3 h-6 w-6" />
                No, I Have Account
              </Button>
            </div>

            <p className="text-gray-500 text-sm mt-6">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </Card>
      </div>
    </div>
  );

  const AuthFormView = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 left-20 w-32 h-32 bg-green-200 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 bg-blue-200 rounded-full animate-bounce"></div>
      </div>

      <div className="w-full max-w-md relative">
        <Card variant="glass" shadow="2xl" padding="lg" className="backdrop-blur-xl border border-white/20">
          {/* Back Button */}
          <button
            onClick={() => setCurrentView('welcome')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
          >
            <ChevronLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Welcome
          </button>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              {currentView === 'login' ? (
                <LogIn className="h-8 w-8 text-white" />
              ) : (
                <UserPlus className="h-8 w-8 text-white" />
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {currentView === "login" ? "Welcome Back!" : "Join AgriMarket"}
            </h1>
            
            <p className="text-gray-600 leading-relaxed">
              {currentView === "login"
                ? "Enter your credentials to access your dashboard"
                : "Create your account to start connecting farmers with investors"}
            </p>
          </div>

          <AuthForm
            type={currentView}
            initialRole={role}
            onSubmit={handleSubmit}
            loading={loading}
          />

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600">
              {currentView === "login" ? (
                <>
                  Don't have an account?{" "}
                  <button
                    onClick={() => setCurrentView('register')}
                    className="text-green-600 hover:text-green-700 font-semibold transition-colors"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => setCurrentView('login')}
                    className="text-green-600 hover:text-green-700 font-semibold transition-colors"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>
        </Card>

        {/* Role Selection Cards */}
        {currentView === 'register' && (
          <div className="mt-8 grid grid-cols-2 gap-4">
            <Card 
              variant="glass" 
              shadow="lg" 
              padding="sm"
              className="text-center cursor-pointer hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-green-200"
            >
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Sprout className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm">For Farmers</h3>
              <p className="text-xs text-gray-600 mt-1">Get funding for your projects</p>
            </Card>
            
            <Card 
              variant="glass" 
              shadow="lg" 
              padding="sm"
              className="text-center cursor-pointer hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-blue-200"
            >
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm">For Investors</h3>
              <p className="text-xs text-gray-600 mt-1">Invest in agriculture</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );

  // Determine which view to show based on URL or current state
  React.useEffect(() => {
    if (type === 'login' || type === 'signup') {
      setCurrentView(type === 'login' ? 'login' : 'register');
    }
  }, [type]);

  return currentView === 'welcome' ? <WelcomeView /> : <AuthFormView />;
};

export default AuthPage;
