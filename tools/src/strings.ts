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

// app     // aoe2techtree
// ms      // ms
// fr      // fr
// es-mx   // mx <--
// it      // it
// pt      // br <--
// pl      // pl
// ru      // ru
// vi      // vi
// tr      // tr
// de      // de
// en      // en
// es      // es
// hi      // hi
// ja      // jp <--
// ko      // ko
// zh-hans // zh
// zh-hant // tw <--

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

async function loadStringsAoE2TechTreeForLanguage(language: keyof typeof aoe2techtreeLanguageMap) {
    const dirPath = path.resolve(__dirname, '..', '..', 'assets', 'data', aoe2techtreeLanguageMap[language]);
    const filePath = path.resolve(__dirname, '..', '..', 'assets', 'data', aoe2techtreeLanguageMap[language], 'strings.json');
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
        // await sleep(500);
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
// loadStringsAoe4Explorer();

// loadStrings();

loadStringsAoE2TechTree();
loadDataAoE2TechTree();
