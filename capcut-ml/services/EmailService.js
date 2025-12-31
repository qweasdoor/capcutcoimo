/**
 * Email Service for handling Temp-Mail API operations
 */

import axios from 'axios';
import { CONFIG } from '../config/config.js';
import { sleep, extractOTPCode } from '../utils/helpers.js';
import chalk from 'chalk';
import ora from 'ora';

export class EmailService {
  /**
   * Get new temporary email address
   * @returns {Promise<string>} Email address
   * @throws {Error} If unable to get email
   */
  static async getNewEmail() {
    const spinner = ora(chalk.blue('Mendapatkan email dari Temp-Mail...')).start();
    
    try {
      const { BASE_URL, ENDPOINTS, EMAIL_CONFIG } = CONFIG.TEMP_MAIL_API;
      
      const response = await axios.post(
        `${BASE_URL}${ENDPOINTS.NEW_EMAIL}`,
        {
          min_name_length: EMAIL_CONFIG.MIN_NAME_LENGTH,
          max_name_length: EMAIL_CONFIG.MAX_NAME_LENGTH
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      const email = response.data.email;
      spinner.succeed(chalk.green(`Email yang digunakan: ${email}`));
      return email;
      
    } catch (error) {
      spinner.fail(chalk.red('Gagal mendapatkan email!'));
      console.error(error);
      throw new Error('Failed to get temporary email');
    }
  }

  /**
   * Wait for and retrieve OTP code from email
   * @param {string} email - Email address to check
   * @returns {Promise<string>} OTP code
   * @throws {Error} If unable to retrieve OTP
   */
  static async waitForOTP(email) {
    const spinner = ora(chalk.blue('Menunggu kode OTP dari email...')).start();
    const { BASE_URL, ENDPOINTS } = CONFIG.TEMP_MAIL_API;
    const { OTP_CHECK_INTERVAL, OTP_MAX_ATTEMPTS } = CONFIG.TIMING;

    try {
      let attempts = 0;
      
      while (attempts < OTP_MAX_ATTEMPTS) {
        await sleep(OTP_CHECK_INTERVAL);
        
        const response = await axios.get(
          `${BASE_URL}${ENDPOINTS.GET_MESSAGES(email)}`
        );

        if (response.data.length > 0) {
          const latestEmail = response.data[0];
          const otpCode = extractOTPCode(latestEmail.body_text);
          
          if (otpCode) {
            spinner.succeed(chalk.green(`📩 Kode OTP yang diterima: ${otpCode}`));
            return otpCode;
          }
        }
        
        attempts++;
      }

      spinner.fail(chalk.red('Tidak ada email masuk setelah waktu timeout.'));
      throw new Error('OTP not received within timeout period');
      
    } catch (error) {
      spinner.fail(chalk.red('Gagal mengambil kode OTP!'));
      console.error(error);
      throw error;
    }
  }
}