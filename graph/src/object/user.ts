import {Field, Int, ObjectType, Parent, ResolveField} from '@nestjs/graphql';


@ObjectType()
export class User {
    @Field(type => Int)
    profile_id: number;

    @Field()
    name: string;

    @Field({nullable: true})
    country?: string;

    @Field(type => Int, {nullable: true})
    games?: number;
}
