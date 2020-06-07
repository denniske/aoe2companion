import { format, formatDistanceToNowStrict } from "date-fns";
import { de } from "date-fns/locale";

export function formatDate(date: Date) {
    return format(date, 'dd MM yyyy', {locale: de});
}

export function formatAgo(date: Date) {
    return formatDistanceToNowStrict(date, {locale: de, addSuffix: true});
}
