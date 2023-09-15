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
