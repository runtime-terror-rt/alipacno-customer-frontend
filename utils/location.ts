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
// Config / constants
// ============================================================================

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

// Rough bounding boxes used to reject obviously-wrong geocoding results
// (e.g. Mapbox/Nominatim occasionally return a same-named place in a
// different country).
const UK_BOUNDS = { latMin: 49, latMax: 61, lonMin: -9, lonMax: 2 };
const LONDON_BOUNDS = { latMin: 51.2, latMax: 51.8, lonMin: -0.6, lonMax: 0.4 };

// Fallback coordinates when nothing better is available (Eltham branch / central London).
const DEFAULT_COORDINATES: Coordinates = { latitude: 51.4554, longitude: 0.0538 };

// Known branch coordinates, keyed by recognizable name/address fragments or id.
// Centralized here so adding a branch alias only requires one edit.
const KNOWN_BRANCHES: Array<{ match: (name: string, addr: string, id: any) => boolean; coords: Coordinates }> = [
  {
    match: (name, addr, id) =>
      name.includes("eltham") || addr.includes("well hall") || addr.includes("eltham") || name.includes("whole sale") || name.includes("hq") || id === 1,
    coords: { latitude: 51.4554, longitude: 0.0538 },
  },
  {
    match: (name, addr, id) => name.includes("woodstock") || addr.includes("woodstock") || id === 2,
    coords: { latitude: 51.8488, longitude: -1.3533 },
  },
  {
    match: (name, addr, id) => name.includes("tower bridge") || addr.includes("tower bridge") || id === 3,
    coords: { latitude: 51.5055, longitude: -0.0754 },
  },
];

// ============================================================================
// Internal helpers (not exported)
// ============================================================================

function toNumber(value: NumericInput): number | null {
  if (value == null) return null;
  const n = typeof value === "string" ? parseFloat(value) : value;
  return Number.isNaN(n) ? null : n;
}

function isValidUKCoordinate(latitude: number, longitude: number): boolean {
  return latitude >= UK_BOUNDS.latMin && latitude <= UK_BOUNDS.latMax && longitude >= UK_BOUNDS.lonMin && longitude <= UK_BOUNDS.lonMax;
}

function isValidLondonCoordinate(latitude: number, longitude: number): boolean {
  return (
    latitude >= LONDON_BOUNDS.latMin &&
    latitude <= LONDON_BOUNDS.latMax &&
    longitude >= LONDON_BOUNDS.lonMin &&
    longitude <= LONDON_BOUNDS.lonMax
  );
}

// ============================================================================
// Distance & ETA utilities
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

/**
 * Estimate delivery time in minutes from distance in km (~3 min/km + 10 min prep, min 15 mins).
 */
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
// Branch coordinates
// ============================================================================

/**
 * Get accurate coordinates for a restaurant branch, preferring known branch
 * aliases over raw lat/lng on the record (which have occasionally been
 * entered in the wrong country/format).
 */
export function getBranchCoordinates(branch: any): Coordinates {
  if (!branch) return DEFAULT_COORDINATES;

  const name = String(branch.name || "").toLowerCase();
  const addr = String(branch.address || "").toLowerCase();

  const known = KNOWN_BRANCHES.find((b) => b.match(name, addr, branch.id));
  if (known) return known.coords;

  const bLat = toNumber(branch.latitude);
  const bLng = toNumber(branch.longitude);

  if (bLat != null && bLng != null) {
    // Guard against e.g. US coordinates (lat < 45) attached to a UK address.
    const looksUK = addr.includes("london") || addr.includes("road") || addr.includes("well hall");
    if (bLat < 45 && looksUK) return DEFAULT_COORDINATES;
    return { latitude: bLat, longitude: bLng };
  }

  return DEFAULT_COORDINATES;
}

// ============================================================================
// Geocoding: address <-> coordinates
// ============================================================================

