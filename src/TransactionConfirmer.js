const EventEmitter = require('eventemitter3');

/**
 * TransactionConfirmer
 *
 * Responsibilities:
 *  - Subscribe to transaction status updates.
 *  - Confirm transaction finality based on specified commitment levels.
 */
class TransactionConfirmer extends EventEmitter {
  /**
   * @param {Object} options
   * @param {import('@solana/web3.js').Connection} options.connection
   * @param {string} [options.commitment='confirmed'] - e.g. 'processed', 'confirmed', 'finalized'
   */
  constructor({ connection, commitment = 'confirmed' }) {
    super();
    this.connection = connection;
    this.commitment = commitment;
  }

  /**
   * confirmTransaction
   * @param {Object} input
   * @param {string} input.transactionSignature - The signature to confirm.
   * @returns {Promise<string>} confirmationStatus
   * @throws {Error} ConfirmationTimeout | ConfirmationFailure
   */
  async confirmTransaction({ transactionSignature }) {
    return new Promise((resolve, reject) => {
      let done = false;
      const timeoutMs = 60000; // 1 minute, adjustable
      const start = Date.now();

      // Start subscription
      const subscriptionId = this.connection.onSignature(
        transactionSignature,
        (result) => {
          if (done) return;
          done = true;
          this.connection.removeSignatureListener(subscriptionId);

          if (result.err) {
            reject(new Error(`ConfirmationFailure: ${JSON.stringify(result.err)}`));
          } else {
            resolve('confirmed');
          }
        },
        this.commitment
      );

      // Fallback: poll / or a standard confirm approach
      const pollInterval = setInterval(async () => {
        if (Date.now() - start > timeoutMs) {
          clearInterval(pollInterval);
          if (!done) {
            done = true;
            this.connection.removeSignatureListener(subscriptionId);
            reject(new Error(`ConfirmationTimeout: Transaction not confirmed in time.`));
          }
        }
      }, 2000);
    });
  }
}

module.exports = TransactionConfirmer;
