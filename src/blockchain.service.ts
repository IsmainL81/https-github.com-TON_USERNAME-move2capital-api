import { Injectable } from "@nestjs/common";
import { ethers } from "ethers";

@Injectable()
export class BlockchainService {
  private provider = new ethers.providers.JsonRpcProvider(
    "http://127.0.0.1:8545",
  );

  private wallet = new ethers.Wallet(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    this.provider,
  );

  private contractAddress =  "0x5FbDB2315678afecb367f032d93F642f64180aa3";
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
    this.wallet,
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
    const balance = await this.contract.balanceOf(address);
    return ethers.utils.formatUnits(balance, 18);
  }
}