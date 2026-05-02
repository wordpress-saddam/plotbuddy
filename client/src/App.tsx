import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import PlotsList from './pages/PlotsList';
import PlotDetail from './pages/PlotDetail';
import RegisterPlot from './pages/RegisterPlot';
import { Map, MapPin, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useState } from 'react';

function App() {
  const { user, login, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5001/api/auth/google', {
        token: credentialResponse.credential
      });

      if (response.data.success) {
        login(response.data.user, response.data.token);
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      alert('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
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
              <div className="flex items-center space-x-3 border-l border-stone-200 pl-4">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt={user.name} className="w-8 h-8 rounded-full border border-stone-200" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                    {user.name.charAt(0)}
                  </div>
                )}
                <button 
                  onClick={logout}
                  className="text-stone-500 hover:text-red-500 transition-colors p-1"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center border-l border-stone-200 pl-4">
                {loading ? (
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                ) : (
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => console.error('Login failed')}
                    type="standard"
                    theme="outline"
                    size="medium"
                    text="signin_with"
                    shape="pill"
                  />
                )}
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
