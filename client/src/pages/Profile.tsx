import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User, Phone, MapPin, AlignLeft, Loader2, Save, CheckCircle2, Camera } from 'lucide-react';

export default function Profile() {
  const { user, token, updateUser, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    bio: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    
    try {
      const response = await axios.put('http://localhost:5001/api/users/me', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        updateUser(formData);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('profilePicture', file);

    setPhotoLoading(true);
    try {
      const response = await axios.post('http://localhost:5001/api/users/profile-photo', uploadData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        updateUser({ profilePicture: response.data.profilePicture });
      }
    } catch (error) {
      console.error('Failed to upload photo:', error);
      alert('Failed to upload profile photo.');
    } finally {
      setPhotoLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
          <h2 className="text-2xl font-bold text-stone-800 mb-4">Sign In Required</h2>
          <p className="text-stone-500">Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[calc(100vh-80px)]">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-stone-900 mb-2">My Profile</h1>
        <p className="text-stone-500">Manage your personal information and contact details.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
        {/* Profile Header */}
        <div className="bg-stone-50 border-b border-stone-200 p-8 flex items-center gap-6">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handlePhotoUpload} 
            />
            {photoLoading ? (
              <div className="w-24 h-24 rounded-full bg-stone-200 flex items-center justify-center border-4 border-white shadow-md">
                <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
              </div>
            ) : user.profilePicture ? (
              <img src={user.profilePicture} alt={user.name} className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary text-white flex items-center justify-center font-bold text-4xl shadow-md border-4 border-white">
                {user.name.charAt(0)}
              </div>
            )}
            
            {/* Hover overlay */}
            {!photoLoading && (
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-stone-900">{user.name}</h2>
            <p className="text-stone-500 font-medium">{user.email}</p>
            <div className="mt-2 inline-flex items-center text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Verified Google Account
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="p-8">
          <div className="mb-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700 flex items-center">
                <User className="w-4 h-4 mr-2 text-stone-400" /> Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700 flex items-center">
                <Phone className="w-4 h-4 mr-2 text-stone-400" /> Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700 flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-stone-400" /> Location / Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Delhi NCR, India"
                className="w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2 mb-8">
            <label className="text-sm font-bold text-stone-700 flex items-center">
              <AlignLeft className="w-4 h-4 mr-2 text-stone-400" /> Bio / About Me
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              placeholder="Tell potential tenants a little bit about yourself..."
              className="w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-stone-900 hover:bg-black text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md flex items-center"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
              Save Changes
            </button>
            
            {success && (
              <span className="text-emerald-600 font-bold flex items-center animate-in fade-in duration-300">
                <CheckCircle2 className="w-5 h-5 mr-1" /> Profile Updated
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
