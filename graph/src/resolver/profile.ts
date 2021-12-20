import {Args, Int, Parent, Query, ResolveField, Resolver} from "@nestjs/graphql";
import {fromUnixTime} from "date-fns";
import {Profile} from "../object/profile";
import {Connection} from "typeorm";
import {PrismaService} from "../service/prisma.service";


@Resolver(of => Profile)
export class ProfileResolver {

    constructor(
        private connection: Connection,
        private prisma: PrismaService,
    ) {}

    @Query(returns => String)
    async temp() {
        let historyEntries = await this.prisma.rating_history.findMany({
            select: {
                rating: true,
                timestamp: true,
            },
            where: {
                profile_id: 251265,
                leaderboard_id: 3,
            },
            orderBy: {
                timestamp: 'desc',
            },
        });

        // const user = await this.prisma.$queryRaw`
        //  SELECT *
        //  FROM rating_history
        //  WHERE profile_id=251265 AND leaderboard_id=3;
        // `;

        // return user[0];
        return 'DONE';
    }

    @Query(returns => String)
    async temp2() {
        const start = new Date();
        const user = await this.connection.manager.query(`
         SELECT rating, timestamp
         FROM rating_history
         WHERE profile_id=251265 AND leaderboard_id=3
         ORDER BY timestamp desc;
        `, []);
        console.log((new Date().getTime() - start.getTime())+'ms');

        // const start2 = new Date();
        const gg = JSON.stringify(user);
        let strLengthInBytes = Buffer.byteLength(gg);
        console.log('length:', strLengthInBytes/1000, 'kB');
        // console.log((new Date().getTime() - start2.getTime())+'ms str');

        // console.log(user);

        // return user[0];
        return 'DONE';
    }

    @Query(returns => String)
    async temp3() {
        return 'DONE';
    }

    @Query(returns => Profile)
    async profile(
        @Args("profile_id", {type: () => Int, nullable: true}) profile_id?: number,
    ) {
        const user = await this.prisma.$queryRaw`
          SELECT profile_id, MIN(name) as name, MIN(country) as country, SUM(games) as games, MAX(last_match_time) as last_match_time
          FROM leaderboard_row
          WHERE profile_id = ${profile_id}
          GROUP BY profile_id
          LIMIT 1
        `;

        return user[0];
    }

    @ResolveField()
    async last_match_time(@Parent() profile: Profile) {
        return fromUnixTime(profile.last_match_time as unknown as number);
    }

    @ResolveField()
    async games(@Parent() profile: Profile) {
        const aggregation = await this.prisma.leaderboard_row.aggregate({
            _sum: { games: true },
            where: { profile_id: profile.profile_id },
        });
        return aggregation._sum.games;
    }

    @ResolveField()
    async drops(@Parent() profile: Profile) {
        const aggregation = await this.prisma.leaderboard_row.aggregate({
            _sum: { drops: true },
            where: { profile_id: profile.profile_id },
        });
        return aggregation._sum.drops;
    }

    @ResolveField()
    async leaderboards(@Parent() profile: Profile) {
        const leaderboardIds = [0, 1, 2, 3, 4];
        let leaderboards: any[] = await Promise.all(leaderboardIds.map(leaderboardId => this.getLeaderboard(leaderboardId, profile.profile_id)));
        leaderboards = leaderboards.filter(board => board != null);
        return leaderboards;
    }

    @ResolveField()
    async rating_history(@Parent() profile: Profile) {
        const leaderboardIds = [0, 1, 2, 3, 4];
        let ratingHistories = await Promise.all(leaderboardIds.map(leaderboardId => this.getRatingHistory(leaderboardId, profile.profile_id)));
        ratingHistories = ratingHistories.filter(board => board != null);
        return ratingHistories;
    }

    @ResolveField()
    async stats(@Parent() profile: Profile) {
        const leaderboardIds = [4];
        let ratingHistories = await Promise.all(leaderboardIds.map(leaderboardId => this.getStats(leaderboardId, profile.profile_id)));
        ratingHistories = ratingHistories.filter(board => board != null);
        return ratingHistories;
    }

