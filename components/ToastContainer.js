"use client";

import { useEffect, useRef } from "react";

const ICONS = {
  success: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M15 5.25L7.5 12.75 3.75 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M5.25 5.25l7.5 7.5M12.75 5.25l-7.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  info: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 8.25v3.75M9 6h.008" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

function Toast({ toast }) {
  const ref = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (ref.current) {
        ref.current.style.animation = "toast-out 0.3s var(--ease-out) forwards";
      }
    }, 2700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={ref} className={`toast ${toast.type}`}>
      <span className="toast-icon">{ICONS[toast.type] || ICONS.success}</span>
      <span>{toast.message}</span>
    </div>
  );
}

export default function ToastContainer({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} />
      ))}
    </div>
  );
}
