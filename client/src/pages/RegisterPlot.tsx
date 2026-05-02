import React, { useState } from 'react';
import RegistrationForm from '../components/RegistrationForm';
import PreviewCard from '../components/PreviewCard';
import { useAuth } from '../context/AuthContext';
import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import Login from '../components/Login';

export default function RegisterPlot() {
  const { isAuthenticated } = useAuth();
  
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
  const [images, setImages] = useState<FileList | null>(null);

  return (
    <div className="bg-stone-50 min-h-[calc(100vh-80px)] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-stone-900 tracking-tight mb-4">
            List Your Plot on PlotBuddy
          </h1>
          <p className="text-lg text-stone-500 max-w-2xl mx-auto">
            Connect with verified tenants looking for idle land, garages, and godowns across Delhi NCR. Registration is completely free.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 xl:col-span-8">
            {isAuthenticated ? (
              <RegistrationForm 
                onFormDataChange={setFormData} 
                onImageChange={setImages} 
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <Login />
              </div>
            )}
          </div>
          
          <div className="lg:col-span-5 xl:col-span-4 hidden lg:block sticky top-28">
            {isAuthenticated && (
              <>
                <h3 className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-4">
                  Live Preview
                </h3>
                <PreviewCard data={formData} images={images} />
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
