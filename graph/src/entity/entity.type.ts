import {IMatch} from '@nex/data/api';


export interface IMatchBase {
    match_id?: string;
    match_uuid?: string;
    lobby_id?: string;
    name?: string;
    opened?: number;
    started?: number;
    finished?: number;
    checked?: number;
    notified: boolean;
    leaderboard_id?: number;
    num_slots?: number;
    has_password?: boolean;
    server?: string;
    map_type?: number;
    average_rating?: number;
    cheats?: boolean;
    ending_age?: number;
    expansion?: string;
    full_tech_tree?: boolean;
    game_type?: number;
    has_custom_content?: boolean;
    lock_speed?: boolean;
    lock_teams?: boolean;
    map_size?: number;
    num_players?: number;
    pop?: number;
    ranked?: boolean;
    rating_type?: number;
    resources?: number;
    rms?: string;
    scenario?: string;
    shared_exploration?: boolean;
    speed?: number;
    starting_age?: number;
    team_positions?: boolean;
    team_together?: boolean;
    treaty_length?: number;
    turbo?: boolean;
    version?: string;
    victory?: number;
    victory_time?: number;
    visibility?: number;
    players: IPlayerBase[];

    maybe_finished?: number;
}


export interface IMatchEntity extends IMatchBase {
    id: string;
}

export interface IMatchFromApi extends Partial<IMatchBase> {
    match_id: string;
}


export interface IPlayerBase {
    profile_id: number;
    steam_id?: string;
    civ?: number;
    clan?: string;
    color?: number;
    country?: string;
    drops?: number;
    games?: number;
    name?: string;
    rating?: number;
    rating_change?: number;
    slot?: number;
    slot_type?: number;
    streak?: number;
    team?: number;
    wins?: number;
    won?: boolean;
}

export interface IPlayer extends IPlayerBase {
    match: IMatch;
    match_id: string;
}

export interface IFollowing {
    account: IAccount;
    profile_id: number;
    enabled?: boolean;
    updated_at: string;
}

export interface IAccount {
    id: string;
    push_token?: string;
    push_token_web?: string;
    push_token_electron?: string;
    overlay?: boolean;
    followings?: IFollowing[];
}
