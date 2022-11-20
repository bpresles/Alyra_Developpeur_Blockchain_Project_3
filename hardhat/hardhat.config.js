require("@nomicfoundation/hardhat-toolbox");

require('dotenv').config();
require('solidity-coverage');
require('hardhat-deploy');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.17',
  },
  paths: {
    deployments: '../client/src/contracts',
  },
  defaultNetwork: 'ganache',
  networks: {
    hardhat: {
      chainId: 1337,
      accounts: {
        count: 10,
      },
    },
    ganache: {
      accounts: {
        count: 10,
        mnemonic: `${process.env.MNEMONIC}`,
      },
      chainId: 1337,
      url: `http://localhost:8545`,
    },
    goerli: {
      accounts: {
        count: 10,
        mnemonic: `${process.env.MNEMONIC}`,
      },
      chainId: 5,
      url: `https://goerli.infura.io/v3/${process.env.INFURA_ID}`
    },
    sepolia: {
      accounts: {
        count: 10,
        mnemonic: `${process.env.MNEMONIC}`,
      },
      chainId: 11155111,
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_ID}`
    },
    mumbai: {
      accounts: {
        count: 10,
        mnemonic: `${process.env.MNEMONIC}`,
      },
      chainId: 80001,
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`
    }
  },
  namedAccounts: {
    deployer: 0,
  },
  gasReporter: {
    enabled: true,
    currency: "USD"
  }
};
