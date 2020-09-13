import fetch from "node-fetch";
import fs from "fs";

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export interface ILeaderboardPlayerRaw {
    clan: string;
    country: Flag;
    drops: number;
    games: number;
    highest_rating: number;
    highest_streak: number;
    icon: any;
    last_match: any;
    last_match_time: any;
    losses: number;
    lowest_streak: number;
    name: string;
    previous_rating: number;
    profile_id: number;
    rank: number;
    rating: number;
    steam_id: string;
    streak: number;
    wins: number;
}

import * as local00 from '../leaderboard-local-00.json'
import * as aoe200 from '../leaderboard-aoe2-00.json'
import * as local55 from '../leaderboard-local-55.json'
import * as aoe255 from '../leaderboard-aoe2-55.json'
import {Flag} from "../../src/helper/flags";


async function loadStrings(arr1: ILeaderboardPlayerRaw[], arr2: ILeaderboardPlayerRaw[]) {
    let equalCount = 0;
    let unequalCount = 0;

    const dict: any = {};
    for (let i = 0; i < arr2.length; i++) {
        dict[arr2[i].profile_id] = arr2[i].rating;
    }

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i].rating === dict[arr1[i].profile_id]) {
            equalCount++;
        } else {
            console.log(arr1[i].profile_id, arr1[i].name);
            break;
            unequalCount++;
        }
    }
    console.log(equalCount, ' / - ', unequalCount);
}

loadStrings(aoe200.leaderboard as any, local00.leaderboard as any);
loadStrings(aoe255.leaderboard as any, local55.leaderboard as any);











































//
// async function loadStrings() {
//     let equalCount = 0;
//     let unequalCount = 0;
//     console.log('aoe200.leaderboard.length', aoe200.leaderboard.length);
//     for (let i = 0; i < aoe200.leaderboard.length; i++) {
//         if (local00.leaderboard.length > i && aoe200.leaderboard[i].profile_id === local00.leaderboard[i].profile_id) {
//             equalCount++;
//         } else {
//             console.log(aoe200.leaderboard[i-1].profile_id, aoe200.leaderboard[i-1].name);
//             console.log(aoe200.leaderboard[i].profile_id, aoe200.leaderboard[i].name);
//             console.log(aoe200.leaderboard[i+1].profile_id, aoe200.leaderboard[i+1].name);
//             console.log(aoe200.leaderboard[i+2].profile_id, aoe200.leaderboard[i+2].name);
//             console.log(aoe200.leaderboard[i+3].profile_id, aoe200.leaderboard[i+3].name);
//             console.log(aoe200.leaderboard[i+4].profile_id, aoe200.leaderboard[i+4].name);
//             break;
//             unequalCount++;
//         }
//     }
//     console.log(equalCount, ' / - ', unequalCount);
// }
//
// loadStrings();
//
//
// async function loadStrings2() {
//     let equalCount = 0;
//     let unequalCount = 0;
//     console.log('aoe255.leaderboard.length', aoe255.leaderboard.length);
//     for (let i = 0; i < aoe255.leaderboard.length; i++) {
//         if (local55.leaderboard.length > i && aoe255.leaderboard[i].profile_id === local55.leaderboard[i].profile_id) {
//             equalCount++;
//         } else {
//             console.log(aoe200.leaderboard[i-1].profile_id, aoe200.leaderboard[i-1].name);
//             console.log(aoe200.leaderboard[i].profile_id, aoe200.leaderboard[i].name);
//             break;
//             unequalCount++;
//         }
//     }
//     console.log(equalCount, ' / - ', unequalCount);
// }
//
// loadStrings2();
//
