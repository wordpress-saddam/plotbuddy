import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Map, 
  LogOut, 
  Home, 
  Settings,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Plot Management', path: '/admin/plots', icon: Map },
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-stone-900 text-stone-400 fixed h-full z-50 hidden lg:flex flex-col">
        <div className="p-6 border-b border-stone-800 flex items-center space-x-3">
          <div className="bg-primary p-2 rounded-xl">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black text-white tracking-tight">
            Admin<span className="text-primary">Buddy</span>
          </span>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                location.pathname === item.path 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'hover:bg-stone-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
              {location.pathname === item.path && <ChevronRight className="ml-auto w-4 h-4" />}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-stone-800">
          <Link 
            to="/" 
            className="flex items-center px-4 py-3 rounded-xl text-sm font-bold hover:bg-stone-800 hover:text-white transition-all mb-2"
          >
            <Home className="w-5 h-5 mr-3" /> Back to Website
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-950/30 transition-all"
          >
            <LogOut className="w-5 h-5 mr-3" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-stone-200 sticky top-0 z-40 px-8 flex items-center justify-between">
          <h2 className="font-black text-stone-900 text-xl tracking-tight">
            {navItems.find(i => i.path === location.pathname)?.name || 'Admin Panel'}
          </h2>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-stone-900">{user?.name}</p>
              <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest">{user?.role}</p>
            </div>
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt="" className="w-10 h-10 rounded-full border border-stone-200" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                {user?.name?.charAt(0)}
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
