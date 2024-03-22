import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Role } from "./role.entity";
import { Api } from "./api.entity";

@Entity('permission')
export class Permission {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    api_id: number;

    @Column()
    role_id: number;

    @ManyToOne(() => Role, (role) => role.permission)
    @JoinColumn({ name: 'role_id', referencedColumnName: 'id', foreignKeyConstraintName: 'FK_permission_role_id' })
    role: Role

    @ManyToOne(() => Api, (api) => api.permission)
    @JoinColumn({ name: 'api_id', referencedColumnName: 'id', foreignKeyConstraintName: 'FK_permission_api_id' })
    api: Api

}