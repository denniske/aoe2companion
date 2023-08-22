import {format, formatDistanceToNowStrict, fromUnixTime, parseISO} from "date-fns";
import enUS from 'date-fns/locale/en-US';

export function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

interface IParams {
    [key: string]: any;
}

export function removeReactQueryParams(params: any) {
    const {queryKey, pageParam, meta, signal, ...rest} = params;
    return rest;
}

export function makeQueryString(params: IParams) {
    return  new URLSearchParams(params).toString();
    // return Object.keys(params)
    //     .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    //     .join('&');
}

export function formatAgo(date: Date) {
    // return formatDistanceToNowStrict(date, {addSuffix: true});
    return formatDistanceToNowStrict(date, {locale: enUS, addSuffix: true});
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

