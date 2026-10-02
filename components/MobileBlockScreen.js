"use client";

import { useState } from "react";
import LogoIcon from "./LogoIcon";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import { translations } from "@/lib/i18n";

export default function MobileBlockScreen({
  currentUser,
  onBackToLanding,
  addToast,
  lang = "id",
  onSelectLang,
  theme = "light",
  onToggleTheme,
}) {
  const [copied, setCopied] = useState(false);
  const t = translations[lang] || translations.id;
  const mb = t.mobileBlock || {
    badge: "HANYA UNTUK DESKTOP & LAPTOP",
    title: "Dashboard Khusus Layar Desktop",
    subtitle:
      "Dashboard WebRev dirancang khusus sebagai workstation layar lebar untuk mempermudah host live stream dalam mengelola antrean, audit performa Google PageSpeed, dan review split-screen.",
    whyTitle: "Mengapa Dashboard Tidak Tersedia di HP?",
    feature1Title: "Workstation Multi-Panel",
    feature1Desc:
      "Membutuhkan resolusi layar lebar untuk mengelola antrean URL realtime, drag & drop, dan panel kontrol live.",
    feature2Title: "Mode Review Fullscreen Split",
    feature2Desc:
      "Menampilkan situs target di sisi kiri dan 13 checklist panduan profesional di sisi kanan secara simultan.",
    feature3Title: "Audit Kecepatan & Core Web Vitals",
    feature3Desc:
      "Visualisasi grafik performa dan diagnosis teknis Google PageSpeed membutuhkan area kerja luas.",
    detectionNotice:
      "Sistem mendeteksi Anda menggunakan perangkat smartphone (termasuk jika Mode Desktop diaktifkan di browser). Demi kenyamanan dan kemudahan akses, silakan buka Dashboard di komputer atau laptop Anda.",
    allowedNote:
      "Anda tetap dapat mengakses Landing Page dan Form Pengiriman Antrean Penonton (/room/@Host) secara penuh melalui smartphone.",
    btnBackHome: "Kembali ke Beranda",
    btnPreviewRoom: "Lihat Form Penonton",
    btnCopyRoom: "Salin Link Room",
    toastCopied: "Link room penonton berhasil disalin!",
  };

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const hostSlug = `@${encodeURIComponent(currentUser || "Host")}`;
  const roomUrl = `${origin}/room/${hostSlug}`;

  const handleCopyRoomLink = () => {
    if (!roomUrl) return;
    navigator.clipboard.writeText(roomUrl).then(() => {
      setCopied(true);
      if (addToast) addToast(mb.toastCopied, "success");
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="mobile-block-page">
      {/* Top Navbar */}
      <header className="mobile-block-header">
        <div className="mobile-block-header-inner">
          <div className="mobile-block-brand" onClick={onBackToLanding} style={{ cursor: "pointer" }}>
            <LogoIcon size={30} />
            <span className="brand-text">
              Web<span className="gradient-text">Rev</span>
            </span>
            <span className="mobile-block-header-badge">WORKSTATION</span>
          </div>

          <div className="mobile-block-header-actions">
            <LanguageSwitcher lang={lang} onSelectLang={onSelectLang} />
            <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mobile-block-container">
        <div className="mobile-block-card">
          {/* Animated Illustration: Desktop Workstation Required */}
          <div className="mobile-block-illustration-wrap">
            <div className="illustration-glow-ring"></div>
            <div className="illustration-icon-box">
              {/* Desktop Monitor SVG */}
              <svg
                className="desktop-monitor-svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
                <line x1="6" y1="8" x2="10" y2="8" />
                <line x1="6" y1="11" x2="14" y2="11" />
              </svg>

              {/* Mobile Phone Blocked Badge Overlay */}
              <div className="phone-blocked-badge" title="Smartphone not supported for Dashboard">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                  <line x1="3" y1="3" x2="21" y2="21" stroke="#ef4444" strokeWidth="3" />
                </svg>
              </div>
            </div>
          </div>

          {/* Restriction Badge */}
          <div className="mobile-block-pill">
            <span className="pulse-dot-red"></span>
            <span>{mb.badge}</span>
          </div>

          {/* Main Title & Description */}
          <h1 className="mobile-block-title">{mb.title}</h1>
          <p className="mobile-block-desc">{mb.subtitle}</p>

          {/* Detection Alert Banner */}
          <div className="mobile-block-detection-box">
            <div className="detection-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div className="detection-text">
              <p>{mb.detectionNotice}</p>
            </div>
          </div>

          {/* Workstation Reasons List */}
          <div className="mobile-block-features-section">
            <h3 className="features-section-title">{mb.whyTitle}</h3>
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-item-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="9" y1="3" x2="9" y2="21" />
                  </svg>
                </div>
                <div className="feature-item-content">
                  <h4>{mb.feature1Title}</h4>
                  <p>{mb.feature1Desc}</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-item-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
                <div className="feature-item-content">
                  <h4>{mb.feature2Title}</h4>
                  <p>{mb.feature2Desc}</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-item-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
                <div className="feature-item-content">
                  <h4>{mb.feature3Title}</h4>
                  <p>{mb.feature3Desc}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Allowed Pages Note */}
          <div className="mobile-block-allowed-note">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" style={{ flexShrink: 0 }}>
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>{mb.allowedNote}</span>
          </div>

          {/* Action Buttons */}
          <div className="mobile-block-actions">
            <button
              type="button"
              className="btn btn-primary btn-block-home"
              onClick={onBackToLanding}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span>{mb.btnBackHome}</span>
            </button>

            {currentUser && (
              <a
                href={roomUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-block-room"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                <span>{mb.btnPreviewRoom}</span>
              </a>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
