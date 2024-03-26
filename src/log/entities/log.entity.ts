import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('log')
export class Log {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    method: string;
    @Column()
    api: string;
    @Column({ type: 'longtext', nullable: true })
    body: string;
    @Column({ type: 'text', nullable: true })
    params: string;
    @Column({ type: 'text', nullable: true })
    query: string;
    @Column({ type: 'text', nullable: true })
    headers: string;
    @Column({ type: 'longtext' })
    response_body: string;
    @Column()
    status_code: number;
    @Column()
    unique_code: string;
    @CreateDateColumn()
    created_at: Date;
}
