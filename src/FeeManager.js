class FeeManager {
  constructor(connection) {
    this.connection = connection;
  }

  async calculateOptimalFee() {
    try {
      const recentBlockhash = await this.connection.getRecentBlockhash();
      return {
        priorityFee: recentBlockhash.feeCalculator.lamportsPerSignature,
        recentBlockhash: recentBlockhash.blockhash
      };
    } catch (error) {
      throw new Error(`Fee calculation error: ${error.message}`);
    }
  }

  async updateTransactionFee(transaction) {
    const { priorityFee, recentBlockhash } = await this.calculateOptimalFee();
    transaction.recentBlockhash = recentBlockhash;
    return transaction;
  }
}

module.exports = { FeeManager }; 