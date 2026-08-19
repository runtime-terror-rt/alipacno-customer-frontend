"use client";

import { useEffect, useState } from "react";
import StartOrderModal from "./StartOrderModal";

export default function StartOrderClient() {
  const [show, setShow] = useState(false);

  // Always show the modal on each page load (client-side)
  useEffect(() => {
    setShow(true);
  }, []);

  if (!show) return null;

  return <StartOrderModal onClose={() => setShow(false)} initialMode="delivery" />;
}
