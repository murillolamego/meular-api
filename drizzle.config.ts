import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export default defineConfig({
  schema: './src/database/database-schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: String(configService.get<string>('DATABASE_URL')),
  },
});
