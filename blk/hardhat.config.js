require('@nomicfoundation/hardhat-toolbox');
require('hardhat-ethernal');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.19',
  paths: {
    artifacts: '../rental-app-main/src/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
  },
  ethernal: {
    apiToken: process.env.ETHERNAL_API_TOKEN,
  },
};
