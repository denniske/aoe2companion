import {makeQueryString, sleep} from '../helper/util';
import {IMatch, IMatchRaw} from "../helper/data";
import {fromUnixTime} from "date-fns";
import { getHost } from './host';
import {uniqBy} from "lodash-es";


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
    const args = {
        game,
        start,
        count,
        profile_ids: params.map(p => p.profile_id),
    };
    const queryString = makeQueryString(args);
    const url = getHost('aoe2net') + `/api/player/matches?${queryString}`;
    console.log(url);
    const response = await fetch(url)
    let json = await response.json() as IMatchRaw[];
    // console.log("matches json", json);
    // console.log("matches json", json.filter(m => m.players.some(p => ![1,3,4,5].includes(p.slot_type))));

    // TODO: Temporary fix: Filter duplicate matches
    json = uniqBy(json, m => m.match_id);

    return json.map(match => convertTimestampsToDates(match));
}
