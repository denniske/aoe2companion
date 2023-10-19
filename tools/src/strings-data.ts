import axios from "axios"
import * as fs from "fs"
import * as path from "path"
import {execSync} from "child_process";
import {flatten} from "lodash";

function keysOf<T>(arr: T): Array<keyof T> {
    return Object.keys(arr) as Array<keyof T>;
}

const civDescriptionData = {
    'English': [
        '11155020',
        '11217954',

        '11185693',

        '11189144',
        '11155022',

        '11185227',
        '11217400',

        '11155025',
        '11155026',

        // civ bonus
        '11197913',
        '11197924',

        '11164788',
        '11164789',

        // influence
        '11197916',
        '11199433',

        // unique unit
        '11149963',
        '11197925',
    ],
    'Chinese': [
        '11155082',
        '11155083',

        '11197607',

        '11155090',
        '11155091',

        '11155088',
        '11155089',

        // unique units
        '11149963',
        '11197941',

        // civ bonus
        '11197913',
        '11215015',
    ],
    'French': [
        '11155030',
        '11217955',

        '11197608',

        '11155032',
        '11155033',

        '11155036',
        '11155037',

        '11155034',
        '11155035',

        // civ bonus
        '11197913',
        '11197915',

        // influence
        '11197916',
        '11155039',

        // unique units
        '11149963',
        '11197917',
    ],
    'HolyRomanEmpire': [
        '11155040',
        '11155041',

        '11197609',

        '11155042',
        '11155043',

        '11163861',
        '11217474',

        // influence
        '11197916',
        '11217463',

        // civ bonus
        '11197913',
        '11217473',

        // unique units
        '11149963',
        '11197921',
    ],
    'Mongols': [
        '11155050',
        '11155061',

        '11197610',

        '11155016',
        '11155017',

        '11155057',
        '11155058',

        '11164780',
        '11164781',

        // civ bonus
        '11197913',
        '11197943',

        // influence
        '11197916',
        '11155060',

        // unique units
        '11149963',
        '11197945',
    ],
    'Rus': [
        '11155062',
        '11217799',

        '11197611',

        '11155064',
        '11155065',

        '11155066',
        '11155067',

        '11155068',
        '11155069',

        // civ bonus
        '11197913',
        '11197928',

        // influence
        '11197916',
        '11155071',

        // unique units
        '11149963',
        '11197930',
    ],
    'DelhiSultanate': [
        '11155072',
        '11217957',

        '11185694',

        '11155074',
        '11155075',

        '11155076',
        '11155077',

        '11155078',
        '11155079',

        // civ bonus
        '11197913',
        '11155081',

        // influence
        '11197916',
        '11197948',

        // unique units
        '11149963',
        '11197949',

    ],
    'AbbasidDynasty': [
        '11184494',
        '11217952',

        '11204966',

        '11183529',
        '11183530',

        '11183531',
        '11183532',

        '11184491',
        '11184492',

        // civ bonus
        '11197913',
        '11202703',

        '11202701',
        '11202702',

        // unique unit
        '11149963',
        '11183562',
    ],
}

const stringKeys = flatten(Object.values(civDescriptionData));

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const mapping = {
    'en': 'English',
    'fr': 'French',
} as any;


// aoe4 game -> app
const aoe4GameLanguageMap = {
    'ms': 'ms',
    'fr': 'fr',
    'es-419': 'es-mx',
    'it': 'it',
    'pt-br': 'pt',
    // 'pl': 'pl',            // MISSING
    'ru': 'ru',
    'vi': 'vi',
    'tr': 'tr',
    'de': 'de',
    'en': 'en',
    'es': 'es',
    'hi': 'hi',
    'ja': 'ja',
    'ko': 'ko',
    'zh-hans': 'zh-hans',
    'zh-hant': 'zh-hant',
};


async function extractStrings4() {
    fs.readdirSync('C:\\Users\\Dennis\\Downloads\\depotdownloader-2.4.7\\out\\cardinal\\archives\\').forEach(file => {
        console.log(file);
        execSync(`C:\\Users\\Dennis\\Downloads\\AOEMods.Essence-0.6.0\\AOEMods.Essence-0.6.0\\AOEMods.Essence.CLI.exe sga-unpack "C:\\Users\\Dennis\\Downloads\\depotdownloader-2.4.7\\out\\cardinal\\archives\\${file}" "C:\\Users\\Dennis\\Downloads\\depotdownloader-2.4.7\\out-locale"`)
    });

    for (const file of keysOf(aoe4GameLanguageMap)) {
        await loadStringsData4(file, aoe4GameLanguageMap[file]);
    }
}

async function loadStringsData4(file: string, language: string) {
    const keyValueTranslationsStr = fs.readFileSync(`C:\\Users\\Dennis\\Downloads\\depotdownloader-2.4.7\\out-locale\\${file}\\cardinal.${file}.ucs`, 'utf16le');

    const keyValueTranslations: Record<string, string> = {};
    for (const line of keyValueTranslationsStr.split('\r\n')) {
        const [key, value] = line.split('\t');
        // console.log(stringKeys.includes(key), '['+key+']', '=>', value);
        if (stringKeys.includes(key)) {
            keyValueTranslations[key] = value;
        }
    }

    console.log(stringKeys);
    console.log(keyValueTranslations);

    const filePath = path.resolve(__dirname, '..', '..', 'app4', 'assets', 'data', language, 'strings.json.lazy');
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    // await sleep(100);
    fs.writeFileSync(filePath, JSON.stringify(keyValueTranslations, null, 4));
}

extractStrings4();
