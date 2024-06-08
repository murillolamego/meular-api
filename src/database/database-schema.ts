import { createId } from '@paralleldrive/cuid2';
import { text, pgTable, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  email: text('email').unique().notNull(),
  username: text('username').unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  refreshToken: text('refresh_token'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const databaseSchema = {
  users,
};
