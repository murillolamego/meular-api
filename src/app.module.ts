import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { PropertyCategoriesModule } from './property-categories/property-categories.module';
import { PropertyTypesModule } from './property-types/property-types.module';
import { PropertiesModule } from './properties/properties.module';

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
    ThrottlerModule.forRoot([
      {
        ttl: 6,
        limit: 10,
      },
    ]),
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
    AuthModule,
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'sandbox.smtp.mailtrap.io',
          secure: false,
          port: 2525,
          auth: {
            user: '926b050385faf4',
            pass: 'dd43bf302b5ad1',
          },
          ignoreTLS: true,
        },
        defaults: {
          from: '"MeuLar.com" <hi@meular.com>',
        },
        preview: true,
        template: {
          dir: __dirname + '/common/mail/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    PropertyCategoriesModule,
    PropertyTypesModule,
    PropertiesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
