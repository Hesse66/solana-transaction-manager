# Solana Transaction Manager

A reusable module for handling Solana transactions in a standardized, robust manner, featuring:

- **Transaction Simulation**
- **Transaction Signing**
- **Transaction Sending**
- **Transaction Confirmation**
- **Retry Logic**
- **Fee Management**

## Installation

```bash
npm install --save solana-transaction-manager
```

*(Or if you are just dropping the folder into your codebase, you can ignore the above and import relatively.)*

## Usage

Below is a high-level example of using the library’s orchestrations:

```js
const {
  ExecuteTransaction,
  TransactionSimulator,
  TransactionSigner,
  TransactionSender,
  TransactionConfirmer,
  TransactionRetryManager,
  FeeManager
} = require('solana-transaction-manager');

(async () => {
  // Setup your Solana connection
  const { Connection, Keypair } = require('@solana/web3.js');
  const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

  // Setup your workflow
  const executeTransactionWorkflow = new ExecuteTransaction({
    simulator: new TransactionSimulator({ connection }),
    signer: new TransactionSigner({ keypair: Keypair.generate() }), // or your own wallet
    sender: new TransactionSender({ connection }),
    confirmer: new TransactionConfirmer({ connection }),
    retryManager: new TransactionRetryManager(),
    feeManager: new FeeManager()
  });

  // Example transaction data
  const transactionData = {
    // your transaction details (instructions, signers, etc.)
  };

  try {
    const result = await executeTransactionWorkflow.runExecuteTransaction(transactionData);
    console.log('Transaction Execution Result:', result);
  } catch (err) {
    console.error('Execution failed:', err);
  }
})();