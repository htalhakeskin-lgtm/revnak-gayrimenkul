"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import type { GeoJSONSource, Map as MlMap, Popup as MlPopup } from "maplibre-gl";
import { List, Loader2, Map as MapIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Photo } from "@/components/ui/photo";
import { cn, unsplash } from "@/lib/utils";
import { MAP_LOCALE, MAP_STYLE } from "./map-config";
import { loadMapLibre } from "./load-maplibre";

export interface MapListing {
  id: string;
  slug: string;
  no: string;
  title: string;
  transaction: "satilik" | "kiralik";
  price: number;
  priceLabel: string;
  priceShort: string;
  lat: number;
  lng: number;
  image: string;
  rooms: string;
  netM2: number;
  regionLabel: string;
}

type Mode = "tumu" | "satilik" | "kiralik";

const AREAS = {
  istanbul: { label: "İstanbul", bounds: [[28.95, 40.95], [29.16, 41.22]] as [[number, number], [number, number]] },
  bodrum: { label: "Bodrum", bounds: [[27.27, 37.08], [27.33, 37.12]] as [[number, number], [number, number]] },
};

function toGeoJSON(items: MapListing[]) {
  return {
    type: "FeatureCollection" as const,
    features: items.map((l) => ({
      type: "Feature" as const,
      id: Number(l.id.replace(/\D/g, "")),
      properties: { id: l.id, price: l.priceShort },
      geometry: { type: "Point" as const, coordinates: [l.lng, l.lat] },
    })),
  };
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);
}

/**
 * Harita ile arama (M02 / İP-18): kümeleme, yaklaşık konumlar, harita sınırına göre liste.
 */
