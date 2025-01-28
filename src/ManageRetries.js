class ManageRetries {
  constructor(options = {}) {
    this.maxAttempts = options.maxAttempts || 3;
    this.baseDelay = options.baseDelay || 1000;
    this.maxDelay = options.maxDelay || 10000;
  }

  async execute(operation, context = {}) {
    let attempt = 0;
    let lastError;

    while (attempt < this.maxAttempts) {
      try {
        return await operation(context);
      } catch (error) {
        lastError = error;
        attempt++;
        
        if (attempt === this.maxAttempts) {
          break;
        }

        await this.sleep(this.getDelay(attempt));
      }
    }

    throw new Error(`Failed after ${attempt} attempts. Last error: ${lastError.message}`);
  }

  getDelay(attempt) {
    const delay = Math.min(
      this.maxDelay,
      this.baseDelay * Math.pow(2, attempt - 1)
    );
    return delay;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = { ManageRetries }; 