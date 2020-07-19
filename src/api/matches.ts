import {makeQueryString, sleep} from '../helper/util';
import {IMatch, IMatchRaw} from "../helper/data";
import {fromUnixTime} from "date-fns";


function convertTimestampsToDates(json: IMatchRaw): IMatch {
    return {
        ...json,
        players: json.players.filter(p => p.profile_id != null || p.steam_id != null),
        started: json.started ? fromUnixTime(json.started) : undefined,
        finished: json.finished ? fromUnixTime(json.finished) : undefined,
        opened: json.opened ? fromUnixTime(json.opened) : undefined,
    };
}

export interface IFetchMatchesParams {
    steam_id?: string;
    profile_id?: number;
}


export async function fetchMatches(game: string, start: number, count: number, params: IFetchMatchesParams): Promise<IMatch[]> {
    // console.log('fetchMatches', start, count);
    // await sleep(7000);

    const start2 = new Date();

    const queryString = makeQueryString({
        game,
        start,
        count,
        ...params,
    });
    const url = `https://aoe2.net/api/player/matches?${queryString}`;
    console.log(url);
    const response = await fetch(url)
    const json = await response.json() as IMatchRaw[];

    const end = new Date();
    // console.log((end.getTime() - start2.getTime())/1000);

    // console.log("matches json", json);
    return json.map(match => convertTimestampsToDates(match));
}
