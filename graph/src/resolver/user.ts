import {
    Args, ArgsType, Field, Mutation, Parent, Query, ResolveField, Resolver, Root
} from "@nestjs/graphql";
import {createDB} from "../db";
import {Match, MatchList} from "../object/match";
import {upsertMatchesWithPlayers} from "../entity/entity-helper";
import {PrismaClient} from "@prisma/client";
import {fetchMatch} from "../helper";
import {myTodoList} from "@nex/data";
import {fromUnixTime} from "date-fns";
import {User} from "../object/user";

const prisma = new PrismaClient()

@Resolver(of => User)
export class UserResolver {

    @Query(returns => [User])
    async users(
        @Args("search") search: string,
    ) {
        search = `%${search}%`;

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
    }
}