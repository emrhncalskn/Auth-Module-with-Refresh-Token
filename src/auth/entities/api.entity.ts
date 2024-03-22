import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Permission } from "./permission.entity";

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