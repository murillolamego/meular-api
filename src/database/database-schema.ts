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
    userId: varchar('user_id', { length: 12 })
      .notNull()
      .references(() => users.publicId, { onDelete: 'cascade' }),
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

export const propertiesToTypes = pgTable(
  'property_to_types',
  {
    propertyId: integer('property_id')
      .notNull()
      .references(() => properties.id, { onDelete: 'cascade' }),
    typeId: integer('type_id')
      .notNull()
      .references(() => propertyTypes.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.propertyId, table.typeId] }),
  }),
);

export const propertiesToCategories = pgTable(
  'property_to_categories',
  {
    propertyId: integer('property_id')
      .notNull()
      .references(() => properties.id, { onDelete: 'cascade' }),
    categoryId: integer('category_id')
      .notNull()
      .references(() => propertyCategories.id, { onDelete: 'cascade' }),
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
    userId: varchar('user_id', { length: 12 })
      .notNull()
      .references(() => users.publicId, { onDelete: 'cascade' }),
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

export const usersRelations = relations(users, ({ many }) => ({
  properties: many(properties),
  passwordRecovery: many(passwordRecovery),
}));

export const propertyTypesRelations = relations(propertyTypes, ({ many }) => ({
  properties: many(propertiesToTypes),
}));

export const propertyCategoriesRelations = relations(
  propertyCategories,
  ({ many }) => ({
    properties: many(propertiesToCategories),
  }),
);

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  user: one(users, {
    fields: [properties.userId],
    references: [users.publicId],
  }),
  types: many(propertiesToTypes),
  categories: many(propertiesToCategories),
}));

export const propertiesToTypesRelations = relations(
  propertiesToTypes,
  ({ one }) => ({
    property: one(properties, {
      fields: [propertiesToTypes.propertyId],
      references: [properties.id],
    }),

    type: one(propertyTypes, {
      fields: [propertiesToTypes.typeId],
      references: [propertyTypes.id],
    }),
  }),
);

export const propertiesToCategoriesRelations = relations(
  propertiesToCategories,
  ({ one }) => ({
    property: one(properties, {
      fields: [propertiesToCategories.propertyId],
      references: [properties.id],
    }),

    category: one(propertyCategories, {
      fields: [propertiesToCategories.categoryId],
      references: [propertyCategories.id],
    }),
  }),
);

export const passwordRecoveryRelations = relations(
  passwordRecovery,
  ({ one }) => ({
    user: one(users, {
      fields: [passwordRecovery.userId],
      references: [users.publicId],
    }),
  }),
);

export const databaseSchema = {
  users,
  passwordRecovery,
  properties,
  propertyTypes,
  propertyCategories,
  propertiesToCategories,
  propertiesToTypes,
};
