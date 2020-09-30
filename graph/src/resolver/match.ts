import {
    Args, ArgsType, Field, Int, Mutation, Parent, Query, ResolveField, Resolver, Root
} from "@nestjs/graphql";
import {Match, MatchList} from "../object/match";
import {upsertMatchesWithPlayers} from "../entity/entity-helper";
import {fetchMatch} from "../helper";
import {myTodoList} from "@nex/data";
import {fromUnixTime} from "date-fns";
import {PrismaService} from "../service/prisma.service";
import {Connection} from "typeorm";
import {join} from '@prisma/client/runtime';


// @ArgsType()
// class MatchArgs {
//     @Field(type => String, { nullable: true })
//     match_id?: string;
//
//     @Field(type => String, { nullable: true })
//     match_uuid?: string;
// }
//
// @Args() { match_id, match_uuid }: MatchArgs

@Resolver(of => Match)
export class MatchResolver {

    constructor(
        private connection: Connection,
        private prisma: PrismaService,
    ) {}

    @Query(returns => Match)
    async match(
        @Args("match_id", {nullable: true}) match_id?: string,
        @Args("match_uuid", {nullable: true}) match_uuid?: string
    ) {
        let match = await this.prisma.match.findOne({
            include: {
                players: true,
            },
            where: {
                match_id: match_id
            },
        });

        console.log('myTodoList.length:', myTodoList.length);

        if (match.finished == null) {
            console.log('REFETCH');
            const refetchedMatch = await fetchMatch('aoe2de', { match_id: match.match_id, uuid: match.match_uuid });
            console.log('REFETCHED', refetchedMatch);
            if (refetchedMatch.finished) {
                await upsertMatchesWithPlayers(this.connection, [refetchedMatch], false);
                match = await this.prisma.match.findOne({
                    include: {
                        players: true,
                    },
                    where: {
                        match_id: match_id
                    },
                });
            }
        }

        return match;
    }

    @Query(returns => MatchList)
    async matches(
        @Args("start", {type: () => Int }) start: number,
        @Args("count", {type: () => Int }) count: number,
        @Args("profile_ids", {type: () => [Int], nullable: true}) profile_ids?: number[],
        @Args("leaderboard_id", {type: () => Int, nullable: true}) leaderboard_id?: number,
        @Args("search", {nullable: true}) search?: string,
    ) {
        // await sleep(200);

        // https://niallburkley.com/blog/index-columns-for-like-in-postgres/

        if (count > 1000) throw Error('count must be <= 1000');

        // search = `%${search}%`;
        search = `%%`;

        let matchIds: any = null;
        if (leaderboard_id != null) {
            matchIds = await this.prisma.$queryRaw`
            SELECT m.match_id
            FROM player as p
            JOIN match as m ON m.match_id = p.match_id
            WHERE m.leaderboard_id=${leaderboard_id}
            AND m.match_id IN (
                  SELECT m.match_id
                  FROM player as p
                  JOIN match as m ON m.match_id = p.match_id
                  WHERE profile_id IN (${join(profile_ids)})
               )
            AND (p.name ILIKE ${search} OR m.name ILIKE ${search})
            GROUP BY m.match_id
            ORDER BY m.started desc
            OFFSET ${start}
            LIMIT ${count}
          `;
        } else {
            matchIds = await this.prisma.$queryRaw`
            SELECT m.match_id
            FROM player as p
            JOIN match as m ON m.match_id = p.match_id
            AND m.match_id IN (
                  SELECT m.match_id
                  FROM player as p
                  JOIN match as m ON m.match_id = p.match_id
                  WHERE profile_id IN (${join(profile_ids)})
               )
            AND (p.name ILIKE ${search} OR m.name ILIKE ${search})
            GROUP BY m.match_id
            ORDER BY m.started desc
            OFFSET ${start}
            LIMIT ${count}
          `;
        }

        // This will not automatically fetch needed match ids
        // const matches = matchIds;

        const matches = await this.prisma.match.findMany({
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

        console.log(matches[0]);

        return {
            total: matches.length,
            matches,
        };
    }

    @ResolveField()
    async players(@Parent() match: Match) {
        return match.players || this.prisma.match
            .findOne({
                where: {
                    match_id: match.match_id
                },
            })
            .players();
    }

    @ResolveField()
    async started(@Parent() match: Match) {
        return fromUnixTime(match.started as unknown as number);
    }

    @ResolveField()
    async finished(@Parent() match: Match) {
        return match.finished ? fromUnixTime(match.finished as unknown as number) : null;
    }
}
