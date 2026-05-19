export default function CheckoutMap() {
  return (
    <svg
      viewBox="0 0 380 200"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      {/* ── Background ── */}
      <rect width="380" height="200" fill="#3b3b3f" />

      {/* ── Road grid ── */}
      {/* Horizontal roads */}
      <rect x="0"   y="58"  width="380" height="15" fill="#47474b" />
      <rect x="0"   y="118" width="380" height="15" fill="#47474b" />
      <rect x="0"   y="168" width="380" height="15" fill="#47474b" />
      {/* Vertical roads */}
      <rect x="72"  y="0"   width="15" height="200" fill="#47474b" />
      <rect x="175" y="0"   width="15" height="200" fill="#47474b" />
      <rect x="278" y="0"   width="15" height="200" fill="#47474b" />

      {/* ── City blocks ── */}
      <rect x="0"   y="0"   width="70"  height="56"  rx="2" fill="#444447" />
      <rect x="89"  y="0"   width="84"  height="56"  rx="2" fill="#444447" />
      <rect x="192" y="0"   width="84"  height="56"  rx="2" fill="#444447" />
      <rect x="295" y="0"   width="85"  height="56"  rx="2" fill="#444447" />

      <rect x="0"   y="75"  width="70"  height="41"  rx="2" fill="#444447" />
      <rect x="89"  y="75"  width="84"  height="41"  rx="2" fill="#444447" />
      <rect x="192" y="75"  width="84"  height="41"  rx="2" fill="#444447" />
      <rect x="295" y="75"  width="85"  height="41"  rx="2" fill="#3e3e42" />

      <rect x="0"   y="135" width="70"  height="31"  rx="2" fill="#444447" />
      <rect x="89"  y="135" width="84"  height="31"  rx="2" fill="#3e3e42" />
      <rect x="192" y="135" width="84"  height="31"  rx="2" fill="#444447" />
      <rect x="295" y="135" width="85"  height="31"  rx="2" fill="#444447" />

      <rect x="0"   y="185" width="70"  height="15"  rx="2" fill="#444447" />
      <rect x="89"  y="185" width="84"  height="15"  rx="2" fill="#444447" />
      <rect x="192" y="185" width="84"  height="15"  rx="2" fill="#444447" />
      <rect x="295" y="185" width="85"  height="15"  rx="2" fill="#444447" />

      {/* ── Orange dashed route ── */}
      <polyline
        points="36,24 36,58 182,58 182,118 314,118 314,162"
        fill="none"
        stroke="#F96A1C"
        strokeWidth="3"
        strokeDasharray="7,5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* ── Restaurant pin (top-left) ── */}
      {/* Outer rounded square */}
      <rect x="20" y="8" width="32" height="32" rx="9" fill="#F96A1C" />
      {/* Simple shop/restaurant icon (white) */}
      <rect x="26" y="16" width="20" height="14" rx="2" fill="white" opacity="0.95" />
      <rect x="26" y="16" width="20" height="3"  rx="1" fill="#F96A1C" opacity="0.7" />
      <rect x="29" y="21" width="5"  height="5"  rx="1" fill="#F96A1C" opacity="0.55" />
      <rect x="36" y="22" width="7"  height="2"  rx="1" fill="#F96A1C" opacity="0.4" />
      <rect x="36" y="25" width="5"  height="2"  rx="1" fill="#F96A1C" opacity="0.4" />
      {/* Downward pointer */}
      <polygon points="36,40 30,46 42,46" fill="#F96A1C" />

      {/* ── Distance badge ── */}
      <rect x="148" y="64" width="100" height="24" rx="12" fill="#F96A1C" />
      {/* Pin dot icon */}
      <circle cx="163" cy="76" r="5.5" fill="none" stroke="white" strokeWidth="1.5" />
      <circle cx="163" cy="76" r="1.5" fill="white" />
      <line x1="163" y1="81.5" x2="163" y2="84" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      {/* Text */}
      <text
        x="222"
        y="80"
        textAnchor="middle"
        fill="white"
        fontSize="9.5"
        fontWeight="700"
        fontFamily="system-ui, -apple-system, sans-serif"
        letterSpacing="0.2"
      >
        2.3 km away
      </text>

      {/* ── User avatar pin (bottom-right) ── */}
      {/* Pulsing glow rings */}
      <circle cx="314" cy="165" r="24" fill="#F96A1C" opacity="0.18" />
      <circle cx="314" cy="165" r="18" fill="#F96A1C" opacity="0.28" />
      {/* Avatar circle border */}
      <circle cx="314" cy="165" r="16" fill="#2a2a2d" stroke="#F96A1C" strokeWidth="2.5" />
      {/* Face skin tone */}
      <circle cx="314" cy="163" r="11" fill="#c8845a" />
      {/* Hair/head top */}
      <ellipse cx="314" cy="154" rx="8" ry="5" fill="#5a3a20" />
      {/* Beard/chin */}
      <ellipse cx="314" cy="170" rx="8" ry="5" fill="#5a3a20" />
      {/* Eyes */}
      <circle cx="310" cy="162" r="1.5" fill="#3a2010" />
      <circle cx="318" cy="162" r="1.5" fill="#3a2010" />
      {/* Smile */}
      <path d="M310 167 Q314 170 318 167" stroke="#3a2010" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}