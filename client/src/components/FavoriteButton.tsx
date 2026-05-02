import React, { useState } from 'react';
import axios from 'axios';
import { Heart, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface FavoriteButtonProps {
  plotId: string;
  className?: string;
  size?: number;
}

export default function FavoriteButton({ plotId, className = '', size = 24 }: FavoriteButtonProps) {
  const { user, token, toggleFavorite, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  const isFavorite = user?.favorites?.includes(plotId) || false;

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent triggering parent links
    e.stopPropagation();

    if (!isAuthenticated) {
      alert("Please sign in using the Google button in the top header to favorite plots!");
      return;
    }

    setLoading(true);
    try {
      if (isFavorite) {
        await axios.delete(`http://localhost:5001/api/users/favorites/${plotId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`http://localhost:5001/api/users/favorites/${plotId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      toggleFavorite(plotId);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      alert('Failed to update favorites. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleClick}
      disabled={loading}
      className={`p-2 rounded-full backdrop-blur transition-all ${isFavorite ? 'bg-red-50 hover:bg-red-100' : 'bg-white/80 hover:bg-white'} ${className}`}
      title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
    >
      {loading ? (
        <Loader2 className="animate-spin text-stone-400" size={size} />
      ) : (
        <Heart 
          size={size} 
          className={`transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-stone-400 hover:text-red-400'}`} 
        />
      )}
    </button>
  );
}
