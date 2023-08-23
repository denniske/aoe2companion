import {dateReviver, makeQueryString} from '../lib/util';
import {getHost} from '../lib/host';
import {IMatchesResponse, IMatchNew} from './api.types';
import {fetchJson} from '../lib/fetch-json';
import {appConfig} from "@nex/dataset";
import {camelizeKeys} from "humps";


export async function fetchPlayerMatches(start: number, count: number, profileIds: number[], leaderboardIds?: string[], search: string = ''): Promise<IMatchNew[]> {
    if (profileIds.length === 0) {
        return [];
    }
    console.log('fetchPlayerMatches', start, count, profileIds, leaderboardIds, search);
    const args = {
        game: appConfig.game,
        start,
        count,
        profile_ids: profileIds,
        leaderboard_ids: leaderboardIds,
        search,
    };
    const queryString = makeQueryString(args);
    const url = getHost('aoe2companion-data') + `api/matches?${queryString}`;
    let json = camelizeKeys(await fetchJson('fetchPlayerMatches', url, null, dateReviver)) as IMatchesResponse;

    // console.log('=========> RESPONSE <==========');
    // console.log(json);

    return json.matches;
}
