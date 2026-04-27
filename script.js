// Inicializar el mapa centrado en Gijón
const gijónCoords = [43.5453, -5.6611];
let map = L.map('map').setView(gijónCoords, 13);
const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '© OpenStreetMap contributors',
maxZoom: 19
});
const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
attribution: 'Tiles © Esri',
maxZoom: 19
});
osmLayer.addTo(map);
let distanceMode = false;
let distancePoints = [];
let distancePolyline = null;
let markers = [];
let currentMapLayer = 'osm';
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const latInput = document.getElementById('latInput');
const lonInput = document.getElementById('lonInput');
const goToCoordinates = document.getElementById('goToCoordinates');
const distanceModeBtn = document.getElementById('distanceMode');
const satelliteModeBtn = document.getElementById('satelliteMode');
const normalModeBtn = document.getElementById('normalMode');
const clearAllBtn = document.getElementById('clearAll');
const infoText = document.getElementById('infoText');
const distanceText = document.getElementById('distanceText');

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
}

async function searchPlace() {
    const query = searchInput.value.trim();
    if (!query) {
        alert('Por favor ingresa un lugar');
        return;
    }
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}, Gijón, España&limit=1`);
        const data = await response.json();
        if (data.length === 0) {
            alert('Lugar no encontrado');
            return;
        }
        const place = data[0];
        const lat = parseFloat(place.lat);
        const lon = parseFloat(place.lon);
        map.setView([lat, lon], 15);
        addSearchMarker(lat, lon, place.display_name);
        latInput.value = lat.toFixed(4);
        lonInput.value = lon.toFixed(4);
        infoText.textContent = `📍 ${place.display_name}`;
    } catch (error) {
        console.error('Error en la búsqueda:', error);
        alert('Error al buscar el lugar');
    }
}

function addSearchMarker(lat, lon, name) {
    markers.forEach(m => map.removeLayer(m));
    markers = [];
    const marker = L.marker([lat, lon], { icon: L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    }) })
    .bindPopup(name)
    .openPopup();
    marker.addTo(map);
    markers.push(marker);
}

function goToGivenCoordinates() {
    const lat = parseFloat(latInput.value);
    const lon = parseFloat(lonInput.value);
    if (isNaN(lat) || isNaN(lon)) {
        alert('Por favor ingresa coordenadas válidas');
        return;
    }
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        alert('Coordenadas fuera de rango');
        return;
    }
    map.setView([lat, lon], 15);
    addSearchMarker(lat, lon, `${lat.toFixed(4)}, ${lon.toFixed(4)}`);
    reverseGeocode(lat, lon);
}

async function reverseGeocode(lat, lon) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        const data = await response.json();
        infoText.textContent = `📍 ${data.address.road || data.address.village || 'Ubicación desconocida'}`;
    } catch (error) {
        console.error('Error en geocodificación inversa:', error);
        infoText.textContent = `📍 ${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    }
}

function toggleDistanceMode() {
    distanceMode = !distanceMode;
    distanceModeBtn.classList.toggle('active');
    distancePoints = [];
    if (distancePolyline) {
        map.removeLayer(distancePolyline);
        distancePolyline = null;
    }
    distanceText.textContent = '';
    if (distanceMode) {
        infoText.textContent = '📋 Modo distancia: Haz clic en dos puntos del mapa';
    } else {
        infoText.textContent = 'Haz clic en el mapa para obtener coordenadas';
    }
}

function toggleSatellite() {
    if (currentMapLayer === 'osm') {
        map.removeLayer(osmLayer);
        satelliteLayer.addTo(map);
        currentMapLayer = 'satellite';
        satelliteModeBtn.classList.add('active');
        normalModeBtn.classList.remove('active');
    } else {
        map.removeLayer(satelliteLayer);
        osmLayer.addTo(map);
        currentMapLayer = 'osm';
        satelliteModeBtn.classList.remove('active');
        normalModeBtn.classList.add('active');
    }
}

function clearAll() {
    distanceMode = false;
    distanceModeBtn.classList.remove('active');
    distancePoints = [];
    if (distancePolyline) {
        map.removeLayer(distancePolyline);
        distancePolyline = null;
    }
    markers.forEach(m => map.removeLayer(m));
    markers = [];
    searchInput.value = '';
    latInput.value = '';
    lonInput.value = '';
    infoText.textContent = 'Haz clic en el mapa para obtener coordenadas';
    distanceText.textContent = '';
}

searchBtn.addEventListener('click', searchPlace);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchPlace();
});
goToCoordinates.addEventListener('click', goToGivenCoordinates);
latInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') goToGivenCoordinates();
});
lonInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') goToGivenCoordinates();
});
distanceModeBtn.addEventListener('click', toggleDistanceMode);
satelliteModeBtn.addEventListener('click', toggleSatellite);
normalModeBtn.addEventListener('click', () => {
    if (currentMapLayer !== 'osm') toggleSatellite();
});
clearAllBtn.addEventListener('click', clearAll);

map.on('click', async (e) => {
    const lat = e.latlng.lat;
    const lon = e.latlng.lng;
    if (distanceMode) {
        if (distancePoints.length < 2) {
            distancePoints.push([lat, lon]);
            const distanceMarker = L.marker([lat, lon], { icon: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-blue.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            }) })
            .bindPopup(`Punto ${distancePoints.length}`);
            distanceMarker.addTo(map);
            markers.push(distanceMarker);
            if (distancePoints.length === 2) {
                const dist = calculateDistance(distancePoints[0][0], distancePoints[0][1], distancePoints[1][0], distancePoints[1][1]);
                distancePolyline = L.polyline(distancePoints, {color: 'blue', weight: 2, opacity: 0.7}).addTo(map);
                distanceText.textContent = `📋 Distancia: ${dist.toFixed(2)} km (${(dist * 1000).toFixed(0)} m)`;
                infoText.textContent = '✅ Distancia calculada. Haz clic en Limpiar para medir nuevamente';
            }
        }
    } else {
        latInput.value = lat.toFixed(4);
        lonInput.value = lon.toFixed(4);
        addSearchMarker(lat, lon, `${lat.toFixed(4)}, ${lon.toFixed(4)}`);
        reverseGeocode(lat, lon);
    }
});

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;
        if (Math.abs(userLat - gijónCoords[0]) < 0.5 && Math.abs(userLon - gijónCoords[1]) < 0.5) {
            map.setView([userLat, userLon], 14);
        }
    }, () => { });
}