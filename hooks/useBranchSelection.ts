"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useGetBranchesQuery, BranchItem } from "@/redux/features/api/branchesApi";
import {
  getUserLocation,
  getBranchCoordinates,
  calculateDistanceKm,
  calculateDeliveryMins,
  formatDistance,
  formatDeliveryTime,
  Coordinates,
} from "@/utils/location";

export interface BranchWithDistance extends BranchItem {
  distanceKm: number | null;
  deliveryMins: number | null;
  formattedDistance: string;
  formattedDeliveryTime: string;
  isNearest: boolean;
  isSelected: boolean;
}

const STORAGE_KEY = "selected_branch_id";
const OVERRIDE_KEY = "manual_branch_override";
const BRANCH_CHANGE_EVENT = "pacino_branch_changed";

export function useBranchSelection(overrideUserLoc?: Coordinates | null) {
  const { data: branchesRes, isLoading: isBranchesLoading } = useGetBranchesQuery();
  const rawBranches: BranchItem[] = useMemo(() => branchesRes?.data || [], [branchesRes]);

  const [userLoc, setUserLoc] = useState<Coordinates | null>(overrideUserLoc || null);
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
  const [isManualOverride, setIsManualOverride] = useState<boolean>(false);

  // 1. Fetch user location if not explicitly provided
  useEffect(() => {
    if (overrideUserLoc) {
      setUserLoc(overrideUserLoc);
      return;
    }
    let isMounted = true;
    getUserLocation().then((loc) => {
      if (isMounted && loc) {
        setUserLoc(loc);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [overrideUserLoc]);

  // 2. Load saved branch ID and manual override status from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadSavedBranch = () => {
      const isOverride = localStorage.getItem(OVERRIDE_KEY) === "true";
      setIsManualOverride(isOverride);

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed)) {
          setSelectedBranchId(parsed);
        }
      }
    };

    loadSavedBranch();

    const handleBranchChange = () => {
      loadSavedBranch();
    };

    window.addEventListener(BRANCH_CHANGE_EVENT, handleBranchChange);
    window.addEventListener("storage", handleBranchChange);

    return () => {
      window.removeEventListener(BRANCH_CHANGE_EVENT, handleBranchChange);
      window.removeEventListener("storage", handleBranchChange);
    };
  }, []);

  // 3. Compute distances for all branches
  const branchesWithDistance = useMemo<BranchWithDistance[]>(() => {
    if (!rawBranches || rawBranches.length === 0) return [];

    const mapped = rawBranches.map((b) => {
      const bCoords = getBranchCoordinates(b);
      let distanceKm: number | null = null;
      let deliveryMins: number | null = null;

      if (userLoc && bCoords) {
        distanceKm = calculateDistanceKm(
          userLoc.latitude,
          userLoc.longitude,
          bCoords.latitude,
          bCoords.longitude
        );
        deliveryMins = calculateDeliveryMins(distanceKm);
      }

      return {
        ...b,
        distanceKm,
        deliveryMins,
        formattedDistance: formatDistance(distanceKm),
        formattedDeliveryTime: formatDeliveryTime(distanceKm),
        isNearest: false,
        isSelected: false,
      };
    });

    // Find nearest branch (minimum distanceKm)
    let minDistance = Infinity;
    let nearestIndex = 0;

    mapped.forEach((b, idx) => {
      if (b.distanceKm != null && b.distanceKm < minDistance) {
        minDistance = b.distanceKm;
        nearestIndex = idx;
      }
    });

    return mapped.map((b, idx) => {
      const isNearest = idx === nearestIndex;
      return {
        ...b,
        isNearest,
        isSelected: false, // resolved below
      };
    });
  }, [rawBranches, userLoc]);

  // 4. Resolve nearest branch
  const nearestBranch = useMemo(
    () => branchesWithDistance.find((b) => b.isNearest) || branchesWithDistance[0] || null,
    [branchesWithDistance]
  );

  // 5. Automatically select nearest branch if user has NOT manually set an override
  useEffect(() => {
    if (typeof window === "undefined" || !nearestBranch) return;

    if (!isManualOverride) {
      setSelectedBranchId(nearestBranch.id);
      localStorage.setItem(STORAGE_KEY, String(nearestBranch.id));
    }
  }, [nearestBranch, isManualOverride]);

  // Active selected branch
  const selectedBranch = useMemo(() => {
    if (isManualOverride && selectedBranchId != null) {
      const found = branchesWithDistance.find((b) => b.id === selectedBranchId);
      if (found) return { ...found, isSelected: true };
    }
    // Default to nearest branch automatically!
    if (nearestBranch) {
      return { ...nearestBranch, isSelected: true };
    }
    return branchesWithDistance[0] || null;
  }, [branchesWithDistance, selectedBranchId, isManualOverride, nearestBranch]);

  // Final enriched branches array with correct isSelected flags
  const finalBranches = useMemo(() => {
    const activeId = selectedBranch?.id;
    return branchesWithDistance.map((b) => ({
      ...b,
      isSelected: b.id === activeId,
    }));
  }, [branchesWithDistance, selectedBranch]);

  // Function to manually switch branch (sets manual override flag)
  const selectBranch = useCallback((branchId: number) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, String(branchId));
    localStorage.setItem(OVERRIDE_KEY, "true");
    setSelectedBranchId(branchId);
    setIsManualOverride(true);
    window.dispatchEvent(new Event(BRANCH_CHANGE_EVENT));
  }, []);

  // Function to reset back to automatic nearest branch
  const resetToNearest = useCallback(() => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(OVERRIDE_KEY);
    setIsManualOverride(false);
    if (nearestBranch) {
      localStorage.setItem(STORAGE_KEY, String(nearestBranch.id));
      setSelectedBranchId(nearestBranch.id);
    }
    window.dispatchEvent(new Event(BRANCH_CHANGE_EVENT));
  }, [nearestBranch]);

  return {
    branches: finalBranches,
    selectedBranch,
    nearestBranch,
    selectedBranchId: selectedBranch?.id || null,
    selectBranch,
    resetToNearest,
    isManualOverride,
    isLoading: isBranchesLoading,
    userLoc,
  };
}
