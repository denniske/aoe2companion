import {Entity, Column, PrimaryColumn, Index} from "typeorm";

@Entity()
export class RatingHistory {
    @PrimaryColumn()
    leaderboard_id: number;

    @PrimaryColumn()
    profile_id: number;

    @Index() // can be removed
    @PrimaryColumn()
    timestamp: number;

    @Column()
    rating: number;
}
