import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

function MapEvents({ distanceMode, onDistanceCalculated, onCoordinatesSelected }) {
  const [distancePoints, setDistancePoints] = useState([]);
  const mapEvents = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onCoordinatesSelected(lat.toFixed(4), lng.toFixed(4));

      if (distanceMode) {
        if (distancePoints.length < 2) {
          const newPoints = [...distancePoints, [lat, lng]];
          setDistancePoints(newPoints);

          if (newPoints.length === 2) {
            const dist = calculateDistance(
              newPoints[0][0],
              newPoints[0][1],
              newPoints[1][0],
              newPoints[1][1]
            );
            onDistanceCalculated({
              distance: dist,
              points: newPoints,
            });
          }
        }
      }
    },
  });

  useEffect(() => {
    if (!distanceMode) {
      setDistancePoints([]);
    }
  }, [distanceMode]);

  return null;
}

export default function MapComponent({
  setMapRef,
  currentMapLayer,
  distanceMode,
  onDistanceCalculated,
  onCoordinatesSelected,
  searchResults,
}) {
  const [markers, setMarkers] = useState([]);
  const mapContainerRef = useRef(null);

  const gijónCoords = [43.5453, -5.6611];

  const tileLayerUrl =
    currentMapLayer === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : currentMapLayer === 'terrain'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const attribution =
    currentMapLayer === 'osm'
      ? '© OpenStreetMap contributors'
      : '© Esri';

  useEffect(() => {
    if (searchResults && mapContainerRef.current) {
      mapContainerRef.current.setView(
        [searchResults.lat, searchResults.lon],
        15
      );
      setMarkers([
        {
          id: 'search',
          lat: searchResults.lat,
          lon: searchResults.lon,
          name: searchResults.name,
        },
      ]);
    }
  }, [searchResults]);

  return (
    <div className="flex-1 relative">
      <MapContainer
        center={gijónCoords}
        zoom={13}
        className="w-full h-full rounded-lg"
        ref={(map) => {
          mapContainerRef.current = map;
          setMapRef(map);
        }}
      >
        <TileLayer url={tileLayerUrl} attribution={attribution} maxZoom={19} />
        {markers.map((marker) => (
          <Marker key={marker.id} position={[marker.lat, marker.lon]}>
            <Popup>
              <div className="font-semibold text-gray-900">{marker.name}</div>
            </Popup>
          </Marker>
        ))}
        <MapEvents
          distanceMode={distanceMode}
          onDistanceCalculated={onDistanceCalculated}
          onCoordinatesSelected={onCoordinatesSelected}
        />
      </MapContainer>
    </div>
  );
}