    async getLeaderboard(leaderboardId: number, profileId: number) {
        const leaderboard = await this.prisma.leaderboard_row.findUnique({
            where: {leaderboard_id_profile_id: {leaderboard_id: leaderboardId, profile_id: profileId}},
        });
        if (leaderboard == null) return null;
        return {
            leaderboard_id: leaderboardId,
            ...leaderboard,
        };
    }

    async getRatingHistory(leaderboardId: number, profileId: number) {
        let historyEntries = await this.prisma.rating_history.findMany({
            select: {
                rating: true,
                timestamp: true,
                leaderboard_id: false,
            },
            where: {
                profile_id: profileId,
                leaderboard_id: leaderboardId,
            },
            orderBy: {
                timestamp: 'desc',
            },
        });
        if (historyEntries.length === 0) return null;
        return {
            leaderboard_id: leaderboardId,
            profile_id: profileId,
            history: historyEntries.map(entry => ({
                rating: entry.rating,
                timestamp: entry.timestamp,
            }))
        };

        // let players = await this.prisma.player.findMany({
        //     include: {
        //         match: { select: { finished: true, started: true } },
        //     },
        //     where: {profile_id: profileId, match: { leaderboard_id: leaderboardId }},
        // });
        // if (players.length === 0) return null;
        // players = orderBy(players, p => p.match.started, 'desc');
        // return {
        //     leaderboard_id: leaderboardId,
        //     profile_id: profileId,
        //     history: players.map(player => ({
        //         rating: player.rating + player.rating_change,
        //         num_wins: player.wins,
        //         num_losses: player.games - player.wins,
        //         streak: player.streak,
        //         drops: player.drops,
        //         timestamp: player.match.started, // player.match.finished ||
        //     }))
        // };
    }

    async getStats(leaderboardId: number, profileId: number) {
        // const id = 1953364;
        // const match = await this.prisma.$queryRaw`SELECT * FROM match WHERE match_id = ${id}`;
        // console.log('-----------');
        // console.log('match', match);

        const allies = await this.prisma.$queryRaw`
        SELECT p2.profile_id, p2.name, p2.country, COUNT(*) as games, COUNT(*) filter (where p.won) as wins
        FROM player as p
        JOIN player as p2 ON p2.match_id = p.match_id AND p2.profile_id != p.profile_id AND p2.team = p.team AND p2.team is not null AND p.team is not null
        JOIN match as m ON m.match_id = p.match_id
        WHERE p.profile_id=${profileId} AND m.leaderboard_id=${leaderboardId} -- AND p.team != -1
        GROUP BY p2.profile_id, p2.name, p2.country
        ORDER BY games desc;
    `;

        const opponents = await this.prisma.$queryRaw`
        SELECT p2.profile_id, p2.name, p2.country, COUNT(*) as games, COUNT(*) filter (where p.won) as wins
        FROM player as p
        JOIN player as p2 ON p2.match_id = p.match_id AND p2.profile_id != p.profile_id AND p2.team != p.team AND p2.team is not null AND p.team is not null
        JOIN match as m ON m.match_id = p.match_id
        WHERE p.profile_id=${profileId} AND m.leaderboard_id=${leaderboardId} -- AND p.team != -1
        GROUP BY p2.profile_id, p2.name, p2.country
        ORDER BY games desc;
    `;

        const map_type = await this.prisma.$queryRaw`
        SELECT map_type, COUNT(map_type) as games, COUNT(*) filter (where won) as wins
        FROM player as p
        JOIN match as m ON m.match_id = p.match_id
        WHERE profile_id=${profileId} AND m.leaderboard_id=${leaderboardId}
        GROUP BY map_type
        ORDER BY games desc;
    `;

        const civ = await this.prisma.$queryRaw`
        SELECT civ, COUNT(civ) as games, COUNT(*) filter (where won) as wins
        FROM player as p
        JOIN match as m ON m.match_id = p.match_id
        WHERE profile_id=${profileId} AND m.leaderboard_id=${leaderboardId}
        GROUP BY civ
        ORDER BY games desc;
    `;
        // console.log('-----------');
        // console.log('match', civ);

        return {
            leaderboard_id: leaderboardId,
            civ,
            map_type,
            allies,
            opponents,
        };
    }
}
