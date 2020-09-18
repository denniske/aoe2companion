import {IMatch, IMatchRaw, IRatingHistoryEntryRaw} from "../helper/data";
import {fromUnixTime} from "date-fns";
import {getHost} from "./host";
import {fetchJson} from "./util";


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
    const json = await fetchJson('fetchLastMatch', url);
    return convertTimestampsToDates(json.last_match);
}
