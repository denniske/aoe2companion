import {objectType} from "@nexus/schema";
import {fromUnixTime} from "date-fns";
import {prisma} from "../db";
import {Leaderboard} from "./leaderboard";
import { orderBy } from "lodash";
import {raw, sqltag} from "@prisma/client/runtime";

async function getLeaderboard(leaderboardId: number, profileId: number) {
    const leaderboard = await prisma.leaderboard_row.findOne({
        where: {leaderboard_id_profile_id: {leaderboard_id: leaderboardId, profile_id: profileId}},
    });
    if (leaderboard == null) return null;
    return {
        leaderboard_id: leaderboardId,
        ...leaderboard,
    };
}

async function getRatingHistory(leaderboardId: number, profileId: number) {
    let players = await prisma.player.findMany({
        include: {
            match: { select: { finished: true, started: true } },
        },
        where: {profile_id: profileId, match: { leaderboard_id: leaderboardId }},
    });
    if (players.length === 0) return null;
    players = orderBy(players, p => p.match.started, 'desc');
    return {
        leaderboard_id: leaderboardId,
        profile_id: profileId,
        history: players.map(player => ({
            rating: player.rating + player.rating_change,
            num_wins: player.wins,
            num_losses: player.games - player.wins,
            streak: player.streak,
            drops: player.drops,
            timestamp: player.match.started, // player.match.finished ||
        }))
    };
}



async function getStats(leaderboardId: number, profileId: number) {
    // const id = 1953364;
    // const match = await prisma.$queryRaw`SELECT * FROM match WHERE match_id = ${id}`;
    // console.log('-----------');
    // console.log('match', match);

    const allies = await prisma.$queryRaw`
        SELECT p2.profile_id, p2.name, p2.country, COUNT(*) as games, COUNT(*) filter (where p.won) as wins
        FROM player as p
        JOIN player as p2 ON p2.match_id = p.match_id AND p2.profile_id != p.profile_id AND p2.team = p.team AND p2.team is not null AND p.team is not null
        JOIN match as m ON m.match_id = p.match_id
        WHERE p.profile_id=${profileId} AND m.leaderboard_id=${leaderboardId} -- AND p.team != -1
        GROUP BY p2.profile_id, p2.name, p2.country
        ORDER BY games desc;
    `;

    const opponents = await prisma.$queryRaw`
        SELECT p2.profile_id, p2.name, p2.country, COUNT(*) as games, COUNT(*) filter (where p.won) as wins
        FROM player as p
        JOIN player as p2 ON p2.match_id = p.match_id AND p2.profile_id != p.profile_id AND p2.team != p.team AND p2.team is not null AND p.team is not null
        JOIN match as m ON m.match_id = p.match_id
        WHERE p.profile_id=${profileId} AND m.leaderboard_id=${leaderboardId} -- AND p.team != -1
        GROUP BY p2.profile_id, p2.name, p2.country
        ORDER BY games desc;
    `;

    const map_type = await prisma.$queryRaw`
        SELECT map_type, COUNT(map_type) as games, COUNT(*) filter (where won) as wins
        FROM player as p
        JOIN match as m ON m.match_id = p.match_id
        WHERE profile_id=${profileId} AND m.leaderboard_id=${leaderboardId}
        GROUP BY map_type
        ORDER BY games desc;
    `;

    const civ = await prisma.$queryRaw`
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

export const Profile = objectType({
  name: 'Profile',
  definition(t) {
    t.int('profile_id')
    t.string('name')
    t.string('country')
    t.datetime('last_match_time', { resolve: (x: any) => fromUnixTime(x.last_match_time), nullable: false })

    t.field('games', {
      type: 'Int',
      nullable: true,
      resolve: async parent => {
          const aggregation = await prisma.leaderboard_row.aggregate({
              sum: { games: true },
              where: { profile_id: parent.profile_id },
          });
          return aggregation.sum.games;
      },
    })

    t.field('drops', {
      type: 'Int',
      nullable: true,
      resolve: async parent => {
          const aggregation = await prisma.leaderboard_row.aggregate({
              sum: { drops: true },
              where: { profile_id: parent.profile_id },
          });
          return aggregation.sum.drops;
      },
    })

    t.list.field('leaderboards', {
      type: 'Leaderboard',
      resolve: async parent => {
          const leaderboardIds = [0, 1, 2, 3, 4];
          let leaderboards: any[] = await Promise.all(leaderboardIds.map(leaderboardId => getLeaderboard(leaderboardId, parent.profile_id)));
          leaderboards = leaderboards.filter(board => board != null);
          return leaderboards;
      },
    })

    t.list.field('rating_history', {
      type: 'RatingHistory',
      resolve: async parent => {
          const leaderboardIds = [0, 1, 2, 3, 4];
          let ratingHistories = await Promise.all(leaderboardIds.map(leaderboardId => getRatingHistory(leaderboardId, parent.profile_id)));
          ratingHistories = ratingHistories.filter(board => board != null);
          return ratingHistories;
      },
    })

    t.list.field('stats', {
      type: 'Stats',
      resolve: async parent => {
          const leaderboardIds = [4];
          let ratingHistories = await Promise.all(leaderboardIds.map(leaderboardId => getStats(leaderboardId, parent.profile_id)));
          ratingHistories = ratingHistories.filter(board => board != null);
          return ratingHistories;
      },
    })
  },
})
