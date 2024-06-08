import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { SignInDto } from './dto/auth.dto';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { RefreshTokenGuard } from '../common/guards/refreshToken.guard';
import { Throttle } from '@nestjs/throttler';

type JWTUser = { sub: string; refreshToken: string };
type SessionRequest = Request & { user: JWTUser };

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get('sign-out')
  signOut(@Req() req: SessionRequest) {
    return this.authService.signOut(req.user['sub']);
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiBearerAuth()
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: SessionRequest) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
