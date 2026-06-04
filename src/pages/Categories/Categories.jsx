import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaPlus, FaTimes, FaSpinner } from 'react-icons/fa';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=200',
    description: '',
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/categories');
      setCategories(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Category name is required');
      return;
    }

    try {
      setSubmitting(true);
      await axios.post('http://localhost:5000/api/categories', formData);
      toast.success('Category created inside MongoDB!');
      setShowModal(false);
      setFormData({
        name: '',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=200',
        description: '',
      });
      fetchCategories();
    } catch (error) {
      console.error(error);
      toast.error('Failed to create category.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Manage Categories</h1>
          <p className="text-sm text-gray-400 mt-1">Configure food categories on the platform</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-5 py-2.5 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm"
        >
          <FaPlus />
          <span>Add Category</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center items-center">
          <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-bold text-gray-400 mt-4 font-semibold">Connecting...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div key={cat._id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <img src={cat.image} alt={cat.name} className="w-20 h-20 rounded-full object-cover mb-4 shadow-inner" />
              <h3 className="font-bold text-gray-800 text-lg">{cat.name}</h3>
              <p className="text-xs text-gray-400 font-medium mt-1 line-clamp-2">{cat.description || 'No description added'}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-xl space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h3 className="text-lg font-bold text-gray-800">Add Category</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-rose-500">
                <FaTimes className="text-lg" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. South Indian"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="e.g. Fluffy idlis and crispy dosas"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-4"
              >
                {submitting ? <FaSpinner className="animate-spin" /> : 'Create Category'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
