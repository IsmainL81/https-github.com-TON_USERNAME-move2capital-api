import { Injectable } from "@nestjs/common";
import { ethers } from "ethers";

@Injectable()
export class BlockchainService {
  private provider = new ethers.providers.StaticJsonRpcProvider(
  "https://polygon-amoy.g.alchemy.com/v2/gjS6ZpkJVusTxe3e-rpAZ",
  {
    name: "polygon-amoy",
    chainId: 80002,
  },
);

  private wallet = new ethers.Wallet(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    this.provider,
  );

  private contractAddress = "0xCFA9Cf39E2d9529B6362568417A4654fe44CB622";
;

  private treasuryAddress = "0x851356ae760d987E095750cCeb3bC6014560891C";

  private abi = [
    "function mintForActivity(address to, uint256 amount, bytes32 activityId) external",
    "function spend(address from, address treasury, uint256 amount) external",
    "function balanceOf(address owner) view returns (uint256)",
  ];

  private contract = new ethers.Contract(
  this.contractAddress,
  this.abi,
  this.provider
);

  async mint(to: string, amount: number) {
    const activityId = ethers.utils.id(`${Date.now()}-${to}-${amount}`);

    const tx = await this.contract.mintForActivity(
      to,
      ethers.utils.parseUnits(amount.toString(), 18),
      activityId,
    );

    const receipt = await tx.wait();

    return {
      success: true,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      to,
      amount,
    };
  }

  async spend(from: string, amount: number) {
    const tx = await this.contract.spend(
      from,
      this.treasuryAddress,
      ethers.utils.parseUnits(amount.toString(), 18),
    );

    const receipt = await tx.wait();

    return {
      success: true,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      from,
      treasury: this.treasuryAddress,
      amount,
    };
  }

  async getBalance(address: string) {
  try {
    const balance = await this.contract.balanceOf(address);
    return ethers.utils.formatUnits(balance, 18);
  } catch (error: any) {
    console.error("BALANCE ERROR:", error);
    throw error;
  }
}
}