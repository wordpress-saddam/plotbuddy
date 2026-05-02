import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { MapPin, IndianRupee, Move, Loader2, CheckCircle2, Circle, Edit2, Trash2 } from 'lucide-react';

export default function MyPlots() {
  const [plots, setPlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !token) {
      setLoading(false);
      return;
    }

    const fetchMyPlots = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/lands/my-plots', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setPlots(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch my plots:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMyPlots();
  }, [token, isAuthenticated]);

  const handleToggleBooked = async (plotId: string) => {
    setTogglingId(plotId);
    try {
      const response = await axios.put(`http://localhost:5001/api/lands/${plotId}/toggle-booked`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setPlots(plots.map(plot => 
          plot._id === plotId ? { ...plot, isBooked: response.data.data.isBooked } : plot
        ));
      }
    } catch (error) {
      console.error('Failed to toggle booked status:', error);
      alert('Failed to update plot status. Please try again.');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (plotId: string) => {
    if (!window.confirm('Are you sure you want to delete this plot? This action cannot be undone.')) {
      return;
    }
    try {
      const response = await axios.delete(`http://localhost:5001/api/lands/${plotId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setPlots(plots.filter(plot => plot._id !== plotId));
      }
    } catch (error) {
      console.error('Failed to delete plot:', error);
      alert('Failed to delete plot.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
          <h2 className="text-2xl font-bold text-stone-800 mb-4">Sign In Required</h2>
          <p className="text-stone-500">Please sign in to view your plots.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[calc(100vh-80px)]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-stone-900 mb-2">My Plots</h1>
          <p className="text-stone-500">Manage your listings and mark them as booked once rented.</p>
        </div>
        <Link 
          to="/register-plot" 
          className="mt-4 md:mt-0 bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md"
        >
          Add New Plot
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : plots.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plots.map(plot => (
            <div key={plot._id} className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all relative ${plot.isBooked ? 'border-stone-300 bg-stone-50 opacity-80' : 'border-stone-200 hover:shadow-md'}`}>
              
              {/* Image Header */}
              <div className="h-48 bg-stone-100 relative overflow-hidden">
                {plot.images && plot.images.length > 0 ? (
                  <img src={plot.images[0]} alt={plot.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-stone-400">
                    <span>No Image</span>
                  </div>
                )}
                
                {plot.isBooked && (
                  <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white/90 text-stone-800 px-4 py-2 rounded-lg font-bold shadow-lg flex items-center">
                      <CheckCircle2 className="w-5 h-5 mr-2 text-emerald-600" />
                      Currently Booked
                    </div>
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-lg text-stone-900 truncate mb-1">{plot.title}</h3>
                <div className="flex items-center text-sm text-stone-500 mb-4">
                  <MapPin className="w-3.5 h-3.5 mr-1" />
                  Lat: {plot.location?.coordinates[1]?.toFixed(2) || 'N/A'}, Lng: {plot.location?.coordinates[0]?.toFixed(2) || 'N/A'}
                </div>
                <div className="flex items-center justify-between border-y border-stone-100 py-3 mb-4">
                  <div className="flex items-center text-sm font-medium text-stone-700">
                    <Move className="w-4 h-4 mr-1.5 text-stone-400" />
                    {plot.area} sq yards
                  </div>
                  <div className="flex items-center text-sm font-bold text-stone-800">
                    <IndianRupee className="w-3 h-3 inline mr-0.5" />{plot.monthlyRent}/mo
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => handleToggleBooked(plot._id)}
                    disabled={togglingId === plot._id}
                    className={`w-full py-2.5 rounded-xl font-bold flex items-center justify-center transition-colors ${
                      plot.isBooked 
                        ? 'bg-stone-200 hover:bg-stone-300 text-stone-700' 
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {togglingId === plot._id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : plot.isBooked ? (
                      <>
                        <Circle className="w-4 h-4 mr-2" /> Mark as Available
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Mark as Booked
                      </>
                    )}
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <Link 
                      to={`/edit-plot/${plot._id}`} 
                      className="py-2 rounded-xl text-center text-sm font-semibold border border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-primary transition-colors flex items-center justify-center"
                    >
                      <Edit2 className="w-4 h-4 mr-1.5" /> Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(plot._id)}
                      className="py-2 rounded-xl text-center text-sm font-semibold border border-red-100 text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4 mr-1.5" /> Delete
                    </button>
                  </div>
                  
                  <Link 
                    to={`/plots/${plot._id}`} 
                    className="w-full py-1.5 mt-1 rounded-xl text-center text-sm font-semibold text-stone-500 hover:text-primary transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-stone-300">
          <MapPin className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-stone-800 mb-2">No plots listed yet</h3>
          <p className="text-stone-500 mb-6 max-w-md mx-auto">
            You haven't added any plots to your account yet. List your first idle space and start finding tenants.
          </p>
          <Link 
            to="/register-plot" 
            className="inline-flex bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold transition-all shadow-sm"
          >
            Register Your First Plot
          </Link>
        </div>
      )}
    </div>
  );
}
