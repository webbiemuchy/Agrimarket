//frontend/src/components/auth/AuthForm.jsx
import { useState } from 'react';
import Button from '../ui/Button';

const AuthForm = ({ 
  type, 
  initialRole = 'farmer', 
  onSubmit, 
  loading = false 
}) => {
  const [role, setRole] = useState(initialRole);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    userType: initialRole
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (type === 'signup') {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (type === 'login') {
        onSubmit({ email: formData.email, password: formData.password });
      }else {
      onSubmit({ ...formData, userType: role });
    }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {type === 'signup' && (
        <div className="mb-6">
          <div className="flex rounded-lg overflow-hidden border border-gray-300">
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-medium ${
                role === 'farmer' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => {
                setRole('farmer');
                setFormData(prev => ({ ...prev, userType: 'farmer' }));
              }}
            >
              Farmer
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-medium ${
                role === 'investor' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => {
                setRole('investor');
                setFormData(prev => ({ ...prev, userType: 'investor' }));
              }}
            >
              Investor
            </button>
          </div>
        </div>
      )}

      {type === 'signup' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
          </div>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
      </div>

      <div>
        <Button
          type="submit"
          variant="primary"
          className="w-full py-3"
          disabled={loading}
        >
          {loading 
            ? 'Processing...' 
            : type === 'login' ? 'Login' : 'Sign Up'}
        </Button>
      </div>
    </form>
  );
};

export default AuthForm;