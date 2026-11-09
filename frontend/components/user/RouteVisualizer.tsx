'use client';

import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { StopAllocation } from '@/types';

export interface RouteVisualizerProps {
  userLocation: { latitude: number; longitude: number; label?: string };
  stops: StopAllocation[];
  activeStopIndex?: number;
  onSelectStop?: (index: number) => void;
}

export const RouteVisualizer: React.FC<RouteVisualizerProps> = ({
  userLocation,
  stops,
  activeStopIndex = 0,
  onSelectStop,
}) => {
  const [selectedPin, setSelectedPin] = useState<number | 'user'>(activeStopIndex);

  // Generate Google Maps Directions URL
  const gmapsUrl = React.useMemo(() => {
    if (stops.length === 0) return '#';
    const origin = `${userLocation.latitude},${userLocation.longitude}`;
    const destination = `${stops[stops.length - 1].latitude},${stops[stops.length - 1].longitude}`;
    const waypoints = stops
      .slice(0, -1)
      .map((s) => `${s.latitude},${s.longitude}`)
      .join('|');
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${
      waypoints ? `&waypoints=${waypoints}` : ''
    }&travelmode=driving`;
  }, [userLocation, stops]);

  return (
    <div className="card-elevated rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 text-white flex flex-col relative h-[520px]">
      {/* Top Map Toolbar */}
      <div className="bg-slate-900/90 backdrop-blur-md px-4 py-3 border-b border-slate-800 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Peta Rute Navigasi Singgah
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            {stops.length} Lokasi Pengelola
          </span>
          <a
            href={gmapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900/80 px-2.5 py-1 rounded-md border border-emerald-700/60 transition"
          >
            <span>Buka di Google Maps</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Interactive Vector Canvas */}
      <div className="flex-1 relative bg-[#0b1329] overflow-hidden flex items-center justify-center select-none">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b22_1px,transparent_1px),linear-gradient(to_bottom,#1e293b22_1px,transparent_1px)] bg-[size:32px_32px]"></div>

        {/* Ambient glow behind route */}
        <div className="absolute w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Dynamic Route SVG Canvas */}
        <svg className="w-full h-full absolute inset-0" viewBox="0 0 500 360">
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>

          {/* Road Network Silhouettes (Decorative Background Roads) */}
          <path d="M 30,120 Q 180,90 470,160" stroke="#1e293b" strokeWidth="6" fill="none" opacity="0.6" />
          <path d="M 80,320 Q 220,190 350,40" stroke="#1e293b" strokeWidth="5" fill="none" opacity="0.5" />
          <path d="M 120,40 L 140,320" stroke="#1e293b" strokeWidth="3" fill="none" opacity="0.4" />
          <path d="M 340,300 L 440,80" stroke="#1e293b" strokeWidth="4" fill="none" opacity="0.4" />

          {/* Active Navigation Polyline */}
          {stops.length > 0 && (
            <>
              {/* Animated glowing route line */}
              <path
                d={
                  stops.length === 1
                    ? 'M 100,240 Q 220,220 380,120'
                    : 'M 100,240 Q 180,140 250,110 T 400,160'
                }
                stroke="url(#routeGradient)"
                strokeWidth="4"
                strokeDasharray="6,4"
                fill="none"
                filter="url(#glow)"
              />

              {/* Waypoint distance labels */}
              <rect x="155" y="160" width="60" height="20" rx="4" fill="#0f172a" stroke="#334155" />
              <text x="185" y="174" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
                {stops[0]?.distanceKm ? `${stops[0].distanceKm.toFixed(1)} km` : '2.1 km'}
              </text>

              {stops.length > 1 && (
                <>
                  <rect x="305" y="115" width="60" height="20" rx="4" fill="#0f172a" stroke="#334155" />
                  <text x="335" y="129" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
                    {stops[1]?.distanceKm ? `${stops[1].distanceKm.toFixed(1)} km` : '2.7 km'}
                  </text>
                </>
              )}
            </>
          )}

          {/* PIN: User Start Point */}
          <g transform="translate(100, 240)">
            <circle r="18" fill="#0284c7" opacity="0.2" className="animate-ping" />
            <circle r="10" fill="#0284c7" stroke="#ffffff" strokeWidth="2.5" />
            <circle r="4" fill="#ffffff" />
            <text x="0" y="24" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
              Lokasi Anda
            </text>
          </g>

          {/* PIN: Stop 1 */}
          {stops[0] && (
            <g
              transform="translate(250, 110)"
              className="cursor-pointer group"
              onClick={() => {
                setSelectedPin(0);
                onSelectStop && onSelectStop(0);
              }}
            >
              <circle r="16" fill="#10b981" opacity={selectedPin === 0 ? '0.4' : '0.15'} />
              <circle r="11" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
              <text x="0" y="4" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                1
              </text>
              <rect x="-60" y="-30" width="120" height="20" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
              <text x="0" y="-17" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                Stop 1: {stops[0].recyclerName.split(' ')[0]}
              </text>
            </g>
          )}

          {/* PIN: Stop 2 (If multi-stop) */}
          {stops[1] && (
            <g
              transform="translate(400, 160)"
              className="cursor-pointer group"
              onClick={() => {
                setSelectedPin(1);
                onSelectStop && onSelectStop(1);
              }}
            >
              <circle r="16" fill="#f59e0b" opacity={selectedPin === 1 ? '0.4' : '0.15'} />
              <circle r="11" fill="#f59e0b" stroke="#ffffff" strokeWidth="2.5" />
              <text x="0" y="4" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                2
              </text>
              <rect x="-60" y="-30" width="120" height="20" rx="4" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
              <text x="0" y="-17" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                Stop 2: {stops[1].recyclerName.split(' ')[0]}
              </text>
            </g>
          )}
        </svg>

        {/* Map Legend Overlay */}
        <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-800 text-[11px] space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
            <span className="text-slate-300">Titik Awal Anda</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-slate-300">Stop 1 (Pengelola Utama)</span>
          </div>
          {stops.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-slate-300">Stop 2 (Pengelola Lanjutan)</span>
            </div>
          )}
        </div>
      </div>

      {/* Selected Stop Mini Inspector */}
      {typeof selectedPin === 'number' && stops[selectedPin] && (
        <div className="bg-slate-900 p-3.5 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Rincian Singgah {selectedPin + 1}
            </span>
            <p className="font-bold text-white">{stops[selectedPin].recyclerName}</p>
            <p className="text-slate-400 text-[11px]">{stops[selectedPin].address}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">Jarak dari Titik Anda:</span>
            <span className="font-extrabold text-white text-sm">
              {stops[selectedPin].distanceKm.toFixed(1)} km
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

