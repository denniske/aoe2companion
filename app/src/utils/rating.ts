import { subDays, subMonths, subWeeks } from 'date-fns';

export function getRatingTimespan(ratingHistoryDuration: string) {
    let since: any = null;
    switch (ratingHistoryDuration) {
        case '3m':
            since = subMonths(new Date(), 3);
            break;
        case '1m':
            since = subMonths(new Date(), 1);
            break;
        case '1w':
            since = subWeeks(new Date(), 1);
            break;
        case '1d':
            since = subDays(new Date(), 1);
            break;
    }
    return since;
}