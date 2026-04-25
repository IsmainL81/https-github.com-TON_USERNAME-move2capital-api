import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: string;

  @Column()
  steps: number;

  @Column("float")
  distance: number;

  @Column("float")
  tokens: number;

  @Column()
  status: string;
}