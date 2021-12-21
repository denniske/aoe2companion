import {composeUserId, sameUser, UserIdBase} from "../../helper/user";
import {orderBy, uniqBy} from 'lodash';
import {IMatch, IPlayer, validMatch} from "@nex/data/api";
import {LeaderboardId} from "@nex/data";


export interface IRow {
    player: IPlayer;
    games: number;
    won: number;
}

interface IParam {
    matches?: IMatch[];
    user: UserIdBase;
    leaderboardId: LeaderboardId;
}

export async function getStatsPlayer({matches, user, leaderboardId}: IParam) {
    let rowsAlly: IRow[] | null = null;
    let rowsOpponent: IRow[] | null = null;
    // const maxRowCount = 1200;

    if (matches) {
        let otherPlayers = matches.flatMap(m => m.players).filter(p => !sameUser(p, user));
        let otherPlayersUniq = uniqBy(otherPlayers, p => composeUserId(p));

        rowsAlly = otherPlayersUniq.map(otherPlayer => {
            const gamesWithAlly = matches.filter(m => {
                const userTeam = m.players.find(p => sameUser(p, user))?.team;
                const otherPlayerTeam = m.players.find(p => sameUser(p, otherPlayer))?.team;
                return userTeam != null && otherPlayerTeam != null && userTeam === otherPlayerTeam;
            });
            const validGamesWithAlly = gamesWithAlly.filter(validMatch);
            const validGamesWithPlayerWon = validGamesWithAlly.filter(m => m.players.filter(p => p.won && sameUser(p, user)).length > 0);
            return ({
                player: otherPlayer,
                games: gamesWithAlly.length,
                won: validGamesWithPlayerWon.length / validGamesWithAlly.length * 100,
            });
        });
        rowsAlly = rowsAlly.filter(r => r.games > 0);
        rowsAlly = orderBy(rowsAlly, r => r.games, 'desc');
        // rowsAlly = rowsAlly.filter((r, i) => i < maxRowCount);

        rowsOpponent = otherPlayersUniq.map(otherPlayer => {
            const gamesWithOpponent = matches.filter(m => {
                const userTeam = m.players.find(p => sameUser(p, user))?.team;
                const otherPlayerTeam = m.players.find(p => sameUser(p, otherPlayer))?.team;
                return userTeam != null && otherPlayerTeam != null && userTeam !== otherPlayerTeam;
            });
            const validGamesWithOpponent = gamesWithOpponent.filter(validMatch);
            const validGamesWithPlayerWon = validGamesWithOpponent.filter(m => m.players.filter(p => p.won && sameUser(p, user)).length > 0);
            return ({
                player: otherPlayer,
                games: gamesWithOpponent.length,
                won: validGamesWithPlayerWon.length / validGamesWithOpponent.length * 100,
            });
        });
        rowsOpponent = rowsOpponent.filter(r => r.games > 0);
        rowsOpponent = orderBy(rowsOpponent, r => r.games, 'desc');
        // rowsOpponent = rowsOpponent.filter((r, i) => i < maxRowCount);
    }
    return { rowsAlly, rowsOpponent, matchCount: matches?.length, leaderboardId, user };
}
