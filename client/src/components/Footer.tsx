import React from 'react';
import { Map } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 py-12 text-center mt-auto border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <Map className="w-6 h-6 text-stone-500" />
          <span className="text-xl font-bold text-stone-300">PlotBuddy</span>
        </div>
        <p className="text-sm">&copy; {new Date().getFullYear()} PlotBuddy. All rights reserved.</p>
      </div>
    </footer>
  );
}
