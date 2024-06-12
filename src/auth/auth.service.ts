import * as argon2 from 'argon2';

import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { SignInDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';
import { safeUser } from '../users/users.service';
import { UnsafeUserEntity } from '../users/entities/user.entity';
import { DrizzleService } from '../database/drizzle.service';
import { databaseSchema } from '../database/database-schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly drizzleService: DrizzleService,
  ) {}

  async signIn({ email, password }: SignInDto) {
    try {
      const users: UnsafeUserEntity[] = await this.drizzleService.db
        .select()
        .from(databaseSchema.users)
        .where(eq(databaseSchema.users.email, email))
        .limit(1);
      if (!users.length) {
        throw new NotFoundException();
      }

      const passwordMatch = await argon2.verify(users[0].password, password);

      if (!passwordMatch) {
        throw new UnauthorizedException();
      }

      const tokens = await this.getTokens(users[0].publicId, users[0].name);

      await this.setRefreshToken(users[0].publicId, tokens.refreshToken);

      return tokens;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`user with email ${email} not found`);
      }
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException(
          'invalid credentials provided, please try again',
        );
      }
      throw new InternalServerErrorException();
    }
  }

  async signOut(userId: string) {
    this.setRefreshToken(userId, null);
  }

  async setRefreshToken(userId: string, refreshToken: string | null) {
    if (refreshToken) {
      refreshToken = await argon2.hash(refreshToken);
    }
    const updatedUsers = await this.drizzleService.db
      .update(databaseSchema.users)
      .set({ refreshToken })
      .where(eq(databaseSchema.users.publicId, userId))
      .returning(safeUser);

    if (!updatedUsers.length) {
      throw new NotFoundException();
    }
  }

  async getTokens(userId: string, name: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          name,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '7d', // 5m
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          name,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const users: UnsafeUserEntity[] = await this.drizzleService.db
      .select()
      .from(databaseSchema.users)
      .where(eq(databaseSchema.users.publicId, userId))
      .limit(1);
    if (!users.length) {
      throw new NotFoundException();
    }
    if (!users[0] || !users[0].refreshToken) {
      throw new UnauthorizedException(
        'invalid credentials provided, please try again',
      );
    }
    const refreshTokenMatches = await argon2.verify(
      users[0].refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) {
      throw new UnauthorizedException(
        'invalid credentials provided, please try again',
      );
    }
    const tokens = await this.getTokens(users[0].publicId, users[0].name);
    await this.setRefreshToken(users[0].publicId, tokens.refreshToken);
    return tokens;
  }
}
