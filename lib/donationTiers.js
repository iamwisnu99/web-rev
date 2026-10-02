/**
 * WebRev Priority Donation System Helper
 * Method 2: Semi-Otomatis (Input ID Transaksi / Pesan Donasi + Verifikasi Host)
 */

export const DONATION_TIERS = [
  {
    id: "priority",
    tier: "priority",
    name: "Prioritas",
    color: "#0284c7",
    badgeClass: "tier-silver",
    badgeLabel: "Prioritas",
  },
  {
    id: "vip",
    tier: "vip",
    name: "Prioritas VIP",
    color: "#f59e0b",
    badgeClass: "tier-gold",
    badgeLabel: "Prioritas VIP",
    hasGlow: true,
  },
];

// Keyed lookup for backwards compatibility
DONATION_TIERS.BRONZE = DONATION_TIERS[0];
DONATION_TIERS.SILVER = DONATION_TIERS[0];
DONATION_TIERS.GOLD = DONATION_TIERS[1];

export const DONATION_TIER_MAP = {
  priority: DONATION_TIERS[0],
  vip: DONATION_TIERS[1],
  bronze: DONATION_TIERS[0],
  silver: DONATION_TIERS[0],
  gold: DONATION_TIERS[1],
  BRONZE: DONATION_TIERS[0],
  SILVER: DONATION_TIERS[0],
  GOLD: DONATION_TIERS[1],
};

/**
 * Mendapatkan info badge/prioritas berdasarkan nominal donasi
 */
export function getDonationTier(amount) {
  const num = Number(amount) || 0;
  if (num <= 0) return null;
  if (num >= 50000) {
    return {
      id: "vip",
      tier: "vip",
      name: "Prioritas VIP",
      color: "#f59e0b",
      badgeClass: "tier-gold",
      badgeLabel: "Prioritas VIP",
      hasGlow: true,
    };
  }
  return {
    id: "priority",
    tier: "priority",
    name: "Prioritas",
    color: "#0284c7",
    badgeClass: "tier-silver",
    badgeLabel: "Prioritas",
  };
}

/**
 * Format mata uang Rupiah
 */
export function formatRupiah(amount) {
  const num = Number(amount) || 0;
  return "Rp " + num.toLocaleString("id-ID");
}

/**
 * Encode metadata donasi ke dalam string note agar kompatibel dengan database tanpa migrasi paksa
 * Format: [DONASI:amount|TRX:txId|ST:status] catatan pengguna
 */
export function encodeDonationMeta(userNote = "", { amount = 0, txId = "", status = "pending_verification" } = {}) {
  const num = Number(amount) || 0;
  if (num <= 0 && !txId) {
    return (userNote || "").trim();
  }

  const cleanTxId = (txId || "").replace(/[|\]]/g, "").trim();
  const cleanNote = (userNote || "").replace(/^\[DONASI:[^\]]+\]\s*/i, "").trim();
  const metaTag = `[DONASI:${num}|TRX:${cleanTxId}|ST:${status}]`;

  return cleanNote ? `${metaTag} ${cleanNote}` : metaTag;
}

/**
 * Parse metadata donasi dari string note
 */
export function parseDonationMeta(rawNote = "") {
  const str = String(rawNote || "");
  const match = str.match(/^\[DONASI:(\d+)(?:\|TRX:([^|\]]*))?(?:\|ST:([^\]]+))?\]\s*(.*)$/is);

  if (!match) {
    return {
      cleanNote: str.trim(),
      donationAmount: 0,
      donationTxId: "",
      donationStatus: "none",
    };
  }

  const amount = parseInt(match[1], 10) || 0;
  const txId = (match[2] || "").trim();
  const status = (match[3] || "pending_verification").trim();
  const cleanNote = (match[4] || "").trim();

  return {
    cleanNote,
    donationAmount: amount,
    donationTxId: txId,
    donationStatus: status,
  };
}

/**
 * Algoritma Auto-Sorting Antrean Berdasarkan Donasi (Multi-Criteria):
 * 1. Item 'in-progress' (sedang direview) selalu berada di urutan teratas (index 0).
 * 2. Item 'reviewed' (sudah selesai) berada di bagian bawah.
 * 3. Item 'pending' diurutkan berdasarkan:
 *    a. Nominal Donasi Tertinggi (descending)
 *    b. Jika donasi sama, yang terverifikasi lebih dulu di atas
 *    c. Jika status sama, yang submit lebih awal (FIFO - createdAt ascending)
 */
export function sortQueueWithDonations(urls = [], enablePriority = true) {
  if (!enablePriority || !Array.isArray(urls)) return [...urls];

  const inProgress = [];
  const pending = [];
  const reviewed = [];

  urls.forEach((item) => {
    if (item.status === "in-progress") {
      inProgress.push(item);
    } else if (item.status === "reviewed") {
      reviewed.push(item);
    } else {
      pending.push(item);
    }
  });

  pending.sort((a, b) => {
    // Effective donation (jika rejected, hitung sebagai 0)
    const amountA = a.donationStatus === "rejected" ? 0 : Number(a.donationAmount) || 0;
    const amountB = b.donationStatus === "rejected" ? 0 : Number(b.donationAmount) || 0;

    // 1. Donasi tertinggi di atas
    if (amountB !== amountA) {
      return amountB - amountA;
    }

    // 2. Jika sama-sama donasi, yang sudah diverifikasi di atas yang pending
    if (amountA > 0) {
      if (a.donationStatus === "verified" && b.donationStatus !== "verified") return -1;
      if (b.donationStatus === "verified" && a.donationStatus !== "verified") return 1;
    }

    // 3. Waktu submit lebih dulu (FIFO)
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return timeA - timeB;
  });

  return [...inProgress, ...pending, ...reviewed];
}
