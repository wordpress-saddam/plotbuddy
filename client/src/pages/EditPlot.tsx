import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Loader2, Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EditPlot() {
  const { id } = useParams<{ id: string }>();
  const { token, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    area: '',
    monthlyRent: '',
    lat: '',
    lng: '',
    fencing: false,
    water: false,
    electricity: false,
  });

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [images, setImages] = useState<FileList | null>(null);

  useEffect(() => {
    const fetchPlot = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/lands/${id}`);
        if (response.data.success) {
          const plot = response.data.data;
          
          if (plot.owner !== user?.id) {
            setError("You do not have permission to edit this plot.");
            setLoading(false);
            return;
          }

          setFormData({
            title: plot.title,
            area: plot.area.toString(),
            monthlyRent: plot.monthlyRent.toString(),
            lat: plot.location.coordinates[1].toString(),
            lng: plot.location.coordinates[0].toString(),
            fencing: plot.amenities.fencing,
            water: plot.amenities.water,
            electricity: plot.amenities.electricity,
          });
          setExistingImages(plot.images || []);
        }
      } catch (err) {
        setError("Failed to fetch plot details.");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user) {
      fetchPlot();
    } else {
      setLoading(false);
    }
  }, [id, isAuthenticated, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(e.target.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const lat = parseFloat(formData.lat);
    const lng = parseFloat(formData.lng);
    if (isNaN(lat) || isNaN(lng) || lat < 28.2 || lat > 28.9 || lng < 76.8 || lng > 77.6) {
      setError("Coordinates must be within Delhi NCR region (Lat: 28.2-28.9, Lng: 76.8-77.6)");
      setSaving(false);
      return;
    }

    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value.toString());
    });

    if (images) {
      Array.from(images).forEach((file) => {
        submitData.append('images', file);
      });
    }

    try {
      const response = await axios.put(`http://localhost:5001/api/lands/${id}`, submitData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        navigate('/my-plots');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update plot. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
          <h2 className="text-2xl font-bold text-stone-800 mb-4">Sign In Required</h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (error && !formData.title) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl font-bold mb-4">{error}</div>
        <Link to="/my-plots" className="text-primary hover:underline font-medium">Return to My Plots</Link>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-[calc(100vh-80px)] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <Link to="/my-plots" className="inline-flex items-center text-sm font-bold text-stone-500 hover:text-stone-800 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to My Plots
          </Link>
          <h1 className="text-3xl font-extrabold text-stone-900">Edit Plot</h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-stone-200 p-8 space-y-8">
          
          {/* Basic Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-2">Basic Details</h3>
            
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Plot Title / Description</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Area (sq yards)</label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  required
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Monthly Rent (₹)</label>
                <input
                  type="number"
                  name="monthlyRent"
                  value={formData.monthlyRent}
                  onChange={handleChange}
                  required
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-2 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-primary" /> Location (Delhi NCR)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Latitude</label>
                <input
                  type="number"
                  step="any"
                  name="lat"
                  value={formData.lat}
                  onChange={handleChange}
                  required
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Longitude</label>
                <input
                  type="number"
                  step="any"
                  name="lng"
                  value={formData.lng}
                  onChange={handleChange}
                  required
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-2">Amenities</h3>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="fencing"
                  checked={formData.fencing}
                  onChange={handleChange}
                  className="w-5 h-5 text-primary rounded border-stone-300 focus:ring-primary"
                />
                <span className="text-stone-700 font-medium">Boundary/Fencing</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="water"
                  checked={formData.water}
                  onChange={handleChange}
                  className="w-5 h-5 text-primary rounded border-stone-300 focus:ring-primary"
                />
                <span className="text-stone-700 font-medium">Water Supply</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="electricity"
                  checked={formData.electricity}
                  onChange={handleChange}
                  className="w-5 h-5 text-primary rounded border-stone-300 focus:ring-primary"
                />
                <span className="text-stone-700 font-medium">Electricity</span>
              </label>
            </div>
          </div>

          {/* Photos */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-2 flex items-center">
              <ImageIcon className="w-5 h-5 mr-2 text-primary" /> Photos
            </h3>
            
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 mb-4 flex gap-4 overflow-x-auto">
              {existingImages.length > 0 ? (
                existingImages.map((url, i) => (
                  <img key={i} src={url} alt={`Existing ${i}`} className="h-24 w-24 object-cover rounded-lg shadow-sm shrink-0" />
                ))
              ) : (
                <span className="text-sm text-stone-500">No existing photos.</span>
              )}
            </div>

            <div className="border-2 border-dashed border-stone-300 rounded-xl p-8 text-center bg-stone-50 hover:bg-stone-100 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="images-upload"
              />
              <label htmlFor="images-upload" className="cursor-pointer flex flex-col items-center">
                <ImageIcon className="w-10 h-10 text-stone-400 mb-3" />
                <span className="text-stone-700 font-bold mb-1">Click to upload new photos</span>
                <span className="text-stone-500 text-sm">Upload up to 5 images (will replace existing ones)</span>
                {images && <span className="mt-3 text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full text-xs border border-emerald-100">{images.length} files selected</span>}
              </label>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-stone-900 hover:bg-black text-white px-10 py-3.5 rounded-xl font-bold transition-all shadow-md flex items-center"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
              Save Changes
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
