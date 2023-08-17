import {fetchLeaderboardLegacy} from '../api/leaderboard';
import {sortBy, sumBy} from 'lodash';
import {IProfile} from '../view/components/profile';
import {minifyUserId, UserIdBase} from '../helper/user';
import {IMatchesResponse, IProfileResponse, IRatingHistoryEntry, IRatingHistoryEntryRaw} from '@nex/data/api';
import {parseISO} from "date-fns";
import {IRatingHistoryRow} from './rating';
import {appConfig} from "@nex/dataset";
import {dateReviver, getHost, makeQueryString} from "@nex/data";
import {fetchJson2} from "../api/util";
import {Aoe4WorldProfile} from "../../../data/src/api/api4.types";
import {camelizeKeys} from "humps";

// const aoe4WorldLeaderboardMap = {
//     'custom': 0,
//     'qm_1v1': 17,
//     'qm_2v2': 18,
//     'qm_3v3': 19,
//     'qm_4v4': 20,
//     'rm_1v1': 1001,
//     'rm_solo': 1002,
//     'rm_team': 1003,
//     'rm_1v1_elo': 1010,
//     'rm_2v2_elo': 1011,
//     'rm_3v3_elo': 1012,
//     'rm_4v4_elo': 1013,
// };
//
// export async function loadProfileLegacy4(userId: UserIdBase): Promise<any | null> {
//     const url = `https://aoe4world.com/api/v0/players/${userId.profile_id}`;
//     const json = await fetchJson('loadProfileLegacy4', url) as Aoe4WorldProfile;
//
//     if (json?.modes == null) {
//         return null;
//     } else {
//         // rm_1v1 is is just an outdated alias to the new rm_solo.
//         delete json.modes.rm_1v1;
//     }
//
//     const h: IProfile = {
//         clan: '',
//         country: '' as any,
//         icon: '',
//         name: json.name,
//         profile_id: json.profile_id,
//         steam_id: json.steam_id,
//         games: sumBy(Object.values(json.modes), m => m.games_count),
//         drops: sumBy(Object.values(json.modes), m => m.drops_count),
//         leaderboards: Object.entries(json.modes)
//             .filter(([modeKey, mode]) => mode.games_count > 0)
//             .map(([modeKey, mode]) => ({
//             leaderboard: [{
//                 profile_id: json.profile_id,
//                 steam_id: json.steam_id,
//                 games: mode.games_count,
//                 wins: mode.wins_count,
//                 drops: mode.drops_count,
//                 rank: mode.rank,
//                 rating: mode.rating,
//                 streak: mode.streak,
//                 // previous_rating: 100,
//             }],
//             leaderboard_id: aoe4WorldLeaderboardMap[modeKey],
//             count: 0,
//             length: 0,
//             start: 0,
//             total: 0,
//         })),
//     };
//     console.log('h', h);
//     return  h;
// }

// export async function loadProfileLegacy(game: string, userId: UserIdBase): Promise<any | null> {
//     if (appConfig.game == 'aoe4') return loadProfileLegacy4(userId);
//     // console.log("loading profile", game, composeUserId(userId));
//
//     // console.time('=> loadProfile');
//
//     let leaderboards = await Promise.all(
//         appConfig.leaderboards.map(leaderbard => fetchLeaderboardLegacy(game, leaderbard.id, {count: 1, ...minifyUserId(userId)}))
//     );
//
//     const leaderboardInfos = leaderboards.flatMap(l => l.leaderboard);
//     const sortedLeaderboardInfos = sortBy(leaderboardInfos, l => l.last_match);
//     const mostRecentLeaderboard = sortedLeaderboardInfos[0];
//
//     if (sortedLeaderboardInfos?.length === 0) {
//         return null;
//     }
//
//     // console.timeEnd('=> loadProfile');
//
//     const h: IProfile = {
//         clan: mostRecentLeaderboard.clan,
//         country: mostRecentLeaderboard.country,
//         icon: mostRecentLeaderboard.icon,
//         name: mostRecentLeaderboard.name,
//         profile_id: mostRecentLeaderboard.profile_id,
//         steam_id: mostRecentLeaderboard.steam_id,
//         games: sumBy(leaderboardInfos, l => l.games),
//         drops: sumBy(leaderboardInfos, l => l.drops),
//         leaderboards: leaderboards.filter(l => l.leaderboard?.length > 0),
//     };
//     return  h;
// }


export async function loadProfile(userId: UserIdBase): Promise<IProfileResponse | null> {
    if (userId.profileId == null) return null;

    const url = getHost('aoe2companion-data') + `api/profiles/${userId.profileId}`;
    let json = camelizeKeys(await fetchJson2('loadProfile', url, undefined, dateReviver)) as IProfileResponse;

    // console.log('=========> RESPONSE <==========');
    // console.log(json);

    return json;

}
