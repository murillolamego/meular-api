import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import {
  text,
  pgTable,
  timestamp,
  serial,
  integer,
  primaryKey,
} from 'drizzle-orm/pg-core';

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

export const propertyTypes = pgTable('property_types', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
});

export const propertyCategories = pgTable('property_categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
});

export const properties = pgTable('properties', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const propertyOnTypes = pgTable(
  'property_on_types',
  {
    propertyId: text('property_id')
      .notNull()
      .references(() => properties.id),
    typeId: integer('type_id')
      .notNull()
      .references(() => propertyTypes.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.propertyId, t.typeId] }),
  }),
);

export const propertyOnCategories = pgTable(
  'property_on_categories',
  {
    propertyId: text('property_id')
      .notNull()
      .references(() => properties.id),
    categoryId: integer('category_id')
      .notNull()
      .references(() => propertyCategories.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.propertyId, t.categoryId] }),
  }),
);

export const passwordRecovery = pgTable('password-recovery', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text('user_id').notNull(),
  token: text('token').unique().notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const userRelations = relations(users, ({ many }) => ({
  properties: many(properties),
}));

export const propertyTypesRelations = relations(propertyTypes, ({ many }) => ({
  properties: many(propertyOnTypes),
}));

export const propertyCategoriesRelations = relations(
  propertyCategories,
  ({ many }) => ({
    properties: many(propertyOnCategories),
  }),
);

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  user: one(users, {
    fields: [properties.userId],
    references: [users.id],
  }),
  types: many(propertyOnTypes),
  categories: many(propertyOnCategories),
}));

export const propertyOnTypesRelations = relations(
  propertyOnTypes,
  ({ one }) => ({
    property: one(properties, {
      fields: [propertyOnTypes.propertyId],
      references: [properties.id],
    }),

    type: one(propertyTypes, {
      fields: [propertyOnTypes.typeId],
      references: [propertyTypes.id],
    }),
  }),
);

export const propertyOnCategoriesRelations = relations(
  propertyOnCategories,
  ({ one }) => ({
    property: one(properties, {
      fields: [propertyOnCategories.propertyId],
      references: [properties.id],
    }),

    category: one(propertyCategories, {
      fields: [propertyOnCategories.categoryId],
      references: [propertyCategories.id],
    }),
  }),
);

export const databaseSchema = {
  users,
  passwordRecovery,
  properties,
  propertyTypes,
  propertyCategories,
};
