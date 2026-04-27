require("@nomiclabs/hardhat-ethers");

const AMOY_PRIVATE_KEY = "TA_CLE_PRIVEE_METAMASK_TEST";

module.exports = {
  solidity: "0.8.20",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    amoy: {
      url: "https://rpc-amoy.polygon.technology",
      chainId: 80002,
      accounts: ["91833a0ab5c160eb242a8a71776f600ce5d038198dcdc43b296076dc8d950bd9"],
    },
  },
};