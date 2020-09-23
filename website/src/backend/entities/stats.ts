import {objectType} from "@nexus/schema";
import {fromUnixTime} from "date-fns";
import {prisma} from "../db";

export const Stats = objectType({
  name: 'Stats',
  definition(t) {
    t.int('leaderboard_id')
    t.list.field('civ', { type: 'StatsEntry' })
    t.list.field('map_type', { type: 'StatsEntry' })
    t.list.field('allies', { type: 'StatsEntry' })
    t.list.field('opponents', { type: 'StatsEntry' })
  },
})

export const StatsEntry = objectType({
  name: 'StatsEntry',
  definition(t) {
    t.int('civ', {nullable: true})
    t.int('map_type', {nullable: true})
    t.int('profile_id', {nullable: true})
    t.string('name', {nullable: true})
    t.string('country', {nullable: true})
    t.int('games')
    t.int('wins')
  },
})
