import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { MapPin, IndianRupee, Move, Loader2, Heart } from 'lucide-react';
import FavoriteButton from '../components/FavoriteButton';

export default function Favorites() {
  const { token, isAuthenticated } = useAuth();
  const [favoritePlots, setFavoritePlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setFavoritePlots(response.data.data.favorites);
        }
      } catch (error) {
        console.error('Failed to fetch favorites:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFavorites();
  }, [token, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
          <h2 className="text-2xl font-bold text-stone-800 mb-4">Sign In Required</h2>
          <p className="text-stone-500">Please sign in to view your favorite plots.</p>
        </div>
      </div>
    );
  }

  // Filter out any favorites that might have been deleted but are still in the array
  const validFavorites = favoritePlots.filter(plot => plot && plot._id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[calc(100vh-80px)]">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-stone-900 mb-2 flex items-center">
          <Heart className="w-8 h-8 mr-3 text-red-500 fill-red-500" /> My Favorites
        </h1>
        <p className="text-stone-500">Keep track of the plots you're interested in.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : validFavorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {validFavorites.map(plot => (
            <div key={plot._id} className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition-all group relative">
              
              {/* Image Header */}
              <div className="h-48 bg-stone-100 relative overflow-hidden">
                {plot.images && plot.images.length > 0 ? (
                  <img src={plot.images[0]} alt={plot.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-stone-400 bg-stone-100">
                    <span>No Image</span>
                  </div>
                )}
                
                {/* Favorite Button Overlay */}
                <div className="absolute top-4 right-4 z-10">
                  <FavoriteButton plotId={plot._id} />
                </div>
                
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur text-stone-800 text-xs px-2.5 py-1 rounded-md font-bold shadow-sm">
                  <IndianRupee className="w-3 h-3 inline mr-0.5" />{plot.monthlyRent}/mo
                </div>
              </div>
              
              {/* Content */}
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
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-stone-300">
          <Heart className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-stone-800 mb-2">No favorites yet</h3>
          <p className="text-stone-500 mb-6 max-w-md mx-auto">
            Browse through available plots and click the heart icon to save them here for later.
          </p>
          <Link 
            to="/plots" 
            className="inline-flex bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold transition-all shadow-sm"
          >
            Browse Plots
          </Link>
        </div>
      )}
    </div>
  );
}
