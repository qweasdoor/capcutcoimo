/**
 * CapCut Service for handling account creation workflow
 */

import { CONFIG } from '../config/config.js';
import { BrowserService } from './BrowserService.js';
import { EmailService } from './EmailService.js';
import { FileService } from './FileService.js';
import { generateRandomBirthday, sleep, formatAccountData } from '../utils/helpers.js';
import chalk from 'chalk';
import ora from 'ora';

export class CapCutService {
  /**
   * Fill in email on signup page
   */
  static async fillEmail(page, email) {
    const spinner = ora(chalk.blue('Mengisi email...')).start();
    try {
      const { EMAIL_INPUT, CONTINUE_BUTTON } = CONFIG.CAPCUT.SELECTORS;
      await BrowserService.typeIntoField(page, EMAIL_INPUT, email);
      await BrowserService.clickElement(page, CONTINUE_BUTTON);
      spinner.succeed(chalk.green('Berhasil mengisi email!'));
    } catch (error) {
      spinner.fail(chalk.red('Gagal mengisi email!'));
      throw error;
    }
  }

  /**
   * Fill in password on signup page
   */
  static async fillPassword(page, password) {
    try {
      const { PASSWORD_INPUT, SIGNUP_BUTTON } = CONFIG.CAPCUT.SELECTORS;
      await BrowserService.typeIntoField(page, PASSWORD_INPUT, password);
      await BrowserService.clickElement(page, SIGNUP_BUTTON);
    } catch (error) {
      console.error(chalk.red('Gagal mengisi password!'));
      throw error;
    }
  }

  /**
   * Fill in birthday information (Optimized for UI provided)
   */
  static async fillBirthday(page) {
    const {
      BIRTHDAY_INPUT,
      BIRTHDAY_MONTH_SELECTOR,
      BIRTHDAY_DAY_SELECTOR,
      BIRTHDAY_NEXT_BUTTON
    } = CONFIG.CAPCUT.SELECTORS;

    const birthday = generateRandomBirthday();
    const timeout = CONFIG.TIMING.SELECTOR_TIMEOUT;

    try {
      // 1. ISI TAHUN (Input Field)
      // Sesuai gambar, Year adalah input teks pertama
      await page.waitForSelector(BIRTHDAY_INPUT, { timeout });
      await page.click(BIRTHDAY_INPUT, { clickCount: 3 });
      await page.keyboard.press('Backspace');
      await page.type(BIRTHDAY_INPUT, String(birthday.year), { delay: 50 });
      await page.keyboard.press('Enter');
      await sleep(500);

      // 2. ISI BULAN (Custom Dropdown)
      // Sesuai gambar, Month adalah elemen kedua
      if (BIRTHDAY_MONTH_SELECTOR) {
        await page.click(BIRTHDAY_MONTH_SELECTOR);
        await sleep(800); // Tunggu popup daftar bulan muncul
        const monthSuccess = await this.clickItemByText(page, birthday.month);
        if (!monthSuccess) throw new Error(`Bulan ${birthday.month} tidak ditemukan di daftar`);
      }

      // 3. ISI HARI (Custom Dropdown)
      // Sesuai gambar, Day adalah elemen ketiga
      if (BIRTHDAY_DAY_SELECTOR) {
        await page.click(BIRTHDAY_DAY_SELECTOR);
        await sleep(800); // Tunggu popup daftar tanggal muncul
        const daySuccess = await this.clickItemByText(page, birthday.day);
        if (!daySuccess) throw new Error(`Tanggal ${birthday.day} tidak ditemukan di daftar`);
      }

      console.log(chalk.green(`📆 Tanggal lahir dipilih: ${birthday.day} ${birthday.month} ${birthday.year}`));

      // 4. KLIK NEXT
      // Tombol Next akan aktif setelah semua field terisi
      await page.waitForSelector(BIRTHDAY_NEXT_BUTTON, { visible: true });
      await page.click(BIRTHDAY_NEXT_BUTTON);

      return birthday;
    } catch (error) {
      console.error(chalk.red("Gagal mengisi tanggal lahir!"), error.message);
      throw error;
    }
  }

  /**
   * Helper: Mencari dan mengeklik item di dalam dropdown berdasarkan teks
   */
  static async clickItemByText(page, text) {
    const targetText = String(text).trim();
    return await page.evaluate((t) => {
      // Mencari di dalam elemen popup (li atau role option)
      const items = Array.from(document.querySelectorAll('li, [role="option"], .capcut-select-option'));
      const found = items.find(el => 
        el.textContent.trim().toLowerCase() === t.toLowerCase() || 
        el.innerText.trim().toLowerCase() === t.toLowerCase()
      );
      if (found) {
        found.click();
        return true;
      }
      return false;
    }, targetText);
  }

  /**
   * Enter OTP code
   */
  static async enterOTP(page, otpCode) {
    try {
      await BrowserService.typeIntoField(page, CONFIG.CAPCUT.SELECTORS.OTP_INPUT, otpCode);
      console.log(chalk.green('✅ Kode OTP dimasukkan dan verifikasi berhasil!'));
    } catch (error) {
      console.error(chalk.red('Gagal memasukkan kode OTP!'));
      throw error;
    }
  }

  /**
   * Create a CapCut account workflow
   */
  static async createAccount(accountNumber, totalAccounts) {
    let browser = null;
    try {
      console.log(chalk.magenta(`\n🚀 Memproses akun ${accountNumber} dari ${totalAccounts}`));

      const browserData = await BrowserService.initializeBrowser();
      browser = browserData.browser;
      const page = browserData.page;

      const email = await EmailService.getNewEmail();
      const password = FileService.getPassword();

      const signupSpinner = ora(chalk.blue('Membuka halaman signup CapCut...')).start();
      await BrowserService.navigateToURL(page, CONFIG.CAPCUT.SIGNUP_URL);
      signupSpinner.succeed(chalk.green('Halaman signup dibuka!'));

      await this.fillEmail(page, email);
      await this.fillPassword(page, password);
      
      // Tahap pengisian tanggal lahir yang sudah disesuaikan UI
      const birthday = await this.fillBirthday(page);

      const otpCode = await EmailService.waitForOTP(email);
      await this.enterOTP(page, otpCode);

      const accountData = formatAccountData(accountNumber, email, password, birthday);
      FileService.saveAccount(accountData);

      await sleep(CONFIG.TIMING.FINAL_WAIT);
      await BrowserService.closeBrowser(browser);

      return { email, password, birthday };
    } catch (error) {
      console.error(chalk.red(`❌ Gagal membuat akun #${accountNumber}:`), error.message);
      if (browser) await BrowserService.closeBrowser(browser);
      return null;
    }
  }
}