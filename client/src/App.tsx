import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import PlotsList from './pages/PlotsList';
import PlotDetail from './pages/PlotDetail';
import { Map, MapPin } from 'lucide-react';

function App() {
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
            <Link to="/" className="text-sm font-bold text-stone-600 hover:text-primary transition-colors">
              List Your Plot
            </Link>
          </nav>

          <div className="flex items-center">
            <div className="hidden sm:flex items-center text-sm font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
              <MapPin className="w-4 h-4 mr-1.5" /> Delhi NCR
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Routing */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plots" element={<PlotsList />} />
          <Route path="/plots/:id" element={<PlotDetail />} />
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
