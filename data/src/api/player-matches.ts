import {fromUnixTime, getUnixTime, parseISO} from "date-fns";
import {uniqBy} from "lodash";
import request, {gql} from "graphql-request";
import {makeQueryString} from '../lib/util';
import {getHost} from '../lib/host';
import {IMatch, IMatchRaw} from './api.types';
import {fetchJson} from '../lib/fetch-json';
import fetch from 'node-fetch';


function convertTimestampsToDates(json: IMatchRaw): IMatch {
    return {
        ...json,
        players: json.players,
        started: json.started ? fromUnixTime(json.started) : undefined,
        finished: json.finished ? fromUnixTime(json.finished) : undefined,
        opened: json.opened ? fromUnixTime(json.opened) : undefined,
    };
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

    const url = getHost('aoe2net') + `api/match?${queryString}`;
    console.log(url);
    const json = await fetchJson('fetchMatch', url);
    return convertTimestampsToDates(json);
}



export async function triggerMatchRefetch(match_uuid: string, match_id: string): Promise<any> {
    const url = getHost('aoe2companion-api') + `match/refetch`;

    const data = {
        match_uuid,
        match_id,
    };

    return await fetchJson('triggerMatchRefetch', url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });
}

export async function setMatchChecked(match_uuid: string, match_id: string): Promise<any> {
    const url = getHost('aoe2companion-api') + `match/checked`;

    const data = {
        match_uuid,
        match_id,
    };

    return await fetchJson('setMatchChecked', url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });
}



export async function fetchPlayerMatchesLegacy(game: string, start: number, count: number, params: IFetchMatchesParams[]): Promise<IMatch[]> {
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
    const url = getHost('aoe2net') + `api/player/matches?${queryString}`;
    let json = await fetchJson('fetchPlayerMatches', url) as IMatchRaw[];

    // TODO: Temporary fix: Filter duplicate matches
    json = uniqBy(json, m => m.match_id);

    // TODO: Fix for new civ order after Lords of the West
    const releaseDate = 1611680400; // 01/26/2021 @ 5:00pm (UTC)
    json.filter(match => match.started < releaseDate).forEach(match => {
        match.players.forEach(player => {
            if (player.civ >= 4) player.civ++;
            if (player.civ >= 29) player.civ++;
        })
    });

    return json.map(match => convertTimestampsToDates(match));
}

function convertTimestampsToDates2(json: IMatchRaw): IMatch {
    return {
        ...json,
        players: json.players,
        started: json.started ? parseISO(json.started) : undefined,
        finished: json.finished ? parseISO(json.finished) : undefined,
        opened: json.opened ? parseISO(json.opened) : undefined,
        checked: json.checked ? parseISO(json.checked) : undefined,
    };
}

export interface IFetchMatchesParams {
    steam_id?: string;
    profile_id?: number;
}


function myfetch(input: any, init?: any) {
    try {
        return fetch(input, init);
    } catch (e) {
        throw e;
    }
}

export async function fetchPlayerMatchesNew(game: string, start: number, count: number, params: IFetchMatchesParams[], ongoing: boolean = false): Promise<IMatch[]> {
    try {
        if (params.length === 0) {
            return [];
        }
        const args = {
            game,
            start,
            count,
            ongoing,
            profile_ids: params.map(p => p.profile_id),
        };
        const queryString = makeQueryString(args);

        const endpoint = getHost('aoe2companion-graphql');
        const query = gql`
            query H2($start: Int!, $count: Int!, $ongoing: Boolean!, $profile_ids: [Int!]) {
                matches(
                    start: $start,
                    count: $count,
                    ongoing: $ongoing,
                    profile_ids: $profile_ids
                ) {
                    total
                    matches {
                        match_id
                        leaderboard_id
                        name
                        map_type
                        speed
                        num_players
                        started
                        finished
                        checked
                        players {
                            profile_id
                            steam_id
                            name
                            country
                            rating
                            civ
                            slot
                            slot_type
                            color
                            won
                            team
                        }
                    }
                }
            }
        `;

        const timeLastDate = new Date();
        const variables = {start, count, profile_ids: params.map(p => p.profile_id), ongoing};
        console.groupCollapsed('fetchPlayerMatches - matches()');
        console.log(query);
        console.groupEnd();
        console.log(variables);
        // const graphQLClient = new GraphQLClient(endpoint, { fetch: myfetch })
        const data = await request(endpoint, query, variables)
        console.log('gql', new Date().getTime() - timeLastDate.getTime());

        let json = data.matches.matches as IMatchRaw[];
        // console.log(json);
        // let json2 = await fetchJson('fetchPlayerMatches', url) as IMatchRaw[];
        // console.log(json2);

        // TODO: Temporary fix: Filter duplicate matches
        json = uniqBy(json, m => m.match_id);

        // TODO: Fix for new civ order after Lords of the West
        const releaseDate = 1611680400; // 01/26/2021 @ 5:00pm (UTC)
        json.filter(match => getUnixTime(parseISO(match.started)) < releaseDate).forEach(match => {
            match.players.forEach(player => {
                if (player.civ >= 4) player.civ++;
                if (player.civ >= 29) player.civ++;
            })
        });

        return json.map(match => convertTimestampsToDates2(match));
    } catch (e) {
        console.log('ERROR', e);
    }
    return [];
}

