import React, { useState } from 'react';
import { Search, Loader } from 'lucide-react';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setLoading(true);
      onSearch(query);
      setTimeout(() => setLoading(false), 500);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 animate-slide-up">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busca un lugar en Gijón..."
          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:bg-white"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full mt-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 rounded-xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 shadow-soft hover:shadow-soft-lg flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader size={18} className="animate-spin" /> Buscando...
          </>
        ) : (
          <>
            <Search size={18} /> Buscar
          </>
        )}
      </button>
    </form>
  );
}
