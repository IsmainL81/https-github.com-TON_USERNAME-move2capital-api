import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Activity } from "./activity.entity";
import { Mint } from "./mint.entity";
import { User } from "./user.entity";
import { Purchase } from "./purchase.entity";

@Injectable()
export class AppService {
  private mintedToday = 0;

  constructor(
    @InjectRepository(Activity)
    private activityRepo: Repository<Activity>,

    @InjectRepository(Mint)
    private mintRepo: Repository<Mint>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Purchase)
    private purchaseRepo: Repository<Purchase>,
  ) {}

  getHello() {
    return "Move2Capital API";
  }

  getHealth() {
    return { status: "ok" };
  }

  // ---------------- RULES ----------------

  getRules() {
    return { dailyCap: 500 };
  }

  // ---------------- ACTIVITY ----------------

  computeIMT(steps: number) {
    const safeSteps = Number(steps) || 0;
    return Number((safeSteps / 1000).toFixed(2));
  }

  getMintedToday() {
    return this.mintedToday;
  }

  addMintedToday(amount: number) {
    const safeAmount = Number(amount) || 0;
    this.mintedToday += safeAmount;
  }

  async saveMint(amount: number, txHash: string, status: string) {
  const mint = this.mintRepo.create({
    date: new Date().toISOString(),
    amount: Number(amount) || 0,
    txHash,
    status,
  });

  return this.mintRepo.save(mint);
}

  getMints() {
    return this.mintRepo.find({
      order: { id: "DESC" },
    });
  }

  getStats() {
    return {
      mintedToday: this.mintedToday,
      cap: 500,
    };
  }

  // ---------------- GAMIFICATION ----------------

  async updateGamification(steps: number) {
    let user = await this.userRepo.findOne({ where: { id: 1 } });

    if (!user) {
      user = this.userRepo.create({
        xp: 0,
        level: 1,
        streak: 0,
        lastActivityDate: null,
      });
    }

    const safeSteps = Number(steps) || 0;
    const currentXp = Number(user.xp) || 0;
    const currentStreak = Number(user.streak) || 0;

    const today = new Date().toDateString();
    const last = user.lastActivityDate
      ? new Date(user.lastActivityDate).toDateString()
      : null;

    if (last === today) {
      user.streak = currentStreak;
    } else if (
      last &&
      new Date(today).getTime() - new Date(last).getTime() === 86400000
    ) {
      user.streak = currentStreak + 1;
    } else {
      user.streak = 1;
    }

    const gainedXP = safeSteps / 100;

    user.xp = Number((currentXp + gainedXP).toFixed(2));
    user.level = Math.floor(user.xp / 100) + 1;
    user.lastActivityDate = new Date();

    await this.userRepo.save(user);

    return user;
  }

  // ---------------- MARKETPLACE ----------------

  getItems() {
    return [
      { id: 1, name: "Coaching découverte", price: 100 },
      { id: 2, name: "Premium 7 jours", price: 250 },
      { id: 3, name: "Badge Bronze", price: 500 },
      { id: 4, name: "Bon partenaire local", price: 1000 },
    ];
  }

  async buyItem(itemId: number, wallet: string, balance: number) {
    const items = this.getItems();
    const item = items.find((i) => i.id === itemId);

    if (!item) {
      return { success: false, message: "Item not found" };
    }

    if (balance < item.price) {
      return { success: false, message: "Insufficient balance" };
    }

    const purchase = this.purchaseRepo.create({
      itemName: item.name,
      price: item.price,
      wallet,
    });

    await this.purchaseRepo.save(purchase);

    return {
      success: true,
      item,
      message: "Purchase successful",
    };
  }

  getPurchases() {
    return this.purchaseRepo.find({
      order: { id: "DESC" },
    });
  }
}