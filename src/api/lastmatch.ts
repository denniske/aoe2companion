import {IMatch, IMatchRaw} from "../helper/data";
import {fromUnixTime} from "date-fns";


function convertTimestampsToDates(json: IMatchRaw): IMatch {
    return {
        ...json,
        started: fromUnixTime(json.started),
        finished: fromUnixTime(json.finished),
        opened: fromUnixTime(json.opened),
    };
}

export async function fetchLastMatch(game: string, profile_id: string) {
    const response = await fetch(`https://powerful-gorge-32054.herokuapp.com/http://aoe2.net/api/player/lastmatch?game=${game}&profile_id=${profile_id}`)
    const json = await response.json();
    return convertTimestampsToDates(json.last_match);
}
