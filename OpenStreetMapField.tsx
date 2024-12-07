import React, { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

interface OpenStreetMapFieldProps {
  input: {
    value: { lat: number; lng: number; address: string };
    onChange: (value: { lat: number; lng: number; address: string }) => void;
  };
}

const OpenStreetMapField: React.FC<OpenStreetMapFieldProps> = ({ input }) => {
  const defaultPosition = { lat: 51.505, lng: -0.09 };
  const [leafletComponents, setLeafletComponents] = useState<any>(null);
  const [position, setPosition] = useState({ lat: input.value.lat || defaultPosition.lat, lng: input.value.lng || defaultPosition.lng });
  const [address, setAddress] = useState<string>(input.value.address || '');
  const [loading, setLoading] = useState<boolean>(false);
  const [mapVisible, setMapVisible] = useState<boolean>(false);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    const loadLeafletModules = async () => {
      const L = await import('leaflet');

      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const { MapContainer, TileLayer, Marker, useMapEvents } = await import(
        'react-leaflet'
      );
      setLeafletComponents({ MapContainer, TileLayer, Marker, useMapEvents });
    };

    if (typeof window !== 'undefined' && mapVisible) {
      loadLeafletModules();
    }
  }, [mapVisible]);

  useEffect(() => {
    if (input.value.lat !== undefined && input.value.lng !== undefined) {
      setPosition({ lat: input.value.lat, lng: input.value.lng });
    }
    if (input.value.address !== undefined) {
      setAddress(input.value.address);
    }
  }, [input.value]);

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

  const handleGeocode = async () => {
    if (!address) return;

    setLoading(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const newPosition = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
        setPosition(newPosition);
        input.onChange({ ...newPosition, address });

        if (mapRef.current) {
          mapRef.current.setView(newPosition, 13, { animate: true });
        }
      } else {
        alert("Не удалось найти данные по этому адресу.");
      }
    } catch (error) {
      console.error("Ошибка геокодирования:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleGeocode();
    }
  };

  if (!leafletComponents && mapVisible) {
    return null;
  }

  const { MapContainer, TileLayer, Marker, useMapEvents } = leafletComponents || {};

  const MapWithEvents = () => {
    useMapEvents({
      click(e: any) {
        const newPosition = { lat: e.latlng.lat, lng: e.latlng.lng };
        setPosition(newPosition);
        input.onChange({ ...newPosition, address });
      },
    });
    return null;
  };

  return (
    <div>
      <input
        type="text"
        value={address}
        onChange={handleAddressChange}
        onKeyPress={handleKeyPress}
        placeholder="Введите адрес"
        style={{ marginBottom: '10px', width: '80%', padding: '8px' }}
      />
      <button
        onClick={handleGeocode}
        style={{
          width: '20%',
          marginBottom: '10px',
          padding: '8px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
        disabled={loading}
      >
        {loading ? 'Ищем...' : 'Найти на карте'}
      </button>
      <button
        onClick={() => setMapVisible(!mapVisible)}
        style={{ marginBottom: '10px', padding: '8px', display: 'block' }}
      >
        {mapVisible ? 'Скрыть карту' : 'Показать карту'}
      </button>
      {mapVisible && (
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '400px', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position} />
          <MapWithEvents />
        </MapContainer>
      )}
    </div>
  );
};

export default OpenStreetMapField;
