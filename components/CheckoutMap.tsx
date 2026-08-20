"use client";

import { useMemo, useCallback } from "react";
import { GoogleMap, useJsApiLoader, OverlayView, Polyline } from '@react-google-maps/api';

const mapStyles = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

function calcDist(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function CheckoutMap({
  distance,
  userLoc,
  branches,
  closestBranchId
}: {
  distance?: number | null;
  userLoc?: { latitude: number; longitude: number } | null;
  branches?: any[];
  closestBranchId?: number | null;
}) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  });

  const center = useMemo(() => {
    if (userLoc) return { lat: userLoc.latitude, lng: userLoc.longitude };
    return { lat: 40.7128, lng: -74.0060 }; // Default
  }, [userLoc]);

  // Create formatted branches
  const markers = useMemo(() => {
    if (!branches) return [];
    
    let minDistance = Infinity;
    let actualClosestId: any = null;

    const mapped = branches.filter(b => b.latitude && b.longitude).map((b, i) => {
      const lat = parseFloat(b.latitude);
      const lng = parseFloat(b.longitude);
      let dist = null;
      if (userLoc) {
        dist = calcDist(userLoc.latitude, userLoc.longitude, lat, lng);
        if (dist < minDistance) {
          minDistance = dist;
          actualClosestId = b.id;
        }
      }
      return {
        ...b,
        lat,
        lng,
        dist,
        number: i + 1
      };
    });

    return mapped.map(b => ({
      ...b,
      isClosest: userLoc ? b.id === actualClosestId : b.id === closestBranchId
    }));
  }, [branches, closestBranchId, userLoc]);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    if (userLoc && markers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend({ lat: userLoc.latitude, lng: userLoc.longitude });
      markers.forEach(m => bounds.extend({ lat: m.lat, lng: m.lng }));
      map.fitBounds(bounds);
    }
  }, [userLoc, markers]);

  if (!isLoaded) return <div className="w-full h-full bg-[#1E1E20] animate-pulse rounded-[16px]"></div>;

  return (
    <div className="relative w-full h-full rounded-[16px] overflow-hidden group">
      <style>{`
        .gm-err-container {
          display: none !important;
        }
      `}</style>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center}
        zoom={12}
        onLoad={onLoad}
        options={{
          styles: mapStyles,
          disableDefaultUI: true,
          zoomControl: true,
          keyboardShortcuts: true,
          backgroundColor: '#242f3e',
        }}
      >
        {/* Draw line to ALL branches */}
        {userLoc && markers.map(marker => {
          const colors = ["#3b82f6", "#10b981", "#8b5cf6", "#ef4444", "#f59e0b"];
          const color = colors[marker.number % colors.length];
          return (
            <Polyline
              key={`poly-${marker.id}`}
              path={[
                { lat: userLoc.latitude, lng: userLoc.longitude },
                { lat: marker.lat, lng: marker.lng }
              ]}
              options={{
                strokeColor: marker.isClosest ? "#F96A1C" : color,
                strokeOpacity: marker.isClosest ? 1.0 : 0.8,
                strokeWeight: marker.isClosest ? 4 : 2,
                zIndex: marker.isClosest ? 10 : 1
              }}
            />
          );
        })}

        {/* User Location Marker */}
        {userLoc && (
          <OverlayView
            position={{ lat: userLoc.latitude, lng: userLoc.longitude }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            getPixelPositionOffset={(x, y) => ({ x: -x / 2, y: -y / 2 })}
          >
            <div className="flex flex-col items-center">
              <div className="bg-black/90 border border-[#F96A1C] text-white px-2.5 py-1 rounded-lg text-[10px] font-bold mb-1 shadow-2xl whitespace-nowrap z-20">
                Delivery Location
                <div className="text-[#F96A1C] text-[9px] text-center mt-0.5 font-medium">Your Address</div>
              </div>
              <div className="relative flex items-center justify-center w-7 h-7 z-20">
                <div className="absolute inset-0 bg-[#F96A1C] rounded-full animate-ping opacity-60"></div>
                <div className="relative w-7 h-7 bg-[#F96A1C] rounded-full flex items-center justify-center border-2 border-black shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
              </div>
            </div>
          </OverlayView>
        )}

        {/* Branch Markers */}
        {markers.map(marker => {
          const isClosest = marker.isClosest;
          const colors = ["#3b82f6", "#10b981", "#8b5cf6", "#ef4444", "#f59e0b"];
          const baseColor = colors[marker.number % colors.length];
          const color = isClosest ? "#F96A1C" : baseColor;
          const isOutOfRange = marker.dist !== null && marker.dist > 100;
          
          return (
            <OverlayView
              key={marker.id}
              position={{ lat: marker.lat, lng: marker.lng }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              getPixelPositionOffset={(x, y) => ({ x: -x / 2, y: -y / 2 })}
            >
              <div className={`relative flex flex-col items-center ${isClosest ? 'z-30' : 'z-10'}`}>
                {/* Distance Label for ALL branches */}
                {marker.dist !== null && (
                  <div className={`absolute top-[-8px] left-[15px] bg-[#1a1a1c] border ${isClosest ? 'border-[#F96A1C]' : 'border-black'} text-white text-[9px] font-bold px-2 py-1 rounded-md whitespace-nowrap flex items-center gap-1 shadow-xl z-20`}>
                    {isOutOfRange ? (
                      <span className="text-zinc-400 font-medium">{marker.dist.toFixed(0)} km</span>
                    ) : (
                      <>
                        <span className="text-[#F96A1C]">{(marker.dist * 4).toFixed(0)} min</span> 
                        <span className="text-zinc-500 font-normal">|</span> 
                        <span className="text-zinc-200">{marker.dist.toFixed(1)} km</span>
                      </>
                    )}
                  </div>
                )}
                
                <div className={`rounded-full flex items-center justify-center text-white font-bold border-2 border-black shadow-lg text-[11px] ${isClosest ? 'w-8 h-8 ring-2 ring-[#F96A1C] ring-offset-1 ring-offset-black' : 'w-7 h-7 opacity-90'}`} style={{ backgroundColor: color }}>
                  {marker.number}
                </div>
              </div>
            </OverlayView>
          );
        })}
      </GoogleMap>
    </div>
  );
}