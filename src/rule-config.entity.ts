import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class RuleConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("float")
  baseTokensPer1000Steps: number;

  @Column()
  bonusThresholdSteps: number;

  @Column("float")
  bonusMultiplier: number;

  @Column("float")
  dailyCap: number;

  @Column("float")
  minDistanceKm: number;

  @Column("float")
  maxDistanceKm: number;

  @Column()
  minSteps: number;

  @Column()
  maxSteps: number;

  @Column("float")
  maxKmPer1000Steps: number;

  @Column("float")
  minKmPer1000Steps: number;
}