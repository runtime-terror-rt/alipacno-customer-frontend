"use client";

import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  PolylineF,
  OverlayViewF,
  OverlayView,
} from "@react-google-maps/api";
import {
  getBranchCoordinates,
  calculateDistanceKm,
  calculateDeliveryMins,
  getDrivingRouteGeometry,
} from "@/utils/location";

export type CheckoutMapProps = {
  distance?: number | null;
  userLoc?: { latitude: number; longitude: number } | null;
  branches?: any[];
  closestBranchId?: number | null;
  selectedBranchId?: number | null;
  onBranchSelect?: (branchId: number) => void;
  branchLat?: number | string | null;
  branchLng?: number | string | null;
  branchName?: string | null;
  userLat?: number | string | null;
  userLng?: number | string | null;
  riderLat?: number | string | null;
  riderLng?: number | string | null;
  riderHeading?: number;
  riderSpeed?: number;
  isLiveWebSocket?: boolean;
  distanceText?: string | null;
  userAvatar?: string | null;
};

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

// Custom Ultra-Sleek Dark Theme for Google Maps
const googleDarkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#19191c" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8a8a8e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#19191c" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#3a3a3c" }] },
  { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#c7c7cc" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#636366" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#121214" }] },
  { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#252528" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#8e8e93" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#2f2f32" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#38383c" }] },
  { featureType: "transit", elementType: "labels.text.fill", stylers: [{ color: "#636366" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0c0c0e" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#48484a" }] },
];

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

export default function CheckoutMap({
  distance: propDistance,
  userLoc: propUserLoc,
  branches: propBranches,
  closestBranchId,
  selectedBranchId,
  onBranchSelect,
  branchLat,
  branchLng,
  branchName,
  userLat,
  userLng,
  riderLat,
  riderLng,
  riderHeading = 0,
  riderSpeed = 28,
  isLiveWebSocket = false,
  distanceText: propDistanceText,
}: CheckoutMapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const mapRef = useRef<google.maps.Map | null>(null);

  const [routePolyline, setRoutePolyline] = useState<{ lat: number; lng: number }[]>([]);
  const [calculatedDistanceStr, setCalculatedDistanceStr] = useState<string | null>(null);
  const [calculatedTimeStr, setCalculatedTimeStr] = useState<string | null>(null);

  // Resolve user location (delivery address coordinates)
  const userLoc = useMemo(() => {
    if (propUserLoc) return propUserLoc;
    if (userLat != null && userLng != null) {
      const lat = Number(userLat);
      const lng = Number(userLng);
      if (!isNaN(lat) && !isNaN(lng)) return { latitude: lat, longitude: lng };
    }
    return null;
  }, [propUserLoc, userLat, userLng]);

  // Resolve rider location
  const riderLoc = useMemo(() => {
    if (riderLat != null && riderLng != null) {
      const lat = Number(riderLat);
      const lng = Number(riderLng);
      if (!isNaN(lat) && !isNaN(lng)) return { latitude: lat, longitude: lng };
    }
    return null;
  }, [riderLat, riderLng]);

  // Resolve branches
  const branches = useMemo(() => {
    if (propBranches && propBranches.length > 0) return propBranches;
    if (branchLat != null && branchLng != null) {
      return [{ id: 1, name: branchName || "Restaurant Branch", latitude: branchLat, longitude: branchLng }];
    }
    return [];
  }, [propBranches, branchLat, branchLng, branchName]);

  const activeBranchId = selectedBranchId || closestBranchId || (branches[0]?.id ?? 1);
  const activeBranch = useMemo(
    () => branches.find((b) => b.id === activeBranchId) || branches[0],
    [branches, activeBranchId]
  );
  const bCoords = useMemo(() => (activeBranch ? getBranchCoordinates(activeBranch) : null), [activeBranch]);

  // Initial center position
  const center = useMemo(() => {
    if (userLoc) return { lat: userLoc.latitude, lng: userLoc.longitude };
    if (bCoords) return { lat: bCoords.latitude, lng: bCoords.longitude };
    return { lat: 51.4554, lng: 0.0538 }; // Eltham London
  }, [userLoc, bCoords]);

  // Fetch actual street driving route polyline
  useEffect(() => {
    if (!bCoords || !userLoc) {
      setRoutePolyline([]);
      return;
    }

    let isMounted = true;

    // Haversine fallback distance calculation
    const km = calculateDistanceKm(bCoords.latitude, bCoords.longitude, userLoc.latitude, userLoc.longitude);
    if (km != null) {
      const mins = calculateDeliveryMins(km);
      setCalculatedDistanceStr(`${km} km`);
      setCalculatedTimeStr(`${mins} mins`);
    }

    // Fetch street driving route geometry
    getDrivingRouteGeometry(bCoords, userLoc).then((res) => {
      if (!isMounted) return;
      if (res && res.coordinates && res.coordinates.length > 0) {
        const poly = res.coordinates.map((c) => ({ lat: c[1], lng: c[0] }));
        setRoutePolyline(poly);
        if (res.distanceKm != null) {
          setCalculatedDistanceStr(`${res.distanceKm} km`);
          const mins = calculateDeliveryMins(res.distanceKm);
          setCalculatedTimeStr(`${mins} mins`);
        }
      } else {
        setRoutePolyline([
          { lat: bCoords.latitude, lng: bCoords.longitude },
          ...(riderLoc ? [{ lat: riderLoc.latitude, lng: riderLoc.longitude }] : []),
          { lat: userLoc.latitude, lng: userLoc.longitude },
        ]);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [bCoords, userLoc, riderLoc]);

  // Fit bounds dynamically around all active markers
  const onMapLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;
      if (typeof window === "undefined" || !window.google) return;

      const bounds = new window.google.maps.LatLngBounds();
      let hasPoints = false;

      if (bCoords) {
        bounds.extend({ lat: bCoords.latitude, lng: bCoords.longitude });
        hasPoints = true;
      }
      if (userLoc) {
        bounds.extend({ lat: userLoc.latitude, lng: userLoc.longitude });
        hasPoints = true;
      }
      if (riderLoc) {
        bounds.extend({ lat: riderLoc.latitude, lng: riderLoc.longitude });
        hasPoints = true;
      }

      if (hasPoints) {
        map.fitBounds(bounds, { top: 60, bottom: 60, left: 60, right: 60 });
      }
    },
    [bCoords, userLoc, riderLoc]
  );

  const handleZoomIn = () => mapRef.current?.setZoom((mapRef.current.getZoom() || 13) + 1);
  const handleZoomOut = () => mapRef.current?.setZoom((mapRef.current.getZoom() || 13) - 1);
  const handleRecenter = () => {
    if (!mapRef.current || !window.google) return;
    const bounds = new window.google.maps.LatLngBounds();
    if (bCoords) bounds.extend({ lat: bCoords.latitude, lng: bCoords.longitude });
    if (userLoc) bounds.extend({ lat: userLoc.latitude, lng: userLoc.longitude });
    if (riderLoc) bounds.extend({ lat: riderLoc.latitude, lng: riderLoc.longitude });
    mapRef.current.fitBounds(bounds, { top: 60, bottom: 60, left: 60, right: 60 });
  };

  const displayDistance =
    propDistanceText || (calculatedDistanceStr ? `${calculatedDistanceStr} (${calculatedTimeStr || ""})` : null);
  const activeBranchName = activeBranch?.name || branchName || null;

  if (loadError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#18181a] text-red-400 text-xs p-4 text-center rounded-[16px] border border-white/10">
        Failed to load React Google Maps API. Please check your API key.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#18181a] text-zinc-400 text-xs rounded-[16px] border border-white/10 gap-2">
        <span className="w-5 h-5 rounded-full border-2 border-[#F9671A] border-t-transparent animate-spin"></span>
        <span>Loading React Google Dark Map...</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-[16px] overflow-hidden bg-[#18181a] border border-white/10 shadow-2xl group">
      {/* Hide Google Maps bottom logo, copyright taglines ('Map Data 2026'), & terms links */}
      <style>{`
        .gm-style-cc { display: none !important; }
        .gmnoprint { display: none !important; }
        .gm-svpc { display: none !important; }
        a[href^="https://maps.google.com"] { display: none !important; }
        a[href^="https://www.google.com/maps"] { display: none !important; }
        .gm-style a[target="_blank"] { display: none !important; }
      `}</style>

      {/* React Google Map Component */}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={13}
        onLoad={onMapLoad}
        options={{
          styles: googleDarkMapStyle as any,
          disableDefaultUI: true,
          zoomControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        }}
      >
        {/* Driving Route Polyline */}
        {routePolyline.length >= 2 && (
          <>
            {/* Outer Dark Casing Polyline */}
            <PolylineF
              path={routePolyline}
              options={{
                strokeColor: "#0b0f19",
                strokeOpacity: 0.85,
                strokeWeight: 8,
              }}
            />
            {/* Inner Brand Orange Navigation Line */}
            <PolylineF
              path={routePolyline}
              options={{
                strokeColor: "#F9671A",
                strokeOpacity: 1,
                strokeWeight: 5,
              }}
            />
          </>
        )}

        {/* Branch Markers */}
        {branches.map((b) => {
          const coords = getBranchCoordinates(b);
          if (!coords) return null;
          const isSelected = b.id === activeBranchId;

          let branchDistLabel = "";
          if (userLoc) {
            const km = calculateDistanceKm(coords.latitude, coords.longitude, userLoc.latitude, userLoc.longitude);
            if (km != null) {
              const mins = calculateDeliveryMins(km);
              branchDistLabel = `${km} km • ${mins}m`;
            }
          }

          return (
            <OverlayViewF
              key={b.id}
              position={{ lat: coords.latitude, lng: coords.longitude }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <div
                onClick={() => onBranchSelect && onBranchSelect(b.id)}
                className="flex flex-col items-center group cursor-pointer -translate-x-1/2 -translate-y-full transition-transform duration-300 hover:scale-110"
              >
                <div
                  className={`bg-[#202124]/95 border ${isSelected ? "border-[#F9671A] shadow-[0_0_15px_rgba(249,103,26,0.6)]" : "border-zinc-700"
                    } text-white px-2.5 py-1.5 rounded-xl text-[11px] font-bold mb-1 shadow-2xl backdrop-blur-md flex flex-col items-center max-w-[170px] text-center`}
                >
                  <div className="flex items-center gap-1.5 w-full justify-center">
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${isSelected ? "bg-[#F9671A] animate-ping" : "bg-zinc-400"
                        }`}
                    ></span>
                    <span className="truncate font-bold text-white text-[11px]">{b.name}</span>
                  </div>
                  {branchDistLabel && (
                    <div className="text-[#F9671A] font-semibold text-[10px] mt-0.5">{branchDistLabel}</div>
                  )}
                </div>
                <div className="relative flex items-center justify-center">
                  <div
                    className={`w-8 h-8 rounded-full ${isSelected ? "bg-gradient-to-br from-[#F9671A] to-[#d84e09]" : "bg-zinc-800"
                      } flex items-center justify-center text-white font-bold text-xs border-2 border-[#202124] shadow-xl`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  </div>
                  <div className="absolute -bottom-1 w-2 h-2 bg-[#F9671A] rotate-45"></div>
                </div>
              </div>
            </OverlayViewF>
          );
        })}

        {/* Customer Delivery Location Marker */}
        {userLoc && (
          <OverlayViewF
            position={{ lat: userLoc.latitude, lng: userLoc.longitude }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div className="flex flex-col items-center -translate-x-1/2 -translate-y-full transition-transform duration-300 hover:scale-110 z-20">
              <div className="bg-[#202124]/95 border border-emerald-500 text-white px-3 py-1.5 rounded-xl text-[11px] font-bold mb-1 shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-md flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <div>
                  <div className="text-white text-[11px] font-bold">Delivery Address</div>
                  <div className="text-emerald-400 text-[9px] font-medium">Customer Location</div>
                </div>
              </div>
              <div className="relative flex items-center justify-center w-9 h-9">
                <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-40"></div>
                <div className="relative w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center border-2 border-[#202124] shadow-2xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className="absolute -bottom-1 w-2.5 h-2.5 bg-emerald-600 rotate-45"></div>
              </div>
            </div>
          </OverlayViewF>
        )}

        {/* Live Rider Marker */}
        {riderLoc && (
          <OverlayViewF
            position={{ lat: riderLoc.latitude, lng: riderLoc.longitude }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div className="flex flex-col items-center -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-500 ease-out">
              <div className="bg-[#F9671A] text-white px-2.5 py-1 rounded-xl text-[10px] font-extrabold mb-1 shadow-2xl border border-white/20 flex items-center gap-1.5 whitespace-nowrap animate-bounce">
                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                <span>🚴 Live Rider {riderSpeed ? `• ${riderSpeed} km/h` : ""}</span>
              </div>
              <div className="relative flex items-center justify-center w-10 h-10">
                <div className="absolute inset-0 bg-[#F9671A] rounded-full animate-ping opacity-60"></div>
                <div
                  className="relative w-9 h-9 bg-gradient-to-tr from-[#F9671A] via-[#ff782e] to-yellow-400 rounded-full flex items-center justify-center border-2 border-white shadow-2xl"
                  style={{ transform: `rotate(${riderHeading}deg)` }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="5.5" cy="17.5" r="3.5" />
                    <circle cx="18.5" cy="17.5" r="3.5" />
                    <path d="M15 6h-5l-4 7h9l2-4.5" />
                    <path d="M12 17.5V14l-3-3" />
                  </svg>
                </div>
              </div>
            </div>
          </OverlayViewF>
        )}
      </GoogleMap>

      {/* Floating Header Overlay */}
      <div className="absolute top-3 left-3 z-30 pointer-events-none max-w-[calc(100%-100px)]">
        <div className="bg-[#202124]/95 backdrop-blur-md border border-white/10 text-white px-3 py-2 rounded-xl shadow-2xl flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#F9671A]/20 border border-[#F9671A]/40 flex items-center justify-center text-[#F9671A] flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-wider font-extrabold text-[#F9671A] flex items-center gap-1.5 truncate">
              <span className="truncate">{activeBranchName ? `📍 ${activeBranchName}` : "React Google Dark Map"}</span>
              {isLiveWebSocket ? (
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] px-1.5 py-0.5 rounded font-extrabold tracking-wide flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  LIVE WS
                </span>
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"></span>
              )}
            </div>
            <div className="text-[12px] font-bold text-white leading-tight truncate">
              {displayDistance || "Driving Route"}
            </div>
          </div>
        </div>
      </div>

      {/* Map Control Buttons */}
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="2" x2="12" y2="6" />
            <line x1="12" y1="18" x2="12" y2="22" />
            <line x1="2" y1="12" x2="6" y2="12" />
            <line x1="18" y1="12" x2="22" y2="12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
