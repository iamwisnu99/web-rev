"use client";

import { useState, useEffect } from "react";
import LandingPage from "@/components/LandingPage";
import Dashboard from "@/components/Dashboard";
import LegalPage from "@/components/LegalPage";
import NameModal from "@/components/NameModal";
import LogoutConfirmModal from "@/components/LogoutConfirmModal";
import MobileBlockScreen from "@/components/MobileBlockScreen";
import ToastContainer from "@/components/ToastContainer";
import { clearChromeAccountStorage } from "@/lib/utils";
import { deleteRoom, deleteHostRooms } from "@/lib/supabase";
import { useIsMobile } from "@/lib/deviceDetection";

export default function Home() {
  const [currentPage, setCurrentPage] = useState("landing"); // 'landing' | 'dashboard' | 'legal'
  const [currentUser, setCurrentUser] = useState("");
  const [showNameModal, setShowNameModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [legalTab, setLegalTab] = useState("terms"); // 'terms' | 'privacy' | 'disclaimer'
  const [previousPage, setPreviousPage] = useState("landing");
  const [toasts, setToasts] = useState([]);

  // Language & Theme state
  const [lang, setLang] = useState("id");
  const [theme, setTheme] = useState("light");

  // Mobile Device Detection (Dashboard restricted on smartphones)
  const isMobile = useIsMobile();

  // Load saved preferences on mount
  useEffect(() => {
    try {
      // Language
      const savedLang = localStorage.getItem("webrev_lang");
      if (savedLang === "en" || savedLang === "id") {
        setLang(savedLang);
      }

      // Theme
      const savedTheme = localStorage.getItem("webrev_theme");
      if (savedTheme === "dark" || savedTheme === "light") {
        setTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
      } else {
        document.documentElement.setAttribute("data-theme", "light");
      }

      // User
      const raw = localStorage.getItem("webrev_data");
      if (raw) {
        const data = JSON.parse(raw);
        if (data.user) {
          setCurrentUser(data.user);
          setCurrentPage("dashboard");
        }
      }
    } catch (e) {
      console.error("Error loading saved data:", e);
    }
  }, []);

  const changeLang = (newLang) => {
    setLang(newLang);
    try {
      localStorage.setItem("webrev_lang", newLang);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    try {
      localStorage.setItem("webrev_theme", nextTheme);
    } catch (e) {
      console.error(e);
    }
  };

  const addToast = (message, type = "success") => {
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const handleEnterDashboard = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setCurrentUser(trimmed);
    setCurrentPage("dashboard");
    setShowNameModal(false);

    try {
      const raw = localStorage.getItem("webrev_data");
      const data = raw ? JSON.parse(raw) : {};
      data.user = trimmed;
      localStorage.setItem("webrev_data", JSON.stringify(data));
    } catch (e) {
      console.error("Error saving data:", e);
    }

    addToast(
      lang === "en" ? `Welcome, ${trimmed}!` : `Selamat datang, ${trimmed}!`
    );
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    // 1. Ambil ID room aktif dari localStorage sebelum dibersihkan
    let activeRoomId = null;
    try {
      const rawRoom = localStorage.getItem("webrev_active_room");
      if (rawRoom) {
        const parsed = JSON.parse(rawRoom);
        activeRoomId = parsed?.id;
      }
    } catch (e) {
      console.error(e);
    }

    const hostToClean = currentUser;

    // 2. Hapus sesi room dan UID host dari database Supabase
    try {
      if (activeRoomId) {
        await deleteRoom(activeRoomId);
      }
      if (hostToClean) {
        await deleteHostRooms(hostToClean);
      }
    } catch (err) {
      console.error("[WebRev] Gagal menghapus sesi room dari Supabase:", err);
    }

    // 3. Bersihkan penyimpanan akun dari Chrome storage (localStorage, sessionStorage, cookies)
    clearChromeAccountStorage();
    setCurrentUser("");
    setCurrentPage("landing");
    setShowLogoutModal(false);
    addToast(
      lang === "en"
        ? "Successfully logged out. Storage and Supabase room sessions have been cleared."
        : "Akun berhasil keluar. Penyimpanan lokal dan data room Supabase telah dibersihkan.",
      "info"
    );
  };

  const handleUpdateName = (newName) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setCurrentUser(trimmed);
    try {
      const raw = localStorage.getItem("webrev_data");
      const data = raw ? JSON.parse(raw) : {};
      data.user = trimmed;
      localStorage.setItem("webrev_data", JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
    addToast(
      lang === "en"
        ? `Host name updated to "${trimmed}"`
        : `Nama host berhasil diubah menjadi "${trimmed}"`
    );
  };

  const handleStartClick = () => {
    setShowNameModal(true);
  };

  const handleGoToLanding = () => {
    if (currentPage === "dashboard") {
      setShowLogoutModal(true);
    } else {
      setCurrentPage("landing");
    }
  };

  const handleOpenLegal = (tab = "terms") => {
    setPreviousPage(currentPage);
    setLegalTab(tab);
    setCurrentPage("legal");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBackFromLegal = () => {
    setCurrentPage(previousPage || "landing");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      {currentPage === "landing" && (
        <LandingPage
          onStartClick={handleStartClick}
          onEnterDashboard={handleEnterDashboard}
          lang={lang}
          onSelectLang={changeLang}
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenLegal={handleOpenLegal}
        />
      )}

      {currentPage === "dashboard" && (
        isMobile ? (
          <MobileBlockScreen
            currentUser={currentUser}
            onBackToLanding={() => setCurrentPage("landing")}
            addToast={addToast}
            lang={lang}
            onSelectLang={changeLang}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        ) : (
          <Dashboard
            currentUser={currentUser}
            onLogout={handleLogout}
            onUpdateName={handleUpdateName}
            onLogoClick={handleGoToLanding}
            addToast={addToast}
            lang={lang}
            onSelectLang={changeLang}
            theme={theme}
            onToggleTheme={toggleTheme}
            onOpenLegal={handleOpenLegal}
          />
        )
      )}

      {currentPage === "legal" && (
        <LegalPage
          initialDoc={legalTab}
          lang={lang}
          onSelectLang={changeLang}
          theme={theme}
          onToggleTheme={toggleTheme}
          onBack={handleBackFromLegal}
          backLabel={
            previousPage === "dashboard"
              ? (lang === "en" ? "Back to Dashboard" : "Kembali ke Dashboard")
              : (lang === "en" ? "Back to Home" : "Kembali ke Beranda")
          }
        />
      )}

      {showNameModal && (
        <NameModal
          onSubmit={handleEnterDashboard}
          onClose={() => setShowNameModal(false)}
          lang={lang}
        />
      )}

      {showLogoutModal && (
        <LogoutConfirmModal
          currentUser={currentUser}
          onConfirm={handleConfirmLogout}
          onClose={() => setShowLogoutModal(false)}
          lang={lang}
        />
      )}

      <ToastContainer toasts={toasts} />
    </>
  );
}
