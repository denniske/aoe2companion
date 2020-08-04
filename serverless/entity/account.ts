import {Entity, Column, PrimaryColumn, OneToMany} from "typeorm";
import {Following} from "./following";

@Entity()
export class Account {
    @PrimaryColumn()
    id: string;

    @Column({ nullable: true })
    push_token?: string;

    @OneToMany(type => Following, following => following.account, { cascade: true })
    followings?: Following[];
}
