declare var require: any

export const civsData = [
    'AbbasidDynasty',
    'Chinese',
    'DelhiSultanate',
    'English',
    'French',
    'HolyRomanEmpire',
    'Mongols',
    'Rus',
    'Malians',
    'Ottomans',
] as const;

export const civsAoeNetData = civsData;

export const civIconListData = {
    'AbbasidDynasty': require('../../../app4/assets/civilizations/abbasid-dynasty.png'),
    'Chinese': require('../../../app4/assets/civilizations/chinese.png'),
    'DelhiSultanate': require('../../../app4/assets/civilizations/delhi-sultanate.png'),
    'English': require('../../../app4/assets/civilizations/english.png'),
    'French': require('../../../app4/assets/civilizations/french.png'),
    'HolyRomanEmpire': require('../../../app4/assets/civilizations/holy-roman-empire.png'),
    'Malians': require('../../../app4/assets/civilizations/malians.png'),
    'Mongols': require('../../../app4/assets/civilizations/mongols.png'),
    'Ottomans': require('../../../app4/assets/civilizations/ottomans.png'),
    'Rus': require('../../../app4/assets/civilizations/rus.png'),
};

export const civEnumListData: Record<string, any> = {
    'abbasid_dynasty': 'AbbasidDynasty',
    'chinese': 'Chinese',
    'delhi_sultanate': 'DelhiSultanate',
    'english': 'English',
    'french': 'French',
    'holy_roman_empire': 'HolyRomanEmpire',
    'malians': 'Malians',
    'mongols': 'Mongols',
    'ottomans': 'Ottomans',
    'rus': 'Rus',
};
//
// export const civEnumListData: Record<string, any> = {
//     'AbbasidDynasty': 'abbasid_dynasty',
//     'Chinese': 'chinese',
//     'DelhiSultanate': 'delhi_sultanate',
//     'English': 'english',
//     'French': 'french',
//     'HolyRomanEmpire': 'holy_roman_empire',
//     'Malians': 'malians',
//     'Mongols': 'mongols',
//     'Ottomans': 'ottomans',
//     'Rus': 'rus',
// };
