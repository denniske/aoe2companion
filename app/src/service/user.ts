import {fetchLeaderboardLegacy} from '../api/leaderboard';
import {groupBy, sortBy, sumBy} from 'lodash';
import {Flag, ILeaderboardPlayer} from "@nex/data";
import request, {gql} from 'graphql-request';

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

export async function loadUserLegacy(game: string, start: number, count: number, search: string) {
    console.log("loading user", game, search);

    let leaderboards = await Promise.all([
        ...(onlyDigits(search) && search.length > 12 ? [fetchLeaderboardLegacyForSteamId(game, 0, search)] : []),
        ...(onlyDigits(search) && search.length > 12 ? [fetchLeaderboardLegacyForSteamId(game, 1, search)] : []),
        ...(onlyDigits(search) && search.length > 12 ? [fetchLeaderboardLegacyForSteamId(game, 2, search)] : []),
        ...(onlyDigits(search) && search.length > 12 ? [fetchLeaderboardLegacyForSteamId(game, 3, search)] : []),
        ...(onlyDigits(search) && search.length > 12 ? [fetchLeaderboardLegacyForSteamId(game, 4, search)] : []),
        ...(onlyDigits(search) && search.length < 10 ? [fetchLeaderboardLegacyForProfileId(game, 0, parseInt(search))] : []),
        ...(onlyDigits(search) && search.length < 10 ? [fetchLeaderboardLegacyForProfileId(game, 1, parseInt(search))] : []),
        ...(onlyDigits(search) && search.length < 10 ? [fetchLeaderboardLegacyForProfileId(game, 2, parseInt(search))] : []),
        ...(onlyDigits(search) && search.length < 10 ? [fetchLeaderboardLegacyForProfileId(game, 3, parseInt(search))] : []),
        ...(onlyDigits(search) && search.length < 10 ? [fetchLeaderboardLegacyForProfileId(game, 4, parseInt(search))] : []),
        fetchLeaderboardLegacy(game, 0, {start, count, search: search}),
        fetchLeaderboardLegacy(game, 1, {start, count, search: search}),
        fetchLeaderboardLegacy(game, 2, {start, count, search: search}),
        fetchLeaderboardLegacy(game, 3, {start, count, search: search}),
        fetchLeaderboardLegacy(game, 4, {start, count, search: search}),
    ]);

    // console.log(leaderboards);

    // Group by
    const leaderboardEntries = leaderboards.flatMap(l => l.leaderboard);

    const users = groupBy(leaderboardEntries, l => l.steam_id + '-' + l.profile_id);

    const result = [];

    for (const userId in users) {
        const entries = users[userId];
        const sortedEntries = sortBy(entries, e => e.last_match);
        const mostRecentEntry = sortedEntries[0];

        result.push({
            clan: mostRecentEntry.clan,
            country: mostRecentEntry.country,
            icon: mostRecentEntry.icon,
            name: mostRecentEntry.name,
            last_match: mostRecentEntry.last_match,
            profile_id: mostRecentEntry.profile_id,
            steam_id: mostRecentEntry.steam_id,
            games: sumBy(entries, e => e.games),
            drops: sumBy(entries, e => e.drops),
            entries,
        } as IFetchedUser);
    }

    // console.log(leaderboards);
    // console.log(result);

    return result;
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
