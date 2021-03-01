import {IMatch, validMatch} from "@nex/data";
import {sameUser, UserIdBase} from "../../helper/user";
import {orderBy} from "lodash-es";
import {LeaderboardId} from "@nex/data";


export interface IParam {
    matches?: IMatch[];
    user: UserIdBase;
    leaderboardId: LeaderboardId;
}

export interface IRow {
    position: AoePosition;
    games: number;
    won: number;
}

export type AoePosition = 'flank' | 'pocket';

function matchPosition(match: IMatch, user: UserIdBase, position: AoePosition) {
    // console.log(getMapName(match.map_type));
    // match.players.forEach(player => console.log(player.color, player.slot, player.name));

    // Exclude nomad maps
    if ([33, 116, 141].includes(match.map_type)) return false;

    const userPlayer = match.players.find(player => sameUser(user, player));
    const userTeam = userPlayer?.team;

    if (userTeam == null) return false;

    const userTeamPlayers = match.players.filter(player => player.team === userTeam);

    if (userTeamPlayers.length != 3 && userTeamPlayers.length != 4) return false;

    const userTeamPlayersSorted = orderBy(userTeamPlayers, p => p.color);

    const realPosition = sameUser(userTeamPlayersSorted[0], user) || sameUser(userTeamPlayersSorted[userTeamPlayersSorted.length-1], user) ? 'flank' : 'pocket';

    // console.log(realPosition);

    return realPosition === position;
}

export async function getStatsPosition({matches, user, leaderboardId}: IParam) {
    let rows: IRow[] | null = null;

    const hasPosition = [LeaderboardId.DMTeam, LeaderboardId.RMTeam].includes(leaderboardId);

    if (matches && hasPosition) {
        const positionList: AoePosition[] = ['flank', 'pocket'];
        // console.log(matches);
        rows = positionList.map((position: AoePosition) => {
            const gamesWithPosition = matches.filter(m => matchPosition(m, user, position));
            const validGamesWithMap = gamesWithPosition.filter(validMatch);
            const validGamesWithPositionWon = validGamesWithMap.filter(m => m.players.filter(p =>
                p.won &&
                sameUser(p, user)
            ).length > 0);
            return ({
                position: position,
                games: gamesWithPosition.length,
                won: validGamesWithPositionWon.length / validGamesWithMap.length * 100,
            });
        });
        rows = rows.filter(r => r.games > 0);
        rows = orderBy(rows, r => r.games, 'desc');
        // rows = orderBy(rows, [r => r.won], ['desc']);
    }
    return { rows, matchCount: matches?.length, user, leaderboardId };
}
