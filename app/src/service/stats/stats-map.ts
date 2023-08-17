
const a3 = 1;

// import {maps} from "../../helper/maps";
// import {AoeMap} from "@nex/data";
// import {IMatch, validMatch} from "@nex/data/api";
// import {orderBy} from 'lodash';
//
//
// export interface IParam {
//     matches?: IMatch[];
//     user: UserIdBase;
// }
//
// export interface IRow {
//     map: AoeMap;
//     games: number;
//     won: number;
// }
//
// export async function getStatsMap({matches, user}: IParam) {
//     let rows: IRow[] | null = null;
//     if (matches) {
//         const mapList = Object.keys(maps);
//         // console.log(matches);
//         rows = mapList.map((map: string) => {
//             const gamesWithMap = matches.filter(m => m.map_type === parseInt(map));
//             const validGamesWithMap = gamesWithMap.filter(validMatch);
//             const validGamesWithMapWon = validGamesWithMap.filter(m => m.players.filter(p =>
//                 p.won &&
//                 sameUser(p, user)
//             ).length > 0);
//             return ({
//                 map: parseInt(map) as AoeMap,
//                 games: gamesWithMap.length,
//                 won: validGamesWithMapWon.length / validGamesWithMap.length * 100,
//             });
//         });
//         rows = rows.filter(r => r.games > 0);
//         rows = orderBy(rows, r => r.games, 'desc');
//         // rows = orderBy(rows, [r => r.won], ['desc']);
//     }
//     return { rows, matchCount: matches?.length, user };
// }
