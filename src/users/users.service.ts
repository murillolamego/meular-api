import * as argon2 from 'argon2';

import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor() {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      createUserDto.password = await argon2.hash(createUserDto.password);

      const user = new UserEntity();

      return user;
    } catch (error) {
      throw new ServiceUnavailableException('User creation on database failed');
    }
  }

  async findAll(): Promise<UserEntity[]> {
    try {
      const user = new UserEntity();

      return [user];
    } catch (error) {
      throw new ServiceUnavailableException(
        'Fetching users from database failed',
      );
    }
  }

  async findOne(id: string): Promise<UserEntity> {
    try {
      const user = new UserEntity();

      return user;
    } catch (error) {
      throw new ServiceUnavailableException(
        `Fetching user with id ${id} from database failed`,
      );
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    try {
      const user = new UserEntity();

      return user;
    } catch (error) {
      throw new ServiceUnavailableException(
        `Updating user with id ${id} on database failed, params: ${updateUserDto}`,
      );
    }
  }

  async remove(id: string): Promise<UserEntity> {
    try {
      const user = new UserEntity();

      return user;
    } catch (error) {
      throw new ServiceUnavailableException(
        `Removing user with id ${id} on database failed`,
      );
    }
  }
}
