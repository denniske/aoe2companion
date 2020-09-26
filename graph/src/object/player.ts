import {Field, Int, ObjectType, Parent, ResolveField} from '@nestjs/graphql';

@ObjectType()
export class Player {
    @Field()
    match_id: string;

    @Field(type => Int)
    profile_id: number;

    @Field({nullable: true})
    name?: string;

    @Field(type => Int, {nullable: true})
    rating?: number;

    @Field(type => Int, {nullable: true})
    civ?: number;

    @Field(type => Int)
    slot: number;

    @Field(type => Int)
    slot_type: number;

    @Field(type => Int, {nullable: true})
    team?: number;

    @Field(type => Int, {nullable: true})
    color?: number;

    @Field({nullable: true})
    won?: boolean;
}
