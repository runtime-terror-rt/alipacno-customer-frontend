"use client";

import React, { useEffect, useRef } from "react";
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
  userLat,
  userLng,
}: CheckoutMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // Resolve user location
  const userLoc = React.useMemo(() => {
    if (propUserLoc) return propUserLoc;
    if (userLat != null && userLng != null) {
      const lat = Number(userLat);
      const lng = Number(userLng);
      if (!isNaN(lat) && !isNaN(lng)) return { latitude: lat, longitude: lng };
    }
    return null;
  }, [propUserLoc, userLat, userLng]);

  // Resolve branches
  const branches = React.useMemo(() => {
    if (propBranches && propBranches.length > 0) return propBranches;
    if (branchLat != null && branchLng != null) {
      return [{ id: 1, name: "Pacino's Branch", latitude: branchLat, longitude: branchLng }];
    }
    return [];
  }, [propBranches, branchLat, branchLng]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
    mapboxgl.accessToken = token;

    // Determine initial center
    let initialCenter: [number, number] = [0.0538, 51.4554]; // London UK default
    if (userLoc) {
      initialCenter = [userLoc.longitude, userLoc.latitude];
    } else if (branches.length > 0) {
      const bCoords = getBranchCoordinates(branches[0]);
      initialCenter = [bCoords.longitude, bCoords.latitude];
    }

    const darkStyle = {
      version: 8,
      sources: {
        "carto-dark": {
          type: "raster",
          tiles: [
            "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
            "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
            "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
            "https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
          ],
          tileSize: 256,
          attribution: "&copy; OpenStreetMap &copy; CARTO"
        }
      },
      layers: [
        {
          id: "carto-dark-layer",
          type: "raster",
          source: "carto-dark",
          minzoom: 0,
          maxzoom: 20
        }
      ]
    };

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: darkStyle as any,
      center: initialCenter,
      zoom: 12,
      attributionControl: false,
    });

    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers, route line, and bounds whenever location/branches change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const bounds = new mapboxgl.LngLatBounds();
    let hasPoints = false;

    // 1. Add Branch Markers
    branches.forEach((b, i) => {
      const bCoords = getBranchCoordinates(b);
      const isClosest = b.id === closestBranchId || i === 0;

      // Compute distance to user if userLoc exists
      let distText = "";
      if (userLoc) {
        const km = calculateDistanceKm(bCoords.latitude, bCoords.longitude, userLoc.latitude, userLoc.longitude);
        if (km != null) {
          const mins = calculateDeliveryMins(km);
          distText = `${km} km (${mins} mins)`;
        }
      }

      // Create custom HTML marker for branch
      const el = document.createElement("div");
      el.className = "flex flex-col items-center group cursor-pointer z-10";
      el.innerHTML = `
        <div class="bg-[#18181a] border ${isClosest ? "border-[#F9671A]" : "border-white/10"} text-white px-2 py-0.5 rounded-md text-[10px] font-bold mb-1 shadow-lg whitespace-nowrap">
          ${b.name || `Branch ${i + 1}`}
          ${distText ? `<span class="text-[#F9671A] ml-1">${distText}</span>` : ""}
        </div>
        <div class="w-7 h-7 rounded-full ${isClosest ? "bg-[#F9671A]" : "bg-zinc-700"} flex items-center justify-center text-white font-bold text-xs border-2 border-black shadow-md">
          ${i + 1}
        </div>
      `;

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([bCoords.longitude, bCoords.latitude])
        .addTo(map);

      markersRef.current.push(marker);
      bounds.extend([bCoords.longitude, bCoords.latitude]);
      hasPoints = true;
    });

    // 2. Add User Location Marker
    if (userLoc) {
      const el = document.createElement("div");
      el.className = "flex flex-col items-center z-20";
      el.innerHTML = `
        <div class="bg-black/90 border border-[#F9671A] text-white px-2.5 py-1 rounded-lg text-[10px] font-bold mb-1 shadow-2xl whitespace-nowrap">
          Delivery Location
          <div class="text-[#F9671A] text-[9px] text-center font-medium">Your Address</div>
        </div>
        <div class="relative flex items-center justify-center w-7 h-7">
          <div class="absolute inset-0 bg-[#F9671A] rounded-full animate-ping opacity-60"></div>
          <div class="relative w-7 h-7 bg-[#F96A1C] rounded-full flex items-center justify-center border-2 border-black shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
        </div>
      `;

      const userMarker = new mapboxgl.Marker({ element: el })
        .setLngLat([userLoc.longitude, userLoc.latitude])
        .addTo(map);

      markersRef.current.push(userMarker);
      bounds.extend([userLoc.longitude, userLoc.latitude]);
      hasPoints = true;
    }

    // 3. Draw Route Line between User and Branches
    if (userLoc && branches.length > 0) {
      const targetBranch = branches.find((b) => b.id === closestBranchId) || branches[0];
      const targetCoords = getBranchCoordinates(targetBranch);

      const routeGeoJSON: GeoJSON.Feature<GeoJSON.LineString> = {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [
            [targetCoords.longitude, targetCoords.latitude],
            [userLoc.longitude, userLoc.latitude],
          ],
        },
      };

      const updateRouteLayer = () => {
        if (map.getSource("route")) {
          (map.getSource("route") as mapboxgl.GeoJSONSource).setData(routeGeoJSON);
        } else {
          map.addSource("route", {
            type: "geojson",
            data: routeGeoJSON,
          });

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
              "line-width": 3.5,
              "line-dasharray": [2, 2],
            },
          });
        }
      };

      if (map.isStyleLoaded()) {
        updateRouteLayer();
      } else {
        map.once("style.load", updateRouteLayer);
      }
    }

    // 4. Fit bounds cleanly if we have points
    if (hasPoints) {
      map.fitBounds(bounds, {
        padding: 45,
        maxZoom: 15,
        duration: 800,
      });
    }
  }, [userLoc, branches, closestBranchId]);

  return (
    <div className="relative w-full h-full rounded-[16px] overflow-hidden bg-[#1E1E20]">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
