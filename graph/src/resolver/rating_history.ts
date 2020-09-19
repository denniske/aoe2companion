import {Parent, ResolveField, Resolver} from "@nestjs/graphql";
import {PrismaClient} from "@prisma/client";
import {fromUnixTime} from "date-fns";
import {Leaderboard} from "../object/leaderboard";
import {RatingHistory, RatingHistoryEntry} from "../object/rating_history";


const prisma = new PrismaClient()

@Resolver(of => RatingHistory)
export class RatingHistoryResolver {

}

@Resolver(of => RatingHistoryEntry)
export class RatingHistoryEntryResolver {

    @ResolveField()
    async timestamp(@Parent() ratingHistoryEntry: RatingHistoryEntry) {
        return fromUnixTime(ratingHistoryEntry.timestamp as unknown as number);
    }
}
