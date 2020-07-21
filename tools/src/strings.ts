import axios from "axios"
import * as fs from "fs"
import * as path from "path"

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function loadStringsForLanguage(language: string) {
    const filePath = path.resolve(__dirname, '..', 'assets', 'strings', language + '.json');
    const response = await axios({
        method: 'GET',
        url: `http://aoe2.net/api/strings?game=aoe2de&language=${language}`,
    });

    const json = response.data;
    fs.writeFileSync(filePath, JSON.stringify(json, null, 4));
}

async function loadStrings() {
    const languages = ['en', 'de', 'el', 'es', 'es-MX', 'fr', 'hi', 'it', 'ja', 'ko', 'ms', 'nl', 'pt', 'ru', 'tr', 'vi', 'zh', 'zh-TW'];
    for (const language of languages) {
        console.log("Loading strings for " + language);
        await loadStringsForLanguage(language);
        await sleep(500);
    }
}

loadStrings();
