-- CreateTable
CREATE TABLE "submitters" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT,
    "phone" TEXT,
    "name" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "submissions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ticket_number" TEXT NOT NULL,
    "submitter_id" TEXT,
    "vin" TEXT NOT NULL,
    "year" INTEGER,
    "make" TEXT,
    "model" TEXT,
    "trim" TEXT,
    "mileage" INTEGER NOT NULL,
    "vehicle_specs" JSONB,
    "estimated_value_low" INTEGER,
    "estimated_value_avg" INTEGER,
    "estimated_value_high" INTEGER,
    "valuation_source" TEXT,
    "valuation_confidence" TEXT,
    "valuation_date" DATETIME,
    "pricing_insights" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "submissions_submitter_id_fkey" FOREIGN KEY ("submitter_id") REFERENCES "submitters" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "submission_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "file_size" INTEGER,
    "mime_type" TEXT,
    "uploaded_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "media_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "submissions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "dealers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "quotes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "submission_id" TEXT NOT NULL,
    "dealer_id" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" DATETIME,
    CONSTRAINT "quotes_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "submissions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "quotes_dealer_id_fkey" FOREIGN KEY ("dealer_id") REFERENCES "dealers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "referrals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "referrer_id" TEXT NOT NULL,
    "referee_id" TEXT NOT NULL,
    "submission_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "referrals_referrer_id_fkey" FOREIGN KEY ("referrer_id") REFERENCES "submitters" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "referrals_referee_id_fkey" FOREIGN KEY ("referee_id") REFERENCES "submitters" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "referrals_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "submissions" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "market_price_sources" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "submission_id" TEXT NOT NULL,
    "source_name" TEXT NOT NULL,
    "source_url" TEXT,
    "asking_price" INTEGER,
    "dealer_price" INTEGER,
    "private_party_price" INTEGER,
    "trade_in_value" INTEGER,
    "listing_id" TEXT,
    "dealer_name" TEXT,
    "dealer_location" TEXT,
    "mileage" INTEGER,
    "year" INTEGER,
    "condition" TEXT,
    "days_on_market" INTEGER,
    "color_exterior" TEXT,
    "color_interior" TEXT,
    "transmission" TEXT,
    "drivetrain" TEXT,
    "fuel_type" TEXT,
    "confidence_score" REAL,
    "data_freshness" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scrape_timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "raw_data" JSONB,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "market_price_sources_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "submissions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "market_analysis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "submission_id" TEXT NOT NULL,
    "market_low" INTEGER NOT NULL,
    "market_average" INTEGER NOT NULL,
    "market_high" INTEGER NOT NULL,
    "recommended_asking_price" INTEGER,
    "recommended_dealer_offer" INTEGER,
    "total_comparable_listings" INTEGER NOT NULL DEFAULT 0,
    "average_days_to_sell" INTEGER,
    "market_demand" TEXT,
    "price_trend" TEXT,
    "local_market_listings" INTEGER,
    "national_market_listings" INTEGER,
    "regional_price_variance" REAL,
    "data_sources_count" INTEGER NOT NULL DEFAULT 0,
    "overall_confidence" TEXT,
    "last_updated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "market_insights" TEXT,
    "pricing_recommendation" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "market_analysis_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "submissions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "price_history" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "submission_id" TEXT NOT NULL,
    "market_average" INTEGER NOT NULL,
    "source_count" INTEGER NOT NULL,
    "recorded_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "change_amount" INTEGER,
    "change_percentage" REAL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "price_history_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "submissions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "comparable_vehicles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "submission_id" TEXT NOT NULL,
    "vin" TEXT,
    "year" INTEGER NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "trim" TEXT,
    "asking_price" INTEGER NOT NULL,
    "mileage" INTEGER NOT NULL,
    "condition" TEXT,
    "location" TEXT,
    "source_name" TEXT NOT NULL,
    "source_url" TEXT,
    "listing_date" DATETIME,
    "similarity_score" REAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "comparable_vehicles_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "submissions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "market_research_jobs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "submission_id" TEXT NOT NULL,
    "job_type" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 5,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "started_at" DATETIME,
    "completed_at" DATETIME,
    "sources_checked" TEXT NOT NULL,
    "sources_successful" TEXT NOT NULL,
    "error_message" TEXT,
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "max_retries" INTEGER NOT NULL DEFAULT 3,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "market_research_jobs_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "submissions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "submissions_ticket_number_key" ON "submissions"("ticket_number");

-- CreateIndex
CREATE INDEX "market_price_sources_submission_id_idx" ON "market_price_sources"("submission_id");

-- CreateIndex
CREATE INDEX "market_price_sources_source_name_idx" ON "market_price_sources"("source_name");

-- CreateIndex
CREATE INDEX "market_price_sources_data_freshness_idx" ON "market_price_sources"("data_freshness");

-- CreateIndex
CREATE UNIQUE INDEX "market_analysis_submission_id_key" ON "market_analysis"("submission_id");

-- CreateIndex
CREATE INDEX "market_analysis_submission_id_idx" ON "market_analysis"("submission_id");

-- CreateIndex
CREATE INDEX "market_analysis_last_updated_idx" ON "market_analysis"("last_updated");

-- CreateIndex
CREATE INDEX "price_history_submission_id_idx" ON "price_history"("submission_id");

-- CreateIndex
CREATE INDEX "price_history_recorded_at_idx" ON "price_history"("recorded_at");

-- CreateIndex
CREATE INDEX "comparable_vehicles_submission_id_idx" ON "comparable_vehicles"("submission_id");

-- CreateIndex
CREATE INDEX "comparable_vehicles_similarity_score_idx" ON "comparable_vehicles"("similarity_score");

-- CreateIndex
CREATE INDEX "market_research_jobs_status_idx" ON "market_research_jobs"("status");

-- CreateIndex
CREATE INDEX "market_research_jobs_priority_idx" ON "market_research_jobs"("priority");
