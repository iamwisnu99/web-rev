<div align="center">

  <h1>⚡ WebRev</h1>
  <p><strong>Interactive Realtime Website Review Assistant for Content Creators & Live Streamers</strong></p>

  <p>
    <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16.3.8-black?style=for-the-badge&logo=next.js" alt="Next.js" /></a>
    <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19.2.8-blue?style=for-the-badge&logo=react" alt="React" /></a>
    <a href="https://supabase.com"><img src="https://img.shields.io/badge/Supabase-Realtime-emerald?style=for-the-badge&logo=supabase" alt="Supabase" /></a>
    <a href="https://vercel.com"><img src="https://img.shields.io/badge/Vercel-Deploy_Ready-000000?style=for-the-badge&logo=vercel" alt="Vercel Ready" /></a>
    <a href="./LICENSE"><img src="https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge" alt="License" /></a>
  </p>

  <p>
    <em>Milik Sepenuhnya: <strong>Primadev Digital Technology</strong></em>
  </p>

  <br />

  <a href="#-fitur-utama">Fitur Utama</a> •
  <a href="#-sistem-prioritas-donasi-fast-track--vip">Sistem Prioritas Donasi</a> •
  <a href="#-teknologi">Teknologi</a> •
  <a href="#-panduan-instalasi-lokal">Instalasi Lokal</a> •
  <a href="#-panduan-deploy-ke-vercel">Deploy ke Vercel</a> •
  <a href="#-struktur-proyek">Struktur Proyek</a> •
  <a href="#-hak-cipta--lisensi">Hak Cipta</a>

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
- **Fallback Cerdas**: Jika API limit atau domain tidak dapat dijangkau bot Google publik, sistem secara cerdas menyediakan kalkulasi performa berbasis seed deterministik.

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
| **Deployment** | [Vercel](https://vercel.com/) | Edge network & Serverless functions (Region Singapore `sin1`) |

---

## 🚀 Panduan Instalasi Lokal

### Prasyarat
- Node.js versi `18.18.0` atau yang lebih baru
- npm / yarn / pnpm

### 1. Clone Repositori
```bash
git clone https://github.com/iamwisnu99/web-rev.git
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
# Google PageSpeed Insights API Key
PAGESPEED_API_KEY=your_google_pagespeed_api_key_here

# Supabase (Database & Realtime untuk Fitur Live Stream Room Antrean)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here

# Production Site URL
NEXT_PUBLIC_SITE_URL=https://webrev.primadev.id
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

## 🌐 Panduan Deploy ke Vercel

WebRev telah dioptimalkan secara penuh untuk deployment di **Vercel** menggunakan file konfigurasi [vercel.json](./vercel.json) dan [next.config.mjs](./next.config.mjs).

### Langkah-langkah Deployment:

1. **Push Kode ke GitHub**:
   Pastikan branch `main` repositori GitHub Anda sudah berisi commit terbaru.

2. **Import Proyek di Vercel Dashboard**:
   - Buka [Vercel Dashboard](https://vercel.com/dashboard)
   - Klik **"Add New..."** > **"Project"**
   - Pilih repositori `web-rev` dari akun GitHub Anda
   - Framework Preset akan terdeteksi otomatis sebagai **Next.js**

3. **Atur Environment Variables di Vercel**:
   Sebelum menekan tombol *Deploy*, tambahkan variabel lingkungan berikut di bagian **Environment Variables**:

   | Name | Deskripsi |
   | :--- | :--- |
   | `PAGESPEED_API_KEY` | API Key dari Google Cloud Console untuk audit Lighthouse PageSpeed |
   | `NEXT_PUBLIC_SUPABASE_URL` | URL project Supabase Anda |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon public API key Supabase Anda |
   | `NEXT_PUBLIC_SITE_URL` | Domain production aplikasi (misal: `https://webrev.primadev.id` atau URL vercel `https://web-rev-xxx.vercel.app`) |

4. **Klik "Deploy"**:
   - Vercel akan menjalankan build otomatis dengan Next.js Turbopack.
   - Endpoint API `/api/pagespeed` berjalan dengan timeout **30 detik** di Serverless Region **Singapore (`sin1`)** untuk akses tercepat dan stabil dari Indonesia.

---

## 🗄️ Skema Database Supabase

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
│   │   └── pagespeed/          # Endpoint API Google PageSpeed Insights (maxDuration: 30s)
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
├── .env.example                # Template konfigurasi environment variables
├── .gitignore                  # Pengaturan ignore git standar industri
├── LICENSE                     # Dokumen hak cipta resmi Primadev Digital Technology
├── next.config.mjs             # Konfigurasi Next.js (Security headers, compress, strict)
├── vercel.json                 # Konfigurasi deployment Vercel (Region sin1)
└── README.md                   # Dokumentasi proyek
```

---

## 📄 Hak Cipta & Lisensi

Seluruh hak cipta, kepemilikan merek, kode sumber, dan hak kekayaan intelektual atas proyek **WebRev** ini sepenuhnya dimiliki oleh **Primadev Digital Technology**.

```text
Copyright (c) 2026 Primadev Digital Technology
All Rights Reserved.
```

Perangkat lunak ini dilindungi oleh Undang-Undang Republik Indonesia Nomor 28 Tahun 2014 tentang Hak Cipta serta hukum kekayaan intelektual internasional. Dilarang menyalin, memodifikasi, mendistribusikan ulang, atau mengomersialisasikan perangkat lunak ini tanpa izin tertulis dari Primadev Digital Technology.

Informasi lisensi selengkapnya dapat dilihat pada file [LICENSE](./LICENSE).

---

<div align="center">
  <sub>Developed with ❤️ by <a href="https://primadev.id">Primadev Digital Technology</a></sub>
</div>
