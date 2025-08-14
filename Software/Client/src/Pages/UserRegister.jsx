import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showSuccessToast, showErrorToast } from '../utils/toastConfig';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    else if (!/^\d{10}$/.test(formData.mobile))
      newErrors.mobile = 'Enter a valid 10-digit mobile number';
    return newErrors;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

      const res = await axios.post(`${apiUrl}/api/register`, formData, {
        withCredentials: true,
      });

      const { user } = res.data;

      if (!user || !user._id) {
        throw new Error('Invalid user data returned from server');
      }

      // Generate random cart number between 101 and 130
      const cartNum = Math.floor(Math.random() * (130 - 101 + 1)) + 101;

      // Save user, userId, and cart number to localStorage
      localStorage.setItem('tap2cartUser', JSON.stringify(user));
      localStorage.setItem('tap2cartUserId', user._id);
      localStorage.setItem('tap2cartNumber', cartNum);

      // Success toast
      showSuccessToast(
        `Registered Successfully! Welcome, ${user.name} (Cart Number: ${cartNum})`
      );

      // Navigate after short delay
      setTimeout(() => navigate('/Front-Page'), 2000);
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        'Something went wrong. Please try again.';
      showErrorToast(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#DEE8CE] px-4">
      <div className="bg-[#FFF8E8] shadow-lg rounded-xl p-8 w-full max-w-md border border-[#BB6653]">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-[#BB6653] mb-6">
          Register to Tap2Cart
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-[#BB6653] font-medium mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#BB6653] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F08B51] bg-white"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-[#BB6653] font-medium mb-1">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="mobile"
              placeholder="Enter your mobile number"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#BB6653] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F08B51] bg-white"
            />
            {errors.mobile && (
              <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-[#BB6653] font-medium mb-1">
              Email (Optional)
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#BB6653] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F08B51] bg-white"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#BB6653] text-white py-2 rounded-lg font-semibold hover:bg-[#F08B51] transition duration-300 disabled:opacity-50">
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default Register;
