import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type LocationMapProps = {
  lat: number;
  lng: number;
  title?: string;
};

const LocationMap = ({ lat, lng, title = '📍 Location' }: LocationMapProps) => {
  const position: [number, number] = [lat, lng];

  return (
    <MapContainer
      center={position}
      zoom={15}
      scrollWheelZoom={false}
      className="w-full h-72 rounded-lg shadow"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        position={position}
        icon={L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        })}
      >
        <Popup>{title}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default LocationMap;
