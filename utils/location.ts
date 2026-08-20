/**
 * Helper to calculate distance between two coordinates in kilometers using Haversine formula
 */
export function calculateDistanceKm(
  lat1: number | string | null | undefined,
  lon1: number | string | null | undefined,
  lat2: number | string | null | undefined,
  lon2: number | string | null | undefined
): number | null {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;

  const nLat1 = typeof lat1 === "string" ? parseFloat(lat1) : lat1;
  const nLon1 = typeof lon1 === "string" ? parseFloat(lon1) : lon1;
  const nLat2 = typeof lat2 === "string" ? parseFloat(lat2) : lat2;
  const nLon2 = typeof lon2 === "string" ? parseFloat(lon2) : lon2;

  if (isNaN(nLat1) || isNaN(nLon1) || isNaN(nLat2) || isNaN(nLon2)) return null;

  const R = 6371; // Earth radius in km
  const dLat = ((nLat2 - nLat1) * Math.PI) / 180;
  const dLon = ((nLon2 - nLon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((nLat1 * Math.PI) / 180) *
      Math.cos((nLat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return Math.round(d * 10) / 10; // Round to 1 decimal place
}

/**
 * Get accurate coordinates for restaurant branches to ensure correct local distance calculations
 */
export function getBranchCoordinates(branch: any): { latitude: number; longitude: number } {
  if (!branch) return { latitude: 51.4554, longitude: 0.0538 };

  const name = String(branch.name || "").toLowerCase();
  const addr = String(branch.address || "").toLowerCase();

  if (name.includes("eltham") || addr.includes("well hall") || addr.includes("eltham") || branch.id === 1) {
    return { latitude: 51.4554, longitude: 0.0538 };
  }
  if (name.includes("woodstock") || addr.includes("woodstock") || branch.id === 2) {
    return { latitude: 51.8488, longitude: -1.3533 };
  }
  if (name.includes("tower bridge") || addr.includes("tower bridge") || branch.id === 3) {
    return { latitude: 51.5055, longitude: -0.0754 };
  }

  const bLat = branch.latitude ? parseFloat(String(branch.latitude)) : null;
  const bLng = branch.longitude ? parseFloat(String(branch.longitude)) : null;
  if (bLat != null && bLng != null && !isNaN(bLat) && !isNaN(bLng) && bLat >= 49 && bLat <= 61 && bLng >= -8 && bLng <= 2) {
    return { latitude: bLat, longitude: bLng };
  }

  return { latitude: 51.4554, longitude: 0.0538 };
}

/**
 * Format distance as string e.g. "2.3 km away"
 */
export function formatDistance(km: number | null | undefined): string {
  if (km == null || isNaN(km)) return "Distance N/A";
  return `${km} km away`;
}

/**
 * Estimate delivery time in minutes from distance in km (~3 min/km base + 10 min prep)
 */
export function calculateDeliveryMins(km: number | null | undefined): number | null {
  if (km == null || isNaN(km)) return null;
  return Math.max(15, Math.round(km * 3) + 10);
}

/**
 * Format delivery time as string e.g. "25 mins delivery" or "1h 15m delivery"
 */
export function formatDeliveryTime(km: number | null | undefined): string {
  const mins = calculateDeliveryMins(km);
  if (mins == null) return "Est. delivery time";
  if (mins < 60) return `${mins} mins delivery`;
  const hrs = Math.floor(mins / 60);
  const remMins = mins % 60;
  return `${hrs}h ${remMins > 0 ? `${remMins}m` : ""} delivery`;
}

/**
 * Forward geocode address string to latitude/longitude coordinates using multi-stage fallback.
 * Supports exact street address, global place search (OpenMeteo), and simplified query fallback.
 * Ignores email addresses.
 */
export async function forwardGeocode(
  address: string | null | undefined
): Promise<{ latitude: number; longitude: number } | null> {
  if (!address || typeof address !== "string") return null;
  const trimmed = address.trim();
  if (!trimmed || trimmed.includes("@")) return null;

  const nomSearch = async (query: string, countryParam = ""): Promise<{ latitude: number; longitude: number } | null> => {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1${countryParam}&q=${encodeURIComponent(query)}`;
      const res = await fetch(url, {
        headers: {
          "Accept-Language": "en",
          "User-Agent": "AlipacnoFrontendApp/1.0 (contact@alipacno.co.uk)",
        },
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0 && data[0].lat && data[0].lon) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        if (!isNaN(lat) && !isNaN(lon)) {
          return { latitude: lat, longitude: lon };
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  const openMeteoSearch = async (query: string): Promise<{ latitude: number; longitude: number } | null> => {
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        return { latitude: data.results[0].latitude, longitude: data.results[0].longitude };
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  // 1. Try Nominatim search with UK priority for local UK queries if no explicit country specified
  const hasGlobalContext = /,|bangladesh|usa|france|japan|germany|australia|canada|india|spain|italy/i.test(trimmed);

  if (!hasGlobalContext) {
    let coords = await nomSearch(trimmed, "&countrycodes=gb");
    if (coords) return coords;
    coords = await nomSearch(`${trimmed}, London, UK`);
    if (coords) return coords;

    const simplified = trimmed.replace(/\b(town\s+centre|center|district|area|near|city|street|road)\b/gi, "").trim();
    if (simplified && simplified !== trimmed) {
      coords = await nomSearch(`${simplified}, London, UK`);
      if (coords) return coords;
      coords = await nomSearch(simplified, "&countrycodes=gb");
      if (coords) return coords;
    }
  }

  // 2. Nominatim direct search globally
  let coords = await nomSearch(trimmed);
  if (coords) return coords;

  // 3. OpenMeteo search (great for any city, town, region, or place globally)
  coords = await openMeteoSearch(trimmed);
  if (coords) return coords;

  // 4. Simplified search fallback globally
  const simplified = trimmed.replace(/\b(town\s+centre|center|district|area|near|city|street|road)\b/gi, "").trim();
  if (simplified && simplified !== trimmed) {
    coords = await openMeteoSearch(simplified);
    if (coords) return coords;
    coords = await nomSearch(simplified);
    if (coords) return coords;
  }

  return null;
}

/**
 * Reverse geocode lat/lng to a human-readable address string.
 * Uses OpenStreetMap Nominatim (free, no API key needed).
 */
export async function reverseGeocode(
  lat: number,
  lon: number
): Promise<string | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
      { headers: { "Accept-Language": "en" } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    // Build a compact readable address
    const a = data.address || {};
    const parts = [
      a.house_number ? `${a.house_number} ${a.road || a.pedestrian || a.footway || ""}`.trim() : (a.road || a.pedestrian || a.footway || ""),
      a.suburb || a.neighbourhood || a.quarter || "",
      a.city || a.town || a.village || a.county || "",
      a.postcode || "",
      a.country || "",
    ].filter(Boolean);
    return parts.join(", ") || data.display_name || null;
  } catch (e) {
    console.warn("Reverse geocode failed:", e);
    return null;
  }
}

/**
 * Get user location via navigator.geolocation with fallback
 */
export function getUserLocation(): Promise<{ latitude: number; longitude: number } | null> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      (err) => {
        console.warn("Geolocation warning/error:", err.message);
        resolve(null);
      },
      { timeout: 8000, maximumAge: 60000 }
    );
  });
}
