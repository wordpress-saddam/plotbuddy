import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../layouts/AdminLayout';
import { 
  Users as UsersIcon, 
  Edit2, 
  Trash2, 
  ShieldCheck, 
  CheckCircle, 
  XCircle,
  Search,
  Loader2,
  UserPlus
} from 'lucide-react';

export default function Users() {
  const { token, user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5001/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleUserStatus = async (id: string) => {
    try {
      await axios.put(`http://localhost:5001/api/admin/users/${id}/toggle-status`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5001/api/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchUsers();
      } catch (err) {
        console.error('Failed to delete user:', err);
      }
    }
  };

  const handleOpenUserModal = (user: any = null) => {
    if (user) {
      setEditingUser(user);
      setUserFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role
      });
    } else {
      setEditingUser(null);
      setUserFormData({
        name: '',
        email: '',
        password: '',
        role: 'user'
      });
    }
    setIsUserModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await axios.put(`http://localhost:5001/api/admin/users/${editingUser._id}`, userFormData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:5001/api/admin/users', userFormData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setIsUserModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error('Failed to save user:', err);
      alert('Error saving user');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="relative">
        {/* User Modal */}
        {isUserModalOpen && (
          <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-6 border-b border-stone-100 bg-stone-50/50">
                <h2 className="text-xl font-black text-stone-900 tracking-tight">
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h2>
              </div>
              <form onSubmit={handleSaveUser} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium"
                    value={userFormData.name}
                    onChange={e => setUserFormData({...userFormData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium"
                    value={userFormData.email}
                    onChange={e => setUserFormData({...userFormData, email: e.target.value})}
                  />
                </div>
                {!editingUser && (
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5 ml-1">Password</label>
                    <input 
                      type="password" 
                      required
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium"
                      value={userFormData.password}
                      onChange={e => setUserFormData({...userFormData, password: e.target.value})}
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5 ml-1">Role</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium"
                    value={userFormData.role}
                    onChange={e => setUserFormData({...userFormData, role: e.target.value})}
                  >
                    <option value="user">User</option>
                    <option value="administrator">Administrator</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsUserModalOpen(false)}
                    className="flex-1 px-6 py-3 rounded-xl font-bold text-stone-500 hover:bg-stone-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-stone-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-all"
                  >
                    Save User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
          {/* Toolbar */}
          <div className="p-6 border-b border-stone-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-stone-50/50">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input 
                type="text" 
                placeholder="Search users by name or email..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-stone-200 focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-stone-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <button 
              onClick={() => handleOpenUserModal()}
              className="flex items-center bg-stone-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-black transition-all shadow-lg shadow-stone-900/10"
            >
              <UserPlus className="w-4 h-4 mr-2" /> Add New User
            </button>
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
                    <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-widest">User</th>
                    <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-widest">Role</th>
                    <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-widest">Joined</th>
                    <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {filteredUsers.map(u => (
                    <tr key={u._id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center font-bold text-stone-600 mr-3">
                            {u.profilePicture ? (
                              <img src={u.profilePicture} className="w-full h-full rounded-full object-cover" alt="" />
                            ) : u.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-stone-900">{u.name}</p>
                            <p className="text-xs text-stone-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${u.role === 'administrator' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {u.role === 'administrator' ? <ShieldCheck className="w-3 h-3 mr-1" /> : <UsersIcon className="w-3 h-3 mr-1" />}
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => handleToggleUserStatus(u._id)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold transition-colors ${u.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                        >
                          {u.isActive ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                          {u.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-stone-500">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleOpenUserModal(u)}
                            className="p-2 text-stone-400 hover:text-primary hover:bg-stone-100 rounded-lg transition-all" title="Edit User"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(u._id)}
                            disabled={u._id === currentUser?.id}
                            className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed" 
                            title="Delete User"
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
          {!loading && filteredUsers.length === 0 && (
            <div className="text-center py-20">
              <Search className="w-12 h-12 text-stone-200 mx-auto mb-4" />
              <p className="text-stone-500 font-medium">No users found for your search.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
