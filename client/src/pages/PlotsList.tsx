import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MapPin, IndianRupee, Move, Loader2, Filter, Search } from 'lucide-react';

export default function PlotsList() {
  const [plots, setPlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [minArea, setMinArea] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [fencing, setFencing] = useState(false);
  const [water, setWater] = useState(false);
  const [electricity, setElectricity] = useState(false);

  const fetchPlots = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (minArea) params.append('minArea', minArea);
      if (maxRent) params.append('maxRent', maxRent);
      if (fencing) params.append('fencing', 'true');
      if (water) params.append('water', 'true');
      if (electricity) params.append('electricity', 'true');
      
      const response = await axios.get(`http://localhost:5001/api/lands?${params.toString()}`);
      if (response.data.success) {
        setPlots(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch plots:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlots();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPlots();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 shrink-0 bg-white p-6 rounded-2xl shadow-sm border border-stone-200 sticky top-28">
          <div className="flex items-center mb-6 text-stone-900 font-bold text-lg">
            <Filter className="w-5 h-5 mr-2 text-primary" /> Filters
          </div>
          
          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Max Monthly Rent (₹)</label>
              <input type="number" value={maxRent} onChange={(e) => setMaxRent(e.target.value)} placeholder="e.g. 50000" className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Min Area (sq yards)</label>
              <input type="number" value={minArea} onChange={(e) => setMinArea(e.target.value)} placeholder="e.g. 100" className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-3">Amenities</label>
              <div className="space-y-3">
                <label className="flex items-center text-sm text-stone-700 cursor-pointer">
                  <input type="checkbox" checked={fencing} onChange={(e) => setFencing(e.target.checked)} className="rounded text-primary focus:ring-primary mr-2" /> Fencing
                </label>
                <label className="flex items-center text-sm text-stone-700 cursor-pointer">
                  <input type="checkbox" checked={water} onChange={(e) => setWater(e.target.checked)} className="rounded text-primary focus:ring-primary mr-2" /> Water Supply
                </label>
                <label className="flex items-center text-sm text-stone-700 cursor-pointer">
                  <input type="checkbox" checked={electricity} onChange={(e) => setElectricity(e.target.checked)} className="rounded text-primary focus:ring-primary mr-2" /> Electricity
                </label>
              </div>
            </div>
            
            <button type="submit" className="w-full bg-primary text-white font-medium py-2.5 rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center">
              <Search className="w-4 h-4 mr-2" /> Apply Filters
            </button>
          </form>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 w-full">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-stone-900">Available Plots</h1>
            <span className="text-sm font-medium text-stone-500 bg-stone-100 px-3 py-1 rounded-full">{plots.length} results</span>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          ) : plots.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {plots.map(plot => (
                <Link to={`/plots/${plot._id}`} key={plot._id} className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition-all flex flex-col sm:flex-row group">
                  <div className="h-48 sm:h-auto sm:w-48 shrink-0 bg-stone-100 relative overflow-hidden">
                    {plot.images && plot.images.length > 0 ? (
                      <img src={plot.images[0]} alt={plot.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-stone-400 bg-stone-100">
                        <span>No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-stone-900 line-clamp-1">{plot.title}</h3>
                    </div>
                    <div className="flex items-center text-sm text-stone-500 mb-4">
                      <MapPin className="w-3.5 h-3.5 mr-1" />
                      Lat: {plot.location?.coordinates[1]?.toFixed(3) || 'N/A'}, Lng: {plot.location?.coordinates[0]?.toFixed(3) || 'N/A'}
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-stone-100 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Rent</p>
                        <p className="font-bold text-stone-900 text-lg">₹{plot.monthlyRent}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Area</p>
                        <p className="font-semibold text-stone-700 flex items-center mt-1 text-sm">
                          <Move className="w-3.5 h-3.5 mr-1 text-stone-400" /> {plot.area} sq yds
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-stone-200">
              <p className="text-stone-500 font-medium">No plots found matching your criteria.</p>
              <button onClick={() => { setMinArea(''); setMaxRent(''); setFencing(false); setWater(false); setElectricity(false); setTimeout(fetchPlots, 0); }} className="mt-4 text-primary font-medium hover:underline">
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
