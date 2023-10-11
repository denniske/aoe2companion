import {fetchLeaderboardLegacy} from '../api/leaderboard';
import {groupBy, sortBy, sumBy} from 'lodash';
import {fetchJson, Flag, getHost, ILeaderboardPlayer, makeQueryString} from "@nex/data";
import {appConfig} from "@nex/dataset";
import {minifyUserId} from "../helper/user";
import {Aoe4WorldFoundPlayer, Aoe4WorldFoundPlayers, IAoe4WorldPlayerMatches} from "../../../data/src/api/api4.types";
import {fetchProfile} from "../api/profile";

export interface IFetchedUser {
    clan: string;
    country: Flag;
    drops: number;
    games: number;
    icon: any;
    last_match: Date;
    name: string;
    profile_id: number;
    steam_id: string;
    entries: ILeaderboardPlayer[];
}

function onlyDigits(str: string) {
    return /^\d+$/.test(str);
}

async function fetchLeaderboardLegacyForSteamId(game: string, leaderboard_id: number, steam_id: string) {
    const leaderboard = await fetchLeaderboardLegacy(game, leaderboard_id, {start: 1, count: 1, steam_id});
    // aoe2.net returns random results when the steam_id is not found, so we need to filter it locally
    leaderboard.leaderboard = leaderboard.leaderboard.filter(p => p.steam_id?.includes(steam_id));
    return leaderboard;
}

async function fetchLeaderboardLegacyForProfileId(game: string, leaderboard_id: number, profile_id: number) {
    return await fetchLeaderboardLegacy(game, leaderboard_id, {start: 1, count: 1, profile_id});
}

function aoe4WorldUserToFetchedUser(user4: Aoe4WorldFoundPlayer) {
    const newUser: IFetchedUser = {
        clan: '',
        country: '' as any,
        icon: '',
        name: user4.name,
        last_match: user4.last_game_at,
        profile_id: user4.profile_id,
        steam_id: user4.steam_id,
        games: sumBy(Object.values(user4.leaderboards), l => l.games_count),
        drops: 0,
        entries: [],
    }
    return newUser;
}

export async function loadUserLegacy4(game: string, start: number, count: number, search: string) {
    let newMatches = [];

    let args: any = {
        query: search,
    };
    const queryString = makeQueryString(args);
    const url = getHost('aoe4world') + `players/search?${queryString}`;
    let json = await fetchJson('loadUserLegacy4', url) as Aoe4WorldFoundPlayers;
    newMatches.push(...json.players);

    console.log('count', count);

    const pages = Math.ceil(count / json.per_page);
    for (let page = 2; page <= pages; page++) {
        args = {
            page,
            query: search,
        };
        const queryString = makeQueryString(args);
        const url = getHost('aoe4world') + `players/search?${queryString}`;
        let json = await fetchJson('loadUserLegacy4', url) as Aoe4WorldFoundPlayers;
        newMatches.push(...json.players);
        if (json.players.length < json.per_page) break;
    }

    const matches = [...newMatches];

    console.log(matches);

    return matches.map(aoe4WorldUserToFetchedUser);
}

export async function loadUserLegacy(game: string, start: number, count: number, search: string) {
    if (appConfig.game == 'aoe4') return await loadUserLegacy4(game, start, count, search);
    console.log("loading user", game, search);

    let profilesList = await Promise.all([
        ...(onlyDigits(search) && search.length > 12 ? [fetchProfile({start: 1, count: 1, steam_id: search})] : []),
        ...(onlyDigits(search) && search.length < 10 ? [fetchProfile({start: 1, count: 1, profile_id: parseInt(search)})] : []),
        fetchProfile({start, count, search: search}),
    ]);

    const profiles = profilesList.flatMap(l => l.profiles);

    // console.log(profiles);

    return profiles;
}

export async function loadUser(game: string, start: number, count: number, search: string) {
    return await loadUserLegacy(game, start, count, search);

    // console.time('=> loadUser');
    //
    // const endpoint = 'http://localhost:3333/graphql'
    // const query = gql`
    //     query H2($start: Int!, $count: Int!, $search: String!) {
    //         users(
    //             start: $start,
    //             count: $count,
    //             search: $search
    //         ) {
    //             profile_id
    //             name
    //             country
    //             games
    //         }
    //     }
    // `;
    //
    // const timeLastDate = new Date();
    // const variables = { start, count, search };
    // console.groupCollapsed('loadUser - users()');
    // console.log(query);
    // console.groupEnd();
    // console.log(variables);
    // const data = await request(endpoint, query, variables)
    // // console.log('gql', new Date().getTime() - timeLastDate.getTime());
    //
    // const ratingHistoryRows = data.users;
    //
    // console.timeEnd('=> loadUser');
    //
    // // const masterList = await loadUserLegacy(game, search);
    // // console.log("MASTER user", masterList);
    // // console.log(ratingHistoryRows);
    //
    // // const missing = ratingHistoryRows.filter(r => masterList.find(m => m.name == r.name) == null);
    // // console.log(missing.map(m => m.name));
    // //
    // // const missing2 = masterList.filter(r => ratingHistoryRows.find(m => m.name == r.name) == null);
    // // console.log(missing2.map(m => m.name));
    //
    // // return await loadUserLegacy(game, search);
    // return ratingHistoryRows;
}
