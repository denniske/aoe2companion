import {objectType} from "@nexus/schema";
import {prisma} from "../db";

export const Player = objectType({
  name: 'Player',
  definition(t) {
    t.string('match_id')
    t.int('profile_id')
    t.string('name', {nullable: true})
    t.int('rating', {nullable: true})
    t.int('civ', {nullable: true})
    t.int('slot')
    t.int('slot_type')
    t.int('team', {nullable: true})
    t.int('color', {nullable: true})
    t.boolean('won', {nullable: true})

    // t.field('match', {
    //   type: 'Match',
    //   resolve: parent =>
    //     prisma.player
    //       .findOne({
    //         where: { match_id_profile_id: { match_id: parent.match_id, profile_id: parent.profile_id } },
    //       })
    //       .match(),
    // })
  },
})
