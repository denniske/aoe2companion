import {Field, Int, ObjectType, Parent, ResolveField} from '@nestjs/graphql';
import {Player} from "./player";


@ObjectType()
export class Match {
    @Field()
    match_id: string;

    @Field()
    name: string;

    @Field(type => Int, {nullable: true})
    leaderboard_id?: number;

    @Field(type => Int)
    map_type: number;

    @Field(type => Int)
    speed: number;

    @Field(type => Int)
    num_players: number;

    @Field()
    started: Date;

    @Field({nullable: true})
    finished?: Date;

    @Field(type => [Player])
    players: Player[];
}

@ObjectType()
export class MatchList {
    @Field(type => Int)
    total: number;

    @Field(type => [Match])
    matches: Match[];
}


// export const Match = objectType({
//   name: 'Match',
//   definition: function (t) {
//     t.string('match_id')
//     t.string('name')
//     t.int('leaderboard_id')
//     t.int('map_type')
//     t.datetime('started', { resolve: (x: any) => fromUnixTime(x.started), nullable: false })
//     t.datetime('finished', { resolve: (x: any) => x.finished ? fromUnixTime(x.finished) : null, nullable: true })
//
//     t.list.field('players', {
//       type: 'Player',
//       resolve: parent => {
//
//         // console.log('PARENT', parent);
//         return (parent as any).players || prisma.match
//             .findOne({
//               where: {match_id: parent.match_id},
//             })
//             .players();
//       },
//     })
//   },
// })
//
// export const MatchList = objectType({
//   name: 'MatchList',
//   definition(t) {
//     t.int('total')
//     t.list.field('matches', { type: 'Match'})
//   },
// })
