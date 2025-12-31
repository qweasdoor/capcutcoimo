/**
 * User Interface Service for handling user interactions
 */

import readline from 'readline';
import chalk from 'chalk';

export class UserInterface {
  /**
   * Display welcome banner
   */
  static displayBanner() {
    console.log(chalk.yellow.bold('\n🎬 CAPCUT ACCOUNT CREATOR 🎬\n'));
  }

  /**
   * Ask user for number of accounts to create
   * @returns {Promise<number>} Number of accounts
   */
  static async askForAccountCount() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise(resolve => {
      rl.question(chalk.blue('🛠️  Berapa banyak akun yang ingin dibuat? '), (answer) => {
        rl.close();
        const count = parseInt(answer);
        resolve(isNaN(count) || count < 1 ? 1 : count);
      });
    });
  }

  /**
   * Display summary of account creation process
   * @param {Array} successfulAccounts - Array of successfully created accounts
   * @param {number} totalAccounts - Total accounts attempted
   */
  static displaySummary(successfulAccounts, totalAccounts) {
    console.log(chalk.green.bold('\n✨ PROSES SELESAI! ✨'));
    console.log(chalk.green(`Berhasil membuat ${successfulAccounts.length} dari ${totalAccounts} akun.\n`));
    
    if (successfulAccounts.length > 0) {
      console.log(chalk.cyan('📝 Daftar akun yang berhasil dibuat:'));
      successfulAccounts.forEach((acc, index) => {
        console.log(chalk.cyan(`\nAkun #${index + 1}:`));
        console.log(chalk.cyan(`Email: ${acc.email}`));
        console.log(chalk.cyan(`Password: ${acc.password}`));
        console.log(chalk.cyan(`Tanggal Lahir: ${acc.birthDate}`));
      });
    }
  }

  /**
   * Display progress message between account creations
   * @param {number} delaySeconds - Delay in seconds
   */
  static displayDelayMessage(delaySeconds) {
    console.log(chalk.blue(`⏳ Menunggu ${delaySeconds} detik sebelum membuat akun berikutnya...`));
  }

  /**
   * Display account creation plan
   * @param {number} totalAccounts - Total accounts to create
   */
  static displayCreationPlan(totalAccounts) {
    console.log(chalk.cyan(`\n🔧 Akan membuat ${totalAccounts} akun CapCut...\n`));
  }
}