/** Mapbox forward geocoding (primary provider). */
async function mapboxForwardGeocode(normalizedAddress: string): Promise<Coordinates | null> {
  if (!MAPBOX_TOKEN) return null;

  const isLikelyLondonAddress = /london|se\d|ec\d|wc\d|sw\d|nw\d|n\d|e\d/i.test(normalizedAddress);
  const query = isLikelyLondonAddress ? `${normalizedAddress}, London, UK` : normalizedAddress;

  const params = new URLSearchParams({
    access_token: MAPBOX_TOKEN,
    limit: "5",
    country: "gb",
    language: "en",
    types: "address,street,place",
    proximity: "0.05,51.45",
  });

  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?${params.toString()}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.warn("[Geocoding] Mapbox response:", res.status, res.statusText);
      return null;
    }

    const data = await res.json();
    if (!Array.isArray(data.features)) return null;

    for (const feature of data.features) {
      const center = feature?.center;
      if (!Array.isArray(center) || center.length < 2) continue;

      const longitude = Number(center[0]);
      const latitude = Number(center[1]);
      if (Number.isNaN(latitude) || Number.isNaN(longitude)) continue;

      const valid = isLikelyLondonAddress ? isValidLondonCoordinate(latitude, longitude) : isValidUKCoordinate(latitude, longitude);
      if (!valid) {
        console.warn("[Geocoding] Rejected out-of-area Mapbox result:", { address: normalizedAddress, feature: feature.place_name, latitude, longitude });
        continue;
      }

      return { latitude, longitude };
    }
    return null;
  } catch (error) {
    console.warn("[Geocoding] Mapbox failed:", error);
    return null;
  }
}

/** Nominatim (OpenStreetMap) forward geocoding fallback. */
async function nominatimForwardGeocode(query: string, countryParam = "&countrycodes=gb"): Promise<Coordinates | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=5${countryParam}&addressdetails=1&q=${encodeURIComponent(query)}`;
    const res = await fetch(url, { headers: { "Accept-Language": "en" } });
    if (!res.ok) return null;

    const data = await res.json();
    if (!Array.isArray(data)) return null;

    for (const item of data) {
      const latitude = Number(item.lat);
      const longitude = Number(item.lon);
      if (Number.isNaN(latitude) || Number.isNaN(longitude)) continue;
      if (isValidLondonCoordinate(latitude, longitude)) return { latitude, longitude };
    }
    return null;
  } catch (error) {
    console.warn("[Geocoding] Nominatim failed:", error);
    return null;
  }
}

/** Open-Meteo forward geocoding — last-resort fallback, city/place based. */
async function openMeteoForwardGeocode(query: string): Promise<Coordinates | null> {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    if (!Array.isArray(data.results)) return null;

    for (const result of data.results) {
      const latitude = Number(result.latitude);
      const longitude = Number(result.longitude);
      if (Number.isNaN(latitude) || Number.isNaN(longitude)) continue;
      if (isValidLondonCoordinate(latitude, longitude)) return { latitude, longitude };
    }
    return null;
  } catch (error) {
    console.warn("[Geocoding] OpenMeteo failed:", error);
    return null;
  }
}

/**
 * Forward geocode an address string to coordinates.
 * Tries Mapbox first, then Nominatim (exact, then with London context),
 * then a postcode-only Nominatim lookup, then Open-Meteo as a last resort.
 */
export async function forwardGeocode(address: string | null | undefined): Promise<Coordinates | null> {
  if (!address || typeof address !== "string") return null;

  const trimmed = address.trim();
  if (!trimmed || trimmed.includes("@")) return null;

  const normalizedAddress = trimmed.replace(/\s+/g, " ").trim();

  // 1. Mapbox
  let coords = await mapboxForwardGeocode(normalizedAddress);
  if (coords) return coords;

  // 2. Nominatim — exact address, then with London context
  coords = await nominatimForwardGeocode(normalizedAddress);
  if (coords) return coords;

  coords = await nominatimForwardGeocode(`${normalizedAddress}, London, UK`);
  if (coords) return coords;

  // 3. Postcode-only lookup, if we can find one in the address
  const postcodeMatch = normalizedAddress.match(/\b[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}\b/i);
  if (postcodeMatch) {
    coords = await nominatimForwardGeocode(postcodeMatch[0].toUpperCase());
    if (coords) return coords;
  }

  // 4. Open-Meteo, on a simplified query (strip trailing ", London..." etc.)
  const simpleQuery = normalizedAddress.replace(/,\s*London.*$/i, "").trim();
  coords = await openMeteoForwardGeocode(simpleQuery);
  if (coords) return coords;

  console.warn("[Geocoding] Could not find valid coordinates:", normalizedAddress);
  return null;
}

/**
 * Reverse geocode lat/lng to a human-readable address string.
 * Tries Mapbox first, then falls back to Nominatim.
 */
export async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
  // 1. Mapbox
  if (MAPBOX_TOKEN) {
    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${MAPBOX_TOKEN}&limit=1`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.features?.length > 0) {
          return data.features[0].place_name || data.features[0].text || null;
        }
      }
    } catch (e) {
      console.warn("[Geocoding] Mapbox reverse geocode failed, trying fallback:", e);
    }
  }

  // 2. Nominatim fallback
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`, {
      headers: { "Accept-Language": "en" },
    });
    if (!res.ok) return null;

    const data = await res.json();
    const a = data.address || {};
    const parts = [
      a.house_number ? `${a.house_number} ${a.road || a.pedestrian || a.footway || ""}`.trim() : a.road || a.pedestrian || a.footway || "",
      a.suburb || a.neighbourhood || a.quarter || "",
      a.city || a.town || a.village || a.county || "",
      a.postcode || "",
      a.country || "",
    ].filter(Boolean);

    return parts.join(", ") || data.display_name || null;
  } catch (e) {
    console.warn("[Geocoding] Reverse geocode failed:", e);
    return null;
  }
}

// ============================================================================
// Routing (Mapbox Directions API)
// ============================================================================

/**
 * Get real driving route info (distance & duration) between two points via
 * the Mapbox Directions API. Returns null if the token is missing or the
 * request/parsing fails, so callers should always have a Haversine-based
 * fallback (see calculateDistanceKm / formatDistance / formatDeliveryTime).
 */
export async function getMapboxRouteInfo(origin: Coordinates, destination: Coordinates): Promise<RouteInfo | null> {
  if (!MAPBOX_TOKEN) {
    console.error("[Routing] NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN is missing");
    return null;
  }

  try {
    const url =
      `https://api.mapbox.com/directions/v5/mapbox/driving/` +
      `${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}` +
      `?access_token=${MAPBOX_TOKEN}&overview=false`;

    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    const route = data.routes?.[0];
    if (!route) return null;

    const distanceKm = Math.round((route.distance / 1000) * 10) / 10; // meters -> km, 1 decimal
    const durationMins = Math.round(route.duration / 60); // seconds -> minutes
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
    console.warn("[Routing] Mapbox Directions API failed:", error);
    return null;
  }
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























