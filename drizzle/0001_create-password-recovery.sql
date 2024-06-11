CREATE TABLE IF NOT EXISTS "password-recovery" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "password-recovery_token_unique" UNIQUE("token")
);
