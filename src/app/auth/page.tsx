'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AppProvider';

const Auth: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const router = useRouter();
  const { login, authToken } = useAuth();

  useEffect(() => {
    if (authToken) {
      router.push("/");
    }
  }, [authToken, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
    } catch (error) {
      console.log(`Authentication Error: ${error}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-sm">
        <h2 className="text-center text-2xl font-semibold text-gray-800">
          Admin Login to <span className="text-blue-600">INDTECEXPO</span>
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            name="email"
            type="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
          />

          <input
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            name="password"
            type="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
          />

          <button
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
