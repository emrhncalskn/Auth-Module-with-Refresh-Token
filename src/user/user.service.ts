import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Encryptor } from 'src/auth/encryptor/encryptor';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private encryptor: Encryptor
  ) { }

  async create(userDto: CreateUserDto) {
    const userExists = await this.findOneWithEmail(userDto.email);
    if (userExists) { throw new HttpException({ message: 'Email is already registered. Please login.' }, 400) }
    userDto.password = await this.encryptor.hashPassword(userDto.password);
    userDto.status = 0;
    const user = this.userRepository.create({ ...userDto, role_id: 1 });
    await this.userRepository.save(user);
    const { password, ...result } = user
    return result;
  }

  async findOneWithEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findwithID(user_id: number) {
    return await this.userRepository.findOne({ where: { id: user_id } });
  }

  async update(user_id: number, userDto: UpdateUserDto) {
    const user = await this.findwithID(user_id);
    if (user) {
      if (userDto.password) {
        userDto.password = await this.encryptor.hashPassword(userDto.password);
      }
      Object.assign(user, userDto);
      await this.userRepository.save(user);
      return await this.findwithID(user_id);
    }
    throw new HttpException({ message: 'User not found' }, 404);
  }


}
