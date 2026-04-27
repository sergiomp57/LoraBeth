import React, { useState, useRef, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import MapComponent from './components/MapComponent';
import SearchBar from './components/SearchBar';
import ToolsPanel from './components/ToolsPanel';
import CoordinatesInput from './components/CoordinatesInput';

export default function App() {
  const [mapRef, setMapRef] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [distanceMode, setDistanceMode] = useState(false);
  const [currentMapLayer, setCurrentMapLayer] = useState('satellite');
  const [selectedCoords, setSelectedCoords] = useState({ lat: '', lon: '' });
  const [searchResults, setSearchResults] = useState(null);
  const [distance, setDistance] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSearch = async (query) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}, Gijón, España&limit=1`
      );
      const data = await response.json();
      if (data.length > 0) {
        const place = data[0];
        setSearchResults({
          name: place.display_name,
          lat: parseFloat(place.lat),
          lon: parseFloat(place.lon),
        });
        setSelectedCoords({
          lat: parseFloat(place.lat).toFixed(4),
          lon: parseFloat(place.lon).toFixed(4),
        });
      }
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const handleCoordinatesChange = (lat, lon) => {
    setSelectedCoords({ lat, lon });
  };

  const handleGoToCoordinates = () => {
    if (selectedCoords.lat && selectedCoords.lon && mapRef) {
      mapRef.setView(
        [parseFloat(selectedCoords.lat), parseFloat(selectedCoords.lon)],
        15
      );
    }
  };

  const handleClearDistance = () => {
    setDistance(null);
    setDistanceMode(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Overlay para móvil */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-all duration-300 ease-out z-40 w-80 h-screen bg-white border-r border-gray-200 overflow-hidden flex flex-col shadow-soft-lg md:w-80 md:translate-x-0`}
      >
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              🗺️ Gijón Maps
            </h1>
            <p className="text-sm text-gray-600">
              Explora, busca y mide distancias
            </p>
          </div>

          {/* Search Bar */}
          <SearchBar onSearch={handleSearch} />

          {/* Coordinates Input */}
          <CoordinatesInput
            coords={selectedCoords}
            onChange={handleCoordinatesChange}
            onGo={handleGoToCoordinates}
          />

          {/* Tools Panel */}
          <ToolsPanel
            distanceMode={distanceMode}
            onDistanceModeToggle={() => setDistanceMode(!distanceMode)}
            currentMapLayer={currentMapLayer}
            onMapLayerChange={setCurrentMapLayer}
            distance={distance}
            onClear={handleClearDistance}
          />

          {/* Search Results */}
          {searchResults && (
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200 animate-slide-up">
              <p className="text-sm font-semibold text-gray-900">
                {searchResults.name}
              </p>
              <p className="text-xs text-gray-600 mt-2">
                {searchResults.lat.toFixed(4)}, {searchResults.lon.toFixed(4)}
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar with Toggle */}
        <div className="md:hidden h-16 bg-white border-b border-gray-200 flex items-center px-4 gap-4 shadow-soft">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <X size={24} className="text-gray-600" />
            ) : (
              <Menu size={24} className="text-gray-600" />
            )}
          </button>
          <h1 className="text-lg font-bold text-gray-900">Gijón Maps</h1>
        </div>

        {/* Map */}
        <MapComponent
          setMapRef={setMapRef}
          currentMapLayer={currentMapLayer}
          distanceMode={distanceMode}
          onDistanceCalculated={setDistance}
          onCoordinatesSelected={handleCoordinatesChange}
          searchResults={searchResults}
        />
      </div>
    </div>
  );
}
