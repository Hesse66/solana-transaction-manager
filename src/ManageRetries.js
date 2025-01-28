const ExecuteTransaction = require('./ExecuteTransaction');

/**
 * ManageRetries
 *
 * Steps:
 *  - Check Retry Eligibility
 *  - Wait Before Retry
 *  - Retry Transaction Execution
 */
class ManageRetries {
  /**
   * @param {Object} options
   * @param {ExecuteTransaction} options.executeTransaction - The ExecuteTransaction instance
   * @param {number} [options.maxRetries=3]
   */
  constructor({ executeTransaction, maxRetries = 3 }) {
    this.executeTransaction = executeTransaction;
    this.maxRetries = maxRetries;
    this.retryCount = 0;
  }

  /**
   * manageRetries
   * Tries the entire "executeTransaction" flow again if eligible.
   * @param {Object} transactionData
   */
  async manageRetries(transactionData) {
    // Step: Check Retry Eligibility
    if (this.retryCount >= this.maxRetries) {
      throw new Error('Abort: Max retry attempts reached.');
    }

    // Step: Wait Before Retry (exponential backoff)
    const delay = 1000 * Math.pow(2, this.retryCount); 
    await new Promise(res => setTimeout(res, delay));

    this.retryCount += 1;
    
    // Step: Retry Transaction Execution
    return this.executeTransaction.runExecuteTransaction(transactionData);
  }
}

module.exports = ManageRetries;
