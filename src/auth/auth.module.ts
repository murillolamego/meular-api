import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { AccessTokenStrategy } from '../common/strategies/accessToken.strategy';
import { RefreshTokenStrategy } from '../common/strategies/refreshToken.strategy';

@Module({
  imports: [JwtModule.register({})],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    UsersService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
