import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapPin, Filter, X, List, Map as MapIcon } from 'lucide-react';
import { useWaste } from '../contexts/WasteContext';
import { CATEGORIES, STATUS_CONFIG, getCategoryConfig, formatDate } from '../services/reportsService';
import StatusBadge from '../components/StatusBadge';

// Dynamically import Leaflet to avoid SSR issues
let L;

function PopupContent({ report }) {
  const cat = getCategoryConfig(report.category);
  const status = STATUS_CONFIG[report.status] || STATUS_CONFIG.pending;
  return `
    <div style="min-width:200px;padding:4px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        <span style="font-size:20px">${cat.emoji}</span>
        <div>
          <p style="font-family:Syne,sans-serif;font-weight:700;font-size:13px;color:#1a1a1a;margin:0">${report.category || 'Issue'}</p>
          <span style="display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:600;padding:2px 8px;border-radius:99px;background:${status.bg};color:${status.color}">
            <span style="width:6px;height:6px;border-radius:50%;background:${status.dot};display:inline-block"></span>
            ${status.label}
          </span>
        </div>
      </div>
      <p style="font-family:Syne,sans-serif;font-size:12px;color:#666;margin:0 0 6px">${report.description?.slice(0, 100) || 'No description.'}${report.description?.length > 100 ? '…' : ''}</p>
      <p style="font-family:Syne,sans-serif;font-size:11px;color:#999;margin:0;display:flex;align-items:center;gap:4px">
        📍 ${report.location}
      </p>
      <p style="font-family:Syne,sans-serif;font-size:10px;color:#bbb;margin:4px 0 0">
        ${formatDate(report.createdAt)}
      </p>
    </div>
  `;
}

function createMarkerIcon(cat, L) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:36px;height:36px;border-radius:50% 50% 50% 0;
      background:${cat.color};
      transform:rotate(-45deg);
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 4px 12px ${cat.color}55;
      border:2px solid white;
    ">
      <span style="transform:rotate(45deg);font-size:14px">${cat.emoji}</span>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -38],
  });
}

export default function MapView() {
  const { reports } = useWaste();
  const [searchParams] = useSearchParams();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showFilter, setShowFilter] = useState(false);
  const [showList, setShowList] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  const filteredReports = reports.filter(r => {
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    if (filterCategory !== 'all') {
      const cat = getCategoryConfig(r.category);
      if (cat.id !== filterCategory) return false;
    }
    return r.lat && r.lng;
  });

  useEffect(() => {
    async function initMap() {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      L = (await import('leaflet')).default;

      const lat = parseFloat(searchParams.get('lat')) || 5.5600;
      const lng = parseFloat(searchParams.get('lng')) || -0.2057;

      const map = L.map(mapRef.current, { zoomControl: false }).setView([lat, lng], 12);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CARTO',
        subdomains: 'abcd',
        maxZoom: 20,
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      setMapReady(true);
    }
    initMap();
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !L) return;
    const map = mapInstanceRef.current;

    // Remove old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    filteredReports.forEach(report => {
      const cat = getCategoryConfig(report.category);
      const marker = L.marker([report.lat, report.lng], { icon: createMarkerIcon(cat, L) })
        .addTo(map)
        .bindPopup(PopupContent({ report }), { maxWidth: 260 });
      markersRef.current.push(marker);
    });
  }, [mapReady, filteredReports]);

  const flyToReport = (report) => {
    if (!mapInstanceRef.current || !report.lat) return;
    mapInstanceRef.current.flyTo([report.lat, report.lng], 15, { duration: 1 });
    const marker = markersRef.current[filteredReports.findIndex(r => r.id === report.id)];
    if (marker) marker.openPopup();
    setShowList(false);
  };

  return (
    <div className="relative h-[calc(100vh-64px)] overflow-hidden">
      {/* Map container */}
      <div ref={mapRef} className="absolute inset-0 z-0" />

      {/* Top controls */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center gap-2">
        <div className="flex-1 bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-2.5 flex items-center gap-2">
          <MapPin size={16} className="text-eco-500 flex-shrink-0" />
          <span className="text-sm text-gray-600 font-medium truncate">
            {filteredReports.length} issue{filteredReports.length !== 1 ? 's' : ''} shown
            {filterStatus !== 'all' || filterCategory !== 'all' ? ' (filtered)' : ''}
          </span>
        </div>
        <button
          onClick={() => setShowFilter(f => !f)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border transition-all ${showFilter ? 'bg-eco-500 border-eco-500 text-white' : 'bg-white border-gray-100 text-gray-600'}`}
        >
          <Filter size={16} />
        </button>
        <button
          onClick={() => setShowList(l => !l)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border transition-all ${showList ? 'bg-eco-500 border-eco-500 text-white' : 'bg-white border-gray-100 text-gray-600'}`}
        >
          <List size={16} />
        </button>
      </div>

      {/* Filter panel */}
      {showFilter && (
        <div className="absolute top-20 left-4 right-4 z-10 bg-white rounded-2xl shadow-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold text-sm text-gray-800">Filter Reports</h3>
            <button onClick={() => setShowFilter(false)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
          </div>
          <div className="mb-3">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Status</p>
            <div className="flex flex-wrap gap-2">
              {['all', 'pending', 'verified', 'resolved'].map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${filterStatus === s ? 'bg-eco-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Category</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setFilterCategory('all')} className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${filterCategory === 'all' ? 'bg-eco-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>All</button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(cat.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${filterCategory === cat.id ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  style={filterCategory === cat.id ? { backgroundColor: cat.color } : {}}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>
          {(filterStatus !== 'all' || filterCategory !== 'all') && (
            <button onClick={() => { setFilterStatus('all'); setFilterCategory('all'); }} className="mt-3 text-xs text-red-500 font-medium hover:text-red-600">Clear filters</button>
          )}
        </div>
      )}

      {/* List panel */}
      {showList && (
        <div className="absolute top-20 right-4 z-10 w-72 max-h-96 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
            <h3 className="font-display font-bold text-sm text-gray-800">{filteredReports.length} Reports</h3>
            <button onClick={() => setShowList(false)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {filteredReports.length === 0 && (
              <p className="text-center text-gray-400 text-xs py-6">No reports match your filters.</p>
            )}
            {filteredReports.map(report => {
              const cat = getCategoryConfig(report.category);
              return (
                <button
                  key={report.id}
                  onClick={() => flyToReport(report)}
                  className="w-full text-left p-3 rounded-xl hover:bg-gray-50 transition-colors flex items-start gap-2 group"
                >
                  <span className="text-lg flex-shrink-0">{cat.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-gray-800 group-hover:text-eco-600 transition-colors truncate">{report.category}</p>
                    <p className="text-xs text-gray-400 truncate">{report.location}</p>
                    <StatusBadge status={report.status} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-6 left-4 z-10 bg-white rounded-xl shadow-lg border border-gray-100 p-3">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Legend</p>
        <div className="space-y-1">
          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
            <div key={key} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: config.dot }} />
              <span className="text-xs text-gray-600">{config.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
