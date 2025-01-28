/**
 * TransactionSender
 *
 * Responsibilities:
 *  - Transmit signed transactions to the specified RPC endpoint.
 *  - Handle network-related errors and retries.
 */
class TransactionSender {
  /**
   * @param {Object} options
   * @param {import('@solana/web3.js').Connection} options.connection
   * @param {boolean} [options.skipPreflight=false] - Skip transaction simulation
   */
  constructor({ connection, skipPreflight = false }) {
    this.connection = connection;
    this.skipPreflight = skipPreflight;
  }

  /**
   * sendTransaction
   * @param {Object} input
   * @param {import('@solana/web3.js').Transaction} input.signedTransaction - Signed transaction object
   * @param {boolean} [input.skipPreflight] - Override default skipPreflight setting
   * @returns {string} transactionSignature
   * @throws {Error} NetworkError | RateLimitExceeded
   */
  async sendTransaction({ signedTransaction, skipPreflight }) {
    try {
      const signature = await this.connection.sendRawTransaction(
        signedTransaction.serialize(),
        {
          skipPreflight: skipPreflight ?? this.skipPreflight,
          preflightCommitment: 'processed', 
          maxRetries: 3
        }
      );
      return signature;
    } catch (err) {
      // Check for rate limit
      if (err.message.includes('429')) {
        throw new Error('RateLimitExceeded: RPC rate limit surpassed.');
      }
      throw new Error(`NetworkError: ${err.message}`);
    }
  }
}

module.exports = TransactionSender;
