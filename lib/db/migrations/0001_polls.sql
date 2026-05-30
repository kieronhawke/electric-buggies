CREATE TABLE "article_feedback" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"helpful" boolean NOT NULL,
	"visitor_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "poll_vote" (
	"id" text PRIMARY KEY NOT NULL,
	"poll_id" text NOT NULL,
	"option" text NOT NULL,
	"visitor_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "article_feedback_slug_idx" ON "article_feedback" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "article_feedback_unique" ON "article_feedback" USING btree ("slug","visitor_id");--> statement-breakpoint
CREATE INDEX "poll_vote_poll_idx" ON "poll_vote" USING btree ("poll_id");--> statement-breakpoint
CREATE UNIQUE INDEX "poll_vote_unique" ON "poll_vote" USING btree ("poll_id","visitor_id");