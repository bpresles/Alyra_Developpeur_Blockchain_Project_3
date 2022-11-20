# Voting [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Build](https://github.com/bpresles/Alyra_Developpeur_Blockchain_Project_3/actions/workflows/build.yml/badge.svg)](https://github.com/bpresles/Alyra_Developpeur_Blockchain_Project_3/actions/workflows/build.yml) [![Test](https://github.com/bpresles/Alyra_Developpeur_Blockchain_Project_3/actions/workflows/tests.yml/badge.svg)](https://github.com/bpresles/Alyra_Developpeur_Blockchain_Project_3/actions/workflows/tests.yml)

## Table of Contents
- [Voting   ](#voting---)
  - [Table of Contents](#table-of-contents)
  - [Presentation](#presentation)
  - [Live demo](#live-demo)
  - [Structure](#structure)
  - [Installation](#installation)
  - [Commands](#commands)
    - [Compile smart contrat](#compile-smart-contrat)
    - [Run tests without coverage](#run-tests-without-coverage)
    - [Run tests with coverage](#run-tests-with-coverage)
    - [Deploy smart contrat](#deploy-smart-contrat)
    - [Start a local JSON-RPC node](#start-a-local-json-rpc-node)
  - [Front commands](#front-commands)
    - [Build](#build)
    - [Start the front app](#start-the-front-app)
  - [Smart contract Tests](#smart-contract-tests)
    - [Tests results](#tests-results)
    - [Gas consumption](#gas-consumption)
    - [Coverage](#coverage)

<a name="presentation"></a>
## Presentation
A simple voting system for small organizations that allows to register voters, let them make proposals, vote for one proposal and then obtain the winning proposal in a simple majority manner.

<a name="demo"></a>
## Live demo
You can access a live demo on these URLs:

- With an IPFS enabled browser like Brave: ipns://alyra_project3.presles.fr/
- With any browser: https://alyra-developpeur-blockchain-project-3-bpresles.vercel.app/

<a name="structure"></a>
## Structure
The project contains the following main folders:

```
client (Front)
|
+-- public (static files)
|
+-- src (React sources)

hardhat (Smart Contract)
|
+-- contracts (Solidity source file of the smart contract)
|
+-- deploy (Deployment script)
|
+-- test (Unit tests)
|
+-- coverage (Coverage of tests reports - created dynamically when running coverage)
```

<a name="installation"></a>
## Installation
To run the tests, you'll need to execute the following commands to install the required dependencies:

```bash
$ git clone https://github.com/bpresles/Alyra_Developpeur_Blockchain_Project_3.git
$ yarn install
```

Then copy the .env.dist file as .env:
```bash
cp .env.dist .env
```

Edit the .env file and set your mnemonic, infura id and alchemy id:
```bash
MNEMONIC="YOUR_MNEMONIC"
INFURA_ID="AN_INFURA_ID"
ALCHEMY_ID="AN_ALCHEMY_ID"
```

<a name="commands"></a>
## Commands

### Compile smart contrat
```bash
cd hardhat
yarn build
```

### Run tests without coverage
```bash
cd hardhat
yarn test
```

### Run tests with coverage
```bash
cd hardhat
yarn coverage
```
### Deploy smart contrat

**Local**
```bash
cd hardhat
yarn deploy:dev
```
**Goerli**
```bash
cd hardhat
yarn deploy:goerli
```

**Sepolia**
```bash
cd hardhat
yarn deploy:sepolia
```
**Mumbai**
```bash
cd hardhat
yarn deploy:mumbai
```

### Start a local JSON-RPC node
You can start a local JSON-RPC node to be able to interact with HardHat network using a JSON-RPC client like a wallet.
```bash
yarn dev
```

When using MetaMask, you should prefer to start Ganache (https://trufflesuite.com/ganache/).

## Front commands
The front app allows you to easily interact with voting contract and manage a complete vote.

### Build
To build the front app, use the following commands:
```bash
cd client
yarn build
```

### Start the front app
You can start it using these commands:
```bash
cd client
yarn start
```

<a name="tests-structure"></a>
## Smart contract Tests
The tests are covering most of the functions of the Voting contract by use case categories:

- Voters management
- Proposals
- Voting session
- Tally votes

In each category, the tests are covering the following elements:

- Requirements
- Events
- Nominal scenarios
- Limit scenarios

<a name="tests-results"></a>
### Tests results 

```bash
  Voting
    Voters registration
      addVoter
        ✓ Require - Should not allow adding voter if not owner
        ✓ Require - Should not allow registering existing voter
        ✓ Require - Should not allow registering voter if workflow status is not RegisteringVoters
        ✓ Event - Should allow adding not registered voter by owner
    Proposals
      getOneProposal
        ✓ Require - Should not allow to get one proposal information when caller is not voter
        ✓ getVoter - Should return the proposal information when called by a voter
      addProposal/getOneProposal
        ✓ Require - addProposal - Should not allow to add proposal to not registered voters
        ✓ Require - addProposal - Should not allow adding proposal if workflow status is not ProposalsRegistrationStarted
        ✓ Require - addProposal - Should not allow empty proposal
        ✓ Event - addProposal - Should emit ProposalRegistered on successful proposal
        ✓ addProposal - Should add proposal when the caller is a registered voter
        ✓ getOneProposal - Should revert on overflow argument value
      Workflow startProposalsRegistering/endProposalsRegistering
        ✓ Require - startProposalsRegistering - Should revert when called from not owner
        ✓ Require - startProposalsRegistering - Should emit WorkflowStatusChange with status 1
        ✓ Require - startProposalsRegistering - Should not allow starting proposal registering when not in correct state
        ✓ Require - endProposalsRegistering - Should revert when called from not owner
        ✓ Require - endProposalsRegistering - Should not allow ending proposal registering when not started yet
        ✓ Event - endProposalsRegistering - Should emit WorkflowStatusChange with status change from 1 to 2
    Votes
      getVoter
        ✓ Require - Should not allow to get voter information when caller is not voter
        ✓ getVoter - Should return the voter information when called by a voter
      setVote
        ✓ Require - Should not allow to vote when caller is not voter
        ✓ Require - Should not allow to vote voting session has not started
        ✓ Require - Should not allow to vote twice
        ✓ Require - Should not allow vote on nonexisting proposal
        ✓ Arguments - Should revert on overflow argument value
        ✓ Vote & Event - Should a registered voter to vote once and emit Voted event
      Workflow startVotingSession/endVotingSession
        ✓ Require - startVotingSession - Should revert when called from not owner
        ✓ Require - startVotingSession - Should emit WorkflowStatusChange with status from 2 to 3
        ✓ Require - startVotingSession - Should not allow ending proposal registering when not started yet
        ✓ Require - endVotingSession - Should revert when called from not owner
        ✓ Require - endVotingSession - Should not allow ending proposal registering when not started yet
        ✓ Event - endVotingSession - Should emit WorkflowStatusChange with status from 3 to 4
    Tally votes
      ✓ Require - Should not allow to tallyVote when caller is not owner
      ✓ Require - Should not allow to tally vote when voting session is not ended
      ✓ Event - Tally - winningProposalID should stay at default value 0 when there are no votes and sill emit VotesTallied status change event
      ✓ Event - Tally - winningProposalID should be set to winning proposal and emit VotesTallied status change event
    Reset voting session
      ✔ Should not allow resetting voting session for non owner
      ✔ Should reset voting session (479ms)

  38 passing (8s)
```

<a href="gas-consumption"></a>
### Gas consumption

```bash
·------------------------------------------|----------------------------|-------------|-----------------------------·
|           Solc version: 0.8.17           ·  Optimizer enabled: false  ·  Runs: 200  ·  Block limit: 30000000 gas  │
···········································|····························|·············|······························
|  Methods                                                                                                          │
·············|·····························|·············|··············|·············|···············|··············
|  Contract  ·  Method                     ·  Min        ·  Max         ·  Avg        ·  # calls      ·  usd (avg)  │
·············|·····························|·············|··············|·············|···············|··············
|  Voting    ·  addProposal                ·          -  ·           -  ·      59280  ·           10  ·          -  │
·············|·····························|·············|··············|·············|···············|··············
|  Voting    ·  addVoter                   ·      77509  ·       94621  ·      91363  ·           21  ·          -  │
·············|·····························|·············|··············|·············|···············|··············
|  Voting    ·  endProposalsRegistering    ·          -  ·           -  ·      30532  ·           12  ·          -  │
·············|·····························|·············|··············|·············|···············|··············
|  Voting    ·  endVotingSession           ·          -  ·           -  ·      30555  ·            5  ·          -  │
·············|·····························|·············|··············|·············|···············|··············
|  Voting    ·  resetVotingProcess         ·          -  ·           -  ·     122125  ·            3  ·          -  │
·············|·····························|·············|··············|·············|···············|··············
|  Voting    ·  setVote                    ·      60821  ·      102747  ·      76724  ·            9  ·          -  │
·············|·····························|·············|··············|·············|···············|··············
|  Voting    ·  startProposalsRegistering  ·          -  ·           -  ·      95054  ·           19  ·          -  │
·············|·····························|·············|··············|·············|···············|··············
|  Voting    ·  startVotingSession         ·          -  ·           -  ·      30576  ·           10  ·          -  │
·············|·····························|·············|··············|·············|···············|··············
|  Voting    ·  tallyVotes                 ·          -  ·           -  ·      30578  ·            5  ·          -  │
·············|·····························|·············|··············|·············|···············|··············
|  Deployments                             ·                                          ·  % of limit   ·             │
···········································|·············|··············|·············|···············|··············
|  Voting                                  ·          -  ·           -  ·    2243762  ·        7.5 %  ·          -  │
·------------------------------------------|-------------|--------------|-------------|---------------|-------------·
```

<a href="coverage"></a>
### Coverage

```bash
|-------------|----------|----------|----------|----------|----------------|
|File         |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
|-------------|----------|----------|----------|----------|----------------|
| contracts/  |      100 |      100 |      100 |      100 |                |
|  Voting.sol |      100 |      100 |      100 |      100 |                |
|-------------|----------|----------|----------|----------|----------------|
|All files    |      100 |      100 |      100 |      100 |                |
|-------------|----------|----------|----------|----------|----------------|
```
