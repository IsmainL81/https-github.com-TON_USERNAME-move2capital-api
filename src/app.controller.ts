import { Controller, Get, Post, Body } from "@nestjs/common";
import { AppService } from "./app.service";
import { BlockchainService } from "./blockchain.service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly blockchainService: BlockchainService,
  ) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Get("health")
  getHealth() {
    return this.appService.getHealth();
  }

  @Get("rules")
  getRules() {
    return this.appService.getRules();
  }

  @Get("activity/stats")
  getStats() {
    return this.appService.getStats();
  }

  @Post("activity/mint")
  async mintFromActivity(
    @Body() body: { steps: number; distance?: number; walletAddress: string },
  ) {
    const calculatedIMT = this.appService.computeIMT(body.steps);
    const alreadyMinted = this.appService.getMintedToday();
    const dailyCap = this.appService.getRules().dailyCap;
    const remaining = dailyCap - alreadyMinted;

    const user = await this.appService.updateGamification(body.steps);

    let multiplier = 1;

    if (user.streak >= 30) multiplier = 1.5;
    else if (user.streak >= 7) multiplier = 1.2;

    if (remaining <= 0) {
      return {
        success: false,
        status: "daily cap reached",
        minted: 0,
        dailyTotal: alreadyMinted,
        dailyCap,
      };
    }

    const toMint = Number(
      Math.min(calculatedIMT * multiplier, remaining).toFixed(2),
    );

    const result = await this.blockchainService.mint(
      body.walletAddress,
      toMint,
    );

    this.appService.addMintedToday(toMint);
    await this.appService.saveMint(toMint, result.txHash, "success");

    return {
      success: true,
      status: "minted from activity",
      calculatedIMT,
      minted: toMint,
      dailyTotal: this.appService.getMintedToday(),
      dailyCap,
      txHash: result.txHash,
      xp: user.xp,
      level: user.level,
      streak: user.streak,
    };
  }

  @Get("mint/history")
  getMintHistory() {
    return this.appService.getMints();
  }

  @Post("balance")
  async getBalance(@Body() body: { walletAddress: string }) {
    const balance = await this.blockchainService.getBalance(body.walletAddress);

    return {
      address: body.walletAddress,
      balance,
      symbol: "IMT",
    };
  }

  @Get("marketplace/items")
  getItems() {
    return this.appService.getItems();
  }

  @Post("marketplace/buy")
  async buy(@Body() body: { itemId: number; wallet: string }) {
    const balance = await this.blockchainService.getBalance(body.wallet);
    const numericBalance = Number(balance);

    const result = await this.appService.buyItem(
      body.itemId,
      body.wallet,
      numericBalance,
    );

    if (!result.success || !result.item) {
      return result;
    }

    const spendResult = await this.blockchainService.spend(
      body.wallet,
      result.item.price,
    );

    return {
      ...result,
      txHash: spendResult.txHash,
      treasury: spendResult.treasury,
    };
  }

  @Get("marketplace/purchases")
  getPurchases() {
    return this.appService.getPurchases();
  }
}