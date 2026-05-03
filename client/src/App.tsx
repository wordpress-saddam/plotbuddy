import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import PlotsList from './pages/PlotsList';
import PlotDetail from './pages/PlotDetail';
import RegisterPlot from './pages/RegisterPlot';
import EditPlot from './pages/EditPlot';
import MyPlots from './pages/MyPlots';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import AdminDashboard from './admin/pages/Dashboard';
import AdminUsers from './admin/pages/Users';
import AdminPlots from './admin/pages/Plots';
import Auth from './pages/Auth';
import Header from './components/Header';
import Footer from './components/Footer';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  
  return (
    <div className="min-h-screen bg-stone-50 font-sans selection:bg-primary/20 selection:text-primary-dark flex flex-col">
      {!isAdminPath && <Header />}

      {/* Main Content Routing */}
      <main className="flex-grow">
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
          {user?.role === 'administrator' && (
            <>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/plots" element={<AdminPlots />} />
            </>
          )}
        </Routes>
      </main>

      {!isAdminPath && <Footer />}
    </div>
  );
}

export default App;
