import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';

// Fix for default marker icon in Leaflet + Webpack/Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to update map view when props change
const RecenterMap = ({ center, markers }) => {
  const map = useMap();
  useEffect(() => {
    if (markers && markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (center) {
      map.setView(center, 13);
    }
  }, [center, markers, map]);
  return null;
};

const DestinationMap = ({ lat, lng, title, markers = [] }) => {
  if (!lat || !lng) return null;

  const position = [lat, lng];
  const apiKey = import.meta.env.VITE_MAPTILER_API_KEY || 'your_key';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl h-[400px] w-full relative z-0"
    >
      <MapContainer 
        center={position} 
        zoom={13} 
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={`https://api.maptiler.com/maps/darkmatter/{z}/{x}/{y}.png?key=${apiKey}`}
        />
        
        {/* Main Destination Marker */}
        <Marker position={position}>
          <Popup className="dark-popup">
            <span className="font-bold">{title}</span>
          </Popup>
        </Marker>

        {/* Nearby Places Markers */}
        {markers.map((marker, idx) => (
          <Marker key={idx} position={[marker.lat, marker.lng]}>
            <Popup>
              <span className="text-xs font-medium">{marker.name}</span>
            </Popup>
          </Marker>
        ))}

        <RecenterMap center={position} markers={markers} />
      </MapContainer>
    </motion.div>
  );
};

export default DestinationMap;