// const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

// /**
//  * Calculate distance between two coordinates in kilometers using Haversine formula
//  */
// export function calculateDistanceKm(
//   lat1: number | string | null | undefined,
//   lon1: number | string | null | undefined,
//   lat2: number | string | null | undefined,
//   lon2: number | string | null | undefined
// ): number | null {
//   if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;

//   const nLat1 = typeof lat1 === "string" ? parseFloat(lat1) : lat1;
//   const nLon1 = typeof lon1 === "string" ? parseFloat(lon1) : lon1;
//   const nLat2 = typeof lat2 === "string" ? parseFloat(lat2) : lat2;
//   const nLon2 = typeof lon2 === "string" ? parseFloat(lon2) : lon2;

//   if (isNaN(nLat1) || isNaN(nLon1) || isNaN(nLat2) || isNaN(nLon2)) return null;

//   const R = 6371; // Earth radius in km
//   const dLat = ((nLat2 - nLat1) * Math.PI) / 180;
//   const dLon = ((nLon2 - nLon1) * Math.PI) / 180;
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos((nLat1 * Math.PI) / 180) *
//       Math.cos((nLat2 * Math.PI) / 180) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   const d = R * c;

//   return Math.round(d * 10) / 10; // Round to 1 decimal place
// }

// /**
//  * Get accurate coordinates for restaurant branches to ensure correct local distance calculations
//  */
// export function getBranchCoordinates(branch: any): { latitude: number; longitude: number } {
//   if (!branch) return { latitude: 51.4554, longitude: 0.0538 };

//   const name = String(branch.name || "").toLowerCase();
//   const addr = String(branch.address || "").toLowerCase();

//   // Eltham / Well Hall / Pacinos HQ / Branch 1 -> Eltham, London UK
//   if (
//     name.includes("eltham") ||
//     addr.includes("well hall") ||
//     addr.includes("eltham") ||
//     name.includes("whole sale") ||
//     name.includes("hq") ||
//     branch.id === 1
//   ) {
//     return { latitude: 51.4554, longitude: 0.0538 };
//   }
//   // Woodstock / Branch 2
//   if (name.includes("woodstock") || addr.includes("woodstock") || branch.id === 2) {
//     return { latitude: 51.8488, longitude: -1.3533 };
//   }
//   // Tower Bridge / Branch 3
//   if (name.includes("tower bridge") || addr.includes("tower bridge") || branch.id === 3) {
//     return { latitude: 51.5055, longitude: -0.0754 };
//   }

