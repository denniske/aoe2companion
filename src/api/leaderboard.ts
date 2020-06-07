import { makeQueryString } from '../service/util';

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


export async function fetchLeaderboard(game: string, leaderboard_id: string, params: IFetchLeaderboardParams) {
    const queryString = makeQueryString({
        game,
        leaderboard_id,
        ...params,
    });
    const response = await fetch(`https://aoe2.net/api/leaderboard?${queryString}`);
    const json = await response.json();
    console.log("response.json()", json);

    return convertTimestampsToDates(json);
}
