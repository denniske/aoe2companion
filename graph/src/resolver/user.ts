import {Args, Int, Query, Resolver} from "@nestjs/graphql";
import {User} from "../object/user";
import {PrismaService} from "../service/prisma.service";


@Resolver(of => User)
export class UserResolver {

    constructor(
        private prisma: PrismaService,
    ) {}

    @Query(returns => [User])
    async users(
        @Args("start", {type: () => Int }) start: number,
        @Args("count", {type: () => Int }) count: number,
        @Args("search") search: string,
    ) {
        if (count > 1000) throw Error('count must be <= 1000');

        search = `%${search}%`;

        // Order by relevance
        // https://stackoverflow.com/questions/14707799/query-and-sort-by-relevance

        const users = await this.prisma.$queryRaw`
          SELECT profile_id, MIN(name) as name, MIN(country) as country, SUM(games) as games
          FROM leaderboard_row
          WHERE name ILIKE ${search}
          GROUP BY profile_id
          ORDER BY SUM(games) desc, MIN(Name)
          OFFSET ${start}
          LIMIT ${count}
        `;

        // console.log('users', users);

        return users;
    }
}
