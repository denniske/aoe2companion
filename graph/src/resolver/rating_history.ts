import {Parent, ResolveField, Resolver} from "@nestjs/graphql";
import {fromUnixTime} from "date-fns";
import {RatingHistory, RatingHistoryEntry} from "../object/rating_history";


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
