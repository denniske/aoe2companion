import {mutationType, objectType} from "@nexus/schema";
import {prisma} from "./db";

export const Mutation = mutationType({
  definition(t) {

    t.field('publish', {
      type: 'Int',
      nullable: true,
      args: {
      },
      resolve: async (_, { postId }, ctx) => {
        return (await prisma.match.updateMany({
          // where: { match_id: '16331657' },
          where: {
            AND: [
              { players: { some: { profile_id: 196240 } } },
              { players: { some: { profile_id: 197930 } } },
              // { players: { some: { profile_id: 199325 } } },
            ],
          },
          data: { maybe_finished: 1 },
        })).count;
      },
    })


  },
})
