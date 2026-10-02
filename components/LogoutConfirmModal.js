"use client";

import { useState, useEffect } from "react";
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
    storageNote:
      lang === "en"
        ? "Chrome storage and active Supabase live room sessions & UID will be completely wiped."
        : "Penyimpanan Chrome serta sesi room live & UID di Supabase akan dihapus dan dibersihkan.",
    storageBadge: lang === "en" ? "Full Data Wipe" : "Pembersihan Data Penuh",
    accountLabel: lang === "en" ? "Active Host Account" : "Akun Host Aktif",
    btnCancel: lang === "en" ? "Cancel" : "Batal",
    btnConfirm: lang === "en" ? "Yes, Log Out" : "Ya, Keluar Akun",
  };

  const handleConfirmClick = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await onConfirm();
    } finally {
      setIsProcessing(false);
    }
  };

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
  }, [onClose, isProcessing]);

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

            {/* Account Card & Chrome Storage Wipe Notice */}
            <div
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-md)",
                padding: "14px 16px",
                marginBottom: "20px",
                boxShadow: "var(--shadow-xs)",
              }}
            >
              {/* User Account Info */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  paddingBottom: "12px",
                  borderBottom: "1px solid var(--border-color)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "var(--accent-primary)",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "0.88rem",
                      flexShrink: 0,
                    }}
                  >
                    {currentUser ? currentUser.charAt(0).toUpperCase() : "H"}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "0.88rem",
                        color: "var(--text-primary)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {currentUser || "Host Live"}
                    </div>
                    <div style={{ fontSize: "0.74rem", color: "var(--text-tertiary)" }}>
                      {logoutText.accountLabel}
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    padding: "3px 8px",
                    borderRadius: "9999px",
                    background: "rgba(239, 68, 68, 0.1)",
                    color: "var(--color-danger)",
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                    flexShrink: 0,
                  }}
                >
                  {logoutText.storageBadge}
                </span>
              </div>

              {/* Storage Cleanup Detail */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                  marginTop: "10px",
                  fontSize: "0.78rem",
                  color: "var(--text-secondary)",
                  lineHeight: "1.45",
                }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ color: "var(--color-warning)", flexShrink: 0, marginTop: "2px" }}
                >
                  <path
                    d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{logoutText.storageNote}</span>
              </div>
            </div>

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
