import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AdminLayout from './layouts/AdminLayout.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Login from './pages/Login/Login.jsx';
import Foods from './pages/Foods/Foods.jsx';
import Categories from './pages/Categories/Categories.jsx';
import Orders from './pages/Orders/Orders.jsx';
import Users from './pages/Users/Users.jsx';
import Offers from './pages/Offers/Offers.jsx';
import Banners from './pages/Banners/Banners.jsx';
import Settings from './pages/Settings/Settings.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        
        {/* Admin Dashboard layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="categories" element={<Categories />} />
          <Route path="foods" element={<Foods />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
          <Route path="offers" element={<Offers />} />
          <Route path="banners" element={<Banners />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        
        {/* Redirect base / to login */}
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}
