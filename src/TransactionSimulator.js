const { Keypair, Transaction } = require('@solana/web3.js');

/**
 * TransactionSimulator
 * 
 * Responsibilities:
 *  - Simulate transaction execution using the Solana RPC.
 *  - Handle and report simulation results, including errors and warnings.
 */
class TransactionSimulator {
  /**
   * @param {Object} options
   * @param {import('@solana/web3.js').Connection} options.connection
   */
  constructor({ connection }) {
    this.connection = connection;
  }

  /**
   * simulateTransaction
   * @param {Object} transactionData - Object containing transaction details.
   * @returns {Object} simulationResult
   * @throws {Error} SimulationFailure
   */
  async simulateTransaction(transactionData) {
    try {
      const { transaction, signers } = transactionData;

      // If the transaction is not already partially signed, do a partial sign
      // with all signers to ensure the simulator sees correct keys.
      const cloneTx = transaction.clone();
      if (signers && signers.length > 0) {
        cloneTx.sign(...signers);
      }

      // Simulate
      const simulation = await this.connection.simulateTransaction(cloneTx);

      if (simulation.value.err) {
        throw new Error(`SimulationFailure: ${JSON.stringify(simulation.value.err)}`);
      }

      return {
        logs: simulation.value.logs || [],
        unitsConsumed: simulation.value.unitsConsumed,
      };
    } catch (err) {
      throw new Error(`SimulationFailure: ${err.message}`);
    }
  }
}

module.exports = TransactionSimulator;
