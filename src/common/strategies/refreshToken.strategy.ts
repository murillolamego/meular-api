import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { FastifyRequest } from 'fastify';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  validate(req: FastifyRequest, payload: any) {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return { payload, refreshToken: null };
    }
    const refreshToken = authorization.replace('Bearer', '').trim();
    return { ...payload, refreshToken };
  }
}
