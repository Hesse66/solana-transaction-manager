class ExecuteTransaction {
  constructor({ connection, wallet }) {
    this.simulator = new (require('./TransactionSimulator'))(connection);
    this.signer = new (require('./TransactionSigner'))(wallet);
    this.sender = new (require('./TransactionSender'))(connection);
    this.confirmer = new (require('./TransactionConfirmer'))(connection);
    this.feeManager = new (require('./FeeManager'))(connection);
    this.retryManager = new (require('./TransactionRetryManager'))();
  }

  async execute(transaction, options = {}) {
    const {
      simulate = true,
      maxRetries = 3,
      commitment = 'confirmed'
    } = options;

    try {
      if (simulate) {
        await this.simulator.simulateTransaction(transaction);
      }

      transaction = await this.feeManager.updateTransactionFee(transaction);
      const signedTransaction = await this.signer.signTransaction(transaction);
      
      const signature = await this.retryManager.executeWithRetry(async () => {
        return await this.sender.sendTransaction(signedTransaction);
      });

      const confirmation = await this.confirmer.confirmTransaction(signature, commitment);

      return {
        signature,
        confirmation
      };
    } catch (error) {
      throw new Error(`Transaction execution error: ${error.message}`);
    }
  }
}

module.exports = { ExecuteTransaction }; 