"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import LogoIcon from "@/components/LogoIcon";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import { getRoom, submitWebsiteToRoom, isSupabaseConfigured } from "@/lib/supabase";
import { translations } from "@/lib/i18n";
import {
  DONATION_TIERS,
  getDonationTier,
  formatRupiah,
  encodeDonationMeta,
} from "@/lib/donationTiers";

function RoomSubmissionContent() {
  const params = useParams();
  const searchParams = useSearchParams();

  const rawHostSlug = params?.hostSlug ? decodeURIComponent(params.hostSlug) : "";
  const hostNameFromSlug = rawHostSlug.replace(/^@/, "").trim() || "Host";
  const roomId = searchParams.get("id");
  const isDailyLimited = searchParams.get("limit") === "1";
  const donateParam = searchParams.get("donate");
  const todayDateStr = new Date().toISOString().slice(0, 10);
  const dailyStorageKey = `webrev_vsub_${hostNameFromSlug.toLowerCase()}_${todayDateStr}`;

  // Language & Theme state
  const [lang, setLang] = useState("id");
  const [theme, setTheme] = useState("light");

  // Room verification state
  const [loadingRoom, setLoadingRoom] = useState(true);
  const [roomData, setRoomData] = useState(null);
  const [roomError, setRoomError] = useState("");

  // Form state
  const [submitterName, setSubmitterName] = useState("");
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [isFastTrack, setIsFastTrack] = useState(false);
  const [donationAmount, setDonationAmount] = useState(10000);
  const [donationTxId, setDonationTxId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [formError, setFormError] = useState("");

  const t = translations[lang] || translations.id;

  // Sync preferences on mount
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("webrev_lang");
      if (savedLang === "en" || savedLang === "id") setLang(savedLang);

      const savedTheme = localStorage.getItem("webrev_theme");
      if (savedTheme === "dark" || savedTheme === "light") {
        setTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
      } else {
        document.documentElement.setAttribute("data-theme", "light");
      }

      // Pre-fill submitter name if they submitted earlier
      const prevName = localStorage.getItem("webrev_viewer_name");
      if (prevName) setSubmitterName(prevName);

      // Check if daily limit is enforced and user already submitted today
      if (isDailyLimited) {
        try {
          const prevSub = localStorage.getItem(dailyStorageKey);
          if (prevSub) {
            const parsedSub = JSON.parse(prevSub);
            if (parsedSub && parsedSub.date === todayDateStr) {
              setSubmittedData(parsedSub);
            }
          }
        } catch (e) {
          console.error("Error reading daily submission record:", e);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [isDailyLimited, dailyStorageKey, todayDateStr]);

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

  const isValidUUID = (str) => {
    return Boolean(
      str &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str)
    );
  };

  // Fetch & Validate Room
  useEffect(() => {
    async function fetchRoom() {
      if (!roomId) {
        setRoomError(
          lang === "en"
            ? `You got the Host name (@${hostNameFromSlug}), but forgot the Room ID! Ask the host for the complete link with "?id=..." in live chat!`
            : `Kamu hanya membawa nama Host (@${hostNameFromSlug}), tapi ID Room tertinggal! Minta link lengkap dengan "?id=..." ke Host di live chat ya!`
        );
        setLoadingRoom(false);
        return;
      }

      // Check if roomId is fake or invalid format
      const hasValidUUID = isValidUUID(roomId);

      if (!isSupabaseConfigured) {
        // In Demo/Local mode: check if room matches active local host
        let localRoom = null;
        try {
          const raw = localStorage.getItem("webrev_active_room");
          if (raw) localRoom = JSON.parse(raw);
        } catch (e) {}

        if (localRoom && localRoom.id === roomId) {
          if (localRoom.host_name.toLowerCase() !== hostNameFromSlug.toLowerCase()) {
            setRoomError(
              lang === "en"
                ? `Hold on! This room belongs to ${localRoom.host_name}, why are you looking for @${hostNameFromSlug}? Please stay in your favorite host's room!`
                : `Tunggu sebentar, room ini milik ${localRoom.host_name}, kenapa link Anda malah mencari @${hostNameFromSlug}? Jangan salah masuk room host lain ya!`
            );
            setLoadingRoom(false);
            return;
          }
          setRoomData(localRoom);
          setLoadingRoom(false);
          return;
        }

        // If random ID or non-existent room in demo mode
        setRoomError(
          lang === "en"
            ? `Host @${hostNameFromSlug} is not live right now or this Room ID is completely made up! Did you just guess the link? Admit it!`
            : `Host @${hostNameFromSlug} sedang tidak live atau ID room ini hasil karangan bebas! Hayo mengaku, Anda asal menebak link ya?`
        );
        setLoadingRoom(false);
        return;
      }

      // If Supabase is configured, but UUID is malformed:
      if (!hasValidUUID) {
        setRoomError(
          lang === "en"
            ? `The Room ID "${roomId}" looks very suspicious and does not exist in the WebRev registry! Double-check the official link shared by @${hostNameFromSlug}!`
            : `ID Room "${roomId}" formatnya tidak valid dan tidak terdaftar di sistem WebRev! Periksa kembali tautan resmi yang dibagikan oleh @${hostNameFromSlug}!`
        );
        setLoadingRoom(false);
        return;
      }

      setLoadingRoom(true);
      const { data, error } = await getRoom(roomId);
      setLoadingRoom(false);

      if (error || !data) {
        setRoomError(
          lang === "en"
            ? `Host @${hostNameFromSlug} is not live right now or this Room ID has vanished into thin air! Did you type it manually?`
            : `Host @${hostNameFromSlug} sedang tidak live atau ID room ini tidak ditemukan! Hayo mengaku, Anda mengetik sendiri link-nya ya?`
        );
        return;
      }

      // Check Host Name mismatch
      if (data.host_name.toLowerCase() !== hostNameFromSlug.toLowerCase()) {
        setRoomError(
          lang === "en"
            ? `Hold on! This live room actually belongs to ${data.host_name}, but your link is looking for @${hostNameFromSlug}. No host-swapping allowed!`
            : `Tunggu dulu! Room ini sebenarnya milik ${data.host_name}, tapi link Anda mencari @${hostNameFromSlug}. Silakan gunakan link yang sesuai!`
        );
        return;
      }

      if (!data.is_active) {
        setRoomError(
          lang === "en"
            ? `Host ${data.host_name}'s live review session has ended! You arrived a bit late, the stream session is already closed!`
            : `Sesi live review bersama ${data.host_name} sudah selesai nih! Anda datang terlambat, acaranya sudah bubar jalan!`
        );
        return;
      }

      setRoomData(data);
    }

    fetchRoom();
  }, [roomId, hostNameFromSlug, lang]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const trimmedName = submitterName.trim();
    let trimmedUrl = url.trim();

    if (!trimmedName) {
      setFormError(
        lang === "en"
          ? "Please enter your name or handle."
          : "Mohon isi nama atau handle media sosial Anda."
      );
      return;
    }

    if (!trimmedUrl) {
      setFormError(
        lang === "en"
          ? "Please enter the website URL to review."
          : "Mohon masukkan URL website yang ingin direview."
      );
      return;
    }

    if (!/^https?:\/\//i.test(trimmedUrl)) {
      trimmedUrl = "https://" + trimmedUrl;
    }

    // Basic domain validation
    try {
      new URL(trimmedUrl);
    } catch {
      setFormError(
        lang === "en"
          ? "Please enter a valid website URL (e.g., example.com)."
          : "Format URL tidak valid (contoh: portofolio.com)."
      );
      return;
    }

    // Check 1 request per day restriction
    if (isDailyLimited) {
      try {
        const prevSub = localStorage.getItem(dailyStorageKey);
        if (prevSub) {
          const parsedSub = JSON.parse(prevSub);
          if (parsedSub && parsedSub.date === todayDateStr) {
            setFormError(
              lang === "en"
                ? "You have already submitted a request today. The host has set a limit of 1 request per day."
                : "Anda sudah mengirimkan 1 kali request hari ini. Host membatasi hanya 1 kali request per hari."
            );
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Validate Fast-Track if active
    if (isFastTrack) {
      const numDonation = Number(donationAmount) || 0;
      if (numDonation <= 0) {
        setFormError(
          lang === "en"
            ? "Please enter the donation amount you provided."
            : "Mohon masukkan nominal donasi yang Anda berikan."
        );
        return;
      }
      if (!donationTxId.trim()) {
        setFormError(
          lang === "en"
            ? "Please enter your Saweria / Trakteer Transaction ID or donor name so the host can verify your VIP priority."
            : "Mohon isi ID Transaksi atau nama donatur di Saweria / Trakteer agar host dapat memverifikasi antrean VIP Anda."
        );
        return;
      }
    }

    setSubmitting(true);

    try {
      // Save name for convenience
      localStorage.setItem("webrev_viewer_name", trimmedName);
    } catch (e) {
      console.error(e);
    }

    const finalNote = isFastTrack && donationAmount > 0
      ? encodeDonationMeta(note.trim(), {
          amount: donationAmount,
          txId: donationTxId.trim(),
          status: "pending_verification",
        })
      : note.trim();

    if (!isSupabaseConfigured) {
      // Demo simulated submission
      setTimeout(() => {
        setSubmitting(false);
        setSubmittedData({
          name: trimmedName,
          url: trimmedUrl,
          note: note.trim(),
          date: todayDateStr,
          donationAmount: isFastTrack ? donationAmount : 0,
          donationTxId: isFastTrack ? donationTxId.trim() : "",
          tier: isFastTrack ? getDonationTier(donationAmount) : null,
        });
      }, 700);
      return;
    }

    const { data, error } = await submitWebsiteToRoom({
      roomId: roomData.id,
      submitterName: trimmedName,
      url: trimmedUrl,
      note: finalNote,
    });

    setSubmitting(false);

    if (error) {
      setFormError(
        error.message ||
          (lang === "en"
            ? "Failed to submit. Please try again."
            : "Gagal mengirim website. Silakan coba lagi.")
      );
      return;
    }

    const submissionResult = {
      name: trimmedName,
      url: trimmedUrl,
      note: note.trim(),
      date: todayDateStr,
      donationAmount: isFastTrack ? donationAmount : 0,
      donationTxId: isFastTrack ? donationTxId.trim() : "",
      tier: isFastTrack ? getDonationTier(donationAmount) : null,
    };

    if (isDailyLimited) {
      try {
        localStorage.setItem(dailyStorageKey, JSON.stringify(submissionResult));
      } catch (e) {
        console.error("Error saving daily submission:", e);
      }
    }

    setSubmittedData(submissionResult);
  };

  const activeHostName = roomData?.host_name || hostNameFromSlug;

  return (
    <div className="viewer-room-page">
      {/* Navbar Minimalis */}
      <header className="viewer-header">
        <div className="viewer-header-inner">
          <div className="viewer-brand">
            <LogoIcon size={28} />
            <span className="brand-text">
              Web<span className="gradient-text">Rev</span>
            </span>
            <span className="viewer-badge-live">LIVE QUEUE</span>
          </div>

          <div className="viewer-header-controls">
            <LanguageSwitcher currentLang={lang} onSelectLang={changeLang} />
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="viewer-container">
        {loadingRoom ? (
          <div className="viewer-card viewer-loading-card">
            <div className="viewer-spinner"></div>
            <h3>{lang === "en" ? "Connecting to Live Room..." : "Menghubungkan ke Room Live..."}</h3>
            <p>{lang === "en" ? "Verifying host session" : "Memverifikasi sesi live host"}</p>
          </div>
        ) : roomError ? (
          <div className="viewer-card viewer-funny-error-card">
            {/* Modern Radar / Scanner Icon */}
            <div className="viewer-funny-icon-wrap">
              <div className="funny-pulse-ring"></div>
              <svg
                className="funny-modern-icon"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a10 10 0 0 1 10 10" />
                <path d="M12 12l5-5" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>

            <span className="viewer-funny-badge">
              {lang === "en" ? "404: HOST NOT DETECTED" : "404: HOST TIDAK DITEMUKAN"}
            </span>

            <h2 className="viewer-funny-title">
              {lang === "en" ? "Wandered into Another Dimension?" : "Waduh, Nyasar ke Dimensi Lain!"}
            </h2>

            <div className="viewer-funny-target">
              <span className="funny-target-label">{lang === "en" ? "Target Host:" : "Host yang Dicari:"}</span>
              <span className="funny-target-name">@{hostNameFromSlug}</span>
            </div>

            <p className="viewer-funny-desc">{roomError}</p>

            {/* Funny Radar Status Box */}
            <div className="viewer-funny-radar">
              <div className="radar-row">
                <span className="radar-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12a10 10 0 0 1 10-10" />
                    <path d="M5 12a7 7 0 0 1 7-7" />
                    <path d="M8 12a4 4 0 0 1 4-4" />
                    <circle cx="12" cy="12" r="1" fill="currentColor" />
                    <path d="M12 13v8" />
                    <path d="M8 21h8" />
                  </svg>
                </span>
                <span className="radar-text">
                  <strong>{lang === "en" ? "Radar Signal:" : "Sinyal Radar:"}</strong>{" "}
                  {lang === "en" ? "0% Host activity detected" : "0% Aktivitas Host terdeteksi"}
                </span>
              </div>
              <div className="radar-row">
                <span className="radar-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <circle cx="12" cy="12" r="4" />
                    <line x1="12" y1="2" x2="12" y2="5" />
                    <line x1="12" y1="19" x2="12" y2="22" />
                    <line x1="2" y1="12" x2="5" y2="12" />
                    <line x1="19" y1="12" x2="22" y2="12" />
                  </svg>
                </span>
                <span className="radar-text">
                  <strong>{lang === "en" ? "Diagnosis:" : "Diagnosa:"}</strong>{" "}
                  {lang === "en" ? "Random guess or typo link detected!" : "Link ngasal atau typo terdeteksi!"}
                </span>
              </div>
            </div>

            <div className="viewer-funny-actions">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 11-.57-8.38l5.67-5.67" />
                </svg>
                <span>{lang === "en" ? "Check Link Again" : "Coba Cek Link Lagi"}</span>
              </button>

              <Link href="/" className="btn btn-secondary" style={{ flex: 1 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span>{lang === "en" ? "WebRev Home" : "Beranda WebRev"}</span>
              </Link>
            </div>
          </div>
        ) : roomData && !roomData.allow_submissions && !submittedData ? (
          <div className="viewer-card viewer-paused-card">
            <div className="viewer-paused-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            </div>
            <h2>{lang === "en" ? "Submissions Paused" : "Penerimaan Antrean Dijeda"}</h2>
            <p className="viewer-card-desc">
              {lang === "en"
                ? `Host ${activeHostName} has temporarily closed new submissions to review the current queue. Please stay tuned to the live stream!`
                : `Host ${activeHostName} sedang menjeda penerimaan antrean baru untuk mereview website yang sudah masuk. Tetap pantau sesi live!`}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-secondary"
              style={{ marginTop: "16px" }}
            >
              {lang === "en" ? "Refresh Status" : "Perbarui Status"}
            </button>
          </div>
        ) : submittedData ? (
          /* SUCCESS CELEBRATION SCREEN */
          <div className="viewer-card viewer-success-card">
            <div className="viewer-success-badge">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <h2 className="viewer-success-title">
              {lang === "en" ? "Successfully Added to Queue!" : "Berhasil Masuk ke Antrean!"}
            </h2>

            <p className="viewer-success-desc">
              {lang === "en"
                ? `Your website has been instantly queued on ${activeHostName}'s live review screen!`
                : `Website Anda telah otomatis masuk ke layar antrean live streaming ${activeHostName}!`}
            </p>

            {/* Priority Fast-Track Celebration Tier */}
            {submittedData.donationAmount > 0 && (
              <div className="viewer-success-priority-tier">
                <div
                  className="tier-badge-large"
                  style={{
                    backgroundColor: submittedData.donationAmount >= 50000 ? "#f59e0b" : "#0284c7",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                  </svg>
                  <span>{submittedData.donationAmount >= 50000 ? (lang === "en" ? "VIP Priority" : "Prioritas VIP") : (lang === "en" ? "Priority Donation" : "Prioritas Donasi")}</span>
                  <span>•</span>
                  <span>{formatRupiah(submittedData.donationAmount)}</span>
                </div>
                <div className="tier-desc-text">
                  <strong>{lang === "en" ? "Priority VIP Queue Activated!" : "Prioritas Antrean Berhasil Terpasang!"}</strong>
                  <br />
                  {lang === "en"
                    ? "Your website has jumped toward the top of the queue. Host will verify your transaction ID shortly."
                    : "Website Anda otomatis diprioritaskan ke urutan teratas antrean. Host akan segera memverifikasi bukti donasi Anda."}
                </div>
              </div>
            )}

            <div className="viewer-submitted-summary">
              <div className="summary-row">
                <span className="summary-label">{lang === "en" ? "Submitter" : "Pengirim"}</span>
                <span className="summary-val">{submittedData.name}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Website</span>
                <span className="summary-val summary-url">{submittedData.url}</span>
              </div>
              {submittedData.note && (
                <div className="summary-row">
                  <span className="summary-label">{lang === "en" ? "Note" : "Catatan"}</span>
                  <span className="summary-val">{submittedData.note}</span>
                </div>
              )}
            </div>

            <div className="viewer-live-hint">
              <div className="pulse-dot-green"></div>
              <span>
                {lang === "en"
                  ? `Keep watching ${activeHostName}'s live stream for your website review!`
                  : `Pantau terus live streaming ${activeHostName} saat giliran website Anda di-review!`}
              </span>
            </div>

            {isDailyLimited ? (
              <div
                style={{
                  marginTop: "24px",
                  padding: "14px 16px",
                  background: "rgba(56, 189, 248, 0.08)",
                  border: "1px solid rgba(56, 189, 248, 0.25)",
                  borderRadius: "var(--radius-sm)",
                  textAlign: "center",
                  fontSize: "0.82rem",
                  color: "var(--text-secondary)",
                  lineHeight: "1.45",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: "4px",
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>
                    {lang === "en" ? "Daily Limit: 1 Request / Day" : "Batasan 1x Request Per Hari Aktif"}
                  </span>
                </div>
                <p style={{ margin: 0 }}>
                  {lang === "en"
                    ? "You have used your submission quota for today. Host will review your website live on stream!"
                    : "Anda telah menggunakan kuota kirim antrean hari ini. Host akan mereview website Anda saat live!"}
                </p>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-secondary"
                style={{ marginTop: "24px", width: "100%" }}
                onClick={() => {
                  setSubmittedData(null);
                  setUrl("");
                  setNote("");
                }}
              >
                {lang === "en" ? "Submit Another Website" : "Kirim Website Lain"}
              </button>
            )}
          </div>
        ) : (
          /* SUBMISSION FORM */
          <div className="viewer-card">
            {/* Host Banner Header */}
            <div className="viewer-host-header">
              <div className="viewer-host-avatar">
                {activeHostName.charAt(0).toUpperCase()}
              </div>
              <div className="viewer-host-info">
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <div className="viewer-live-pill">
                    <span className="pulse-dot-green"></span>
                    <span>LIVE REVIEW</span>
                  </div>
                  {isDailyLimited && (
                    <span
                      style={{
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        padding: "3px 8px",
                        borderRadius: "9999px",
                        background: "rgba(34, 197, 94, 0.12)",
                        color: "#22c55e",
                        border: "1px solid rgba(34, 197, 94, 0.25)",
                      }}
                    >
                      {lang === "en" ? "1 REQUEST / DAY" : "MAKS 1 REQUEST / HARI"}
                    </span>
                  )}
                </div>
                <h1 className="viewer-host-title">
                  {lang === "en" ? "Live Review by" : "Review Website oleh"}{" "}
                  <span className="gradient-text">{activeHostName}</span>
                </h1>
                <p className="viewer-host-sub">
                  {lang === "en"
                    ? "Submit your website to be analyzed live on screen."
                    : "Kirim link website Anda untuk dibahas dan direview langsung saat live."}
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="viewer-form">
              {formError && (
                <div className="viewer-alert-error">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{formError}</span>
                </div>
              )}

              {/* Input Nama Penonton */}
              <div className="form-group">
                <label className="form-label">
                  {lang === "en" ? "Your Name or Handle" : "Nama atau Handle Anda"}
                  <span className="required-star">*</span>
                </label>
                <div className="input-with-icon">
                  <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input
                    type="text"
                    className="form-input"
                    placeholder={lang === "en" ? "e.g. Alex / @alex_dev" : "Misal: Budi / @budi_dev"}
                    value={submitterName}
                    onChange={(e) => setSubmitterName(e.target.value)}
                    maxLength={50}
                    required
                  />
                </div>
              </div>

              {/* Input URL Website */}
              <div className="form-group">
                <label className="form-label">
                  {lang === "en" ? "Website URL" : "URL Website yang Ingin Di-Review"}
                  <span className="required-star">*</span>
                </label>
                <div className="input-with-icon">
                  <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                  </svg>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="contoh: portfolio-anda.vercel.app"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                  />
                </div>
                <span className="form-hint">
                  {lang === "en"
                    ? "No need to type https://, we'll format it automatically."
                    : "Tidak perlu mengetik https://, sistem akan memformat otomatis."}
                </span>
                <div className="quick-tld-row">
                  <span className="quick-tld-hint">Quick:</span>
                  {[".com", ".vercel.app", ".id", ".dev", ".io"].map((ext) => (
                    <button
                      key={ext}
                      type="button"
                      className="quick-tld-chip"
                      onClick={() => {
                        if (!url) {
                          setUrl(ext);
                          return;
                        }
                        if (!url.includes(ext)) {
                          setUrl((prev) => prev.trim() + ext);
                        }
                      }}
                    >
                      {ext}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Catatan Opsional */}
              <div className="form-group">
                <div className="label-with-count">
                  <label className="form-label">
                    {lang === "en" ? "Note / Specific Request (Optional)" : "Catatan Khusus untuk Host (Opsional)"}
                  </label>
                  <span className="char-count">{note.length}/200</span>
                </div>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder={
                    lang === "en"
                      ? "e.g. Please check mobile responsiveness and color harmony..."
                      : "Misal: Tolong cek bagian responsif mobile dan landing page..."
                  }
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  maxLength={200}
                />
              </div>

              {/* Fast-Track Priority Donation Box */}
              <div className={`viewer-fast-track-box ${isFastTrack ? "active-vip" : ""}`}>
                <div
                  className="fast-track-header"
                  onClick={() => setIsFastTrack(!isFastTrack)}
                >
                  <div className="fast-track-title-wrap">
                    <div style={{ color: "#f59e0b", display: "flex", alignItems: "center" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                      </svg>
                    </div>
                    <div>
                      <div className="fast-track-title">
                        {lang === "en"
                          ? "Priority Queue via Donation"
                          : "Prioritas Antrean via Donasi"}
                      </div>
                      <span className="fast-track-pill">
                        {lang === "en" ? "VIP FAST-TRACK" : "PRIORITAS VIP"}
                      </span>
                    </div>
                  </div>
                  <label className="fast-track-toggle-switch" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isFastTrack}
                      onChange={(e) => setIsFastTrack(e.target.checked)}
                    />
                    <span className="fast-track-slider"></span>
                  </label>
                </div>

                <p className="fast-track-desc">
                  {lang === "en"
                    ? "Support the host with a donation to bump your website review to the top of the live stream queue!"
                    : "Dukung host melalui donasi untuk menaikkan review website kamu langsung ke posisi teratas antrean live stream!"}
                </p>

                {isFastTrack && (
                  <div className="fast-track-content" style={{ marginTop: "12px" }}>
                    {/* Host Official Donation Link Button if configured */}
                    {donateParam && (
                      <div className="fast-track-donate-action">
                        <div>
                          <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-primary)" }}>
                            {lang === "en" ? "Host Donation Link:" : "Link Donasi Resmi Host:"}
                          </div>
                          <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>
                            Saweria / Trakteer / Sociabuzz / QRIS
                          </div>
                        </div>
                        <a
                          href={donateParam}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-open-donate"
                        >
                          <span>{lang === "en" ? "Open Donation Link" : "Buka Link Donasi"}</span>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                          </svg>
                        </a>
                      </div>
                    )}

                    {/* Custom Nominal Input */}
                    <div className="form-group" style={{ marginBottom: "12px" }}>
                      <label className="form-label" style={{ fontSize: "0.78rem" }}>
                        {lang === "en" ? "Nominal Donated (Rp)" : "Nominal yang Anda Donasikan (Rp)"}
                        <span className="required-star">*</span>
                      </label>
                      <div className="input-with-icon">
                        <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="9" />
                          <path d="M12 6v12M15 9.5a2.5 2.5 0 00-5 0c0 3 5 2 5 5a2.5 2.5 0 01-5 0" />
                        </svg>
                        <input
                          type="number"
                          min="1000"
                          step="1000"
                          className="form-input"
                          style={{ fontSize: "0.88rem" }}
                          value={donationAmount || ""}
                          onChange={(e) => setDonationAmount(e.target.value ? Number(e.target.value) : "")}
                          placeholder="Contoh: 15000, 25000, 50000"
                          required={isFastTrack}
                        />
                      </div>
                      <span className="form-hint" style={{ fontSize: "0.72rem", marginTop: "4px" }}>
                        {lang === "en"
                          ? "Enter the exact donation amount from your donation receipt."
                          : "Masukkan nominal donasi sesuai yang Anda kirimkan di platform donasi."}
                      </span>
                    </div>

                    {/* Transaction ID / Donor Name */}
                    <div className="form-group" style={{ marginBottom: "6px" }}>
                      <label className="form-label" style={{ fontSize: "0.78rem" }}>
                        {lang === "en"
                          ? "Transaction ID / Donor Name in Saweria/Trakteer"
                          : "ID Transaksi / Nama Donatur di Saweria / Trakteer"}
                        <span className="required-star">*</span>
                      </label>
                      <div className="input-with-icon">
                        <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <rect x="2" y="4" width="20" height="16" rx="2" />
                          <line x1="6" y1="8" x2="10" y2="8" />
                          <line x1="6" y1="12" x2="18" y2="12" />
                          <line x1="6" y1="16" x2="14" y2="16" />
                        </svg>
                        <input
                          type="text"
                          className="form-input"
                          style={{ fontSize: "0.88rem" }}
                          value={donationTxId}
                          onChange={(e) => setDonationTxId(e.target.value)}
                          placeholder={
                            lang === "en"
                              ? "e.g. TRX-94821 or 'Alex Donasi 25k'"
                              : "Contoh: TRX-84729 atau 'Budi Donasi 25k'"
                          }
                          maxLength={80}
                          required={isFastTrack}
                        />
                      </div>
                      <span className="form-hint" style={{ fontSize: "0.72rem", marginTop: "4px" }}>
                        {lang === "en"
                          ? "Host will verify this transaction ID on their dashboard to approve VIP queue placement."
                          : "Host akan mencocokkan ID Transaksi / nama donatur ini di dashboard untuk memverifikasi antrean prioritas."}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary btn-submit-room"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="btn-spinner"></span>
                    <span>{lang === "en" ? "Submitting..." : "Mengirim ke Layar Live..."}</span>
                  </>
                ) : (
                  <>
                    <span>{lang === "en" ? "Submit to Live Queue" : "Kirim ke Antrean Live"}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" fill="currentColor" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="viewer-footer-note">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Powered by <strong>WebRev</strong> Live Stream Assistant</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function RoomPage() {
  return (
    <Suspense
      fallback={
        <div className="viewer-room-page viewer-loading-fullscreen">
          <div className="viewer-spinner"></div>
        </div>
      }
    >
      <RoomSubmissionContent />
    </Suspense>
  );
}
