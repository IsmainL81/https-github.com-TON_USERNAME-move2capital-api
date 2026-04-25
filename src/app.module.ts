import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { BlockchainService } from "./blockchain.service";
import { Activity } from "./activity.entity";
import { User } from "./user.entity";
import { Mint } from "./mint.entity";
import { Purchase } from "./purchase.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "move2capital.db",
      entities: [Activity, User, Mint, Purchase],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Activity, User, Mint, Purchase]),
  ],
  controllers: [AppController],
  providers: [AppService, BlockchainService],
})
export class AppModule {}