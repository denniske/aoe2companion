import {getStatsMap} from "./stats/stats-map";
import {getStatsCiv} from "./stats/stats-civ";
import {getStatsPlayer} from "./stats/stats-player";
import {IMatch} from "../helper/data";
import {UserId, UserIdBase} from "../helper/user";
import {LeaderboardId} from "../helper/leaderboards";


export interface IParam {
    matches?: IMatch[];
    user: UserId;
    leaderboardId: LeaderboardId;
}

export async function getStats({matches, user, leaderboardId}: IParam) {
    console.log("==> CALC", user.id, leaderboardId, matches);

    const filteredMatches = matches?.filter((m: any) => m.leaderboard_id === leaderboardId);

    const statsCiv = await getStatsCiv({matches: filteredMatches, user});
    const statsMap = await getStatsMap({matches: filteredMatches, user});
    const statsPlayer = await getStatsPlayer({matches: filteredMatches, user, leaderboardId});

    return {
        statsCiv,
        statsMap,
        statsPlayer,
    };
}
