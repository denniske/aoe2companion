import {getStatsMap} from "./stats/stats-map";
import {getStatsCiv} from "./stats/stats-civ";
import {getStatsPlayer} from "./stats/stats-player";
import {IMatch} from "@nex/data";
import {UserId, UserIdBase} from "../helper/user";
import {LeaderboardId} from "../helper/leaderboards";
import {getStatsPosition} from "./stats/stats-position";
import {time} from "@nex/data";
import {getStatsDuration} from "./stats/stats-duration";


export interface IParam {
    matches?: IMatch[];
    user: UserId;
    leaderboardId: LeaderboardId;
}

export async function getStats({matches, user, leaderboardId}: IParam) {
    console.log("==> CALC", user.id, leaderboardId);

    time('getStats' + matches?.length);

    const filteredMatches = matches?.filter((m: any) => m.leaderboard_id === leaderboardId);

    time();

    const statsDuration = await getStatsDuration({matches: filteredMatches, user});
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
        statsDuration,
        statsPosition,
        statsCiv,
        statsMap,
        statsPlayer,
    };
}
