"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { getBranchCoordinates, calculateDistanceKm, calculateDeliveryMins } from "@/utils/location";

export type CheckoutMapProps = {
  distance?: number | null;
  userLoc?: { latitude: number; longitude: number } | null;
  branches?: any[];
  closestBranchId?: number | null;
  branchLat?: number | string | null;
  branchLng?: number | string | null;
  branchName?: string | null;
  userLat?: number | string | null;
  userLng?: number | string | null;
  riderLat?: number | string | null;
  riderLng?: number | string | null;
  distanceText?: string | null;
  userAvatar?: string | null;
};

export default function CheckoutMap({
  distance: propDistance,
  userLoc: propUserLoc,
  branches: propBranches,
  closestBranchId,
  branchLat,
  branchLng,
  branchName,
  userLat,
  userLng,
  distanceText: propDistanceText,
}: CheckoutMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const boundsRef = useRef<mapboxgl.LngLatBounds | null>(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [calculatedDistanceStr, setCalculatedDistanceStr] = useState<string | null>(null);
  const [calculatedTimeStr, setCalculatedTimeStr] = useState<string | null>(null);

  // Resolve user location (delivery address coordinates)
  const userLoc = React.useMemo(() => {
    if (propUserLoc) return propUserLoc;
    if (userLat != null && userLng != null) {
      const lat = Number(userLat);
      const lng = Number(userLng);
      if (!isNaN(lat) && !isNaN(lng)) return { latitude: lat, longitude: lng };
    }
    return null;
  }, [propUserLoc, userLat, userLng]);

  // Resolve branches — fully dynamic from props, no hardcoded fallback names
  const branches = React.useMemo(() => {
    if (propBranches && propBranches.length > 0) return propBranches;
    if (branchLat != null && branchLng != null) {
      // Use the branchName prop if provided; fall back to a generic label
      return [{ id: 1, name: branchName || "Restaurant Branch", latitude: branchLat, longitude: branchLng }];
    }
    return [];
  }, [propBranches, branchLat, branchLng, branchName]);

  // Initialize Map with Google Maps Dark Theme aesthetics
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
    mapboxgl.accessToken = token;

    let initialCenter: [number, number] = [0.0538, 51.4554]; // Default Eltham London
    if (userLoc) {
      initialCenter = [userLoc.longitude, userLoc.latitude];
    } else if (branches.length > 0) {
      const bCoords = getBranchCoordinates(branches[0]);
      if (bCoords) initialCenter = [bCoords.longitude, bCoords.latitude];
    }

    // Carto dark raster fallback
    const cartoDarkRasterStyle = {
      version: 8,
      sources: {
        "carto-dark": {
          type: "raster",
          tiles: [
            "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
            "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
            "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
            "https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
          ],
          tileSize: 256,
          attribution: "&copy; OpenStreetMap &copy; CARTO",
        },
      },
      layers: [
        {
          id: "carto-dark-layer",
          type: "raster",
          source: "carto-dark",
          minzoom: 0,
          maxzoom: 20,
        },
      ],
    };

    // Use mapbox dark-v11 vector style if token exists, fallback to raster
    const mapStyle = token ? "mapbox://styles/mapbox/dark-v11" : (cartoDarkRasterStyle as any);

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: mapStyle,
      center: initialCenter,
      zoom: 13,
      attributionControl: false,
    });

    mapRef.current = map;

    // Fallback if vector style fails to load
    map.on("error", (e) => {
      if (e?.error?.message?.includes("style")) {
        try {
          map.setStyle(cartoDarkRasterStyle as any);
        } catch { }
      }
    });

    map.on("load", () => {
      setMapLoaded(true);
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers, route lines, and fit bounds whenever location or branch changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const bounds = new mapboxgl.LngLatBounds();
    let hasPoints = false;

    const activeBranch = branches.find((b) => b.id === closestBranchId) || branches[0];
    const bCoords = activeBranch ? getBranchCoordinates(activeBranch) : null;

    // Calculate distance & time if userLoc exists
    if (userLoc && bCoords) {
      const km = calculateDistanceKm(bCoords.latitude, bCoords.longitude, userLoc.latitude, userLoc.longitude);
      if (km != null) {
        const mins = calculateDeliveryMins(km);
        setCalculatedDistanceStr(`${km} km`);
        setCalculatedTimeStr(`${mins} mins`);
      }
    } else {
      setCalculatedDistanceStr(null);
      setCalculatedTimeStr(null);
    }

    // 1. Add Branch Markers (Google Maps Dark Theme Style Pin)
    branches.forEach((b, i) => {
      const branchCoords = getBranchCoordinates(b);
      if (!branchCoords) return; // skip branches with no valid lat/lng from API

      const isClosest = b.id === closestBranchId || i === 0;

      let branchDistLabel = "";
      if (userLoc) {
        const km = calculateDistanceKm(branchCoords.latitude, branchCoords.longitude, userLoc.latitude, userLoc.longitude);
        if (km != null) {
          const mins = calculateDeliveryMins(km);
          branchDistLabel = `${km} km • ${mins}m`;
        }
      }

      const el = document.createElement("div");
      el.className = "flex flex-col items-center group cursor-pointer z-10 transition-transform duration-300 hover:scale-110";
      el.innerHTML = `
        <div class="bg-[#202124]/95 border ${isClosest ? "border-[#F9671A] shadow-[0_0_15px_rgba(249,103,26,0.5)]" : "border-zinc-700"} text-white px-2.5 py-1.5 rounded-xl text-[11px] font-bold mb-1 shadow-2xl backdrop-blur-md flex flex-col items-center max-w-[170px] text-center">
          <div class="flex items-center gap-1.5 w-full justify-center">
            <span class="w-2 h-2 rounded-full flex-shrink-0 ${isClosest ? "bg-[#F9671A] animate-ping" : "bg-zinc-400"}"></span>
            <span class="truncate font-bold text-white text-[11px]">${b.name || `Branch ${i + 1}`}</span>
          </div>
          ${branchDistLabel ? `<div class="text-[#F9671A] font-semibold text-[10px] mt-0.5">${branchDistLabel}</div>` : ""}
        </div>
        <div class="relative flex items-center justify-center">
          <div class="w-8 h-8 rounded-full ${isClosest ? "bg-gradient-to-br from-[#F9671A] to-[#d84e09]" : "bg-zinc-800"} flex items-center justify-center text-white font-bold text-xs border-2 border-[#202124] shadow-xl">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <div class="absolute -bottom-1 w-2 h-2 bg-[#F9671A] rotate-45"></div>
        </div>
      `;

      const marker = new mapboxgl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([branchCoords.longitude, branchCoords.latitude])
        .addTo(map);

      markersRef.current.push(marker);
      bounds.extend([branchCoords.longitude, branchCoords.latitude]);
      hasPoints = true;
    });

    // 2. Add Delivery Address Marker (Google Maps Destination Dark Pin)
    if (userLoc) {
      const el = document.createElement("div");
      el.className = "flex flex-col items-center z-20 transition-transform duration-300 hover:scale-110";
      el.innerHTML = `
        <div class="bg-[#202124]/95 border border-emerald-500 text-white px-3 py-1.5 rounded-xl text-[11px] font-bold mb-1 shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-md flex items-center gap-1.5 whitespace-nowrap">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <div>
            <div class="text-white text-[11px] font-bold">Delivery Address</div>
            <div class="text-emerald-400 text-[9px] font-medium">Selected Location</div>
          </div>
        </div>
        <div class="relative flex items-center justify-center w-9 h-9">
          <div class="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-40"></div>
          <div class="relative w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center border-2 border-[#202124] shadow-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <div class="absolute -bottom-1 w-2.5 h-2.5 bg-emerald-600 rotate-45"></div>
        </div>
      `;

      const userMarker = new mapboxgl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([userLoc.longitude, userLoc.latitude])
        .addTo(map);

      markersRef.current.push(userMarker);
      bounds.extend([userLoc.longitude, userLoc.latitude]);
      hasPoints = true;
    }

    // 3. Draw Double-Layered Route Line (Google Maps Navigation Style)
    if (userLoc && bCoords) {
      const routeGeoJSON: GeoJSON.Feature<GeoJSON.LineString> = {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [
            [bCoords.longitude, bCoords.latitude],
            [userLoc.longitude, userLoc.latitude],
          ],
        },
      };

      const updateRouteLayers = () => {
        if (map.getSource("route")) {
          (map.getSource("route") as mapboxgl.GeoJSONSource).setData(routeGeoJSON);
        } else {
          map.addSource("route", {
            type: "geojson",
            data: routeGeoJSON,
          });

          // Outer dark casing line
          map.addLayer({
            id: "route-casing",
            type: "line",
            source: "route",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#0b0f19",
              "line-width": 8,
              "line-opacity": 0.8,
            },
          });

          // Inner Google-style Navigation line
          map.addLayer({
            id: "route-line",
            type: "line",
            source: "route",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#F9671A",
              "line-width": 4.5,
            },
          });
        }
      };

      if (map.isStyleLoaded()) {
        updateRouteLayers();
      } else {
        map.once("style.load", updateRouteLayers);
      }
    }

    // Save bounds and fit cleanly
    if (hasPoints) {
      boundsRef.current = bounds;
      map.fitBounds(bounds, {
        padding: { top: 60, bottom: 60, left: 60, right: 60 },
        maxZoom: 15,
        duration: 900,
      });
    }
  }, [userLoc, branches, closestBranchId]);

  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();
  const handleRecenter = () => {
    if (mapRef.current && boundsRef.current) {
      mapRef.current.fitBounds(boundsRef.current, {
        padding: { top: 60, bottom: 60, left: 60, right: 60 },
        maxZoom: 15,
        duration: 800,
      });
    }
  };

  const displayDistance = propDistanceText || (calculatedDistanceStr ? `${calculatedDistanceStr} (${calculatedTimeStr || ""})` : null);

  const activeBranch = branches.find((b) => b.id === closestBranchId) || branches[0];
  const activeBranchName = activeBranch?.name || branchName || null;

  return (
    <div className="relative w-full h-full rounded-[16px] overflow-hidden bg-[#18181a] border border-white/10 shadow-2xl group">
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Google Maps Header Badge Overlay */}
      <div className="absolute top-3 left-3 z-30 pointer-events-none max-w-[calc(100%-90px)]">
        <div className="bg-[#202124]/90 backdrop-blur-md border border-white/10 text-white px-3 py-2 rounded-xl shadow-2xl flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#F9671A]/20 border border-[#F9671A]/40 flex items-center justify-center text-[#F9671A] flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" /><circle cx="12" cy="10" r="3" /></svg>
          </div>
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-wider font-extrabold text-[#F9671A] flex items-center gap-1 truncate">
              <span className="truncate">{activeBranchName ? `📍 ${activeBranchName}` : "Google Dark Route"}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"></span>
            </div>
            <div className="text-[12px] font-bold text-white leading-tight truncate">
              {displayDistance || "Delivery Route"}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Google Maps Custom Controls (Zoom + Recenter) */}
      <div className="absolute top-3 right-3 z-30 flex flex-col gap-1.5">
        <button
          onClick={handleZoomIn}
          type="button"
          title="Zoom In"
          className="w-8 h-8 rounded-lg bg-[#202124]/90 hover:bg-[#2c2d30] border border-white/10 text-white flex items-center justify-center font-bold text-base shadow-xl backdrop-blur-md transition-all active:scale-95 cursor-pointer"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          type="button"
          title="Zoom Out"
          className="w-8 h-8 rounded-lg bg-[#202124]/90 hover:bg-[#2c2d30] border border-white/10 text-white flex items-center justify-center font-bold text-base shadow-xl backdrop-blur-md transition-all active:scale-95 cursor-pointer"
        >
          −
        </button>
        <button
          onClick={handleRecenter}
          type="button"
          title="Recenter Map"
          className="w-8 h-8 rounded-lg bg-[#202124]/90 hover:bg-[#2c2d30] border border-[#F9671A]/40 text-[#F9671A] flex items-center justify-center shadow-xl backdrop-blur-md transition-all active:scale-95 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /></svg>
        </button>
      </div>
    </div>
  );
}
