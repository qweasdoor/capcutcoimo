/**
 * Account Creator - Main orchestrator for account creation process
 */

import { CapCutService } from '../services/CapCutService.js';
import { UserInterface } from '../services/UserInterface.js';
import { getRandomDelay, sleep } from '../utils/helpers.js';

export class AccountCreator {
  /**
   * Run the account creation process
   * @returns {Promise<void>}
   */
  static async run() {
    try {
      // Display welcome banner
      UserInterface.displayBanner();

      // Ask for number of accounts
      const totalAccounts = await UserInterface.askForAccountCount();
      UserInterface.displayCreationPlan(totalAccounts);

      // Track successful accounts
      const successfulAccounts = [];

      // Create accounts
      for (let i = 1; i <= totalAccounts; i++) {
        const account = await CapCutService.createAccount(i, totalAccounts);
        
        if (account) {
          successfulAccounts.push(account);
        }

        // Add delay between accounts (except for the last one)
        if (i < totalAccounts) {
          const delay = getRandomDelay();
          UserInterface.displayDelayMessage(delay / 1000);
          await sleep(delay);
        }
      }

      // Display summary
      UserInterface.displaySummary(successfulAccounts, totalAccounts);

    } catch (error) {
      console.error('Error in account creation process:', error);
      process.exit(1);
    }
  }
}