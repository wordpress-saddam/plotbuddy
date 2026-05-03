import React, { useState } from 'react';
import axios from 'axios';
import { MapPin, Image as ImageIcon, Home, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface RegistrationFormProps {
  onFormDataChange: (data: any) => void;
  onImageChange: (files: FileList | null) => void;
}

export default function RegistrationForm({ onFormDataChange, onImageChange }: RegistrationFormProps) {
  const { token } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    area: '',
    monthlyRent: '',
    address: '',
    googleMapsLink: '',
    lat: '',
    lng: '',
    fencing: false,
    water: false,
    electricity: false,
  });

  const [images, setImages] = useState<FileList | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    const updatedData = { ...formData, [name]: newValue };
    setFormData(updatedData);
    onFormDataChange(updatedData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(e.target.files);
      onImageChange(e.target.files);
    }
  };

  const validateStep1 = () => {
    return formData.title.length > 0 && formData.area.length > 0 && formData.monthlyRent.length > 0;
  };

  const validateStep2 = () => {
    if (!formData.address) {
      setError("Address is required.");
      return false;
    }

    if (formData.lat || formData.lng) {
      const lat = parseFloat(formData.lat);
      const lng = parseFloat(formData.lng);
      const minLat = 28.2, maxLat = 28.9, minLng = 76.8, maxLng = 77.6;
      
      if (isNaN(lat) || isNaN(lng)) {
        setError("Please provide both latitude and longitude or leave both empty.");
        return false;
      }
      if (lat < minLat || lat > maxLat || lng < minLng || lng > maxLng) {
        setError("Coordinates must be within Delhi NCR region (Lat: 28.2-28.9, Lng: 76.8-77.6)");
        return false;
      }
    }
    setError(null);
    return true;
  };

  const nextStep = () => {
    if (step === 1 && !validateStep1()) {
      setError("Please fill all required fields in Step 1.");
      return;
    }
    if (step === 2 && !validateStep2()) {
      return;
    }
    setError(null);
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If user presses Enter while not on the final step, just go to the next step
    if (step !== 3) {
      nextStep();
      return;
    }

    if (step === 3 && (!images || images.length === 0)) {
      setError("Please upload at least one image.");
      return;
    }
    
    setIsLoading(true);
    setError(null);

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
      const response = await axios.post('http://localhost:5001/api/lands/register', submitData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Registration Successful!</h2>
        <p className="text-slate-500 mb-8">Your plot has been successfully listed on PlotBuddy.</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-medium transition-colors"
        >
          Register Another Plot
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      {/* Stepper Header */}
      <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex justify-between relative">
        <div className="absolute top-1/2 left-8 right-8 h-1 bg-slate-200 -z-0 -translate-y-1/2 rounded-full hidden sm:block"></div>
        <div className={`absolute top-1/2 left-8 h-1 bg-primary -z-0 -translate-y-1/2 rounded-full hidden sm:block transition-all duration-500`} style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
        
        {[
          { num: 1, icon: Home, label: 'Basic Info' },
          { num: 2, icon: MapPin, label: 'Location' },
          { num: 3, icon: ImageIcon, label: 'Media' }
        ].map((s) => (
          <div key={s.num} className="flex flex-col items-center relative z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-4 transition-colors duration-300 ${step >= s.num ? 'bg-primary text-white border-primary-dark/20' : 'bg-white text-slate-400 border-slate-100'}`}>
              <s.icon className="w-4 h-4" />
            </div>
            <span className={`text-xs font-medium mt-2 hidden sm:block ${step >= s.num ? 'text-slate-800' : 'text-slate-400'}`}>{s.label}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-8">
        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl flex items-start text-sm border border-red-100">
            <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Step 1: Basic Info */}
        <div className={`space-y-6 transition-all duration-500 ${step === 1 ? 'block animate-in fade-in slide-in-from-right-4' : 'hidden'}`}>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Plot Title <span className="text-red-500">*</span></label>
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Spacious Open Plot in Dwarka" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" required />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Area (sq yards) <span className="text-red-500">*</span></label>
              <input type="number" name="area" value={formData.area} onChange={handleInputChange} placeholder="e.g. 500" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Monthly Rent (₹) <span className="text-red-500">*</span></label>
              <input type="number" name="monthlyRent" value={formData.monthlyRent} onChange={handleInputChange} placeholder="e.g. 15000" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" required />
            </div>
          </div>
        </div>

        {/* Step 2: Location */}
        <div className={`space-y-6 transition-all duration-500 ${step === 2 ? 'block animate-in fade-in slide-in-from-right-4' : 'hidden'}`}>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800 mb-6">
            Provide the manual address and optional map location.
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Manual Address <span className="text-red-500">*</span></label>
            <textarea name="address" value={formData.address} onChange={(e: any) => handleInputChange(e)} placeholder="Enter full address manually" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all h-24" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Google Maps Link (Optional)</label>
            <input type="url" name="googleMapsLink" value={formData.googleMapsLink} onChange={handleInputChange} placeholder="https://goo.gl/maps/..." className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
          </div>
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-sm font-bold text-slate-900 mb-4">Coordinates (Optional)</h4>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Latitude</label>
                <input type="number" step="any" name="lat" value={formData.lat} onChange={handleInputChange} placeholder="28.5355" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Longitude</label>
                <input type="number" step="any" name="lng" value={formData.lng} onChange={handleInputChange} placeholder="77.3910" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Amenities & Photos */}
        <div className={`space-y-8 transition-all duration-500 ${step === 3 ? 'block animate-in fade-in slide-in-from-right-4' : 'hidden'}`}>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-4">Select Amenities</label>
            <div className="grid grid-cols-3 gap-4">
              {['fencing', 'water', 'electricity'].map((amenity) => (
                <label key={amenity} className={`flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${formData[amenity as keyof typeof formData] ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input type="checkbox" name={amenity} checked={formData[amenity as keyof typeof formData] as boolean} onChange={handleInputChange} className="hidden" />
                  <span className="font-medium capitalize">{amenity}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Upload Photos</label>
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-primary hover:bg-slate-50 transition-all cursor-pointer relative">
              <input type="file" multiple accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <div className="flex flex-col items-center pointer-events-none">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-semibold text-slate-700 mb-1">Click or drag images here</h4>
                <p className="text-sm text-slate-500">JPG, PNG, WEBP up to 5MB each (Max 5)</p>
                {images && images.length > 0 && (
                  <div className="mt-4 inline-block bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
                    {images.length} file(s) selected
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-10 flex justify-between items-center border-t border-slate-100 pt-6">
          <button type="button" onClick={prevStep} className={`px-6 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}>
            Back
          </button>
          
          {step < 3 ? (
            <button type="button" onClick={nextStep} className="px-8 py-2.5 rounded-xl font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors">
              Continue to {step === 1 ? 'Location' : 'Media'}
            </button>
          ) : (
            <button type="submit" disabled={isLoading} className="px-8 py-2.5 rounded-xl font-medium bg-primary text-white hover:bg-primary-dark transition-colors flex items-center shadow-lg shadow-primary/30 disabled:opacity-70">
              {isLoading ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting...</>
              ) : (
                'Publish Listing'
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
