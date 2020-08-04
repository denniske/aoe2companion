import {Entity, Column, PrimaryColumn, UpdateDateColumn} from "typeorm";

@Entity()
export class Following {
    @PrimaryColumn()
    push_token: string;

    @PrimaryColumn()
    profile_id: number;

    @Column({nullable: true})
    enabled?: boolean;

    @Column({nullable: true})
    token_profile_id?: number;

    @UpdateDateColumn()
    updated_at: string;
}
