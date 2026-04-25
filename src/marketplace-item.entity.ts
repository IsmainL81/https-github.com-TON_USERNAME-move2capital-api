import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class MarketplaceItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;
}