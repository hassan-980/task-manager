import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { MdOutlineDarkMode } from "react-icons/md";
import { MdOutlineLightMode } from "react-icons/md";
const Register = () => {
  const API_URL = import.meta.env.VITE_SERVER_URL;
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  const { name, email, password } = formData;

  // Check for existing token and initial theme preference on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/dashboard');

    if (localStorage.getItem('theme') === 'dark') {
      setIsDarkMode(true);
    }
  }, [navigate]);

  // Apply the dark class to the HTML root when the state changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, formData);
      localStorage.setItem('token', res.data.token); // Save JWT to local storage
      navigate('/dashboard'); // Redirect to tasks
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 relative">
      
      {/* Theme Toggle Button */}
      <button 
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-4 right-4 p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-200"
        aria-label="Toggle Theme"
      >
        {isDarkMode ?  <MdOutlineLightMode/>  : <MdOutlineDarkMode />}
      </button>

            <div className="flex  items-center justify-center  transition-colors duration-300 relative">
    
  <h1 className='text-3xl mb-7 text-gray-800 dark:text-amber-50 font-bold'>WELCOME TO TASK MANAGER </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96 border border-transparent dark:border-gray-700 transition-colors duration-300">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white transition-colors">Sign Up</h2>
        
        {error && (
          <p className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-2 rounded text-sm mb-4 text-center transition-colors">
            {error}
          </p>
        )}
        
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <input 
              type="text" name="name" value={name} onChange={onChange}
              placeholder="Full Name" required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors placeholder-gray-400 dark:placeholder-gray-400"
            />
          </div>
          <div className="mb-4">
            <input 
              type="email" name="email" value={email} onChange={onChange}
              placeholder="Email Address" required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors placeholder-gray-400 dark:placeholder-gray-400"
            />
          </div>
          <div className="mb-6">
            <input 
              type="password" name="password" value={password} onChange={onChange}
              placeholder="Password" required minLength="6"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors placeholder-gray-400 dark:placeholder-gray-400"
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition shadow-md">
            Register
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400 transition-colors">
          Already have an account? <Link to="/" className="text-blue-500 hover:text-blue-400 hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;