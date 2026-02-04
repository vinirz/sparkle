-- Add statement_image_url column to questions table
ALTER TABLE "public"."questions" ADD COLUMN IF NOT EXISTS "statement_image_url" text;
