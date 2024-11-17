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
    'Byzantines',
    'Japanese',
    'JeanneDArc',
    'Ayyubids',
    'ZhuXiSLegacy',
    'OrderOfTheDragon',
] as const;

export const civsAoeNetData = civsData;

export const civIconListData = {
    'AbbasidDynasty': require('../../../app4/assets/civilizations/abbasid_dynasty.png'),
    'Chinese': require('../../../app4/assets/civilizations/chinese.png'),
    'DelhiSultanate': require('../../../app4/assets/civilizations/delhi_sultanate.png'),
    'English': require('../../../app4/assets/civilizations/english.png'),
    'French': require('../../../app4/assets/civilizations/french.png'),
    'HolyRomanEmpire': require('../../../app4/assets/civilizations/holy_roman_empire.png'),
    'Malians': require('../../../app4/assets/civilizations/malians.png'),
    'Mongols': require('../../../app4/assets/civilizations/mongols.png'),
    'Ottomans': require('../../../app4/assets/civilizations/ottomans.png'),
    'Rus': require('../../../app4/assets/civilizations/rus.png'),
    'Byzantines': require('../../../app4/assets/civilizations/byzantines.png'),
    'Japanese': require('../../../app4/assets/civilizations/japanese.png'),
    'JeanneDArc': require('../../../app4/assets/civilizations/jeanne_d_arc.png'),
    'Ayyubids': require('../../../app4/assets/civilizations/ayyubids.png'),
    'ZhuXiSLegacy': require('../../../app4/assets/civilizations/zhu_xi_s_legacy.png'),
    'OrderOfTheDragon': require('../../../app4/assets/civilizations/order_of_the_dragon.png'),
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
    'byzantines': 'Byzantines',
    'japanese': 'Japanese',
    'jeanne_d_arc': 'JeanneDArc',
    'ayyubids': 'Ayyubids',
    'zhu_xi_s_legacy': 'ZhuXiSLegacy',
    'order_of_the_dragon': 'OrderOfTheDragon',
};
