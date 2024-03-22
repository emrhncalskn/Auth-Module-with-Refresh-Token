import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Role } from '../../auth/entities/role.entity'

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
    role_id: number;
    @Column()
    status: number;
    @Column()
    refresh_token: string;
    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => Role, (role) => role.user)
    @JoinColumn({ name: 'role_id', referencedColumnName: 'id', foreignKeyConstraintName: 'FK_user_role_id' })
    role: Role

}