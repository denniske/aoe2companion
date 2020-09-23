import {intArg, objectType, queryType, stringArg} from '@nexus/schema'
import {prisma} from "./db";
import {sleep} from "../../util/use-lazy-api";
import { matchWhereInput } from '@prisma/client';
import {fetchMatch, fetchPlayerMatches} from "../../util/player-matches";

export const Query = queryType({
  definition(t) {
    t.field('str', {
      type: 'String',
      resolve: (_, args) => {
        return 'Hello World!';
      },
    })

    t.field('match', {
      type: 'Match',
      args: {
        match_id: stringArg({ nullable: true }),
        match_uuid: stringArg({ nullable: true }),
      },
      resolve: async (_, args) => {
        const match = await prisma.match.findOne({
          where: {match_id: args.match_id},
        });

        if (match.finished == null) {
          const refetchedMatch = await fetchMatch('aoe2de', { match_id: match.match_id, uuid: match.match_uuid });

        }

        return match;
      },
    })

    t.field('profile', {
      type: 'Profile',
      args: {
        profile_id: intArg({ nullable: true }),
      },
      resolve: async (_, args, ctx) => {

        const user = await prisma.$queryRaw`
          SELECT profile_id, MIN(name) as name, MIN(country) as country, SUM(games) as games, MAX(last_match_time) as last_match_time
          FROM leaderboard_row
          WHERE profile_id = ${args.profile_id}
          GROUP BY profile_id
          LIMIT 1
        `;

        return user[0];

        // const user2 = await prisma.user.findOne({
        //   where: {profile_id: args.profile_id},
        // });
        // console.log('USER', user);
        // console.log('USER2', user2);

        // return await prisma.user.findOne({
        //   where: {profile_id: args.profile_id},
        // });
        // return {
        //   profile_id: args.profile_id,
        //   name: 'temp',
        // };
      },
    })

    t.field('matches', {
      type: 'MatchList',
      args: {
        start: intArg({ nullable: false }),
        count: intArg({ nullable: false }),
        profile_id: intArg({ nullable: true }),
        leaderboard_id: intArg({ nullable: true }),
        search: stringArg({ nullable: true }),
      },
      resolve: async (_parent, args, ctx) => {
        // await sleep(200);

        // https://niallburkley.com/blog/index-columns-for-like-in-postgres/

        if (args.count > 1000) throw Error('count must be <= 1000');

        const search = `%${args.search}%`;

        let matchIds: any = null;
        if (args.leaderboard_id) {
          matchIds = await prisma.$queryRaw`
            SELECT m.match_id
            FROM player as p
            JOIN match as m ON m.match_id = p.match_id
            WHERE m.leaderboard_id=${args.leaderboard_id}
            AND m.match_id IN (
                  SELECT m.match_id
                  FROM player as p
                  JOIN match as m ON m.match_id = p.match_id
                  WHERE profile_id=${args.profile_id}
               )
            AND (p.name ILIKE ${search} OR m.name ILIKE ${search})
            GROUP BY m.match_id
            ORDER BY m.started desc
            LIMIT ${args.count}
          `;
        } else {
          matchIds = await prisma.$queryRaw`
            SELECT m.match_id
            FROM player as p
            JOIN match as m ON m.match_id = p.match_id
            AND m.match_id IN (
                  SELECT m.match_id
                  FROM player as p
                  JOIN match as m ON m.match_id = p.match_id
                  WHERE profile_id=${args.profile_id}
               )
            AND (p.name ILIKE ${search} OR m.name ILIKE ${search})
            GROUP BY m.match_id
            ORDER BY m.started desc
            LIMIT ${args.count}
          `;
        }

        // This will not automatically fetch needed match ids
        // const matches = matchIds;

        const matches = await prisma.match.findMany({
          include: {
            players: true,
          },
          where: {
            match_id: {in: matchIds.map(x => x.match_id)}
          },
          orderBy: {
            started: 'desc',
          },
        });

        return {
          total: matches.length,
          matches,
        };
      },
    })

    t.list.field('users', {
      type: 'User',
      args: {
        search: stringArg(),
      },
      resolve: async (_parent, args, ctx) => {

        const search = `%${args.search}%`;

        const users = await prisma.$queryRaw`
          SELECT profile_id, MIN(name) as name, MIN(country) as country, SUM(games) as games
          FROM leaderboard_row
          WHERE name ILIKE ${search}
          GROUP BY profile_id
          ORDER BY SUM(games) desc
          LIMIT 20
        `;

        // console.log('users', users);

        return users;
      },
    })

    t.list.field('temp', {
      type: 'Match',
      resolve: (_parent, args, ctx) => {
        return prisma.match.findMany({
          where: {
            AND: [
              { players: { some: { profile_id: 196240 } } },
              { players: { some: { profile_id: 197930 } } },
              // { players: { some: { profile_id: 199325 } } },
            ],
          },
          skip: 0,
          take: 5,
          orderBy: { started: 'desc' },
        })
      },
    })

    t.list.field('temp2', {
      type: 'Match',
      resolve: (_parent, args, ctx) => {
        return prisma.match.findMany({
          where: {
            AND: [
              { players: { some: { profile_id: { in: [196240, 197930] } } } },
              // { players: { some: { OR: [{ profile_id: 196240 }, { profile_id: 197930 }] } } },
              // { players: { some: { profile_id: 197930 } } },
              // { players: { some: { profile_id: 199325 } } },
            ],
          },
          skip: 0,
          take: 5,
          orderBy: { started: 'desc' },
        })
      },
    })

    // t.list.field('filterMatchs', {
    //   type: 'Match',
    //   args: {
    //     searchString: stringArg({ nullable: true }),
    //   },
    //   resolve: (_, { searchString }, ctx) => {
    //     return prisma.match.findMany({
    //       where: {
    //         OR: [
    //           { title: { contains: searchString } },
    //           { content: { contains: searchString } },
    //         ],
    //       },
    //     })
    //   },
    // })
  },
})
