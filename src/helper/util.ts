import { format, formatDistanceToNowStrict } from "date-fns";
import { enUS, de } from "date-fns/locale";
const fromUnixTime = require('date-fns/fromUnixTime');

export function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export function parseUnixTimestamp(timestamp: number) {
    return fromUnixTime(timestamp);
}

export function formatDateShort(date: Date) {
    return format(date, 'MMM d', {locale: enUS});
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

export function getLeaderboardAbbr(leaderboard_id: number) {
    const abbreviations = ['Unranked', 'DM 1v1', 'DM Team', 'RM 1v1', 'RM Team'];
    return abbreviations[leaderboard_id];
}

export function strRemoveTo(str: string, find: string) {
    return str.substring(str.indexOf(find) + find.length);
}

export function strRemoveFrom(str: string, find: string) {
    return str.substring(0, str.indexOf(find));
}
