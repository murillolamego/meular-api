import * as argon2 from 'argon2';

import {
  Injectable,
  ServiceUnavailableException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { DrizzleService } from '../database/drizzle.service';
import { databaseSchema } from '../database/database-schema';
import { eq, getTableColumns } from 'drizzle-orm';
import { NotFoundException } from '@nestjs/common/exceptions';

function dbConstraintFail(constraint: string) {
  return `${constraint.split('_')[1]} already exists`;
}

// Only select safe columns, omit password, refresh tokens, etc
const { password, refreshToken, ...safeUserCols } = getTableColumns(
  databaseSchema.users,
);

export const safeUser = safeUserCols;

@Injectable()
export class UsersService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      createUserDto.password = await argon2.hash(createUserDto.password);
      const createdUser = await this.drizzleService.db
        .insert(databaseSchema.users)
        .values(createUserDto)
        .returning(safeUserCols);

      return createdUser[0];
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException(dbConstraintFail(error.constraint));
      }
      throw new ServiceUnavailableException('user creation on database failed');
    }
  }

  async findAll(): Promise<UserEntity[]> {
    try {
      return await this.drizzleService.db
        .select(safeUserCols)
        .from(databaseSchema.users);
    } catch (error) {
      throw new ServiceUnavailableException(
        'fetching users from database failed',
      );
    }
  }

  async findOne(id: string): Promise<UserEntity> {
    try {
      const users: UserEntity[] = await this.drizzleService.db
        .select(safeUserCols)
        .from(databaseSchema.users)
        .where(eq(databaseSchema.users.id, id))
        .limit(1);
      if (!users.length) {
        throw new NotFoundException();
      }
      return users[0];
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`user with id ${id} not found`);
      }
      throw new ServiceUnavailableException(
        `fetching user with id ${id} from database failed`,
      );
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    try {
      const updatedUsers = await this.drizzleService.db
        .update(databaseSchema.users)
        .set(updateUserDto)
        .where(eq(databaseSchema.users.id, id))
        .returning(safeUserCols);

      if (!updatedUsers.length) {
        throw new NotFoundException();
      }
      return updatedUsers[0];
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`user with id ${id} not found`);
      }
      throw new ServiceUnavailableException(
        `updating user with id ${id} on database failed, params: ${updateUserDto}`,
      );
    }
  }

  async remove(id: string): Promise<UserEntity> {
    try {
      const deletedUsers = await this.drizzleService.db
        .delete(databaseSchema.users)
        .where(eq(databaseSchema.users.id, id))
        .returning(safeUserCols);

      if (!deletedUsers.length) {
        throw new NotFoundException();
      }

      return deletedUsers[0];
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`user with id ${id} not found`);
      }
      throw new ServiceUnavailableException(
        `removing user with id ${id} on database failed`,
      );
    }
  }
}
