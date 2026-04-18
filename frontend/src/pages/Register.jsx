import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import { validateRegistration } from '../utils/validators';

/**
 * Registration page with full field validation and confirm password.
 */
const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateRegistration(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
      });
      login(res.data);
      navigate('/');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
    { name: 'password', label: 'Password', type: 'password', placeholder: '••••••' },
    { name: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: '••••••' },
    { name: 'phone', label: 'Phone (optional)', type: 'text', placeholder: '1234567890' },
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <span className="text-5xl">📚</span>
            <h1 className="text-2xl font-bold text-dark-900 mt-4">Create Account</h1>
            <p className="text-dark-500 mt-1">Join our community of book lovers</p>
          </div>

          {apiError && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm font-medium">{apiError}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(field => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-dark-700 mb-1">{field.label}</label>
                <input type={field.type} name={field.name} value={formData[field.name]} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  placeholder={field.placeholder} id={`register-${field.name}`} />
                {errors[field.name] && <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>}
              </div>
            ))}

            <button type="submit" disabled={loading}
              className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg disabled:opacity-50 mt-2">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-dark-500 mt-6 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
