import {makeQueryString, sleep} from '../helper/util';
import {IMatch, IMatchRaw} from "../helper/data";

const fromUnixTime = require('date-fns/fromUnixTime');


function convertTimestampsToDates(json: IMatchRaw): IMatch {
    return {
        ...json,
        players: json.players.filter(p => p.profile_id != null || p.steam_id != null),
        started: json.started ? fromUnixTime(json.started) : null,
        finished: json.finished ? fromUnixTime(json.finished) : null,
        opened: json.opened ? fromUnixTime(json.opened) : null,
    };
}

export interface IFetchMatchesParams {
    steam_id?: string;
    profile_id?: number;
}


export async function fetchMatches(game: string, start: number, count: number, params: IFetchMatchesParams): Promise<IMatch[]> {
    console.log('fetchMatches', start, count);
    // await sleep(2000);

    const start2 = new Date();

    const queryString = makeQueryString({
        game,
        start,
        count,
        ...params,
    });
    const response = await fetch(`https://aoe2.net/api/player/matches?${queryString}`)
    const json = await response.json() as IMatchRaw[];

    const end = new Date();
    console.log((end.getTime() - start2.getTime())/1000);

    return json.map(match => convertTimestampsToDates(match));
}
