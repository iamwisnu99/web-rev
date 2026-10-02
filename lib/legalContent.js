/**
 * WebRev Legal Documentation Specifications
 * Modeled after modern developer & API reference documentation
 * Available in Indonesian (id) and English (en)
 */

export const legalDocsData = {
  id: {
    ui: {
      portalBadge: "DOKUMENTASI HUKUM & STANDAR",
      portalTitle: "WebRev Legal & Compliance Docs",
      portalSubtitle:
        "Spesifikasi hukum, privasi penyimpanan lokal Chrome, dan batasan tanggung jawab platform WebRev.",
      searchPlaceholder: "Cari pasal, klausul, atau topik (cth: storage, Google, privasi)...",
      backBtn: "Kembali ke Beranda",
      backToDash: "Kembali ke Dashboard",
      tableOfContents: "Pada Halaman Ini",
      sidebarHeader: "SPESIFIKASI DOKUMEN",
      lastUpdated: "Terakhir Diperbarui",
      docIdLabel: "ID Dokumen",
      docTypeLabel: "Tipe Regulasi",
      copyLink: "Salin Tautan Bagian",
      copied: "Tersalin!",
      prevDoc: "Dokumen Sebelumnya",
      nextDoc: "Dokumen Selanjutnya",
      emptySearch: "Tidak ada pasal yang cocok dengan pencarian",
    },
    docs: [
      {
        id: "terms",
        slug: "syarat-ketentuan",
        navTitle: "Syarat & Ketentuan",
        navDesc: "Aturan operasional dan hak penggunaan platform WebRev",
        docCode: "WR-LEGAL-TOS-2026",
        method: "SPEC",
        endpoint: "/legal/v1/terms-of-service",
        badge: "TERMS OF SERVICE",
        title: "Syarat & Ketentuan Layanan",
        version: "v1.2 (Berlaku)",
        lastUpdated: "2 Oktober 2026",
        summary:
          "Dokumen ini mengatur hak, kewajiban, dan tanggung jawab hukum antara pengguna (selanjutnya disebut 'Host' atau 'Pengguna') dan platform WebRev. Dengan mengakses atau menggunakan aplikasi WebRev, Anda secara otomatis menyetujui seluruh ketentuan dalam spesifikasi ini.",
        specBadges: [
          { label: "Cakupan", val: "Layanan Global" },
          { label: "Autentikasi", val: "Tanpa Registrasi Server" },
          { label: "Sifat Akun", val: "Host Sesi Klien" },
        ],
        sections: [
          {
            id: "penerimaan-ketentuan",
            number: "01",
            tag: "CONTRACT_ACCEPTANCE",
            title: "Penerimaan Ketentuan",
            content: [
              "WebRev adalah alat bantu produktivitas yang dirancang khusus untuk memfasilitasi live streaming review website. Layanan ini mencakup pengelolaan antrean URL, panduan checklist review, peninjauan layar penuh (fullscreen split-screen), dan audit performa melalui Google PageSpeed Insights.",
              "Dengan mengklik tombol 'Masuk ke Dashboard', 'Mulai Review', atau mengakses antarmuka aplikasi, Anda menyatakan telah membaca, memahami, dan mengikatkan diri secara sukarela pada Syarat & Ketentuan ini.",
            ],
            callout: {
              type: "info",
              title: "Akses Tanpa Akun Pusat",
              text: "WebRev tidak mengharuskan Anda membuat akun terpusat dengan kata sandi. Sesi Anda diikat ke peramban lokal melalui penyimpanan Chrome.",
            },
          },
          {
            id: "penggunaan-layanan",
            number: "02",
            tag: "USAGE_POLICY",
            title: "Penggunaan yang Diizinkan & Batasan Antrean URL",
            content: [
              "Host memiliki kebebasan menentukan situs web yang akan dimasukkan ke dalam antrean live review. Namun demikian, Host wajib mematuhi standar etika dan hukum yang berlaku.",
            ],
            items: [
              "Dilarang memasukkan URL situs yang menyebarkan malware, ransomware, phishing, atau perangkat perusak lainnya.",
              "Dilarang menggunakan WebRev untuk mempromosikan konten pornografi ilegal, ujaran kebencian, diskriminasi SARA, atau konten terorisme.",
              "Dilarang mengeksploitasi fungsi uji kecepatan (PageSpeed API) untuk melakukan serangan Denial of Service (DoS) terhadap domain tertentu.",
              "Host bertanggung jawab penuh atas interaksi dan demonstrasi navigasi situs selama siaran langsung berlangsung.",
            ],
            codeBlock: {
              title: "Kebijakan Antrean URL (Client Validation)",
              code: `// Protokol validasi URL WebRev
validateUrl(input) {
  protocol: ["http:", "https:"],
  storageTarget: "localStorage:webrev_data.urls",
  rateLimit: "Client-managed throttling",
  moderation: "Self-governed by Stream Host"
}`,
            },
          },
          {
            id: "hak-kekayaan-intelektual",
            number: "03",
            tag: "INTELLECTUAL_PROPERTY",
            title: "Hak Kekayaan Intelektual & Materi Pihak Ketiga",
            content: [
              "Seluruh kode sumber, desain UI/UX, tata letak, ikon grafis, dan merek dagang WebRev adalah hak kekayaan intelektual milik pengembang WebRev yang dilindungi undang-undang hak cipta.",
              "Situs web pihak ketiga yang ditampilkan di dalam frame ulasan (Review Frame / Live Viewer) tetap merupakan hak cipta dan merek dagang milik masing-masing pemilik situs web bersangkutan. Penampilan situs tersebut ditujukan semata-mata untuk analisis kritik, ulasan edukatif, dan evaluasi performa (Fair Use / Fair Dealing).",
            ],
            callout: {
              type: "note",
              title: "Prinsip Fair Use",
              text: "WebRev tidak mengklaim kepemilikan atas konten visual maupun materi situs web mana pun yang dimasukkan ke dalam daftar review oleh Host.",
            },
          },
          {
            id: "penghentian-layanan",
            number: "04",
            tag: "SESSION_TERMINATION",
            title: "Pengakhiran Sesi & Pembersihan Data Akun",
            content: [
              "Host dapat mengakhiri sesi kapan saja melalui tombol 'Keluar' di menu profil. Sistem menyediakan modal konfirmasi modern yang secara otomatis menghapus seluruh data sesi akun dari penyimpanan lokal Chrome.",
              "WebRev berhak memperbarui, membatasi, atau menghentikan fitur tertentu sewaktu-waktu guna pemeliharaan sistem atau kepatuhan regulasi.",
            ],
          },
          {
            id: "perubahan-syarat",
            number: "05",
            tag: "SPEC_CHANGELOG",
            title: "Perubahan & Amandemen Ketentuan",
            content: [
              "Kami berhak mengubah atau menyempurnakan dokumen Syarat & Ketentuan ini sewaktu-waktu. Perubahan akan segera berlaku efektif setelah dipublikasikan pada halaman dokumentasi ini.",
              "Kelanjutan penggunaan layanan setelah revisi dipublikasikan dianggap sebagai persetujuan Anda terhadap perubahan yang dilakukan.",
            ],
          },
        ],
      },
      {
        id: "privacy",
        slug: "kebijakan-privasi",
        navTitle: "Kebijakan Privasi",
        navDesc: "Protokol perlindungan data dan penyimpanan lokal Chrome",
        docCode: "WR-LEGAL-PRIV-2026",
        method: "DATA",
        endpoint: "/legal/v1/privacy-policy",
        badge: "PRIVACY POLICY",
        title: "Kebijakan Privasi & Penyimpanan Data",
        version: "v1.2 (Berlaku)",
        lastUpdated: "2 Oktober 2026",
        summary:
          "WebRev dibangun dengan filosofi Privasi-Utama (Client-First Privacy). Kami tidak mengumpulkan, tidak menjual, dan tidak menyimpan data penjelajahan maupun identitas Anda di database server pusat. Seluruh data sesi Anda berada di tangan Anda di dalam peramban Chrome.",
        specBadges: [
          { label: "Penyimpanan", val: "Penyimpanan Lokal Chrome" },
          { label: "Pelacakan Server", val: "0% (Zero Telemetry)" },
          { label: "Kepatuhan", val: "GDPR / Client-Side Sandboxed" },
        ],
        sections: [
          {
            id: "data-yang-dikelola",
            number: "01",
            tag: "CLIENT_STORAGE_SCHEMA",
            title: "Data yang Dikelola di Penyimpanan Chrome",
            content: [
              "WebRev hanya menggunakan penyimpanan lokal peramban (Chrome LocalStorage dan SessionStorage) untuk menyimpan preferensi dan sesi kerja Host selama menggunakan aplikasi.",
              "Berikut adalah skema penyimpanan yang disimpan di peramban Anda:",
            ],
            codeBlock: {
              title: "Skema Penyimpanan WebRev di Browser (localStorage)",
              code: `{
  "webrev_data": {
    "user": "Nama Host (string)",
    "urls": [
      {
        "id": "uuid_string",
        "url": "https://target-website.com",
        "note": "Catatan opsional host",
        "status": "pending | in-progress | reviewed",
        "createdAt": 1727850000000
      }
    ],
    "checklist": { "item_id": true }
  },
  "webrev_lang": "id | en",
  "webrev_theme": "light | dark"
}`,
            },
            callout: {
              type: "info",
              title: "Tidak Ada Akun di Server Kami",
              text: "Data di atas tidak pernah diunggah ke server basis data WebRev. Jika Anda menutup atau menghapus data browser, data akan terhapus.",
            },
          },
          {
            id: "integrasi-pagespeed",
            number: "02",
            tag: "THIRD_PARTY_INTEGRATION",
            title: "Penggunaan API Pihak Ketiga (Google PageSpeed Insights)",
            content: [
              "Aplikasi WebRev menyediakan fitur pengujian kecepatan situs web menggunakan Google PageSpeed Insights API resmi versi 5.",
              "Saat Host meminta audit performa:",
            ],
            items: [
              "URL situs target dikirimkan ke endpoint resmi Google (pagespeedonline.googleapis.com).",
              "Permintaan tersebut semata-mata memuat URL target, preferensi strategi (Mobile/Desktop), dan kategori audit (Performa, Aksesibilitas, Praktik Terbaik, SEO).",
              "Tidak ada data identitas Host, nama Anda, ataupun informasi pribadi Anda yang dikirim ke Google.",
              "Proses audit tunduk pada Kebijakan Privasi resmi Google (https://policies.google.com/privacy).",
            ],
          },
          {
            id: "pembersihan-storage",
            number: "03",
            tag: "PURGE_PROTOCOL",
            title: "Pembersihan Data Secara Permanen (Storage Purge)",
            content: [
              "Sesuai hak kontrol data penuh pengguna, WebRev menyediakan alur pembersihan data instan melalui fitur Keluar (Logout).",
              "Ketika tombol 'Ya, Keluar Akun' dikonfirmasi di modal keluar:",
            ],
            items: [
              "webrev_data (berisi nama host, antrean URL, dan status checklist) langsung dihapus secara permanen dari localStorage.",
              "Seluruh data sementara di sessionStorage dikosongkan total.",
              "Seluruh cookie sesi yang ada di domain dibersihkan.",
              "Preferensi global tampilan (Bahasa dan Tema Terang/Gelap) dapat dipertahankan demi kenyamanan navigasi berikutnya.",
            ],
            callout: {
              type: "warning",
              title: "Tindakan Permanen",
              text: "Setelah pembersihan storage dikonfirmasi, daftar antrean URL yang sebelumnya belum disimpan secara eksternal tidak dapat dipulihkan.",
            },
          },
          {
            id: "keamanan-koneksi",
            number: "04",
            tag: "TRANSPORT_SECURITY",
            title: "Keamanan Komunikasi Data (Transport Security)",
            content: [
              "Seluruh transmisi data antara peramban Anda, server aplikasi WebRev, dan API Google diamankan menggunakan enkripsi Transport Layer Security (TLS/HTTPS).",
              "Kami merekomendasikan Host untuk hanya mengulas situs web yang menggunakan protokol HTTPS guna menjaga keamanan koneksi siaran langsung Anda.",
            ],
          },
          {
            id: "hak-privasi-pengguna",
            number: "05",
            tag: "USER_DATA_RIGHTS",
            title: "Hak Privasi & Kontrol Pengguna",
            content: [
              "Karena WebRev tidak mengelola database identitas terpusat, Anda memiliki hak otonom penuh:",
            ],
            items: [
              "Hak Mengubah: Mengganti nama host kapan saja via menu 'Ubah Nama'.",
              "Hak Menghapus: Menghapus satu per satu URL atau membersihkan total storage via 'Keluar'.",
              "Hak Portabilitas: Menyalin URL dan catatan ulasan tanpa hambatan vendor-lock.",
            ],
          },
        ],
      },
      {
        id: "disclaimer",
        slug: "disclaimer",
        navTitle: "Disclaimer",
        navDesc: "Batasan tanggung jawab hasil audit dan opini siaran langsung",
        docCode: "WR-LEGAL-DISC-2026",
        method: "NOTICE",
        endpoint: "/legal/v1/disclaimer",
        badge: "DISCLAIMER & LIABILITY",
        title: "Disclaimer & Penafian Hukum",
        version: "v1.2 (Berlaku)",
        lastUpdated: "2 Oktober 2026",
        summary:
          "Dokumen ini menguraikan batasan tanggung jawab hukum WebRev sehubungan dengan akurasi pengujian metrik teknis, opini yang disampaikan oleh host selama sesi siaran langsung, dan interaksi dengan situs web pihak ketiga.",
        specBadges: [
          { label: "Sifat Informasi", val: "Edukasi & Referensi" },
          { label: "Hasil Audit", val: "Disediakan Sebagaimana Adanya" },
          { label: "Opini Host", val: "Independen Non-Afiliasi" },
        ],
        sections: [
          {
            id: "penafian-audit",
            number: "01",
            tag: "AUDIT_ACCURACY_DISCLAIMER",
            title: "Penafian Hasil Audit PageSpeed & Lighthouse",
            content: [
              "Fitur pengujian kecepatan situs web disediakan 'sebagaimana adanya' (as is) dan 'sebagaimana tersedia' (as available). Hasil metrik (FCP, LCP, TBT, CLS, Speed Index) dihitung secara algoritmik oleh Google Lighthouse Engine pada saat pengujian berlangsung.",
              "WebRev tidak memberikan jaminan bahwa hasil audit akan selalu sama setiap saat. Fluktuasi skor dapat dipengaruhi oleh kondisi lalu lintas server target, latensi koneksi internet, penggunaan CDN, dan status caching.",
            ],
            callout: {
              type: "warning",
              title: "Bukan Jaminan Komersial",
              text: "Mendapatkan skor 100 pada audit PageSpeed tidak menjadi jaminan absolut peningkatan penjualan, konversi bisnis, atau peringkat halaman pertama di mesin pencari Google.",
            },
          },
          {
            id: "opini-host",
            number: "02",
            tag: "STREAM_HOST_OPINION",
            title: "Independensi Opini Host Live Streaming",
            content: [
              "Komentar, penilaian, ulasan visual, masukan desain, maupun kritik yang disampaikan oleh Host selama sesi live review merupakan opini pribadi dan penilaian subjektif dari Host yang bersangkutan.",
              "Opini tersebut tidak mencerminkan, tidak mewakili, dan bukan merupakan sikap resmi pengembang platform WebRev. WebRev tidak bertanggung jawab atas perselisihan antara Host dan pemilik website yang diulas.",
            ],
          },
          {
            id: "tautan-luar",
            number: "03",
            tag: "EXTERNAL_WEBSITES",
            title: "Situs Web dan Tautan Eksternal",
            content: [
              "Aplikasi WebRev memuat dan menampilkan situs web eksternal melalui frame tinjauan langsung (Live Review Viewer). WebRev tidak memiliki kendali atas materi, ketersediaan, kebijakan privasi, atau konten dari situs pihak ketiga mana pun.",
              "Tindakan memasukkan URL ke antrean WebRev tidak dapat diartikan sebagai bentuk afiliasi, dukungan, atau rekomendasi resmi terhadap produk atau layanan yang ditawarkan di situs pihak ketiga tersebut.",
            ],
          },
          {
            id: "batasan-kerugian",
            number: "04",
            tag: "LIMITATION_OF_DAMAGES",
            title: "Batasan Tanggung Jawab atas Kerugian",
            content: [
              "Dalam batas maksimum yang diizinkan oleh hukum yang berlaku, WebRev, pengembang, dan kontributornya tidak bertanggung jawab atas kerugian langsung, tidak langsung, insidental, khusus, atau konsekuensial yang timbul dari:",
            ],
            items: [
              "Penggunaan atau ketidakmampuan menggunakan alat bantu WebRev.",
              "Keputusan teknis atau perubahan kode situs yang diambil pemilik website berdasarkan hasil live review.",
              "Keterlambatan atau kegagalan koneksi API pihak ketiga (Google PageSpeed API).",
              "Kerusakan data lokal pada perangkat atau peramban yang disebabkan oleh faktor eksternal pengguna.",
            ],
          },
        ],
      },
    ],
  },
  en: {
    ui: {
      portalBadge: "LEGAL & COMPLIANCE SPECIFICATIONS",
      portalTitle: "WebRev Legal & Compliance Docs",
      portalSubtitle:
        "Official legal specifications, Chrome client-side privacy architecture, and liability disclaimers.",
      searchPlaceholder: "Search clauses, articles, or keywords (e.g. storage, Google, privacy)...",
      backBtn: "Back to Home",
      backToDash: "Back to Dashboard",
      tableOfContents: "On This Page",
      sidebarHeader: "DOCUMENT SPECIFICATIONS",
      lastUpdated: "Last Updated",
      docIdLabel: "Document ID",
      docTypeLabel: "Regulation Type",
      copyLink: "Copy Section Link",
      copied: "Copied!",
      prevDoc: "Previous Document",
      nextDoc: "Next Document",
      emptySearch: "No clauses matched your search query",
    },
    docs: [
      {
        id: "terms",
        slug: "terms-and-conditions",
        navTitle: "Terms & Conditions",
        navDesc: "Operational rules and acceptable use standards for WebRev",
        docCode: "WR-LEGAL-TOS-2026",
        method: "SPEC",
        endpoint: "/legal/v1/terms-of-service",
        badge: "TERMS OF SERVICE",
        title: "Terms & Conditions of Service",
        version: "v1.2 (Active)",
        lastUpdated: "October 2, 2026",
        summary:
          "This document establishes the binding legal terms and conditions between users (referred to as 'Host' or 'User') and the WebRev platform. By accessing or using the WebRev application, you voluntarily agree to comply with all provisions in this specification.",
        specBadges: [
          { label: "Scope", val: "Global Service" },
          { label: "Authentication", val: "No Server Registration" },
          { label: "Account Nature", val: "Client Session Host" },
        ],
        sections: [
          {
            id: "acceptance-of-terms",
            number: "01",
            tag: "CONTRACT_ACCEPTANCE",
            title: "Acceptance of Terms",
            content: [
              "WebRev is a productivity platform designed to streamline live website reviews for streaming hosts. Features include URL queue management, a comprehensive review checklist, split-screen fullscreen review mode, and performance audits powered by Google PageSpeed Insights.",
              "By clicking 'Enter Dashboard', 'Start Review', or accessing any part of the application, you confirm that you have read, understood, and agreed to be bound by these Terms & Conditions.",
            ],
            callout: {
              type: "info",
              title: "No Central Account Required",
              text: "WebRev does not require centralized username/password accounts. Your session is tied directly to your local browser environment via Chrome storage.",
            },
          },
          {
            id: "acceptable-use",
            number: "02",
            tag: "USAGE_POLICY",
            title: "Acceptable Use & Queue Moderation",
            content: [
              "Hosts are free to select websites for their live review queue. However, Hosts must adhere to strict ethical and legal standards when selecting targets.",
            ],
            items: [
              "Do not queue websites distributing malware, ransomware, phishing, or other malicious software.",
              "Do not use WebRev to promote illegal adult content, hate speech, terrorism, or discriminatory material.",
              "Do not abuse the PageSpeed API testing feature to conduct Denial of Service (DoS) attacks against third-party domains.",
              "Hosts bear sole legal responsibility for website navigation and commentary demonstrated during live broadcasts.",
            ],
            codeBlock: {
              title: "URL Queue Policy (Client Validation)",
              code: `// WebRev URL Validation Protocol
validateUrl(input) {
  protocol: ["http:", "https:"],
  storageTarget: "localStorage:webrev_data.urls",
  rateLimit: "Client-managed throttling",
  moderation: "Self-governed by Stream Host"
}`,
            },
          },
          {
            id: "intellectual-property",
            number: "03",
            tag: "INTELLECTUAL_PROPERTY",
            title: "Intellectual Property & Fair Use",
            content: [
              "All source code, user interface designs, layouts, graphics, and WebRev trademarks are the exclusive intellectual property of the WebRev developers, protected by international copyright laws.",
              "Third-party websites displayed within the review frame remain the intellectual property and trademarks of their respective owners. Their display in WebRev is intended solely for critical commentary, educational review, and performance evaluation under Fair Use and Fair Dealing principles.",
            ],
            callout: {
              type: "note",
              title: "Fair Use Doctrine",
              text: "WebRev claims no ownership over external visual content or materials rendered in the review queue by the Host.",
            },
          },
          {
            id: "session-termination",
            number: "04",
            tag: "SESSION_TERMINATION",
            title: "Session Termination & Account Data Purging",
            content: [
              "Hosts may terminate their session at any time using the 'Logout' option in the user profile menu. The application provides a modern confirmation dialog that thoroughly purges all account session data from local Chrome storage.",
              "WebRev reserves the right to update, modify, or deprecate features at any time for system maintenance or regulatory compliance.",
            ],
          },
          {
            id: "terms-modifications",
            number: "05",
            tag: "SPEC_CHANGELOG",
            title: "Modifications & Amendments",
            content: [
              "We reserve the right to revise these Terms & Conditions at our discretion. Updates will take effect immediately upon publication on this documentation portal.",
              "Continued use of WebRev following any revisions signifies your acceptance of the amended terms.",
            ],
          },
        ],
      },
      {
        id: "privacy",
        slug: "privacy-policy",
        navTitle: "Privacy Policy",
        navDesc: "Client-side data protocols and local Chrome storage policy",
        docCode: "WR-LEGAL-PRIV-2026",
        method: "DATA",
        endpoint: "/legal/v1/privacy-policy",
        badge: "PRIVACY POLICY",
        title: "Privacy Policy & Data Storage",
        version: "v1.2 (Active)",
        lastUpdated: "October 2, 2026",
        summary:
          "WebRev is engineered around a Client-First Privacy paradigm. We do not harvest, monetize, or store your browsing data or personal identity in any centralized server database. Your review workflow belongs entirely to you within your local Chrome browser storage.",
        specBadges: [
          { label: "Storage Engine", val: "Chrome LocalStorage" },
          { label: "Server Telemetry", val: "0% (Zero Tracking)" },
          { label: "Architecture", val: "Client-Side Sandboxed" },
        ],
        sections: [
          {
            id: "data-processed",
            number: "01",
            tag: "CLIENT_STORAGE_SCHEMA",
            title: "Data Managed in Chrome Local Storage",
            content: [
              "WebRev strictly uses browser-level client storage (Chrome LocalStorage and SessionStorage) to store Host preferences and live review state.",
              "Below is the exact schema persisted in your local browser:",
            ],
            codeBlock: {
              title: "WebRev Client Storage Schema (localStorage)",
              code: `{
  "webrev_data": {
    "user": "Host Name (string)",
    "urls": [
      {
        "id": "uuid_string",
        "url": "https://target-website.com",
        "note": "Optional host notes",
        "status": "pending | in-progress | reviewed",
        "createdAt": 1727850000000
      }
    ],
    "checklist": { "item_id": true }
  },
  "webrev_lang": "id | en",
  "webrev_theme": "light | dark"
}`,
            },
            callout: {
              type: "info",
              title: "Zero Server Database",
              text: "The data above is never transmitted to or persisted on WebRev server databases. Clearing your browser data immediately removes all traces.",
            },
          },
          {
            id: "pagespeed-api",
            number: "02",
            tag: "THIRD_PARTY_INTEGRATION",
            title: "Third-Party Integration: Google PageSpeed Insights",
            content: [
              "WebRev integrates with the official Google PageSpeed Insights API (v5) to perform on-demand performance and Core Web Vitals audits.",
              "When an audit is requested:",
            ],
            items: [
              "The target URL is transmitted directly to Google's official endpoint (pagespeedonline.googleapis.com).",
              "The request includes only the target URL, device strategy (Mobile/Desktop), and audit categories (Performance, Accessibility, Best Practices, SEO).",
              "No Host personal identifiers, names, or private session keys are shared with Google.",
              "Audit processes are governed by Google's Privacy Policy (https://policies.google.com/privacy).",
            ],
          },
          {
            id: "storage-purge",
            number: "03",
            tag: "PURGE_PROTOCOL",
            title: "Permanent Storage Purge Protocol",
            content: [
              "In alignment with comprehensive data control principles, WebRev features an automated storage purge procedure upon logout.",
              "When 'Yes, Log Out' is confirmed in the logout modal:",
            ],
            items: [
              "webrev_data (containing host name, URL list, and checklist state) is permanently deleted from localStorage.",
              "All transient items in sessionStorage are emptied via sessionStorage.clear().",
              "Domain session cookies are cleared.",
              "Global UI settings (Language and Light/Dark theme) may be preserved for convenient return visits.",
            ],
            callout: {
              type: "warning",
              title: "Irreversible Purge",
              text: "Once the storage purge is executed, review queues that have not been externally backed up cannot be recovered.",
            },
          },
          {
            id: "transport-security",
            number: "04",
            tag: "TRANSPORT_SECURITY",
            title: "Data Transmission & Transport Security",
            content: [
              "All network exchanges between your browser, WebRev application endpoints, and Google APIs are secured with modern Transport Layer Security (TLS/HTTPS).",
              "Hosts are advised to prioritize reviewing HTTPS-enabled domains to ensure end-to-end security for their broadcast audience.",
            ],
          },
          {
            id: "user-rights",
            number: "05",
            tag: "USER_DATA_RIGHTS",
            title: "Autonomous User Privacy Rights",
            content: [
              "Because WebRev avoids centralized user registration, you retain total data autonomy:",
            ],
            items: [
              "Right to Rectification: Rename your host profile at any time via 'Change Name'.",
              "Right to Erasure: Delete individual websites or trigger full storage purge upon logout.",
              "Right to Portability: Copy and export URLs and review notes freely without vendor lock-in.",
            ],
          },
        ],
      },
      {
        id: "disclaimer",
        slug: "disclaimer",
        navTitle: "Disclaimer",
        navDesc: "Liability limitations for audit metrics and independent host opinions",
        docCode: "WR-LEGAL-DISC-2026",
        method: "NOTICE",
        endpoint: "/legal/v1/disclaimer",
        badge: "DISCLAIMER & LIABILITY",
        title: "Legal Disclaimer & Limitations",
        version: "v1.2 (Active)",
        lastUpdated: "October 2, 2026",
        summary:
          "This disclaimer outlines the legal boundaries regarding the accuracy of third-party automated performance metrics, live streaming host commentary, and interactions with external web properties.",
        specBadges: [
          { label: "Purpose", val: "Educational & Reference" },
          { label: "Audit Source", val: "As-Is via Google Lighthouse" },
          { label: "Host Commentary", val: "Independent Opinion" },
        ],
        sections: [
          {
            id: "audit-accuracy",
            number: "01",
            tag: "AUDIT_ACCURACY_DISCLAIMER",
            title: "Performance Audit Accuracy Disclaimer",
            content: [
              "Performance testing tools and metrics (FCP, LCP, TBT, CLS, Speed Index) are provided on an 'as-is' and 'as-available' basis as computed by the Google Lighthouse engine at the time of testing.",
              "WebRev does not guarantee that audit results will remain consistent over time. Metric variations may arise from target server loads, network latency, Content Delivery Network (CDN) behavior, and caching dynamics.",
            ],
            callout: {
              type: "warning",
              title: "No Commercial Guarantees",
              text: "Attaining a 100/100 score in PageSpeed does not guarantee increased business revenue, sales conversions, or first-page organic ranking on search engines.",
            },
          },
          {
            id: "host-opinions",
            number: "02",
            tag: "STREAM_HOST_OPINION",
            title: "Independent Host Commentary & Opinions",
            content: [
              "Remarks, ratings, design critiques, and suggestions voiced by Hosts during live review sessions represent the subjective, independent viewpoints of the respective Host.",
              "Such opinions do not represent the official stance, endorsement, or policy of WebRev. WebRev disclaims all liability regarding disputes between Hosts and website owners.",
            ],
          },
          {
            id: "external-links",
            number: "03",
            tag: "EXTERNAL_WEBSITES",
            title: "External Links & Third-Party Sites",
            content: [
              "The WebRev application embeds and links to external third-party websites for demonstration and evaluation. WebRev has no control over, and assumes no responsibility for, the content, security, or privacy policies of third-party domains.",
              "Adding an external URL to WebRev does not constitute an endorsement, partnership, or sponsorship of that external entity.",
            ],
          },
          {
            id: "limitation-of-damages",
            number: "04",
            tag: "LIMITATION_OF_DAMAGES",
            title: "Limitation of Legal Liability",
            content: [
              "To the maximum extent permissible under applicable law, WebRev, its creators, and contributors shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from:",
            ],
            items: [
              "The use of or inability to use the WebRev platform.",
              "Technical modifications made to a website based on review recommendations.",
              "Outages or rate limits encountered with third-party APIs (Google PageSpeed API).",
              "Local storage data clearing caused by browser configuration or user action.",
            ],
          },
        ],
      },
    ],
  },
};
