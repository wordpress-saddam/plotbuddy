import React, { useState, useEffect } from 'react';
import { MapPin, IndianRupee, Zap, Droplet, Move, LayoutGrid } from 'lucide-react';

interface PreviewCardProps {
  data: any;
  images: FileList | null;
}

export default function PreviewCard({ data, images }: PreviewCardProps) {
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  useEffect(() => {
    if (!images || images.length === 0) {
      setPreviewImages([]);
      return;
    }

    const objectUrls = Array.from(images).map(file => URL.createObjectURL(file));
    setPreviewImages(objectUrls);

    return () => {
      objectUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [images]);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden sticky top-8 transition-all duration-300 group">
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-medium z-10 border border-white/20">
        Live Preview
      </div>
      
      {/* Image Area */}
      <div className="h-64 bg-slate-100 relative overflow-hidden group-hover:shadow-inner transition-all">
        {previewImages.length > 0 ? (
          <img src={previewImages[0]} alt="Plot Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 border-b border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100">
            <LayoutGrid className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-sm font-medium">Image preview will appear here</p>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
          <h3 className="font-bold text-xl truncate drop-shadow-md">
            {data.title || 'Your Plot Title Here'}
          </h3>
          <div className="flex items-center text-sm mt-1 opacity-90 font-medium">
            <MapPin className="w-4 h-4 mr-1" />
            {data.lat && data.lng ? `Lat: ${data.lat}, Lng: ${data.lng}` : 'Delhi NCR Location'}
          </div>
        </div>
      </div>

      {/* Details Area */}
      <div className="p-6">
        <div className="flex justify-between items-end mb-6">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Monthly Rent</p>
            <div className="flex items-center text-2xl font-bold text-slate-800">
              <IndianRupee className="w-5 h-5 mr-0.5 text-slate-400" />
              {data.monthlyRent ? Number(data.monthlyRent).toLocaleString('en-IN') : '---'}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Total Area</p>
            <div className="flex items-center text-lg font-bold text-slate-700">
              <Move className="w-4 h-4 mr-1.5 text-slate-400" />
              {data.area ? `${data.area} sq yrds` : '---'}
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">Available Amenities</p>
          <div className="flex flex-wrap gap-2">
            {data.fencing && (
              <span className="inline-flex items-center bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div> Fencing
              </span>
            )}
            {data.water && (
              <span className="inline-flex items-center bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 shadow-sm">
                <Droplet className="w-3.5 h-3.5 mr-1.5 text-blue-500" /> Water
              </span>
            )}
            {data.electricity && (
              <span className="inline-flex items-center bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 shadow-sm">
                <Zap className="w-3.5 h-3.5 mr-1.5 text-yellow-500" /> Electricity
              </span>
            )}
            {!data.fencing && !data.water && !data.electricity && (
              <span className="text-sm text-slate-400 italic">No amenities selected</span>
            )}
          </div>
        </div>
        
        <button className="w-full mt-6 bg-slate-900 text-white font-medium py-3 rounded-xl opacity-50 cursor-not-allowed">
          Contact Owner
        </button>
      </div>
    </div>
  );
}