export async function fetchPlayerMatches(game: string, start: number, count: number, params: IFetchMatchesParams[]): Promise<IMatch[]> {
    let [newResult, legacyResult] = await Promise.all([
        fetchPlayerMatchesNew(game, start, count, params),
        fetchPlayerMatchesLegacy(game, start, count, params),
    ]);

    console.log('newResult', newResult);
    console.log('legacyResult', legacyResult);

    // Compare winners

    // legacyResult.filter((l, i) => i >= 0 && i < 15).forEach(legacyMatch => {
    //     let same = true;
    //     const newMatch = newResult.find(m => m.match_id == legacyMatch.match_id);
    //     const diff = {} as any;
    //     if (newMatch) {
    //         legacyMatch.players.forEach(legacyPlayer => {
    //             const newPlayer = newMatch.players.find(p => p.slot === legacyPlayer.slot);
    //             if (newPlayer) {
    //                 if (legacyPlayer.won !== newPlayer.won) {
    //                     same = false;
    //                 }
    //                 diff[legacyPlayer.name] = legacyPlayer.won + ' - ' + newPlayer.won;
    //             }
    //         });
    //     }
    //     if (newMatch && same) {
    //         console.log('same    ', getMapName(legacyMatch.map_type), '-', legacyMatch.match_id);
    //         return;
    //     }
    //     if (newMatch && legacyMatch.players.filter(p => p.won == null).length == legacyMatch.players.length) {
    //         console.log('fixed', getMapName(legacyMatch.map_type), '-', legacyMatch.match_id);
    //         return;
    //     } if (newMatch && !same) {
    //         console.log('mismatch', getMapName(legacyMatch.map_type), '-', legacyMatch.match_id);
    //         console.log(diff);
    //         return;
    //     }
    //     if (!newMatch) {
    //         console.log('nomatch', getMapName(legacyMatch.map_type), '-', legacyMatch.match_id);
    //         return;
    //     }
    // })

    // console.log(legacyResult.filter(m => m.game_type === 12));
    // legacyResult = legacyResult.filter(m => m.game_type === 12);

    legacyResult.forEach(legacyMatch => {
        legacyMatch.source = 'aoe2net';

        // Set replayed
        // if (Platform.OS === 'web') {
        //     const newMatch = newResult.find(m => m.match_id == legacyMatch.match_id);
        //     if (newMatch) {
        //         legacyMatch.replayed = newMatch.replayed;
        //     }
        // }

        // Any civ missing
        if (legacyMatch.players.filter(p => p.civ == null).length > 0) {
            const newMatch = newResult.find(m => m.match_id == legacyMatch.match_id);
            if (newMatch) {
                legacyMatch.players.forEach(legacyPlayer => {
                    const newPlayer = newMatch.players.find(p => p.slot === legacyPlayer.slot);
                    if (newPlayer) {
                        legacyPlayer.civ = newPlayer.civ;
                    }
                });
                legacyMatch.source += ' civ';
            }
        }
        // All won missing
        if (legacyMatch.players.filter(p => p.won == null).length == legacyMatch.players.length) {
            const newMatch = newResult.find(m => m.match_id == legacyMatch.match_id);
            if (newMatch) {
                legacyMatch.players.forEach(legacyPlayer => {
                    const newPlayer = newMatch.players.find(p => p.slot === legacyPlayer.slot);
                    if (newPlayer) {
                        legacyPlayer.won = newPlayer.won;
                    }
                });
                legacyMatch.source += ' won';
            }
        }
    });

    // console.log('match_ids', JSON.stringify(legacyResult.map(m => m.match_id)).replace(/"/g, '\''));

    // return newResult;
    return legacyResult;
}








