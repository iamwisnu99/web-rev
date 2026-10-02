"use client";

import { useState, useEffect } from "react";
import { translations } from "@/lib/i18n";
import { isSupabaseConfigured } from "@/lib/supabase";
import EndLiveConfirmModal from "./EndLiveConfirmModal";

export default function LiveRoomModal({
  isOpen,
  onClose,
  currentUser,
  activeRoom,
  onCreateRoom,
  onToggleSubmissions,
  onCloseRoom,
  limitOnePerDay = false,
  enablePriorityDonation = true,
  donationLink = "",
  onOpenSettings,
  addToast,
  lang = "id",
}) {
  const [copied, setCopied] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [isEndConfirmOpen, setIsEndConfirmOpen] = useState(false);

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
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!isOpen) return null;

  const t = translations[lang] || translations.id;

  // Format URL: /room/@Wisnu?id={UID}&limit=1&donate={link}
  const hostSlug = `@${encodeURIComponent(currentUser || "Host")}`;
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  let shareableUrl = "";
  if (activeRoom) {
    const params = new URLSearchParams();
    params.set("id", activeRoom.id);
    if (limitOnePerDay) params.set("limit", "1");
    if (enablePriorityDonation && donationLink?.trim()) {
      params.set("donate", donationLink.trim());
    }
    shareableUrl = `${origin}/room/${hostSlug}?${params.toString()}`;
  }

  const handleCopyLink = () => {
    if (!shareableUrl) return;
    navigator.clipboard.writeText(shareableUrl).then(() => {
      setCopied(true);
      addToast(
        lang === "en"
          ? "Live room link copied to clipboard!"
          : "Tautan room live berhasil disalin ke clipboard!",
        "success"
      );
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleCreate = async () => {
    setActionLoading(true);
    await onCreateRoom();
    setActionLoading(false);
  };

  const handleToggle = async () => {
    if (!activeRoom) return;
    setActionLoading(true);
    await onToggleSubmissions(!activeRoom.allow_submissions);
    setActionLoading(false);
  };

  const handleEndRoom = () => {
    setIsEndConfirmOpen(true);
  };

  const handleConfirmEndSession = async () => {
    setActionLoading(true);
    try {
      await onCloseRoom();
    } finally {
      setIsEndConfirmOpen(false);
      setActionLoading(false);
    }
  };

  return (
    <div
      className="modal-overlay active"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{ zIndex: 1200 }}
    >
      <div
        className="modal live-room-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="live-room-modal-title-wrap">
            <div className="live-room-badge-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
                <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
                <circle cx="12" cy="12" r="2" />
                <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
                <path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1" />
              </svg>
            </div>
            <div>
              <h2 className="modal-title">
                {lang === "en" ? "Live Stream Room & Queue" : "Room Antrean Live Stream"}
              </h2>
              <p className="live-room-subtitle">
                {lang === "en"
                  ? "Share your live submission link directly to viewers."
                  : "Bagikan tautan antrean langsung ke penonton live streaming."}
              </p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Supabase Missing Notice (if applicable) */}
        {!isSupabaseConfigured && (
          <div className="supabase-config-notice">
            <div className="notice-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div className="notice-text">
              <strong>{lang === "en" ? "Supabase Not Configured" : "Supabase Belum Dikonfigurasi"}</strong>
              <p>
                {lang === "en"
                  ? "Add NEXT_PUBLIC_SUPABASE_URL & ANON_KEY to .env.local to enable live database sync. Running in demo mode for now."
                  : "Tambahkan NEXT_PUBLIC_SUPABASE_URL & ANON_KEY di .env.local untuk sinkronisasi database live. Saat ini berjalan dalam mode simulasi."}
              </p>
            </div>
          </div>
        )}

        <div className="live-room-modal-body">
          {!activeRoom ? (
            /* CREATE ROOM VIEW */
            <div className="live-room-create-card">
              <div className="create-room-illustration">
                <div className="pulse-ring"></div>
                <div className="pulse-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>
                </div>
              </div>

              <h3>{lang === "en" ? "Ready for Live Stream?" : "Siap Memulai Live Review?"}</h3>
              <p className="create-room-desc">
                {lang === "en"
                  ? "Activate a live room to generate a unique UID and shareable link. Websites submitted by your audience will instantly appear in your queue!"
                  : "Aktifkan room live untuk menghasilkan UID unik dan link publik. Setiap website yang dikirim penonton akan langsung masuk otomatis ke antrean layar Anda!"}
              </p>

              <button
                type="button"
                className="btn btn-primary btn-activate-room"
                onClick={handleCreate}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <>
                    <span className="btn-spinner"></span>
                    <span>{lang === "en" ? "Generating Room..." : "Membuat Room..."}</span>
                  </>
                ) : (
                  <>
                    <span className="pulse-dot-green"></span>
                    <span>
                      {lang === "en"
                        ? `Activate Live Room for @${currentUser}`
                        : `Aktifkan Room Live untuk @${currentUser}`}
                    </span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* ACTIVE ROOM DETAILS */
            <div className="live-room-active-content">
              {/* Status Header */}
              <div className="room-status-banner">
                <div className="room-status-left">
                  <span className="live-badge-pulsing">
                    <span className="pulse-dot-green"></span>
                    {lang === "en" ? "ROOM LIVE ACTIVE" : "ROOM LIVE AKTIF"}
                  </span>
                  <span className="room-host-tag">@{activeRoom.host_name || currentUser}</span>
                </div>

                <div className="room-status-right">
                  <span className="room-uid-label">UID:</span>
                  <code className="room-uid-code" title={activeRoom.id}>
                    {activeRoom.id.substring(0, 13)}...
                  </code>
                </div>
              </div>

              {/* Shareable Link Box */}
              <div className="room-link-box">
                <label className="room-link-label">
                  {lang === "en"
                    ? "Shareable Audience Link (Copy & Paste in Live Chat):"
                    : "Tautan Penonton (Salin & Tempel di Live Chat / Bio):"}
                </label>
                <div className="room-link-input-group">
                  <input
                    type="text"
                    readOnly
                    value={shareableUrl}
                    className="room-link-input"
                    onClick={(e) => e.target.select()}
                  />
                  <button
                    type="button"
                    className={`btn ${copied ? "btn-success" : "btn-primary"} btn-copy-link`}
                    onClick={handleCopyLink}
                  >
                    {copied ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>{lang === "en" ? "Copied!" : "Tersalin!"}</span>
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                        </svg>
                        <span>{lang === "en" ? "Copy Link" : "Salin Link"}</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="room-link-actions-row">
                  <a
                    href={shareableUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="room-preview-link"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    <span>{lang === "en" ? "Preview Audience Form" : "Pratinjau Form Penonton"}</span>
                  </a>
                  <span className="room-link-format-note">
                    Format: <code>room/@{currentUser}?id=...</code>
                  </span>
                </div>

                {/* Limit 1x per day status badge */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginTop: "10px",
                    paddingTop: "8px",
                    borderTop: "1px dashed var(--border-color)",
                    fontSize: "0.76rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        padding: "3px 8px",
                        borderRadius: "9999px",
                        background: limitOnePerDay ? "rgba(34, 197, 94, 0.12)" : "rgba(148, 163, 184, 0.12)",
                        color: limitOnePerDay ? "#22c55e" : "var(--text-tertiary)",
                        fontWeight: 600,
                        border: limitOnePerDay ? "1px solid rgba(34, 197, 94, 0.25)" : "1px solid var(--border-color)",
                      }}
                    >
                      <span
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: limitOnePerDay ? "#22c55e" : "var(--text-tertiary)",
                        }}
                      ></span>
                      {limitOnePerDay
                        ? (lang === "en" ? "Max 1 Request/Day: Active" : "Batasi 1x Request/Hari: Aktif")
                        : (lang === "en" ? "Request Limit: Unlimited" : "Batasan Request: Bebas")}
                    </span>
                  </div>

                  {onOpenSettings && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenSettings();
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--accent-primary)",
                        cursor: "pointer",
                        padding: "2px 4px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
                      </svg>
                      <span>{lang === "en" ? "Configure in Settings" : "Ubah di Pengaturan"}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Submission Toggle Control */}
              <div className="room-toggle-card">
                <div className="toggle-info">
                  <div className="toggle-title">
                    {lang === "en" ? "Allow Viewer Submissions" : "Terima Antrean dari Penonton"}
                  </div>
                  <div className="toggle-desc">
                    {activeRoom.allow_submissions
                      ? lang === "en"
                        ? "Currently OPEN. Anyone with the link can submit websites."
                        : "Sedang DIBUKA. Penonton yang membuka link bisa mengirim website."
                      : lang === "en"
                      ? "Currently PAUSED. Form is locked so you can catch up on queue."
                      : "Sedang DIJEDA. Form terkunci agar host bisa fokus menyelesaikan antrean saat ini."}
                  </div>
                </div>

                <button
                  type="button"
                  className={`btn-toggle-switch ${activeRoom.allow_submissions ? "active" : ""}`}
                  onClick={handleToggle}
                  disabled={actionLoading}
                  aria-label="Toggle submissions"
                >
                  <span className="toggle-switch-thumb"></span>
                </button>
              </div>

              {/* End Room Session Button */}
              <div className="room-danger-zone">
                <button
                  type="button"
                  className="btn btn-danger-outline"
                  onClick={handleEndRoom}
                  disabled={actionLoading}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                  <span>{lang === "en" ? "End Live Room Session" : "Akhiri Sesi Room Live"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modern Custom End Live Confirmation Modal */}
      <EndLiveConfirmModal
        isOpen={isEndConfirmOpen}
        onClose={() => setIsEndConfirmOpen(false)}
        onConfirm={handleConfirmEndSession}
        activeRoom={activeRoom}
        currentUser={currentUser}
        isProcessing={actionLoading}
        lang={lang}
      />
    </div>
  );
}
