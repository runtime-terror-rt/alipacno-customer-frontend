// ============================================================================
// Types
// ============================================================================

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface RouteInfo {
  distanceKm: number;
  durationMins: number;
  deliveryMins: number;
  formattedDistance: string;
  formattedDeliveryTime: string;
}

type NumericInput = number | string | null | undefined;

// ============================================================================
// Config
// ============================================================================

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

// ============================================================================
// Internal helpers (not exported)
// ============================================================================

function toNumber(value: NumericInput): number | null {
  if (value == null) return null;
  const n = typeof value === "string" ? parseFloat(value) : value;
  return Number.isNaN(n) ? null : n;
}

// ============================================================================
// Distance & ETA utilities (straight-line fallback, used only when the
// Directions API is unavailable/fails — see getGoogleRouteInfo for the real
// driving route which should always be preferred)
// ============================================================================

/**
 * Calculate distance between two coordinates in kilometers using the
 * Haversine formula. Returns null if any input is missing/invalid.
 */
export function calculateDistanceKm(lat1: NumericInput, lon1: NumericInput, lat2: NumericInput, lon2: NumericInput): number | null {
  const nLat1 = toNumber(lat1);
  const nLon1 = toNumber(lon1);
  const nLat2 = toNumber(lat2);
  const nLon2 = toNumber(lon2);

  if (nLat1 == null || nLon1 == null || nLat2 == null || nLon2 == null) return null;

  const R = 6371; // Earth radius in km
  const dLat = ((nLat2 - nLat1) * Math.PI) / 180;
  const dLon = ((nLon2 - nLon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((nLat1 * Math.PI) / 180) * Math.cos((nLat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c * 10) / 10; // 1 decimal place
}

/** Estimate delivery time in minutes from distance in km (~3 min/km + 10 min prep, min 15 mins). */
export function calculateDeliveryMins(km: number | null | undefined): number | null {
  if (km == null || isNaN(km)) return null;
  return Math.max(15, Math.round(km * 3) + 10);
}

/** Format distance as e.g. "2.3 km away". */
export function formatDistance(km: number | null | undefined): string {
  if (km == null || isNaN(km)) return "Distance N/A";
  return `${km} km away`;
}

/** Format delivery time as e.g. "25 mins delivery" or "1h 15m delivery". */
export function formatDeliveryTime(km: number | null | undefined): string {
  const mins = calculateDeliveryMins(km);
  if (mins == null) return "Est. delivery time";
  if (mins < 60) return `${mins} mins delivery`;
  const hrs = Math.floor(mins / 60);
  const remMins = mins % 60;
  return `${hrs}h ${remMins > 0 ? `${remMins}m` : ""} delivery`;
}

// ============================================================================
// Branch coordinates — FULLY DYNAMIC, no hardcoded branch table.
// Coordinates come only from whatever the branches API returns for that
// branch. If a branch has no valid latitude/longitude, this returns null and
// callers must handle that (skip distance calc / skip map marker for it)
// instead of silently snapping to some other fake location.
// ============================================================================

export function getBranchCoordinates(branch: any): Coordinates | null {
  if (!branch) return null;

  const lat = toNumber(branch.latitude ?? branch.lat);
  const lng = toNumber(branch.longitude ?? branch.lng ?? branch.long);

  if (lat == null || lng == null) return null;

  return { latitude: lat, longitude: lng };
}

// ============================================================================
// Geocoding: address <-> coordinates (Google Maps Geocoding API)
// ============================================================================

/**
 * Forward geocode an address string to coordinates using Google's Geocoding
 * API. `regionBias` is a soft bias only (does NOT reject results outside
 * it), so any user-typed address anywhere in the world resolves dynamically
 * instead of being hard-filtered to one country/bounding box.
 */
export async function forwardGeocode(
  address: string | null | undefined,
  opts: { regionBias?: string } = {}
): Promise<Coordinates | null> {
  if (!address || typeof address !== "string") return null;

  const trimmed = address.trim();
  if (!trimmed || trimmed.includes("@")) return null;

  // Direct coordinate match (e.g. "51.4554, 0.0538")
  const coordMatch = trimmed.match(/^(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)$/);
  if (coordMatch) {
    const lat = parseFloat(coordMatch[1]);
    const lng = parseFloat(coordMatch[3]);
    if (!isNaN(lat) && !isNaN(lng)) {
      return { latitude: lat, longitude: lng };
    }
  }

  if (!GOOGLE_MAPS_API_KEY) {
    console.error("[Geocoding] NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is missing");
    return null;
  }

  const normalizedAddress = trimmed.replace(/\s+/g, " ").trim();

  const params = new URLSearchParams({
    address: normalizedAddress,
    key: GOOGLE_MAPS_API_KEY,
  });
  if (opts.regionBias) params.set("region", opts.regionBias);

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?${params.toString()}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.warn("[Geocoding] Google response:", res.status, res.statusText);
      return null;
    }

    const data = await res.json();

    if (data.status !== "OK" || !Array.isArray(data.results) || data.results.length === 0) {
      console.warn("[Geocoding] Google status:", data.status, normalizedAddress);
      return null;
    }

    const best = data.results[0];
    const loc = best?.geometry?.location;
    if (!loc || typeof loc.lat !== "number" || typeof loc.lng !== "number") return null;

    return { latitude: loc.lat, longitude: loc.lng };
  } catch (error) {
    console.warn("[Geocoding] Google forward geocode failed:", error);
    return null;
  }
}

/** Reverse geocode lat/lng to a human-readable address string (Google Maps). */
export async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
  if (!GOOGLE_MAPS_API_KEY) {
    console.error("[Geocoding] NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is missing");
    return null;
  }

  try {
    const params = new URLSearchParams({
      latlng: `${lat},${lon}`,
      key: GOOGLE_MAPS_API_KEY,
    });
    const url = `https://maps.googleapis.com/maps/api/geocode/json?${params.toString()}`;
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    if (data.status !== "OK" || !Array.isArray(data.results) || data.results.length === 0) return null;

    return data.results[0].formatted_address || null;
  } catch (e) {
    console.warn("[Geocoding] Reverse geocode failed:", e);
    return null;
  }
}

