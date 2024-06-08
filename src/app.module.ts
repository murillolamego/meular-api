import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        `.env.${process.env.ENVIRONMENT}`,
        '.env.development.local',
        '.env.test.local',
      ],
      isGlobal: true,
      cache: true,
      expandVariables: true,
    }),
    UsersModule,
  ],
})
export class AppModule {}
