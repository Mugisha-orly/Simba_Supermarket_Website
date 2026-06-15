export const SIMBA_BRANCHES = [
  { id: 'centenary',      name: 'Simba Centenary',                lat: -1.9441,  lng: 30.0619 },
  { id: 'gishushu',       name: 'Simba Gishushu',                 lat: -1.9536,  lng: 30.0733 },
  { id: 'kimironko',      name: 'Simba Kimironko',                lat: -1.9415,  lng: 30.1134 },
  { id: 'kicukiro',       name: 'Simba Kicukiro',                 lat: -1.9807,  lng: 30.0843 },
  { id: 'kigali-heights', name: 'Simba Kigali Heights (KH)',      lat: -1.9501,  lng: 30.0926 },
  { id: 'utc',            name: 'Simba UTC (Union Trade Center)', lat: -1.9476,  lng: 30.0604 },
  { id: 'gacuriro',       name: 'Simba Gacuriro (Simba Center)',  lat: -1.9197,  lng: 30.1197 },
  { id: 'gikondo',        name: 'Simba Gikondo',                  lat: -1.9771,  lng: 30.0605 },
  { id: 'sonatube',       name: 'Simba Sonatube',                 lat: -1.9674,  lng: 30.0517 },
  { id: 'kisimenti',      name: 'Simba Kisimenti',                lat: -1.9460,  lng: 30.0631 },
  { id: 'rebero',         name: 'Simba Rebero',                   lat: -1.9956,  lng: 30.0804 },
  { id: 'musanze',        name: 'Simba Musanze',                  lat: -1.4997,  lng: 29.6335 },
];

export const DEFAULT_BRANCH = SIMBA_BRANCHES[0];

/** Haversine distance in km between two lat/lng points */
export function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
