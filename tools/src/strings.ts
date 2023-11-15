import axios from "axios"
import * as fs from "fs"
import * as path from "path"

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function keysOf<T>(arr: T): Array<keyof T> {
    return Object.keys(arr) as Array<keyof T>;
}

// app     // aoe2techtree   // aoe2net
// ms      // ms             // ms
// fr      // fr             // fr
// es-mx   // mx <--         // es-MX
// it      // it             // it
// pt      // br <--         // pt
// pl      // pl             // pl
// ru      // ru             // ru
// vi      // vi             // vi
// tr      // tr             // tr
// de      // de             // de
// en      // en             // en
// es      // es             // es
// hi      // hi             // hi
// ja      // jp <--         // ja
// ko      // ko             // ko
// zh-hans // zh             // zh
// zh-hant // tw <--         // zh-TW

// aoe2net -> app
const aoe2netLanguageMap = {
    'ms': 'ms',
    'fr': 'fr',
    'es-MX': 'es-mx',
    'it': 'it',
    'pt': 'pt',
    'pl': 'pl',
    'ru': 'ru',
    'vi': 'vi',
    'tr': 'tr',
    'de': 'de',
    'en': 'en',
    'es': 'es',
    'hi': 'hi',
    'ja': 'ja',
    'ko': 'ko',
    'zh': 'zh-hans',
    'zh-TW': 'zh-hant',
};

// aoe2techtree -> app
const aoe2techtreeLanguageMap = {
    'ms': 'ms',
    'fr': 'fr',
    'mx': 'es-mx',
    'it': 'it',
    'br': 'pt',
    'pl': 'pl',
    'ru': 'ru',
    'vi': 'vi',
    'tr': 'tr',
    'de': 'de',
    'en': 'en',
    'es': 'es',
    'hi': 'hi',
    'jp': 'ja',
    'ko': 'ko',
    'zh': 'zh-hans',
    'tw': 'zh-hant',
};

async function loadStringsForLanguage(language: keyof typeof aoe2netLanguageMap) {
    const filePath = path.resolve(__dirname, '..', '..', 'app', 'assets', 'strings', aoe2netLanguageMap[language] + '.json.lazy');
    const response = await axios({
        method: 'GET',
        url: `http://aoe2.net/api/strings?game=aoe2de&language=${language}`,
    });

    const json = response.data;
    fs.writeFileSync(filePath, JSON.stringify(json, null, 4));
}

async function loadStrings() {
    for (const language of keysOf(aoe2netLanguageMap)) {
        console.log("Loading strings for " + language);
        await loadStringsForLanguage(language);
        await sleep(500);
    }
}


async function loadStringsForLanguage4(language: keyof typeof aoe2netLanguageMap) {
    const filePath = path.resolve(__dirname, '..', '..', 'app4', 'assets', 'strings', aoe2netLanguageMap[language] + '.json.lazy');
    const response = await axios({
        method: 'GET',
        url: `http://aoeiv.net/api/strings?game=aoe4&language=${language}`,
    });

    const json = response.data;
    fs.writeFileSync(filePath, JSON.stringify(json, null, 4));
}

async function loadStrings4() {
    for (const language of keysOf(aoe2netLanguageMap)) {
        console.log("Loading strings for " + language);
        await loadStringsForLanguage4(language);
        await sleep(500);
    }
}


async function loadStringsAoE2TechTreeForLanguage(language: keyof typeof aoe2techtreeLanguageMap) {
    const dirPath = path.resolve(__dirname, '..', '..', 'app', 'assets', 'data', aoe2techtreeLanguageMap[language]);
    const filePath = path.resolve(__dirname, '..', '..', 'app', 'assets', 'data', aoe2techtreeLanguageMap[language], 'strings.json.lazy');
    const response = await axios({
        method: 'GET',
        url: `https://raw.githubusercontent.com/SiegeEngineers/aoe2techtree/master/data/locales/${language}/strings.json`,
    });

    if (!fs.existsSync(dirPath)){
        fs.mkdirSync(dirPath);
    }

    const json = response.data;
    fs.writeFileSync(filePath, JSON.stringify(json, null, 4));
}

async function loadStringsAoE2TechTree() {
    for (const language of keysOf(aoe2techtreeLanguageMap)) {
        console.log("Loading strings for " + language);
        await loadStringsAoE2TechTreeForLanguage(language);
        await sleep(500);
    }
}

async function loadDataAoE2TechTree() {
    const dirPath = path.resolve(__dirname, '..', '..', 'data', 'src', 'data');
    const filePath = path.resolve(__dirname, '..', '..', 'data', 'src', 'data', 'aoe-data.ts');

    console.log("Loading data from aoe2techtree");

    const response = await axios({
        method: 'GET',
        url: `https://raw.githubusercontent.com/SiegeEngineers/aoe2techtree/master/data/data.json`,
    });

    if (!fs.existsSync(dirPath)){
        fs.mkdirSync(dirPath);
    }

    const json = response.data;
    fs.writeFileSync(filePath, `export const aoeDataInternal = ${JSON.stringify(json, null, 4)} as const;`);
}

// aoe4civ -> aoe4explorerdataabbrev
const aoe4CivAbbrevi = {
    'AbbasidDynasty': 'abbasid',
    'Chinese': 'chinese',
    'DelhiSultanate': 'delhi',
    'English': 'english',
    'French': 'french',
    'HolyRomanEmpire': 'hre',
    'Malians': 'malians',
    'Mongols': 'mongols',
    'Ottomans': 'ottomans',
    'Rus': 'rus',
    'Byzantines': 'byzantines',
    'Japanese': 'japanese',
    'JeanneDArc': 'jeannedarc',
    'Ayyubids': 'ayyubids',
    'ZhuXiSLegacy': 'zhuxi',
    'OrderOfTheDragon': 'orderofthedragon',
};

async function loadStringsAoe4Explorer() {
    for (const civ of keysOf(aoe4CivAbbrevi)) {
        console.log("Loading civ " + civ + ' from explorer repo');
        await loadStringAoe4Explorer(civ, aoe4CivAbbrevi[civ]);
        await sleep(100);
    }
}

async function loadStringAoe4Explorer(civ: string, explorerAbbreviation: string) {
    const dirPath = path.resolve(__dirname, '..', '..', 'app4', 'src', 'data');
    const filePath = path.resolve(__dirname, '..', '..', 'app4', 'src', 'data', `${civ.toLowerCase()}.ts`);
    const response = await axios({
        method: 'GET',
        url: `https://raw.githubusercontent.com/aoe4world/data/main/civilizations/${explorerAbbreviation}.json`,
    });

    if (!fs.existsSync(dirPath)){
        fs.mkdirSync(dirPath);
    }

    const json = response.data;
    fs.writeFileSync(filePath, `export const civData${civ} = ${JSON.stringify(json, null, 4)} as const;`);
}

// loadStrings4();
loadStringsAoe4Explorer();

// loadStrings();

// loadStringsAoE2TechTree();
// loadDataAoE2TechTree();
