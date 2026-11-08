import path from 'path';
import fs from 'fs';
import YAML from 'yaml'

require('dotenv').config();

// https://yaml-to-json.vercel.app/api/convert?url=https://raw.githubusercontent.com/SiegeEngineers/aoc-reference-data/master/data/players.yaml

// Note: Done directly in app now
async function loadReferenceData() {
    const filePath = path.resolve(__dirname, '..', '..', 'data', 'src', 'data', 'aoe-reference-data.ts');

    const response = await fetch(`https://raw.githubusercontent.com/SiegeEngineers/aoc-reference-data/master/data/players.yaml`);

    const players = YAML.parse(await response.text());

    const response2 = await fetch(`https://raw.githubusercontent.com/SiegeEngineers/aoc-reference-data/master/data/teams.json`);

    const teams = await response2.json();

    const aoeReferenceData = {
        players,
        teams,
    };

    fs.writeFileSync(filePath, `export const aoeReferenceData = ${JSON.stringify(aoeReferenceData, null, 4)} as const;`);
}

loadReferenceData();