// ============================================================================
// Routing (Google Maps Directions API)
// ============================================================================

/**
 * Get real driving route info (distance & duration) between two points via
 * the Google Directions API. Returns null if the key is missing or the
 * request/parsing fails, so callers should always have a Haversine-based
 * fallback (see calculateDistanceKm / formatDistance / formatDeliveryTime).
 */
export async function getGoogleRouteInfo(origin: Coordinates, destination: Coordinates): Promise<RouteInfo | null> {
  if (!GOOGLE_MAPS_API_KEY) {
    console.error("[Routing] NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is missing");
    return null;
  }

  try {
    const params = new URLSearchParams({
      origin: `${origin.latitude},${origin.longitude}`,
      destination: `${destination.latitude},${destination.longitude}`,
      mode: "driving",
      key: GOOGLE_MAPS_API_KEY,
    });
    const url = `https://maps.googleapis.com/maps/api/directions/json?${params.toString()}`;

    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    if (data.status !== "OK" || !Array.isArray(data.routes) || data.routes.length === 0) {
      console.warn("[Routing] Google status:", data.status);
      return null;
    }

    const leg = data.routes[0]?.legs?.[0];
    if (!leg) return null;

    const distanceKm = Math.round((leg.distance.value / 1000) * 10) / 10; // meters -> km, 1 decimal
    const durationMins = Math.round(leg.duration.value / 60); // seconds -> minutes
    const deliveryMins = Math.max(15, durationMins + 12); // add prep/handoff buffer

    let formattedDeliveryTime = `${deliveryMins} mins delivery`;
    if (deliveryMins >= 60) {
      const hrs = Math.floor(deliveryMins / 60);
      const mins = deliveryMins % 60;
      formattedDeliveryTime = `${hrs}h ${mins > 0 ? `${mins}m` : ""} delivery`;
    }

    return {
      distanceKm,
      durationMins,
      deliveryMins,
      formattedDistance: `${distanceKm} km away`,
      formattedDeliveryTime,
    };
  } catch (error) {
    console.warn("[Routing] Google Directions API failed:", error);
    return null;
  }
}

/**
 * Fetch actual street-by-street driving route polyline coordinates [lng, lat][]
 * between two points using the OSRM driving engine API.
 */
export async function getDrivingRouteGeometry(
  origin: Coordinates,
  destination: Coordinates
): Promise<{ coordinates: [number, number][]; distanceKm: number; durationMins: number } | null> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    if (data.code === "Ok" && Array.isArray(data.routes) && data.routes.length > 0) {
      const route = data.routes[0];
      const coordinates: [number, number][] = route.geometry.coordinates; // Array of [lng, lat]
      const distanceKm = Math.round((route.distance / 1000) * 10) / 10;
      const durationMins = Math.round(route.duration / 60);

      return { coordinates, distanceKm, durationMins };
    }
  } catch (err) {
    console.warn("[Routing] OSRM driving route error:", err);
  }
  return null;
}

// ============================================================================
// User geolocation
// ============================================================================

function getGpsLocation(): Promise<Coordinates | null> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => resolve(null),
      { timeout: 5000, maximumAge: 60000 }
    );
  });
}

async function getIpLocation(): Promise<Coordinates | null> {
  try {
    const res = await fetch("https://get.geojs.io/v1/ip/geo.json");
    if (!res.ok) return null;
    const data = await res.json();
    const lat = toNumber(data?.latitude);
    const lon = toNumber(data?.longitude);
    if (lat == null || lon == null) return null;
    return { latitude: lat, longitude: lon };
  } catch {
    return null;
  }
}

/**
 * Get the user's current location via browser GPS, falling back to IP-based
 * geolocation if GPS is denied, unavailable, or times out.
 */
export async function getUserLocation(): Promise<Coordinates | null> {
  const gps = await getGpsLocation();
  if (gps) return gps;
  return getIpLocation();
}

