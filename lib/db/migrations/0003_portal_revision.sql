CREATE TABLE "campaign" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"channel" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"budget" integer DEFAULT 0 NOT NULL,
	"spent" integer DEFAULT 0 NOT NULL,
	"leads" integer DEFAULT 0 NOT NULL,
	"conversions" integer DEFAULT 0 NOT NULL,
	"start_date" timestamp,
	"end_date" timestamp,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "enquiry" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"source" text DEFAULT 'web' NOT NULL,
	"subject" text,
	"message" text NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "deal" ADD COLUMN "next_action" text;--> statement-breakpoint
ALTER TABLE "deal" ADD COLUMN "model_slug" text;--> statement-breakpoint
ALTER TABLE "deal" ADD COLUMN "assignee_name" text;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "delivery_dates" jsonb;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "delivery_slot" text;--> statement-breakpoint
ALTER TABLE "quote" ADD COLUMN "model_slug" text;--> statement-breakpoint
ALTER TABLE "quote" ADD COLUMN "original_total" integer;--> statement-breakpoint
ALTER TABLE "quote" ADD COLUMN "discount_pct" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "quote" ADD COLUMN "inclusions" jsonb;--> statement-breakpoint
ALTER TABLE "quote" ADD COLUMN "est_delivery" timestamp;--> statement-breakpoint
ALTER TABLE "service_request" ADD COLUMN "tier" text;--> statement-breakpoint
ALTER TABLE "service_request" ADD COLUMN "fault_type" text;--> statement-breakpoint
ALTER TABLE "service_request" ADD COLUMN "severity" text;--> statement-breakpoint
ALTER TABLE "service_request" ADD COLUMN "preferred_dates" jsonb;