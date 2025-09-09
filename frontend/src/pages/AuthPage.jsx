// frontend/src/pages/AuthPage.jsx
import React, { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useNotification } from "../hooks/useNotification";
import AuthForm from "../components/auth/AuthForm";
import Card from "../components/ui/Card";

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  const pathSegments = location.pathname.split("/");
  const type = pathSegments[pathSegments.length - 1];
  const role = searchParams.get("role") || "farmer";

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
        let u;
      if (type === "login") {
      u  = await login(formData);
        showNotification("Success", "Logged in successfully", "success");
        
      } else {
       u= await register(formData);
        showNotification("Success", "Account created successfully", "success");
        
      }
      navigate(`/dashboard/${u.user_type}`);
    } catch (error) {
      showNotification("Error", error.message || "An error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {type === "login" ? "Login to Your Account" : "Create an Account"}
          </h1>
          <p className="text-gray-600">
            {type === "login"
              ? "Enter your credentials to continue"
              : "Join as a farmer or investor"}
          </p>
        </div>

        <AuthForm
          type={type}
          initialRole={role}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </Card>
    </div>
    
  );
};

export default AuthPage;
