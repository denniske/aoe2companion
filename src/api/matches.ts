const fromUnixTime = require('date-fns/fromUnixTime');


function convertTimestampsToDates(json: IMatchRaw): IMatch {
    return {
        ...json,
        started: json.started ? fromUnixTime(json.started) : null,
        finished: json.finished ? fromUnixTime(json.finished) : null,
        opened: json.opened ? fromUnixTime(json.opened) : null,
    };
}


export async function fetchMatches(game: string, profile_id: string, start: number, count: number) {
    const response = await fetch(`https://aoe2.net/api/player/matches?game=${game}&profile_id=${profile_id}&start=${start}&count=${count}`)
    const json = await response.json() as IMatchRaw[];
    console.log("response.json()", json);

    return json.map(match => convertTimestampsToDates(match));
}
