

// Max payload is 4KB so we need to reduce the size of the data
export function reducePayload(payload: any) {
    return {
        iosAppGroupFolder: payload.iosAppGroupFolder,
        playerId: payload.playerId,
        match: {
            matchId: payload.match.matchId,
            started: payload.match.started,
            finished: payload.match.finished,
            leaderboard: payload.match.leaderboard,
            leaderboardName: payload.match.leaderboardName,
            name: payload.match.name,
            map: payload.match.map,
            mapName: payload.match.mapName,
            mapImageUrl: payload.match.mapImageUrl,
            teams: payload.match.teams.map((team: any) => ({
                teamId: team.teamId,
                players: team.players.map((player: any) => ({
                    profileId: player.profileId,
                    name: player.name,
                    rating: player.rating,
                    civ: player.civ,
                    civName: player.civName,
                    civImageUrl: player.civImageUrl,
                    won: player.won,
                })),
            })),
        }
    };
}
