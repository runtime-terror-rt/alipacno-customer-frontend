"use client";

import { useEffect, useState } from "react";
import StartOrderModal from "./StartOrderModal";

export default function StartOrderClient() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const has = localStorage.getItem("pacino_postcode");
      if (!has) setShow(true);
    } catch (e) {
      // ignore
    }
  }, []);

  if (!show) return null;

  return <StartOrderModal onClose={() => setShow(false)} />;
}
