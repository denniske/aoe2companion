import path from 'path';
import axios from 'axios';
import {createWriteStream} from 'fs';
import {finished} from "stream";
import * as fs from "fs";
const spawn = require('await-spawn');

require('dotenv').config();

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export async function downloadFile(fileUrl: string, outputLocationPath: string): Promise<any> {
    const writer = createWriteStream(outputLocationPath);
    return axios({
        method: 'get',
        url: fileUrl,
        responseType: 'stream',
    }).then(async response => {
        response.data.pipe(writer);
        return finished(writer, (err) => {});
    });
}

function deleteIfExists(path: string) {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
}

async function loadAges() {
    const fullJsonXz = path.resolve(__dirname, '..', 'full.json.xz');
    const fullJson = path.resolve(__dirname, '..', 'full.json');
    deleteIfExists(fullJsonXz);
    deleteIfExists(fullJson);

    await downloadFile('https://raw.githubusercontent.com/HSZemi/aoe2dat/master/data/full.json.xz', 'full.json.xz');

    await sleep(1000);

    const input = path.resolve(__dirname, '..', 'full.json.xz');
    const output = path.resolve(__dirname, '..');

    // console.log(input);
    // console.log(output);

    try {
        await spawn(`C:\\Program Files\\WinRAR\\winrar.exe`, [`x`,`-ibck`, `${input}`, `*.*`, `${output}`]);
    } catch (e) {
        console.log(e);
    }

    await sleep(1000);

    const full = JSON.parse(fs.readFileSync(fullJson, 'utf8'));

    // for (const key of Object.keys(full['Effects'])) {
    //     console.log(key);
    // }
    // console.log(full['Effects']['102']);

    const aoeAgesData = {
        'Feudal': full['Effects']['101'],
        'Castle': full['Effects']['102'],
        'Imperial': full['Effects']['103'],
    };

    const filePath = path.resolve(__dirname, '..', '..', 'data', 'src', 'data', 'aoe-ages-data.ts');

    fs.writeFileSync(filePath, `export const aoeAgesData = ${JSON.stringify(aoeAgesData, null, 4)} as const;`);

    deleteIfExists(fullJsonXz);
    deleteIfExists(fullJson);
}

loadAges();
