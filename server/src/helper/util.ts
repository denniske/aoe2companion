import {ParsedQs} from "qs";
import {Params, ParamsDictionary, PathParams, RequestHandler} from "express-serve-static-core";
import {format} from "date-fns";
import {enUS} from "date-fns/locale";

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
    match_id: string;
    match_uuid: string;
    lobby_id: any;
    name: string;
    opened?: any;
    started?: any;
    finished?: any;
    leaderboard_id: number;
    num_slots: number;
    has_password: boolean;
    server: string;
    map_type: number;
    average_rating: any;
    cheats: boolean;
    ending_age: number;
    expansion: any;
    full_tech_tree: boolean;
    game_type: any;
    has_custom_content: any;
    lock_speed: boolean;
    lock_teams: boolean;
    map_size: number;
    num_players: number;
    players: IPlayer[];
    pop: number;
    ranked: boolean;
    rating_type: any;
    resources: any;
    rms: any;
    scenario: any;
    shared_exploration: boolean;
    speed: number;
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


export function asyncHandler<P extends Params = ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = ParsedQs>(fn: RequestHandler<P, ResBody, ReqBody, ReqQuery>) {

    return ((req, res, next) => {
        return Promise
            .resolve(fn(req, res, next))
            .catch(next);
    }) as RequestHandler<P, ResBody, ReqBody, ReqQuery>;
}

let timeLastDate: Date | null = null;
export function time(start?: any) {
    if (timeLastDate == null || start) {
        console.log('-');
    } else {
        console.log(new Date().getTime() - timeLastDate.getTime());
    }
    timeLastDate = new Date();
}

export function getParam(params: { [name: string]: any } | null, key: string): string {
    if (params == null) {
        return null;
    }
    return params[key];
}

export function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export function formatDayAndTime(date: Date) {
    console.log(date);
    return format(date, 'MMM d HH:mm', {locale: enUS});
}
