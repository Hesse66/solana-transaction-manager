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
   */
  constructor({ connection }) {
    this.connection = connection;
  }

  /**
   * sendTransaction
   * @param {Object} input
   * @param {import('@solana/web3.js').Transaction} input.signedTransaction - Signed transaction object
   * @returns {string} transactionSignature
   * @throws {Error} NetworkError | RateLimitExceeded
   */
  async sendTransaction({ signedTransaction }) {
    try {
      // Adjust sendOptions as needed for your environment
      const signature = await this.connection.sendRawTransaction(
        signedTransaction.serialize(),
        {
          skipPreflight: false, // or true, depends on your preference
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
