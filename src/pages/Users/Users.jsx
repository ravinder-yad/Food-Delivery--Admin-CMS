import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaTrash, FaCheck, FaTimes, FaSpinner, FaUserShield, FaUserEdit } from 'react-icons/fa';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/users');
      setUsers(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load users from backend REST APIs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const changeUserRole = async (id, newRole) => {
    try {
      setUpdatingId(id);
      await axios.put(`http://localhost:5000/api/users/${id}`, { role: newRole });
      toast.success(`Role updated successfully to ${newRole}`);
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error('Failed to change user role.');
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleVerification = async (user) => {
    try {
      setUpdatingId(user._id);
      await axios.put(`http://localhost:5000/api/users/${user._id}`, { isVerified: !user.isVerified });
      toast.success(`Verification status updated!`);
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update verification.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      toast.success('User deleted successfully!');
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete user.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-800">Manage Users</h1>
        <p className="text-sm text-gray-400 mt-1">Configure account access, credentials verification, and platform roles</p>
      </div>

      {loading ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center items-center">
          <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-bold text-gray-400 mt-4">Connecting to User Database...</span>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-black text-gray-400 uppercase tracking-wider">
                  <th className="p-5">User</th>
                  <th className="p-5">Contact Details</th>
                  <th className="p-5">Verification</th>
                  <th className="p-5">Platform Role</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm font-semibold text-gray-700">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-5 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 font-bold flex items-center justify-center shadow-inner shrink-0">
                        {user.name?.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{user.name}</p>
                        <span className="text-[10px] text-gray-400 font-mono">ID: {user._id}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <p className="text-gray-800">{user.email}</p>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">{user.phone}</p>
                    </td>
                    <td className="p-5">
                      <button
                        onClick={() => toggleVerification(user)}
                        disabled={updatingId === user._id}
                        className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 transition-all ${
                          user.isVerified
                            ? 'bg-green-50 text-green-600 border border-green-200'
                            : 'bg-red-50 text-red-600 border border-red-200'
                        }`}
                      >
                        {user.isVerified ? <FaCheck className="text-[10px]" /> : <FaTimes className="text-[10px]" />}
                        <span>{user.isVerified ? 'Verified' : 'Unverified'}</span>
                      </button>
                    </td>
                    <td className="p-5">
                      <select
                        value={user.role}
                        onChange={(e) => changeUserRole(user._id, e.target.value)}
                        disabled={updatingId === user._id}
                        className="text-xs font-bold bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 outline-none cursor-pointer text-gray-700"
                      >
                        <option value="customer">Customer</option>
                        <option value="delivery_partner">Delivery Partner</option>
                        <option value="restaurant_owner">Vendor/Owner</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </td>
                    <td className="p-5 text-right">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-gray-400 hover:text-rose-500 p-2 hover:bg-rose-50 rounded-lg transition-all"
                        title="Delete User"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
