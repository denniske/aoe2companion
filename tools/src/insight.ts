import axios from "axios"
import * as fs from "fs"
import * as path from "path"
import { JSDOM } from 'jsdom';
import * as console from 'node:console';

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}


export const enumCivMappingTheLastKhans = {
    0: 'aztecs',
    1: 'berbers',
    2: 'britons',
    3: 'bulgarians',
    4: 'burmese',
    5: 'byzantines',
    6: 'celts',
    7: 'chinese',
    8: 'cumans',
    9: 'ethiopians',
    10: 'franks',
    11: 'goths',
    12: 'huns',
    13: 'incas',
    14: 'indians',
    15: 'italians',
    16: 'japanese',
    17: 'khmer',
    18: 'koreans',
    19: 'lithuanians',
    20: 'magyars',
    21: 'malay',
    22: 'malians',
    23: 'mayans',
    24: 'mongols',
    25: 'persians',
    26: 'portuguese',
    27: 'saracens',
    28: 'slavs',
    29: 'spanish',
    30: 'tatars',
    31: 'teutons',
    32: 'turks',
    33: 'vietnamese',
    34: 'vikings',
};

const list = [63787403,63402085,63092143,62981275,62732509,62729983,62727787,62678560,61789149,61784921,59567690,59011281,53963222,53958283,53952895,53947428,52665350,52071634,51145387,50623952,49343255,48758556,48642093,48640952,48638210,48632288,47862188,47039553,47038999,47038231,46379615,46372721,46158595,46155616,40351049,40346091,40342505,40341979,40340279,39370019,39357961,39193907,38813345,38432708,35978384,34153119,34143386,33660221];

let mappings: any[] = [];

async function getReplay(matchId: number) {
    try {
        const dom = await JSDOM.fromURL(`https://www.aoe2insights.com/match/${matchId}`, {});
        const doc = dom.window.document;
        const links = [...doc.getElementById('overview').querySelectorAll('a')].filter(a => a.href.includes('/user'));
        // console.log(links.map(a => a.href));
        const mapping = links.map(a => {
            const profileId = a.href.match(/\/user\/(\d+)\//)[1];
            const civ = a.parentElement.parentElement.nextElementSibling.textContent.trim();
            const civRaw = Object.values(enumCivMappingTheLastKhans).indexOf(civ.toLowerCase());
            return { matchId, profileId, civ, civRaw };
        });

        if (mapping.some(m => m.civ === 'Unknown')) {
            return;
        }

        mappings.push(...mapping);
        console.log(`Success for match ${matchId}`);
    } catch (e) {
        console.log(`Error for match ${matchId}`);
    }
}

async function execReplays() {
    for (const matchId of list) {
        await getReplay(matchId);
        // await sleep(1000);
    }
    console.log(JSON.stringify(mappings, null, 2));
}

execReplays();
