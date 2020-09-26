import {IMatch, validMatch} from "../../helper/data";
import {sameUser, UserIdBase} from "../../helper/user";
import {Civ, civs} from "@nex/data";
import {orderBy} from "lodash-es";

export interface IParam {
    matches?: IMatch[];
    user: UserIdBase;
}

export interface IRow {
    civ: Civ;
    games: number;
    won: number;
}

export async function getStatsCiv({matches, user}: IParam) {
    let rows: IRow[] | null = null;
    if (matches) {
        rows = civs.map(civ => {
            const gamesWithCiv = matches.filter(m => m.players.filter(p =>
                p.civ === civs.indexOf(civ) &&
                sameUser(p, user)
            ).length > 0);
            const validGamesWithCiv = gamesWithCiv.filter(validMatch);
            const validGamesWithCivWon = validGamesWithCiv.filter(m => m.players.filter(p => p.won && sameUser(p, user)).length > 0);
            return ({
                civ: civ,
                games: gamesWithCiv.length,
                won: validGamesWithCivWon.length / validGamesWithCiv.length * 100,
            });
        });
        rows = rows.filter(r => r.games > 0);
        rows = orderBy(rows, r => r.games, 'desc');
        // rows = orderBy(rows, [r => r.won], ['desc']);
    }
    return { rows, matchCount: matches?.length, user };
}
