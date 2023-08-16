import {addSeconds, fromUnixTime, getUnixTime, parseISO} from "date-fns";
import {flatMap, uniqBy} from 'lodash';
// import request, {gql} from "graphql-request";
import {makeQueryString} from '../lib/util';
import {getHost} from '../lib/host';
import {IMatch, IMatchRaw, IPlayer, SlotType} from './api.types';
import {fetchJson} from '../lib/fetch-json';
import {appConfig} from "@nex/dataset";
import {Aoe4WorldGame, IAoe4WorldPlayerMatches} from "./api4.types";
import {getAllStrings, getString} from "../lib/aoe-data";
import {loadMatchCacheEntry, saveMatchCacheEntry, tidyMatchCache} from "../../../app/src/service/match-cache";


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
        game: appConfig.game,
        ...params,
    };
    const queryString = makeQueryString(query);

    const url = getHost('aoe2net') + `api/match?${queryString}`;
    console.log(url);
    const json = await fetchJson('fetchMatch', url);

    // Map new aoe2net civs to game civs
    json.players.forEach(player => {
        player.civ = player.civ_alpha;
    })

    return convertTimestampsToDates(json);
}

export async function fetchMatchWithFallback(game: string, params: IFetchMatchParams): Promise<IMatchRaw> {
    return await fetchMatch(game, params);
    // try {
    //     return await fetchMatchNew(game, params);
    // } catch (e) {
    //     return await fetchMatch(game, params);
    // }
}

// export async function fetchMatchNew(game: string, params: IFetchMatchParams): Promise<IMatchRaw> {
//     try {
//         const endpoint = getHost('aoe2companion-graphql');
//         const query = gql`
//             query H2($match_id: String, $match_uuid: String) {
//                 match(
//                     match_id: $match_id,
//                     match_uuid: $match_uuid,
//                 ) {
//                     match_id
//                     leaderboard_id
//                     name
//                     map_type
//                     speed
//                     num_players
//                     started
//                     finished
//                     checked
//                     players {
//                         profile_id
//                         steam_id
//                         name
//                         country
//                         rating
//                         civ
//                         slot
//                         slot_type
//                         color
//                         won
//                         team
//                         wins
//                         games
//                     }
//                 }
//             }
//         `;
//
//         const timeLastDate = new Date();
//         const variables = {...params};
//         console.groupCollapsed('fetchMatch - match()');
//         console.log(query);
//         console.groupEnd();
//         console.log(variables);
//         const data = await request(endpoint, query, variables)
//         console.log('gql', new Date().getTime() - timeLastDate.getTime());
//
//         let json = data.match as IMatchRaw;
//
//         return convertTimestampsToDates2(json);
//     } catch (e) {
//         console.log('ERROR', e);
//     }
//     return null;
// }


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

// Probably wrong do not use this
// aoe2net civs: [null, "Britons", "Franks", "Goths", "Teutons", "Japanese", "Chinese", "Byzantines", "Persians", "Saracens", "Turks", "Vikings", "Mongols", "Celts", "Spanish", "Aztecs", "Mayans", "Huns", "Koreans", "Italians", "Indians", "Incas", "Magyars", "Slavs", "Portuguese", "Ethiopians", "Malians", "Berbers", "Khmer", "Malay", "Burmese", "Vietnamese", "Bulgarians", "Tatars", "Cumans", "Lithuanians", "Burgundians", "Sicilians", "Poles", "Bohemians"]
// game civs: ["Aztecs", "Berbers", "Bohemians", "Britons", "Bulgarians", "Burgundians", "Burmese", "Byzantines", "Celts", "Chinese", "Cumans", "Ethiopians", "Franks", "Goths", "Huns", "Incas", "Indians", "Italians", "Japanese", "Khmer", "Koreans", "Lithuanians", "Magyars", "Malay", "Malians", "Mayans", "Mongols", "Persians", "Poles", "Portuguese", "Saracens", "Sicilians", "Slavs", "Spanish", "Tatars", "Teutons", "Turks", "Vietnamese", "Vikings"]
// const civMapping = [-1, 3, 12, 13, 35, 18, 9, 7, 27, 30, 36, 38, 26, 8, 33, 0, 25, 14, 20, 17, 16, 15, 22, 32, 29, 11, 24, 1, 19, 23, 6, 37, 4, 34, 10, 21, 5, 31, 28, 2];
//
// function mapCiv(civ: number) {
//     return civMapping[civ];
// }

const aoe4WorldCivMap = {
    'abbasid_dynasty': 0,
    'chinese': 1,
    'delhi_sultanate': 2,
    'english': 3,
    'french': 4,
    'holy_roman_empire': 5,
    'mongols': 6,
    'rus': 7,
    'malians': 8,
    'ottomans': 9,
};

