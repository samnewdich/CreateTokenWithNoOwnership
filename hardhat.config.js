require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.PUBLIC_RPC,
        blockNumber: undefined
      },
      chainId: 56
    },
    
    bscTestnet: {
      url: process.env.BSC_TESTNET_RPC,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 97
    },

    bsc: {
      url: process.env.PUBLIC_RPC,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 56
    }
  }
};
