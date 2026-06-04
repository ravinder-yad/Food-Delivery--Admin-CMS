import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaBars, FaTimes, FaChartBar, FaUsers, FaUtensils, FaClipboardList,
  FaCog, FaSignOutAlt, FaImages, FaPercentage, FaFolderOpen
} from 'react-icons/fa';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: FaChartBar },
    { name: 'Categories', path: '/admin/categories', icon: FaFolderOpen },
    { name: 'Foods', path: '/admin/foods', icon: FaUtensils },
    { name: 'Orders', path: '/admin/orders', icon: FaClipboardList },
    { name: 'Users', path: '/admin/users', icon: FaUsers },
    { name: 'Offers', path: '/admin/offers', icon: FaPercentage },
    { name: 'Banners', path: '/admin/banners', icon: FaImages },
    { name: 'Settings', path: '/admin/settings', icon: FaCog },
  ];

  const handleLogout = () => {
    navigate('/admin/login');
  };

  return (
    <div className="bg-gray-100 min-h-screen flex">
      {/* Sidebar for Desktop */}
      <aside className={`bg-slate-900 text-white w-64 fixed inset-y-0 left-0 z-40 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition-transform duration-300 flex flex-col justify-between`}>
        <div>
          {/* Brand Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
            <span className="text-xl font-black bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent flex items-center gap-2">
              <span>🛵</span> QuickBite Admin
            </span>
            <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
              <FaTimes className="text-lg" />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="mt-6 px-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-950/20'
                      : 'text-gray-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="text-base" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Logout */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all"
          >
            <FaSignOutAlt className="text-base" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Body */}
      <div className="flex-grow md:pl-64 flex flex-col">
        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-gray-600 hover:text-rose-500" onClick={() => setSidebarOpen(true)}>
              <FaBars className="text-lg" />
            </button>
            <h2 className="text-lg font-bold text-gray-800">Management Panel</h2>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-xs font-bold bg-rose-50 text-rose-500 px-3 py-1 rounded-full uppercase tracking-wider">
              Super Admin
            </span>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6 flex-grow">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
