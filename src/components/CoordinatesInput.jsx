import React from 'react';
import { MapPin } from 'lucide-react';

export default function CoordinatesInput({ coords, onChange, onGo }) {
  return (
    <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Coordenadas</h3>
      <div className="space-y-2">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Latitud
          </label>
          <input
            type="number"
            step="0.0001"
            value={coords.lat}
            onChange={(e) => onChange(e.target.value, coords.lon)}
            placeholder="43.5453"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Longitud
          </label>
          <input
            type="number"
            step="0.0001"
            value={coords.lon}
            onChange={(e) => onChange(coords.lat, e.target.value)}
            placeholder="-5.6611"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:bg-white"
          />
        </div>
      </div>
      <button
        onClick={onGo}
        className="w-full mt-3 bg-white hover:bg-gray-50 border-2 border-blue-500 text-blue-600 font-medium py-2.5 rounded-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-soft hover:shadow-soft-lg"
      >
        <MapPin size={18} /> Ir a coordenadas
      </button>
    </div>
  );
}