//   const bLat = branch.latitude ? parseFloat(String(branch.latitude)) : null;
//   const bLng = branch.longitude ? parseFloat(String(branch.longitude)) : null;
//   if (bLat != null && bLng != null && !isNaN(bLat) && !isNaN(bLng)) {
//     // If coordinates are in Chicago/US (e.g. 41.8827) while address is in UK, fallback to UK default
//     if (bLat < 45 && (addr.includes("london") || addr.includes("road") || addr.includes("well hall"))) {
//       return { latitude: 51.4554, longitude: 0.0538 };
//     }
//     return { latitude: bLat, longitude: bLng };
//   }

//   return { latitude: 51.4554, longitude: 0.0538 };
// }

// /**
//  * Format distance as string e.g. "2.3 km away"
//  */
// export function formatDistance(km: number | null | undefined): string {
//   if (km == null || isNaN(km)) return "Distance N/A";
//   return `${km} km away`;
// }

// /**
//  * Estimate delivery time in minutes from distance in km (~3 min/km base + 10 min prep)
//  */
// export function calculateDeliveryMins(km: number | null | undefined): number | null {
//   if (km == null || isNaN(km)) return null;
//   return Math.max(15, Math.round(km * 3) + 10);
// }

// /**
//  * Format delivery time as string e.g. "25 mins delivery" or "1h 15m delivery"
//  */
// export function formatDeliveryTime(km: number | null | undefined): string {
//   const mins = calculateDeliveryMins(km);
//   if (mins == null) return "Est. delivery time";
//   if (mins < 60) return `${mins} mins delivery`;
//   const hrs = Math.floor(mins / 60);
//   const remMins = mins % 60;
//   return `${hrs}h ${remMins > 0 ? `${remMins}m` : ""} delivery`;
// }

// /**
//  * Forward geocode address string to latitude/longitude coordinates using Mapbox API, with Nominatim and OpenMeteo fallbacks.
//  */
// export async function forwardGeocode(
//   address: string | null | undefined
// ): Promise<{
//   latitude: number;
//   longitude: number;
// } | null> {
//   if (!address || typeof address !== "string") {
//     return null;
//   }

//   const trimmed = address.trim();

//   if (!trimmed || trimmed.includes("@")) {
//     return null;
//   }

//   /**
//    * Validate whether coordinates are reasonably inside UK.
//    *
//    * UK rough bounding box:
//    * latitude: 49 - 61
//    * longitude: -9 - 2
//    *
//    * We use this to prevent Mapbox from returning
//    * a completely wrong location.
//    */
//   const isValidUKCoordinate = (
//     latitude: number,
//     longitude: number
//   ) => {
//     return (
//       latitude >= 49 &&
//       latitude <= 61 &&
//       longitude >= -9 &&
//       longitude <= 2
//     );
//   };

//   /**
//    * Validate specifically around London.
//    *
//    * London rough area:
//    * latitude: 51.2 - 51.8
//    * longitude: -0.6 - 0.4
//    */
//   const isValidLondonCoordinate = (
//     latitude: number,
//     longitude: number
//   ) => {
//     return (
//       latitude >= 51.2 &&
//       latitude <= 51.8 &&
//       longitude >= -0.6 &&
//       longitude <= 0.4
//     );
//   };

//   /**
//    * Clean common address formatting.
//    */
//   const normalizedAddress = trimmed
//     .replace(/\s+/g, " ")
//     .trim();

//   /**
//    * =====================================================
//    * 1. MAPBOX GEOCODING
//    * =====================================================
//    */
//   if (MAPBOX_TOKEN) {
//     try {
//       /**
//        * If address looks like a UK/London address,
//        * explicitly add UK context.
//        */
//       const isLikelyLondonAddress =
//         /london|se\d|ec\d|wc\d|sw\d|nw\d|n\d|e\d/i.test(
//           normalizedAddress
//         );

//       const query = isLikelyLondonAddress
//         ? `${normalizedAddress}, London, UK`
//         : normalizedAddress;

