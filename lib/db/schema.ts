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
  uniqueIndex,
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
    deliveryDates: jsonb("delivery_dates"), // customer's preferred dates
    deliverySlot: text("delivery_slot"), // morning | afternoon
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

// ── Contracts (stage 5) ──────────────────────────────────────────────────────
export const contractStatusEnum = pgEnum("contract_status", ["draft", "sent", "signed"]);

export const contract = pgTable(
  "contract",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id").notNull().references(() => order.id, { onDelete: "cascade" }),
    status: contractStatusEnum("status").notNull().default("sent"),
    tncsVersion: text("tncs_version").notNull().default("v1-2026"),
    body: jsonb("body"), // rendered contract terms snapshot
    sentAt: timestamp("sent_at").notNull().defaultNow(),
    signedAt: timestamp("signed_at"),
    signatureName: text("signature_name"),
    signedIp: text("signed_ip"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("contract_order_idx").on(t.orderId)],
);

// ── Payments (stage 6, wire transfer) ────────────────────────────────────────
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "sent", "received"]);

export const payment = pgTable(
  "payment",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id").notNull().references(() => order.id, { onDelete: "cascade" }),
    reference: text("reference").notNull(), // payment reference, e.g. EB-PAY-0001
    amount: integer("amount").notNull(), // pence
    currency: text("currency").notNull().default("GBP"),
    status: paymentStatusEnum("status").notNull().default("pending"),
    markedSentAt: timestamp("marked_sent_at"),
    confirmedAt: timestamp("confirmed_at"),
    confirmedBy: text("confirmed_by").references(() => user.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("payment_order_idx").on(t.orderId)],
);

// ── Order notes (internal vs customer-visible) ───────────────────────────────
export const orderNote = pgTable(
  "order_note",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id").notNull().references(() => order.id, { onDelete: "cascade" }),
    authorId: text("author_id").references(() => user.id, { onDelete: "set null" }),
    authorName: text("author_name").notNull(),
    body: text("body").notNull(),
    customerVisible: boolean("customer_visible").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("order_note_order_idx").on(t.orderId)],
);

// ── Per-order messages (customer <-> team) ───────────────────────────────────
export const orderMessage = pgTable(
  "order_message",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id").notNull().references(() => order.id, { onDelete: "cascade" }),
    senderId: text("sender_id").references(() => user.id, { onDelete: "set null" }),
    senderName: text("sender_name").notNull(),
    fromTeam: boolean("from_team").notNull().default(false),
    body: text("body").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("order_message_order_idx").on(t.orderId)],
);

// ── Audit log (security-relevant actions) ────────────────────────────────────
export const auditLog = pgTable(
  "audit_log",
  {
    id: text("id").primaryKey(),
    actorId: text("actor_id").references(() => user.id, { onDelete: "set null" }),
    actorName: text("actor_name"),
    action: text("action").notNull(), // e.g. order.stage_change, payment.confirm
    entityType: text("entity_type"),
    entityId: text("entity_id"),
    detail: jsonb("detail"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("audit_entity_idx").on(t.entityType, t.entityId)],
);

// ── Notification log (what was sent, per channel) ────────────────────────────
export const notificationLog = pgTable(
  "notification_log",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id").references(() => order.id, { onDelete: "cascade" }),
    channel: text("channel").notNull(), // email | sms | whatsapp
    event: text("event").notNull(),
    recipient: text("recipient").notNull(),
    subject: text("subject"),
    body: text("body"),
    ok: boolean("ok").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("notification_order_idx").on(t.orderId)],
);

