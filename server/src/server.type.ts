
export interface UserIdBase {
    steamId?: string;
    profileId?: number;
}

interface IParams {
    [key: string]: any;
}

export function minifyUserId(id: UserIdBase): any {
    if (id.steamId) {
        return {
            steam_id: id.steamId,
        };
    }
    return {
        profile_id: id.profileId,
    };
}

export function makeQueryString(params: IParams) {
    return Object.keys(params)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        .join('&');
}

export interface ILobbyPlayerRaw {
    color: number;
    civ: number;
    avatar: string;
    avatarfull: string;
    avatarmedium: string;
    countryCode: string;
    drops: number;
    games: number;
    name: string;
    profileId: number;
    rating: number;
    slot: number;
    slotType: number;
    steamId: string;
    streak: number;
    unrankedRating: number;
    wins: number;
}

export interface ILobbyMatchRaw {
    active: boolean;
    appId: number;
    averageRating: number;
    cheats: boolean;
    full: boolean;
    fullTechTree: boolean;
    gameType: string;
    gameTypeId: number;
    hasPassword: boolean;
    hidden: boolean;
    id: string;
    location: string;
    lockSpeed: boolean;
    lockTeams: boolean;
    mapSize: string;
    name: string;
    numPlayers: number;
    numSlots: number;
    players: ILobbyPlayerRaw[];
    pop: number;
    ranked: boolean;
    ratingType: number;
    resources: string;
    server: string;
    sharedExploration: boolean;
    speed: string;
    startingAge: string;
    status: string;
    steamLobbyId: string;
    turbo: boolean;
    victory: string;
    visibility: string;
}


export interface IPlayer {
    civ: number;
    clan: string;
    color: number;
    country: string;
    drops: number;
    games: number;
    name: string;
    profile_id: number;
    rating: number;
    rating_change: any;
    slot: number;
    slot_type: number;
    steam_id: string;
    streak: any;
    team: number;
    wins: any;
    won: any;
}

export interface ILastMatchRaw {
    profile_id: number;
    steam_id: string;
    name: string;
    country: string;
    last_match: IMatchRaw;
}

export interface IMatchRaw {
    average_rating: any;
    cheats: boolean;
    ending_age: number;
    expansion: any;
    finished?: any;
    full_tech_tree: boolean;
    game_type: any;
    has_custom_content: any;
    has_password: boolean;
    leaderboard_id: number;
    lobby_id: any;
    lock_speed: boolean;
    lock_teams: boolean;
    map_size: number;
    map_type: string;
    match_id: string;
    match_uuid: string;
    name: string;
    num_players: number;
    num_slots: number;
    opened?: any;
    players: IPlayer[];
    pop: number;
    ranked: boolean;
    rating_type: any;
    resources: any;
    rms: any;
    scenario: any;
    server: string;
    shared_exploration: boolean;
    speed: number;
    started?: any;
    starting_age: number;
    team_positions: boolean;
    team_together: boolean;
    treaty_length: any;
    turbo: boolean;
    version: string;
    victory: any;
    victory_time: any;
    visibility: any;
}


export interface IPingMessage {
    message: 'ping';
    data: number;
}

export interface IChatMessageData {
    avatar: string;
    avatarfull: string;
    avatarmedium: string;
    color: any;
    deleted: boolean;
    message: string;
    personaname: string;
    profileurl: string;
    steam_id: string;
    ts: number;
    uuid: string;
}

export interface IChatMessage {
    message: 'chat';
    data: IChatMessageData;
}

export interface ILobbiesMessage {
    message: 'lobbies';
    data: ILobbyMatchRaw[];
}

export type Message = IPingMessage | IChatMessage | ILobbiesMessage;
