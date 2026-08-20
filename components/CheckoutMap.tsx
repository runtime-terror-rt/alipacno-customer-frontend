"use client";

import { calculateDistanceKm, formatDistance } from "@/utils/location";
import { useGetMeQuery } from "@/redux/features/api/authApi";

export type CheckoutMapProps = {
  branchLat?: number | string | null;
  branchLng?: number | string | null;
  userLat?: number | string | null;
  userLng?: number | string | null;
  riderLat?: number | string | null;
  riderLng?: number | string | null;
  distanceText?: string | null;
  userAvatar?: string | null;
};

export default function CheckoutMap({
  branchLat,
  branchLng,
  userLat,
  userLng,
  riderLat,
  riderLng,
  distanceText,
  userAvatar: propAvatar,
}: CheckoutMapProps) {
  const { data: meRes } = useGetMeQuery();
  const user = meRes?.user || meRes?.data || meRes || {};

  // Determine user avatar image URL
  const rawAvatar = propAvatar || user?.avatar_url || user?.avatar || user?.user_image_url;

  const getImageUrl = (url?: string | null) => {
    if (!url) return "/customer/map-profile.png";
    if (url.startsWith("http") || url.startsWith("/customer")) return url;
    return `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const avatarSrc = getImageUrl(rawAvatar);

  // Compute distance if not explicitly passed
  let displayedDistance = distanceText;
  if (!displayedDistance && branchLat != null && branchLng != null && userLat != null && userLng != null) {
    const km = calculateDistanceKm(branchLat, branchLng, userLat, userLng);
    if (km != null) {
      displayedDistance = formatDistance(km);
    }
  }
  if (!displayedDistance) {
    displayedDistance = "Distance N/A";
  }

  return (
    <svg
      viewBox="0 0 680 450"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMin slice"
      xmlns="http://www.w3.org/2000/svg"
      style={{ borderRadius: "16px", display: "block" }}
    >
      {/* Background */}
      <rect width="680" height="450" fill="#3b3b3f" />

      {/* Horizontal roads */}
      <rect x="0" y="104" width="680" height="27" fill="#47474b" />
      <rect x="0" y="212" width="680" height="27" fill="#47474b" />
      <rect x="0" y="301" width="680" height="27" fill="#47474b" />

      {/* Vertical roads */}
      <rect x="129" y="0" width="27" height="450" fill="#47474b" />
      <rect x="314" y="0" width="27" height="450" fill="#47474b" />
      <rect x="498" y="0" width="27" height="450" fill="#47474b" />

      {/* City blocks — Row 1 */}
      <rect x="0" y="0" width="127" height="102" rx="3" fill="#444447" />
      <rect x="158" y="0" width="154" height="102" rx="3" fill="#444447" />
      <rect x="343" y="0" width="153" height="102" rx="3" fill="#444447" />
      <rect x="527" y="0" width="153" height="102" rx="3" fill="#444447" />

      {/* City blocks — Row 2 */}
      <rect x="0" y="133" width="127" height="77" rx="3" fill="#444447" />
      <rect x="158" y="133" width="154" height="77" rx="3" fill="#444447" />
      <rect x="343" y="133" width="153" height="77" rx="3" fill="#444447" />
      <rect x="527" y="133" width="153" height="77" rx="3" fill="#3e3e42" />

      {/* City blocks — Row 3 */}
      <rect x="0" y="241" width="127" height="58" rx="3" fill="#444447" />
      <rect x="158" y="241" width="154" height="58" rx="3" fill="#3e3e42" />
      <rect x="343" y="241" width="153" height="58" rx="3" fill="#444447" />
      <rect x="527" y="241" width="153" height="58" rx="3" fill="#444447" />

      {/* City blocks — Row 4 */}
      <rect x="0" y="330" width="127" height="30" rx="3" fill="#444447" />
      <rect x="158" y="330" width="154" height="30" rx="3" fill="#444447" />
      <rect x="343" y="330" width="153" height="30" rx="3" fill="#444447" />
      <rect x="527" y="330" width="153" height="30" rx="3" fill="#444447" />

      {/* Orange dashed route */}
      <polyline
        points="64,44 64,104 327,104 327,212 562,212 562,294"
        fill="none"
        stroke="#F96A1C"
        strokeWidth="5"
        strokeDasharray="12,9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Store pin — shadow */}
      <ellipse cx="64" cy="90" rx="16" ry="5" fill="#000" opacity="0.25" />

      {/* Store pin — orange circle background */}
      <circle cx="64" cy="48" r="30" fill="#F96A1C" />
      {/* Store pin — pointer triangle */}
      <polygon points="64,78 54,88 74,88" fill="#F96A1C" />

      {/* Store icon */}
      <g transform="translate(46.5, 30.5) scale(2.5)">
        <path d="M8.75 12.25V9.33333C8.75 9.17862 8.68854 9.03025 8.57915 8.92085C8.46975 8.81146 8.32138 8.75 8.16667 8.75H5.83333C5.67862 8.75 5.53025 8.81146 5.42085 8.92085C5.31146 9.03025 5.25 9.17862 5.25 9.33333V12.25" stroke="white" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M10.3681 6.014C10.2465 5.89759 10.0846 5.83261 9.91627 5.83261C9.74792 5.83261 9.58608 5.89759 9.46447 6.014C9.19323 6.27272 8.83278 6.41706 8.45793 6.41706C8.08309 6.41706 7.72264 6.27272 7.45139 6.014C7.32982 5.89776 7.16809 5.83289 6.99989 5.83289C6.83169 5.83289 6.66997 5.89776 6.54839 6.014C6.27712 6.27289 5.91654 6.41734 5.54156 6.41734C5.16657 6.41734 4.806 6.27289 4.53472 6.014C4.41312 5.89759 4.25127 5.83261 4.08293 5.83261C3.91459 5.83261 3.75274 5.89759 3.63114 6.014C3.36913 6.26403 3.02347 6.40762 2.66142 6.41682C2.29938 6.42603 1.94686 6.30019 1.67249 6.06381C1.39811 5.82742 1.22151 5.4974 1.17705 5.13798C1.13259 4.77856 1.22346 4.41545 1.43197 4.11934L3.11722 1.67867C3.22415 1.52089 3.36811 1.3917 3.53651 1.30242C3.70491 1.21313 3.89262 1.16647 4.08322 1.1665H9.91656C10.1066 1.16643 10.2938 1.21279 10.4618 1.30154C10.6299 1.39029 10.7737 1.51875 10.8808 1.67575L12.5696 4.12109C12.7781 4.41744 12.8689 4.78082 12.8241 5.14043C12.7794 5.50003 12.6024 5.83011 12.3276 6.06632C12.0528 6.30254 11.6998 6.42798 11.3376 6.4182C10.9754 6.40842 10.6297 6.26412 10.3681 6.01342" stroke="white" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M2.33325 6.3877V11.0835C2.33325 11.3929 2.45617 11.6897 2.67496 11.9085C2.89375 12.1273 3.1905 12.2502 3.49992 12.2502H10.4999C10.8093 12.2502 11.1061 12.1273 11.3249 11.9085C11.5437 11.6897 11.6666 11.3929 11.6666 11.0835V6.3877" stroke="white" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>

      {/* Rider Pin if rider location is provided */}
      {riderLat != null && riderLng != null && (
        <g transform="translate(327, 150)">
          <circle cx="0" cy="0" r="14" fill="#3b82f6" />
          <circle cx="0" cy="0" r="18" fill="#3b82f6" opacity="0.3" />
        </g>
      )}

      {/* Distance badge */}
      <rect x="348" y="137" width="178" height="42" rx="21" fill="#F96A1C" />
      <g transform="translate(358, 144) scale(1.35)">
        <path d="M16.6598 8.32991C16.6598 12.489 12.0459 16.8205 10.4965 18.1583C10.3522 18.2668 10.1765 18.3255 9.99592 18.3255C9.81533 18.3255 9.63963 18.2668 9.4953 18.1583C7.94594 16.8205 3.33203 12.489 3.33203 8.32991C3.33203 6.56253 4.03412 4.86755 5.28384 3.61782C6.53356 2.3681 8.22855 1.66602 9.99592 1.66602C11.7633 1.66602 13.4583 2.3681 14.708 3.61782C15.9577 4.86755 16.6598 6.56253 16.6598 8.32991Z" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M9.99603 10.829C11.3762 10.829 12.495 9.71015 12.495 8.33001C12.495 6.94988 11.3762 5.83105 9.99603 5.83105C8.61589 5.83105 7.49707 6.94988 7.49707 8.33001C7.49707 9.71015 8.61589 10.829 9.99603 10.829Z" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
      <text
        x="457"
        y="163"
        textAnchor="middle"
        fill="white"
        fontSize="14"
        fontWeight="700"
        fontFamily="system-ui, -apple-system, sans-serif"
        letterSpacing="0.3"
      >
        {displayedDistance}
      </text>

      {/* User avatar pin (User Point) — pulse rings */}
      <circle cx="562" cy="298" r="46" fill="#F96A1C" opacity="0.14" />
      <circle cx="562" cy="298" r="34" fill="#F96A1C" opacity="0.22" />

      {/* Clip path for circular avatar image */}
      <defs>
        <clipPath id="avatarClip">
          <circle cx="562" cy="298" r="24" />
        </clipPath>
      </defs>

      {/* Avatar border circle (background) */}
      <circle cx="562" cy="298" r="28" fill={rawAvatar ? "#2a2a2d" : "#F9671A"} stroke="#F96A1C" strokeWidth="4" />

      {rawAvatar ? (
        /* Profile image clipped to circle */
        <image
          href={avatarSrc}
          x="538"
          y="274"
          width="48"
          height="48"
          clipPath="url(#avatarClip)"
          preserveAspectRatio="xMidYMid slice"
        />
      ) : (
        /* 2-letter initials text when avatar is null */
        <text
          x="562"
          y="304"
          textAnchor="middle"
          fill="white"
          fontSize="18"
          fontWeight="800"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="1"
        >
          {(() => {
            const nameStr = user?.name || "User";
            const parts = nameStr.trim().split(/\s+/);
            return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0]?.substring(0, 2).toUpperCase() || "US";
          })()}
        </text>
      )}
    </svg>
  );
}