import {Parent, ResolveField, Resolver} from "@nestjs/graphql";
import {PrismaClient} from "@prisma/client";
import {fromUnixTime} from "date-fns";
import {Leaderboard} from "../object/leaderboard";


const prisma = new PrismaClient()

@Resolver(of => Leaderboard)
export class LeaderboardResolver {

    @ResolveField()
    async last_match_time(@Parent() leaderboard: Leaderboard) {
        return fromUnixTime(leaderboard.last_match_time as unknown as number);
    }
}