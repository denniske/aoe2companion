import axios from "axios"
import * as fs from "fs"
import * as path from "path"

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

// 63672307,4788188
// 63671902,1552879
// 63671891,2770632

const list = [
    [63671891,2770632],
]

async function getReplay(match_id: number, profile_id: number) {
        const response = await axios({
            method: 'GET',
            url: `https://aoe.ms/replay/?gameId=${match_id}&profileId=${profile_id}`
        });
        const json = response.data;
        console.log(json);
}

async function execReplays() {
    for (const item of list) {
        const match_id = item[0];
        const profile_id = item[1];
        getReplay(match_id, profile_id);
        await sleep(1000);
    }
}

execReplays();
