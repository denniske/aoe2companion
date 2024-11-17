require('dotenv').config();

const {TranslationServiceClient} = require('@google-cloud/translate');

const projectId = 'aoe-service';
const location = 'global';
const text = 'Hi I am Dennis';
const text2 = 'Bye I am Dennis';

const translationClient = new TranslationServiceClient();
async function translateText(strings: string[], targetLanguageCode: string) {
    const request = {
        parent: `projects/${projectId}/locations/${location}`,
        contents: strings,
        mimeType: 'text/plain', // mime types: text/plain, text/html
        sourceLanguageCode: 'en',
        targetLanguageCode,
    };

    try {
        const [response] = await translationClient.translateText(request);

        // for (const translation of response.translations) {
        //     console.log(`Translation: ${translation.translatedText}`);
        // }

        return response.translations.map((t: any) => t.translatedText);
    } catch (error) {
        console.error('error', error);
        throw error;
    }
}

// translateText([text, text2]);


import fs from 'fs';

function loadLanguage(language: string): Record<string, string> {
    const text = fs.readFileSync(`../app/assets/translations/${language}.json`, { encoding: 'utf-8' });
    return JSON.parse(text);
}

export function getAllMatches(regex: RegExp, str: string) {
    let matches = [];
    let m;
    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        matches.push(m);
    }
    return matches;
}

function preprocess(source: string) {
    let i = 0;
    return source.replace(/{.+}/, () => '{'+(i++)+'}');
}

function postprocess(source: string, translated: string) {
    const matches = getAllMatches(/{.+}/g, source);
    return translated.replace(/{(\d+)}/, (m, num) => {
        return matches[num][0];
    });
}

async function translateLanguage(language: string) {
    const en = loadLanguage('en');
    const target = loadLanguage(language);

    const enKeys = Object.keys(en);
    const enPairs = Object.entries(en);
    const targetPairs = Object.entries(target);
    const targetKeys = Object.keys(target);

    const missingTranslations = enPairs.filter(p => !targetKeys.includes(p[0]));
    // console.log('missingTranslations', missingTranslations);

    const unusedTranslations = targetPairs.filter(p => !enKeys.includes(p[0]));
    // console.log('unusedTranslations', unusedTranslations);

    const translated = missingTranslations.length == 0 ? [] : await translateText(missingTranslations.map(p => preprocess(p[1])), language);
    // console.log('translated', translated);

    const translationDict = missingTranslations.map((p, i) => [p[0], postprocess(p[1], translated[i])]);
    // console.log('translationDict', translationDict);

    const getValue = (key: string) => {
        const translatedPair = translationDict.find(p => p[0] === key);
        if (translatedPair) {
            return translatedPair[1];
        }
        const alreadyTranslatedPair = targetPairs.find(p => p[0] === key);
        if (alreadyTranslatedPair) {
            return alreadyTranslatedPair[1];
        }
        return '';
    };

    const getCategory = (key: string) => {
        return key.substr(0, key.indexOf('.'));
    };

    const escape = (str: string) => str.replace(/"/g, '\\"');

    let doc = '';

    let previousCategory = null;
    for (const enPair of enPairs) {
        if (getCategory(enPair[0]) != previousCategory) {
            doc += '\n';
        }
        previousCategory = getCategory(enPair[0]);

        doc += `  "${enPair[0]}": "${escape(getValue(enPair[0]))}",\n`;
    }

    doc += '\n';
    doc += '\n';

    for (const unusedTranslation of unusedTranslations) {
        doc += `  "${unusedTranslation[0]}": "${getValue(unusedTranslation[0])}",\n`;
    }

    doc = doc.replace(/,\s*$/, '\n');

    doc = '{' + doc + '}';

    fs.writeFileSync(`../app/assets/translations/${language}.json`, doc);
}


async function translateAllLanguages() {
    const languages = ['ms', 'fr', 'es-mx', 'it', 'pt', 'ru', 'vi', 'tr', 'de', 'es', 'hi', 'ja', 'ko', 'zh-hans', 'zh-hant'];
    for (const language of languages) {
        console.log("Translating " + language);
        await translateLanguage(language);
    }
}

translateAllLanguages();
// translateLanguage('de');
