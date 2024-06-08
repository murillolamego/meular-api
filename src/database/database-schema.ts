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
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
  deletedAt: timestamp('updated_at'),
});

export const databaseSchema = {
  users,
};
