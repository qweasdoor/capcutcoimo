/**
 * Browser Service for handling Puppeteer browser operations
 */

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import randomUserAgent from 'user-agents';
import { CONFIG } from '../config/config.js';
import { getRandomViewport } from '../utils/helpers.js';

// Use stealth plugin to avoid bot detection
puppeteer.use(StealthPlugin());

export class BrowserService {
  /**
   * Initialize and configure browser
   * @returns {Promise<{browser: Browser, page: Page}>} Browser and page instances
   */
  static async initializeBrowser() {
    const browser = await puppeteer.launch({ 
      headless: CONFIG.BROWSER.HEADLESS 
    });
    
    const page = await browser.newPage();

    // Set random User-Agent
    await page.setUserAgent(new randomUserAgent().toString());

    // Set random viewport
    await page.setViewport(getRandomViewport());

    return { browser, page };
  }

  /**
   * Navigate to URL with error handling
   * @param {Page} page - Puppeteer page instance
   * @param {string} url - URL to navigate to
   * @param {string} errorMessage - Error message to display
   * @returns {Promise<void>}
   * @throws {Error} If navigation fails
   */
  static async navigateToURL(page, url, errorMessage) {
    try {
      await page.goto(url, { 
        waitUntil: 'networkidle2', 
        timeout: CONFIG.TIMING.NAVIGATION_TIMEOUT 
      });
    } catch (error) {
      console.error(errorMessage);
      throw error;
    }
  }

  /**
   * Type text into input field
   * @param {Page} page - Puppeteer page instance
   * @param {string} selector - CSS selector
   * @param {string} text - Text to type
   * @returns {Promise<void>}
   */
  static async typeIntoField(page, selector, text) {
    await page.waitForSelector(selector, { 
      visible: true, 
      timeout: CONFIG.TIMING.SELECTOR_TIMEOUT 
    });
    await page.type(selector, text, { 
      delay: CONFIG.TIMING.TYPING_DELAY 
    });
  }

 /**
   * Perbaikan Click: Menangani selector class secara dinamis
   */
  static async clickElement(page, selector) {
    await page.waitForSelector(selector, { 
      visible: true, 
      timeout: CONFIG.TIMING.SELECTOR_TIMEOUT 
    });
    // Gunakan evaluate untuk klik yang lebih stabil pada elemen custom
    await page.evaluate((sel) => {
      document.querySelector(sel).click();
    }, selector);
  }

  /**
   * Helper baru untuk klik berdasarkan teks (Sangat berguna untuk tombol 'Daftar')
   */
  static async clickByText(page, text) {
    await page.evaluate((t) => {
      const buttons = Array.from(document.querySelectorAll('button, div, span'));
      const target = buttons.find(el => el.innerText.trim() === t);
      if (target) target.click();
    }, text);
  }

  /**
   * Close browser instance
   * @param {Browser} browser - Browser instance to close
   * @returns {Promise<void>}
   */
  static async closeBrowser(browser) {
    if (browser) {
      await browser.close();
    }
  }

}
