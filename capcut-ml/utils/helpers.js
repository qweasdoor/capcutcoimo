/**
 * Utility functions for CapCut Account Creator
 */

import { CONFIG } from '../config/config.js';

/**
 * Generate random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 */
export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generate random viewport dimensions
 * @returns {{width: number, height: number}} Viewport dimensions
 */
export const getRandomViewport = () => {
  const { MIN_WIDTH, MAX_WIDTH, MIN_HEIGHT, MAX_HEIGHT } = CONFIG.BROWSER.VIEWPORT;
  return {
    width: getRandomInt(MIN_WIDTH, MAX_WIDTH),
    height: getRandomInt(MIN_HEIGHT, MAX_HEIGHT),
    deviceScaleFactor: 1,
    hasTouch: false,
    isMobile: false
  };
};

/**
 * Generate random birthday data
 * @returns {{year: number, month: string, day: number}} Birthday data
 */
export const generateRandomBirthday = () => {
  const { MIN_YEAR, MAX_YEAR, MONTHS } = CONFIG.BIRTHDAY;
  
  const year = getRandomInt(MIN_YEAR, MAX_YEAR);
  const monthIndex = getRandomInt(0, MONTHS.length - 1);
  const month = MONTHS[monthIndex];
  const day = getRandomInt(1, month.days);

  return {
    year,
    month: month.name,
    day
  };
};

/**
 * Sleep for specified milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Calculate random delay between accounts
 * @returns {number} Delay in milliseconds
 */
export const getRandomDelay = () => {
  const { ACCOUNT_CREATION_DELAY_MIN, ACCOUNT_CREATION_DELAY_MAX } = CONFIG.TIMING;
  return getRandomInt(ACCOUNT_CREATION_DELAY_MIN, ACCOUNT_CREATION_DELAY_MAX);
};

/**
 * Format account data for display
 * @param {number} accountNumber - Account number
 * @param {string} email - Email address
 * @param {string} password - Password
 * @param {Object} birthday - Birthday data
 * @returns {string} Formatted account data
 */
export const formatAccountData = (accountNumber, email, password, birthday) => {
  return `Akun #${accountNumber}
Email: ${email}
Password: ${password}
Tanggal Lahir: ${birthday.day} ${birthday.month} ${birthday.year}
----------------------
`;
};

/**
 * Extract OTP code from email body
 * @param {string} emailBody - Email body text
 * @returns {string|null} OTP code or null if not found
 */
export const extractOTPCode = (emailBody) => {
  const match = emailBody.match(/(\d{6})/);
  return match ? match[1] : null;
};