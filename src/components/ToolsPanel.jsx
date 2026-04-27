import React from 'react';
import { Ruler, Satellite, Map as MapIcon, Trash2, Mountain } from 'lucide-react';

export default function ToolsPanel({
  distanceMode,
  onDistanceModeToggle,
  currentMapLayer,
  onMapLayerChange,
  distance,
  onClear,
}) {
  const tools = [
    {
      id: 'distance',
      icon: Ruler,
      label: 'Medir distancia',
      active: distanceMode,
      onClick: onDistanceModeToggle,
    },
    {
      id: 'satellite',
      icon: Satellite,
      label: 'Satélite',
      active: currentMapLayer === 'satellite',
      onClick: () => onMapLayerChange('satellite'),
    },
    {
      id: 'map',
      icon: MapIcon,
      label: 'Mapa normal',
      active: currentMapLayer === 'osm',
      onClick: () => onMapLayerChange('osm'),
    },
    {
      id: 'terrain',
      icon: Mountain,
      label: 'Topográfico',
      active: currentMapLayer === 'terrain',
      onClick: () => onMapLayerChange('terrain'),
    },
  ];

  return (
    <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Herramientas</h3>
      <div className="space-y-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={tool.onClick}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all transform hover:scale-105 active:scale-95 ${
                tool.active
                  ? 'bg-blue-500 text-white shadow-soft-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon size={18} />
              <span className="flex-1 text-left text-sm">{tool.label}</span>
            </button>
          );
        })}
      </div>

      {distance && (
        <div className="mt-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 animate-slide-up">
          <p className="text-xs font-semibold text-gray-600">📏 Distancia medida</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {distance.distance.toFixed(2)} km
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {(distance.distance * 1000).toFixed(0)} metros
          </p>
        </div>
      )}

      <button
        onClick={onClear}
        className="w-full mt-4 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2.5 rounded-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-soft hover:shadow-soft-lg"
      >
        <Trash2 size={18} /> Limpiar
      </button>
    </div>
  );
}
