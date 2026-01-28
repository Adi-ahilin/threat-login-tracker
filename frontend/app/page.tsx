'use client';

import dynamic from 'next/dynamic';

// Importación Dinámica: Esto carga el mapa SOLO en el cliente (navegador)
// ssr: false significa "Server Side Rendering: Apagado" para este componente
const ThreatMap = dynamic(() => import('../components/Map'), { 
  ssr: false,
  loading: () => <p className="text-red-400 animate-pulse">Cargando satélites...</p>
});

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      {/* Encabezado */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-red-600 tracking-widest drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">
          ☠️ THREAT MONITOR
        </h1>
        <p className="text-slate-500 mt-2">Sistema de Vigilancia de Accesos en Tiempo Real</p>
      </header>

      {/* Contenedor del Mapa */}
      <div className="max-w-6xl mx-auto h-[600px] border-2 border-slate-800 rounded-xl overflow-hidden shadow-2xl shadow-black relative">
        {/* Efecto de escaneo (decorativo) */}
        <div className="absolute inset-0 pointer-events-none z-10 border border-red-900/20 rounded-xl"></div>
        
        {/* El Mapa */}
        <ThreatMap />
      </div>
    </main>
  );
}