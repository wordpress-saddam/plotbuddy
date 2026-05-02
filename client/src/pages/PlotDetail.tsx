import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { MapPin, IndianRupee, Move, Loader2, ArrowLeft, Check, LayoutGrid, Zap, Droplet, CheckCircle2 } from 'lucide-react';
import FavoriteButton from '../components/FavoriteButton';

export default function PlotDetail() {
  const { id } = useParams<{ id: string }>();
  const [plot, setPlot] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchPlot = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/lands/${id}`);
        if (response.data.success) {
          setPlot(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch plot details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlot();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!plot) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-stone-800 mb-2">Plot Not Found</h2>
        <p className="text-stone-500 mb-6">The plot you are looking for does not exist or has been removed.</p>
        <Link to="/plots" className="text-primary hover:underline font-medium">Return to All Plots</Link>
      </div>
    );
  }

  const hasImages = plot.images && plot.images.length > 0;

  return (
    <div className="bg-stone-50 min-h-[calc(100vh-80px)]">
      {/* Top Banner / Breadcrumb */}
      <div className="bg-white border-b border-stone-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/plots" className="inline-flex items-center text-sm font-medium text-stone-500 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Search
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column: Images & Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Image Gallery */}
            <div className="bg-white p-2 rounded-3xl shadow-sm border border-stone-200">
              <div className="h-96 bg-stone-100 rounded-2xl overflow-hidden relative mb-2">
                {hasImages ? (
                  <img src={plot.images[activeImage]} alt={plot.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400">
                    <LayoutGrid className="w-12 h-12 mb-3 opacity-50" />
                    <p className="text-sm font-medium">No images available for this plot</p>
                  </div>
                )}
              </div>
              
              {hasImages && plot.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {plot.images.map((img: string, idx: number) => (
                    <button 
                      key={idx} 
                      onClick={() => setActiveImage(idx)}
                      className={`h-20 w-24 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-primary ring-2 ring-primary/20' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description / Main Info */}
            <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-8">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h1 className="text-3xl font-extrabold text-stone-900">{plot.title}</h1>
                    <FavoriteButton plotId={plot._id} size={28} className="shadow-sm border border-stone-100" />
                  </div>
                  <div className="flex items-center text-stone-500 font-medium">
                    <MapPin className="w-5 h-5 mr-1.5 text-primary" />
                    Coordinates: {plot.location?.coordinates[1]}, {plot.location?.coordinates[0]}
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0 self-start">
                  <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl flex items-center font-bold">
                    <CheckCircle2 className="w-5 h-5 mr-2" /> Verified Plot
                  </div>
                  {plot.isBooked && (
                    <div className="bg-stone-100 text-stone-700 px-4 py-2 rounded-xl flex items-center font-bold border border-stone-300">
                      <CheckCircle2 className="w-5 h-5 mr-2 text-stone-500" /> Currently Booked
                    </div>
                  )}
                </div>
              </div>

              <hr className="border-stone-100 my-8" />

              <h3 className="text-xl font-bold text-stone-900 mb-6">Property Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 text-center">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-3">
                    <Move className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-stone-500 uppercase font-bold tracking-wider mb-1">Total Area</p>
                  <p className="font-bold text-stone-900 text-lg">{plot.area} sq yds</p>
                </div>
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 text-center">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <IndianRupee className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-stone-500 uppercase font-bold tracking-wider mb-1">Monthly Rent</p>
                  <p className="font-bold text-stone-900 text-lg">₹{plot.monthlyRent}</p>
                </div>
              </div>

              <h3 className="text-xl font-bold text-stone-900 mb-4">Available Amenities</h3>
              <div className="flex flex-wrap gap-3">
                {plot.amenities?.fencing && (
                  <div className="flex items-center bg-stone-50 border border-stone-200 px-4 py-2.5 rounded-xl text-stone-800 font-medium">
                    <Check className="w-5 h-5 mr-2 text-green-500" /> Fencing Included
                  </div>
                )}
                {plot.amenities?.water && (
                  <div className="flex items-center bg-stone-50 border border-stone-200 px-4 py-2.5 rounded-xl text-stone-800 font-medium">
                    <Droplet className="w-5 h-5 mr-2 text-blue-500" /> Water Supply
                  </div>
                )}
                {plot.amenities?.electricity && (
                  <div className="flex items-center bg-stone-50 border border-stone-200 px-4 py-2.5 rounded-xl text-stone-800 font-medium">
                    <Zap className="w-5 h-5 mr-2 text-yellow-500" /> Electricity Connection
                  </div>
                )}
                {!plot.amenities?.fencing && !plot.amenities?.water && !plot.amenities?.electricity && (
                  <p className="text-stone-500 italic">No special amenities listed for this plot.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Action Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-lg border border-stone-200 p-8 sticky top-28">
              <p className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-2">Lease Price</p>
              <div className="flex items-end mb-6">
                <span className="text-4xl font-extrabold text-stone-900 flex items-center">
                  <IndianRupee className="w-8 h-8 text-stone-400 mr-1" />
                  {plot.monthlyRent.toLocaleString('en-IN')}
                </span>
                <span className="text-stone-500 font-medium ml-2 mb-1">/ month</span>
              </div>

              <ul className="space-y-4 mb-8 border-t border-stone-100 pt-6">
                <li className="flex justify-between items-center text-sm">
                  <span className="text-stone-500">Security Deposit</span>
                  <span className="font-bold text-stone-900">₹{(plot.monthlyRent * 2).toLocaleString('en-IN')}</span>
                </li>
                <li className="flex justify-between items-center text-sm">
                  <span className="text-stone-500">Platform Fee</span>
                  <span className="font-bold text-green-600">Free</span>
                </li>
              </ul>

              <button 
                disabled={plot.isBooked}
                className={`w-full font-bold py-4 rounded-2xl transition-colors shadow-lg flex items-center justify-center ${
                  plot.isBooked 
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none' 
                    : 'bg-primary hover:bg-primary-dark text-white shadow-primary/30'
                }`}
              >
                {plot.isBooked ? 'Plot is Booked' : 'Contact Owner Now'}
              </button>
              
              <p className="text-xs text-center text-stone-400 mt-4">
                By contacting, you agree to PlotBuddy's Terms & Conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
