"use client";

export default function LogoIcon({ size = 28, className = "" }) {
  return (
    <img
      src="/favicon.svg"
      alt="WebRev Logo"
      width={size}
      height={size}
      className={className}
      onError={(e) => {
        // Fallback to high-res PNG if SVG has render restrictions in browser
        e.currentTarget.onerror = null;
        e.currentTarget.src = "/favicon-96x96.png";
      }}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "6px",
        objectFit: "contain",
        display: "inline-block",
        verticalAlign: "middle",
        flexShrink: 0,
      }}
    />
  );
}
