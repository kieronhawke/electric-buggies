/**
 * Drizzle schema for the Electric Buggies portal + operations.
 * Auth tables (user/session/account/verification/two_factor) follow the
 * better-auth contract; app tables cover the order journey. Later portal stages
 * (contracts, payments, fleet, service, CRM, quotes) extend this file.
 *
 * Column JS keys are camelCase to match better-auth's field names; physical
 * column names are snake_case.
 */
import {
  pgTable,
  pgEnum,
  text,
  boolean,
  timestamp,
  integer,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["customer", "admin", "finance", "engineer"]);

export const orderStageEnum = pgEnum("order_stage", [
  "confirmed",
  "contract_sent",
  "contract_signed",
  "payment_pending",
  "payment_received",
  "in_production",
  "quality_check",
  "ready_for_delivery",
  "in_transit",
  "delivered",
]);

// ── Auth (better-auth contract) ──────────────────────────────────────────────
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),

  role: roleEnum("role").notNull().default("customer"),
  phone: text("phone"),
  company: text("company"),

  // Granular notification preferences.
  notifyEmail: boolean("notify_email").notNull().default(true),
  notifySms: boolean("notify_sms").notNull().default(false),
  notifyWhatsapp: boolean("notify_whatsapp").notNull().default(false),
  notifyEvents: jsonb("notify_events"), // { orderUpdates, contract, payment, service, marketing }

  twoFactorEnabled: boolean("two_factor_enabled").notNull().default(false),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const twoFactor = pgTable("two_factor", {
  id: text("id").primaryKey(),
  secret: text("secret").notNull(),
  backupCodes: text("backup_codes").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

// ── Orders ───────────────────────────────────────────────────────────────────
export const order = pgTable(
  "order",
  {
    id: text("id").primaryKey(),
    reference: text("reference").notNull().unique(), // EB-2026-0001
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    stage: orderStageEnum("stage").notNull().default("confirmed"),
    modelSlug: text("model_slug").notNull(),
    modelName: text("model_name").notNull(),
    configuration: jsonb("configuration"), // saved build/spec snapshot
    totalAmount: integer("total_amount").notNull(), // pence
    currency: text("currency").notNull().default("GBP"),
    estDeliveryStart: timestamp("est_delivery_start"),
    estDeliveryEnd: timestamp("est_delivery_end"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [index("order_user_idx").on(t.userId)],
);

export const orderEvent = pgTable(
  "order_event",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id")
      .notNull()
      .references(() => order.id, { onDelete: "cascade" }),
    stage: orderStageEnum("stage").notNull(),
    title: text("title").notNull(),
    detail: text("detail"),
    occurredAt: timestamp("occurred_at").notNull().defaultNow(),
    customerVisible: boolean("customer_visible").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("order_event_order_idx").on(t.orderId)],
);

export type User = typeof user.$inferSelect;
export type Order = typeof order.$inferSelect;
export type OrderEvent = typeof orderEvent.$inferSelect;
