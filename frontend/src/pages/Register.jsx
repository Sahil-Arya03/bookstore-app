import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.register(formData);
      login(res.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white border rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className="block mb-1">Name</label> <input type="text" name="name" onChange={handleChange} className="w-full border p-2 rounded" required /></div>
        <div><label className="block mb-1">Email</label> <input type="email" name="email" onChange={handleChange} className="w-full border p-2 rounded" required /></div>
        <div><label className="block mb-1">Password</label> <input type="password" name="password" onChange={handleChange} className="w-full border p-2 rounded" required /></div>
        <div><label className="block mb-1">Phone</label> <input type="text" name="phone" onChange={handleChange} className="w-full border p-2 rounded" /></div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">Sign Up</button>
      </form>
      <p className="mt-4 text-center text-sm">Already have an account? <Link to="/login" className="text-blue-600">Login</Link></p>
    </div>
  );
}

export default Register;
