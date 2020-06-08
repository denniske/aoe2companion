import { fetchRatingHistory } from '../api/rating-history';

export interface IRatingHistoryRow {
    leaderboard_id: number;
    data: IRatingHistoryEntry[];
}

export const loadRatingHistories = async (game: string, steam_id: string) => {
    console.log("loading ratings", game, steam_id);

    let ratingHistories = await Promise.all([
        fetchRatingHistory(game, 0, 0, 500, {steam_id}),
        // fetchRatingHistory(game, 1, 0, 500, {steam_id}),
        // fetchRatingHistory(game, 2, 0, 500, {steam_id}),
        // fetchRatingHistory(game, 3, 0, 500, {steam_id}),
        // fetchRatingHistory(game, 4, 0, 500, {steam_id}),
    ]);

    let ratingHistoryRows = ratingHistories.map((rh, i) => ({
        leaderboard_id: i,
        data: rh,
    }));

    ratingHistoryRows = ratingHistoryRows.filter(rh => rh.data?.length);

    console.log("RETURNING ratingHistoryRows", ratingHistoryRows);

    return ratingHistoryRows;
};
