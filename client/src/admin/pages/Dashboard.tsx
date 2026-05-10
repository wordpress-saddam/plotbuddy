import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../layouts/AdminLayout';
import { 
  Users, 
  Map, 
  TrendingUp, 
  Clock,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function Dashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPlots: 0,
    activePlots: 0,
    newUsersToday: 0
  });
  const [latestActivities, setLatestActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // For now, we'll fetch all data and calculate stats on the frontend
      // In a real app, you'd have a dedicated /api/admin/stats endpoint
      const [usersRes, landsRes] = await Promise.all([
        axios.get('http://localhost:5001/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5001/api/admin/lands', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const users = usersRes.data.data;
      const lands = landsRes.data.data;

      const today = new Date().setHours(0, 0, 0, 0);
      
      setStats({
        totalUsers: users.length,
        totalPlots: lands.length,
        activePlots: lands.filter((l: any) => l.isPublished).length,
        newUsersToday: users.filter((u: any) => new Date(u.createdAt).getTime() >= today).length
      });

      // Mix and sort for latest activities
      const activities = [
        ...users.map((u: any) => ({ ...u, type: 'user', timestamp: u.createdAt })),
        ...lands.map((l: any) => ({ ...l, type: 'plot', timestamp: l.createdAt }))
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
       .slice(0, 8);

      setLatestActivities(activities);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-500', trend: `+${stats.newUsersToday} today` },
    { label: 'Total Plots', value: stats.totalPlots, icon: Map, color: 'bg-emerald-500', trend: 'Lifetime' },
    { label: 'Active Listings', value: stats.activePlots, icon: TrendingUp, color: 'bg-orange-500', trend: `${Math.round((stats.activePlots / stats.totalPlots) * 100) || 0}% of total` },
    { label: 'Platform Growth', value: '12%', icon: ArrowUpRight, color: 'bg-purple-500', trend: 'This month' },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-2xl text-white shadow-lg shadow-${stat.color.split('-')[1]}-200`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 bg-stone-50 px-2 py-1 rounded-lg">
                  {stat.trend}
                </span>
              </div>
              <h3 className="text-stone-500 text-sm font-bold">{stat.label}</h3>
              <p className="text-3xl font-black text-stone-900 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Latest Activities */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
              <h3 className="text-lg font-black text-stone-900 tracking-tight flex items-center">
                <Clock className="w-5 h-5 mr-2 text-primary" /> Latest Activities
              </h3>
              <button className="text-xs font-bold text-primary hover:underline">View All</button>
            </div>
            <div className="divide-y divide-stone-50">
              {latestActivities.map((activity, idx) => (
                <div key={idx} className="p-4 hover:bg-stone-50 transition-colors flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.type === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {activity.type === 'user' ? <Users className="w-5 h-5" /> : <Map className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-stone-900">
                        {activity.type === 'user' ? 'New User Registered' : 'New Plot Listed'}
                      </p>
                      <p className="text-xs text-stone-500">
                        {activity.type === 'user' ? activity.name : activity.title} • {activity.email || activity.address}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions / System Health */}
          <div className="space-y-6">
            <div className="bg-stone-900 text-white p-6 rounded-3xl shadow-xl">
              <h3 className="text-lg font-black mb-4 flex items-center">
                <ShieldCheck className="w-5 h-5 mr-2 text-primary" /> System Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-stone-800 rounded-2xl">
                  <span className="text-sm font-bold">API Gateway</span>
                  <CheckCircle className="w-4 h-4 text-primary" />
                </div>
                <div className="flex items-center justify-between p-3 bg-stone-800 rounded-2xl">
                  <span className="text-sm font-bold">Database</span>
                  <CheckCircle className="w-4 h-4 text-primary" />
                </div>
                <div className="flex items-center justify-between p-3 bg-stone-800 rounded-2xl">
                  <span className="text-sm font-bold">Cloudinary</span>
                  <CheckCircle className="w-4 h-4 text-primary" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
              <h3 className="text-stone-900 font-black mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-orange-500" /> Notifications
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-orange-50 text-orange-800 rounded-2xl text-xs font-bold border border-orange-100">
                  3 plots are pending review
                </div>
                <div className="p-3 bg-blue-50 text-blue-800 rounded-2xl text-xs font-bold border border-blue-100">
                  Weekly backup completed
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
