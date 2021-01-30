

import fs from 'fs';

function loadLanguage(language: string) {
    const text = fs.readFileSync(`../../app/assets/translations/${language}.json`, { encoding: 'utf-8' });
    return JSON.parse(text);
}

function translateLanguage(language: string) {

}

translateLanguage('de')

// // Imports the Google Cloud Translation library
// const {TranslationServiceClient} = require('@google-cloud/translate');
//
// // Instantiates a client
// const translationClient = new TranslationServiceClient();
// async function translateText() {
//     // Construct request
//     const request = {
//         parent: `projects/${projectId}/locations/${location}`,
//         contents: [text],
//         mimeType: 'text/plain', // mime types: text/plain, text/html
//         sourceLanguageCode: 'en',
//         targetLanguageCode: 'sr-Latn',
//     };
//
//     try {
//         // Run request
//         const [response] = await translationClient.translateText(request);
//
//         for (const translation of response.translations) {
//             console.log(`Translation: ${translation.translatedText}`);
//         }
//     } catch (error) {
//         console.error(error.details);
//     }
// }
//
// translateText();
