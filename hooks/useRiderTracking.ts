"use client";

import { useState, useEffect, useRef } from "react";
import { Coordinates, calculateDistanceKm, calculateDeliveryMins, getDrivingRouteGeometry } from "@/utils/location";

export interface RiderTrackingState {
  riderLoc: Coordinates | null;
  heading: number;
  speedKmH: number;
  distanceRemainingKm: number | null;
  estimatedDeliveryMins: number | null;
  isLiveWebSocket: boolean;
  status: "idle" | "connecting" | "tracking" | "delivered";
}

interface UseRiderTrackingOptions {
  orderId?: number | string | null;
  orderStatus?: string | null;
  branchLoc?: Coordinates | null;
  customerLoc?: Coordinates | null;
  initialRiderLoc?: Coordinates | null;
}

export function useRiderTracking({
  orderId,
  orderStatus = "out_for_delivery",
  branchLoc,
  customerLoc,
  initialRiderLoc,
}: UseRiderTrackingOptions) {
  const [riderLoc, setRiderLoc] = useState<Coordinates | null>(initialRiderLoc || branchLoc || null);
  const [heading, setHeading] = useState<number>(0);
  const [speedKmH, setSpeedKmH] = useState<number>(28); // Average city rider speed 28 km/h
  const [isLiveWebSocket, setIsLiveWebSocket] = useState<boolean>(false);
  const [status, setStatus] = useState<RiderTrackingState["status"]>("idle");

  const routePolylineRef = useRef<[number, number][]>([]);
  const progressRef = useRef<number>(0.1); // Start 10% along route
  const animationFrameRef = useRef<number | null>(null);

  // Synchronize initial rider location if provided
  useEffect(() => {
    if (initialRiderLoc) {
      setRiderLoc(initialRiderLoc);
    } else if (branchLoc && !riderLoc) {
      setRiderLoc(branchLoc);
    }
  }, [initialRiderLoc, branchLoc]);

  // Fetch actual street driving route geometry for smooth street navigation
  useEffect(() => {
    if (!branchLoc || !customerLoc) return;
    getDrivingRouteGeometry(branchLoc, customerLoc).then((res) => {
      if (res && res.coordinates && res.coordinates.length > 0) {
        routePolylineRef.current = res.coordinates; // [[lng, lat], ...]
      }
    });
  }, [branchLoc, customerLoc]);

  // 1. WebSocket Live Connection Listener (Laravel Echo / Pusher / Native WS)
  useEffect(() => {
    if (!orderId || typeof window === "undefined") return;

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL;
    let ws: WebSocket | null = null;

    if (wsUrl) {
      try {
        setStatus("connecting");
        ws = new WebSocket(`${wsUrl}/orders/${orderId}/rider`);

        ws.onopen = () => {
          setIsLiveWebSocket(true);
          setStatus("tracking");
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            const lat = Number(data.latitude ?? data.lat);
            const lng = Number(data.longitude ?? data.lng ?? data.lon);

            if (!isNaN(lat) && !isNaN(lng)) {
              setRiderLoc({ latitude: lat, longitude: lng });
              if (data.heading != null) setHeading(Number(data.heading));
              if (data.speed != null) setSpeedKmH(Number(data.speed));
              setIsLiveWebSocket(true);
              setStatus("tracking");
            }
          } catch (e) {
            console.warn("[WebSocket Rider Tracking] Parse error:", e);
          }
        };

        ws.onerror = () => setIsLiveWebSocket(false);
        ws.onclose = () => setIsLiveWebSocket(false);
      } catch {
        setIsLiveWebSocket(false);
      }
    }

    return () => {
      if (ws) ws.close();
    };
  }, [orderId]);

  // 2. Smooth Interactive Street Simulation (Fallback when live WS is offline)
  useEffect(() => {
    const isDelivering = orderStatus === "out_for_delivery" || orderStatus === "preparing";
    if (!isDelivering || !branchLoc || !customerLoc || isLiveWebSocket) {
      return;
    }

    setStatus("tracking");
    let lastTime = performance.now();

    const updateSimulation = (now: number) => {
      const deltaSec = (now - lastTime) / 1000;
      lastTime = now;

      progressRef.current = Math.min(0.98, progressRef.current + deltaSec * 0.012);

      const points = routePolylineRef.current;
      if (points && points.length >= 2) {
        const floatIdx = progressRef.current * (points.length - 1);
        const idx = Math.floor(floatIdx);
        const nextIdx = Math.min(points.length - 1, idx + 1);
        const frac = floatIdx - idx;

        const p1 = points[idx];
        const p2 = points[nextIdx];

        const lng = p1[0] + (p2[0] - p1[0]) * frac;
        const lat = p1[1] + (p2[1] - p1[1]) * frac;

        setRiderLoc({ latitude: lat, longitude: lng });

        const dLat = p2[1] - p1[1];
        const dLng = p2[0] - p1[0];
        const angle = (Math.atan2(dLng, dLat) * 180) / Math.PI;
        setHeading((angle + 360) % 360);
      } else {
        const curLat = branchLoc.latitude + (customerLoc.latitude - branchLoc.latitude) * progressRef.current;
        const curLng = branchLoc.longitude + (customerLoc.longitude - branchLoc.longitude) * progressRef.current;

        setRiderLoc({ latitude: curLat, longitude: curLng });

        const dLat = customerLoc.latitude - branchLoc.latitude;
        const dLng = customerLoc.longitude - branchLoc.longitude;
        const angle = (Math.atan2(dLng, dLat) * 180) / Math.PI;
        setHeading((angle + 360) % 360);
      }

      animationFrameRef.current = requestAnimationFrame(updateSimulation);
    };

    animationFrameRef.current = requestAnimationFrame(updateSimulation);

    return () => {
      if (animationFrameRef.current != null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [orderStatus, branchLoc, customerLoc, isLiveWebSocket]);

  // 3. Computed distance remaining and ETA
  const distanceRemainingKm =
    riderLoc && customerLoc
      ? calculateDistanceKm(riderLoc.latitude, riderLoc.longitude, customerLoc.latitude, customerLoc.longitude)
      : null;

  const estimatedDeliveryMins = distanceRemainingKm != null ? calculateDeliveryMins(distanceRemainingKm) : null;

  return {
    riderLoc,
    heading,
    speedKmH,
    distanceRemainingKm,
    estimatedDeliveryMins,
    isLiveWebSocket,
    status,
  };
}
