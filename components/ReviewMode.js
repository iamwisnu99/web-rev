"use client";

import { useState, useEffect, useRef } from "react";
import LogoIcon from "./LogoIcon";
import PageSpeedPanel from "./PageSpeedPanel";
import { getChecklist } from "@/lib/reviewChecklist";
import { translations } from "@/lib/i18n";

export default function ReviewMode({
  urls,
  initialUrlId,
  onClose,
  onUpdateUrl,
  addToast,
  lang = "id",
}) {
  const [currentId, setCurrentId] = useState(initialUrlId || urls[0]?.id);
  const [activeTab, setActiveTab] = useState("checklist"); // 'checklist' | 'queue'
  const [checkedItems, setCheckedItems] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [deviceMode, setDeviceMode] = useState("desktop"); // 'desktop' | 'tablet' | 'mobile'
  const [iframeKey, setIframeKey] = useState(0);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [useProxy, setUseProxy] = useState(false);
  const [currentNote, setCurrentNote] = useState("");

  const iframeRef = useRef(null);

  const t = translations[lang] || translations.id;
  const checklistData = getChecklist(lang);

  const currentIndex = urls.findIndex((u) => u.id === currentId);
  const currentItem = urls[currentIndex] || urls[0];

  // Request browser fullscreen on enter
  useEffect(() => {
    try {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().then(() => {
          setIsFullscreen(true);
        }).catch(() => {
          // Handled gracefully
        });
      }
    } catch (e) {
      // Ignore
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Sync note when current item changes
  useEffect(() => {
    if (currentItem) {
      setCurrentNote(currentItem.note || "");
      setIframeLoaded(false);
      setIframeKey((k) => k + 1);
    }
  }, [currentId]);

  // Load checklist progress from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("webrev_data");
      if (raw) {
        const data = JSON.parse(raw);
        if (data.checkedItems) setCheckedItems(data.checkedItems);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save checklist progress
  const toggleCheck = (id) => {
    setCheckedItems((prev) => {
      const updated = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      try {
        const raw = localStorage.getItem("webrev_data");
        const data = raw ? JSON.parse(raw) : {};
        data.checkedItems = updated;
        localStorage.setItem("webrev_data", JSON.stringify(data));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const handleClose = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    }
    onClose();
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentId(urls[currentIndex - 1].id);
    }
  };

  const goToNext = () => {
    if (currentIndex < urls.length - 1) {
      setCurrentId(urls[currentIndex + 1].id);
    }
  };

  const handleMarkReviewedAndNext = () => {
    if (!currentItem) return;
    onUpdateUrl(currentItem.id, { status: "reviewed", note: currentNote });
    addToast(`"${currentItem.url}" ${t.reviewMode.markedDoneToast}`);

    if (currentIndex < urls.length - 1) {
      setCurrentId(urls[currentIndex + 1].id);
    }
  };

  const handleSaveNote = () => {
    if (!currentItem) return;
    onUpdateUrl(currentItem.id, { note: currentNote });
    addToast(t.reviewMode.noteSavedToast);
  };

  const handleOpenPopupStudio = () => {
    if (!currentItem?.url) return;
    let width = 1200;
    let height = 800;

    if (deviceMode === "mobile") {
      width = 412;
      height = 892;
    } else if (deviceMode === "tablet") {
      width = 768;
      height = 1024;
    }

    const left = Math.max(0, Math.round((window.screen.width - width) / 2));
    const top = Math.max(0, Math.round((window.screen.height - height) / 2));

    const popup = window.open(
      currentItem.url,
      "WebRevLiveStudioPreview",
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,status=no,toolbar=no,menubar=no,location=yes`
    );
    if (popup) {
      addToast(t.reviewMode.popupStudioToast);
    }
  };

  const handleToggleProxy = () => {
    setUseProxy((prev) => {
      const next = !prev;
      addToast(next ? t.reviewMode.proxyActivatedToast : t.reviewMode.directActivatedToast);
      setIframeKey((k) => k + 1);
      return next;
    });
  };

  const totalUrls = urls.length;
  const reviewedCount = urls.filter((u) => u.status === "reviewed").length;
  const progressPct = totalUrls > 0 ? Math.round((reviewedCount / totalUrls) * 100) : 0;
  const checkedChecklistCount = checkedItems.length;

  if (!currentItem) return null;

  return (
    <div className="review-mode">
      {/* Top Header */}
      <header className="review-header">
        <div className="review-header-left">
          <div className="nav-logo" style={{ cursor: "default" }}>
            <span className="logo-icon">
              <LogoIcon />
            </span>
            <span className="logo-text">
              Web<span className="logo-accent">Rev</span>
            </span>
          </div>
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: "9999px",
              background: "var(--accent-subtle)",
              color: "var(--accent-primary)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "var(--color-success)",
                display: "inline-block",
                boxShadow: "0 0 8px rgba(16,185,129,0.5)",
              }}
            />
            {t.reviewMode.liveReview}
          </span>
        </div>

        {/* Center: Current URL & Controls */}
        <div className="review-header-center">
          <div className="review-current-url">
            <button
              className="url-action-btn"
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              style={{ opacity: currentIndex === 0 ? 0.3 : 1 }}
              title={t.reviewMode.prevWebsite}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "var(--text-tertiary)",
                background: "var(--bg-tertiary)",
                padding: "3px 8px",
                borderRadius: "6px",
              }}
            >
              {currentIndex + 1} / {totalUrls}
            </span>

            <span className="url-display" title={currentItem.url}>
              {currentItem.url}
            </span>

            <button
              className="url-action-btn"
              onClick={goToNext}
              disabled={currentIndex === urls.length - 1}
              style={{ opacity: currentIndex === urls.length - 1 ? 0.3 : 1 }}
              title={t.reviewMode.nextWebsite}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="review-header-right">
          <button
            className={`btn btn-sm ${
              currentItem.status === "reviewed" ? "btn-secondary" : "btn-primary"
            }`}
            onClick={handleMarkReviewedAndNext}
            title={t.reviewMode.markReviewedAndNext}
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13.33 4L6 11.33 2.67 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {currentItem.status === "reviewed" ? t.reviewMode.reviewedDone : t.reviewMode.markReviewedAndNext}
          </button>

          {/* External Tab */}
          <button
            className="url-action-btn"
            onClick={() => window.open(currentItem.url, "_blank", "noopener")}
            title={t.reviewMode.openInNewTab}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 8.67v4a1.33 1.33 0 01-1.33 1.33H3.33A1.33 1.33 0 012 12.67V5.33A1.33 1.33 0 013.33 4h4M10 2h4v4M6.67 9.33L14 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Fullscreen toggle */}
          <button
            className="url-action-btn"
            onClick={handleToggleFullscreen}
            title={isFullscreen ? t.reviewMode.exitFullscreen : t.reviewMode.toggleFullscreen}
          >
            {isFullscreen ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 6h3V3M13 6h-3V3M3 10h3v3M13 10h-3v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 6V2h4M10 2h4v4M2 10v4h4M10 14h4v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>

          {/* Close review mode */}
          <button
            className="btn btn-ghost btn-sm"
            onClick={handleClose}
            title={t.reviewMode.exitReviewMode}
            style={{ color: "var(--color-danger)" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            {t.reviewMode.exitReviewMode}
          </button>
        </div>
      </header>

      {/* Main Review Body */}
      <div className="review-body">
        {/* Left Side: Website Viewport */}
        <div className="review-iframe-panel">
          {/* Viewport Sub-header */}
          <div
            style={{
              padding: "8px 16px",
              background: "var(--bg-secondary)",
              borderBottom: "1px solid var(--border-color)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "0.8rem",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-tertiary)" }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <rect x="3" y="6" width="10" height="8" rx="2" stroke="currentColor" strokeWidth="1.3" />
                <path d="M5 6V4a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.3" />
              </svg>
              <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
                {currentItem.url}
              </span>
              {useProxy && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "2px 8px",
                    borderRadius: "999px",
                    background: "rgba(16, 185, 129, 0.15)",
                    color: "#10b981",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                  }}
                >
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }} />
                  {t.reviewMode.proxyModeActive}
                </span>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              {/* Bypass Proxy Toggle Button */}
              <button
                type="button"
                onClick={handleToggleProxy}
                title={useProxy ? t.reviewMode.backToDirect : t.reviewMode.tryProxyBypass}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  background: useProxy ? "rgba(16, 185, 129, 0.15)" : "var(--bg-tertiary)",
                  color: useProxy ? "#10b981" : "var(--text-secondary)",
                  border: useProxy ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid var(--border-color)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
                <span>{useProxy ? t.reviewMode.proxyModeActive : t.reviewMode.tryProxyBypass}</span>
              </button>

              {/* Pop-up Studio Button */}
              <button
                type="button"
                onClick={handleOpenPopupStudio}
                title={`${t.reviewMode.popupStudioDesc} (${deviceMode.toUpperCase()})`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  background: "var(--bg-tertiary)",
                  color: "var(--text-secondary)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  border: "1px solid var(--border-color)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                <span>{t.reviewMode.popupStudio}</span>
              </button>

              {/* Device Mode Switcher */}
              <div
                style={{
                  display: "flex",
                  background: "var(--bg-tertiary)",
                  borderRadius: "6px",
                  padding: "2px",
                }}
              >
                <button
                  type="button"
                  style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    background: deviceMode === "desktop" ? "var(--bg-secondary)" : "transparent",
                    color: deviceMode === "desktop" ? "var(--accent-primary)" : "var(--text-tertiary)",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    boxShadow: deviceMode === "desktop" ? "var(--shadow-xs)" : "none",
                  }}
                  onClick={() => setDeviceMode("desktop")}
                  title={`${t.reviewMode.desktopView} (100%)`}
                >
                  {t.reviewMode.desktopView}
                </button>
                <button
                  type="button"
                  style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    background: deviceMode === "tablet" ? "var(--bg-secondary)" : "transparent",
                    color: deviceMode === "tablet" ? "var(--accent-primary)" : "var(--text-tertiary)",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    boxShadow: deviceMode === "tablet" ? "var(--shadow-xs)" : "none",
                  }}
                  onClick={() => setDeviceMode("tablet")}
                  title={`${t.reviewMode.tabletView} (768px)`}
                >
                  {t.reviewMode.tabletView}
                </button>
                <button
                  type="button"
                  style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    background: deviceMode === "mobile" ? "var(--bg-secondary)" : "transparent",
                    color: deviceMode === "mobile" ? "var(--accent-primary)" : "var(--text-tertiary)",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    boxShadow: deviceMode === "mobile" ? "var(--shadow-xs)" : "none",
                  }}
                  onClick={() => setDeviceMode("mobile")}
                  title={`${t.reviewMode.mobileView} (375px)`}
                >
                  {t.reviewMode.mobileView}
                </button>
              </div>

              {/* Refresh iframe button */}
              <button
                className="url-action-btn"
                onClick={() => setIframeKey((k) => k + 1)}
                title={t.reviewMode.reloadView}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M14 8A6 6 0 114.54 3.54" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M14 2v4h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Iframe Viewport Container */}
          <div
            style={{
              flex: 1,
              background: "var(--bg-primary)",
              display: "flex",
              justifyContent: "center",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                width:
                  deviceMode === "desktop"
                    ? "100%"
                    : deviceMode === "tablet"
                    ? "768px"
                    : "375px",
                height: "100%",
                background: "#ffffff",
                transition: "width 0.3s var(--ease-out)",
                boxShadow:
                  deviceMode !== "desktop"
                    ? "0 0 25px rgba(0,0,0,0.2)"
                    : "none",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              <iframe
                key={`${iframeKey}-${useProxy ? "proxy" : "direct"}`}
                ref={iframeRef}
                src={
                  useProxy
                    ? `/api/proxy?url=${encodeURIComponent(currentItem.url)}`
                    : currentItem.url
                }
                title={`Review ${currentItem.url}`}
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
                onLoad={() => setIframeLoaded(true)}
              />

              {/* Helpful fallback banner at bottom of preview */}
              <div
                style={{
                  padding: "8px 16px",
                  background: "var(--bg-secondary)",
                  borderTop: "1px solid var(--border-color)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "8px",
                  fontSize: "0.78rem",
                  color: "var(--text-tertiary)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {useProxy ? (
                    <>
                      <span
                        style={{
                          display: "inline-block",
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "#10b981",
                        }}
                      />
                      <span style={{ color: "var(--text-secondary)" }}>
                        {t.reviewMode.proxyModeNotice}
                      </span>
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      <span>{t.reviewMode.directModeNotice}</span>
                    </>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {!useProxy ? (
                    <button
                      type="button"
                      onClick={handleToggleProxy}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        color: "var(--accent-primary)",
                        fontWeight: 600,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                      </svg>
                      {t.reviewMode.tryProxyBypass}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleToggleProxy}
                      style={{
                        color: "var(--text-tertiary)",
                        fontWeight: 500,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                    >
                      {t.reviewMode.backToDirect}
                    </button>
                  )}
                  <span style={{ color: "var(--border-color)" }}>•</span>
                  <button
                    type="button"
                    onClick={handleOpenPopupStudio}
                    title={t.reviewMode.popupStudioDesc}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      color: "var(--text-secondary)",
                      fontWeight: 600,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                    {t.reviewMode.popupStudio}
                  </button>
                  <span style={{ color: "var(--border-color)" }}>•</span>
                  <button
                    type="button"
                    onClick={() => window.open(currentItem.url, "_blank", "noopener,noreferrer")}
                    style={{
                      color: "var(--text-secondary)",
                      fontWeight: 600,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {t.reviewMode.openInNewTab} ↗
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Host Live Review Sidebar */}
        <aside className="review-sidebar">
          {/* Sidebar Tabs */}
          <div className="review-sidebar-tabs">
            <button
              className={`review-sidebar-tab ${
                activeTab === "checklist" ? "active" : ""
              }`}
              onClick={() => setActiveTab("checklist")}
            >
              {t.reviewMode.tabChecklist} ({checkedChecklistCount}/{checklistData.length})
            </button>
            <button
              className={`review-sidebar-tab ${
                activeTab === "queue" ? "active" : ""
              }`}
              onClick={() => setActiveTab("queue")}
            >
              {t.reviewMode.tabQueue} ({currentIndex + 1}/{totalUrls})
            </button>
            <button
              className={`review-sidebar-tab ${
                activeTab === "speed" ? "active" : ""
              }`}
              onClick={() => setActiveTab("speed")}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" strokeLinecap="round" />
              </svg>
              <span>{lang === "en" ? "Speed & Audit" : "Audit Speed"}</span>
            </button>
          </div>

          {/* Sidebar Tab 1: Checklist & Notes */}
          {activeTab === "checklist" && (
            <div className="review-sidebar-content">
              {/* Host Live Notes for this Website */}
              <div
                style={{
                  background: "var(--bg-primary)",
                  padding: "12px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-color)",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <label
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      color: "var(--text-secondary)",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M13.33 4.67l-2-2L3.33 10.67V12.67h2l8-8z"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {t.reviewMode.notesLabel}
                  </label>
                  {currentNote !== (currentItem.note || "") && (
                    <button
                      type="button"
                      onClick={handleSaveNote}
                      style={{
                        fontSize: "0.72rem",
                        color: "var(--accent-primary)",
                        fontWeight: 600,
                      }}
                    >
                      {t.reviewMode.saveNoteBtn}
                    </button>
                  )}
                </div>
                <textarea
                  className="input"
                  rows={2}
                  style={{
                    fontSize: "0.82rem",
                    padding: "8px 10px",
                    resize: "vertical",
                    background: "var(--bg-secondary)",
                    height: "auto",
                    lineHeight: "1.4",
                  }}
                  placeholder={t.reviewMode.notesPlaceholder}
                  value={currentNote}
                  onChange={(e) => setCurrentNote(e.target.value)}
                  onBlur={handleSaveNote}
                />
              </div>

              {/* 13 Checklist Items */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {checklistData.map((c, i) => {
                  const isChecked = checkedItems.includes(c.id);
                  const isExpanded = expandedId === c.id;

                  return (
                    <div
                      key={c.id}
                      style={{
                        border: "1px solid var(--border-color)",
                        borderRadius: "var(--radius-sm)",
                        background: isChecked ? "var(--accent-subtle)" : "var(--bg-card)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        className={`review-checklist-item ${isChecked ? "checked" : ""}`}
                        style={{ padding: "8px 10px" }}
                      >
                        <div
                          className="review-cl-checkbox"
                          onClick={() => toggleCheck(c.id)}
                        >
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                            <path
                              d="M2.5 6L5 8.5L9.5 3.5"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <div
                          className="review-cl-label"
                          onClick={() => toggleCheck(c.id)}
                          style={{ flex: 1 }}
                        >
                          {i + 1}. {c.label}
                        </div>
                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : c.id)}
                          style={{
                            padding: "2px 6px",
                            color: "var(--text-tertiary)",
                            fontSize: "0.75rem",
                          }}
                          title="Detail"
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 14 14"
                            fill="none"
                            style={{
                              transform: isExpanded ? "rotate(180deg)" : "none",
                              transition: "transform 0.2s",
                            }}
                          >
                            <path
                              d="M3.5 5.25L7 8.75l3.5-3.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </div>

                      {isExpanded && (
                        <div
                          style={{
                            padding: "8px 12px 10px 38px",
                            fontSize: "0.76rem",
                            color: "var(--text-secondary)",
                            background: "var(--bg-tertiary)",
                            lineHeight: "1.5",
                          }}
                        >
                          {c.detail}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sidebar Tab 2: Queue of URLs */}
          {activeTab === "queue" && (
            <div className="review-sidebar-content">
              <div
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: "var(--text-secondary)",
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>{t.reviewMode.queueHeading}</span>
                <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>
                  {t.reviewMode.queueSubheading}
                </span>
              </div>

              {urls.map((u, idx) => {
                const isCurrent = u.id === currentItem.id;

                return (
                  <div
                    key={u.id}
                    className={`review-queue-item ${isCurrent ? "current" : ""}`}
                    onClick={() => setCurrentId(u.id)}
                  >
                    <span className="review-queue-num">{idx + 1}</span>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="review-queue-url" title={u.url}>
                        {u.url}
                      </div>
                      {u.note && (
                        <div
                          style={{
                            fontSize: "0.72rem",
                            color: "var(--text-muted)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {u.note}
                        </div>
                      )}
                    </div>

                    <span
                      className={`url-status-badge ${u.status}`}
                      style={{ fontSize: "0.68rem", padding: "2px 8px" }}
                    >
                      {u.status === "reviewed"
                        ? t.reviewMode.statusReviewed
                        : u.status === "in-progress"
                        ? t.reviewMode.statusProgress
                        : t.reviewMode.statusPending}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Sidebar Tab 3: PageSpeed & Lighthouse Audit */}
          {activeTab === "speed" && (
            <div className="review-sidebar-content" style={{ padding: "16px" }}>
              <PageSpeedPanel url={currentItem.url} lang={lang} />
            </div>
          )}

          {/* Sidebar Bottom Footer: Progress & Navigation */}
          <div className="review-sidebar-footer">
            <div className="review-progress-bar">
              <div
                className="review-progress-fill"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="review-progress-text">
              {reviewedCount} / {totalUrls} {t.reviewMode.progressText} ({progressPct}%)
            </div>

            <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={goToPrevious}
                disabled={currentIndex === 0}
                style={{
                  flex: 1,
                  opacity: currentIndex === 0 ? 0.4 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M10 12L6 8l4-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {t.reviewMode.prevBtn}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={goToNext}
                disabled={currentIndex === urls.length - 1}
                style={{
                  flex: 1,
                  opacity: currentIndex === urls.length - 1 ? 0.4 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                {t.reviewMode.nextBtn}
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M6 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
