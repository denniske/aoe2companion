import {Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, ManyToOne, Index} from "typeorm";
import {IMatchEntity, IPlayer} from "./entity.type";
import {IMatch} from '@nex/data/api';

@Entity()
export class Player implements IPlayer {
    // @PrimaryGeneratedColumn()
    // id: number;

    @ManyToOne('Match', 'players')
    match: IMatch;

    @Index()
    @PrimaryColumn()
    match_id: string;

    @Index()
    @PrimaryColumn({ default: 0 })
    profile_id: number;

    @Column({ nullable: true })
    steam_id?: string;

    @Column({ nullable: true })
    civ?: number;

    @Column({ nullable: true })
    clan?: string;

    @Column({ nullable: true })
    color?: number;

    @Column({ nullable: true })
    country?: string;

    @Column({ nullable: true })
    drops?: number;

    @Column({ nullable: true })
    games?: number;

    @Column({ nullable: true })
    name?: string;

    @Column({ nullable: true })
    rating?: number;

    @Column({ nullable: true })
    rating_change?: number;

    @PrimaryColumn()
    slot?: number;

    @Column({ nullable: true })
    slot_type?: number;

    @Column({ nullable: true })
    streak?: number;

    @Column({ nullable: true })
    team?: number;

    @Column({ nullable: true })
    wins?: number;

    @Column({ nullable: true })
    won?: boolean;
}
