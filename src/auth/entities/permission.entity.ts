import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Api } from "./api.entity";
import { Role } from "./role.entity";

@Index("IDX_permission_api_id_role_id", ['api_id', 'role_id'], { unique: true })
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