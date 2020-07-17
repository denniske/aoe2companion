import {Entity, Column, PrimaryColumn} from "typeorm";

@Entity()
export class LeaderboardRow {
    @PrimaryColumn()
    leaderboardId: number;

    @PrimaryColumn()
    rank: number;

    @Column()
    profileId: number;

    @Column({ nullable: true })
    steamId: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    country?: string;

    @Column('jsonb')
    data: any;
}
