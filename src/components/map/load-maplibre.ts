/** MapLibre'yi yalnızca gerektiğinde yükler ve worker adresini ayarlar (bkz. scripts/copy-maplibre-worker.mjs). */
export async function loadMapLibre() {
  const ml = await import("maplibre-gl");
  ml.setWorkerUrl(`/vendor/maplibre-gl-worker.mjs?v=${ml.getVersion()}`);
  return ml;
}