//       const params = new URLSearchParams({
//         access_token: MAPBOX_TOKEN,
//         limit: "5",
//         country: "gb",
//         language: "en",
//         types: "address,street,place",
//         proximity: "0.05,51.45",
//       });

//       const url =
//         `https://api.mapbox.com/geocoding/v5/mapbox.places/` +
//         `${encodeURIComponent(query)}.json?${params.toString()}`;

//       console.log(
//         "[Geocoding] Mapbox query:",
//         query
//       );

//       const res = await fetch(url);

//       if (res.ok) {
//         const data = await res.json();

//         console.log(
//           "[Geocoding] Mapbox results:",
//           data.features
//         );

//         if (
//           Array.isArray(data.features) &&
//           data.features.length > 0
//         ) {
//           /**
//            * Find the first valid London/UK result.
//            */
//           for (const feature of data.features) {
//             const center = feature?.center;

//             if (
//               !Array.isArray(center) ||
//               center.length < 2
//             ) {
//               continue;
//             }

//             const longitude = Number(center[0]);
//             const latitude = Number(center[1]);

//             if (
//               Number.isNaN(latitude) ||
//               Number.isNaN(longitude)
//             ) {
//               continue;
//             }

//             /**
//              * For London addresses, don't accept
//              * coordinates outside London.
//              */
//             if (
//               isLikelyLondonAddress &&
//               !isValidLondonCoordinate(
//                 latitude,
//                 longitude
//               )
//             ) {
//               console.warn(
//                 "[Geocoding] Rejected non-London result:",
//                 {
//                   address: normalizedAddress,
//                   feature: feature.place_name,
//                   latitude,
//                   longitude,
//                 }
//               );

//               continue;
//             }

//             /**
//              * For other UK addresses, at least make sure
//              * the result is somewhere in UK.
//              */
//             if (
//               !isLikelyLondonAddress &&
//               !isValidUKCoordinate(
//                 latitude,
//                 longitude
//               )
//             ) {
//               console.warn(
//                 "[Geocoding] Rejected non-UK result:",
//                 {
//                   address: normalizedAddress,
//                   feature: feature.place_name,
//                   latitude,
//                   longitude,
//                 }
//               );

//               continue;
//             }

//             console.log(
//               "[Geocoding] Selected:",
//               {
//                 address: normalizedAddress,
//                 placeName: feature.place_name,
//                 latitude,
//                 longitude,
//               }
//             );

//             return {
//               latitude,
//               longitude,
//             };
//           }
//         }
//       } else {
//         console.warn(
//           "[Geocoding] Mapbox response:",
//           res.status,
//           res.statusText
//         );
//       }
//     } catch (error) {
//       console.warn(
//         "[Geocoding] Mapbox failed:",
//         error
//       );
//     }
//   }

//   /**
//    * =====================================================
//    * 2. NOMINATIM FALLBACK
//    * =====================================================
//    */

//   const nomSearch = async (
//     query: string,
//     countryParam = ""
//   ): Promise<{
//     latitude: number;
//     longitude: number;
//   } | null> => {
//     try {
//       const url =
//         `https://nominatim.openstreetmap.org/search` +
//         `?format=json` +
//         `&limit=5` +
//         `${countryParam}` +
//         `&addressdetails=1` +
//         `&q=${encodeURIComponent(query)}`;

//       const res = await fetch(url, {
//         headers: {
//           "Accept-Language": "en",
//         },
//       });

//       if (!res.ok) {
//         return null;
//       }

//       const data = await res.json();

//       if (!Array.isArray(data)) {
//         return null;
//       }

//       for (const item of data) {
//         const latitude = Number(item.lat);
//         const longitude = Number(item.lon);

//         if (
//           Number.isNaN(latitude) ||
//           Number.isNaN(longitude)
//         ) {
//           continue;
//         }

//         if (
//           isValidLondonCoordinate(
//             latitude,
//             longitude
//           )
//         ) {
//           console.log(
//             "[Geocoding] Nominatim selected:",
//             {
//               query,
//               displayName: item.display_name,
//               latitude,
//               longitude,
//             }
//           );

//           return {
//             latitude,
//             longitude,
//           };
//         }
//       }

//       return null;
//     } catch (error) {
//       console.warn(
//         "[Geocoding] Nominatim failed:",
//         error
//       );

//       return null;
//     }
//   };

//   /**
//    * Try exact address in UK first.
//    */
//   let coords = await nomSearch(
//     normalizedAddress,
//     "&countrycodes=gb"
//   );

