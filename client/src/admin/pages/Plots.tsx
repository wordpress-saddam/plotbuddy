import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../layouts/AdminLayout';
import { Link } from 'react-router-dom';
import { 
  Map as MapIcon, 
  Plus, 
  Edit2, 
  Trash2, 
  ShieldAlert, 
  CheckCircle, 
  Search,
  Loader2
} from 'lucide-react';

export default function Plots() {
  const { token } = useAuth();
  const [lands, setLands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLands = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5001/api/admin/lands', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLands(res.data.data);
    } catch (err) {
      console.error('Failed to fetch lands:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLands();
  }, []);

  const handleTogglePlotPublish = async (id: string) => {
    try {
      await axios.put(`http://localhost:5001/api/admin/lands/${id}/toggle-publish`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchLands();
    } catch (err) {
      console.error('Failed to toggle publish:', err);
    }
  };

  const handleDeletePlot = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this plot?')) {
      try {
        await axios.delete(`http://localhost:5001/api/lands/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchLands();
      } catch (err) {
        console.error('Failed to delete plot:', err);
      }
    }
  };

  const filteredLands = lands.filter(l => 
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-stone-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-stone-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input 
              type="text" 
              placeholder="Search plots by title or address..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-stone-200 focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-stone-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Link 
            to="/register-plot"
            className="flex items-center bg-stone-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-black transition-all shadow-lg shadow-stone-900/10"
          >
            <Plus className="w-4 h-4 mr-2" /> Register Plot
          </Link>
        </div>

        {/* Content Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-100">
                  <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-widest">Plot</th>
                  <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-widest">Owner</th>
                  <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-widest">Pricing</th>
                  <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-widest">Visibility</th>
                  <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {filteredLands.map(l => (
                  <tr key={l._id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-xl bg-stone-100 border border-stone-200 overflow-hidden mr-3">
                          {l.images?.[0] ? (
                            <img src={l.images[0]} className="w-full h-full object-cover" alt="" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center"><MapIcon className="w-5 h-5 text-stone-300" /></div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-stone-900 line-clamp-1">{l.title}</p>
                          <p className="text-xs text-stone-500 line-clamp-1">{l.address}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <p className="text-sm font-bold text-stone-700">{l.owner?.name || 'Unknown'}</p>
                        <p className="text-[10px] text-stone-400 font-medium">{l.owner?.email || '-'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-stone-900">₹{l.monthlyRent}</p>
                      <p className="text-[10px] text-stone-500 font-medium">{l.area} sq yds</p>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleTogglePlotPublish(l._id)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold transition-colors ${l.isPublished ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'}`}
                      >
                        {l.isPublished ? <CheckCircle className="w-3 h-3 mr-1" /> : <ShieldAlert className="w-3 h-3 mr-1" />}
                        {l.isPublished ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link 
                          to={`/edit-plot/${l._id}`}
                          className="p-2 text-stone-400 hover:text-primary hover:bg-stone-100 rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDeletePlot(l._id)}
                          className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Empty State */}
        {!loading && filteredLands.length === 0 && (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-stone-200 mx-auto mb-4" />
            <p className="text-stone-500 font-medium">No plots found for your search.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
