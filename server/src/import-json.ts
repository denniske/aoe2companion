import express from 'express';
import {createDB} from "./helper/db";
import * as fs from "fs";
import {upsertAIPlayers} from "../../serverless/entity/entity-helper";
import {IMatchRaw} from "./helper/util";
import {sum} from "lodash";
import {createExpress} from "./helper/express";

const app = createExpress();

const separator = '/';

async function fetchMatchesSinceLastTime() {
    const connection = await createDB();

    const folder = `/Volumes/External/json`;
    const outputFolder = `/Volumes/External/json2`;
    const files = fs.readdirSync(folder).filter(f => f != '.DS_Store');

    // console.log(files);

    if (files.length === 0) return true;

    const file = files[0];

    console.log(new Date(), file);
    // await sleep(5 * 1000);

    const inputPath = folder + separator + file;
    const outputPath = outputFolder + separator + file;

    // if (fs.lstatSync(inputPath).isDirectory()) {
    //     console.log(file, 'skipped');
    //     continue;
    // }

    let entries = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

    if (entries.length > 0) {
        console.log(entries[0].match_id, '-', entries[entries.length-1].match_id);
    }

    await upsertAIPlayers(connection, entries); // .filter((e: any, i: number) => i < 10)
    console.log(new Date(), 'SAVED', sum(entries.map((m: IMatchRaw) => m.players.filter(p => p.profile_id == null).length)));

    fs.renameSync(inputPath, outputPath);

    return false;
}

async function importMatches() {
    await createDB();
    try {
        const done = await fetchMatchesSinceLastTime();
        if (!done) {
            console.log('Waiting 30s');
            setTimeout(importMatches, 0 * 1000);
        } else {
            console.log('DONE');
        }
    } catch (e) {
        console.error(e);
        setTimeout(importMatches, 60 * 1000);
    }
}

importMatches();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(process.env.PORT || 3002, () => console.log(`Server listening on port ${process.env.PORT || 3002}!`));
