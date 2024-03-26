import { User } from "src/user/entities/user.entity";

export interface ICurrentUser extends Omit<User, 'password'> { }
