import { format, formatDistanceToNowStrict } from "date-fns";
import { de } from "date-fns/locale";

export function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export function formatDate(date: Date) {
    return format(date, 'dd MM yyyy', {locale: de});
}

export function formatAgo(date: Date) {
    return formatDistanceToNowStrict(date, {locale: de, addSuffix: true});
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
