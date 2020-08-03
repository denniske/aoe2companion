import {Entity, Column, PrimaryColumn} from "typeorm";

@Entity()
export class Following {
    @PrimaryColumn()
    push_token: string;

    @PrimaryColumn()
    profile_id: number;
}
