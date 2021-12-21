import {fetchRatingHistory} from '../api/rating-history';
import {minifyUserId, UserIdBase} from '../helper/user';
import {IRatingHistoryEntry, IRatingHistoryEntryRaw} from "@nex/data";
import {LeaderboardId} from "@nex/data";
import {parseISO} from "date-fns";
import {appConfig} from "@nex/dataset";
import {fetchLeaderboardLegacy} from "../api/leaderboard";

export interface IRatingHistoryRow {
    leaderboard_id: LeaderboardId;
    data: IRatingHistoryEntry[];
}

export async function loadRatingHistoriesLegacy(game: string, userId: UserIdBase): Promise<IRatingHistoryRow[]> {
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
