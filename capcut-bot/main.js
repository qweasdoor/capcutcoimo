/**
 * CapCut Account Creator Bot
 * 
 * Main entry point for the application
 * 
 * @author Nanda Gunawan <admin@countryssh.com>
 * @version 2.0.0
 * @license MIT
 */

import { AccountCreator } from './core/AccountCreator.js';

// Run the application
AccountCreator.run().catch(console.error);