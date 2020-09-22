import {Parent, ResolveField, Resolver} from "@nestjs/graphql";
import {PrismaClient} from "@prisma/client";
import {fromUnixTime} from "date-fns";
import {Leaderboard} from "../object/leaderboard";
import {LeaderboardRow} from "../entity/leaderboard-row";


const prisma = new PrismaClient()

@Resolver(of => Leaderboard)
export class LeaderboardResolver {

    // @ResolveField()
    // async rank(@Parent() leaderboard: Leaderboard) {
    //
    //     return leaderboard.leaderboard_id * 100;
    //
    //     // const agg = await prisma.leaderboard_row.aggregate({
    //     //     count: true,
    //     //     where: {
    //     //         leaderboard_id: leaderboard.leaderboard_id,
    //     //         rating: { gte: leaderboard.rating },
    //     //     },
    //     // });
    //     //
    //     // return agg.count;
    //
    //     // const users = await connection
    //     //     .createQueryBuilder()
    //     //     .select('*')
    //     //     .addSelect(subQuery => {
    //     //         return subQuery
    //     //             .select('count(user.name)', 'rank')
    //     //             .from(LeaderboardRow, "user")
    //     //             .where('user.leaderboard_id = :leaderboardId AND user.rating >= outer.rating', {leaderboardId});
    //     //     })
    //     //     .from(LeaderboardRow, "outer")
    //     //     .where(where)
    //     //     .getRawMany();
    // }

    @ResolveField()
    async last_match_time(@Parent() leaderboard: Leaderboard) {
        return fromUnixTime(leaderboard.last_match_time as unknown as number);
    }
}