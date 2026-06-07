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

  const [logoUrl, setLogoUrl] = useState('');
  const [logoWidth, setLogoWidth] = useState(100);
  const [logoShape, setLogoShape] = useState('round');

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/settings');
        const data = await res.json();
        const settingsData = Array.isArray(data) ? data[0] : data;
        if (settingsData && settingsData.logo) {
          setLogoUrl(settingsData.logo);
          setLogoWidth(settingsData.logoWidth || 100);
          setLogoShape(settingsData.logoShape || 'round');
        }
      } catch (error) {
        console.warn("Could not load brand settings logo in admin layout:", error);
      }
    };
    fetchLogo();
    window.addEventListener('settingsUpdated', fetchLogo);
    return () => window.removeEventListener('settingsUpdated', fetchLogo);
  }, []);

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
    <div className="bg-slate-50/50 min-h-screen flex text-slate-800">
      
      {/* Sidebar - Desktop & Mobile Drawer (White & Blue corporate theme) */}
      <aside className={`bg-white border-r border-slate-100 text-slate-600 w-68 fixed inset-y-0 left-0 z-40 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition-transform duration-300 flex flex-col justify-between shadow-xl shadow-slate-100/40`}>
        
        <div>
          {/* Brand Header */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-slate-50 bg-slate-50/40">
            <Link to="/admin" className="flex items-center space-x-2.5">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Brand Logo"
                  className="object-contain"
                  style={{
                    height: '32px',
                    width: 'auto',
                    borderRadius: logoShape === 'round' ? '9999px' : logoShape === 'square' ? '6px' : '0px'
                  }}
                />
              ) : (
                <span className="text-3xl">🛵</span>
              )}
              <div>
                <span className="text-lg font-black tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">
                  QuickBite CMS
                </span>
                <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mt-0.5">Control Center</p>
              </div>
            </Link>
            <button 
              className="md:hidden text-slate-400 hover:text-slate-600 transition-colors focus:outline-none p-1.5 hover:bg-slate-50 rounded-lg" 
              onClick={() => setSidebarOpen(false)}
            >
              <FaTimes className="text-base" />
            </button>
          </div>

          {/* Menu Sections */}
          <div className="px-4 py-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-3.5">
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
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                        : 'text-slate-500 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`text-base transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'}`} />
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
        <div className="p-4 border-t border-slate-50 bg-slate-50/10 space-y-4">
          <div className="flex items-center gap-3 p-2.5 bg-blue-50/40 rounded-2xl border border-blue-100/20">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-md">
              CM
            </div>
            <div className="min-w-0 flex-grow">
              <h4 className="text-xs font-black truncate text-slate-700">Chef Mario</h4>
              <p className="text-[9px] font-bold text-slate-400 truncate mt-0.5">restaurant@bitedash.com</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 text-xs font-black text-red-500 hover:text-red-600 bg-red-50/5 hover:bg-red-50 border border-red-200/10 hover:border-red-200/40 rounded-xl transition-all uppercase tracking-wider focus:outline-none"
          >
            <FaSignOutAlt className="text-sm" />
            <span>Logout Portal</span>
          </button>
        </div>
      </aside>

      {/* Main Body container */}
      <div className="flex-grow md:pl-68 flex flex-col min-h-screen">
        
        {/* Top Navbar */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 h-20 flex items-center justify-between px-6 sm:px-8 sticky top-0 z-30 shadow-sm">
          
          {/* Mobile Menu trigger & Active page title */}
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-slate-500 hover:text-blue-600 p-2 hover:bg-slate-55 rounded-xl transition-all focus:outline-none" 
              onClick={() => setSidebarOpen(true)}
            >
              <FaBars className="text-lg" />
            </button>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-800 tracking-tight leading-tight">
                {getPageTitle()}
              </h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">QuickBite System</p>
            </div>
          </div>

          {/* Quick info widgets */}
          <div className="flex items-center space-x-4">
            
            {/* Search Pill */}
            <div className="hidden sm:flex items-center bg-slate-50 border border-slate-100 rounded-2xl px-3.5 py-1.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition-all w-48 lg:w-60">
              <FaSearch className="text-slate-400 text-xs shrink-0" />
              <input
                type="text"
                placeholder="Search resources..."
                className="w-full bg-transparent border-none text-xs text-slate-800 pl-2 focus:outline-none placeholder-slate-350 font-semibold"
                readOnly
                onClick={() => toast('Global Search index active.')}
              />
            </div>

            {/* Date Widget */}
            <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-100 px-3.5 py-1.5 rounded-2xl text-xs font-bold text-slate-500">
              <FaCalendarAlt className="text-blue-500 text-xs" />
              <span>{getFormattedDate()}</span>
            </div>

            {/* Notification Alert Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  toast('No unread notifications.');
                }}
                className="relative text-slate-400 hover:text-blue-500 p-2 bg-slate-50 hover:bg-blue-50/60 rounded-2xl border border-slate-100 transition-colors focus:outline-none"
              >
                <FaBell className="text-sm" />
                <span className="absolute top-1.5 right-1.5 bg-blue-500 w-2 h-2 rounded-full ring-2 ring-white"></span>
              </button>
            </div>

            {/* Horizontal Line Divider */}
            <span className="w-[1px] h-6 bg-slate-200"></span>

            {/* Admin Badge */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center overflow-hidden hidden xs:flex shadow-inner bg-white">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Brand Logo"
                    className="w-full h-full object-cover"
                    style={{
                      borderRadius: logoShape === 'round' ? '9999px' : logoShape === 'square' ? '6px' : '0px'
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-blue-50 text-blue-500 flex items-center justify-center font-black text-xs">
                    <FaUserShield />
                  </div>
                )}
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-xs font-black text-slate-800 leading-none">Super Admin</p>
                <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Site Moderator</p>
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
          className="fixed inset-0 bg-black/40 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

    </div>
  );
}
