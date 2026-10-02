export function FlagID({ width = 20, height = 14, className = "" }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 16"
      fill="none"
      className={className}
      style={{ borderRadius: "2px", overflow: "hidden", display: "inline-block", verticalAlign: "middle" }}
    >
      <rect width="24" height="8" fill="#e11d48" />
      <rect y="8" width="24" height="8" fill="#ffffff" />
      <rect width="24" height="16" stroke="rgba(0,0,0,0.12)" strokeWidth="0.8" fill="none" />
    </svg>
  );
}

export function FlagUS({ width = 20, height = 14, className = "" }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 16"
      fill="none"
      className={className}
      style={{ borderRadius: "2px", overflow: "hidden", display: "inline-block", verticalAlign: "middle" }}
    >
      {/* 13 stripes */}
      <rect width="24" height="16" fill="#ffffff" />
      <rect y="0" width="24" height="1.23" fill="#dc2626" />
      <rect y="2.46" width="24" height="1.23" fill="#dc2626" />
      <rect y="4.92" width="24" height="1.23" fill="#dc2626" />
      <rect y="7.38" width="24" height="1.23" fill="#dc2626" />
      <rect y="9.84" width="24" height="1.23" fill="#dc2626" />
      <rect y="12.3" width="24" height="1.23" fill="#dc2626" />
      <rect y="14.76" width="24" height="1.24" fill="#dc2626" />
      {/* Blue canton */}
      <rect width="9.6" height="8.6" fill="#1e3a8a" />
      {/* Simplified stars cluster */}
      <circle cx="2.4" cy="2.2" r="0.65" fill="#ffffff" />
      <circle cx="4.8" cy="2.2" r="0.65" fill="#ffffff" />
      <circle cx="7.2" cy="2.2" r="0.65" fill="#ffffff" />
      <circle cx="3.6" cy="4.3" r="0.65" fill="#ffffff" />
      <circle cx="6.0" cy="4.3" r="0.65" fill="#ffffff" />
      <circle cx="2.4" cy="6.4" r="0.65" fill="#ffffff" />
      <circle cx="4.8" cy="6.4" r="0.65" fill="#ffffff" />
      <circle cx="7.2" cy="6.4" r="0.65" fill="#ffffff" />
      <rect width="24" height="16" stroke="rgba(0,0,0,0.12)" strokeWidth="0.8" fill="none" />
    </svg>
  );
}
