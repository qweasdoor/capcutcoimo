# 🤖 CapCut Account Creator Bot

Bot otomatis untuk membuat akun CapCut menggunakan Puppeteer dan Temp-Mail API dengan arsitektur yang clean dan modular.

## ✨ Fitur

- 🔹 **Membuat akun CapCut otomatis** menggunakan email dari Temp-Mail
- 🔹 **Arsitektur modular** dengan separation of concerns
- 🔹 **Puppeteer Extra** dengan plugin Stealth untuk menghindari deteksi bot
- 🔹 **User-Agent Acak** untuk setiap akun dengan fingerprint browser berbeda
- 🔹 **Konfigurasi terpusat** yang mudah dikelola
- 🔹 **Error handling** yang robust
- 🔹 **Logging** yang informatif dengan warna
- 🔹 **Menyimpan akun** yang berhasil didaftarkan ke dalam file

## 📁 Struktur Proyek

```
capcut-bot/
├── src/
│   ├── config/
│   │   └── config.js          # Konfigurasi aplikasi
│   ├── core/
│   │   └── AccountCreator.js  # Orchestrator utama
│   ├── services/
│   │   ├── BrowserService.js  # Service untuk Puppeteer
│   │   ├── CapCutService.js   # Service untuk CapCut
│   │   ├── EmailService.js    # Service untuk Temp-Mail
│   │   ├── FileService.js     # Service untuk file operations
│   │   └── UserInterface.js   # Service untuk UI
│   ├── utils/
│   │   └── helpers.js         # Helper functions
│   └── main.js               # Entry point
├── accounts.txt              # Output akun yang berhasil
├── password.txt              # Password untuk akun
├── package.json
└── README.md
```

## 🚀 Instalasi

Pastikan kamu sudah menginstal **Node.js** (versi 18 atau lebih tinggi) di sistemmu.

```bash
# Clone repository ini
git clone https://github.com/Gugun09/capcut-bot.git
cd capcut-bot

# Install dependensi
npm install
```

## 🔧 Konfigurasi

1. **Buat file `password.txt`** di dalam folder project dan isi dengan password yang ingin digunakan untuk semua akun.

   ```bash
   echo "MySecurePassword123!" > password.txt
   ```

2. **(Opsional)** Sesuaikan konfigurasi di `src/config/config.js` jika diperlukan:
   - Timeout settings
   - Browser settings
   - Birthday range
   - Dan lain-lain

## 📖 Penggunaan

```bash
# Jalankan bot
npm start

# Atau dengan debug mode
npm run debug
```

Bot akan menanyakan berapa banyak akun yang ingin dibuat, kemudian akan memulai proses pembuatan akun secara otomatis.

## 📄 Output

Akun yang berhasil dibuat akan disimpan di file `accounts.txt` dengan format:

```
Akun #1
Email: example1@tempmail.com
Password: MySecurePassword123!
Tanggal Lahir: 15 Maret 1995
----------------------

Akun #2
Email: example2@tempmail.com
Password: MySecurePassword123!
Tanggal Lahir: 23 Juli 1998
----------------------
```

## 🏗️ Arsitektur

### Layer Structure

1. **Config Layer**: Menyimpan semua konfigurasi aplikasi
2. **Core Layer**: Logic utama aplikasi (AccountCreator)
3. **Service Layer**: Business logic yang spesifik
   - BrowserService: Mengelola Puppeteer browser
   - CapCutService: Mengelola proses signup CapCut
   - EmailService: Mengelola Temp-Mail API
   - FileService: Mengelola file operations
   - UserInterface: Mengelola interaksi dengan user
4. **Utils Layer**: Helper functions dan utilities

### Design Principles

- **Single Responsibility**: Setiap class/module memiliki satu tanggung jawab
- **Separation of Concerns**: Pemisahan logic berdasarkan domain
- **DRY (Don't Repeat Yourself)**: Reusable code dengan utils dan helpers
- **Error Handling**: Proper error handling di setiap layer
- **Configuration Management**: Centralized configuration

## 🛠️ Teknologi yang Digunakan

- **Node.js**: Runtime environment
- **Puppeteer**: Browser automation
- **Puppeteer Extra**: Plugin system untuk Puppeteer
- **Stealth Plugin**: Anti-detection
- **Axios**: HTTP client
- **Chalk**: Terminal styling
- **Ora**: Terminal spinner

## 🔐 Keamanan

- Password disimpan di file lokal (tidak di-commit ke git)
- User-Agent randomization
- Stealth mode untuk menghindari deteksi
- Delay random antar pembuatan akun

## 🐛 Troubleshooting

### Browser tidak terbuka
Pastikan Chromium sudah terinstall dengan benar:
```bash
npx puppeteer browsers install chrome
```

### OTP tidak diterima
- Periksa koneksi internet
- Tunggu lebih lama (OTP biasanya datang dalam 30-50 detik)
- Coba ulang dengan akun baru

### Error timeout
Tingkatkan nilai timeout di `src/config/config.js`:
```javascript
TIMING: {
  NAVIGATION_TIMEOUT: 120000, // 2 menit
  SELECTOR_TIMEOUT: 20000,    // 20 detik
  // ...
}
```

## 📝 Contributing

Kontribusi selalu diterima! Silakan:
1. Fork repository ini
2. Buat branch untuk fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📜 Lisensi

Proyek ini dirilis di bawah lisensi **MIT**. Silakan gunakan dengan bebas! 😊

## 👨‍💻 Author

**Nanda Gunawan**
- Email: admin@countryssh.com
- Website: [countryssh.com](https://countryssh.com)

## ⚠️ Disclaimer

Bot ini dibuat untuk tujuan edukasi. Penggunaan bot untuk melanggar terms of service CapCut adalah tanggung jawab pengguna. Gunakan dengan bijak!

## 🙏 Acknowledgments

- [Puppeteer](https://pptr.dev/)
- [Temp-Mail](https://temp-mail.io/)
- Semua kontributor open source yang membuat proyek ini mungkin