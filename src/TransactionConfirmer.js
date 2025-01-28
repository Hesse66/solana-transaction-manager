class TransactionConfirmer {
  constructor(connection) {
    this.connection = connection;
  }

  async confirmTransaction(signature, commitment = 'confirmed') {
    try {
      const confirmation = await this.connection.confirmTransaction(signature, commitment);
      
      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
      }

      return {
        success: true,
        slot: confirmation.context.slot
      };
    } catch (error) {
      throw new Error(`Transaction confirmation error: ${error.message}`);
    }
  }
}

module.exports = { TransactionConfirmer }; 