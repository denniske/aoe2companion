import {getStatsMap} from "./stats/stats-map";
import {getStatsCiv} from "./stats/stats-civ";
import {getStatsPlayer} from "./stats/stats-player";
import {IMatch} from "../helper/data";
import {UserId, UserIdBase} from "../helper/user";
import {LeaderboardId} from "../helper/leaderboards";
import {getStatsPosition} from "./stats/stats-position";
import {time} from "../helper/util";


export interface IParam {
    matches?: IMatch[];
    user: UserId;
    leaderboardId: LeaderboardId;
}

export async function getStats({matches, user, leaderboardId}: IParam) {
    console.log("==> CALC", user.id, leaderboardId, matches);

    time('getStats' + matches?.length);

    const filteredMatches = matches?.filter((m: any) => m.leaderboard_id === leaderboardId);

    time();

    const statsPosition = await getStatsPosition({matches: filteredMatches, user, leaderboardId});
    time();
    const statsCiv = await getStatsCiv({matches: filteredMatches, user});
    time();
    const statsMap = await getStatsMap({matches: filteredMatches, user});
    time();
    const statsPlayer = await getStatsPlayer({matches: filteredMatches, user, leaderboardId});
    time();

    return {
        statsPosition,
        statsCiv,
        statsMap,
        statsPlayer,
    };
}
