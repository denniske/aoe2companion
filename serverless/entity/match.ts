import {Entity, Column, PrimaryColumn, OneToMany, Index} from "typeorm";
import {IMatch, IPlayer} from "./entity.type";

@Entity()
export class Match implements IMatch {
    @PrimaryColumn({ name: 'match_id' })
    id: string;

    @Column({ nullable: true })
    match_uuid?: string;

    @Column({ nullable: true })
    lobby_id?: string;

    @Column({ nullable: true })
    name?: string;

    @Column({ nullable: true })
    opened?: number;

    @Index()
    @Column({ nullable: true })
    started?: number;

    @Column({ nullable: true })
    finished?: number;

    @Column({ nullable: true })
    maybeFinished?: number;

    @Column({ default: false })
    notified: boolean;

    @Column({ nullable: true })
    leaderboard_id?: number;

    @Column({ nullable: true })
    num_slots?: number;

    @Column({ nullable: true })
    has_password?: boolean;

    @Column({ nullable: true })
    server?: string;

    @Column({ nullable: true })
    map_type?: number;

    @Column({ nullable: true })
    average_rating?: number;

    @Column({ nullable: true })
    cheats?: boolean;

    @Column({ nullable: true })
    ending_age?: number;

    @Column({ nullable: true })
    expansion?: string;

    @Column({ nullable: true })
    full_tech_tree?: boolean;

    @Column({ nullable: true })
    game_type?: number;

    @Column({ nullable: true })
    has_custom_content?: boolean;

    @Column({ nullable: true })
    lock_speed?: boolean;

    @Column({ nullable: true })
    lock_teams?: boolean;

    @Column({ nullable: true })
    map_size?: number;

    @Column({ nullable: true })
    num_players?: number;

    @Column({ nullable: true })
    pop?: number;

    @Column({ nullable: true })
    ranked?: boolean;

    @Column({ nullable: true })
    rating_type?: number;

    @Column({ nullable: true })
    resources?: number;

    @Column({ nullable: true })
    rms?: string;

    @Column({ nullable: true })
    scenario?: string;

    @Column({ nullable: true })
    shared_exploration?: boolean;

    @Column({ nullable: true })
    speed?: number;

    @Column({ nullable: true })
    starting_age?: number;

    @Column({ nullable: true })
    team_positions?: boolean;

    @Column({ nullable: true })
    team_together?: boolean;

    @Column({ nullable: true })
    treaty_length?: number;

    @Column({ nullable: true })
    turbo?: boolean;

    @Column({ nullable: true })
    version?: string;

    @Column({ nullable: true })
    victory?: number;

    @Column({ nullable: true })
    victory_time?: number;

    @Column({ nullable: true,  })
    visibility?: number;

    @OneToMany('Player', 'match', { cascade: true })
    players: IPlayer[];
}
