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
   * @param {Page} page - Puppeteer page instance
   * @param {string} email - Email address
   * @returns {Promise<void>}
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
   * @param {Page} page - Puppeteer page instance
   * @param {string} password - Password
   * @returns {Promise<void>}
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
 * Fill in birthday information (robust version)
 * - Handles slow rendering, hidden elements, iframe, and custom pickers
 * - Works for Puppeteer Page
 */
static async fillBirthday(page) {
  const birthday = generateRandomBirthday();
  // contoh return:
  // { year: 1999, month: "July", day: 12 }

  try {
    // 1) Isi YEAR
    await page.waitForSelector('input[placeholder="Year"]', { visible: true });
    await page.type('input[placeholder="Year"]', String(birthday.year), { delay: 50 });

    // Ambil semua dropdown (Month = index 0, Day = index 1)
    const dropdowns = await page.$$('div[role="combobox"]');
    if (dropdowns.length < 2) {
      throw new Error('Dropdown Month/Day tidak ditemukan');
    }

    // 2) Pilih MONTH
    await dropdowns[0].click();
    await page.waitForSelector('li[role="option"]', { visible: true });

    await page.evaluate((month) => {
      const items = [...document.querySelectorAll('li[role="option"]')];
      const target = items.find(i =>
        i.textContent.trim().toLowerCase() === month.toLowerCase()
      );
      if (target) target.click();
    }, birthday.month);

    // 3) Pilih DAY
    await dropdowns[1].click();
    await page.waitForSelector('li[role="option"]', { visible: true });

    await page.evaluate((day) => {
      const items = [...document.querySelectorAll('li[role="option"]')];
      const target = items.find(i =>
        i.textContent.trim() === String(day)
      );
      if (target) target.click();
    }, birthday.day);

    // 4) Klik NEXT (akan enabled otomatis)
    await page.waitForFunction(() => {
      const btn = document.querySelector('button[type="submit"]');
      return btn && !btn.disabled;
    });

    await page.click('button[type="submit"]');

    console.log(`📆 Birthday set: ${birthday.day} ${birthday.month} ${birthday.year}`);
    return birthday;

  } catch (err) {
    console.error('❌ Gagal isi birthday:', err.message);
    throw err;
  }
}



  /**
   * Enter OTP code
   * @param {Page} page - Puppeteer page instance
   * @param {string} otpCode - OTP code
   * @returns {Promise<void>}
   */
  static async enterOTP(page, otpCode) {
    try {
      await BrowserService.typeIntoField(
        page, 
        CONFIG.CAPCUT.SELECTORS.OTP_INPUT, 
        otpCode
      );
      console.log(chalk.green('✅ Kode OTP dimasukkan dan verifikasi berhasil!'));
    } catch (error) {
      console.error(chalk.red('Gagal memasukkan kode OTP!'));
      throw error;
    }
  }

  /**
   * Create a CapCut account
   * @param {number} accountNumber - Account number being created
   * @param {number} totalAccounts - Total accounts to create
   * @returns {Promise<Object|null>} Account data or null if failed
   */
  static async createAccount(accountNumber, totalAccounts) {
    let browser = null;

    try {
      console.log(chalk.magenta(`\n🚀 Memproses akun ${accountNumber} dari ${totalAccounts}`));

      // Initialize browser
      const browserData = await BrowserService.initializeBrowser();
      browser = browserData.browser;
      const page = browserData.page;

      // Get email
      const email = await EmailService.getNewEmail();

      // Get password
      const password = FileService.getPassword();

      // Navigate to signup page
      const signupSpinner = ora(chalk.blue('Membuka halaman signup CapCut...')).start();
      await BrowserService.navigateToURL(
        page,
        CONFIG.CAPCUT.SIGNUP_URL,
        'Gagal membuka halaman signup!'
      );
      signupSpinner.succeed(chalk.green('Halaman signup dibuka!'));

      // Fill email
      await this.fillEmail(page, email);

      // Fill password
      await this.fillPassword(page, password);

      // Fill birthday
      const birthday = await this.fillBirthday(page);

      // Wait for and enter OTP
      const otpCode = await EmailService.waitForOTP(email);
      await this.enterOTP(page, otpCode);

      // Save account data
      const accountData = formatAccountData(accountNumber, email, password, birthday);
      FileService.saveAccount(accountData);

      // Wait before closing
      await sleep(CONFIG.TIMING.FINAL_WAIT);
      await BrowserService.closeBrowser(browser);

      return { email, password, birthDate: `${birthday.day} ${birthday.month} ${birthday.year}` };

    } catch (error) {
      console.error(chalk.red(`❌ Gagal membuat akun #${accountNumber}:`), error.message);
      await BrowserService.closeBrowser(browser);
      return null;
    }
  }
}


