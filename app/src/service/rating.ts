import {fetchRatingHistory} from '../api/rating-history';
import {minifyUserId, UserIdBase} from '../helper/user';
import {IRatingHistoryEntry, IRatingHistoryEntryRaw} from "@nex/data";
import {LeaderboardId} from "@nex/data";
import {fromUnixTime, parseISO} from "date-fns";
import {appConfig} from "@nex/dataset";
import {fetchLeaderboardLegacy} from "../api/leaderboard";
import {loadProfileLegacy4} from "./profile";
import {fetchJson} from "../api/util";
import {Aoe4WorldProfile} from "../../../data/src/api/api4.types";
import {IProfile} from "../view/components/profile";
import {sumBy} from "lodash";

export interface IRatingHistoryRow {
    leaderboard_id: LeaderboardId;
    data: IRatingHistoryEntry[];
}

const aoe4WorldLeaderboardMap = {
    'custom': 0,
    'qm_1v1': 17,
    'qm_2v2': 18,
    'qm_3v3': 19,
    'qm_4v4': 20,
    'rm_1v1': 1001,
};

// "rating": 2096,
// "num_wins": 439,
// "num_losses": 228,
// "streak": 5,
// "drops": 2,
// "timestamp": 1649713457

export async function loadRatingHistoriesLegacy4(userId: UserIdBase): Promise<IRatingHistoryRow[]> {
    const url = `https://aoe4world.com/api/v0/players/${userId.profile_id}`;
    const json = await fetchJson('loadProfileLegacy4', url) as Aoe4WorldProfile;

    const ratingHistoryRows: IRatingHistoryRow[] = Object.entries(json.modes).map(([modeKey, mode]) => ({
            data: Object.entries(mode.rating_history).map(([timestamp, entry]) => ({
                timestamp: fromUnixTime(timestamp),
                rating: entry.rating,
            })),
            leaderboard_id: aoe4WorldLeaderboardMap[modeKey],
        }));
    console.log('ratingHistoryRows', ratingHistoryRows);
    return ratingHistoryRows;
}


export async function loadRatingHistoriesLegacy(game: string, userId: UserIdBase): Promise<IRatingHistoryRow[]> {
    if (appConfig.game == 'aoe4') return loadRatingHistoriesLegacy4(userId);
    // console.log("loading ratings", game, composeUserId(userId));

    // console.time('=> loadRatingHistories');

    let ratingHistories = await Promise.all(
        appConfig.leaderboards.map(leaderbard => fetchRatingHistory(game, leaderbard.id, 0, 500, minifyUserId(userId)))
    );

    let ratingHistoryRows = ratingHistories.map((rh, i) => ({
        leaderboard_id: appConfig.leaderboards[i].id as LeaderboardId,
        data: rh,
    }));

    ratingHistoryRows = ratingHistoryRows.filter(rh => rh.data?.length);

    // console.timeEnd('=> loadRatingHistories');

    // console.log("RETURNING ratingHistoryRows", ratingHistoryRows);

    return ratingHistoryRows;
}


function convertTimestampsToDates(json: IRatingHistoryEntryRaw): IRatingHistoryEntry {
    return {
        ...json,
        timestamp: json.timestamp ? parseISO(json.timestamp) : undefined,
    };
}


export async function loadRatingHistories(game: string, userId: UserIdBase): Promise<IRatingHistoryRow[]> {
    return await loadRatingHistoriesLegacy(game, userId);

    // console.log("loading ratings", game, composeUserId(userId));

    // console.time('=> loadRatingHistories');

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
    //             rating_history {
    //                 leaderboard_id
    //                 profile_id
    //                 history {
    //                     rating
    //                     timestamp
    //                 }
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
    // const ratingHistoryRows = data.profile.rating_history.map((rh: any) => ({
    //     leaderboard_id: rh.leaderboard_id,
    //     data: rh.history.map(convertTimestampsToDates),
    // }));
    //
    // console.timeEnd('=> loadRatingHistories');
    //
    // console.log("RETURNING ratingHistoryRows", ratingHistoryRows);
    //
    // return ratingHistoryRows;
}
