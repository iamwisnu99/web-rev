"use client";

import { useEffect } from "react";
import { translations } from "@/lib/i18n";

export default function EndLiveConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  activeRoom,
  currentUser,
  isProcessing = false,
  lang = "id",
}) {
  const t = translations[lang] || translations.id;
  const eText = t.endLiveModal || {
    title: lang === "en" ? "End Live Room Session?" : "Akhiri Sesi Room Live?",
    desc:
      lang === "en"
        ? "Are you sure you want to end this live room session? The public audience queue link will be immediately deactivated."
        : "Apakah Anda yakin ingin mengakhiri sesi room live ini? Tautan publik antrean penonton akan langsung dinonaktifkan.",
    roomInfo: lang === "en" ? "Active Live Room" : "Room Live Aktif",
    btnCancel: lang === "en" ? "Cancel" : "Batal",
    btnConfirm: lang === "en" ? "Yes, End Session" : "Ya, Akhiri Sesi",
    ending: lang === "en" ? "Ending Session..." : "Mengakhiri Sesi...",
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && !isProcessing) {
        onClose();
      } else if (e.key === "Enter" && !e.shiftKey && !isProcessing) {
        onConfirm();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose, onConfirm, isProcessing]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay active"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isProcessing) onClose();
      }}
      style={{ zIndex: 1350 }}
    >
      <div
        className="modal end-live-confirm-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "480px",
          width: "92vw",
          padding: "26px 28px",
          position: "relative",
          boxShadow: "var(--shadow-lg), 0 20px 45px -15px rgba(239, 68, 68, 0.2)",
        }}
      >
        {/* Close Button Top Right */}
        <button
          type="button"
          onClick={onClose}
          disabled={isProcessing}
          aria-label={eText.btnCancel}
          style={{
            position: "absolute",
            top: "18px",
            right: "18px",
            background: "none",
            border: "none",
            color: "var(--text-tertiary)",
            cursor: isProcessing ? "not-allowed" : "pointer",
            padding: "6px",
            borderRadius: "var(--radius-sm)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "var(--transition-fast)",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
          {/* Danger Warning Icon */}
          <div
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "14px",
              background: "rgba(239, 68, 68, 0.12)",
              color: "var(--color-danger)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h3
              style={{
                fontSize: "1.15rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                margin: "0 0 6px 0",
              }}
            >
              {eText.title}
            </h3>
            <p
              style={{
                fontSize: "0.83rem",
                color: "var(--text-secondary)",
                margin: "0 0 16px 0",
                lineHeight: "1.45",
              }}
            >
              {eText.desc}
            </p>

            {/* Room Summary Info Card */}
            {activeRoom && (
              <div
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-sm)",
                  padding: "10px 14px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}
                >
                  <span style={{ fontSize: "0.74rem", color: "var(--text-tertiary)" }}>
                    {eText.roomInfo}
                  </span>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      color: "#ef4444",
                      background: "rgba(239, 68, 68, 0.1)",
                      padding: "1px 6px",
                      borderRadius: "4px",
                    }}
                  >
                    {lang === "en" ? "Will be closed" : "Akan ditutup"}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span>@{activeRoom.host_name || currentUser}</span>
                  {activeRoom.id && (
                    <code
                      style={{
                        fontSize: "0.74rem",
                        color: "var(--text-tertiary)",
                        background: "var(--bg-tertiary)",
                        padding: "1px 5px",
                        borderRadius: "4px",
                      }}
                    >
                      {activeRoom.id.substring(0, 8)}...
                    </code>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
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
                style={{ minWidth: "85px" }}
              >
                {eText.btnCancel}
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={onConfirm}
                disabled={isProcessing}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  minWidth: "135px",
                  justifyContent: "center",
                }}
              >
                {isProcessing ? (
                  <>
                    <span className="btn-spinner" style={{ width: "14px", height: "14px" }}></span>
                    <span>{eText.ending}</span>
                  </>
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                    <span>{eText.btnConfirm}</span>
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
