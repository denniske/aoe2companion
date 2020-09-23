import {objectType} from "@nexus/schema";
import {fromUnixTime} from "date-fns";
import {prisma} from "../db";

export const User = objectType({
  name: 'User',
  definition(t) {
    t.int('profile_id')
    t.string('name')
    t.string('country', { nullable: true })
    t.int('games', { nullable: true })
  },
})

// export const UserList = objectType({
//   name: 'UserList',
//   definition(t) {
//     t.int('total')
//     t.list.field('matches', { type: 'Match'})
//   },
// })
