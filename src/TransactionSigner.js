const bs58 = require('bs58');
const { Keypair } = require('@solana/web3.js');

/**
 * TransactionSigner
 *
 * Responsibilities:
 *  - Sign transactions securely using private keys.
 *  - Manage wallet credentials and ensure secure access.
 */
class TransactionSigner {
  /**
   * @param {Object} options
   * @param {Keypair} [options.keypair] - Optional if you want to pass in Keypair directly
   * @param {string} [options.privateKeyBase58] - Alternative to a Keypair
   */
  constructor({ keypair, privateKeyBase58 } = {}) {
    if (keypair) {
      this.keypair = keypair;
    } else if (privateKeyBase58) {
      const secretKey = bs58.decode(privateKeyBase58);
      this.keypair = Keypair.fromSecretKey(secretKey);
    } else {
      throw new Error('TransactionSigner requires either a keypair or a privateKeyBase58');
    }
  }

  /**
   * signTransaction
   * @param {Object} input
   * @param {import('@solana/web3.js').Transaction} input.transaction - Unsigned transaction object
   * @returns {import('@solana/web3.js').Transaction} signedTransaction
   * @throws {Error} SigningFailure
   */
  signTransaction({ transaction }) {
    try {
      transaction.sign(this.keypair);
      return transaction;
    } catch (err) {
      throw new Error(`SigningFailure: ${err.message}`);
    }
  }
}

module.exports = TransactionSigner;
