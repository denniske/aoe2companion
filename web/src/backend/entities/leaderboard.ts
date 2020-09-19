import {objectType} from "@nexus/schema";
import {fromUnixTime} from "date-fns";
import {prisma} from "../db";

export const Leaderboard = objectType({
  name: 'Leaderboard',
  definition(t) {
    t.int('leaderboard_id')
    t.int('profile_id')
    t.string('steam_id', {nullable: true})
    t.string('name')
    t.string('country', {nullable: true})
    t.string('clan', {nullable: true})
    t.string('icon', {nullable: true})
    t.int('rating', {nullable: true})
    t.int('highest_rating', {nullable: true})
    t.int('previous_rating', {nullable: true})
    t.int('games', {nullable: true})
    t.int('wins', {nullable: true})
    t.int('losses', {nullable: true})
    t.int('drops', {nullable: true})
    t.int('streak', {nullable: true})
    t.int('lowest_streak', {nullable: true})
    t.int('highest_streak', {nullable: true})
    t.string('last_match', {nullable: true})
    t.datetime('last_match_time', { nullable: true, resolve: (x: any) => x.last_match_time ? fromUnixTime(x.last_match_time) : null })
  },
})
