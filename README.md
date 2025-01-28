# Solana Transaction Manager

A robust transaction management system for Solana blockchain, providing simulation, signing, sending, and confirmation capabilities.

## Features

- Transaction simulation before sending
- Transaction signing with multiple signers support
- Reliable transaction sending with retry mechanisms
- Transaction confirmation tracking
- Fee management and optimization
- Automatic retry handling for failed transactions

## Installation

```bash
npm install solana-transaction-manager
```

## Usage

```javascript
const { ExecuteTransaction } = require('solana-transaction-manager');

const executeTransaction = new ExecuteTransaction({
  connection,
  wallet
});

// Execute a transaction with full lifecycle management
const result = await executeTransaction.execute(transaction, {
  simulate: true,
  maxRetries: 3,
  confirmationStrategy: 'fast'
});
```

## Documentation

See individual module documentation for detailed usage:

- TransactionSimulator
- TransactionSigner
- TransactionSender
- TransactionConfirmer
- TransactionRetryManager
- FeeManager 