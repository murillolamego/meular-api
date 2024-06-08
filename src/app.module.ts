import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';

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
    DatabaseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        host: String(configService.get<string>('DATABASE_HOST')),
        port: Number(configService.get<number>('DATABASE_PORT')),
        user: String(configService.get<string>('DATABASE_USER')),
        password: String(configService.get<string>('DATABASE_PASSWORD')),
        database: String(configService.get<string>('DATABASE_NAME')),
      }),
    }),
    UsersModule,
  ],
})
export class AppModule {}
