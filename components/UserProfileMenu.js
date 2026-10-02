"use client";

import { useState, useRef, useEffect } from "react";
import { translations } from "@/lib/i18n";

export default function UserProfileMenu({
  currentUser,
  onOpenChangeName,
  onOpenSettings,
  onLogout,
  lang = "id",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const t = translations[lang] || translations.id;
  const userMenuText = t.userMenu || {
    role: lang === "en" ? "Live Review Host" : "Host Live Review",
    changeName: lang === "en" ? "Change Name" : "Ubah Nama",
    changeNameDesc: lang === "en" ? "Update your host account name" : "Ganti nama akun host Anda",
    settings: lang === "en" ? "Settings" : "Pengaturan",
    settingsDesc: lang === "en" ? "Manage viewer queue limits" : "Atur batas antrean penonton",
    logout: lang === "en" ? "Logout" : "Keluar",
    logoutDesc: lang === "en" ? "Return to landing page" : "Kembali ke halaman utama",
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="user-profile-menu" ref={menuRef} style={{ position: "relative" }}>
      {/* Profile Trigger Button without Background */}
      <button
        type="button"
        className="user-profile-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={lang === "en" ? "Host Account Menu" : "Menu Akun Host"}
      >
        <div className="user-avatar">
          {currentUser ? currentUser.charAt(0).toUpperCase() : "H"}
        </div>
        <span className="user-name">{currentUser}</span>
        <svg
          className={`user-chevron ${isOpen ? "open" : ""}`}
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Smooth Modern Dropdown */}
      {isOpen && (
        <div className="user-dropdown-menu">
          {/* Header Info */}
          <div className="user-dropdown-header">
            <div className="user-dropdown-avatar">
              {currentUser ? currentUser.charAt(0).toUpperCase() : "H"}
            </div>
            <div className="user-dropdown-info">
              <span className="user-dropdown-name">{currentUser}</span>
              <span className="user-dropdown-role">{userMenuText.role}</span>
            </div>
          </div>

          <div className="user-dropdown-divider" />

          {/* Option 1: Change Name */}
          <button
            type="button"
            className="user-dropdown-item"
            onClick={() => {
              setIsOpen(false);
              onOpenChangeName();
            }}
          >
            <div className="user-dropdown-item-icon edit-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M11.33 2a1.89 1.89 0 012.67 2.67L5.33 13.33 2 14l.67-3.33L11.33 2z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="user-dropdown-item-text">
              <span className="user-dropdown-item-title">{userMenuText.changeName}</span>
              <span className="user-dropdown-item-desc">{userMenuText.changeNameDesc}</span>
            </div>
          </button>

          {/* Option 2: Settings */}
          <button
            type="button"
            className="user-dropdown-item"
            onClick={() => {
              setIsOpen(false);
              onOpenSettings();
            }}
          >
            <div className="user-dropdown-item-icon settings-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
              </svg>
            </div>
            <div className="user-dropdown-item-text">
              <span className="user-dropdown-item-title">{userMenuText.settings}</span>
              <span className="user-dropdown-item-desc">{userMenuText.settingsDesc}</span>
            </div>
          </button>

          {/* Option 3: Logout */}
          <button
            type="button"
            className="user-dropdown-item logout"
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
          >
            <div className="user-dropdown-item-icon logout-icon">
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <path
                  d="M6.75 15.75H3.75a1.5 1.5 0 01-1.5-1.5V3.75a1.5 1.5 0 011.5-1.5h3M12 12.75L15.75 9 12 5.25M6.75 9h9"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="user-dropdown-item-text">
              <span className="user-dropdown-item-title">{userMenuText.logout}</span>
              <span className="user-dropdown-item-desc">{userMenuText.logoutDesc}</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
