import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, User, Loader2, MapPin } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [verificationLink, setVerificationLink] = useState<string | null>(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (isLogin) {
        const response = await axios.post('http://localhost:5001/api/auth/login', {
          email: formData.email,
          password: formData.password
        });

        if (response.data.success) {
          login(response.data.user, response.data.token);
          navigate(location.state?.from?.pathname || '/');
        }
      } else {
        const response = await axios.post('http://localhost:5001/api/auth/register', formData);
        
        if (response.data.success) {
          setSuccessMsg(response.data.message);
          // Auto-verify if link is returned for demo purposes
          if (response.data.verificationLink) {
            setVerificationLink(response.data.verificationLink);
          }
          setIsLogin(true); // Switch to login tab
          setFormData({ ...formData, password: '' }); // Clear password
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:5001/api/auth/google', {
        token: credentialResponse.credential
      });

      if (response.data.success) {
        login(response.data.user, response.data.token);
        navigate(location.state?.from?.pathname || '/');
      }
    } catch (err: any) {
      setError('Google Sign-In failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-stone-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden">
        
        <div className="bg-primary/5 p-8 text-center border-b border-stone-100">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-stone-900">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="text-stone-500 mt-2">
            {isLogin ? 'Sign in to manage your plots and favorites' : 'Join PlotBuddy to start listing your land'}
          </p>
        </div>

        <div className="p-8">
          {/* Tabs */}
          <div className="flex bg-stone-100 p-1 rounded-xl mb-6">
            <button
              onClick={() => { setIsLogin(true); setError(null); setSuccessMsg(null); }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:text-stone-700'}`}
            >
              Log In
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(null); setSuccessMsg(null); }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:text-stone-700'}`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100 text-center font-medium">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-6 bg-emerald-50 text-emerald-600 p-3 rounded-xl text-sm border border-emerald-100 text-center font-medium">
              {successMsg}
              {verificationLink && (
                <div className="mt-2 pt-2 border-t border-emerald-100">
                  <p className="text-xs mb-2">Since this is a demo, you can verify here:</p>
                  <a 
                    href={verificationLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors"
                  >
                    Click to Verify Account
                  </a>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                  <input
                    type="text"
                    name="name"
                    required={!isLogin}
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-primary/20 flex items-center justify-center mt-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-8 flex items-center">
            <div className="flex-1 border-t border-stone-200"></div>
            <span className="px-4 text-sm text-stone-400 font-medium">OR CONTINUE WITH</span>
            <div className="flex-1 border-t border-stone-200"></div>
          </div>

          <div className="mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google Sign-In failed.')}
              theme="outline"
              size="large"
              width="100%"
            />
          </div>
          
        </div>
      </div>
    </div>
  );
}