// ── Fleet vehicles (stage 8) ─────────────────────────────────────────────────
export const vehicle = pgTable(
  "vehicle",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    orderId: text("order_id").references(() => order.id, { onDelete: "set null" }),
    modelName: text("model_name").notNull(),
    vin: text("vin"),
    registration: text("registration"),
    spec: jsonb("spec"),
    warrantyEnd: timestamp("warranty_end"),
    deliveredAt: timestamp("delivered_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("vehicle_user_idx").on(t.userId)],
);

// ── Service requests + engineer logs (stage 8) ───────────────────────────────
export const serviceStatusEnum = pgEnum("service_status", [
  "received",
  "acknowledged",
  "engineer_assigned",
  "in_progress",
  "resolved",
]);

export const serviceRequest = pgTable(
  "service_request",
  {
    id: text("id").primaryKey(),
    reference: text("reference").notNull().unique(), // EB-SVC-0001
    vehicleId: text("vehicle_id").references(() => vehicle.id, { onDelete: "set null" }),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    type: text("type").notNull(), // service | fault | inspection
    tier: text("tier"), // service tier name (Interim/Full/Major)
    faultType: text("fault_type"),
    severity: text("severity"), // low | medium | high
    preferredDates: jsonb("preferred_dates"),
    description: text("description").notNull(),
    status: serviceStatusEnum("status").notNull().default("received"),
    engineerId: text("engineer_id").references(() => user.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [index("service_user_idx").on(t.userId), index("service_engineer_idx").on(t.engineerId)],
);

export const serviceLog = pgTable(
  "service_log",
  {
    id: text("id").primaryKey(),
    serviceRequestId: text("service_request_id").notNull().references(() => serviceRequest.id, { onDelete: "cascade" }),
    engineerId: text("engineer_id").references(() => user.id, { onDelete: "set null" }),
    engineerName: text("engineer_name").notNull(),
    workDone: text("work_done").notNull(),
    diagnosis: text("diagnosis"),
    parts: text("parts"),
    minutesSpent: integer("minutes_spent"),
    customerVisible: boolean("customer_visible").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("service_log_request_idx").on(t.serviceRequestId)],
);

// ── Guides: poll votes (one per visitor per poll) ────────────────────────────
export const pollVote = pgTable(
  "poll_vote",
  {
    id: text("id").primaryKey(),
    pollId: text("poll_id").notNull(), // stable id from the post content
    option: text("option").notNull(),
    visitorId: text("visitor_id").notNull(), // anonymous cookie id
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("poll_vote_poll_idx").on(t.pollId),
    uniqueIndex("poll_vote_unique").on(t.pollId, t.visitorId),
  ],
);

// ── Guides: "was this helpful" feedback (aggregate only) ─────────────────────
export const articleFeedback = pgTable(
  "article_feedback",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    helpful: boolean("helpful").notNull(),
    visitorId: text("visitor_id").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("article_feedback_slug_idx").on(t.slug),
    uniqueIndex("article_feedback_unique").on(t.slug, t.visitorId),
  ],
);

// ── CRM deals (stage 9) ──────────────────────────────────────────────────────
export const dealStageEnum = pgEnum("deal_stage", [
  "new",
  "contacted",
  "quote_sent",
  "negotiation",
  "won",
  "lost",
]);

export const deal = pgTable(
  "deal",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    company: text("company"),
    stage: dealStageEnum("stage").notNull().default("new"),
    source: text("source").notNull().default("manual"), // quote | hire | airport | newsletter | manual
    value: integer("value"), // pence, indicative
    note: text("note"),
    nextAction: text("next_action"),
    modelSlug: text("model_slug"), // model of interest (drives the card image)
    assigneeName: text("assignee_name"), // salesperson
    build: text("build"), // encoded configurator build, carried through
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    position: integer("position").notNull().default(0), // order within a column
    orderId: text("order_id").references(() => order.id, { onDelete: "set null" }), // set when converted
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [index("deal_stage_idx").on(t.stage), index("deal_email_idx").on(t.email)],
);

// ── Quotes (stage 9) ─────────────────────────────────────────────────────────
export const quoteStatusEnum = pgEnum("quote_status", [
  "draft",
  "sent",
  "viewed",
  "accepted",
  "declined",
  "expired",
]);

export const quote = pgTable(
  "quote",
  {
    id: text("id").primaryKey(),
    reference: text("reference").notNull().unique(), // EB-Q-0001
    dealId: text("deal_id").references(() => deal.id, { onDelete: "set null" }),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    customerEmail: text("customer_email").notNull(),
    customerName: text("customer_name").notNull(),
    status: quoteStatusEnum("status").notNull().default("draft"),
    lineItems: jsonb("line_items").notNull(), // [{ label, detail, amount }]
    modelSlug: text("model_slug"),
    originalTotal: integer("original_total"), // pence before discount
    discountPct: integer("discount_pct").notNull().default(0),
    total: integer("total").notNull(), // pence, final
    currency: text("currency").notNull().default("GBP"),
    inclusions: jsonb("inclusions"), // [string]
    estDelivery: timestamp("est_delivery"),
    build: text("build"),
    validUntil: timestamp("valid_until"),
    sentAt: timestamp("sent_at"),
    viewedAt: timestamp("viewed_at"),
    respondedAt: timestamp("responded_at"),
    accessToken: text("access_token").notNull(), // unguessable token for the public view link
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [index("quote_user_idx").on(t.userId), index("quote_token_idx").on(t.accessToken)],
);

// ── Marketing campaigns (admin ops) ──────────────────────────────────────────
export const campaign = pgTable("campaign", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  channel: text("channel").notNull(), // email | google_ads | social | other
  status: text("status").notNull().default("active"), // active | paused | completed
  budget: integer("budget").notNull().default(0), // pence
  spent: integer("spent").notNull().default(0), // pence
  leads: integer("leads").notNull().default(0),
  conversions: integer("conversions").notNull().default(0),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  note: text("note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Customer enquiries log ───────────────────────────────────────────────────
export const enquiry = pgTable("enquiry", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  source: text("source").notNull().default("web"), // web | phone | email | event
  subject: text("subject"),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"), // new | handled
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Email templates (admin Communications, versioned) ───────────────────────
export const emailTemplate = pgTable("email_template", {
  key: text("key").primaryKey(), // matches the registry TemplateKey
  name: text("name").notNull(),
  subject: text("subject").notNull(),
  preheader: text("preheader").notNull().default(""),
  html: text("html").notNull(), // tokenized, email-safe
  editorJson: jsonb("editor_json"), // optional visual-editor design
  updatedByName: text("updated_by_name"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const emailTemplateVersion = pgTable(
  "email_template_version",
  {
    id: text("id").primaryKey(),
    templateKey: text("template_key").notNull(),
    name: text("name").notNull(),
    subject: text("subject").notNull(),
    preheader: text("preheader").notNull().default(""),
    html: text("html").notNull(),
    editorJson: jsonb("editor_json"),
    editedByName: text("edited_by_name"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("email_version_key_idx").on(t.templateKey)],
);

// ── Custom / ad-hoc emails (drafts + sends) ─────────────────────────────────
export const customEmail = pgTable("custom_email", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  subject: text("subject").notNull(),
  preheader: text("preheader").notNull().default(""),
  html: text("html").notNull(),
  editorJson: jsonb("editor_json"),
  createdByName: text("created_by_name"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ── Abandoned-quote leads (delayed recovery email) ──────────────────────────
export const abandonedLead = pgTable(
  "abandoned_lead",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    name: text("name"),
    flow: text("flow").notNull(), // quote | hire | airport
    modelSlug: text("model_slug"),
    completed: boolean("completed").notNull().default(false),
    recoverySentAt: timestamp("recovery_sent_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [uniqueIndex("abandoned_email_flow_idx").on(t.email, t.flow)],
);

export type User = typeof user.$inferSelect;
export type Order = typeof order.$inferSelect;
export type OrderEvent = typeof orderEvent.$inferSelect;
export type Contract = typeof contract.$inferSelect;
export type Campaign = typeof campaign.$inferSelect;
export type Enquiry = typeof enquiry.$inferSelect;
export type EmailTemplate = typeof emailTemplate.$inferSelect;
export type Payment = typeof payment.$inferSelect;
export type Vehicle = typeof vehicle.$inferSelect;
export type ServiceRequest = typeof serviceRequest.$inferSelect;
export type Deal = typeof deal.$inferSelect;
export type Quote = typeof quote.$inferSelect;
