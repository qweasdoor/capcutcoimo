/**
 * File Service for handling file operations
 */

import fs from 'fs';
import { CONFIG } from '../config/config.js';
import chalk from 'chalk';

export class FileService {
  /**
   * Read password from file
   * @returns {string} Password
   */
  static getPassword() {
    try {
      console.log(chalk.blue('🔑 Membaca password dari file password.txt...'));
      const password = fs.readFileSync(CONFIG.FILES.PASSWORD_FILE, 'utf8').trim();
      return password || CONFIG.FILES.DEFAULT_PASSWORD;
    } catch (error) {
      console.warn(chalk.yellow('⚠️  File password.txt tidak ditemukan! Menggunakan password default.'));
      return CONFIG.FILES.DEFAULT_PASSWORD;
    }
  }

  /**
   * Save account data to file
   * @param {string} data - Account data to save
   */
  static saveAccount(data) {
    try {
      fs.appendFileSync(CONFIG.FILES.ACCOUNTS_FILE, data, 'utf8');
      console.log(chalk.green('💾 Akun berhasil disimpan ke accounts.txt!'));
    } catch (error) {
      console.error(chalk.red('❌ Gagal menyimpan akun ke file!'), error);
      throw error;
    }
  }

  /**
   * Check if file exists
   * @param {string} filePath - Path to file
   * @returns {boolean} True if file exists
   */
  static fileExists(filePath) {
    try {
      return fs.existsSync(filePath);
    } catch (error) {
      return false;
    }
  }
}