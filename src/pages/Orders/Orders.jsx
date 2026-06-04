import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaEye, FaEdit, FaCheck, FaTimes, FaSpinner, FaMapMarkerAlt, FaUser } from 'react-icons/fa';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/orders');
      setOrders(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setStatusUpdating(true);
      const res = await axios.put(`http://localhost:5000/api/orders/${orderId}`, { orderStatus: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(res.data);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update status.');
    } finally {
      setStatusUpdating(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Placed':
        return 'bg-blue-50 text-blue-600 border border-blue-200';
      case 'Accepted':
        return 'bg-purple-50 text-purple-600 border border-purple-200';
      case 'Preparing':
        return 'bg-yellow-50 text-yellow-600 border border-yellow-200';
      case 'OutForDelivery':
        return 'bg-orange-50 text-orange-600 border border-orange-200';
      case 'Delivered':
        return 'bg-green-50 text-green-600 border border-green-200';
      case 'Cancelled':
        return 'bg-red-50 text-red-600 border border-red-200';
      default:
        return 'bg-gray-50 text-gray-600 border border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-800">Live Orders</h1>
        <p className="text-sm text-gray-400 mt-1">Monitor, assign, and update active client orders in real-time</p>
      </div>

      {loading ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center items-center">
          <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-bold text-gray-400 mt-4">Loading Live Feed...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 font-bold">No orders placed yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-black text-gray-400 uppercase tracking-wider">
                  <th className="p-5">Order ID</th>
                  <th className="p-5">Items</th>
                  <th className="p-5">Total</th>
                  <th className="p-5">Payment</th>
                  <th className="p-5">Status</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm font-semibold text-gray-700">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-5">
                      <span className="font-mono text-gray-500 text-xs font-bold">#{order._id?.slice(-8).toUpperCase()}</span>
                    </td>
                    <td className="p-5">
                      <div className="max-w-[250px] truncate">
                        {order.items?.map(i => `${i.name} x${i.quantity}`).join(', ')}
                      </div>
                    </td>
                    <td className="p-5 font-bold text-rose-500">₹{order.totalAmount}</td>
                    <td className="p-5">
                      <span className="text-xs font-bold">
                        {order.paymentMethod} ({order.paymentStatus})
                      </span>
                    </td>
                    <td className="p-5">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full outline-none cursor-pointer ${getStatusStyle(order.orderStatus)}`}
                      >
                        <option value="Placed">Placed</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Preparing">Preparing</option>
                        <option value="OutForDelivery">Out For Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-5 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowDetailModal(true);
                        }}
                        className="text-gray-400 hover:text-rose-500 p-2 hover:bg-rose-50 rounded-lg transition-all"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-xl space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h3 className="text-lg font-black text-gray-800">Order Details</h3>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedOrder(null);
                }}
                className="text-gray-400 hover:text-rose-500"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400 font-bold">Order ID:</span>
                <span className="font-mono font-bold text-gray-800">#{selectedOrder._id?.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-bold">Status:</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getStatusStyle(selectedOrder.orderStatus)}`}>
                  {selectedOrder.orderStatus}
                </span>
              </div>

              {/* Items List */}
              <div className="border-y border-gray-100 py-3 space-y-2">
                <p className="font-bold text-gray-800">Items Ordered:</p>
                {selectedOrder.items?.map((item) => (
                  <div key={item._id} className="flex justify-between text-gray-600 font-semibold">
                    <span>{item.name} x{item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Delivery info */}
              <div className="space-y-1">
                <p className="font-bold text-gray-800 flex items-center gap-1.5">
                  <FaUser className="text-xs text-rose-500" />
                  <span>Customer Info:</span>
                </p>
                <p className="text-gray-500 font-semibold">
                  ID: {selectedOrder.user?._id || selectedOrder.user}
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-gray-800 flex items-center gap-1.5">
                  <FaMapMarkerAlt className="text-xs text-rose-500" />
                  <span>Delivery Address ID:</span>
                </p>
                <p className="text-gray-500 font-semibold">{selectedOrder.deliveryAddress}</p>
              </div>

              {/* Total Calculation */}
              <div className="bg-gray-50 p-4 rounded-2xl flex justify-between font-bold text-gray-800">
                <span>Grand Total:</span>
                <span className="text-rose-500 text-lg">₹{selectedOrder.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
