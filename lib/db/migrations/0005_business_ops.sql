CREATE TYPE "public"."item_status" AS ENUM('active', 'draft', 'archived');--> statement-breakpoint
ALTER TYPE "public"."role" ADD VALUE 'sales';--> statement-breakpoint
CREATE TABLE "goal" (
	"id" text PRIMARY KEY NOT NULL,
	"period" text NOT NULL,
	"metric" text NOT NULL,
	"target" integer DEFAULT 0 NOT NULL,
	"owner_name" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory_item" (
	"id" text PRIMARY KEY NOT NULL,
	"sku" text NOT NULL,
	"name" text NOT NULL,
	"model_slug" text,
	"status" "item_status" DEFAULT 'draft' NOT NULL,
	"specs" jsonb,
	"photos" jsonb,
	"supplier_id" text,
	"factory_fob" integer DEFAULT 0 NOT NULL,
	"freight_insurance" integer DEFAULT 0 NOT NULL,
	"duty_pct" integer DEFAULT 10 NOT NULL,
	"anti_dumping" boolean DEFAULT false NOT NULL,
	"vat_pct" integer DEFAULT 20 NOT NULL,
	"vat_reclaimable" boolean DEFAULT true NOT NULL,
	"other_fees" jsonb,
	"uk_delivery" integer DEFAULT 0 NOT NULL,
	"pdi" integer DEFAULT 0 NOT NULL,
	"branding" integer DEFAULT 0 NOT NULL,
	"warranty_reserve" integer DEFAULT 0 NOT NULL,
	"rrp" integer DEFAULT 0 NOT NULL,
	"target_margin_pct" integer DEFAULT 30 NOT NULL,
	"auto_price" boolean DEFAULT false NOT NULL,
	"stock_on_hand" integer DEFAULT 0 NOT NULL,
	"stock_on_order" integer DEFAULT 0 NOT NULL,
	"stock_allocated" integer DEFAULT 0 NOT NULL,
	"reorder_point" integer DEFAULT 0 NOT NULL,
	"location" text DEFAULT 'UK warehouse' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "inventory_item_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE "inventory_unit" (
	"id" text PRIMARY KEY NOT NULL,
	"item_id" text NOT NULL,
	"vin" text NOT NULL,
	"status" text DEFAULT 'in_stock' NOT NULL,
	"location" text,
	"order_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "price_change_log" (
	"id" text PRIMARY KEY NOT NULL,
	"item_id" text NOT NULL,
	"field" text NOT NULL,
	"old_value" text,
	"new_value" text,
	"actor_name" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchase_order" (
	"id" text PRIMARY KEY NOT NULL,
	"reference" text NOT NULL,
	"supplier_id" text,
	"item_id" text,
	"status" text DEFAULT 'ordered' NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"unit_cost" integer DEFAULT 0 NOT NULL,
	"total_cost" integer DEFAULT 0 NOT NULL,
	"expected_at" timestamp,
	"received_at" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "purchase_order_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
CREATE TABLE "supplier" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"country" text,
	"contact_name" text,
	"contact_email" text,
	"lead_time_days" integer,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "task" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text DEFAULT 'task' NOT NULL,
	"title" text NOT NULL,
	"related_type" text,
	"related_id" text,
	"due_date" timestamp,
	"assignee_name" text,
	"status" text DEFAULT 'open' NOT NULL,
	"sign_off_name" text,
	"sign_off_at" timestamp,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "quote" ADD COLUMN "item_id" text;--> statement-breakpoint
ALTER TABLE "quote" ADD COLUMN "quantity" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "quote" ADD COLUMN "unit_price" integer;--> statement-breakpoint
ALTER TABLE "quote" ADD COLUMN "markup_pct" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "quote" ADD COLUMN "fees_applied" jsonb;--> statement-breakpoint
ALTER TABLE "quote" ADD COLUMN "cost_snapshot" jsonb;--> statement-breakpoint
ALTER TABLE "quote" ADD COLUMN "profit_snapshot" jsonb;--> statement-breakpoint
ALTER TABLE "quote" ADD COLUMN "approval_required" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "quote" ADD COLUMN "approved_by" text;--> statement-breakpoint
ALTER TABLE "quote" ADD COLUMN "approved_at" timestamp;--> statement-breakpoint
ALTER TABLE "quote" ADD COLUMN "accepted_at" timestamp;--> statement-breakpoint
ALTER TABLE "quote" ADD COLUMN "created_by_name" text;--> statement-breakpoint
ALTER TABLE "inventory_item" ADD CONSTRAINT "inventory_item_supplier_id_supplier_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."supplier"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_unit" ADD CONSTRAINT "inventory_unit_item_id_inventory_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."inventory_item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_order" ADD CONSTRAINT "purchase_order_supplier_id_supplier_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."supplier"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_order" ADD CONSTRAINT "purchase_order_item_id_inventory_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."inventory_item"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "inventory_status_idx" ON "inventory_item" USING btree ("status");--> statement-breakpoint
CREATE INDEX "unit_item_idx" ON "inventory_unit" USING btree ("item_id");--> statement-breakpoint
CREATE INDEX "price_log_item_idx" ON "price_change_log" USING btree ("item_id");--> statement-breakpoint
CREATE INDEX "task_status_idx" ON "task" USING btree ("status");--> statement-breakpoint
CREATE INDEX "task_related_idx" ON "task" USING btree ("related_type","related_id");