export function MapSearch({ listings }: { listings: MapListing[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MlMap | null>(null);
  const popupRef = useRef<MlPopup | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [mode, setMode] = useState<Mode>("tumu");
  const [visibleIds, setVisibleIds] = useState<Set<string> | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"harita" | "liste">("harita");

  const filtered = useMemo(
    () => (mode === "tumu" ? listings : listings.filter((l) => l.transaction === mode)),
    [listings, mode],
  );
  const byId = useMemo(() => new Map(listings.map((l) => [l.id, l])), [listings]);
  const inView = visibleIds ? filtered.filter((l) => visibleIds.has(l.id)) : filtered;

  // Haritayı kur
  useEffect(() => {
    let cancelled = false;
    const update = () => {
      const map = mapRef.current;
      if (!map) return;
      const b = map.getBounds();
      setVisibleIds(new Set(listings.filter((l) => b.contains([l.lng, l.lat])).map((l) => l.id)));
    };

    loadMapLibre()
      .then((ml) => {
        if (cancelled || !containerRef.current) return;
        const map = new ml.Map({
          container: containerRef.current,
          style: MAP_STYLE,
          bounds: AREAS.istanbul.bounds,
          fitBoundsOptions: { padding: 40 },
          attributionControl: { compact: true },
          locale: MAP_LOCALE,
        });
        mapRef.current = map;
        popupRef.current = new ml.Popup({ closeButton: true, maxWidth: "280px", offset: 14 });
        map.addControl(new ml.NavigationControl({ showCompass: false }), "top-right");

        map.on("load", () => {
          map.addSource("listings", {
            type: "geojson",
            data: toGeoJSON(listings),
            cluster: true,
            clusterRadius: 46,
            clusterMaxZoom: 14,
          });
          map.addLayer({
            id: "clusters",
            type: "circle",
            source: "listings",
            filter: ["has", "point_count"],
            paint: {
              "circle-color": "#c5a46d",
              "circle-opacity": 0.92,
              "circle-radius": ["step", ["get", "point_count"], 18, 5, 24, 10, 30],
              "circle-stroke-width": 6,
              "circle-stroke-color": "rgba(197,164,109,0.25)",
            },
          });
          map.addLayer({
            id: "cluster-count",
            type: "symbol",
            source: "listings",
            filter: ["has", "point_count"],
            layout: { "text-field": ["get", "point_count_abbreviated"], "text-size": 13, "text-font": ["Noto Sans Bold"] },
            paint: { "text-color": "#0e1114" },
          });
          map.addLayer({
            id: "points",
            type: "circle",
            source: "listings",
            filter: ["!", ["has", "point_count"]],
            paint: {
              // MapPinDrop: noktalar sıfırdan büyüyerek belirir
              "circle-radius": 0,
              "circle-radius-transition": { duration: 700, delay: 150 },
              "circle-color": ["case", ["boolean", ["feature-state", "hover"], false], "#f5f1ea", "#c5a46d"],
              "circle-stroke-width": 3,
              "circle-stroke-color": "#0e1114",
            },
          });
          map.addLayer({
            id: "point-price",
            type: "symbol",
            source: "listings",
            filter: ["!", ["has", "point_count"]],
            layout: {
              "text-field": ["get", "price"],
              "text-size": 12,
              "text-offset": [0, -1.6],
              "text-font": ["Noto Sans Bold"],
              "text-allow-overlap": false,
            },
            paint: { "text-color": "#f5f1ea", "text-halo-color": "#0e1114", "text-halo-width": 1.6 },
          });
          requestAnimationFrame(() => map.setPaintProperty("points", "circle-radius", 8));

          map.on("click", "clusters", async (e) => {
            const feature = e.features?.[0];
            if (!feature) return;
            const source = map.getSource("listings") as GeoJSONSource;
            const zoom = await source.getClusterExpansionZoom(feature.properties.cluster_id as number);
            map.easeTo({ center: (feature.geometry as GeoJSON.Point).coordinates as [number, number], zoom });
          });

          map.on("click", "points", (e) => {
            const feature = e.features?.[0];
            const l = feature ? byId.get(String(feature.properties.id)) : undefined;
            if (!l || !popupRef.current) return;
            popupRef.current
              .setLngLat([l.lng, l.lat])
              .setHTML(
                `<a href="/ilan/${encodeURIComponent(l.slug)}" style="display:block;color:inherit;text-decoration:none">
                  <img src="${unsplash(l.image)}?w=560&q=70&auto=format&fit=crop" alt="" style="width:100%;height:140px;object-fit:cover;display:block"/>
                  <div style="padding:12px 14px 14px">
                    <div style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#c5a46d;font-weight:600">${escapeHtml(l.regionLabel)}</div>
                    <div style="font-family:var(--font-serif);font-size:17px;line-height:1.25;margin-top:4px">${escapeHtml(l.title)}</div>
                    <div style="margin-top:8px;font-weight:700">${escapeHtml(l.priceLabel)}</div>
                  </div>
                </a>`,
              )
              .addTo(map);
          });

          let hoverId: number | string | undefined;
          map.on("mousemove", "points", (e) => {
            map.getCanvas().style.cursor = "pointer";
            const f = e.features?.[0];
            if (!f) return;
            if (hoverId !== undefined) map.setFeatureState({ source: "listings", id: hoverId }, { hover: false });
            hoverId = f.id;
            if (hoverId !== undefined) map.setFeatureState({ source: "listings", id: hoverId }, { hover: true });
            setHovered(String(f.properties.id));
          });
          map.on("mouseleave", "points", () => {
            map.getCanvas().style.cursor = "";
            if (hoverId !== undefined) map.setFeatureState({ source: "listings", id: hoverId }, { hover: false });
            hoverId = undefined;
            setHovered(null);
          });
          map.on("mouseenter", "clusters", () => (map.getCanvas().style.cursor = "pointer"));
          map.on("mouseleave", "clusters", () => (map.getCanvas().style.cursor = ""));
          map.on("moveend", update);
          update();
          setReady(true);
        });
      })
      .catch(() => setFailed(true));

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [listings, byId]);

  // İşlem tipi filtresi haritaya yansısın
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    (map.getSource("listings") as GeoJSONSource | undefined)?.setData(toGeoJSON(filtered));
    popupRef.current?.remove();
  }, [filtered, ready]);

  // Listede üzerine gelinen ilanı haritada vurgula
  function highlight(id: string | null) {
    const map = mapRef.current;
    setHovered(id);
    if (!map || !ready) return;
    for (const l of filtered) {
      map.setFeatureState({ source: "listings", id: Number(l.id.replace(/\D/g, "")) }, { hover: l.id === id });
    }
  }

  function flyTo(area: keyof typeof AREAS) {
    mapRef.current?.fitBounds(AREAS[area].bounds, { padding: 40, duration: 1600 });
  }

  return (
    <div className="relative grid h-[calc(100svh-72px)] lg:grid-cols-[26rem_1fr]">
      {/* Liste */}
      <aside
        className={cn(
          "tone-dark z-10 flex min-h-0 flex-col border-r border-night-line bg-night",
          mobileView === "harita" ? "max-lg:hidden" : "",
        )}
      >
        <div className="space-y-4 border-b border-night-line p-5">
          <div className="inline-flex rounded-full border border-night-line p-1" role="group" aria-label="İşlem tipi">
            {(
              [
                ["tumu", "Tümü"],
                ["satilik", "Satılık"],
                ["kiralik", "Kiralık"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                aria-pressed={mode === key}
                onClick={() => setMode(key)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
                  mode === key ? "bg-gold text-night" : "text-muted hover:text-ivory",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted" aria-live="polite">
              Haritada <strong className="text-ivory">{inView.length}</strong> ilan
            </p>
            <div className="flex gap-2">
              {(Object.keys(AREAS) as (keyof typeof AREAS)[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => flyTo(key)}
                  className="rounded-full border border-night-line px-3 py-1 text-xs font-semibold text-ivory/80 hover:border-gold hover:text-gold"
                >
                  {AREAS[key].label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <ul className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain p-4" data-lenis-prevent>
          {inView.map((l) => (
            <li key={l.id}>
              <Link
                href={`/ilan/${l.slug}`}
                onMouseEnter={() => highlight(l.id)}
                onMouseLeave={() => highlight(null)}
                onFocus={() => highlight(l.id)}
                onBlur={() => highlight(null)}
                className={cn(
                  "flex gap-4 rounded-[14px] border p-3 transition-colors",
                  hovered === l.id ? "border-gold bg-night-raised" : "border-transparent hover:bg-night-raised",
                )}
              >
                <div className="relative size-24 shrink-0 overflow-hidden rounded-[10px] bg-night-raised">
                  <Photo src={l.image} alt="" fill sizes="96px" className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[0.6875rem] font-semibold tracking-[0.14em] text-gold uppercase">{l.regionLabel}</p>
                  <p className="mt-1 line-clamp-2 font-serif text-[1.0625rem] leading-snug">{l.title}</p>
                  <p className="tabular mt-1.5 text-sm font-semibold">{l.priceLabel}</p>
                  <p className="text-xs text-muted">
                    {l.rooms} · {l.netM2} m² · {l.no}
                  </p>
                </div>
              </Link>
            </li>
          ))}
          {inView.length === 0 ? (
            <li className="p-6 text-center text-sm text-muted">Bu alanda ilan yok. Haritayı kaydırın veya uzaklaştırın.</li>
          ) : null}
        </ul>
      </aside>

      {/* Harita */}
      <div className={cn("relative min-h-0", mobileView === "liste" ? "max-lg:hidden" : "")}>
        {/* MapLibre kapsayıcıya katmansız CSS ile position: relative verir; konumlandırma dış sarmalayıcıda */}
        <div className="absolute inset-0">
          <div ref={containerRef} className="h-full w-full" data-lenis-prevent aria-label="İlan haritası" role="region" />
        </div>
        {!ready ? (
          <div className="absolute inset-0 grid place-items-center bg-night-raised text-sm text-muted">
            {failed ? (
              "Harita yüklenemedi. Lütfen sayfayı yenileyin."
            ) : (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" /> Harita yükleniyor…
              </span>
            )}
          </div>
        ) : null}
        <p className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-night/75 px-3 py-1.5 text-[0.6875rem] text-ivory/80 backdrop-blur-md">
          Konumlar mahremiyet için yaklaşıktır.
        </p>
      </div>

      {/* Mobil görünüm geçişi */}
      <button
        type="button"
        onClick={() => setMobileView((v) => (v === "harita" ? "liste" : "harita"))}
        className="absolute bottom-24 left-1/2 z-20 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-ivory px-5 py-3 text-sm font-semibold text-ink shadow-2xl lg:hidden"
      >
        {mobileView === "harita" ? <List size={16} /> : <MapIcon size={16} />}
        {mobileView === "harita" ? `Liste (${inView.length})` : "Harita"}
      </button>
    </div>
  );
}
