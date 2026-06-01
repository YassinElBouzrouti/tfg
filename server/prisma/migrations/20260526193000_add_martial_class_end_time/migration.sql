-- Add end time for martial classes to support explicit class ranges.
ALTER TABLE "MartialClass"
ADD COLUMN "endTime" TEXT NOT NULL DEFAULT '00:00';
