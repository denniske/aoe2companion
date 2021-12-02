import path from 'path';
import axios from 'axios';
import fs from 'fs';
import YAML from 'yaml'

require('dotenv').config();

// https://yaml-to-json.vercel.app/api/convert?url=https://raw.githubusercontent.com/SiegeEngineers/aoc-reference-data/master/data/players.yaml

async function loadReferenceData() {
    const filePath = path.resolve(__dirname, '..', '..', 'data', 'src', 'data', 'aoe-reference-data.ts');

    const response = await axios({
        method: 'GET',
        url: `https://raw.githubusercontent.com/SiegeEngineers/aoc-reference-data/master/data/players.yaml`,
    });

    const players = YAML.parse(response.data);

    const response2 = await axios({
        method: 'GET',
        url: `https://raw.githubusercontent.com/SiegeEngineers/aoc-reference-data/master/data/teams.json`,
    });

    const teams = response2.data;

    const aoeReferenceData = {
        players,
        teams,
    };

    fs.writeFileSync(filePath, `export const aoeReferenceData = ${JSON.stringify(aoeReferenceData, null, 4)} as const;`);
}

loadReferenceData();
