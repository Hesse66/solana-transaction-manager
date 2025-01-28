/**
 * ExecuteTransaction
 *
 * Steps (from YAML):
 *  1. Simulate Transaction
 *  2. Sign Transaction
 *  3. Send Transaction
 *  4. Confirm Transaction
 *  5. Finalize
 */
class ExecuteTransaction {
  /**
   * @param {Object} options
   * @param {import('./TransactionSimulator')} options.simulator
   * @param {import('./TransactionSigner')} options.signer
   * @param {import('./TransactionSender')} options.sender
   * @param {import('./TransactionConfirmer')} options.confirmer
   * @param {import('./TransactionRetryManager')} options.retryManager
   * @param {import('./FeeManager')} options.feeManager
   */
  constructor({ simulator, signer, sender, confirmer, retryManager, feeManager }) {
    this.simulator = simulator;
    this.signer = signer;
    this.sender = sender;
    this.confirmer = confirmer;
    this.retryManager = retryManager;
    this.feeManager = feeManager;
  }

  /**
   * runExecuteTransaction
   * End-to-end workflow for executing a transaction
   * @param {Object} transactionData
   * @returns {Promise<{ signature: string; confirmationStatus: string }>}
   */
  async runExecuteTransaction(transactionData) {
    // 1. Simulate Transaction
    try {
      await this.simulator.simulateTransaction(transactionData);
    } catch (err) {
      throw new Error(`Simulation failed: ${err.message}`);
    }

    // 2. Sign Transaction
    let signedTx;
    try {
      signedTx = this.signer.signTransaction({ transaction: transactionData.transaction });
    } catch (err) {
      throw new Error(`Signing failed: ${err.message}`);
    }

    // 3 & 4. Send & Confirm with potential retries
    const sendAndConfirm = async (txData) => {
      // Send
      let txSignature = await this.sender.sendTransaction({ signedTransaction: signedTx });

      // Confirm
      let confirmationStatus = await this.confirmer.confirmTransaction({
        transactionSignature: txSignature,
      });

      return { signature: txSignature, confirmationStatus };
    };

    try {
      // Attempt to send & confirm, retrying on failure (network or confirmation)
      return await this.retryManager.retryTransaction({
        executeFn: sendAndConfirm,
        transactionData
      });
    } catch (err) {
      // If we fail here, we've exhausted retries
      throw new Error(`Transaction execution failed after retries: ${err.message}`);
    }
  }
}

module.exports = ExecuteTransaction;
