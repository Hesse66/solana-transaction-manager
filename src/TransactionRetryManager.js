class TransactionRetryManager {
  constructor(maxRetries = 3, baseDelay = 1000) {
    this.maxRetries = maxRetries;
    this.baseDelay = baseDelay;
  }

  async executeWithRetry(operation) {
    let lastError;
    
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        if (attempt < this.maxRetries) {
          await this.delay(this.calculateDelay(attempt));
          continue;
        }
      }
    }

    throw new Error(`Max retries reached. Last error: ${lastError.message}`);
  }

  calculateDelay(attempt) {
    return this.baseDelay * Math.pow(2, attempt);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = { TransactionRetryManager }; 