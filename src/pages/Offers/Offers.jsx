import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaPlus, FaTrash, FaCheck, FaTimes, FaSpinner, FaPercentage } from 'react-icons/fa';

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    discount: '',
    couponCode: '',
    expiryDate: '',
    status: 'Active',
  });

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/offers');
      setOffers(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load offers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.discount || !formData.couponCode) {
      toast.error('Please fill in name, discount amount, and coupon code');
      return;
    }

    try {
      setSubmitting(true);
      await axios.post('http://localhost:5000/api/offers', formData);
      toast.success('Coupon created successfully inside MongoDB!');
      setShowModal(false);
      setFormData({
        name: '',
        discount: '',
        couponCode: '',
        expiryDate: '',
        status: 'Active',
      });
      fetchOffers();
    } catch (error) {
      console.error(error);
      toast.error('Failed to create coupon code. Ensure coupon code is unique.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/offers/${id}`);
      toast.success('Coupon deleted successfully!');
      fetchOffers();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete coupon.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Coupons & Offers</h1>
          <p className="text-sm text-gray-400 mt-1">Configure active promotional coupons and discount campaigns</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-5 py-2.5 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm"
        >
          <FaPlus />
          <span>Add Coupon</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center items-center">
          <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-bold text-gray-400 mt-4">Connecting to Offers Database...</span>
        </div>
      ) : offers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 font-bold">No coupons configured yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div key={offer._id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden flex flex-col justify-between">
              {/* Cut-out ticket style left/right circles */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-gray-50 rounded-r-full border-r border-gray-100"></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-gray-50 rounded-l-full border-l border-gray-100"></div>

              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-gray-800 text-lg">{offer.name}</h3>
                    <p className="text-xs text-rose-500 font-black tracking-wider uppercase mt-1">{offer.discount}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(offer._id)}
                    className="text-gray-300 hover:text-rose-500 p-2 hover:bg-rose-50 rounded-lg transition-all"
                  >
                    <FaTrash />
                  </button>
                </div>

                <div className="bg-gray-50 border border-dashed border-gray-200 py-2.5 px-4 rounded-xl flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-gray-700 tracking-widest">{offer.couponCode}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    offer.status === 'Active' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'
                  }`}>
                    {offer.status}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400 flex justify-between items-center">
                <span>Expires: {offer.expiryDate ? new Date(offer.expiryDate).toLocaleDateString() : 'Never'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-xl space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h3 className="text-lg font-bold text-gray-800">Add Coupon</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-rose-500">
                <FaTimes className="text-lg" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Coupon Title *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Mega Weekend Feast"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Discount Text *</label>
                  <input
                    type="text"
                    name="discount"
                    required
                    value={formData.discount}
                    onChange={handleChange}
                    placeholder="e.g. 50% OFF"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    name="couponCode"
                    required
                    value={formData.couponCode}
                    onChange={handleChange}
                    placeholder="e.g. FEAST50"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expiry Date</label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-4"
              >
                {submitting ? <FaSpinner className="animate-spin" /> : 'Create Coupon'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
