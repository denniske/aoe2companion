import { makeQueryString } from '../helper/util';

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
    const queryString = makeQueryString({
        game,
        start,
        count,
        ...params,
    });
    const response = await fetch(`https://aoe2.net/api/player/matches?${queryString}`)
    const json = await response.json() as IMatchRaw[];
    console.log("response.json()", json);

    return json.map(match => convertTimestampsToDates(match));
}
