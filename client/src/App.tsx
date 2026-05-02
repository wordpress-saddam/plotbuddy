import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import PlotsList from './pages/PlotsList';
import PlotDetail from './pages/PlotDetail';
import RegisterPlot from './pages/RegisterPlot';
import EditPlot from './pages/EditPlot';
import MyPlots from './pages/MyPlots';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import Auth from './pages/Auth';
import { Map, MapPin, LogOut, Loader2, Heart, User, PlusCircle } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useState } from 'react';

function App() {
  const { user, login, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  return (
    <div className="min-h-screen bg-stone-50 font-sans selection:bg-primary/20 selection:text-primary-dark">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-primary/10 p-2.5 rounded-xl group-hover:bg-primary/20 transition-colors">
              <Map className="w-8 h-8 text-primary" />
            </div>
            <span className="text-2xl font-black text-stone-900 tracking-tight">
              Plot<span className="text-primary">Buddy</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/plots" className="text-sm font-bold text-stone-600 hover:text-primary transition-colors">
              Browse Plots
            </Link>
            <Link to="/register-plot" className="text-sm font-bold text-stone-600 hover:text-primary transition-colors">
              List Your Plot
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center text-sm font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
              <MapPin className="w-4 h-4 mr-1.5" /> Delhi NCR
            </div>
            
            {user ? (
              <div className="flex items-center space-x-3 border-l border-stone-200 pl-4 relative group">
                <Link to="/favorites" className="p-2 text-stone-500 hover:text-red-500 transition-colors relative" title="Favorites">
                  <Heart className={`w-5 h-5 transition-colors ${user.favorites?.length > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                  {user.favorites?.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                      {user.favorites.length}
                    </span>
                  )}
                </Link>
                
                {/* Profile Dropdown Container */}
                <div className="relative">
                  <button className="flex items-center space-x-2 p-1 rounded-full hover:bg-stone-100 transition-colors focus:outline-none cursor-pointer">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt={user.name} className="w-8 h-8 rounded-full border border-stone-200" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                        {user.name.charAt(0)}
                      </div>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50 overflow-hidden">
                    <div className="p-3 border-b border-stone-100">
                      <p className="font-bold text-stone-900 truncate">{user.name}</p>
                      <p className="text-xs text-stone-500 truncate">{user.email}</p>
                    </div>
                    <div className="py-2">
                      <Link to="/profile" className="flex items-center px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 hover:text-primary transition-colors">
                        <User className="w-4 h-4 mr-3 text-stone-400" /> Profile Settings
                      </Link>
                      <Link to="/favorites" className="flex items-center px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 hover:text-primary transition-colors">
                        <Heart className="w-4 h-4 mr-3 text-stone-400" /> Favorites
                      </Link>
                      <Link to="/my-plots" className="flex items-center px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 hover:text-primary transition-colors">
                        <Map className="w-4 h-4 mr-3 text-stone-400" /> Registered Plots
                      </Link>
                      <Link to="/register-plot" className="flex items-center px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 hover:text-primary transition-colors">
                        <PlusCircle className="w-4 h-4 mr-3 text-stone-400" /> Register New Plot
                      </Link>
                    </div>
                    <div className="py-2 border-t border-stone-100">
                      <button 
                        onClick={logout}
                        className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4 mr-3" /> Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center border-l border-stone-200 pl-4">
                <Link to="/login" className="bg-stone-900 hover:bg-black text-white px-5 py-2 rounded-xl font-bold text-sm transition-all shadow-sm">
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Routing */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plots" element={<PlotsList />} />
          <Route path="/plots/:id" element={<PlotDetail />} />
          <Route path="/register-plot" element={<RegisterPlot />} />
          <Route path="/edit-plot/:id" element={<EditPlot />} />
          <Route path="/my-plots" element={<MyPlots />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/login" element={<Auth />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12 text-center mt-auto border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Map className="w-6 h-6 text-stone-500" />
            <span className="text-xl font-bold text-stone-300">PlotBuddy</span>
          </div>
          <p className="text-sm">&copy; {new Date().getFullYear()} PlotBuddy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
