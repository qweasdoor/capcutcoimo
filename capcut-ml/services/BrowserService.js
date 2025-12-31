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
   * Click on element
   * @param {Page} page - Puppeteer page instance
   * @param {string} selector - CSS selector
   * @returns {Promise<void>}
   */
  static async clickElement(page, selector) {
    await page.waitForSelector(selector, { 
      visible: true, 
      timeout: CONFIG.TIMING.SELECTOR_TIMEOUT 
    });
    await page.click(selector);
  }

  /**
   * Select dropdown item by text
   * @param {Page} page - Puppeteer page instance
   * @param {string} itemText - Text of the item to select
   * @returns {Promise<void>}
   */
  static async selectDropdownItem(page, itemText) {
    await page.waitForSelector(CONFIG.CAPCUT.SELECTORS.DROPDOWN_ITEMS, { 
      visible: true, 
      timeout: CONFIG.TIMING.SELECTOR_TIMEOUT 
    });
    
    await page.evaluate((text) => {
      const items = document.querySelectorAll('.lv-select-popup li');
      items.forEach(item => {
        if (item.innerText.trim() === String(text)) {
          item.click();
        }
      });
    }, itemText);
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