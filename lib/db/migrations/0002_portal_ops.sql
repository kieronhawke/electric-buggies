CREATE TYPE "public"."contract_status" AS ENUM('draft', 'sent', 'signed');--> statement-breakpoint
CREATE TYPE "public"."deal_stage" AS ENUM('new', 'contacted', 'quote_sent', 'negotiation', 'won', 'lost');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'sent', 'received');--> statement-breakpoint
CREATE TYPE "public"."quote_status" AS ENUM('draft', 'sent', 'viewed', 'accepted', 'declined', 'expired');--> statement-breakpoint
CREATE TYPE "public"."service_status" AS ENUM('received', 'acknowledged', 'engineer_assigned', 'in_progress', 'resolved');--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" text PRIMARY KEY NOT NULL,
	"actor_id" text,
	"actor_name" text,
	"action" text NOT NULL,
	"entity_type" text,
	"entity_id" text,
	"detail" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contract" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL,
	"status" "contract_status" DEFAULT 'sent' NOT NULL,
	"tncs_version" text DEFAULT 'v1-2026' NOT NULL,
	"body" jsonb,
	"sent_at" timestamp DEFAULT now() NOT NULL,
	"signed_at" timestamp,
	"signature_name" text,
	"signed_ip" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deal" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"company" text,
	"stage" "deal_stage" DEFAULT 'new' NOT NULL,
	"source" text DEFAULT 'manual' NOT NULL,
	"value" integer,
	"note" text,
	"build" text,
	"user_id" text,
	"position" integer DEFAULT 0 NOT NULL,
	"order_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification_log" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text,
	"channel" text NOT NULL,
	"event" text NOT NULL,
	"recipient" text NOT NULL,
	"subject" text,
	"body" text,
	"ok" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_message" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL,
	"sender_id" text,
	"sender_name" text NOT NULL,
	"from_team" boolean DEFAULT false NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_note" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL,
	"author_id" text,
	"author_name" text NOT NULL,
	"body" text NOT NULL,
	"customer_visible" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL,
	"reference" text NOT NULL,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'GBP' NOT NULL,
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"marked_sent_at" timestamp,
	"confirmed_at" timestamp,
	"confirmed_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quote" (
	"id" text PRIMARY KEY NOT NULL,
	"reference" text NOT NULL,
	"deal_id" text,
	"user_id" text,
	"customer_email" text NOT NULL,
	"customer_name" text NOT NULL,
	"status" "quote_status" DEFAULT 'draft' NOT NULL,
	"line_items" jsonb NOT NULL,
	"total" integer NOT NULL,
	"currency" text DEFAULT 'GBP' NOT NULL,
	"build" text,
	"valid_until" timestamp,
	"sent_at" timestamp,
	"viewed_at" timestamp,
	"responded_at" timestamp,
	"access_token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "quote_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
CREATE TABLE "service_log" (
	"id" text PRIMARY KEY NOT NULL,
	"service_request_id" text NOT NULL,
	"engineer_id" text,
	"engineer_name" text NOT NULL,
	"work_done" text NOT NULL,
	"diagnosis" text,
	"parts" text,
	"minutes_spent" integer,
	"customer_visible" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_request" (
	"id" text PRIMARY KEY NOT NULL,
	"reference" text NOT NULL,
	"vehicle_id" text,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"description" text NOT NULL,
	"status" "service_status" DEFAULT 'received' NOT NULL,
	"engineer_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "service_request_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
CREATE TABLE "vehicle" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"order_id" text,
	"model_name" text NOT NULL,
	"vin" text,
	"registration" text,
	"spec" jsonb,
	"warranty_end" timestamp,
	"delivered_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actor_id_user_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contract" ADD CONSTRAINT "contract_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deal" ADD CONSTRAINT "deal_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deal" ADD CONSTRAINT "deal_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_log" ADD CONSTRAINT "notification_log_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_message" ADD CONSTRAINT "order_message_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_message" ADD CONSTRAINT "order_message_sender_id_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_note" ADD CONSTRAINT "order_note_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_note" ADD CONSTRAINT "order_note_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_confirmed_by_user_id_fk" FOREIGN KEY ("confirmed_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quote" ADD CONSTRAINT "quote_deal_id_deal_id_fk" FOREIGN KEY ("deal_id") REFERENCES "public"."deal"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quote" ADD CONSTRAINT "quote_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_log" ADD CONSTRAINT "service_log_service_request_id_service_request_id_fk" FOREIGN KEY ("service_request_id") REFERENCES "public"."service_request"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_log" ADD CONSTRAINT "service_log_engineer_id_user_id_fk" FOREIGN KEY ("engineer_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_request" ADD CONSTRAINT "service_request_vehicle_id_vehicle_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicle"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_request" ADD CONSTRAINT "service_request_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_request" ADD CONSTRAINT "service_request_engineer_id_user_id_fk" FOREIGN KEY ("engineer_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle" ADD CONSTRAINT "vehicle_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle" ADD CONSTRAINT "vehicle_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_entity_idx" ON "audit_log" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "contract_order_idx" ON "contract" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "deal_stage_idx" ON "deal" USING btree ("stage");--> statement-breakpoint
CREATE INDEX "deal_email_idx" ON "deal" USING btree ("email");--> statement-breakpoint
CREATE INDEX "notification_order_idx" ON "notification_log" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "order_message_order_idx" ON "order_message" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "order_note_order_idx" ON "order_note" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "payment_order_idx" ON "payment" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "quote_user_idx" ON "quote" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "quote_token_idx" ON "quote" USING btree ("access_token");--> statement-breakpoint
CREATE INDEX "service_log_request_idx" ON "service_log" USING btree ("service_request_id");--> statement-breakpoint
CREATE INDEX "service_user_idx" ON "service_request" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "service_engineer_idx" ON "service_request" USING btree ("engineer_id");--> statement-breakpoint
CREATE INDEX "vehicle_user_idx" ON "vehicle" USING btree ("user_id");