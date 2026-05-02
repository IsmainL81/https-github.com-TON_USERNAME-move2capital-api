import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class DailyActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  wallet: string;

  @Column()
  date: string;

  @Column({ default: 0 })
  steps: number;

  @Column({ type: "float", default: 0 })
  mintedIMT: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}