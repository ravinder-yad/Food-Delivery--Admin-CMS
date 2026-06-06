import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  FaBars, FaTimes, FaChartBar, FaUsers, FaUtensils, FaClipboardList,
  FaCog, FaSignOutAlt, FaImages, FaPercentage, FaFolderOpen,
  FaSearch, FaBell, FaCalendarAlt, FaUserShield
} from 'react-icons/fa';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
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
    toast.success('Admin logged out successfully.');
    navigate('/admin/login');
  };

  const getPageTitle = () => {
    const activeItem = menuItems.find(item => location.pathname === item.path);
    return activeItem ? activeItem.name : 'Super Admin Panel';
  };

  const getFormattedDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen flex text-gray-800">
      
      {/* Sidebar - Desktop & Mobile Drawer */}
      <aside className={`bg-gradient-to-b from-slate-950 to-slate-900 text-white w-68 fixed inset-y-0 left-0 z-40 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition-transform duration-300 flex flex-col justify-between shadow-2xl`}>
        
        <div>
          {/* Brand Header */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800/60 bg-slate-950/20">
            <Link to="/admin" className="flex items-center space-x-2.5">
              <span className="text-3xl">🛵</span>
              <div>
                <span className="text-lg font-black tracking-tight bg-gradient-to-r from-rose-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">
                  QuickBite CMS
                </span>
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Control Center</p>
              </div>
            </Link>
            <button 
              className="md:hidden text-gray-400 hover:text-white transition-colors focus:outline-none p-1.5 hover:bg-slate-800 rounded-lg" 
              onClick={() => setSidebarOpen(false)}
            >
              <FaTimes className="text-base" />
            </button>
          </div>

          {/* Menu Sections */}
          <div className="px-4 py-6">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 mb-3.5">
              Management Portal
            </p>
            <nav className="space-y-1.5">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 group ${
                      isActive
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`text-base transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-rose-400'}`} />
                      <span>{item.name}</span>
                    </div>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer Admin Card Widget */}
        <div className="p-4 border-t border-slate-800/60 bg-slate-950/10 space-y-4">
          <div className="flex items-center gap-3 p-2.5 bg-slate-900/40 rounded-2xl border border-slate-800/50">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center font-bold text-white text-sm shadow-md">
              CM
            </div>
            <div className="min-w-0 flex-grow">
              <h4 className="text-xs font-black truncate">Chef Mario</h4>
              <p className="text-[9px] font-bold text-slate-500 truncate mt-0.5">restaurant@bitedash.com</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 text-xs font-black text-rose-400 hover:text-rose-300 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 hover:border-rose-500/20 rounded-xl transition-all uppercase tracking-wider focus:outline-none"
          >
            <FaSignOutAlt className="text-sm" />
            <span>Logout Portal</span>
          </button>
        </div>
      </aside>

      {/* Main Body container */}
      <div className="flex-grow md:pl-68 flex flex-col min-h-screen">
        
        {/* Top Navbar */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 h-20 flex items-center justify-between px-6 sm:px-8 sticky top-0 z-30 shadow-sm">
          
          {/* Mobile Menu trigger & Active page title */}
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-gray-500 hover:text-rose-500 p-2 hover:bg-gray-50 rounded-xl transition-all focus:outline-none" 
              onClick={() => setSidebarOpen(true)}
            >
              <FaBars className="text-lg" />
            </button>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-800 tracking-tight leading-tight">
                {getPageTitle()}
              </h2>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">QuickBite System</p>
            </div>
          </div>

          {/* Quick info widgets */}
          <div className="flex items-center space-x-4">
            
            {/* Search Pill */}
            <div className="hidden sm:flex items-center bg-gray-50 border border-gray-100 rounded-2xl px-3.5 py-1.5 focus-within:ring-2 focus-within:ring-rose-500 focus-within:bg-white transition-all w-48 lg:w-60">
              <FaSearch className="text-gray-400 text-xs shrink-0" />
              <input
                type="text"
                placeholder="Search resources..."
                className="w-full bg-transparent border-none text-xs text-gray-800 pl-2 focus:outline-none placeholder-gray-300 font-semibold"
                readOnly
                onClick={() => toast('Global Search index active.')}
              />
            </div>

            {/* Date Widget */}
            <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-100 px-3.5 py-1.5 rounded-2xl text-xs font-bold text-gray-500">
              <FaCalendarAlt className="text-rose-500 text-xs" />
              <span>{getFormattedDate()}</span>
            </div>

            {/* Notification Alert Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  toast('No unread notifications.');
                }}
                className="relative text-gray-400 hover:text-rose-500 p-2 bg-gray-50 hover:bg-rose-50 rounded-2xl border border-gray-100 transition-colors focus:outline-none"
              >
                <FaBell className="text-sm" />
                <span className="absolute top-1.5 right-1.5 bg-rose-500 w-2 h-2 rounded-full ring-2 ring-white"></span>
              </button>
            </div>

            {/* Horizontal Line Divider */}
            <span className="w-[1px] h-6 bg-gray-200"></span>

            {/* Admin Badge */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center font-black text-xs hidden xs:flex">
                <FaUserShield />
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-xs font-black text-gray-800 leading-none">Super Admin</p>
                <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-wider">Site Moderator</p>
              </div>
            </div>

          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6 sm:p-8 flex-grow">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

    </div>
  );
}
