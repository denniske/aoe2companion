import {fetchLeaderboardLegacy} from '../api/leaderboard';
import {sortBy, sumBy} from 'lodash';
import {IProfile} from '../view/components/profile';
import {minifyUserId, UserIdBase} from '../helper/user';
import {IRatingHistoryEntry, IRatingHistoryEntryRaw} from '@nex/data/api';
import {parseISO} from "date-fns";
import request, {gql} from 'graphql-request';
import {IRatingHistoryRow} from './rating';
import {appConfig} from "@nex/dataset";
import {makeQueryString} from "@nex/data";
import {fetchJson} from "../api/util";
import {Aoe4WorldProfile} from "../../../data/src/api/api4.types";

const aoe4WorldLeaderboardMap = {
    'custom': 0,
    'qm_1v1': 17,
    'qm_2v2': 18,
    'qm_3v3': 19,
    'qm_4v4': 20,
    'rm_1v1': 1001,
};

export async function loadProfileLegacy4(userId: UserIdBase): Promise<any | null> {
    const url = `https://aoe4world.com/api/v0/players/${userId.profile_id}`;
    const json = await fetchJson('loadProfileLegacy4', url) as Aoe4WorldProfile;

    const h: IProfile = {
        clan: '',
        country: '' as any,
        icon: '',
        name: json.name,
        profile_id: json.profile_id,
        steam_id: json.steam_id,
        games: sumBy(Object.values(json.modes), m => m.games_count),
        drops: sumBy(Object.values(json.modes), m => m.drops_count),
        leaderboards: Object.entries(json.modes).map(([modeKey, mode]) => ({
            leaderboard: [{
                profile_id: json.profile_id,
                steam_id: json.steam_id,
                games: mode.games_count,
                wins: mode.wins_count,
                drops: mode.drops_count,
                rank: mode.rank,
                rating: mode.rating,
                streak: mode.streak,
                // previous_rating: 100,
            }],
            leaderboard_id: aoe4WorldLeaderboardMap[modeKey],
            count: 0,
            length: 0,
            start: 0,
            total: 0,
        })),
    };
    console.log('h', h);
    return  h;
}

export async function loadProfileLegacy(game: string, userId: UserIdBase): Promise<any | null> {
    if (appConfig.game == 'aoe4') return loadProfileLegacy4(userId);
    // console.log("loading profile", game, composeUserId(userId));

    // console.time('=> loadProfile');

    let leaderboards = await Promise.all(
        appConfig.leaderboards.map(leaderbard => fetchLeaderboardLegacy(game, leaderbard.id, {count: 1, ...minifyUserId(userId)}))
    );

    const leaderboardInfos = leaderboards.flatMap(l => l.leaderboard);
    const sortedLeaderboardInfos = sortBy(leaderboardInfos, l => l.last_match);
    const mostRecentLeaderboard = sortedLeaderboardInfos[0];

    if (sortedLeaderboardInfos?.length === 0) {
        return null;
    }

    // console.timeEnd('=> loadProfile');

    const h: IProfile = {
        clan: mostRecentLeaderboard.clan,
        country: mostRecentLeaderboard.country,
        icon: mostRecentLeaderboard.icon,
        name: mostRecentLeaderboard.name,
        profile_id: mostRecentLeaderboard.profile_id,
        steam_id: mostRecentLeaderboard.steam_id,
        games: sumBy(leaderboardInfos, l => l.games),
        drops: sumBy(leaderboardInfos, l => l.drops),
        leaderboards: leaderboards.filter(l => l.leaderboard?.length > 0),
    };
    return  h;
}

function convertTimestampsToDates(json: IRatingHistoryEntryRaw): IRatingHistoryEntry {
    return {
        ...json,
        timestamp: json.timestamp ? parseISO(json.timestamp) : undefined,
    };
}

// function convertTimestampsToDates(leaderboardRaw: ILeaderboardRaw): ILeaderboard {
//     return {
//         ...leaderboardRaw,
//         updated: leaderboardRaw.updated ? fromUnixTime(leaderboardRaw.updated) : undefined,
//         leaderboard: leaderboardRaw.leaderboard.map(playerRaw => ({
//             ...playerRaw,
//             last_match: fromUnixTime(playerRaw.last_match),
//         })),
//     };
// }

export async function loadProfile(game: string, userId: UserIdBase): Promise<IProfile | null> {
    return await loadProfileLegacy(game, userId);

    // console.log("loading ratings", game, composeUserId(userId));

    // console.time('=> loadProfile');

    // const endpoint = 'http://localhost:3333/graphql'
    // const query = gql`
    //     query H2($profile_id: Int!) {
    //         profile(
    //             profile_id: $profile_id
    //         ) {
    //             profile_id
    //             name
    //             country
    //             games
    //             drops
    //             leaderboards {
    //                 leaderboard_id
    //                 profile_id
    //                 steam_id
    //                 rank
    //                 name
    //                 country
    //                 clan
    //                 icon
    //                 rating
    //                 highest_rating
    //                 previous_rating
    //                 games
    //                 wins
    //                 losses
    //                 drops
    //                 streak
    //                 lowest_streak
    //                 highest_streak
    //                 last_match
    //                 last_match_time
    //             }
    //         }
    //     }
    // `;
    // console.log('query', query);
    //
    // const timeLastDate = new Date();
    // const variables = { profile_id: userId.profile_id };
    // const data = await request(endpoint, query, variables)
    // console.log('gql', new Date().getTime() - timeLastDate.getTime());
    // console.log(data);
    //
    // const ratingHistoryRows = data.profile;

    // console.timeEnd('=> loadProfile');

    // console.log("MASTER profile", await loadProfileLegacy(game, userId));
    // console.log("RETURNING profile", ratingHistoryRows);

    // clan
    // # icon
    // # steam_id

    // return ratingHistoryRows;
}
