import { relations } from 'drizzle-orm';
import {
  text,
  pgTable,
  timestamp,
  serial,
  integer,
  primaryKey,
  varchar,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { customId } from '../utils/custom-id/custom-id';

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    publicId: varchar('public_id', { length: 12 })
      .$defaultFn(() => customId())
      .unique()
      .notNull(),
    email: text('email').unique().notNull(),
    username: text('username').unique(),
    password: text('password').notNull(),
    name: text('name').notNull(),
    refreshToken: text('refresh_token'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => {
    return {
      publicIdIdx: uniqueIndex('idx_user_public_id').on(table.publicId),
    };
  },
);

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

export const properties = pgTable(
  'properties',
  {
    id: serial('id').primaryKey(),
    publicId: varchar('public_id', { length: 12 })
      .$defaultFn(() => customId())
      .unique()
      .notNull(),
    title: text('title').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => users.publicId),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => {
    return {
      publicIdIdx: uniqueIndex('idx_properties_public_id').on(table.publicId),
    };
  },
);

export const propertyOnTypes = pgTable(
  'property_on_types',
  {
    propertyId: integer('property_id')
      .notNull()
      .references(() => properties.id),
    typeId: integer('type_id')
      .notNull()
      .references(() => propertyTypes.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.propertyId, table.typeId] }),
  }),
);

export const propertyOnCategories = pgTable(
  'property_on_categories',
  {
    propertyId: integer('property_id')
      .notNull()
      .references(() => properties.id),
    categoryId: integer('category_id')
      .notNull()
      .references(() => propertyCategories.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.propertyId, table.categoryId] }),
  }),
);

export const passwordRecovery = pgTable(
  'password-recovery',
  {
    id: serial('id').primaryKey(),
    publicId: varchar('public_id', { length: 12 })
      .$defaultFn(() => customId())
      .notNull(),
    userId: text('user_id').notNull(),
    token: text('token').unique().notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => {
    return {
      publicIdIdx: uniqueIndex('idx_password_recovery_public_id').on(
        table.publicId,
      ),
    };
  },
);

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
