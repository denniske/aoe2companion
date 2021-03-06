import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn} from "typeorm";

@Entity()
export class Push {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    body: string;

    @Column({ nullable: true })
    push_token?: string;

    @Column({ nullable: true })
    push_token_web?: string;

    @Column({ nullable: true })
    status?: string;

    @CreateDateColumn({ type: 'timestamp', default: () => `timezone('utc', now())`, readonly: true })
    created_at: Date;
}
