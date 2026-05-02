import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import RegistrationForm from '../components/RegistrationForm';
import PreviewCard from '../components/PreviewCard';
import { useAuth } from '../context/AuthContext';
import { MapPin, IndianRupee, Move, ArrowRight, Loader2 } from 'lucide-react';

export default function Home() {
  const [formData, setFormData] = useState({});
  const [images, setImages] = useState<FileList | null>(null);
  
  const [recentPlots, setRecentPlots] = useState<any[]>([]);
  const [loadingPlots, setLoadingPlots] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchRecentPlots = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/lands?limit=3');
        if (response.data.success) {
          setRecentPlots(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch recent plots:', error);
      } finally {
        setLoadingPlots(false);
      }
    };
    
    fetchRecentPlots();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-stone-900 to-stone-800 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Monetize Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300">Vacant Land</span> Today
          </h1>
          <p className="text-lg md:text-xl text-stone-300 max-w-2xl mx-auto font-medium leading-relaxed">
            Register your idle plot in Delhi NCR for temporary commercial use. Setup is 100% free and takes less than 2 minutes.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-20 relative z-20 border-b border-stone-200 flex justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-stone-200 w-full max-w-3xl text-center flex flex-col items-center">
          <h2 className="text-2xl font-bold text-stone-800 mb-6">Ready to get started?</h2>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link 
              to="/plots" 
              className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-primary/30 flex justify-center items-center group"
            >
              Browse Available Plots
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/register-plot" 
              className="bg-stone-100 hover:bg-stone-200 text-stone-900 border border-stone-200 px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-sm flex justify-center items-center"
            >
              List Your Plot
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Plots Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-stone-900">Recently Added Plots</h2>
            <p className="text-stone-500 mt-2">Discover the latest commercial spaces available in Delhi NCR.</p>
          </div>
          <Link to="/plots" className="hidden sm:flex items-center text-primary font-semibold hover:text-primary-dark transition-colors">
            View All Plots <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>

        {loadingPlots ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : recentPlots.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPlots.map(plot => (
              <div key={plot._id} className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition-all group">
                <div className="h-48 bg-stone-100 relative overflow-hidden">
                  {plot.images && plot.images.length > 0 ? (
                    <img src={plot.images[0]} alt={plot.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-stone-400 bg-stone-100">
                      <span>No Image</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-stone-800 text-xs px-2.5 py-1 rounded-md font-bold shadow-sm">
                    <IndianRupee className="w-3 h-3 inline mr-0.5" />{plot.monthlyRent}/mo
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-stone-900 truncate mb-1">{plot.title}</h3>
                  <div className="flex items-center text-sm text-stone-500 mb-4">
                    <MapPin className="w-3.5 h-3.5 mr-1" />
                    Lat: {plot.location?.coordinates[1]?.toFixed(2) || 'N/A'}, Lng: {plot.location?.coordinates[0]?.toFixed(2) || 'N/A'}
                  </div>
                  <div className="flex items-center justify-between border-t border-stone-100 pt-4">
                    <div className="flex items-center text-sm font-medium text-stone-700">
                      <Move className="w-4 h-4 mr-1.5 text-stone-400" />
                      {plot.area} sq yards
                    </div>
                    <Link to={`/plots/${plot._id}`} className="text-sm font-semibold text-primary hover:text-primary-dark">
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-stone-50 rounded-2xl border border-dashed border-stone-300">
            <p className="text-stone-500 font-medium">No plots have been listed yet. Be the first!</p>
          </div>
        )}
        
        <div className="mt-8 text-center sm:hidden">
          <Link to="/plots" className="inline-flex items-center justify-center w-full bg-stone-100 text-stone-800 font-semibold py-3 rounded-xl hover:bg-stone-200 transition-colors">
            View All Plots
          </Link>
        </div>
      </section>
    </>
  );
}
