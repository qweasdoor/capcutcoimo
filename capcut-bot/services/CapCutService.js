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
  const {
    BIRTHDAY_INPUT,
    BIRTHDAY_MONTH_SELECTOR,
    BIRTHDAY_DAY_SELECTOR,
    BIRTHDAY_NEXT_BUTTON
  } = CONFIG.CAPCUT.SELECTORS;

  const timeout = CONFIG.TIMING.SELECTOR_TIMEOUT ?? 20000;
  const typingDelay = CONFIG.TIMING.TYPING_DELAY ?? 30;

  const birthday = generateRandomBirthday();

  // Helper: find a frame that contains selector (or null for main page)
  async function getContextWithSelector(sel) {
    // Try main page first
    const inMain = await page.$(sel);
    if (inMain) return { ctx: page, isFrame: false };

    // Try frames
    for (const fr of page.frames()) {
      try {
        const h = await fr.$(sel);
        if (h) return { ctx: fr, isFrame: true };
      } catch (_) {}
    }
    return { ctx: page, isFrame: false }; // fallback
  }

  // Helper: wait until element exists and is visible-ish & has size
  async function waitInteractable(ctx, sel) {
    await ctx.waitForFunction(
      (s) => {
        const el = document.querySelector(s);
        if (!el) return false;
        const r = el.getBoundingClientRect();
        const st = window.getComputedStyle(el);
        const visible =
          r.width > 0 &&
          r.height > 0 &&
          st.display !== "none" &&
          st.visibility !== "hidden" &&
          st.opacity !== "0";
        return visible;
      },
      { timeout },
      sel
    );
  }

  // Helper: scroll and click safely
  async function scrollAndClick(ctx, sel) {
    try {
      // puppeteer Page supports $eval; Frame supports evaluate + querySelector too
      if (ctx.$eval) {
        await ctx.$eval(sel, (el) => el.scrollIntoView({ block: "center", inline: "center" }));
      } else {
        await ctx.evaluate((s) => {
          const el = document.querySelector(s);
          el?.scrollIntoView({ block: "center", inline: "center" });
        }, sel);
      }
    } catch (_) {}

    await ctx.click(sel, { delay: 50 });
  }

  // Helper: select dropdown item by visible text (works for many custom lists)
  async function clickItemByText(ctx, text) {
    const wanted = String(text).trim();

    // Wait some options to appear (generic)
    await ctx.waitForFunction(() => {
      const els = document.querySelectorAll('[role="option"], li, [data-value], button');
      return els && els.length > 0;
    }, { timeout });

    const clicked = await ctx.evaluate((t) => {
      const candidates = [
        ...document.querySelectorAll('[role="option"], li, [data-value], button, div')
      ];

      // Try exact match by text
      let el =
        candidates.find(e => (e.textContent || "").trim() === t) ||
        candidates.find(e => (e.getAttribute("data-value") || "").trim() === t);

      // Try case-insensitive contains
      if (!el) {
        const low = t.toLowerCase();
        el = candidates.find(e => (e.textContent || "").trim().toLowerCase() === low) ||
             candidates.find(e => (e.textContent || "").trim().toLowerCase().includes(low));
      }

      if (el && typeof el.click === "function") {
        el.click();
        return true;
      }
      return false;
    }, wanted);

    return clicked;
  }

  try {
    // Wait for navigation/JS rendering to calm down a bit (optional)
    if (page.waitForNetworkIdle) {
      await page.waitForNetworkIdle({ idleTime: 800, timeout: 15000 }).catch(() => {});
    }

    // Find correct context (page or iframe) containing birthday input
    const { ctx } = await getContextWithSelector(BIRTHDAY_INPUT);

    // Wait interactable birthday input
    await waitInteractable(ctx, BIRTHDAY_INPUT);

    // Scroll + focus
    try {
      if (ctx.$eval) {
        await ctx.$eval(BIRTHDAY_INPUT, (el) => el.scrollIntoView({ block: "center" }));
      } else {
        await ctx.evaluate((s) => document.querySelector(s)?.scrollIntoView({ block: "center" }), BIRTHDAY_INPUT);
      }
    } catch (_) {}

    // Clear existing value (best-effort)
    try {
      await ctx.click(BIRTHDAY_INPUT, { clickCount: 3 });
      await ctx.keyboard.press("Backspace");
    } catch (_) {}

    // Try typing year into input
    let yearFilled = false;
    try {
      await ctx.type(BIRTHDAY_INPUT, String(birthday.year), { delay: typingDelay });
      yearFilled = true;
    } catch (_) {}

    // Fallback: set value via DOM if typing failed
    if (!yearFilled) {
      await ctx.evaluate((sel, val) => {
        const el = document.querySelector(sel);
        if (!el) return;
        el.value = val;
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
      }, BIRTHDAY_INPUT, String(birthday.year));
    }

    // Month selection
    if (BIRTHDAY_MONTH_SELECTOR) {
      await waitInteractable(ctx, BIRTHDAY_MONTH_SELECTOR);
      await scrollAndClick(ctx, BIRTHDAY_MONTH_SELECTOR);
      await sleep(CONFIG.TIMING.PAGE_WAIT ?? 300);

      // Try click by text
      const monthClicked = await clickItemByText(ctx, birthday.month);
      if (!monthClicked) {
        // fallback: try typing month into an active input if any
        try {
          await ctx.keyboard.type(String(birthday.month), { delay: typingDelay });
          await ctx.keyboard.press("Enter");
        } catch (_) {}
      }
    }

    // Day selection
    if (BIRTHDAY_DAY_SELECTOR) {
      await waitInteractable(ctx, BIRTHDAY_DAY_SELECTOR);
      await scrollAndClick(ctx, BIRTHDAY_DAY_SELECTOR);
      await sleep(CONFIG.TIMING.PAGE_WAIT ?? 300);

      const dayClicked = await clickItemByText(ctx, birthday.day);
      if (!dayClicked) {
        try {
          await ctx.keyboard.type(String(birthday.day), { delay: typingDelay });
          await ctx.keyboard.press("Enter");
        } catch (_) {}
      }
    }

    console.log(chalk.green(`📆 Tanggal lahir dipilih: ${birthday.day} ${birthday.month} ${birthday.year}`));

    // Click next button
    const nextCtxInfo = await getContextWithSelector(BIRTHDAY_NEXT_BUTTON);
    await waitInteractable(nextCtxInfo.ctx, BIRTHDAY_NEXT_BUTTON);
    await scrollAndClick(nextCtxInfo.ctx, BIRTHDAY_NEXT_BUTTON);

    return birthday;
  } catch (error) {
    console.error(chalk.red("Gagal mengisi tanggal lahir!"), error.message);
    throw error;
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