const aoe4WorldLeaderboardMap = {
    'custom': 0,
    'rm_1v1_elo': 17,
    'rm_2v2_elo': 18,
    'rm_3v3_elo': 19,
    'rm_4v4_elo': 20,
    'rm_1v1': 1001,
    'rm_solo': 1002,
    'rm_team': 1003,
};

function aoe4worldMatchToAoe2NetMatch(match4: Aoe4WorldGame) {
    const players = flatMap(match4.teams, (team, i) => {
        return team.map(p => ({
            team: i,
            won: p.player.result === 'win',
            civ: aoe4WorldCivMap[p.player.civilization],
            profile_id: p.player.profile_id,
            name: p.player.name,
            rating: p.player.rating,
            rating_change: p.player.rating_diff,
            slot_type: 1,
        }))
    });
    return {
        match_id: match4.game_id.toString(),
        server: match4.server,
        started: parseISO(match4.started_at),
        finished: addSeconds(parseISO(match4.started_at), match4.duration),
        map_type: getAllStrings('map_type')?.find(s => s.string.replace(/\s+/g, '') == match4.map.replace(/\s+/g, ''))?.id as any ?? (console.log('map_type not found', match4.map)),
        leaderboard_id: aoe4WorldLeaderboardMap[match4.leaderboard],
        players,
        num_players: players.length,

        average_rating: undefined,
        cheats: false,
        ending_age: 0,
        expansion: undefined,
        full_tech_tree: false,
        game_type: undefined,
        has_custom_content: undefined,
        has_password: false,
        lobby_id: undefined,
        lock_speed: false,
        lock_teams: false,
        map_size: 0,
        match_uuid: "",
        name: "",
        num_slots: 0,
        pop: 0,
        ranked: false,
        rating_type: undefined,
        rating_type_id: undefined,
        resources: undefined,
        rms: undefined,
        scenario: undefined,
        shared_exploration: false,
        speed: 0,
        starting_age: 0,
        team_positions: false,
        team_together: false,
        treaty_length: undefined,
        turbo: false,
        version: "",
        victory: undefined,
        victory_time: undefined,
        visibility: undefined
    } as IMatch;
}



export async function fetchPlayerMatchesLegacy4(game: string, start: number, count: number, params: IFetchMatchesParams[]): Promise<IMatch[]> {
    const profileId = params[0].profile_id;
    let newMatches = [];
    await tidyMatchCache();
    let cachedMatches = await loadMatchCacheEntry(profileId);
    let since = cachedMatches.length > 0 ? cachedMatches[0].started_at : new Date(2000, 0, 1);
    let args: any = {
        since,
    };
    const queryString = makeQueryString(args);
    const url = getHost('aoe4world') + `players/${profileId}/games?${queryString}`;
    let json = await fetchJson('fetchPlayerMatchesLegacy4Single', url) as IAoe4WorldPlayerMatches;
    newMatches.push(...json.games);

    const pages = Math.ceil(json.total_count / json.per_page);
    for (let page = 2; page <= Math.min(20, pages); page++) {
        args = {
            since,
            page,
        };
        const queryString = makeQueryString(args);
        const url = getHost('aoe4world') + `players/${profileId}/games?${queryString}`;
        let json = await fetchJson('fetchPlayerMatchesLegacy4Single', url) as IAoe4WorldPlayerMatches;
        newMatches.push(...json.games);
    }

    const matches = [...newMatches, ...cachedMatches];

    await saveMatchCacheEntry(profileId, matches);

    return matches.map(aoe4worldMatchToAoe2NetMatch);
}

export async function fetchPlayerMatchesLegacyMultiple4(game: string, start: number, count: number, params: IFetchMatchesParams[]): Promise<IMatch[]> {
    if (params.length === 0) {
        return [];
    }

    let newMatches = [];

    let args: any = {
        profile_ids: params.map(p => p.profile_id),
    };
    const queryString = makeQueryString(args);
    const url = getHost('aoe4world') + `games?${queryString}`;
    let json = await fetchJson('fetchPlayerMatchesLegacy4Single', url) as IAoe4WorldPlayerMatches;
    newMatches.push(...json.games);

    console.log('count', count);

    const pages = Math.ceil(count / json.per_page);
    for (let page = 2; page <= pages; page++) {
        args = {
            page,
            profile_ids: params.map(p => p.profile_id),
        };
        const queryString = makeQueryString(args);
        const url = getHost('aoe4world') + `games?${queryString}`;
        let json = await fetchJson('fetchPlayerMatchesLegacy4Single', url) as IAoe4WorldPlayerMatches;
        newMatches.push(...json.games);
        if (json.games.length < json.per_page) break;
    }

    const matches = [...newMatches];
    return matches.map(aoe4worldMatchToAoe2NetMatch);
}

