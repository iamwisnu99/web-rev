<div align="center">

# ⚡ WebRev

**Modern Realtime Live Stream Website Review Workspace & Audience Queue Platform**

*Didesain dan dikembangkan secara eksklusif untuk kreator konten, host live streaming, dan web developer.*

[![Next.js](https://img.shields.io/badge/Next.js-16.3.8-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Realtime%20Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Turbopack](https://img.shields.io/badge/Bundler-Turbopack-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://turbo.build/)
[![License](https://img.shields.io/badge/License-Proprietary%20All%20Rights%20Reserved-red?style=for-the-badge)](./LICENSE)
[![Owned by](https://img.shields.io/badge/Owned%20by-Primadev%20Digital%20Technology-blue?style=for-the-badge)](https://primadev.id)

<br />

[✨ Fitur Utama](#-fitur-utama) •
[⚡ Sistem Prioritas Donasi](#-sistem-prioritas-donasi-fast-track--vip) •
[🛠️ Teknologi](#️-teknologi) •
[🚀 Panduan Instalasi](#-panduan-instalasi) •
[📁 Struktur Proyek](#-struktur-proyek) •
[📄 Hak Cipta & Lisensi](#-hak-cipta--lisensi)

</div>

---

## 📖 Tentang WebRev

**WebRev** adalah platform asisten interaktif yang dirancang khusus untuk mempermudah sesi **Live Streaming Website Review** (di platform seperti YouTube Live, TikTok Live, Twitch, dsb). 

Dengan WebRev, Host live streaming tidak perlu lagi repot mencatat link dari obrolan live chat yang cepat terlewat. Penonton dapat langsung mengirimkan link website mereka ke **Room Antrean Live**, dan sistem akan menyajikannya secara realtime di layar kerja Host lengkap dengan **Mode Review Layar Penuh**, **Audit Performa Otomatis**, dan **Sistem Prioritas Donasi VIP**.

---

## ✨ Fitur Utama

### 1. 🎥 Room Antrean Penonton Realtime (`/room/[hostSlug]`)
- **Tautan Khusus Host**: Host dapat membuat sesi room live dan membagikan tautan unik (misal: `/room/@NamaHost?id=...`).
- **Input Penonton Mudah**: Penonton memasukkan nama/handle sosial media, URL website (otomatis diformat), dan catatan khusus untuk Host.
- **Sinkronisasi Supabase Realtime**: Setiap kiriman baru langsung muncul seketika di dashboard Host tanpa reload.
- **Notifikasi Audio Chime**: Dashboard Host membunyikan nada chime sintetis Web Audio saat ada website baru yang masuk ke antrean.
- **Batasan 1x Request Per Hari (Opsional)**: Host dapat mengaktifkan filter untuk membatasi 1 kiriman per penonton per hari.

### 2. ⚡ Sistem Prioritas Donasi (Fast-Track / VIP)
- **Semi-Otomatis (Metode 2)**: Penonton yang berdonasi (via Saweria, Trakteer, Sociabuzz, atau QRIS) dapat mengisi nominal donasi dan ID transaksi/nama donatur.
- **Auto-Sorting Dinamis**: Antrean otomatis menempatkan nominal donasi tertinggi di posisi paling atas (misal: 50k > 25k > 10k > reguler), dengan aturan FIFO untuk donasi seimbang.
- **Perlindungan Review Aktif**: Website yang sedang dalam proses review (`in-progress`) dipertahankan tetap di puncak antrean agar sesi streaming Host tidak terinterupsi.
- **Panel Verifikasi Host 1-Klik**: Host dapat menyetujui (`✓ Setujui VIP`) atau menolak (`✕ Tolak`) klaim donasi secara instan melalui kartu antrean.
- **Modal Kelola Donasi Fleksibel**: Host dapat mengubah atau menambahkan nominal donasi secara manual kapan pun diperlukan.

### 3. 🖥️ Studio Review Layar Penuh (`ReviewMode`)
- **Live Preview Browser**: Embed iframe website target dengan proteksi sandboxing.
- **Multi-Device Simulator**: Uji tampilan dalam mode **Desktop** (100%), **Tablet** (768px), dan **Mobile** (375px).
- **Pengukur Waktu Live**: Stopwatch terintegrasi untuk menjaga alokasi waktu review per website tetap disiplin.
- **Checklist Evaluasi Komprehensif**: Panduan review standar industri:
  - *UI & Visual Polish* (Harmoni warna, tipografi, konsistensi)
  - *Responsiveness* (Viewport mobile, tata letak, hamburger menu)
  - *Performance & Speed* (Optimasi gambar, waktu muat)
  - *SEO & Aksesibilitas* (Meta tag, kontras warna, atribut alt)

### 4. 🚀 Audit Otomatis PageSpeed & Core Web Vitals
- **Integrasi Google PageSpeed Insights API**: Menjalankan audit performa Lighthouse untuk perangkat Mobile dan Desktop.
- **Metrik Utama**: Skor Performa, Aksesibilitas, Best Practices, SEO, serta metrik Core Web Vitals (FCP, LCP, CLS, TBT, Speed Index).

### 5. 🎯 Manajemen Antrean Interaktif
- **Drag & Drop Reordering**: Pengaturan urutan manual dengan indikator visual modern.
- **Filter Status**: Filter antrean berdasarkan *Semua*, *Menunggu*, *Dalam Proses*, dan *Selesai*.
- **Penyimpanan Lokal & Cloud**: Sinkronisasi ganda antara LocalStorage dan Supabase Database.

### 6. 🛡️ Proteksi Perangkat & Aksesibilitas
- **Pemberitahuan Khusus Mobile**: Halaman dashboard dilindungi untuk mode desktop demi kenyamanan akses menu dan workspace, dengan layar blokir ramah pengguna pada perangkat mobile.
- **Dukungan Dua Bahasa (i18n)**: Beralih instan antara Bahasa Indonesia (ID) dan Bahasa Inggris (EN).
- **Dark & Light Mode**: Desain bertema gelap dan terang dengan palet warna yang harmonis.

---

## 🛠️ Teknologi

Platform ini dibangun menggunakan arsitektur modern yang mengutamakan performa, keamanan, dan estetika:

| Bagian | Teknologi / Library | Keterangan |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) | React Server Components & Turbopack |
| **UI Library** | [React 19](https://react.dev/) | State modern & Actions |
| **Styling** | Vanilla CSS Modern | Design tokens, glassmorphism, responsive |
| **Database** | [Supabase](https://supabase.com/) (PostgreSQL) | Realtime database, RLS security |
| **Audit API** | [Google PageSpeed Insights API](https://developers.google.com/speed/docs/insights/v5/get-started) | Lighthouse audit report engine |
| **Audio Engine** | Web Audio API | Zero-asset chime tone generator |
| **Icons** | Custom Modern SVG Vectors | Clean minimal line icons (tanpa emoji) |

---

## 🚀 Panduan Instalasi

### Prasyarat
- Node.js versi `18.18.0` atau yang lebih baru
- npm / yarn / pnpm

### 1. Clone Repositori
```bash
git clone https://github.com/primadev/web-rev.git
cd web-rev
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Salin file `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```

Buka `.env.local` dan isi kredensial yang dibutuhkan:
```env
# Supabase Configuration (Opsional untuk Cloud Realtime, default fallback ke mode lokal)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Google PageSpeed API Key (Opsional, mempercepat kuota audit Lighthouse)
PAGESPEED_API_KEY=your-google-api-key
```

### 4. Menjalankan Server Development
```bash
npm run dev
```
Akses aplikasi melalui browser di `http://localhost:3000`.

### 5. Build untuk Produksi
```bash
npm run build
npm run start
```

---

## 🗄️ Skema Basis Data Supabase

Jika menggunakan fitur Realtime Cloud Supabase, buat tabel-tabel berikut di Supabase SQL Editor:

```sql
-- 1. Tabel Room Live Streaming
CREATE TABLE rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  host_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  allow_submissions BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabel Antrean Pengajuan Website
CREATE TABLE queue_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  submitter_name TEXT NOT NULL,
  url TEXT NOT NULL,
  note TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Aktifkan Realtime Publikasi
ALTER PUBLICATION supabase_realtime ADD TABLE queue_submissions;
```

---

## 📁 Struktur Proyek

```text
web-rev/
├── app/
│   ├── api/
│   │   └── pagespeed/          # Endpoint API Google PageSpeed Insights
│   ├── room/
│   │   └── [hostSlug]/         # Halaman antrean penonton live streaming
│   ├── globals.css             # Design system lengkap, tema, dan animasi
│   ├── layout.js               # Root layout Next.js
│   └── page.js                 # Landing page & wrapper dashboard
├── components/
│   ├── AddUrlForm.js           # Form penambahan URL manual oleh Host
│   ├── ChangeNameModal.js      # Modal ganti nama profil Host
│   ├── Dashboard.js            # Workspace utama Host (antrean, statistik, filter)
│   ├── DeleteConfirmModal.js   # Konfirmasi penghapusan item antrean
│   ├── DonationEditModal.js    # Modal pengaturan nominal donasi Host
│   ├── EditModal.js            # Modal edit URL dan catatan
│   ├── LanguageSwitcher.js     # Pemilih bahasa (ID / EN)
│   ├── LiveRoomModal.js        # Pengaturan dan pembuat tautan Room Live
│   ├── LogoIcon.js             # Komponen icon WebRev resmi
│   ├── MobileBlockScreen.js    # Proteksi layar perangkat mobile dashboard
│   ├── PageSpeedModal.js       # Modal hasil visualisasi audit Lighthouse
│   ├── ReviewChecklist.js      # Panduan panduan evaluasi website
│   ├── ReviewMode.js           # Studio review layar penuh (iframe + timer)
│   ├── SettingsModal.js        # Pengaturan limit dan prioritas donasi
│   ├── ThemeToggle.js          # Pengalih tema gelap/terang
│   ├── UrlItem.js              # Kartu antrean dengan panel verifikasi modern
│   └── UserProfileMenu.js      # Menu dropdown profil Host
├── lib/
│   ├── deviceDetection.js      # Logika deteksi perangkat mobile
│   ├── donationTiers.js        # Utilitas sistem prioritas donasi & multi-criteria sorting
│   ├── i18n.js                 # Kamus terjemahan Bahasa Indonesia & Inggris
│   ├── reviewChecklist.js      # Data panduan kriteria review website
│   ├── supabase.js             # Client Supabase & helper fungsi realtime
│   └── utils.js                # Helper fungsi format waktu dan string
├── public/                     # Favicon dan aset statis
├── LICENSE                     # Dokumen hak cipta resmi Primadev
└── README.md                   # Dokumentasi proyek
```

---

## 📄 Hak Cipta & Lisensi

Seluruh hak cipta, kepemilikan merek, kode sumber, dan hak kekayaan intelektual atas proyek **WebRev** ini sepenuhnya dimiliki oleh **Primadev Digital Technology**.

```
Copyright (c) 2026 Primadev Digital Technology
All Rights Reserved.
```

Perangkat lunak ini dilindungi oleh Undang-Undang Republik Indonesia Nomor 28 Tahun 2014 tentang Hak Cipta serta hukum kekayaan intelektual internasional. Dilarang menyalin, memodifikasi, mendistribusikan ulang, atau mengomersialisasikan perangkat lunak ini tanpa izin tertulis dari Primadev Digital Technology.

Informasi lisensi selengkapnya dapat dilihat pada file [LICENSE](./LICENSE).

---

<div align="center">
  <sub>Developed with ❤️ by <a href="https://primadev.id">Primadev Digital Technology</a></sub>
</div>
