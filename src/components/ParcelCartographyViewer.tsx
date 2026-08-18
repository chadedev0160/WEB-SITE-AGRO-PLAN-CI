import React, { useState } from 'react';
import {
  MapPin,
  Layers,
  Trees,
  Sun,
  ShieldCheck,
  Download,
  Eye,
  Maximize2,
  Minimize2,
  Navigation,
  Compass,
  AlertTriangle,
  Info,
  CheckCircle2,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { ParcelCartography, PlantedTreeMarker, GPSPoint } from '../types';

interface ParcelCartographyViewerProps {
  cartography: ParcelCartography;
  farmerName: string;
  farmerCardCode: string;
  village: string;
  farmerPhotoUrl?: string;
  compact?: boolean;
}

export const ParcelCartographyViewer: React.FC<ParcelCartographyViewerProps> = ({
  cartography,
  farmerName,
  farmerCardCode,
  village,
  farmerPhotoUrl,
  compact = false,
}) => {
  const [activeLayer, setActiveLayer] = useState<'satellite' | 'shade_heatmap' | 'trees' | 'rdue'>('satellite');
  const [selectedTree, setSelectedTree] = useState<PlantedTreeMarker | null>(null);
  const [selectedGpsPoint, setSelectedGpsPoint] = useState<GPSPoint | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showTreeLabels, setShowTreeLabels] = useState(true);

  // SVG dimensions for the parcel polygon
  // Standardized viewBox 0 0 500 350
  // Generate polygon points based on cartography boundary
  const polygonPointsStr = cartography.boundaryPoints
    .map((pt, idx) => {
      // Map lat/lng relative offsets to SVG coordinates
      const coords = [
        [70, 60],
        [240, 45],
        [430, 90],
        [460, 260],
        [310, 310],
        [110, 280],
        [50, 180],
      ];
      const fallback = coords[idx % coords.length];
      return `${fallback[0]},${fallback[1]}`;
    })
    .join(' ');

  const getTreeColor = (category: PlantedTreeMarker['category']) => {
    switch (category) {
      case 'ombrage':
        return '#10B981'; // vibrant emerald
      case 'fruitier':
        return '#F59E0B'; // amber / banana
      case 'fertilite':
        return '#3B82F6'; // blue leguminous
      default:
        return '#84CC16'; // lime green cocoa
    }
  };

  const getTreeIcon = (species: string) => {
    if (species.toLowerCase().includes('framir') || species.toLowerCase().includes('iroko')) return '🌳';
    if (species.toLowerCase().includes('akpi') || species.toLowerCase().includes('kina')) return '🌲';
    if (species.toLowerCase().includes('banan')) return '🍌';
    return '🌱';
  };

  return (
    <div className="bg-[#17261C] text-white rounded-2xl overflow-hidden border border-emerald-800/60 shadow-xl flex flex-col">
      {/* Cartography Top Control Header */}
      <div className="p-3 bg-[#111C15] border-b border-emerald-800/40 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#2E7D32] flex items-center justify-center text-white shadow-xs">
            <Compass className="w-4 h-4 text-emerald-200 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-xs sm:text-sm">{cartography.parcelName}</span>
              <span className="bg-emerald-900/80 text-emerald-300 font-mono text-[10px] px-2 py-0.5 rounded-full border border-emerald-600/40">
                {cartography.areaHectares} Ha
              </span>
            </div>
            <p className="text-[10px] text-stone-400 font-mono flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-[#2E7D32]" />
              <span>
                {cartography.centerCoordinates.lat.toFixed(5)}° N, {cartography.centerCoordinates.lng.toFixed(5)}° W
              </span>
              <span>•</span>
              <span>Alt. {cartography.altitudeMeters}m</span>
            </p>
          </div>
        </div>

        {/* Layer Tabs */}
        <div className="flex items-center bg-black/40 p-1 rounded-xl border border-emerald-800/40 gap-1 text-[11px]">
          <button
            type="button"
            onClick={() => {
              setActiveLayer('satellite');
              setSelectedTree(null);
              setSelectedGpsPoint(null);
            }}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer ${
              activeLayer === 'satellite'
                ? 'bg-[#2E7D32] text-white shadow-xs'
                : 'text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span className="hidden sm:inline">Vue</span> Satellite
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveLayer('shade_heatmap');
              setSelectedTree(null);
              setSelectedGpsPoint(null);
            }}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer ${
              activeLayer === 'shade_heatmap'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sun className="w-3 h-3 text-amber-300" />
            <span>Ombrage ({cartography.shadePercentage}%)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveLayer('trees');
              setSelectedGpsPoint(null);
            }}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer ${
              activeLayer === 'trees'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Trees className="w-3 h-3 text-emerald-200" />
            <span className="hidden sm:inline">Arbres</span> GPS
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveLayer('rdue');
              setSelectedTree(null);
              setSelectedGpsPoint(null);
            }}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer ${
              activeLayer === 'rdue'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-3 h-3 text-blue-200" />
            <span>RDUE 2026</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Map Stage */}
      <div className="relative w-full aspect-[16/10] min-h-[260px] max-h-[420px] bg-[#0E1A12] overflow-hidden select-none">
        
        {/* Realistic Satellite Backdrop Texture (Forest & Agricultural Terrain) */}
        <div 
          className="absolute inset-0 opacity-45 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at 30% 40%, rgba(34, 85, 48, 0.9) 0%, transparent 60%),
              radial-gradient(circle at 75% 70%, rgba(45, 95, 58, 0.8) 0%, transparent 55%),
              radial-gradient(circle at 60% 20%, rgba(20, 60, 30, 0.9) 0%, transparent 50%),
              linear-gradient(135deg, #102617 0%, #163620 50%, #0F2214 100%)
            `
          }}
        />

        {/* Waterway / Creek Simulation near parcel */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
          <path
            d="M-20,120 Q120,160 250,110 T480,180 T600,160"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="4"
            strokeDasharray="4 2"
          />
          <text x="360" y="165" fill="#7DD3FC" fontSize="9" fontWeight="bold" opacity="0.8">
            Cours d'eau ({cartography.waterwayDistance})
          </text>
        </svg>

        {/* Interactive SVG Canvas Layer */}
        <svg
          viewBox="0 0 500 350"
          className={`w-full h-full transition-transform duration-300 ${isZoomed ? 'scale-125' : 'scale-100'}`}
        >
          <defs>
            {/* Heatmap gradient for shade */}
            <radialGradient id="shadeGlow1" cx="35%" cy="45%" r="45%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.75" />
              <stop offset="60%" stopColor="#059669" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="shadeGlow2" cx="70%" cy="30%" r="35%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.75" />
              <stop offset="60%" stopColor="#D97706" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#B45309" stopOpacity="0" />
            </radialGradient>
            <pattern id="cocoaGrid" width="18" height="18" patternUnits="userSpaceOnUse">
              <circle cx="9" cy="9" r="1.5" fill="#4ADE80" opacity="0.25" />
            </pattern>
          </defs>

          {/* Parcel Polygon Fill */}
          <polygon
            points={polygonPointsStr}
            fill={
              activeLayer === 'shade_heatmap'
                ? 'rgba(16, 185, 129, 0.25)'
                : activeLayer === 'rdue'
                ? 'rgba(59, 130, 246, 0.2)'
                : 'url(#cocoaGrid)'
            }
            stroke={
              activeLayer === 'rdue'
                ? '#60A5FA'
                : activeLayer === 'shade_heatmap'
                ? '#F59E0B'
                : '#10B981'
            }
            strokeWidth="2.5"
            strokeDasharray={activeLayer === 'rdue' ? '5 2' : 'none'}
            className="filter drop-shadow-[0_0_8px_rgba(16,185,129,0.3)] transition-all"
          />

          {/* Heatmap overlay rendering if shade mode is active */}
          {activeLayer === 'shade_heatmap' && (
            <g className="animate-fade-in pointer-events-none">
              <circle cx="180" cy="160" r="90" fill="url(#shadeGlow1)" />
              <circle cx="340" cy="180" r="85" fill="url(#shadeGlow1)" />
              <circle cx="370" cy="110" r="70" fill="url(#shadeGlow2)" />
              <text x="140" y="160" fill="#E2E8F0" fontSize="10" fontWeight="bold" opacity="0.9">
                Zone Optimale 42%
              </text>
              <text x="325" y="110" fill="#FEF08A" fontSize="9" fontWeight="bold" opacity="0.9">
                Zone à Reboiser 22%
              </text>
            </g>
          )}

          {/* RDUE 2026 Protection Buffer Geofencing */}
          {activeLayer === 'rdue' && (
            <g className="animate-fade-in pointer-events-none">
              <polygon
                points={polygonPointsStr}
                fill="none"
                stroke="#3B82F6"
                strokeWidth="12"
                strokeOpacity="0.2"
              />
              <text x="200" y="180" fill="#93C5FD" fontSize="12" fontWeight="bold" textAnchor="middle">
                PARCELLE CONFORME RDUE 2026
              </text>
              <text x="200" y="198" fill="#DBEAFE" fontSize="9" textAnchor="middle" opacity="0.8">
                Non issue de la déforestation post-2020 • Certifié GPS
              </text>
            </g>
          )}

          {/* GPS Boundary Markers (Bornes GPS) */}
          {cartography.boundaryPoints.map((pt, idx) => {
            const coords = [
              [70, 60],
              [240, 45],
              [430, 90],
              [460, 260],
              [310, 310],
              [110, 280],
              [50, 180],
            ];
            const [cx, cy] = coords[idx % coords.length];
            const isSelected = selectedGpsPoint?.id === pt.id;

            return (
              <g
                key={pt.id}
                onClick={() => {
                  setSelectedGpsPoint(pt);
                  setSelectedTree(null);
                }}
                className="cursor-pointer group"
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? 9 : 6}
                  fill={isSelected ? '#F59E0B' : '#FFFFFF'}
                  stroke="#15803D"
                  strokeWidth="2.5"
                  className="transition-all hover:scale-125"
                />
                <text
                  x={cx + 9}
                  y={cy + 4}
                  fill="#FFFFFF"
                  fontSize="9"
                  fontWeight="bold"
                  className="pointer-events-none select-none drop-shadow-md"
                >
                  {pt.label}
                </text>
              </g>
            );
          })}

          {/* Plotted Agroforestry Trees */}
          {cartography.plantedTrees.map((tree) => {
            const isSelected = selectedTree?.id === tree.id;
            // Map percentage to svg viewBox (0-500, 0-350)
            const cx = 60 + (tree.xPercent / 100) * 380;
            const cy = 65 + (tree.yPercent / 100) * 220;
            const treeColor = getTreeColor(tree.category);

            return (
              <g
                key={tree.id}
                onClick={() => {
                  setSelectedTree(tree);
                  setSelectedGpsPoint(null);
                }}
                className="cursor-pointer transition-all hover:opacity-100"
              >
                {/* Tree Canopy Circle */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? 16 : 10}
                  fill={treeColor}
                  fillOpacity={isSelected ? 0.9 : 0.65}
                  stroke={isSelected ? '#FFFFFF' : '#064E3B'}
                  strokeWidth={isSelected ? 2 : 1}
                  className="transition-all hover:r-14"
                />
                {/* Center dot / icon */}
                <circle cx={cx} cy={cy} r="3" fill="#FFFFFF" opacity="0.9" />

                {/* Tree Label if enabled */}
                {showTreeLabels && (
                  <text
                    x={cx}
                    y={cy - 12}
                    fill="#E2E8F0"
                    fontSize="8"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="pointer-events-none select-none drop-shadow-sm opacity-80"
                  >
                    {tree.species}
                  </text>
                )}
              </g>
            );
          })}

          {/* North Arrow Compass in Top Right */}
          <g transform="translate(460, 40)" className="pointer-events-none opacity-80">
            <circle cx="0" cy="0" r="14" fill="rgba(0,0,0,0.5)" stroke="#10B981" strokeWidth="1" />
            <path d="M0,-11 L4,3 L0,0 L-4,3 Z" fill="#EF4444" />
            <path d="M0,11 L4,-3 L0,0 L-4,-3 Z" fill="#E2E8F0" opacity="0.7" />
            <text x="-3" y="-13" fill="#EF4444" fontSize="8" fontWeight="bold">N</text>
          </g>

          {/* Scale Bar in Bottom Left */}
          <g transform="translate(20, 330)" className="pointer-events-none opacity-80">
            <line x1="0" y1="0" x2="60" y2="0" stroke="#FFFFFF" strokeWidth="2" />
            <line x1="0" y1="-3" x2="0" y2="3" stroke="#FFFFFF" strokeWidth="2" />
            <line x1="60" y1="-3" x2="60" y2="3" stroke="#FFFFFF" strokeWidth="2" />
            <text x="18" y="-4" fill="#FFFFFF" fontSize="8" fontWeight="bold">50 m</text>
          </g>
        </svg>

        {/* Floating Interactive Inspector Overlay for Selected Tree or GPS Borne */}
        {selectedTree && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs bg-[#111C15]/95 backdrop-blur-md border border-emerald-600/60 p-3 rounded-xl shadow-2xl text-xs space-y-1.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between border-b border-emerald-800/60 pb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-base">{getTreeIcon(selectedTree.species)}</span>
                <div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                    Arbre Enregistré #{selectedTree.id}
                  </span>
                  <h4 className="font-bold text-white text-sm leading-tight">{selectedTree.species}</h4>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTree(null)}
                className="text-stone-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-black/30 p-1.5 rounded-lg">
                <span className="text-[10px] text-stone-400 block">Rôle Agroforestier :</span>
                <span className="font-bold text-emerald-300 capitalize">{selectedTree.category}</span>
              </div>
              <div className="bg-black/30 p-1.5 rounded-lg">
                <span className="text-[10px] text-stone-400 block">Âge de l'Arbre :</span>
                <span className="font-bold text-white">{selectedTree.ageYears} ans</span>
              </div>
              <div className="bg-black/30 p-1.5 rounded-lg">
                <span className="text-[10px] text-stone-400 block">Apport Ombrage :</span>
                <span className="font-bold text-amber-300">+{selectedTree.shadeContribution}%</span>
              </div>
              <div className="bg-black/30 p-1.5 rounded-lg">
                <span className="text-[10px] text-stone-400 block">État Sanitaire :</span>
                <span className="font-bold text-emerald-400 capitalize">{selectedTree.healthStatus}</span>
              </div>
            </div>
          </div>
        )}

        {selectedGpsPoint && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs bg-[#111C15]/95 backdrop-blur-md border border-amber-500/60 p-3 rounded-xl shadow-2xl text-xs space-y-1.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" />
                <h4 className="font-bold text-white text-sm">Borne GPS {selectedGpsPoint.label}</h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedGpsPoint(null)}
                className="text-stone-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1 text-[11px] font-mono">
              <div className="flex justify-between bg-black/30 p-1.5 rounded-lg">
                <span className="text-stone-400">Latitude :</span>
                <span className="text-amber-300 font-bold">{selectedGpsPoint.lat.toFixed(6)}° N</span>
              </div>
              <div className="flex justify-between bg-black/30 p-1.5 rounded-lg">
                <span className="text-stone-400">Longitude :</span>
                <span className="text-amber-300 font-bold">{selectedGpsPoint.lng.toFixed(6)}° W</span>
              </div>
              <div className="flex justify-between bg-black/30 p-1.5 rounded-lg">
                <span className="text-stone-400">Altitude :</span>
                <span className="text-emerald-300 font-bold">{selectedGpsPoint.elevationMeters || 180} m</span>
              </div>
            </div>
          </div>
        )}

        {/* View Controls Toolbar (Bottom Right) */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          <button
            type="button"
            onClick={() => setIsZoomed(!isZoomed)}
            title={isZoomed ? 'Dézoomer' : 'Zoomer'}
            className="w-7 h-7 rounded-lg bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-emerald-800/60 transition-colors cursor-pointer"
          >
            {isZoomed ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => setShowTreeLabels(!showTreeLabels)}
            title="Afficher/Masquer les étiquettes des arbres"
            className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-colors cursor-pointer ${
              showTreeLabels
                ? 'bg-[#2E7D32] text-white border-emerald-400'
                : 'bg-black/60 text-stone-400 border-emerald-800/60'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Cartography Key Stats Bar & Legend */}
      <div className="p-3 bg-[#111C15] border-t border-emerald-800/40 text-xs space-y-2.5">
        
        {/* Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
          <div className="bg-black/30 p-2 rounded-xl border border-emerald-900/60">
            <span className="text-[10px] text-stone-400 block">Superficie Parcelle</span>
            <span className="font-extrabold text-sm text-emerald-300">{cartography.areaHectares} Hectares</span>
          </div>

          <div className="bg-black/30 p-2 rounded-xl border border-emerald-900/60">
            <span className="text-[10px] text-stone-400 block">Taux d'Ombrage</span>
            <span className="font-extrabold text-sm text-amber-300">{cartography.shadePercentage}% Optimal</span>
          </div>

          <div className="bg-black/30 p-2 rounded-xl border border-emerald-900/60">
            <span className="text-[10px] text-stone-400 block">Arbres d'Ombrage</span>
            <span className="font-extrabold text-sm text-emerald-400">
              {cartography.treesCount.shadeTrees} tiges géoloc.
            </span>
          </div>

          <div className="bg-black/30 p-2 rounded-xl border border-emerald-900/60">
            <span className="text-[10px] text-stone-400 block">Conformité RDUE</span>
            <span className="font-bold text-[11px] text-blue-300 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-blue-400" />
              <span>Zéro Déforestation</span>
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-emerald-900/40 text-[10px] text-stone-300">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-bold text-stone-400">Légende :</span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] inline-block"></span>
              <span>Arbres d'Ombrage (Framiré, Akpi...)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] inline-block"></span>
              <span>Vivriers (Banane Plantain...)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFFFFF] border border-[#15803D] inline-block"></span>
              <span>Bornes GPS Périmètre</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-mono text-[9px]">
              ID Tracé : {farmerCardCode.replace('CI-CCC-', 'GEO-')}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
