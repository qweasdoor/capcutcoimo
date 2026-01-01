/**
 * Configuration file for CapCut Account Creator
 */

export const CONFIG = {
  // Temp-Mail API Configuration
  TEMP_MAIL_API: {
    BASE_URL: 'https://api.internal.temp-mail.io/api/v3',
    ENDPOINTS: {
      NEW_EMAIL: '/email/new',
      GET_MESSAGES: (email) => `/email/${email}/messages`
    },
    EMAIL_CONFIG: {
      MIN_NAME_LENGTH: 10,
      MAX_NAME_LENGTH: 10
    }
  },

// CapCut Website Configuration
  // config.js
CAPCUT: {
  SELECTORS: {
    EMAIL_INPUT: 'input[name="signUsername"]',
    CONTINUE_BUTTON: '.lv_sign_in_panel_wide-primary-button', // Tombol Lanjutkan
    
    PASSWORD_INPUT: 'input[type="password"]',
    SIGNUP_BUTTON: '.lv_sign_in_panel_wide-sign-in-button', // PERBAIKAN: Gunakan class ini
    
    BIRTHDAY_INPUT: 'input[placeholder="Tahun"]',
    BIRTHDAY_MONTH_SELECTOR: '.gate_birthday-picker-selector:nth-of-type(1)', 
    BIRTHDAY_DAY_SELECTOR: '.gate_birthday-picker-selector:nth-of-type(2)',
    BIRTHDAY_NEXT_BUTTON: '.lv_sign_in_panel_wide-birthday-next', // Tombol Berikutnya
    // ...
  }
},

  // Browser Configuration
  BROWSER: {
    HEADLESS: true,
    VIEWPORT: {
      MIN_WIDTH: 1280,
      MAX_WIDTH: 1920,
      MIN_HEIGHT: 720,
      MAX_HEIGHT: 1080
    }
  },

  // Timing Configuration (in milliseconds)
  TIMING: {
    TYPING_DELAY: 100,
    NAVIGATION_TIMEOUT: 60000,
    SELECTOR_TIMEOUT: 20000,
    OTP_CHECK_INTERVAL: 5000,
    OTP_MAX_ATTEMPTS: 10,
    ACCOUNT_CREATION_DELAY_MIN: 3000,
    ACCOUNT_CREATION_DELAY_MAX: 10000,
    PAGE_WAIT: 1000,
    FINAL_WAIT: 3000
  },

  // Birthday Configuration
  // PENTING: Nama bulan diubah kembali ke Bahasa Indonesia sesuai Gambar 3
  BIRTHDAY: {
  // Pastikan nama bulan Bahasa Indonesia agar cocok dengan UI di Gambar 3
  MONTHS: [
    { name: "Januari", days: 31 }, { name: "Februari", days: 28 }, { name: "Maret", days: 31 },
    { name: "April", days: 30 }, { name: "Mei", days: 31 }, { name: "Juni", days: 30 },
    { name: "Juli", days: 31 }, { name: "Agustus", days: 31 }, { name: "September", days: 30 },
    { name: "Oktober", days: 31 }, { name: "November", days: 30 }, { name: "Desember", days: 31 }
  ]
}

  // File Configuration
  FILES: {
    PASSWORD_FILE: 'password.txt',
    ACCOUNTS_FILE: 'accounts.txt',
    DEFAULT_PASSWORD: 'keep123'
  }

};



