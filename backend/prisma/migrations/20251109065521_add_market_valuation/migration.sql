-- AlterTable
ALTER TABLE "submissions" ADD COLUMN "estimated_value_avg" INTEGER;
ALTER TABLE "submissions" ADD COLUMN "estimated_value_high" INTEGER;
ALTER TABLE "submissions" ADD COLUMN "estimated_value_low" INTEGER;
ALTER TABLE "submissions" ADD COLUMN "pricing_insights" TEXT;
ALTER TABLE "submissions" ADD COLUMN "valuation_confidence" TEXT;
ALTER TABLE "submissions" ADD COLUMN "valuation_date" DATETIME;
ALTER TABLE "submissions" ADD COLUMN "valuation_source" TEXT;
