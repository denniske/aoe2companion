
const LANGUAGE = 'en';

interface IStringItem {
    id: number;
    string: string;
}

interface IStrings {
    age: IStringItem[];
    civ: IStringItem[];
    game_type: IStringItem[];
    leaderboard: IStringItem[];
    map_size: IStringItem[];
    map_type: IStringItem[];
    rating_type: IStringItem[];
    resources: IStringItem[];
    speed: IStringItem[];
    victory: IStringItem[];
    visibility: IStringItem[];
}

interface IStringCollection {
    [key: string]: IStrings;
}

export function getString(category: keyof IStrings, id: number) {
    return strings[LANGUAGE][category].find(i => i.id === id)?.string;
}

const strings: IStringCollection = {
    'en': require('../assets/strings/en.json'),
};
