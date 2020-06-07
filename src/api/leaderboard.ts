const fromUnixTime = require('date-fns/fromUnixTime');


function convertTimestampsToDates(leaderboardRaw: ILeaderboardRaw): ILeaderboard {
    return {
        ...leaderboardRaw,
        leaderboard: leaderboardRaw.leaderboard.map(playerRaw => ({
            ...playerRaw,
            last_match: fromUnixTime(playerRaw.last_match),
        })),
    };
}

export async function fetchLeaderboard(game: string, leaderboard_id : string, search: string, count: number) {
    const response = await fetch(`https://aoe2.net/api/leaderboard?game=${game}&leaderboard_id=${leaderboard_id}&search=${search}&count=${count}`)
    const json = await response.json();
    console.log("response.json()", json);

    return convertTimestampsToDates(json);
}
