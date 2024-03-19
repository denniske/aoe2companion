import {format, formatDistanceToNowStrict, fromUnixTime, parseISO} from "date-fns";
import {getLanguage} from './aoe-data';

// Explicitly importing the languages here so that they are tree shaked.
import ms from 'date-fns/locale/ms';
import fr from 'date-fns/locale/fr';
import it from 'date-fns/locale/it';
import pt from 'date-fns/locale/pt';
import ru from 'date-fns/locale/ru';
import vi from 'date-fns/locale/vi';
import tr from 'date-fns/locale/tr';
import de from 'date-fns/locale/de';
import enUS from 'date-fns/locale/en-US';
import es from 'date-fns/locale/es';
import hi from 'date-fns/locale/hi';
import ja from 'date-fns/locale/ja';
import ko from 'date-fns/locale/ko';
import zhCN from 'date-fns/locale/zh-CN';
import zhTW from 'date-fns/locale/zh-TW';

// const moMonth = 1;
// const moDate = 7;
// export const moProfileId = 223576;

const moMonth = 1;
const moDate = 19;
export const moProfileId = 223576;

export function isBirthday() {
    return new Date().getDate() === moDate && new Date().getMonth() === moMonth;
}

export function clamp(value: number, a: number, b: number) {
    return Math.max(Math.min(value, b), a);
}

export function dateReviver(key: string, value: any) {
    if (typeof value === 'string') {
        // Check if the string is in ISO date format
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d{3})?Z?$/.test(value)) {
            return parseISO(value);
        }
    }
    return value;
}

const localeMapping = {
    'ms': ms,
    'fr': fr,
    'es-mx': es,
    'it': it,
    'pt': pt,
    'ru': ru,
    'vi': vi,
    'tr': tr,
    'de': de,
    'en': enUS,
    'es': es,
    'hi': hi,
    'ja': ja,
    'ko': ko,
    'zh-hans': zhCN,
    'zh-hant': zhTW,
};

function getLocale() {
    // console.log('getLocale', getlanguage());
    // return localeMapping['en'];
    // return localeMapping['en'];
    return localeMapping[getLanguage() as keyof typeof localeMapping];
}


export type ValueOf<T> = T[keyof T];

export function keysOf<T>(arr: T): Array<keyof T> {
    return Object.keys(arr) as Array<keyof T>;
}

export function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

let timeLastDate: Date | null = null;
export function time(start?: any) {
    // if (!__DEV__) return;
    if (timeLastDate == null || start) {
        // console.log('- ' + start);
    } else {
        // console.log(new Date().getTime() - timeLastDate.getTime());
    }
    timeLastDate = new Date();
}

export function parseUnixTimestamp(timestamp: number) {
    return fromUnixTime(timestamp);
}

export function formatYear(date: Date) {
    return format(date, 'yyyy', {locale: getLocale()});
}

export function formatMonth(date: Date) {
    return format(date, 'MMM', {locale: getLocale()});
}

export function formatDateShort(date: Date) {
    return format(date, 'MMM d', {locale: getLocale()});
}

export function formatDayAndTime(date: Date) {
    return format(date, 'MMM d HH:mm', {locale: getLocale()});
}

export function formatTime(date: Date) {
    return format(date, 'HH:mm', {locale: getLocale()});
}

export function formatDate(date: Date) {
    return format(date, 'dd MM yyyy', {locale: getLocale()});
}

export function formatAgo(date: Date) {
    return formatDistanceToNowStrict(date, {locale: getLocale(), addSuffix: true});
}

interface IParams {
    [key: string]: any;
}

export function makeQueryString(params: IParams) {
    return Object.keys(params)
            .filter(k => params[k] != null)
            .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
            .join('&');
}

export function makeQueryStringRaw(params: IParams) {
    return Object.keys(params)
            .map(k => encodeURIComponent(k) + '=' + params[k])
            .join('&');
}

export function strRemoveTo(str: string, find: string) {
    return str.substring(str.indexOf(find) + find.length);
}

export function strRemoveFrom(str: string, find: string) {
    return str.substring(0, str.indexOf(find));
}

export function escapeRegExpFn (string: string): string {
    return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

export function unwrap<X>(arg: readonly X[]): X {
    return null as any;
}

export function unwrapWithMapper<X, Y>(arg: readonly X[], mapper: (x: X) => Y): Y {
    return null as any;
}

export function sanitizeGameDescription(description: string) {
    return description
        .replace(/<b>/g, '')
        .replace(/<\/b>/g, '')
        .replace(/<i>/g, '')
        .replace(/<\/i>/g, '')
        .replace(/<br>/g, '');
}

export function removeAccentsAndCase(str: string) {
    return str
        .toLowerCase()
        .replace(/[áàãâä]/gi,"a")
        .replace(/[éè¨ê]/gi,"e")
        .replace(/[íìïî]/gi,"i")
        .replace(/[óòöôõ]/gi,"o")
        .replace(/[úùüû]/gi, "u")
        .replace(/[ç]/gi, "c")
        .replace(/[ñ]/gi, "n")
        .replace(/[^a-zA-Z0-9]/g," ");
}

export async function noop() {

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

export function shadeColor(color: string, percent: number) {

    let R = parseInt(color.substring(1,3),16);
    let G = parseInt(color.substring(3,5),16);
    let B = parseInt(color.substring(5,7),16);

    R = Math.round(R * (100 + percent) / 100);
    G = Math.round(G * (100 + percent) / 100);
    B = Math.round(B * (100 + percent) / 100);

    R = (R<255)?R:255;
    G = (G<255)?G:255;
    B = (B<255)?B:255;

    var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

    return "#"+RR+GG+BB;
}
