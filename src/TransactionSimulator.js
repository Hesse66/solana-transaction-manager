const { Connection } = require('@solana/web3.js');

class TransactionSimulator {
  constructor(connection) {
    this.connection = connection;
  }

  async simulateTransaction(transaction, signers = []) {
    try {
      const simulation = await this.connection.simulateTransaction(transaction, signers);
      
      if (simulation.value.err) {
        throw new Error(`Simulation failed: ${JSON.stringify(simulation.value.err)}`);
      }

      return {
        success: true,
        logs: simulation.value.logs,
        unitsConsumed: simulation.value.unitsConsumed
      };
    } catch (error) {
      throw new Error(`Transaction simulation error: ${error.message}`);
    }
  }
}

module.exports = { TransactionSimulator }; 