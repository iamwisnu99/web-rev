"use client";

import { useState, useEffect, useCallback } from "react";
import { translations } from "@/lib/i18n";

export default function LogoutConfirmModal({
  currentUser,
  onConfirm,
  onClose,
  lang = "id",
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const t = translations[lang] || translations.id;
  const logoutText = t.logoutModal || {
    title: lang === "en" ? "Confirm Account Logout" : "Konfirmasi Keluar Akun",
    desc:
      lang === "en"
        ? "Are you sure you want to log out of your host account?"
        : "Apakah Anda yakin ingin keluar dari akun host?",
    btnCancel: lang === "en" ? "Cancel" : "Batal",
    btnConfirm: lang === "en" ? "Yes, Log Out" : "Ya, Keluar Akun",
  };

  const handleConfirmClick = useCallback(async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await onConfirm();
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, onConfirm]);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Keyboard accessibility: Escape to close, Enter to confirm
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && !isProcessing) {
        onClose();
      } else if (e.key === "Enter" && !e.shiftKey && !isProcessing) {
        handleConfirmClick();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, isProcessing, handleConfirmClick]);

  return (
    <div
      className="modal-overlay active"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{ zIndex: 1300 }}
    >
      <div
        className="modal"
        style={{
          maxWidth: "490px",
          width: "92vw",
          padding: "28px 30px",
          position: "relative",
          boxShadow: "var(--shadow-lg), 0 20px 40px -15px rgba(239, 68, 68, 0.15)",
        }}
      >
        {/* Top-Right Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label={logoutText.btnCancel}
          style={{
            position: "absolute",
            top: "18px",
            right: "18px",
            background: "none",
            border: "none",
            color: "var(--text-tertiary)",
            cursor: "pointer",
            padding: "6px",
            borderRadius: "var(--radius-sm)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "var(--transition-fast)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-tertiary)")}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
          {/* Logout Icon with Red/Coral Gradient Badge */}
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "rgba(239, 68, 68, 0.12)",
              border: "1px solid rgba(239, 68, 68, 0.22)",
              color: "var(--color-danger)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div style={{ flex: 1, minWidth: 0, paddingRight: "16px" }}>
            <h3
              style={{
                fontSize: "1.18rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                margin: "0 0 6px 0",
                letterSpacing: "-0.01em",
              }}
            >
              {logoutText.title}
            </h3>
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--text-secondary)",
                margin: "0 0 16px 0",
                lineHeight: "1.5",
              }}
            >
              {logoutText.desc}
            </p>

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={onClose}
                disabled={isProcessing}
                style={{ minWidth: "90px" }}
              >
                {logoutText.btnCancel}
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={handleConfirmClick}
                disabled={isProcessing}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  minWidth: "135px",
                  justifyContent: "center",
                  background: "var(--color-danger)",
                  borderColor: "var(--color-danger)",
                  color: "#ffffff",
                  opacity: isProcessing ? 0.75 : 1,
                  cursor: isProcessing ? "not-allowed" : "pointer",
                }}
              >
                {isProcessing ? (
                  <>
                    <span className="btn-spinner" style={{ width: "13px", height: "13px" }}></span>
                    <span>{lang === "en" ? "Wiping session..." : "Membersihkan..."}</span>
                  </>
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
                      <path
                        d="M6.75 15.75H3.75a1.5 1.5 0 01-1.5-1.5V3.75a1.5 1.5 0 011.5-1.5h3M12 12.75L15.75 9 12 5.25M6.75 9h9"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{logoutText.btnConfirm}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
