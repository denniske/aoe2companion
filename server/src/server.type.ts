
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
