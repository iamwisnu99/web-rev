"use client";

import { useState, useEffect } from "react";
import LogoIcon from "./LogoIcon";
import AddUrlForm from "./AddUrlForm";
import UrlItem from "./UrlItem";
import ReviewChecklist from "./ReviewChecklist";
import EditModal from "./EditModal";
import ReviewMode from "./ReviewMode";
import PageSpeedModal from "./PageSpeedModal";
import UserProfileMenu from "./UserProfileMenu";
import ChangeNameModal from "./ChangeNameModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import LiveRoomModal from "./LiveRoomModal";
import SettingsModal from "./SettingsModal";
import DonationEditModal from "./DonationEditModal";
import {
  DONATION_TIERS,
  getDonationTier,
  formatRupiah,
  parseDonationMeta,
  encodeDonationMeta,
  sortQueueWithDonations,
} from "@/lib/donationTiers";
import { generateId } from "@/lib/utils";
import { translations } from "@/lib/i18n";
import {
  createLiveRoom,
  getRoom,
  toggleRoomSubmissions,
  closeRoom,
  deleteRoom,
  isSupabaseConfigured,
  supabase,
} from "@/lib/supabase";

export default function Dashboard({
  currentUser,
  onLogout,
  onUpdateName,
  onLogoClick,
  addToast,
  lang = "id",
  onSelectLang,
  theme = "light",
  onToggleTheme,
  onOpenLegal,
}) {
  const [urls, setUrls] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [editingUrl, setEditingUrl] = useState(null);
  const [testingUrl, setTestingUrl] = useState(null);
  const [isChangeNameOpen, setIsChangeNameOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);
  const [navScrolled, setNavScrolled] = useState(false);

  // Live Stream Room & Realtime Queue state
  const [activeRoom, setActiveRoom] = useState(null);
  const [isLiveRoomOpen, setIsLiveRoomOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [limitOnePerDay, setLimitOnePerDay] = useState(false);

  // Priority Donation System state (Method 2)
  const [enablePriorityDonation, setEnablePriorityDonation] = useState(true);
  const [donationLink, setDonationLink] = useState("");
  const [minPriorityDonation, setMinPriorityDonation] = useState(10000);
  const [editingDonationItem, setEditingDonationItem] = useState(null);

  // Fullscreen Review Mode state
  const [isReviewModeOpen, setIsReviewModeOpen] = useState(false);
  const [reviewStartId, setReviewStartId] = useState(null);

  // Drag and Drop state
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [dragOverPosition, setDragOverPosition] = useState(null); // 'top' | 'bottom' | null

  const t = translations[lang] || translations.id;

  // Load URLs from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("webrev_data");
      if (raw) {
        const data = JSON.parse(raw);
        if (data.urls) {
          const parsed = data.urls.map((item) => {
            if (item.donationAmount === undefined && item.note) {
              const meta = parseDonationMeta(item.note);
              return {
                ...item,
                note: meta.cleanNote,
                donationAmount: meta.donationAmount,
                donationTxId: meta.donationTxId,
                donationStatus: meta.donationStatus,
              };
            }
            return item;
          });
          const savedPriority = localStorage.getItem("webrev_enable_priority_donation");
          const isPriEnabled = savedPriority !== null ? savedPriority === "true" : true;
          setUrls(isPriEnabled ? sortQueueWithDonations(parsed, true) : parsed);
        }
      }
    } catch (e) {
      console.error("Error loading URLs:", e);
    }
  }, []);

  // Save URLs to localStorage whenever they change
  useEffect(() => {
    try {
      const raw = localStorage.getItem("webrev_data");
      const data = raw ? JSON.parse(raw) : {};
      data.urls = urls;
      localStorage.setItem("webrev_data", JSON.stringify(data));
    } catch (e) {
      console.error("Error saving URLs:", e);
    }
  }, [urls]);

  // Navbar scroll
  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load settings (limit 1 request per day) from localStorage
  useEffect(() => {
    try {
      const savedLimit = localStorage.getItem("webrev_limit_one_per_day");
      if (savedLimit !== null) {
        setLimitOnePerDay(savedLimit === "true");
      }
      const savedPriority = localStorage.getItem("webrev_enable_priority_donation");
      if (savedPriority !== null) {
        setEnablePriorityDonation(savedPriority === "true");
      }
      const savedDonateLink = localStorage.getItem("webrev_host_donation_link");
      if (savedDonateLink) {
        setDonationLink(savedDonateLink);
      }
      const savedMin = localStorage.getItem("webrev_min_priority_donation");
      if (savedMin) {
        setMinPriorityDonation(parseInt(savedMin, 10) || 10000);
      }
    } catch (e) {
      console.error("Error loading settings:", e);
    }
  }, []);

  const handleToggleLimitOnePerDay = (newValue) => {
    setLimitOnePerDay(newValue);
    try {
      localStorage.setItem("webrev_limit_one_per_day", String(newValue));
    } catch (e) {
      console.error("Error saving limit setting:", e);
    }
    addToast(
      newValue
        ? (lang === "en" ? "Audience queue limited to 1 request/day" : "Antrean penonton dibatasi 1x request per hari")
        : (lang === "en" ? "Audience queue limit removed (Unlimited)" : "Batasan antrean dinonaktifkan (Bebas)"),
      "success"
    );
  };

  const handleToggleEnablePriorityDonation = (val) => {
    setEnablePriorityDonation(val);
    try {
      localStorage.setItem("webrev_enable_priority_donation", String(val));
    } catch (e) {}
    if (val) {
      setUrls((prev) => sortQueueWithDonations(prev, true));
      addToast(
        lang === "en"
          ? "Priority donation sorting enabled (Auto-ranked)!"
          : "Auto-prioritas donasi diaktifkan! Antrean otomatis terurut.",
        "success"
      );
    } else {
      addToast(
        lang === "en" ? "Priority donation sorting disabled." : "Prioritas donasi dinonaktifkan.",
        "info"
      );
    }
  };

  const handleChangeDonationLink = (val) => {
    setDonationLink(val);
    try {
      localStorage.setItem("webrev_host_donation_link", val);
    } catch (e) {}
  };

  const handleChangeMinPriorityDonation = (val) => {
    setMinPriorityDonation(val);
    try {
      localStorage.setItem("webrev_min_priority_donation", String(val));
    } catch (e) {}
  };

  const handleVerifyDonation = (id) => {
    setUrls((prev) => {
      const updated = prev.map((u) => {
        if (u.id === id) {
          return {
            ...u,
            donationStatus: "verified",
          };
        }
        return u;
      });
      return enablePriorityDonation ? sortQueueWithDonations(updated, true) : updated;
    });
    addToast(
      lang === "en" ? "Donation approved & verified!" : "✓ Donasi disetujui & terverifikasi!",
      "success"
    );
  };

  const handleRejectDonation = (id) => {
    setUrls((prev) => {
      const updated = prev.map((u) => {
        if (u.id === id) {
          return {
            ...u,
            donationStatus: "rejected",
          };
        }
        return u;
      });
      return enablePriorityDonation ? sortQueueWithDonations(updated, true) : updated;
    });
    addToast(
      lang === "en" ? "Donation claim rejected. Returned to regular queue." : "✕ Klaim donasi ditolak. Dikembalikan ke antrean biasa.",
      "info"
    );
  };

  const handleSaveDonation = (id, donationData) => {
    setUrls((prev) => {
      const updated = prev.map((u) => {
        if (u.id === id) {
          return {
            ...u,
            donationAmount: donationData.donationAmount,
            donationTxId: donationData.donationTxId,
            donationStatus: donationData.donationStatus,
          };
        }
        return u;
      });
      return enablePriorityDonation ? sortQueueWithDonations(updated, true) : updated;
    });
    addToast(
      donationData.donationAmount > 0
        ? (lang === "en" ? "Priority donation updated & re-ranked!" : "Prioritas donasi diperbarui & antrean disusun ulang!")
        : (lang === "en" ? "Donation removed." : "Prioritas donasi dihapus."),
      "success"
    );
  };

  const handleAutoSortPriority = () => {
    setUrls((prev) => sortQueueWithDonations(prev, true));
    addToast(
      lang === "en"
        ? "Queue sorted by highest donations!"
        : "Antrean berhasil diurutkan berdasarkan donasi tertinggi!",
      "success"
    );
  };

  // Load Active Live Room from localStorage & verify with Supabase
  useEffect(() => {
    try {
      const rawRoom = localStorage.getItem("webrev_active_room");
      if (rawRoom) {
        const parsed = JSON.parse(rawRoom);
        setActiveRoom(parsed);

        // Verify if room is still active on Supabase
        if (parsed.id && isSupabaseConfigured) {
          getRoom(parsed.id)
            .then(({ data, error }) => {
              if (!data || !data.is_active || error) {
                setActiveRoom(null);
                try {
                  localStorage.removeItem("webrev_active_room");
                } catch (e) {}
              } else {
                setActiveRoom(data);
                try {
                  localStorage.setItem("webrev_active_room", JSON.stringify(data));
                } catch (e) {}
              }
            })
            .catch(() => {
              setActiveRoom(null);
              try {
                localStorage.removeItem("webrev_active_room");
              } catch (e) {}
            });
        }
      }
    } catch (e) {
      console.error("Error loading active room:", e);
    }
  }, []);

  // Web Audio Chime for live incoming submission
  const playLiveChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      // AudioContext blocked or not supported
    }
  };

  // Supabase Realtime Listener for Live Queue Submissions
  useEffect(() => {
    if (!activeRoom?.id || !isSupabaseConfigured || !supabase) return;

    const channel = supabase
      .channel(`room-queue-${activeRoom.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "queue_submissions",
          filter: `room_id=eq.${activeRoom.id}`,
        },
        (payload) => {
          const newSub = payload?.new;
          if (!newSub) return;

          playLiveChime();

          const donationMeta = parseDonationMeta(newSub.note);

          const newUrlItem = {
            id: newSub.id || generateId(),
            url: newSub.url,
            note: donationMeta.cleanNote || "",
            rawNote: newSub.note || "",
            submitterName: newSub.submitter_name || (lang === "en" ? "Viewer" : "Penonton"),
            status: "pending",
            createdAt: newSub.created_at ? new Date(newSub.created_at).getTime() : Date.now(),
            fromLiveRoom: true,
            donationAmount: donationMeta.donationAmount || 0,
            donationTxId: donationMeta.donationTxId || "",
            donationStatus: donationMeta.donationStatus || "none",
          };

          setUrls((prev) => {
            if (prev.some((u) => u.id === newUrlItem.id || (u.url === newUrlItem.url && u.submitterName === newUrlItem.submitterName))) {
              return prev;
            }
            const updated = [...prev, newUrlItem];
            return enablePriorityDonation ? sortQueueWithDonations(updated, true) : updated;
          });

          if (donationMeta.donationAmount > 0) {
            const tier = getDonationTier(donationMeta.donationAmount);
            addToast(
              lang === "en"
                ? `${tier?.icon || "💰"} ${newSub.submitter_name} sent a ${tier?.name || "Priority"} request (${formatRupiah(donationMeta.donationAmount)})!`
                : `${tier?.icon || "💰"} ${newSub.submitter_name} mengirim request ${tier?.name || "Prioritas"} (${formatRupiah(donationMeta.donationAmount)})!`,
              "success"
            );
          } else {
            addToast(
              lang === "en"
                ? `${newSub.submitter_name} added ${newSub.url} to queue!`
                : `${newSub.submitter_name} mengirim ${newSub.url} ke antrean!`,
              "success"
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeRoom?.id, enablePriorityDonation, lang]);

  // Live Room Handlers
  const handleCreateRoom = async () => {
    const slug = `@${currentUser || "Host"}`;
    if (!isSupabaseConfigured) {
      const demoRoom = {
        id: crypto.randomUUID ? crypto.randomUUID() : generateId(),
        host_name: currentUser || "Host",
        room_slug: slug,
        is_active: true,
        allow_submissions: true,
        isDemo: true,
      };
      setActiveRoom(demoRoom);
      try {
        localStorage.setItem("webrev_active_room", JSON.stringify(demoRoom));
      } catch (e) {
        console.error(e);
      }
      addToast(
        lang === "en"
          ? "Live room activated (Demo Mode)!"
          : "Room antrean live berhasil diaktifkan!",
        "success"
      );
      return;
    }

    const { data, error } = await createLiveRoom(currentUser, slug);
    if (error || !data) {
      addToast(error?.message || "Gagal membuat room live", "error");
      return;
    }

    setActiveRoom(data);
    try {
      localStorage.setItem("webrev_active_room", JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
    addToast(
      lang === "en"
        ? `Live room for @${currentUser} activated!`
        : `Room antrean live @${currentUser} aktif!`,
      "success"
    );
  };

  const handleToggleSubmissions = async (allow) => {
    if (!activeRoom) return;
    if (!isSupabaseConfigured) {
      const updated = { ...activeRoom, allow_submissions: allow };
      setActiveRoom(updated);
      try {
        localStorage.setItem("webrev_active_room", JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      addToast(
        allow
          ? (lang === "en" ? "Queue opened for submissions" : "Antrean dibuka untuk penonton")
          : (lang === "en" ? "Queue paused" : "Antrean dijeda sementara"),
        "info"
      );
      return;
    }

    const { data, error } = await toggleRoomSubmissions(activeRoom.id, allow);
    if (error || !data) {
      addToast(error?.message || "Gagal mengubah status antrean", "error");
      return;
    }

    setActiveRoom(data);
    try {
      localStorage.setItem("webrev_active_room", JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
    addToast(
      allow
        ? (lang === "en" ? "Queue opened for submissions" : "Antrean dibuka untuk penonton")
        : (lang === "en" ? "Queue paused" : "Antrean dijeda sementara"),
      "info"
    );
  };

  const handleCloseRoom = async () => {
    if (!activeRoom) return;
    const roomId = activeRoom.id;

    // 1. Immediately update local state so UI reflects ended session instantly
    setActiveRoom(null);
    setIsLiveRoomOpen(false);
    try {
      localStorage.removeItem("webrev_active_room");
    } catch (e) {
      console.error(e);
    }

    // 2. Terminate and delete in Supabase safely
    if (isSupabaseConfigured && roomId) {
      try {
        await closeRoom(roomId);
        await deleteRoom(roomId);
      } catch (err) {
        console.error("Error closing live room in Supabase:", err);
      }
    }

    addToast(
      lang === "en"
        ? "Live room session has been ended successfully"
        : "Sesi room live berhasil diakhiri",
      "info"
    );
  };

  // Stats
  const totalUrls = urls.length;
  const reviewedCount = urls.filter((u) => u.status === "reviewed").length;
  const pendingCount = urls.filter((u) => u.status !== "reviewed").length;
  const pendingVerificationCount = urls.filter(
    (u) => (u.donationAmount > 0) && u.donationStatus === "pending_verification"
  ).length;
  const progressPct =
    totalUrls > 0 ? Math.round((reviewedCount / totalUrls) * 100) : 0;

  // Filtered URLs
  const filteredUrls =
    currentFilter === "all"
      ? urls
      : urls.filter((u) => u.status === currentFilter);

  // URL CRUD
  const addUrl = (url, note) => {
    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = "https://" + finalUrl;
    }
    const newItem = {
      id: generateId(),
      url: finalUrl,
      note: note || "",
      status: "pending",
      createdAt: Date.now(),
    };
    setUrls((prev) => [...prev, newItem]);
    addToast(t.dashboard.toastAdded);
  };

  const updateUrl = (id, data) => {
    setUrls((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          let url = data.url || u.url;
          if (data.url && !/^https?:\/\//i.test(url)) url = "https://" + url;
          return { ...u, ...data, url };
        }
        return u;
      })
    );
  };

  const deleteUrl = (id) => {
    setUrls((prev) => prev.filter((u) => u.id !== id));
    addToast(t.dashboard.toastDeleted, "info");
  };

  const cycleStatus = (id) => {
    const order = ["pending", "in-progress", "reviewed"];
    const statusNames = {
      pending: lang === "en" ? "Pending" : "Menunggu",
      "in-progress": lang === "en" ? "In Progress" : "Dalam Proses",
      reviewed: lang === "en" ? "Completed" : "Selesai",
    };
    setUrls((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const currentIdx = order.indexOf(u.status);
          const newStatus = order[(currentIdx + 1) % order.length];
          setTimeout(
            () => addToast(`${t.dashboard.toastStatusChanged}${statusNames[newStatus]}`),
            0
          );
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  const openUrl = (id) => {
    const item = urls.find((u) => u.id === id);
    if (item) window.open(item.url, "_blank", "noopener");
  };

  // Drag and Drop handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const pos = e.clientY < midY ? "top" : "bottom";

    setDragOverIndex(index);
    setDragOverPosition(pos);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
    setDragOverPosition(null);
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      handleDragEnd();
      return;
    }

    let insertIndex = targetIndex;
    if (dragOverPosition === "bottom") {
      insertIndex = targetIndex + 1;
    }
    if (draggedIndex < insertIndex) {
      insertIndex -= 1;
    }

    setUrls((prev) => {
      const updated = [...prev];
      const [movedItem] = updated.splice(draggedIndex, 1);
      updated.splice(insertIndex, 0, movedItem);
      return updated;
    });

    addToast(t.dashboard.toastOrderUpdated);
    handleDragEnd();
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    setDragOverPosition(null);
  };

  // Launch Fullscreen Review Mode
  const startReviewMode = (targetId) => {
    if (urls.length === 0) {
      addToast(t.dashboard.toastEmptyQueue, "info");
      return;
    }
    let idToStart = targetId;
    if (!idToStart) {
      const firstUnreviewed = urls.find((u) => u.status !== "reviewed");
      idToStart = firstUnreviewed ? firstUnreviewed.id : urls[0].id;
    }
    setReviewStartId(idToStart);
    setIsReviewModeOpen(true);
  };

  const filters = [
    { key: "all", label: t.dashboard.filterAll },
    { key: "pending", label: t.dashboard.filterPending },
    { key: "in-progress", label: t.dashboard.filterProgress },
    { key: "reviewed", label: t.dashboard.filterCompleted },
  ];

  return (
    <>
      {/* Dashboard Navbar */}
      <nav className={`navbar navbar-dash ${navScrolled ? "scrolled" : ""}`}>
        <div className="nav-container">
          <div className="nav-logo" onClick={onLogoClick} style={{ cursor: "pointer" }}>
            <span className="logo-icon">
              <LogoIcon />
            </span>
            <span className="logo-text">
              Web<span className="logo-accent">Rev</span>
            </span>
          </div>

          <div className="nav-right">
            {/* Theme Toggle & Language Switcher */}
            <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />
            <LanguageSwitcher lang={lang} onSelectLang={onSelectLang} />

            {/* User Profile Menu with Dropdown (Change Name, Settings & Logout) */}
            <UserProfileMenu
              currentUser={currentUser}
              onOpenChangeName={() => setIsChangeNameOpen(true)}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onLogout={onLogout}
              lang={lang}
            />
          </div>
        </div>
      </nav>

      <main className="dashboard">
        <div className="container">
          {/* Header & Stats */}
          <div className="dash-header">
            <div className="dash-header-left">
              <div className="dash-title-row">
                <h1 className="dash-title">{t.dashboard.title}</h1>
                <button
                  type="button"
                  className={`btn-live-room-pill ${activeRoom ? "is-live" : ""}`}
                  onClick={() => setIsLiveRoomOpen(true)}
                  title={lang === "en" ? "Live Stream Room & Audience Queue" : "Room Antrean Live Stream"}
                >
                  <span className={activeRoom ? "pulse-dot-green" : "pulse-dot-idle"}></span>
                  <span className="live-room-pill-text">
                    {activeRoom
                      ? (lang === "en" ? "Live Room: Active" : "Room Live: Aktif")
                      : (lang === "en" ? "Live Stream Room" : "Room Antrean Live")}
                  </span>
                  {activeRoom ? (
                    <span className="live-room-pill-tag">LIVE</span>
                  ) : (
                    <span className="live-room-pill-tag setup">SETUP</span>
                  )}
                </button>
              </div>
              <p className="dash-subtitle">{t.dashboard.subtitle}</p>
            </div>
            <div className="dash-stats">
              <div className="stat-card">
                <span className="stat-value">{totalUrls}</span>
                <span className="stat-label">{t.dashboard.totalUrl}</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">{reviewedCount}</span>
                <span className="stat-label">{t.dashboard.completed}</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">{pendingCount}</span>
                <span className="stat-label">{t.dashboard.pending}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress-container">
            <div className="progress-info">
              <span className="progress-label">{t.dashboard.progressLabel}</span>
              <span className="progress-value">{progressPct}% ({reviewedCount}/{totalUrls})</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Main Grid */}
          <div className="dash-grid">
            {/* Left Column: Add URL & URL List */}
            <div className="dash-col-main">
              <AddUrlForm onAdd={addUrl} lang={lang} />

              {/* Filters & Action Bar */}
              <div className="filter-bar">
                <div className="filter-tabs">
                  {filters.map((f) => (
                    <button
                      key={f.key}
                      className={`filter-tab ${
                        currentFilter === f.key ? "active" : ""
                      }`}
                      onClick={() => setCurrentFilter(f.key)}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <div className="filter-actions">
                  {enablePriorityDonation && (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleAutoSortPriority()}
                      title={
                        lang === "en"
                          ? "Sort queue by donation priority (VIP first)"
                          : "Urutkan antrean berdasarkan prioritas donasi (VIP teratas)"
                      }
                      style={{ display: "flex", alignItems: "center", gap: "6px" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                      </svg>
                      <span>{lang === "en" ? "Sort Priority" : "Urutkan Donasi"}</span>
                    </button>
                  )}
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => startReviewMode()}
                    disabled={urls.length === 0}
                    style={{ display: "flex", alignItems: "center", gap: "6px" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M4 2.5a.75.75 0 011.13-.65l9 5.5a.75.75 0 010 1.3l-9 5.5A.75.75 0 014 13.5v-11z" />
                    </svg>
                    {t.dashboard.startFullscreenBtn}
                  </button>
                </div>
              </div>

              {/* Pending Donation Verification Alert Banner */}
              {pendingVerificationCount > 0 && (
                <div className="pending-verification-banner">
                  <div className="pending-verification-banner-left">
                    <div className="pending-verification-banner-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                      </svg>
                    </div>
                    <div className="pending-verification-banner-text">
                      <strong>
                        {pendingVerificationCount}{" "}
                        {lang === "en"
                          ? "Priority Donation Request(s) Awaiting Verification"
                          : "Permintaan Donasi Prioritas Menunggu Verifikasi"}
                      </strong>
                      <span>
                        {lang === "en"
                          ? "Check Saweria/Trakteer transaction ID or donor name to approve VIP fast-track."
                          : "Periksa ID Transaksi atau pesan donasi untuk verifikasi antrean VIP."}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost"
                    onClick={() => handleAutoSortPriority()}
                    style={{ whiteSpace: "nowrap", fontSize: "0.78rem" }}
                  >
                    {lang === "en" ? "Sort Now ↗" : "Urutkan Sekarang ↗"}
                  </button>
                </div>
              )}

              {/* Drag and Drop instructions hint */}
              {urls.length > 1 && currentFilter === "all" && (
                <div
                  style={{
                    fontSize: "0.76rem",
                    color: "var(--text-tertiary)",
                    marginBottom: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M8 7v4M8 5h.008" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                  <span>{t.dashboard.dndTip}</span>
                </div>
              )}

              {/* URL List */}
              <div className="url-list">
                {filteredUrls.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <svg
                        width="64"
                        height="64"
                        viewBox="0 0 64 64"
                        fill="none"
                      >
                        <rect
                          x="8"
                          y="8"
                          width="48"
                          height="48"
                          rx="12"
                          stroke="currentColor"
                          strokeWidth="2"
                          opacity="0.3"
                        />
                        <path
                          d="M24 28h16M24 36h10"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          opacity="0.3"
                        />
                        <path
                          d="M32 20v8M28 24h8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          opacity="0.5"
                        />
                      </svg>
                    </div>
                    <h3 className="empty-title">{t.dashboard.emptyTitle}</h3>
                    <p className="empty-desc">{t.dashboard.emptyDesc}</p>
                  </div>
                ) : (
                  filteredUrls.map((item) => {
                    const actualIndex = urls.findIndex((u) => u.id === item.id);
                    const isDragging = draggedIndex === actualIndex;
                    const isOver = dragOverIndex === actualIndex;
                    const overPos = isOver ? dragOverPosition : null;

                    return (
                      <UrlItem
                        key={item.id}
                        item={item}
                        index={actualIndex}
                        totalItems={urls.length}
                        onCycleStatus={cycleStatus}
                        onOpenUrl={openUrl}
                        onStartReview={() => startReviewMode(item.id)}
                        onTestSpeed={(targetUrl) => setTestingUrl(targetUrl)}
                        onEdit={setEditingUrl}
                        onDelete={(targetItem) => setDeletingItem(targetItem)}
                        onEditDonation={(item) => setEditingDonationItem(item)}
                        onVerifyDonation={(item) => handleVerifyDonation(item)}
                        onRejectDonation={(item) => handleRejectDonation(item)}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onDragEnd={handleDragEnd}
                        isDragging={isDragging}
                        dragOverPosition={overPos}
                        lang={lang}
                      />
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column: Review Checklist Guide */}
            <div className="dash-col-side">
              <ReviewChecklist addToast={addToast} lang={lang} />
            </div>
          </div>
        </div>
      </main>

      {/* Dashboard Footer with Legal Navlinks */}
      <footer className="footer dash-footer" style={{ marginTop: "48px" }}>
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <span className="logo-text">
                Web<span className="logo-accent">Rev</span>
              </span>
              <p className="footer-tagline">
                {lang === "en" ? "Live Review Workspace" : "Ruang Kerja Live Review"}
              </p>
            </div>

            {/* Legal Navlinks */}
            <nav className="footer-legal-nav" aria-label="Legal Links">
              <button
                type="button"
                className="footer-legal-link"
                onClick={() => onOpenLegal && onOpenLegal("terms")}
              >
                {lang === "en" ? "Terms & Conditions" : "Syarat & Ketentuan"}
              </button>
              <span className="footer-legal-dot">•</span>
              <button
                type="button"
                className="footer-legal-link"
                onClick={() => onOpenLegal && onOpenLegal("privacy")}
              >
                {lang === "en" ? "Privacy Policy" : "Kebijakan Privasi"}
              </button>
              <span className="footer-legal-dot">•</span>
              <button
                type="button"
                className="footer-legal-link"
                onClick={() => onOpenLegal && onOpenLegal("disclaimer")}
              >
                Disclaimer
              </button>
            </nav>

            <p className="footer-copy">
              © 2026 WebRev. {lang === "en" ? "All rights reserved." : "Hak cipta dilindungi."}
            </p>
          </div>
        </div>
      </footer>

      {/* Edit Modal */}
      {editingUrl && (
        <EditModal
          item={urls.find((u) => u.id === editingUrl)}
          onSave={(id, data) => {
            updateUrl(id, data);
            setEditingUrl(null);
            addToast(t.dashboard.toastEdited);
          }}
          onDelete={(id) => {
            const itemToDelete = urls.find((u) => u.id === id);
            setEditingUrl(null);
            if (itemToDelete) setDeletingItem(itemToDelete);
          }}
          onClose={() => setEditingUrl(null)}
          lang={lang}
        />
      )}

      {/* PageSpeed & Lighthouse Audit Modal */}
      {testingUrl && (
        <PageSpeedModal
          url={testingUrl}
          onClose={() => setTestingUrl(null)}
          lang={lang}
        />
      )}

      {/* Change Host Name Modal */}
      {isChangeNameOpen && (
        <ChangeNameModal
          currentName={currentUser}
          onSave={(newName) => {
            onUpdateName?.(newName);
            setIsChangeNameOpen(false);
          }}
          onClose={() => setIsChangeNameOpen(false)}
          lang={lang}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingItem && (
        <DeleteConfirmModal
          item={deletingItem}
          onConfirm={(id) => {
            deleteUrl(id);
            setDeletingItem(null);
          }}
          onClose={() => setDeletingItem(null)}
          lang={lang}
        />
      )}

      {/* Fullscreen Live Review Mode */}
      {isReviewModeOpen && (
        <ReviewMode
          urls={urls}
          initialUrlId={reviewStartId}
          onClose={() => setIsReviewModeOpen(false)}
          onUpdateUrl={updateUrl}
          addToast={addToast}
          lang={lang}
        />
      )}

      {/* Live Stream Room & Audience Submission Modal */}
      <LiveRoomModal
        isOpen={isLiveRoomOpen}
        onClose={() => setIsLiveRoomOpen(false)}
        currentUser={currentUser}
        activeRoom={activeRoom}
        onCreateRoom={handleCreateRoom}
        onToggleSubmissions={handleToggleSubmissions}
        onCloseRoom={handleCloseRoom}
        limitOnePerDay={limitOnePerDay}
        enablePriorityDonation={enablePriorityDonation}
        donationLink={donationLink}
        onOpenSettings={() => setIsSettingsOpen(true)}
        addToast={addToast}
        lang={lang}
      />

      {/* Settings Modal (Limit 1 request per day & Priority Donations) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        limitOnePerDay={limitOnePerDay}
        onToggleLimitOnePerDay={handleToggleLimitOnePerDay}
        enablePriorityDonation={enablePriorityDonation}
        onToggleEnablePriorityDonation={handleToggleEnablePriorityDonation}
        donationLink={donationLink}
        onChangeDonationLink={handleChangeDonationLink}
        minPriorityDonation={minPriorityDonation}
        onChangeMinPriorityDonation={handleChangeMinPriorityDonation}
        lang={lang}
      />

      {/* Donation Edit & Verification Modal */}
      {editingDonationItem && (
        <DonationEditModal
          item={editingDonationItem}
          onSave={handleSaveDonation}
          onClose={() => setEditingDonationItem(null)}
          lang={lang}
        />
      )}
    </>
  );
}
