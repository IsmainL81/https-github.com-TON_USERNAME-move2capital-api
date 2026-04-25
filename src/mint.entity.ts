import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Mint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: string;

  @Column("float")
  amount: number;

  @Column()
  txHash: string;

  @Column()
  status: string;
}