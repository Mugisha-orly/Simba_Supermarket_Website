import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SIMBA_BRANCHES, distanceKm } from '../data/branches';

// ── Fix Leaflet marker icons broken by bundlers ───────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ── Custom map icons ──────────────────────────────────────────────────────────
const branchIcon = (isSelected) =>
  L.divIcon({
    className: '',
    iconSize:    [32, 40],
    iconAnchor:  [16, 40],
    popupAnchor: [0, -42],
    html: `
      <div style="
        width:32px; height:40px; position:relative; display:flex;
        flex-direction:column; align-items:center;
      ">
        <div style="
          width:32px; height:32px; border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          background:${isSelected ? '#FF5722' : '#1A1A2E'};
          border:3px solid white;
          box-shadow:0 3px 10px rgba(0,0,0,${isSelected ? '0.45' : '0.3'});
          display:flex; align-items:center; justify-content:center;
          transition:background 0.2s;
        ">
          <span style="
            transform:rotate(45deg);
            font-size:13px; font-weight:900; color:white;
            font-family:Arial,sans-serif;
          ">S</span>
        </div>
      </div>`,
  });

const userIcon = () =>
  L.divIcon({
    className: '',
    iconSize:   [22, 22],
    iconAnchor: [11, 11],
    html: `
      <div style="
        width:22px; height:22px; border-radius:50%;
        background:#3B82F6;
        border:3px solid white;
        box-shadow:0 0 0 5px rgba(59,130,246,0.25), 0 2px 8px rgba(0,0,0,0.3);
      "></div>`,
  });

// ── Auto-fly when userPos or selection changes ────────────────────────────────
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom, { duration: 1 });
  }, [center, zoom, map]);
  return null;
}

// ── Main component ────────────────────────────────────────────────────────────
const BranchMap = ({ selectedBranch, onSelectBranch }) => {
  const [userPos, setUserPos] = useState(null);
  const [geoError, setGeoError] = useState('');
  const [locating, setLocating] = useState(true);
  const [mapCenter, setMapCenter] = useState([-1.9441, 30.0619]); // Kigali default
  const [mapZoom, setMapZoom] = useState(12);

  // Request geolocation once on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const pos = [coords.latitude, coords.longitude];
        setUserPos(pos);
        setMapCenter(pos);
        setMapZoom(13);
        setLocating(false);
      },
      (err) => {
        setGeoError('Location access denied — showing all Simba branches.');
        setLocating(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  }, []);

  // When a branch is selected from the map, fly to it
  const handleSelectBranch = useCallback((branch) => {
    onSelectBranch(branch);
    setMapCenter([branch.lat, branch.lng]);
    setMapZoom(15);
  }, [onSelectBranch]);

  // Sort branches by distance to user (if location known)
  const branchesWithDist = SIMBA_BRANCHES.map(b => ({
    ...b,
    distKm: userPos ? distanceKm(userPos[0], userPos[1], b.lat, b.lng) : null,
  })).sort((a, b) => (a.distKm ?? Infinity) - (b.distKm ?? Infinity));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* Status bar */}
      <div style={{
        padding: '8px 12px',
        background: locating ? '#EFF6FF' : geoError ? '#FFF3EE' : '#F0FDF4',
        borderRadius: '10px 10px 0 0',
        fontSize: 12,
        fontWeight: 600,
        color: locating ? '#3B82F6' : geoError ? '#FF5722' : '#16A34A',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}>
        {locating ? (
          <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span> Detecting your location…</>
        ) : geoError ? (
          <><span>⚠</span> {geoError}</>
        ) : (
          <><span>●</span> Location found — showing nearest branches</>
        )}
      </div>

      {/* Map */}
      <div style={{ height: 240, borderRadius: '0 0 10px 10px', overflow: 'hidden', border: '1.5px solid #FFE0B2', borderTop: 'none' }}>
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController center={mapCenter} zoom={mapZoom} />

          {/* User location marker */}
          {userPos && (
            <Marker position={userPos} icon={userIcon()}>
              <Popup>
                <div style={{ fontWeight: 700, color: '#3B82F6', fontSize: 13 }}>
                  📍 You are here
                </div>
              </Popup>
            </Marker>
          )}

          {/* Branch markers */}
          {SIMBA_BRANCHES.map(branch => {
            const isSelected = selectedBranch?.id === branch.id;
            const dist = userPos
              ? distanceKm(userPos[0], userPos[1], branch.lat, branch.lng)
              : null;
            return (
              <Marker
                key={branch.id}
                position={[branch.lat, branch.lng]}
                icon={branchIcon(isSelected)}
                eventHandlers={{ click: () => handleSelectBranch(branch) }}
              >
                <Popup>
                  <div style={{ minWidth: 160 }}>
                    <div style={{ fontWeight: 800, color: '#1A1A2E', fontSize: 13, marginBottom: 4 }}>
                      {branch.name}
                    </div>
                    {dist !== null && (
                      <div style={{ fontSize: 12, color: '#FF5722', fontWeight: 700, marginBottom: 6 }}>
                        {dist < 1
                          ? `${Math.round(dist * 1000)} m away`
                          : `${dist.toFixed(1)} km away`}
                      </div>
                    )}
                    <button
                      onClick={() => handleSelectBranch(branch)}
                      style={{
                        background: isSelected ? '#FF5722' : '#1A1A2E',
                        color: 'white', border: 'none', borderRadius: 6,
                        padding: '5px 10px', fontSize: 11, fontWeight: 700,
                        cursor: 'pointer', width: '100%',
                      }}
                    >
                      {isSelected ? '✓ Selected' : 'Select this branch'}
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Nearest branches list */}
      <div style={{ marginTop: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
          {userPos ? 'Nearest branches' : 'All branches'}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 160, overflowY: 'auto' }}>
          {branchesWithDist.map(branch => {
            const isSelected = selectedBranch?.id === branch.id;
            return (
              <button
                key={branch.id}
                onClick={() => handleSelectBranch(branch)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: 9,
                  border: `1.5px solid ${isSelected ? '#FF5722' : '#F0F0F5'}`,
                  background: isSelected ? '#FFF3EE' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: isSelected ? '#FF5722' : '#ccc',
                    flexShrink: 0,
                  }} />
                  <span style={{ fontSize: 12, fontWeight: isSelected ? 700 : 600, color: isSelected ? '#FF5722' : '#1A1A2E' }}>
                    {branch.name}
                  </span>
                </div>
                {branch.distKm !== null && (
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#aaa', whiteSpace: 'nowrap', marginLeft: 8 }}>
                    {branch.distKm < 1
                      ? `${Math.round(branch.distKm * 1000)} m`
                      : `${branch.distKm.toFixed(1)} km`}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BranchMap;
