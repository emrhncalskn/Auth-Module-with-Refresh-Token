import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Permission } from "./permission.entity";

@Entity('role')
export class Role {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => User, (user) => user.role)
  user: User[]

  @OneToMany(() => Permission, (permission) => permission.role)
  permission: Permission[];

}