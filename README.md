# KuraChain

A decentralised voting DApp on Ethereum. One wallet, one vote, recorded on the blockchain.

"Kura" is Swahili for "vote". KuraChain lets a poll owner publish a question with several options, lets each wallet vote once before a deadline, and shows live results that anyone can verify on the public Sepolia test network.

<img width="1240" height="824" alt="image" src="https://github.com/user-attachments/assets/6db58c50-8ac8-4aa2-a5e6-dfebc5ab991e" />


## Features

- Poll question and 2 to 10 options, set when the contract is deployed
- One vote per wallet, enforced by the smart contract
- Voting deadline, after which votes are rejected
- Owner-only early close of the poll
- Live result bars read directly from the blockchain
- `VoteCast` and `PollClosed` events as an on-chain audit log
- MetaMask wallet connection, network check (Sepolia) and transaction feedback

## Live deployment

| Item | Value |
|---|---|
| Network | Ethereum Sepolia testnet (chain ID 11155111) |
| Contract | `0x92Dc4D4a5A61Bb91542eA3E7A3e5921F702cC9Af` |
| Explorer | https://sepolia.etherscan.io/address/0x92Dc4D4a5A61Bb91542eA3E7A3e5921F702cC9Af |

## Tech stack

- **Solidity 0.8.28** for the smart contract
- **Hardhat 3** with the Node test runner and **viem** for compiling and testing
- **Hardhat Ignition** for deployment
- **ethers.js v6** and plain HTML/CSS/JavaScript for the frontend
- **MetaMask** for signing transactions

## Project structure
```
KuraChain/
├── contracts/Voting.sol        Smart contract
├── test/Voting.ts              Automated tests
├── ignition/modules/Voting.ts  Deployment module
├── ignition/parameters.json    Poll question, options and duration
├── frontend/index.html         Web interface
├── hardhat.config.ts           Compiler, plugins and networks
├── .env.example                Template for secrets (copy to .env)
└── package.json
```
## Getting started

Requirements: Node.js 22.13 or later, VS Code (with the Live Server extension), and MetaMask.

bash
git clone https://github.com/<your-username>/kurachain.git
cd kurachain
npm install


### Compile and test

bash
npx hardhat compile
npx hardhat test

The tests cover the starting state, vote counting, rejection of a second vote from the same wallet, rejection of invalid options, event emission, owner-only closing and the voting deadline.

### Configure secrets

Copy `.env.example` to `.env` and fill in your own values:

SEPOLIA_RPC_URL=YOUR_SEPOLIA_RPC_URL
SEPOLIA_PRIVATE_KEY=0xYOUR_TEST_WALLET_PRIVATE_KEY

Use a throwaway test wallet that holds only Sepolia test ETH. Never commit `.env`; it is listed in `.gitignore`.

### Deploy to Sepolia

Edit `ignition/parameters.json` to set your poll, then run:

bash
npx hardhat ignition deploy ignition/modules/Voting.ts --network sepolia --parameters ignition/parameters.json

Check that the prompt says `sepolia (11155111)` before confirming. Copy the printed contract address.

### Run the frontend

1. Paste the contract address into `CONTRACT_ADDRESS` in `frontend/index.html`.
2. Open the file with **Live Server** in VS Code.
3. Switch MetaMask to **Sepolia**, click **Connect MetaMask**, then vote.

## How it works

The `Voting` contract stores the poll and a `hasVoted` record for every address. Calling `vote(optionIndex)` checks that the poll is open, the wallet has not voted and the option exists, then increments that option's count and emits `VoteCast`. Reading results is free and needs no signature. The frontend never holds a private key: MetaMask signs each vote.

## Limitations

- One wallet is not one person. Anyone can create several wallets, so this suits demos and informal polls, not binding elections.
- Votes are public. All blockchain data is visible; this is not a secret ballot.
- Voters need a little Sepolia ETH to pay gas.
- The question, options and deadline cannot be changed after deployment.

## Roadmap

- Voter whitelist so only registered addresses can vote
- Winner display when the poll closes
- Vote history page built from `VoteCast` events
- Multiple polls through a factory contract
- Source verification on Etherscan and hosted frontend

## Author

Paul Silvester, BlockChain
## Licence

MIT
