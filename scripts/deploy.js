const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Déploiement avec :", deployer.address);

  const Token = await hre.ethers.getContractFactory("IMTToken");
  const token = await Token.deploy(deployer.address);

  await token.deployed();

  console.log("IMT déployé :", token.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});