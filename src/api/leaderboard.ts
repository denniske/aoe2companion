import { makeQueryString } from '../helper/util';

const fromUnixTime = require('date-fns/fromUnixTime');


function convertTimestampsToDates(leaderboardRaw: ILeaderboardRaw): ILeaderboard {
    return {
        ...leaderboardRaw,
        leaderboard: leaderboardRaw.leaderboard.map(playerRaw => ({
            ...playerRaw,
            last_match: fromUnixTime(playerRaw.last_match),
        })),
    };
}

export interface IFetchLeaderboardParams {
    count: number;
    search?: string;
    steam_id?: string;
    profile_id?: number;
}


export async function fetchLeaderboard(game: string, leaderboard_id: number, params: IFetchLeaderboardParams) {
    const queryString = makeQueryString({
        game,
        leaderboard_id,
        ...params,
    });
    const response = await fetch(`https://aoe2.net/api/leaderboard?${queryString}`);
    try {
        const json = await response.json();
        // console.log("fetchLeaderboard", leaderboard_id, params, json);
        return convertTimestampsToDates(json);
    } catch (e) {
        console.log("FAILED", `https://aoe2.net/api/leaderboard?${queryString}`);
        throw e;
    }
}
