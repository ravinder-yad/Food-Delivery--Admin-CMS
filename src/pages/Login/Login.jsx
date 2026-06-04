import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    toast.success('Welcome to QuickBite Admin Portal!');
    navigate('/admin');
  };

  return (
    <div className="bg-slate-900 min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-xl max-w-md w-full border border-white/10"
      >
        <div className="text-center mb-8">
          <span className="text-3xl">🛵</span>
          <h2 className="text-3xl font-black text-white mt-3">QuickBite Admin</h2>
          <p className="text-xs text-gray-400 mt-2">Log in to manage live platform CMS</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase mb-1.5">Email Address</label>
            <input
              type="email"
              required
              placeholder="admin@quickbite.com"
              defaultValue="admin@quickbite.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase mb-1.5">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              defaultValue="admin123"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-xl shadow-md transition-all mt-6"
          >
            Access Panel
          </button>
        </form>
      </motion.div>
    </div>
  );
}
