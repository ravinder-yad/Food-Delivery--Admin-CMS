import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  FaSave, FaSpinner, FaGlobe, FaEnvelope, FaPhone, FaUpload, FaImage,
  FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaLinkedin, FaArrowsAltH, FaArrowsAltV, FaShapes
} from 'react-icons/fa';

export default function Settings() {
  const [settings, setSettings] = useState({
    websiteName: '',
    supportEmail: '',
    supportPhone: '',
    logo: '',
    banner: '',
    logoWidth: 100,
    logoShape: 'round',
    bannerHeight: 150,
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

  // Upload States
  const [selectedLogoFile, setSelectedLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [selectedBannerFile, setSelectedBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState('');

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/settings');
      const data = Array.isArray(res.data) ? res.data[0] : res.data;
      if (data) {
        setSettings({
          ...data,
          logo: data.logo || '',
          banner: data.banner || '',
          logoWidth: data.logoWidth || 100,
          logoShape: data.logoShape || 'round',
          bannerHeight: data.bannerHeight || 150,
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

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      const formData = new FormData();
      formData.append('websiteName', settings.websiteName);
      formData.append('supportEmail', settings.supportEmail);
      formData.append('supportPhone', settings.supportPhone);
      formData.append('logoWidth', settings.logoWidth);
      formData.append('logoShape', settings.logoShape);
      formData.append('bannerHeight', settings.bannerHeight);
      formData.append('socialLinks', JSON.stringify(settings.socialLinks));

      if (selectedLogoFile) {
        formData.append('logoFile', selectedLogoFile);
      } else {
        formData.append('logo', settings.logo);
      }

      if (selectedBannerFile) {
        formData.append('bannerFile', selectedBannerFile);
      } else {
        formData.append('banner', settings.banner);
      }

      const res = await axios.put('http://localhost:5000/api/settings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('System settings saved successfully!');
      setSelectedLogoFile(null);
      setSelectedBannerFile(null);
      setLogoPreview('');
      setBannerPreview('');
      
      const data = res.data;
      setSettings({
        ...data,
        logo: data.logo || '',
        banner: data.banner || '',
        logoWidth: data.logoWidth || 100,
        logoShape: data.logoShape || 'round',
        bannerHeight: data.bannerHeight || 150,
        socialLinks: {
          facebook: data.socialLinks?.facebook || '',
          twitter: data.socialLinks?.twitter || '',
          instagram: data.socialLinks?.instagram || '',
          youtube: data.socialLinks?.youtube || '',
          linkedin: data.socialLinks?.linkedin || '',
        }
      });
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
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-bold text-gray-400 mt-4">Connecting to Configuration Node...</span>
      </div>
    );
  }

  // Helper for Logo Border Radius shape style
  const getLogoBorderRadius = () => {
    if (settings.logoShape === 'round') return '9999px';
    if (settings.logoShape === 'square') return '16px';
    return '0px';
  };

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      <div>
        <h1 className="text-2xl font-black text-gray-800">System Settings</h1>
        <p className="text-sm text-gray-400 mt-1">Configure brand assets, brand logos, support contacts, and social integrations</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Brand Media Assets */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-black text-gray-800 border-b border-gray-50 pb-3 flex items-center gap-2">
            <FaImage className="text-blue-600" />
            <span>Brand Assets & Logo</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Logo Upload & Resizing Block */}
            <div className="flex flex-col items-center p-6 bg-slate-50 rounded-2xl border border-slate-100 justify-between">
              <div className="w-full">
                <span className="text-xs font-bold text-gray-500 uppercase mb-4 block">Brand Logo</span>
                
                {/* Logo Image Box with Inline size styles */}
                <div className="flex justify-center items-center min-h-[140px] mb-4 bg-white rounded-xl border border-slate-100 p-2">
                  <div
                    className="relative border-2 border-blue-500/20 overflow-hidden flex items-center justify-center bg-white shadow-inner transition-all duration-150"
                    style={{
                      width: `${settings.logoWidth}px`,
                      height: `${settings.logoWidth}px`,
                      borderRadius: getLogoBorderRadius()
                    }}
                  >
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />
                    ) : settings.logo ? (
                      <img src={settings.logo} alt="Current Logo" className="w-full h-full object-cover" />
                    ) : (
                      <FaImage className="text-gray-300 text-3xl" />
                    )}
                  </div>
                </div>
              </div>

              {/* Resize & Shape Sliders/Controls */}
              <div className="w-full space-y-3.5 mb-5 px-1">
                {/* Width Slider */}
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1">
                    <span className="flex items-center gap-1"><FaArrowsAltH className="text-blue-500" /> Logo Width</span>
                    <span className="text-blue-600">{settings.logoWidth}px</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="140"
                    step="5"
                    name="logoWidth"
                    value={settings.logoWidth}
                    onChange={(e) => setSettings({ ...settings, logoWidth: Number(e.target.value) })}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Shape Selector */}
                <div>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500 mb-1.5"><FaShapes className="text-blue-500" /> Logo Shape</span>
                  <div className="grid grid-cols-3 gap-2">
                    {['round', 'square', 'original'].map((shape) => (
                      <button
                        key={shape}
                        type="button"
                        onClick={() => setSettings({ ...settings, logoShape: shape })}
                        className={`py-1.5 rounded-lg text-[10px] font-bold border capitalize transition-all ${
                          settings.logoShape === shape
                            ? 'bg-blue-50 text-blue-600 border-blue-200 shadow-sm'
                            : 'bg-white text-gray-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {shape}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <label className="cursor-pointer bg-white hover:bg-slate-100 text-blue-600 border border-blue-200 font-bold text-xs py-2 px-4 rounded-xl transition-all flex items-center gap-2 shadow-sm">
                <FaUpload />
                <span>Upload Logo File</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Banner Upload & Resizing Block */}
            <div className="flex flex-col items-center p-6 bg-slate-50 rounded-2xl border border-slate-100 justify-between">
              <div className="w-full">
                <span className="text-xs font-bold text-gray-500 uppercase mb-4 block">Brand Banner</span>
                
                {/* Banner Box with dynamic inline height styles */}
                <div className="flex justify-center items-center min-h-[140px] mb-4 bg-white rounded-xl border border-slate-100 p-2">
                  <div
                    className="w-full border border-slate-200 overflow-hidden flex items-center justify-center bg-white shadow-inner transition-all duration-150 rounded-lg"
                    style={{
                      height: `${settings.bannerHeight}px`
                    }}
                  >
                    {bannerPreview ? (
                      <img src={bannerPreview} alt="Banner Preview" className="w-full h-full object-cover" />
                    ) : settings.banner ? (
                      <img src={settings.banner} alt="Current Banner" className="w-full h-full object-cover" />
                    ) : (
                      <FaImage className="text-gray-300 text-3xl" />
                    )}
                  </div>
                </div>
              </div>

              {/* Height Slider */}
              <div className="w-full space-y-3.5 mb-5 px-1">
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1">
                    <span className="flex items-center gap-1"><FaArrowsAltV className="text-blue-500" /> Banner Height</span>
                    <span className="text-blue-600">{settings.bannerHeight}px</span>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="140"
                    step="5"
                    name="bannerHeight"
                    value={settings.bannerHeight}
                    onChange={(e) => setSettings({ ...settings, bannerHeight: Number(e.target.value) })}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>

              <label className="cursor-pointer bg-white hover:bg-slate-100 text-blue-600 border border-blue-200 font-bold text-xs py-2 px-4 rounded-xl transition-all flex items-center gap-2 shadow-sm">
                <FaUpload />
                <span>Upload Banner File</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                  className="hidden"
                />
              </label>
            </div>

          </div>
        </div>

        {/* Brand & Support Contacts */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-black text-gray-800 border-b border-gray-50 pb-3 flex items-center gap-2">
            <FaGlobe className="text-blue-600" />
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
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
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
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
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
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Social Settings */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-black text-gray-800 border-b border-gray-50 pb-3 flex items-center gap-2">
            <FaFacebook className="text-blue-600" />
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
          <span>Save System Settings</span>
        </button>
      </form>
    </div>
  );
}
