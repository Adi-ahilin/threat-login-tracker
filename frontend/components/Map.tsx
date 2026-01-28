'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';

// --- ÍCONO ROJO DE ALERTA ---
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface LoginAttempt {
  id: number;
  ip_address: string;
  country: string;
  city: string;
  timestamp: string;
  lat?: number; 
  lon?: number;
}

export default function ThreatMap() {
  const [attempts, setAttempts] = useState<LoginAttempt[]>([]);

  // --- FUNCIÓN DE ANCLAJE (La Solución) ---
  // Esta función convierte la IP (ej: "127.0.0.1") en coordenadas fijas.
  // Matemáticas simples: Sumamos los números de la IP para elegir un lugar en el mapa.
  // Resultado: Misma IP = Mismo Lugar SIEMPRE.
  const getStableCoordsFromIP = (ip: string) => {
    // 1. Convertimos la IP en un número sumando sus caracteres
    let hash = 0;
    for (let i = 0; i < ip.length; i++) {
      hash = ip.charCodeAt(i) + ((hash << 5) - hash);
    }

    // 2. Usamos ese número para fijar la latitud y longitud
    // Latitud: entre -60 y 80 (evitamos los polos extremos)
    const lat = (Math.abs(hash) % 140) - 60; 
    // Longitud: entre -180 y 180 (todo el ancho del mapa)
    const lon = (Math.abs(hash * 2) % 360) - 180;

    return { lat, lon };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/attempts/');
        if (!res.ok) throw new Error("Error fetching");
        const data = await res.json();
        
        // PROCESAMIENTO
        const mappedData = data.map((item: any) => {
            // Si la base de datos no tiene coordenadas (es null),
            // las calculamos basándonos en su IP.
            let coords = { lat: item.lat, lon: item.lon };
            
            if (!coords.lat || !coords.lon) {
                coords = getStableCoordsFromIP(item.ip_address || "0.0.0.0");
            }

            return {
                ...item,
                lat: coords.lat,
                lon: coords.lon
            };
        });

        setAttempts(mappedData);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <MapContainer 
      center={[20, 0]} 
      zoom={2} 
      className="h-full w-full rounded-lg bg-slate-900"
    >
      <TileLayer
        attribution='&copy; CARTO'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      {attempts.map((attempt, index) => (
        <Marker 
          // Usamos el ID como clave única para que React no se confunda
          key={attempt.id || index} 
          position={[attempt.lat || 0, attempt.lon || 0]} 
          icon={redIcon}
        >
          <Popup className="text-red-600 font-bold">
            ⚠️ ALERTA DE SEGURIDAD<br/>
            <span className="text-black font-normal text-sm">
              IP: {attempt.ip_address}<br/>
              Fecha: {new Date(attempt.timestamp).toLocaleTimeString()}
            </span>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
