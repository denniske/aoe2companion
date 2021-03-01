import {LeaderboardId} from "@nex/data";
import {Flag, IMatch, IMatchRaw, SlotType} from '@nex/data';



export interface ILobbyPlayerRaw {
    color: number;
    civ: number;
    avatar: string;
    avatarfull: string;
    avatarmedium: string;
    countryCode: Flag;
    drops: number;
    games: number;
    name: string;
    profileId: number;
    rating: number;
    slot: number;
    slotType: SlotType;
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



export interface IRatingHistoryEntryRaw {
    drops: number;
    num_losses: number;
    num_wins: number;
    rating: number;
    streak: number;
    timestamp?: any;
}

export interface IRatingHistoryEntry extends IRatingHistoryEntryRaw {
    timestamp?: Date;
}




export interface ILeaderboardPlayerRaw {
    clan: string;
    country: Flag;
    drops: number;
    games: number;
    highest_rating: number;
    highest_streak: number;
    icon: any;
    last_match: any;
    last_match_time: any;
    losses: number;
    lowest_streak: number;
    name: string;
    previous_rating: number;
    profile_id: number;
    rank: number;
    rating: number;
    steam_id: string;
    streak: number;
    wins: number;
}

export interface ILeaderboardRaw {
    count: number;
    leaderboard: ILeaderboardPlayerRaw[];
    length: number;
    leaderboard_id: LeaderboardId;
    start: number;
    total: number;
    updated?: any;
}


export interface ILeaderboardPlayer extends ILeaderboardPlayerRaw {
    last_match: Date;
    last_match_time: Date;
}

export interface ILeaderboard extends ILeaderboardRaw{
    leaderboard: ILeaderboardPlayer[];
    updated?: Date;
}

function shrinkMatches(matches: IMatch[]) {
    return matches.map(m => ({
        name: m.name,
        map_type: m.map_type,
        players: m.players.map(p => ({
            name: p.name,
        })),
    }));
}

// const size = JSON.stringify(allMatches.data ?? []).length / 1000;
// const size2 = JSON.stringify(shrinkMatches(allMatches.data ?? [])).length / 1000;
// console.log('all matches', size, 'KB');
// console.log('shrinked matches', size2, 'KB');
// const size3 = JSON.stringify(stats.data?.statsCiv ?? []).length / 1000;
// console.log('all stats', size3, 'KB');
