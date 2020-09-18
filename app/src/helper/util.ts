import {format, formatDistanceToNowStrict, fromUnixTime} from "date-fns";
import { enUS, de } from "date-fns/locale";
import {Dimensions, Platform} from "react-native";

export type ValueOf<T> = T[keyof T];

export function keysOf<T>(arr: T): Array<keyof T> {
    return Object.keys(arr) as Array<keyof T>;
}

export function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export const windowWidth = Platform.OS === 'web' ? 450 : Dimensions.get('window').width;

let timeLastDate: Date | null = null;
export function time(start?: any) {
    if (!__DEV__) return;
    if (timeLastDate == null || start) {
        console.log('- ' + start);
    } else {
        console.log(new Date().getTime() - timeLastDate.getTime());
    }
    timeLastDate = new Date();
}

export function parseUnixTimestamp(timestamp: number) {
    return fromUnixTime(timestamp);
}

export function formatYear(date: Date) {
    return format(date, 'yyyy', {locale: enUS});
}

export function formatMonth(date: Date) {
    return format(date, 'MMM', {locale: enUS});
}

export function formatDateShort(date: Date) {
    return format(date, 'MMM d', {locale: enUS});
}

export function formatDayAndTime(date: Date) {
    return format(date, 'MMM d HH:mm', {locale: enUS});
}

export function formatTime(date: Date) {
    return format(date, 'HH:mm', {locale: enUS});
}

export function formatDate(date: Date) {
    return format(date, 'dd MM yyyy', {locale: enUS});
}

export function formatAgo(date: Date) {
    return formatDistanceToNowStrict(date, {locale: enUS, addSuffix: true});
}

interface IParams {
    [key: string]: any;
}

export function makeQueryString(params: IParams) {
    return Object.keys(params)
            .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
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
