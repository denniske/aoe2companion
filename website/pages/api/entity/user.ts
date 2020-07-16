import {Entity, Column, PrimaryColumn} from "typeorm";

@Entity()
export class User {
    @PrimaryColumn()
    id: number;

    @Column()
    rank: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    country?: string;

    @Column('jsonb')
    data: any;
}
