import {IMatch, validMatch} from "@nex/data/api";
import {sameUser, UserIdBase} from "../../helper/user";
import {differenceInMinutes} from "date-fns";
import {AoeSpeed, getSpeedFactor} from "../../helper/speed";

export interface IParam {
    matches?: IMatch[];
    user: UserIdBase;
}

export interface IRow {
    duration: string;
    games: number;
    won: number;
}

const durations = [
    'lessThan5Minutes',
    'lessThan30Minutes',
    'lessThan60Minutes',
    'greaterThan60Minutes',
];

function matchDuration(match: IMatch, durationIndex: number) {
    if (!match.started || !match.finished) return false;

    const diffInMinutes = differenceInMinutes(match.finished, match.started) * getSpeedFactor(match.speed as AoeSpeed);

    if (diffInMinutes < 5 && durationIndex === 0) return true;
    if (diffInMinutes >= 5 && diffInMinutes < 30 && durationIndex === 1) return true;
    if (diffInMinutes >= 30 && diffInMinutes < 60 && durationIndex === 2) return true;
    if (diffInMinutes > 60 && durationIndex === 3) return true;
    return false;
}

export async function getStatsDuration({matches, user}: IParam) {
    let rows: IRow[] | null = null;
    if (matches) {
        rows = durations.map((duration, durationIndex) => {
            const gamesWithDuration = matches.filter(m => matchDuration(m, durationIndex));
            const validGamesWithDuration = gamesWithDuration.filter(validMatch);
            const validGamesWithDurationWon = validGamesWithDuration.filter(m => m.players.filter(p => p.won && sameUser(p, user)).length > 0);
            return ({
                duration: duration,
                games: gamesWithDuration.length,
                won: validGamesWithDurationWon.length / validGamesWithDuration.length * 100,
            });
        });
        if (matches.length == 0) {
            rows = [];
        }
    }
    return { rows, matchCount: matches?.length, user };
}
