import {Entity, Column, PrimaryColumn, OneToMany} from "typeorm";
import {IAccount, IFollowing} from "./entity.type";

@Entity()
export class Account implements IAccount {
    @PrimaryColumn()
    id: string;

    @Column({ nullable: true })
    profile_id?: number;

    @Column({ nullable: true })
    steam_id?: string;

    @Column({ nullable: true })
    push_token?: string;

    @OneToMany('Following', 'account', { cascade: true })
    followings?: IFollowing[];
}