export async function fetchPlayerMatchesLegacy(game: string, start: number, count: number, params: IFetchMatchesParams[]): Promise<IMatch[]> {
    if (params.length === 0) {
        return [];
    }
    const args = {
        game: appConfig.game,
        start,
        count,
        profile_ids: params.map(p => p.profile_id),
        // profile_ids: [params.map(p => p.profile_id), 209525],
    };
    const queryString = makeQueryString(args);
    const url = getHost('aoe2net') + `api/player/matches?${queryString}`;
    let json = await fetchJson('fetchPlayerMatches', url) as IMatchRaw[];

    // HACK: Filter duplicate matches
    // json = uniqBy(json, m => m.match_id);

    // Map new aoe2net civs to game civs
    // if (appConfig.game === 'aoe2de') {
    //     json.forEach(match => {
    //         match.players.forEach(player => {
    //             player.civ = player.civ_alpha;
    //         })
    //     });
    // }

    if (appConfig.game === 'aoe4') {
        json.forEach(match => {
            if (match.leaderboard_id == null) {
                if (match.num_players == 2) match.leaderboard_id = 17;
                if (match.num_players == 4) match.leaderboard_id = 18;
                if (match.num_players == 6) match.leaderboard_id = 19;
                if (match.num_players == 8) match.leaderboard_id = 20;
            }
            if (match.leaderboard_id == 17 && match.rating_type_id == 32) {
                match.leaderboard_id = 1001;
            }
            match.players.forEach(player => {
                player.color = player.color || player.slot;
            })
        });
    }

    // if (appConfig.game === 'aoe2de') {
    //     // HACK: Fix new civ order after Lords of the West
    //     const releaseDateLoW = 1611680400; // 26.01.2021 @ 5:00pm (UTC)
    //     json.filter(match => match.started < releaseDateLoW).forEach(match => {
    //         match.players.forEach(player => {
    //             if (player.civ >= 4) player.civ++;
    //             if (player.civ >= 29) player.civ++;
    //         })
    //     });
    //
    //     // HACK: Fix new civ order after Dawn of the Dukes
    //     const releaseDateDoD = 1628611200; // 10.08.2021 @ 5:00pm (UTC)
    //     json.filter(match => match.started < releaseDateDoD).forEach(match => {
    //         match.players.forEach(player => {
    //             if (player.civ >= 2) player.civ++;
    //             if (player.civ >= 28) player.civ++;
    //         })
    //     });
    //
    //     // HACK: Fix new civ order after Dynasties of India
    //     const releaseDateDoI = 1651158000; // 28.04.2022 @ 5:00pm (UTC)
    //     json.filter(match => match.started < releaseDateDoI).forEach(match => {
    //         match.players.forEach(player => {
    //             if (player.civ >= 1) player.civ++;
    //             if (player.civ >= 12) player.civ++;
    //             if (player.civ >= 16) player.civ++;
    //             if (player.civ == 19) player.civ = 42;
    //         })
    //     });
    // }

    // console.log(json.map(match => convertTimestampsToDates(match)));

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


// function myfetch(input: any, init?: any) {
//     try {
//         return fetch(input, init);
//     } catch (e) {
//         throw e;
//     }
// }

export async function fetchPlayerMatchesNew(game: string, start: number, count: number, params: IFetchMatchesParams[], ongoing: boolean = false): Promise<IMatch[]> {
    // try {
    //     if (params.length === 0) {
    //         return [];
    //     }
    //     const endpoint = getHost('aoe2companion-graphql');
    //     const query = gql`
    //         query H2($start: Int!, $count: Int!, $ongoing: Boolean!, $profile_ids: [Int!]) {
    //             matches(
    //                 start: $start,
    //                 count: $count,
    //                 ongoing: $ongoing,
    //                 profile_ids: $profile_ids
    //             ) {
    //                 total
    //                 matches {
    //                     match_id
    //                     leaderboard_id
    //                     name
    //                     map_type
    //                     speed
    //                     num_players
    //                     started
    //                     finished
    //                     checked
    //                     players {
    //                         profile_id
    //                         steam_id
    //                         name
    //                         country
    //                         rating
    //                         civ
    //                         slot
    //                         slot_type
    //                         color
    //                         won
    //                         team
    //                     }
    //                 }
    //             }
    //         }
    //     `;
    //
    //     const timeLastDate = new Date();
    //     const variables = {start, count, profile_ids: params.map(p => p.profile_id), ongoing};
    //     // console.groupCollapsed('fetchPlayerMatches - matches()');
    //     // console.log(query);
    //     // console.groupEnd();
    //     // console.log(variables);
    //     // const graphQLClient = new GraphQLClient(endpoint, { fetch: myfetch })
    //     const data = await request(endpoint, query, variables)
    //     // console.log('gql', new Date().getTime() - timeLastDate.getTime());
    //
    //     let json = data.matches.matches as IMatchRaw[];
    //     // console.log(json);
    //     // let json2 = await fetchJson('fetchPlayerMatches', url) as IMatchRaw[];
    //     // console.log(json2);
    //
    //     // HACK: Filter duplicate matches
    //     json = uniqBy(json, m => m.match_id);
    //
    //     // Todo: Fix this according to new aoe2net civs
    //     // Todo: Not so important at the moment since the civ info from new api is not used.
    //
    //     // HACK: Fix new civ order after Lords of the West
    //     const releaseDateLoW = 1611680400; // 01/26/2021 @ 5:00pm (UTC)
    //     json.filter(match => getUnixTime(parseISO(match.started)) < releaseDateLoW).forEach(match => {
    //         match.players.forEach(player => {
    //             if (player.civ >= 4) player.civ++;
    //             if (player.civ >= 29) player.civ++;
    //         })
    //     });
    //
    //     // HACK: Fix new civ order after Dawn of the Dukes
    //     const releaseDateDoD = 1628611200; // 10/08/2021 @ 5:00pm (UTC)
    //     json.filter(match => getUnixTime(parseISO(match.started)) < releaseDateDoD).forEach(match => {
    //         match.players.forEach(player => {
    //             if (player.civ >= 2) player.civ++;
    //             if (player.civ >= 28) player.civ++;
    //         })
    //     });
    //
    //     return json.map(match => convertTimestampsToDates2(match));
    // } catch (e) {
    //     console.log('ERROR', e);
    // }
    return [];
}

export async function fetchPlayerMatchesMultiple(game: string, start: number, count: number, params: IFetchMatchesParams[]): Promise<IMatch[]> {
    if (appConfig.game == 'aoe4') return await fetchPlayerMatchesLegacyMultiple4(game, start, count, params);
    return await fetchPlayerMatchesLegacy(game, start, count, params);
}

export async function fetchPlayerMatches(game: string, start: number, count: number, params: IFetchMatchesParams[]): Promise<IMatch[]> {
    if (appConfig.game == 'aoe4') return await fetchPlayerMatchesLegacy4(game, start, count, params);
    return await fetchPlayerMatchesLegacy(game, start, count, params);

    // let [newResult, legacyResult] = await Promise.all([
    //     fetchPlayerMatchesNew(game, start, count, params),
    //     fetchPlayerMatchesLegacy(game, start, count, params),
    // ]);

    // console.log('newResult', newResult);
    // console.log('legacyResult', legacyResult);
    // console.log('legacyResult0', legacyResult[0]);

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

    // legacyResult.forEach(legacyMatch => {
    //     legacyMatch.source = 'aoe2net';
    //
    //     // Set replayed
    //     // if (Platform.OS === 'web') {
    //     //     const newMatch = newResult.find(m => m.match_id == legacyMatch.match_id);
    //     //     if (newMatch) {
    //     //         legacyMatch.replayed = newMatch.replayed;
    //     //     }
    //     // }
    //
    //     // Cannot do this at the moment because civs in DB do not match aoe2net civs anymore since 11.08.2021
    //     // Any civ missing
    //     // if (legacyMatch.players.filter(p => p.civ == null).length > 0) {
    //     //     const newMatch = newResult.find(m => m.match_id == legacyMatch.match_id);
    //     //     if (newMatch) {
    //     //         legacyMatch.players.forEach(legacyPlayer => {
    //     //             const newPlayer = newMatch.players.find(p => p.slot === legacyPlayer.slot);
    //     //             if (newPlayer) {
    //     //                 legacyPlayer.civ = newPlayer.civ;
    //     //             }
    //     //         });
    //     //         legacyMatch.source += ' civ';
    //     //     }
    //     // }
    //
    //     // All won missing
    //     if (legacyMatch.players.filter(p => p.won == null).length == legacyMatch.players.length) {
    //         const newMatch = newResult.find(m => m.match_id == legacyMatch.match_id);
    //         if (newMatch) {
    //             legacyMatch.players.forEach(legacyPlayer => {
    //                 const newPlayer = newMatch.players.find(p => p.slot === legacyPlayer.slot);
    //                 if (newPlayer) {
    //                     legacyPlayer.won = newPlayer.won;
    //                 }
    //             });
    //             legacyMatch.source += ' won';
    //         }
    //     }
    // });
    //
    // // console.log('match_ids', JSON.stringify(legacyResult.map(m => m.match_id)).replace(/"/g, '\''));
    //
    // // return newResult;
    // return legacyResult;
}