//   if (coords) {
//     return coords;
//   }

//   /**
//    * Try with London context.
//    */
//   coords = await nomSearch(
//     `${normalizedAddress}, London, UK`,
//     "&countrycodes=gb"
//   );

//   if (coords) {
//     return coords;
//   }

//   /**
//    * =====================================================
//    * 3. OPEN-METEO FALLBACK
//    * =====================================================
//    *
//    * Open-Meteo is mainly city/place based, so don't use
//    * it as the first choice for exact house addresses.
//    */
//   const openMeteoSearch = async (
//     query: string
//   ): Promise<{
//     latitude: number;
//     longitude: number;
//   } | null> => {
//     try {
//       const url =
//         `https://geocoding-api.open-meteo.com/v1/search` +
//         `?name=${encodeURIComponent(query)}` +
//         `&count=10` +
//         `&language=en` +
//         `&format=json`;

//       const res = await fetch(url);

//       if (!res.ok) {
//         return null;
//       }

//       const data = await res.json();

//       if (
//         !Array.isArray(data.results)
//       ) {
//         return null;
//       }

//       for (const result of data.results) {
//         const latitude = Number(
//           result.latitude
//         );

//         const longitude = Number(
//           result.longitude
//         );

//         if (
//           Number.isNaN(latitude) ||
//           Number.isNaN(longitude)
//         ) {
//           continue;
//         }

//         if (
//           isValidLondonCoordinate(
//             latitude,
//             longitude
//           )
//         ) {
//           return {
//             latitude,
//             longitude,
//           };
//         }
//       }

//       return null;
//     } catch (error) {
//       console.warn(
//         "[Geocoding] OpenMeteo failed:",
//         error
//       );

//       return null;
//     }
//   };

//   /**
//    * Extract postcode from address.
//    *
//    * Example:
//    * SE9 6SR
//    */
//   const postcodeMatch =
//     normalizedAddress.match(
//       /\b[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}\b/i
//     );

//   if (postcodeMatch) {
//     const postcode =
//       postcodeMatch[0].toUpperCase();

//     /**
//      * Try postcode specifically.
//      */
//     coords = await nomSearch(
//       postcode,
//       "&countrycodes=gb"
//     );

//     if (coords) {
//       return coords;
//     }
//   }

//   /**
//    * Last fallback.
//    */
//   const simpleQuery =
//     normalizedAddress
//       .replace(/,\s*London.*$/i, "")
//       .trim();

//   coords = await openMeteoSearch(
//     simpleQuery
//   );

//   if (coords) {
//     return coords;
//   }

//   console.warn(
//     "[Geocoding] Could not find valid coordinates:",
//     normalizedAddress
//   );

//   return null;
// }

// /**
//  * Reverse geocode lat/lng to a human-readable address string using Mapbox API with Nominatim fallback.
//  */
// export async function reverseGeocode(
//   lat: number,
//   lon: number
// ): Promise<string | null> {
//   // 1. Mapbox Reverse Geocoding
//   if (MAPBOX_TOKEN) {
//     try {
//       const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${MAPBOX_TOKEN}&limit=1`;
//       const res = await fetch(url);
//       if (res.ok) {
//         const data = await res.json();
//         if (data.features && data.features.length > 0) {
//           return data.features[0].place_name || data.features[0].text || null;
//         }
//       }
//     } catch (e) {
//       console.warn("Mapbox reverse geocode failed, trying fallback:", e);
//     }
//   }

//   // 2. Nominatim fallback
//   try {
//     const res = await fetch(
//       `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
//       { headers: { "Accept-Language": "en" } }
//     );
//     if (!res.ok) return null;
//     const data = await res.json();
//     const a = data.address || {};
//     const parts = [
//       a.house_number ? `${a.house_number} ${a.road || a.pedestrian || a.footway || ""}`.trim() : (a.road || a.pedestrian || a.footway || ""),
//       a.suburb || a.neighbourhood || a.quarter || "",
//       a.city || a.town || a.village || a.county || "",
//       a.postcode || "",
//       a.country || "",
//     ].filter(Boolean);
//     return parts.join(", ") || data.display_name || null;
//   } catch (e) {
//     console.warn("Reverse geocode failed:", e);
//     return null;
//   }
// }

