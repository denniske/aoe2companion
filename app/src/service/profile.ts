import {fetchLeaderboardLegacy} from '../api/leaderboard';
import {sortBy, sumBy} from 'lodash-es'
import {IProfile} from '../view/components/profile';
import {minifyUserId, UserIdBase} from '../helper/user';
import {IRatingHistoryEntry, IRatingHistoryEntryRaw} from '@nex/data';
import {parseISO} from "date-fns";
import request, {gql} from 'graphql-request';
import {IRatingHistoryRow} from './rating';

export async function loadProfileLegacy(game: string, userId: UserIdBase): Promise<any | null> {
    // console.log("loading profile", game, composeUserId(userId));

    console.time('=> loadProfile');

    let leaderboards = await Promise.all([
        fetchLeaderboardLegacy(game, 0, {count: 1, ...minifyUserId(userId)}),
        fetchLeaderboardLegacy(game, 1, {count: 1, ...minifyUserId(userId)}),
        fetchLeaderboardLegacy(game, 2, {count: 1, ...minifyUserId(userId)}),
        fetchLeaderboardLegacy(game, 3, {count: 1, ...minifyUserId(userId)}),
        fetchLeaderboardLegacy(game, 4, {count: 1, ...minifyUserId(userId)}),
    ]);

    const leaderboardInfos = leaderboards.flatMap(l => l.leaderboard);
    const sortedLeaderboardInfos = sortBy(leaderboardInfos, l => l.last_match);
    const mostRecentLeaderboard = sortedLeaderboardInfos[0];

    if (sortedLeaderboardInfos?.length === 0) {
        return null;
    }

    console.timeEnd('=> loadProfile');

    return {
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
    // console.log("loading ratings", game, composeUserId(userId));

    console.time('=> loadProfile');

    const endpoint = 'http://localhost:3333/graphql'
    const query = gql`
        query H2($profile_id: Int!) {
            profile(
                profile_id: $profile_id
            ) {
                profile_id
                name
                country
                games
                drops
                leaderboards {
                    leaderboard_id
                    profile_id
                    steam_id
                    rank
                    name
                    country
                    clan
                    icon
                    rating
                    highest_rating
                    previous_rating
                    games
                    wins
                    losses
                    drops
                    streak
                    lowest_streak
                    highest_streak
                    last_match
                    last_match_time
                }
            }
        }
    `;
    console.log('query', query);

    const timeLastDate = new Date();
    const variables = { profile_id: userId.profile_id };
    const data = await request(endpoint, query, variables)
    console.log('gql', new Date().getTime() - timeLastDate.getTime());
    console.log(data);

    const ratingHistoryRows = data.profile;

    console.timeEnd('=> loadProfile');

    // console.log("MASTER profile", await loadProfileLegacy(game, userId));
    console.log("RETURNING profile", ratingHistoryRows);

    // clan
    // # icon
    // # steam_id

    return ratingHistoryRows;
}
