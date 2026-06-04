import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaPlus, FaTrash, FaCheck, FaTimes, FaSpinner, FaEdit, FaUpload, FaImage } from 'react-icons/fa';

export default function Foods() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discount: '0',
    category: '',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300',
    isVeg: true,
    isAvailable: true,
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchFoodsAndCategories = async () => {
    try {
      setLoading(true);
      const foodsRes = await axios.get('http://localhost:5000/api/foods');
      setFoods(foodsRes.data || []);

      const categoriesRes = await axios.get('http://localhost:5000/api/categories');
      setCategories(categoriesRes.data || []);
      
      if (categoriesRes.data && categoriesRes.data.length > 0 && !formData.category) {
        setFormData(prev => ({ ...prev, category: categoriesRes.data[0]._id }));
      }
    } catch (error) {
      console.error('Error fetching admin foods:', error);
      toast.error('Failed to connect to backend REST APIs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodsAndCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setSelectedFile(null);
    setFilePreview('');
    setFormData({
      name: '',
      description: '',
      price: '',
      discount: '0',
      category: categories[0]?._id || '',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300',
      isVeg: true,
      isAvailable: true,
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setSelectedFile(null);
    setFilePreview('');
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      discount: (item.discount || 0).toString(),
      category: item.category?._id || item.category || '',
      image: item.image || '',
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);

      // Construct Multipart Form Data
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('discount', formData.discount);
      data.append('category', formData.category);
      data.append('isVeg', formData.isVeg);
      data.append('isAvailable', formData.isAvailable);
      data.append('restaurant', '60d014000000000000000001'); // Seeded La Piazza ObjectId

      if (selectedFile) {
        data.append('imageFile', selectedFile);
      } else {
        data.append('image', formData.image);
      }

      if (editingItem) {
        await axios.put(`http://localhost:5000/api/foods/${editingItem._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Food item updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/foods', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Food item created successfully inside MongoDB!');
      }

      setShowModal(false);
      fetchFoodsAndCategories();
    } catch (error) {
      console.error(error);
      toast.error(editingItem ? 'Failed to update food item.' : 'Failed to create food item.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this food item?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/foods/${id}`);
      toast.success('Item deleted successfully!');
      fetchFoodsAndCategories();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete item.');
    }
  };

  const toggleAvailability = async (item) => {
    try {
      const updated = { ...item, isAvailable: !item.isAvailable };
      await axios.put(`http://localhost:5000/api/foods/${item._id}`, updated);
      toast.success(`Availability updated for ${item.name}`);
      fetchFoodsAndCategories();
    } catch (error) {
      console.error(error);
      toast.error('Failed to toggle availability.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Manage Foods</h1>
          <p className="text-sm text-gray-400 mt-1">Add, edit, or delete food items instantly</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-5 py-2.5 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm cursor-pointer"
        >
          <FaPlus />
          <span>Add New Food</span>
        </button>
      </div>

      {/* Foods Table */}
      {loading ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center items-center">
          <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-bold text-gray-400 mt-4">Connecting to Database...</span>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-black text-gray-400 uppercase tracking-wider">
                  <th className="p-5">Dish</th>
                  <th className="p-5">Category</th>
                  <th className="p-5">Price</th>
                  <th className="p-5">Discount</th>
                  <th className="p-5">Type</th>
                  <th className="p-5">Availability</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm font-semibold text-gray-700">
                {foods.map((food) => (
                  <tr key={food._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-5 flex items-center gap-4">
                      <img src={food.image} alt={food.name} className="w-12 h-12 rounded-xl object-cover shadow-inner shrink-0" />
                      <div>
                        <p className="font-bold text-gray-800">{food.name}</p>
                        <p className="text-xs text-gray-400 font-medium line-clamp-1 max-w-[200px] mt-0.5">{food.description}</p>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs font-bold">
                        {food.category?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="p-5 font-bold text-rose-500">₹{food.price}</td>
                    <td className="p-5 font-bold text-green-600">{food.discount > 0 ? `${food.discount}% OFF` : 'No Discount'}</td>
                    <td className="p-5">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                        food.isVeg ? 'border-green-500 text-green-500 bg-green-50' : 'border-red-500 text-red-500 bg-red-50'
                      }`}>
                        {food.isVeg ? 'VEG' : 'NON-VEG'}
                      </span>
                    </td>
                    <td className="p-5">
                      <button
                        onClick={() => toggleAvailability(food)}
                        className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
                          food.isAvailable
                            ? 'bg-green-50 text-green-600 border border-green-200'
                            : 'bg-red-50 text-red-600 border border-red-200'
                        }`}
                      >
                        {food.isAvailable ? <FaCheck className="text-[10px]" /> : <FaTimes className="text-[10px]" />}
                        <span>{food.isAvailable ? 'In Stock' : 'Out of Stock'}</span>
                      </button>
                    </td>
                    <td className="p-5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(food)}
                        className="text-gray-400 hover:text-rose-500 p-2 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                        title="Edit Item"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(food._id)}
                        className="text-gray-400 hover:text-rose-500 p-2 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                        title="Delete Item"
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold text-gray-800">
                {editingItem ? 'Edit Food Item' : 'Add New Food Item'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-rose-500 cursor-pointer">
                <FaTimes className="text-lg" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Food Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Cheesy Paneer Tikka"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    required
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g. 299"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Discount (%)</label>
                  <input
                    type="number"
                    name="discount"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={handleChange}
                    placeholder="e.g. 10"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category *</label>
                  <select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                <textarea
                  name="description"
                  rows="2"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the dish ingredients, spices..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                ></textarea>
              </div>

              {/* Image Input Options */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/50 space-y-4">
                <p className="text-xs font-bold text-gray-500 uppercase">Food Image Source</p>
                
                {/* Option 1: File Upload */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Option A: Upload File</label>
                  <div className="flex items-center gap-3">
                    <label className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-sm">
                      <FaUpload />
                      <span>Choose Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    <span className="text-xs text-gray-500 truncate max-w-[200px]">
                      {selectedFile ? selectedFile.name : 'No file chosen'}
                    </span>
                  </div>
                </div>

                {/* Option 2: Image URL */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Option B: Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={(e) => {
                      handleChange(e);
                      setSelectedFile(null); // Clear file upload if typing URL
                      setFilePreview('');
                    }}
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                {/* Live Preview Box */}
                {(filePreview || formData.image) && (
                  <div className="pt-2 border-t border-gray-200/50 flex justify-center">
                    <div className="relative w-28 h-28 rounded-2xl overflow-hidden shadow-inner border border-gray-200 bg-white flex items-center justify-center">
                      <img
                        src={filePreview || formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300';
                        }}
                      />
                      <span className="absolute top-1 left-1 bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase">
                        Preview
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isVeg"
                    checked={formData.isVeg}
                    onChange={handleChange}
                    className="w-4 h-4 text-rose-500 focus:ring-rose-500 border-gray-300 rounded cursor-pointer"
                  />
                  <span>Is Vegetarian</span>
                </label>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleChange}
                    className="w-4 h-4 text-rose-500 focus:ring-rose-500 border-gray-300 rounded cursor-pointer"
                  />
                  <span>In Stock</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                {submitting ? <FaSpinner className="animate-spin" /> : editingItem ? 'Save Updates' : 'Create Food Item'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
