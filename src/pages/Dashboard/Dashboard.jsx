import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { FaUsers, FaUtensils, FaClipboardList, FaWallet } from 'react-icons/fa';

export default function Dashboard() {
  const stats = [
    { title: 'Total Users', value: '1,240', change: '+12% this month', icon: FaUsers, color: 'text-blue-500 bg-blue-50' },
    { title: 'Total Foods', value: '45', change: '5 categories', icon: FaUtensils, color: 'text-rose-500 bg-rose-50' },
    { title: 'Total Orders', value: '890', change: '+18% vs last week', icon: FaClipboardList, color: 'text-green-500 bg-green-50' },
    { title: 'Total Revenue', value: '₹24,800', change: '5% GST included', icon: FaWallet, color: 'text-amber-500 bg-amber-50' },
  ];

  const orderData = [
    { name: 'Mon', orders: 12 },
    { name: 'Tue', orders: 19 },
    { name: 'Wed', orders: 15 },
    { name: 'Thu', orders: 25 },
    { name: 'Fri', orders: 32 },
    { name: 'Sat', orders: 40 },
    { name: 'Sun', orders: 35 },
  ];

  const revenueData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 5500 },
    { name: 'Mar', revenue: 5000 },
    { name: 'Apr', revenue: 8000 },
    { name: 'May', revenue: 12000 },
    { name: 'Jun', revenue: 15000 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-800">Dashboard Overview</h1>
        <p className="text-sm text-gray-400 mt-1">Real-time statistics and analytics for BiteDash AI</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="space-y-2">
                <span className="text-sm font-semibold text-gray-400 block">{stat.title}</span>
                <span className="text-2xl font-black text-gray-800 block">{stat.value}</span>
                <span className="text-[10px] font-bold text-gray-400 block">{stat.change}</span>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${stat.color}`}>
                <Icon className="text-xl" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Orders Area Chart */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Daily Orders Tracker</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={orderData}>
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="orders" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorOrders)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Revenue Bar Chart */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Monthly Revenue Summary</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
