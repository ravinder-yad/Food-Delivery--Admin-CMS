import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaSave, FaSpinner, FaGlobe, FaEnvelope, FaPhone, FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';

export default function Settings() {
  const [settings, setSettings] = useState({
    websiteName: '',
    supportEmail: '',
    supportPhone: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      instagram: '',
      youtube: '',
      linkedin: '',
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/settings');
      // If server returns array or empty, handle fallback
      const data = Array.isArray(res.data) ? res.data[0] : res.data;
      if (data) {
        setSettings({
          ...data,
          socialLinks: {
            facebook: data.socialLinks?.facebook || '',
            twitter: data.socialLinks?.twitter || '',
            instagram: data.socialLinks?.instagram || '',
            youtube: data.socialLinks?.youtube || '',
            linkedin: data.socialLinks?.linkedin || '',
          }
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await axios.put('http://localhost:5000/api/settings', settings);
      toast.success('System settings saved successfully!');
      fetchSettings();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update system settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center items-center">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-bold text-gray-400 mt-4">Connecting to Configuration Node...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-gray-800">System Settings</h1>
        <p className="text-sm text-gray-400 mt-1">Configure brand assets, support contacts, and social links</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Settings */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-black text-gray-800 border-b border-gray-50 pb-3 flex items-center gap-2">
            <FaGlobe className="text-rose-500" />
            <span>Brand & Support Settings</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Website Name *</label>
              <input
                type="text"
                name="websiteName"
                required
                value={settings.websiteName}
                onChange={handleChange}
                placeholder="e.g. QuickBite"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Support Email *</label>
              <input
                type="email"
                name="supportEmail"
                required
                value={settings.supportEmail}
                onChange={handleChange}
                placeholder="e.g. support@quickbite.com"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Support Phone *</label>
              <input
                type="text"
                name="supportPhone"
                required
                value={settings.supportPhone}
                onChange={handleChange}
                placeholder="e.g. +91 9999999999"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>
        </div>

        {/* Social Settings */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-black text-gray-800 border-b border-gray-50 pb-3 flex items-center gap-2">
            <FaFacebook className="text-rose-500" />
            <span>Social Integrations</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <FaFacebook className="text-blue-600 text-xl" />
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Facebook URL</label>
                <input
                  type="text"
                  name="facebook"
                  value={settings.socialLinks.facebook}
                  onChange={handleSocialChange}
                  placeholder="https://facebook.com/..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FaTwitter className="text-sky-500 text-xl" />
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Twitter URL</label>
                <input
                  type="text"
                  name="twitter"
                  value={settings.socialLinks.twitter}
                  onChange={handleSocialChange}
                  placeholder="https://twitter.com/..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FaInstagram className="text-pink-600 text-xl" />
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Instagram URL</label>
                <input
                  type="text"
                  name="instagram"
                  value={settings.socialLinks.instagram}
                  onChange={handleSocialChange}
                  placeholder="https://instagram.com/..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FaYoutube className="text-red-600 text-xl" />
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Youtube URL</label>
                <input
                  type="text"
                  name="youtube"
                  value={settings.socialLinks.youtube}
                  onChange={handleSocialChange}
                  placeholder="https://youtube.com/..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 md:col-span-2">
              <FaLinkedin className="text-blue-700 text-xl" />
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">LinkedIn URL</label>
                <input
                  type="text"
                  name="linkedin"
                  value={settings.socialLinks.linkedin}
                  onChange={handleSocialChange}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
          <span>Save System Settings</span>
        </button>
      </form>
    </div>
  );
}
