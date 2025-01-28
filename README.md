# Solana Transaction Manager

A robust transaction management system for Solana blockchain, providing simulation, signing, sending, and confirmation capabilities with configurable options.

## Features

- Transaction simulation before sending
- Transaction signing with multiple signers support
- Reliable transaction sending with configurable preflight checks
- Transaction confirmation tracking
- Fee management and optimization
- Automatic retry handling for failed transactions

## Installation

```bash
npm install solana-transaction-manager
```

## Usage Examples

### Basic Usage

```javascript
const {
  ExecuteTransaction,
  TransactionSimulator,
  TransactionSigner,
  TransactionSender,
  TransactionConfirmer,
  TransactionRetryManager,
  FeeManager
} = require('solana-transaction-manager');

// Setup connection
const { Connection, Keypair } = require('@solana/web3.js');
const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

// Create workflow with default settings
const executeTransaction = new ExecuteTransaction({
  simulator: new TransactionSimulator({ connection }),
  signer: new TransactionSigner({ keypair: Keypair.generate() }),
  sender: new TransactionSender({ connection }),
  confirmer: new TransactionConfirmer({ connection }),
  retryManager: new TransactionRetryManager(),
  feeManager: new FeeManager()
});

// Execute a transaction
const result = await executeTransaction.execute(transaction, {
  simulate: true,
  maxRetries: 3,
  confirmationStrategy: 'fast'
});
```

### Advanced Configuration

```javascript
// Configure components individually
const sender = new TransactionSender({ 
  connection,
  skipPreflight: false // Start with preflight checks enabled
});

const retryManager = new TransactionRetryManager({
  maxRetries: 5,
  baseDelay: 2000,
  maxDelay: 15000
});

const confirmer = new TransactionConfirmer({
  connection,
  commitment: 'finalized'
});

// Create workflow with custom configuration
const advancedWorkflow = new ExecuteTransaction({
  simulator: new TransactionSimulator({ connection }),
  signer: new TransactionSigner({ keypair: wallet.keypair }),
  sender,
  confirmer,
  retryManager,
  feeManager: new FeeManager()
});
```

### Dynamic Preflight Configuration

```javascript
// Initialize with preflight checks
const sender = new TransactionSender({ 
  connection,
  skipPreflight: false
});

// Later, send with preflight
await sender.sendTransaction({
  signedTransaction: tx1,
  skipPreflight: false
});

// Then skip preflight for faster execution when needed
await sender.sendTransaction({
  signedTransaction: tx2,
  skipPreflight: true
});
```

### Error Handling

```javascript
try {
  const result = await executeTransaction.execute(transaction);
  console.log('Transaction succeeded:', result.signature);
} catch (error) {
  if (error.message.includes('RateLimitExceeded')) {
    console.error('RPC rate limit reached, consider using a different endpoint');
  } else if (error.message.includes('SimulationFailure')) {
    console.error('Transaction simulation failed, check your parameters');
  } else if (error.message.includes('NetworkError')) {
    console.error('Network error occurred, will retry automatically');
  }
}
```

### Integration with Existing Code

```javascript
class YourExistingClass {
  constructor(config) {
    this.connection = new Connection(config.rpcEndpoint);
    this.wallet = config.wallet;
    
    // Initialize transaction manager
    this.txManager = new ExecuteTransaction({
      simulator: new TransactionSimulator({ connection: this.connection }),
      signer: new TransactionSigner({ keypair: this.wallet.keypair }),
      sender: new TransactionSender({ 
        connection: this.connection,
        skipPreflight: config.skipPreflight 
      }),
      confirmer: new TransactionConfirmer({ 
        connection: this.connection,
        commitment: config.commitment 
      }),
      retryManager: new TransactionRetryManager({
        maxRetries: config.maxRetries
      }),
      feeManager: new FeeManager()
    });
  }

  async executeCustomTransaction(instructions) {
    const transaction = new Transaction().add(...instructions);
    
    try {
      const result = await this.txManager.execute(transaction);
      return result;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  }
}
```

## Documentation

See individual module documentation for detailed usage:

- TransactionSimulator - Simulates transactions before sending
- TransactionSigner - Handles transaction signing with multiple signers
- TransactionSender - Manages transaction sending with configurable preflight
- TransactionConfirmer - Handles transaction confirmation with different commitment levels
- TransactionRetryManager - Manages retry logic with exponential backoff
- FeeManager - Handles fee calculation and optimization
- ExecuteTransaction - Orchestrates the entire transaction lifecycle