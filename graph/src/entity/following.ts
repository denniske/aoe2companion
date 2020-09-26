import {Entity, Column, PrimaryColumn, UpdateDateColumn, ManyToOne} from "typeorm";
import {IAccount, IFollowing} from "./entity.type";

@Entity()
export class Following implements IFollowing {
    @ManyToOne('Account', 'followings', { primary: true })
    account: IAccount;

    @PrimaryColumn()
    profile_id: number;

    @Column({nullable: true})
    enabled?: boolean;

    @UpdateDateColumn()
    updated_at: string;
}
