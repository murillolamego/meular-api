ALTER TABLE "users" ADD COLUMN "email_validated" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_validation_token" text;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_validation_token_unique" UNIQUE("email_validation_token");