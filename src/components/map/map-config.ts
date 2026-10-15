/** Harita ayarları (K13): OpenFreeMap koyu stil, API anahtarı gerektirmez. */
export const MAP_STYLE = "https://tiles.openfreemap.org/styles/dark";

export const MAP_LOCALE = {
  "CooperativeGesturesHandler.WindowsHelpText": "Yakınlaştırmak için Ctrl tuşuna basılı tutarak kaydırın",
  "CooperativeGesturesHandler.MacHelpText": "Yakınlaştırmak için ⌘ tuşuna basılı tutarak kaydırın",
  "CooperativeGesturesHandler.MobileHelpText": "Haritayı hareket ettirmek için iki parmak kullanın",
  "NavigationControl.ZoomIn": "Yakınlaştır",
  "NavigationControl.ZoomOut": "Uzaklaştır",
};

/** Yaklaşık konum gösterimi için daire poligonu (M01: konum gizliliği) */
export function circlePolygon(lng: number, lat: number, radiusMeters: number, steps = 64) {
  const coords: [number, number][] = [];
  const dLat = radiusMeters / 111_320;
  const dLng = radiusMeters / (111_320 * Math.cos((lat * Math.PI) / 180));
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    coords.push([lng + dLng * Math.cos(t), lat + dLat * Math.sin(t)]);
  }
  return {
    type: "Feature" as const,
    properties: {},
    geometry: { type: "Polygon" as const, coordinates: [coords] },
  };
}
