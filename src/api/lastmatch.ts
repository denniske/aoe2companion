import {IMatch, IMatchRaw} from "../helper/data";
import {fromUnixTime} from "date-fns";
import {getHost} from "./host";


function convertTimestampsToDates(json: IMatchRaw): IMatch {
    return {
        ...json,
        started: fromUnixTime(json.started),
        finished: fromUnixTime(json.finished),
        opened: fromUnixTime(json.opened),
    };
}

export async function fetchLastMatch(game: string, profile_id: string) {
    const url = getHost('aoe2net') + `api/player/lastmatch?game=${game}&profile_id=${profile_id}`;
    console.log(url);
    const response = await fetch(url);
    const json = await response.json();
    return convertTimestampsToDates(json.last_match);
}
