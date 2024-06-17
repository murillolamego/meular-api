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
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ValidateEmailDto } from './dto/validate-email.dto';

// Only select SAFE columns, omit id, password, refresh tokens, etc
const {
  id,
  password,
  refreshToken,
  emailValidated,
  emailValidationToken,
  createdAt,
  updatedAt,
  deletedAt,
  ...safeUserColumns
} = getTableColumns(databaseSchema.users);

export const safeUser = safeUserColumns;

@Injectable()
export class UsersService {
  constructor(
    private readonly drizzleService: DrizzleService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  async create({ email, name, password }: CreateUserDto): Promise<UserEntity> {
    let createdUser: UserEntity[] = [];
    let token = randomBytes(25).toString('hex');

    try {
      const hashedToken = await argon2.hash(token);

      password = await argon2.hash(password);
      createdUser = await this.drizzleService.db
        .insert(databaseSchema.users)
        .values({
          email,
          name,
          password,
          emailValidationToken: hashedToken,
        })
        .returning(safeUser);
      if (!createdUser.length) {
        throw new ServiceUnavailableException();
      }
    } catch (error) {
      throw new ServiceUnavailableException('user creation on database failed');
    }

    try {
      await this.mailerService.sendMail({
        to: 'murillolamegolopes@live.com',
        from: this.configService.get<string>('EMAIL_FROM'),
        subject: `Email validation for <${createdUser[0].email}>`,
        template: 'email-validation',
        context: {
          email: createdUser[0].email,
          name: createdUser[0].name,
          token,
        },
      });
    } catch (error) {
      throw new ServiceUnavailableException(`Sending email failed`);
    }

    return createdUser[0];
  }

  async findAll(): Promise<UserEntity[]> {
    try {
      return await this.drizzleService.db
        .select(safeUser)
        .from(databaseSchema.users);
    } catch (error) {
      throw new ServiceUnavailableException(
        'fetching users from database failed',
      );
    }
  }

  async findOne(publicId: string): Promise<UserEntity> {
    try {
      const users: UserEntity[] = await this.drizzleService.db
        .select(safeUser)
        .from(databaseSchema.users)
        .where(eq(databaseSchema.users.publicId, publicId))
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

  async findOneByEmail(email: string): Promise<UserEntity> {
    try {
      const users: UserEntity[] = await this.drizzleService.db
        .select(safeUser)
        .from(databaseSchema.users)
        .where(eq(databaseSchema.users.email, email))
        .limit(1);
      if (!users.length) {
        throw new NotFoundException();
      }
      return users[0];
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`user with email ${email} not found`);
      }
      throw new ServiceUnavailableException(
        `fetching user with email ${email} from database failed`,
      );
    }
  }

  async validateEmail({ publicId, token }: ValidateEmailDto): Promise<void> {
    try {
      const validateEmail = await this.drizzleService.db
        .select()
        .from(databaseSchema.users)
        .where(eq(databaseSchema.users.publicId, publicId))
        .limit(1);
      if (!validateEmail.length) {
        throw new NotFoundException('invalid token provided');
      }

      if (
        validateEmail[0].emailValidated ||
        !validateEmail[0].emailValidationToken
      ) {
        throw new BadRequestException('user already active');
      }

      if (
        new Date().getTime() - new Date(validateEmail[0].createdAt).getTime() >
        Number(
          this.configService.get<string>('EMAIL_VALIDATION_DURATION_IN_DAYS'),
        ) *
          24 *
          60 *
          60 * // seconds
          1000 // milliseconds
      ) {
        throw new BadRequestException('expired token provided');
      }

      const validateEmailMatch = await argon2.verify(
        validateEmail[0].emailValidationToken as string,
        token,
      );

      if (!validateEmailMatch) {
        throw new NotFoundException('invalid token provided');
      }

      const updatedUsers = await this.drizzleService.db
        .update(databaseSchema.users)
        .set({ emailValidated: true, emailValidationToken: null })
        .where(eq(databaseSchema.users.publicId, validateEmail[0].publicId))
        .returning(safeUser);

      if (!updatedUsers.length) {
        throw new ServiceUnavailableException();
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new ServiceUnavailableException(
        `fetching password recovery token from database failed`,
      );
    }
  }

  async forgotPassword(email: string): Promise<void> {
    let users: UserEntity[] = [];
    let token = randomBytes(25).toString('hex');

    try {
      users = await this.drizzleService.db
        .select(safeUser)
        .from(databaseSchema.users)
        .where(eq(databaseSchema.users.email, email))
        .limit(1);
      if (!users.length) {
        throw new NotFoundException();
      }

      const hashedToken = await argon2.hash(token);

      const createdPasswordRecovery = await this.drizzleService.db
        .insert(databaseSchema.passwordRecovery)
        .values({
          userId: users[0].publicId,
          token: hashedToken,
        })
        .returning();
      if (!createdPasswordRecovery.length) {
        throw new ServiceUnavailableException();
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`user with email ${email} not found`);
      }
      throw new ServiceUnavailableException(
        `fetching user with email ${email} from database failed`,
      );
    }

    try {
      await this.mailerService.sendMail({
        to: 'murillolamegolopes@live.com',
        from: this.configService.get<string>('EMAIL_FROM'),
        subject: `Password recovery requested for <${email}>`,
        template: 'forgot-password',
        context: {
          email: users[0].email,
          name: users[0].name,
          token,
        },
      });
    } catch (error) {
      throw new ServiceUnavailableException(`Sending email failed`);
    }
  }

  async resetPassword({
    publicId,
    token,
    password,
  }: ResetPasswordDto): Promise<void> {
    try {
      const passwordRecovery = await this.drizzleService.db
        .select()
        .from(databaseSchema.passwordRecovery)
        .where(eq(databaseSchema.passwordRecovery.publicId, publicId))
        .limit(1);
      if (!passwordRecovery.length) {
        throw new NotFoundException('invalid token provided');
      }

      if (
        new Date().getTime() -
          new Date(passwordRecovery[0].createdAt).getTime() >
        Number(
          this.configService.get<string>(
            'PASSWORD_RECOVERY_DURATION_IN_MINUTES',
          ),
        ) *
          60 * // seconds
          1000 // milliseconds
      ) {
        throw new BadRequestException('expired token provided');
      }

      const passwordRecoveryMatch = await argon2.verify(
        passwordRecovery[0].token,
        token,
      );
      if (!passwordRecoveryMatch) {
        throw new NotFoundException('invalid token provided');
      }

      const hashedPassword = await argon2.hash(password);

      const updatedUsers = await this.drizzleService.db
        .update(databaseSchema.users)
        .set({ password: hashedPassword })
        .where(eq(databaseSchema.users.publicId, passwordRecovery[0].userId))
        .returning(safeUser);

      if (!updatedUsers.length) {
        throw new ServiceUnavailableException();
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new ServiceUnavailableException(
        `fetching password recovery token from database failed`,
      );
    }
  }

  async update(
    publicId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    try {
      const updatedUsers = await this.drizzleService.db
        .update(databaseSchema.users)
        .set(updateUserDto)
        .where(eq(databaseSchema.users.publicId, publicId))
        .returning(safeUser);

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

  async remove(publicId: string): Promise<UserEntity> {
    try {
      const deletedUsers = await this.drizzleService.db
        .delete(databaseSchema.users)
        .where(eq(databaseSchema.users.publicId, publicId))
        .returning(safeUser);

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
