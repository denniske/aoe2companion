import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from "typeorm";
import {IMatch, IPlayer} from "./entity.type";

@Entity()
export class Player implements IPlayer {
    // @PrimaryGeneratedColumn()
    // id: number;

    @ManyToOne('Match', 'players')
    match: IMatch;

    @Column()
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

    @Column({ nullable: true })
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
