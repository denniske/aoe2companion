import {objectType} from "@nexus/schema";
import {fromUnixTime} from "date-fns";
import {prisma} from "../db";

export const RatingHistory = objectType({
  name: 'RatingHistory',
  definition(t) {
    t.int('leaderboard_id')
    t.int('profile_id')
    t.list.field('history', { type: 'RatingHistoryEntry' })
  },
})

export const RatingHistoryEntry = objectType({
  name: 'RatingHistoryEntry',
  definition(t) {
    t.int('rating')
    t.int('num_wins')
    t.int('num_losses')
    t.int('streak')
    t.int('drops')
    t.datetime('timestamp', { resolve: (x: any) => fromUnixTime(x.timestamp), nullable: false })
  },
})
