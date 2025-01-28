class TransactionSigner {
  constructor(wallet) {
    this.wallet = wallet;
  }

  async signTransaction(transaction, additionalSigners = []) {
    try {
      if (this.wallet.signTransaction) {
        transaction = await this.wallet.signTransaction(transaction);
      }

      if (additionalSigners.length > 0) {
        transaction.partialSign(...additionalSigners);
      }

      return transaction;
    } catch (error) {
      throw new Error(`Transaction signing error: ${error.message}`);
    }
  }
}

module.exports = { TransactionSigner }; 