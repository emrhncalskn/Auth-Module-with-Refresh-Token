import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('user')
export class User {

    static TABLE_NAME = 'user';
    static ALIAS = 'u';

    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    email: string;
    @Column()
    password: string;
    @Column()
    status: number;
    @Column()
    refresh_token: string;
    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;

}