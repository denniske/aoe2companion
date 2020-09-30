import {Args, Query, Resolver} from "@nestjs/graphql";
import {User} from "../object/user";
import {PrismaService} from "../service/prisma.service";


@Resolver(of => User)
export class UserResolver {

    constructor(
        private prisma: PrismaService,
    ) {}

    @Query(returns => [User])
    async users(
        @Args("search") search: string,
    ) {
        search = `%${search}%`;

        const users = await this.prisma.$queryRaw`
          SELECT profile_id, MIN(name) as name, MIN(country) as country, SUM(games) as games
          FROM leaderboard_row
          WHERE name ILIKE ${search}
          GROUP BY profile_id
          ORDER BY SUM(games) desc
          LIMIT 1000
        `;

        // console.log('users', users);

        return users;
    }
}
