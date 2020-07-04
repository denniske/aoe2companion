import {fetchMatches, IFetchMatchesParams} from "../api/matches";
import {IMatch} from "../helper/data";
import {orderBy, uniqBy} from "lodash-es";

export async function fetchMatchesMulti(game: string, start: number, count: number, params: IFetchMatchesParams[]): Promise<IMatch[]> {
    console.log('fetchMatchesMulti', start, count);
    // await sleep(7000);

    let matchLists = await Promise.all(
        params.map(p => fetchMatches(game, start, count, p))
    );

    let matches = matchLists.flatMap(matches => matches);

    matches = uniqBy(matches, m => m.match_id);
    matches = orderBy(matches, m => m.started, 'desc');

    console.log("matches", matches);

    return matches;
}
