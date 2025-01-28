const { Connection } = require('@solana/web3.js');

class TransactionSender {
  constructor(connection) {
    this.connection = connection;
  }

  async sendTransaction(signedTransaction) {
    try {
      const signature = await this.connection.sendRawTransaction(
        signedTransaction.serialize(),
        {
          skipPreflight: false,
          preflightCommitment: 'confirmed'
        }
      );

      return signature;
    } catch (error) {
      throw new Error(`Transaction send error: ${error.message}`);
    }
  }
}

module.exports = { TransactionSender }; 