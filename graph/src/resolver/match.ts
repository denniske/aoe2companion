import {
    Args, ArgsType, Field, Int, Mutation, Parent, Query, ResolveField, Resolver, Root
} from "@nestjs/graphql";
import {Match, MatchList} from "../object/match";
import {upsertMatchesWithPlayers} from "../entity/entity-helper";
import {fetchMatch} from "../helper";
import {myTodoList} from "@nex/data";
import {fromUnixTime, getUnixTime, subHours} from "date-fns";
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
        @Args("ongoing", { defaultValue: false }) ongoing?: boolean,
    ) {
        // await sleep(200);

        // https://niallburkley.com/blog/index-columns-for-like-in-postgres/

        if (count > 1000) throw Error('count must be <= 1000');

        // search = `%${search}%`;
        search = `%%`;

        const sixHoursAgo = getUnixTime(subHours(new Date(), 6));

        let matchIds: any;
        if (leaderboard_id != null) {
            matchIds = await this.prisma.$queryRaw`
            SELECT m.match_id
            FROM player as p
            JOIN match as m ON m.match_id = p.match_id
            WHERE (${!ongoing} OR (m.started > ${sixHoursAgo} AND m.finished is null))
              AND m.leaderboard_id=${leaderboard_id}
              AND profile_id IN (${join(profile_ids)})
              AND (p.name ILIKE ${search} OR m.name ILIKE ${search})
            GROUP BY m.match_id, m.started
            ORDER BY m.started desc
            OFFSET ${start}
            LIMIT ${count}
          `;
        } else {
            matchIds = await this.prisma.$queryRaw`
            SELECT m.match_id
            FROM player as p
            JOIN match as m ON m.match_id = p.match_id
            WHERE (${!ongoing} OR (m.started > ${sixHoursAgo} AND m.finished is null))
              AND profile_id IN (${join(profile_ids)})
              AND (p.name ILIKE ${search} OR m.name ILIKE ${search})
            GROUP BY m.match_id, m.started
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

        // console.log(matches[0]);

        // const timeLastDate2 = new Date();
        // const ongoing = await this.prisma.ongoing.findMany({
        //     where: {
        //         match_id: {in: matchIds.map(x => x.match_id)}
        //     },
        // });
        // console.log('gql', new Date().getTime() - timeLastDate2.getTime());
        //
        // const timeLastDate3 = new Date();
        // ongoing.forEach(o => {
        //     matches.find(m => m.match_id === o.match_id).checked = o.checked;
        // });
        // console.log('gql', new Date().getTime() - timeLastDate3.getTime());

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

    @ResolveField()
    async checked(@Parent() match: Match) {
        return match.checked ? fromUnixTime(match.checked as unknown as number) : null;
    }
}
