/**
 * TransactionRetryManager
 *
 * Responsibilities:
 *  - Implement retry logic with exponential backoff.
 *  - Manage the maximum number of retry attempts.
 */
class TransactionRetryManager {
  /**
   * @param {Object} [options]
   * @param {number} [options.maxRetries=3] - Maximum number of retry attempts
   * @param {number} [options.initialDelayMs=1000]
   * @param {number} [options.maxDelayMs=8000]
   */
  constructor({ maxRetries = 3, initialDelayMs = 1000, maxDelayMs = 8000 } = {}) {
    this.maxRetries = maxRetries;
    this.initialDelayMs = initialDelayMs;
    this.maxDelayMs = maxDelayMs;
  }

  /**
   * retryTransaction
   * @param {Object} input
   * @param {Function} input.executeFn - Function that attempts the transaction steps
   * @param {Object} input.transactionData - Original transaction data to pass
   * @returns {Promise<Object>} retryResult
   * @throws {Error} MaxRetriesExceeded
   */
  async retryTransaction({ executeFn, transactionData }) {
    let attempt = 0;
    let delay = this.initialDelayMs;

    while (attempt < this.maxRetries) {
      try {
        attempt++;
        return await executeFn(transactionData);
      } catch (err) {
        // If last attempt, throw
        if (attempt >= this.maxRetries) {
          throw new Error(`MaxRetriesExceeded: ${err.message}`);
        }
        // Otherwise wait with exponential backoff
        await this._wait(delay);
        delay = Math.min(delay * 2, this.maxDelayMs);
      }
    }
  }

  async _wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

module.exports = TransactionRetryManager;
