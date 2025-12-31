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
  CAPCUT: {
    SIGNUP_URL: 'https://www.capcut.com/id-id/signup',
    SELECTORS: {
      EMAIL_INPUT: 'input[name="signUsername"]',
      PASSWORD_INPUT: 'input[type="password"]',
      CONTINUE_BUTTON: 'button[type="submit"], .lv_sign_in_panel_wide-primary-button', 
      SIGNUP_BUTTON: 'button[type="submit"]',
      // Sesuai Gambar: Input Tahun adalah field pertama
      BIRTHDAY_INPUT: 'input[placeholder="Year"]', 
      // Sesuai Gambar: Month adalah dropdown kedua, Day adalah ketiga
      BIRTHDAY_MONTH_SELECTOR: '.capcut-select:nth-of-type(2), [role="combobox"]:nth-of-type(2)',
      BIRTHDAY_DAY_SELECTOR: '.capcut-select:nth-of-type(3), [role="combobox"]:nth-of-type(3)',
      BIRTHDAY_NEXT_BUTTON: 'button.lv_sign_in_panel_wide-primary-button:not([disabled])',
      OTP_INPUT: 'input.lv-input',
      DROPDOWN_ITEMS: 'li[role="option"], .capcut-select-option'
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
    SELECTOR_TIMEOUT: 10000,
    OTP_CHECK_INTERVAL: 5000,
    OTP_MAX_ATTEMPTS: 10,
    ACCOUNT_CREATION_DELAY_MIN: 3000,
    ACCOUNT_CREATION_DELAY_MAX: 10000,
    PAGE_WAIT: 500,
    FINAL_WAIT: 3000
  },

  // Birthday Configuration
  // PENTING: Ubah nama bulan ke Bahasa Inggris agar sesuai dengan UI di gambar
  BIRTHDAY: {
    MIN_YEAR: 1990,
    MAX_YEAR: 2003,
    MONTHS: [
      { name: "January", days: 31 },
      { name: "February", days: 28 },
      { name: "March", days: 31 },
      { name: "April", days: 30 },
      { name: "May", days: 31 },
      { name: "June", days: 30 },
      { name: "July", days: 31 },
      { name: "August", days: 31 },
      { name: "September", days: 30 },
      { name: "October", days: 31 },
      { name: "November", days: 30 },
      { name: "December", days: 31 }
    ]
  },

  // File Configuration
  FILES: {
    PASSWORD_FILE: 'password.txt',
    ACCOUNTS_FILE: 'accounts.txt',
    DEFAULT_PASSWORD: 'masuk123'
  }
};