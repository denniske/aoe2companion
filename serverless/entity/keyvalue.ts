import {Entity, Column, PrimaryColumn} from "typeorm";

@Entity()
export class KeyValue {
    @PrimaryColumn()
    id: string;

    @Column('jsonb')
    value: any;
}
