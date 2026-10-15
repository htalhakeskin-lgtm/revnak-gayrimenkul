"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { circlePolygon, MAP_LOCALE, MAP_STYLE } from "./map-config";
import { loadMapLibre } from "./load-maplibre";

/**
 * İlan konum haritası. Görünür alana girince yüklenir (MapLibre ~250 KB yalnızca gerektiğinde).
 * Yaklaşık konumda tam nokta yerine ~350 m yarıçaplı alan gösterilir.
 */
export function MiniMap({
  lat,
  lng,
  approximate,
  label,
}: {
  lat: number;
  lng: number;
  approximate: boolean;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !ref.current) return;
    let cancelled = false;
    let map: import("maplibre-gl").Map | undefined;

    loadMapLibre()
      .then((ml) => {
        if (cancelled || !ref.current) return;
        map = new ml.Map({
          container: ref.current,
          style: MAP_STYLE,
          center: [lng, lat],
          zoom: approximate ? 14 : 15.5,
          cooperativeGestures: true,
          attributionControl: { compact: true },
          locale: MAP_LOCALE,
        });
        map.addControl(new ml.NavigationControl({ showCompass: false }), "top-right");
        map.on("error", () => undefined);
        map.on("load", () => {
          if (!map) return;
          if (approximate) {
            map.addSource("area", { type: "geojson", data: circlePolygon(lng, lat, 350) });
            map.addLayer({ id: "area-fill", type: "fill", source: "area", paint: { "fill-color": "#c5a46d", "fill-opacity": 0.18 } });
            map.addLayer({
              id: "area-line",
              type: "line",
              source: "area",
              paint: { "line-color": "#c5a46d", "line-width": 1.5, "line-dasharray": [2, 2] },
            });
          } else {
            const pin = document.createElement("div");
            pin.className = "size-5 rounded-full border-4 border-night bg-gold shadow-lg";
            new ml.Marker({ element: pin }).setLngLat([lng, lat]).addTo(map);
          }
        });
      })
      .catch(() => setFailed(true));

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [visible, lat, lng, approximate]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-night-raised">
      {/* MapLibre kapsayıcıya katmansız CSS ile position: relative verir; konumlandırma dış sarmalayıcıda */}
      <div className="absolute inset-0">
        <div ref={ref} className="h-full w-full" data-lenis-prevent role="region" aria-label={`Harita: ${label}`} />
      </div>
      {!visible || failed ? (
        <div className="absolute inset-0 grid place-items-center text-sm text-muted">
          <span className="flex items-center gap-2">
            <MapPin size={16} /> {failed ? "Harita yüklenemedi" : "Harita yükleniyor…"}
          </span>
        </div>
      ) : null}
    </div>
  );
}
