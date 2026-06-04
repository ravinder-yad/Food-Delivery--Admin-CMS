import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaPlus, FaTrash, FaTimes, FaSpinner, FaImage } from 'react-icons/fa';

export default function Banners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600',
    buttonText: 'Order Now',
    buttonLink: '/restaurants',
  });

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/banners');
      setBanners(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load banners.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.image) {
      toast.error('Banner title and image URL are required');
      return;
    }

    try {
      setSubmitting(true);
      await axios.post('http://localhost:5000/api/banners', formData);
      toast.success('Banner created inside MongoDB!');
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600',
        buttonText: 'Order Now',
        buttonLink: '/restaurants',
      });
      fetchBanners();
    } catch (error) {
      console.error(error);
      toast.error('Failed to create banner.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/banners/${id}`);
      toast.success('Banner deleted successfully!');
      fetchBanners();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete banner.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Carousel Banners</h1>
          <p className="text-sm text-gray-400 mt-1">Configure client home screen hero carousels and redirects</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-5 py-2.5 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm"
        >
          <FaPlus />
          <span>Add Banner</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center items-center">
          <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-bold text-gray-400 mt-4">Connecting to Banners Database...</span>
        </div>
      ) : banners.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 font-bold">No banners added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((banner) => (
            <div key={banner._id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
              <img src={banner.image} alt={banner.title} className="w-full h-48 object-cover shadow-inner" />
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-gray-800 text-lg leading-snug">{banner.title}</h3>
                  <p className="text-xs text-gray-400 font-medium mt-1">{banner.description || 'No description'}</p>
                </div>
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-50">
                  <span className="bg-rose-50 text-rose-500 text-xs font-bold px-3 py-1 rounded-xl">
                    {banner.buttonText} → {banner.buttonLink}
                  </span>
                  <button
                    onClick={() => handleDelete(banner._id)}
                    className="text-gray-400 hover:text-rose-500 p-2 hover:bg-rose-50 rounded-lg transition-all"
                  >
                    <FaTrash />
                  </button>
                </div>
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
              <h3 className="text-lg font-bold text-gray-800">Add New Banner</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-rose-500">
                <FaTimes className="text-lg" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Banner Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Delicious Pizza Fest"
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
                  placeholder="e.g. Flat 50% Off on all pizzas"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Image URL *</label>
                <input
                  type="text"
                  name="image"
                  required
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Button Text</label>
                  <input
                    type="text"
                    name="buttonText"
                    value={formData.buttonText}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Button Link</label>
                  <input
                    type="text"
                    name="buttonLink"
                    value={formData.buttonLink}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-4"
              >
                {submitting ? <FaSpinner className="animate-spin" /> : 'Create Banner'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
