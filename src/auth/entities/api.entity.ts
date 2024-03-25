import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index } from "typeorm";
import { Permission } from "./permission.entity";

@Index("IDX_api_method_path", ['path', 'method'], { unique: true })
@Entity('api')
export class Api {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    path: string;

    @Column()
    method: string;

    @Column({ nullable: true })
    description: string;

    @OneToMany(() => Permission, (permission) => permission.api)
    permission: Permission[];

}