import {Entity, Column, PrimaryColumn, Index} from "typeorm";

@Entity()
export class LeaderboardRow {
    @PrimaryColumn()
    leaderboard_id: number;

    @Index()
    @PrimaryColumn()
    profile_id: number;

    @Column({ nullable: true })
    rank?: number;

    @Column({ nullable: true })
    rank_country?: number;

    @Column({ nullable: true })
    steam_id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    country?: string;

    @Column({ nullable: true })
    clan?: string;

    @Column({ nullable: true })
    icon?: string;

    @Column({ nullable: true })
    wins?: number;

    @Column({ nullable: true })
    drops?: number;

    @Column({ nullable: true })
    games?: number;

    @Column({ nullable: true })
    losses?: number;

    @Index()
    @Column({ nullable: true })
    rating?: number;

    @Column({ nullable: true })
    streak?: number;

    @Column({ nullable: true })
    last_match?: number;

    @Column({ nullable: true })
    lowest_streak?: number;

    @Column({ nullable: true })
    highest_rating?: number;

    @Column({ nullable: true })
    highest_streak?: number;

    @Column({ nullable: true })
    last_match_time?: number;

    @Column({ nullable: true })
    previous_rating?: number;

    @Column({ nullable: true })
    history_fetched?: number;
}
