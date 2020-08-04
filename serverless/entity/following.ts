import {Entity, Column, PrimaryColumn, UpdateDateColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Account} from "./account";

@Entity()
export class Following {
    @ManyToOne(type => Account, account => account.followings, { primary: true })
    account: Account;

    @PrimaryColumn()
    profile_id: number;

    @Column({nullable: true})
    enabled?: boolean;

    @UpdateDateColumn()
    updated_at: string;
}
