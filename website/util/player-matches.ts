import {fromUnixTime} from "date-fns";
import {IMatch, IMatchRaw} from "./api.types";


interface IParams {
  [key: string]: any;
}

export function makeQueryString(params: IParams) {
  return Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');
}

export async function fetchJson(title: string, input: RequestInfo, init?: RequestInit) {
  if (init) {
    console.log(input, init);
  } else {
    console.log(input);
  }
  let response = null;
  try {
    response = await fetch(input, init);
    return await response.json();
  } catch (e) {
    console.log(input, 'failed', response?.status);
  }
}

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
  const url = 'https://powerful-gorge-32054.herokuapp.com/http://aoe2.net/' + `api/player/matches?${queryString}`;
  let json = await fetchJson('fetchPlayerMatches', url) as IMatchRaw[];

  // json = json.filter(m => m.leaderboard_id === 0);

  // TODO: Temporary fix: Filter duplicate matches
  // json = uniqBy(json, m => m.match_id);

  return json.map(match => convertTimestampsToDates(match));
}

export interface IFetchMatchParams {
  match_id?: string;
  uuid?: string;
}

export async function fetchMatch(game: string, params: IFetchMatchParams): Promise<IMatchRaw> {
  let query: any = {
    game,
    ...params,
  };
  const queryString = makeQueryString(query);

  const url = `http://aoe2.net/api/match?${queryString}`;
  console.log(url);
  const response = await fetch(url);
  try {
    const text = await response.text();
    // console.log(text);
    return JSON.parse(text);
    // return await response.json();
  } catch (e) {
    console.log("FAILED", url);
    throw e;
  }
}