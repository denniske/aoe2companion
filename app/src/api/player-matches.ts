import {makeQueryString, sleep} from '@nex/data';
import {IMatch, IMatchRaw} from "../helper/data";
import {fromUnixTime} from "date-fns";
import { getHost } from './host';
import {uniqBy} from "lodash-es";
import {fetchJson} from "./util";


function convertTimestampsToDates(json: IMatchRaw): IMatch {
    return {
        ...json,
        players: json.players,//.filter(p => p.profile_id != null || p.steam_id != null),
        started: json.started ? fromUnixTime(json.started) : undefined,
        finished: json.finished ? fromUnixTime(json.finished) : undefined,
        opened: json.opened ? fromUnixTime(json.opened) : undefined,
    };
}

export interface IFetchMatchesParams {
    steam_id?: string;
    profile_id?: number;
}


export async function fetchPlayerMatches(game: string, start: number, count: number, params: IFetchMatchesParams[]): Promise<IMatch[]> {
    if (params.length === 0) {
        return [];
    }
    const args = {
        game,
        start,
        count,
        profile_ids: params.map(p => p.profile_id),
    };
    const queryString = makeQueryString(args);
    const url = getHost('aoe2net') + `api/player/matches?${queryString}`;
    let json = await fetchJson('fetchPlayerMatches', url) as IMatchRaw[];

    // TODO: Temporary fix: Filter duplicate matches
    json = uniqBy(json, m => m.match_id);

    return json.map(match => convertTimestampsToDates(match));
}