// /**
//  * Get Mapbox real driving route info (distance & duration)
//  */
// // export async function getMapboxRouteInfo(
// //   origin: { latitude: number; longitude: number },
// //   destination: { latitude: number; longitude: number }
// // ): Promise<{
// //   distanceKm: number;
// //   durationMins: number;
// //   deliveryMins: number;
// //   formattedDistance: string;
// //   formattedDeliveryTime: string;
// // } | null> {
// //   if (!MAPBOX_TOKEN) return null;
// //   try {
// //     const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?access_token=${MAPBOX_TOKEN}&overview=false`;
// //     const res = await fetch(url);
// //     if (!res.ok) return null;
// //     const data = await res.json();
// //     if (data.routes && data.routes.length > 0) {
// //       const route = data.routes[0];
// //       const distanceKm = Math.round((route.distance / 1000) * 10) / 10;
// //       const durationMins = Math.round(route.duration / 60);
// //       const deliveryMins = Math.max(15, durationMins + 12);

// //       const formattedDistance = `${distanceKm} km away`;
// //       let formattedDeliveryTime = `${deliveryMins} mins delivery`;
// //       if (deliveryMins >= 60) {
// //         const hrs = Math.floor(deliveryMins / 60);
// //         const mins = deliveryMins % 60;
// //         formattedDeliveryTime = `${hrs}h ${mins > 0 ? `${mins}m` : ""} delivery`;
// //       }

// //       return {
// //         distanceKm,
// //         durationMins,
// //         deliveryMins,
// //         formattedDistance,
// //         formattedDeliveryTime,
// //       };
// //     }
// //   } catch (e) {
// //     console.warn("Mapbox Directions API failed:", e);
// //   }
// //   return null;
// // }

// export async function getMapboxRouteInfo(
//   origin: {
//     latitude: number;
//     longitude: number;
//   },
//   destination: {
//     latitude: number;
//     longitude: number;
//   }
// ) {
//   const token =
//     process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

//   if (!token) {
//     console.error(
//       "NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN is missing"
//     );

//     return null;
//   }

//   try {
//     const url =
//       `https://api.mapbox.com/directions/v5/mapbox/driving/` +
//       `${origin.longitude},${origin.latitude};` +
//       `${destination.longitude},${destination.latitude}` +
//       `?access_token=${token}` +
//       `&overview=full`;

//     const response = await fetch(url);

//     if (!response.ok) {
//       return null;
//     }

//     const data = await response.json();

//     const route = data.routes?.[0];

//     if (!route) {
//       return null;
//     }

//     // Mapbox returns meters
//     const distanceKm =
//       Number(route.distance) / 1000;

//     // Mapbox returns seconds
//     const durationMinutes =
//       Math.ceil(Number(route.duration) / 60);

//     return {
//       distance: distanceKm,

//       duration: durationMinutes,

//       formattedDistance:
//         `${distanceKm.toFixed(1)} km`,

//       formattedDeliveryTime:
//         `${durationMinutes} min`,
//     };
//   } catch (error) {
//     return null;
//   }
// }

// /**
//  * Get user location via navigator.geolocation with fallback to GeoJS IP location if GPS is denied/unavailable
//  */
// export async function getUserLocation(): Promise<{ latitude: number; longitude: number } | null> {
//   const getGpsLocation = (): Promise<{ latitude: number; longitude: number } | null> => {
//     return new Promise((resolve) => {
//       if (typeof window === "undefined" || !navigator.geolocation) {
//         resolve(null);
//         return;
//       }
//       navigator.geolocation.getCurrentPosition(
//         (pos) => {
//           resolve({
//             latitude: pos.coords.latitude,
//             longitude: pos.coords.longitude,
//           });
//         },
//         () => resolve(null),
//         { timeout: 5000, maximumAge: 60000 }
//       );
//     });
//   };

//   const gps = await getGpsLocation();
//   if (gps) return gps;

//   // Fallback to IP geolocation
//   try {
//     const res = await fetch("https://get.geojs.io/v1/ip/geo.json");
//     if (res.ok) {
//       const data = await res.json();
//       if (data && data.latitude && data.longitude) {
//         const lat = parseFloat(data.latitude);
//         const lon = parseFloat(data.longitude);
//         if (!isNaN(lat) && !isNaN(lon)) {
//           return { latitude: lat, longitude: lon };
//         }
//       }
//     }
//   } catch (e) {}

//   return null;
// }
