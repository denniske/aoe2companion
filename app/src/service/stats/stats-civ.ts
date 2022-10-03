import {IMatch, validMatch} from "@nex/data/api";
import {sameUser, UserIdBase} from "../../helper/user";
import {Civ, civsAoeNet} from "@nex/data";
import {orderBy} from 'lodash';
import {LeaderboardId} from '@nex/data';

export interface IParam {
    matches?: IMatch[];
    user: UserIdBase;
    leaderboardId: LeaderboardId;
}

export interface IRow {
    civ: Civ;
    games: number;
    won: number;
}

export async function getStatsCiv({matches, user, leaderboardId}: IParam) {
    let rowsWithCiv: IRow[] | null = null;
    let rowsAgainstCiv: IRow[] | null = null;
    if (matches) {
        rowsWithCiv = civsAoeNet.map(civ => {
            const gamesWithCiv = matches.filter(m => m.players.filter(p =>
                p.civ === civsAoeNet.indexOf(civ) &&
                sameUser(p, user)
            ).length > 0);
            const validGamesWithCiv = gamesWithCiv.filter(validMatch);
            const validGamesWithCivWon = validGamesWithCiv.filter(m => m.players.filter(p => p.won && sameUser(p, user)).length > 0);
            return ({
                civ: civ as Civ,
                games: gamesWithCiv.length,
                won: validGamesWithCivWon.length / validGamesWithCiv.length * 100,
            });
        });
        rowsWithCiv = rowsWithCiv.filter(r => r.games > 0);
        rowsWithCiv = orderBy(rowsWithCiv, r => r.games, 'desc');
        // rows = orderBy(rows, [r => r.won], ['desc']);

        rowsAgainstCiv = civsAoeNet.map(civ => {
            const gamesWithCiv = matches.filter(m => m.players.filter(p =>
                p.civ === civsAoeNet.indexOf(civ) &&
                !sameUser(p, user)
            ).length > 0);
            const validGamesWithCiv = gamesWithCiv.filter(validMatch);
            const validGamesWithCivWon = validGamesWithCiv.filter(m => m.players.filter(p => p.won && sameUser(p, user)).length > 0);
            return ({
                civ: civ as Civ,
                games: gamesWithCiv.length,
                won: validGamesWithCivWon.length / validGamesWithCiv.length * 100,
            });
        });
        rowsAgainstCiv = rowsAgainstCiv.filter(r => r.games > 0);
        rowsAgainstCiv = orderBy(rowsAgainstCiv, r => r.games, 'desc');
        // rows = orderBy(rows, [r => r.won], ['desc']);
    }
    return { rowsWithCiv, rowsAgainstCiv, matchCount: matches?.length, leaderboardId, user };
}
