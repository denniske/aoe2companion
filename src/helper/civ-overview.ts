import { ICivilization } from '@app/api/helper/api.types';

// One file per language, each holding the civ page text already resolved from the game's
// own localization by the collector. Thunks rather than a map of values: metro bundles
// every branch either way, but only the language actually in use gets parsed, and these
// are ~100 KB each.
type ICivOverviewFile = Record<string, Omit<ICivilization, 'civ' | 'name'>>;

const civOverviewByLanguage: Record<string, () => ICivOverviewFile> = {
    'de': () => require('../../assets4/data/civ-overview/de.json'),
    'en': () => require('../../assets4/data/civ-overview/en.json'),
    'es': () => require('../../assets4/data/civ-overview/es.json'),
    'es-mx': () => require('../../assets4/data/civ-overview/es-mx.json'),
    'fr': () => require('../../assets4/data/civ-overview/fr.json'),
    'hi': () => require('../../assets4/data/civ-overview/hi.json'),
    'it': () => require('../../assets4/data/civ-overview/it.json'),
    'ja': () => require('../../assets4/data/civ-overview/ja.json'),
    'ko': () => require('../../assets4/data/civ-overview/ko.json'),
    'ms': () => require('../../assets4/data/civ-overview/ms.json'),
    'pt': () => require('../../assets4/data/civ-overview/pt.json'),
    'ru': () => require('../../assets4/data/civ-overview/ru.json'),
    'tr': () => require('../../assets4/data/civ-overview/tr.json'),
    'vi': () => require('../../assets4/data/civ-overview/vi.json'),
    'zh-hans': () => require('../../assets4/data/civ-overview/zh-hans.json'),
    'zh-hant': () => require('../../assets4/data/civ-overview/zh-hant.json'),
};

// Falls back to English for a language we have no file for.
export function loadCivOverview(language: string | undefined): ICivOverviewFile {
    return (civOverviewByLanguage[language ?? 'en'] ?? civOverviewByLanguage['en'])();
}
