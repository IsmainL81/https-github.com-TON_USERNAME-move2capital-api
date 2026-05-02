import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { BlockchainService } from "./blockchain.service";
import { Activity } from "./activity.entity";
import { User } from "./user.entity";
import { Mint } from "./mint.entity";
import { Purchase } from "./purchase.entity";
import { DailyActivity } from "./daily-activity.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "move2capital.db",
      entities: [Activity, User, Mint, Purchase, DailyActivity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Activity, User, Mint, Purchase, DailyActivity]),
  ],
  controllers: [AppController],
  providers: [AppService, BlockchainService],
})
export class AppModule {}