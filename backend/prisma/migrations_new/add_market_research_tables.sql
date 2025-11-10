-- Enhanced Market Research Tables for Multi-Source Pricing

-- Market Price Data Sources
CREATE TABLE IF NOT EXISTS market_price_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,

  -- Source Information
  source_name VARCHAR(50) NOT NULL, -- 'cargurus', 'autotrader', 'kbb', 'nada', 'blackbook', 'edmunds'
  source_url TEXT,

  -- Pricing Data
  asking_price INTEGER,
  dealer_price INTEGER,
  private_party_price INTEGER,
  trade_in_value INTEGER,

  -- Listing Details
  listing_id VARCHAR(255),
  dealer_name VARCHAR(255),
  dealer_location VARCHAR(255),
  mileage INTEGER,
  year INTEGER,
  condition VARCHAR(50),
  days_on_market INTEGER,

  -- Vehicle-Specific Adjustments
  color_exterior VARCHAR(100),
  color_interior VARCHAR(100),
  transmission VARCHAR(50),
  drivetrain VARCHAR(50),
  fuel_type VARCHAR(50),

  -- Confidence & Metadata
  confidence_score DECIMAL(3,2), -- 0.00 to 1.00
  data_freshness TIMESTAMP NOT NULL DEFAULT NOW(),
  scrape_timestamp TIMESTAMP NOT NULL DEFAULT NOW(),

  -- Raw Data Storage
  raw_data JSONB,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT market_price_sources_confidence_check CHECK (confidence_score >= 0 AND confidence_score <= 1)
);

-- Market Analysis Summary
CREATE TABLE IF NOT EXISTS market_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL UNIQUE REFERENCES submissions(id) ON DELETE CASCADE,

  -- Aggregated Pricing (from multiple sources)
  market_low INTEGER NOT NULL,
  market_average INTEGER NOT NULL,
  market_high INTEGER NOT NULL,
  recommended_asking_price INTEGER,
  recommended_dealer_offer INTEGER,

  -- Market Intelligence
  total_comparable_listings INTEGER DEFAULT 0,
  average_days_to_sell INTEGER,
  market_demand VARCHAR(20), -- 'very_high', 'high', 'moderate', 'low', 'very_low'
  price_trend VARCHAR(20), -- 'increasing', 'stable', 'decreasing'

  -- Geographic Analysis
  local_market_listings INTEGER,
  national_market_listings INTEGER,
  regional_price_variance DECIMAL(5,2), -- percentage

  -- Confidence Metrics
  data_sources_count INTEGER NOT NULL DEFAULT 0,
  overall_confidence VARCHAR(20), -- 'excellent', 'good', 'fair', 'poor'
  last_updated TIMESTAMP NOT NULL DEFAULT NOW(),

  -- Analysis Notes
  market_insights TEXT,
  pricing_recommendation TEXT,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Historical Price Tracking
CREATE TABLE IF NOT EXISTS price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,

  -- Price Point
  market_average INTEGER NOT NULL,
  source_count INTEGER NOT NULL,

  -- Snapshot timestamp
  recorded_at TIMESTAMP NOT NULL DEFAULT NOW(),

  -- Change from previous
  change_amount INTEGER,
  change_percentage DECIMAL(5,2),

  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Comparable Vehicles (Similar listings for context)
CREATE TABLE IF NOT EXISTS comparable_vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,

  -- Vehicle Identity
  vin VARCHAR(17),
  year INTEGER NOT NULL,
  make VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  trim VARCHAR(100),

  -- Listing Details
  asking_price INTEGER NOT NULL,
  mileage INTEGER NOT NULL,
  condition VARCHAR(50),
  location VARCHAR(255),

  -- Source
  source_name VARCHAR(50) NOT NULL,
  source_url TEXT,
  listing_date DATE,

  -- Similarity Score
  similarity_score DECIMAL(3,2), -- How similar to the subject vehicle (0.00 to 1.00)

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT comparable_vehicles_similarity_check CHECK (similarity_score >= 0 AND similarity_score <= 1)
);

-- Market Research Jobs Queue
CREATE TABLE IF NOT EXISTS market_research_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,

  -- Job Configuration
  job_type VARCHAR(50) NOT NULL, -- 'full_research', 'quick_check', 'price_update'
  priority INTEGER DEFAULT 5, -- 1-10, higher = more urgent

  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  started_at TIMESTAMP,
  completed_at TIMESTAMP,

  -- Results
  sources_checked TEXT[], -- Array of source names checked
  sources_successful TEXT[], -- Array of sources that returned data
  error_message TEXT,

  -- Retry Logic
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX idx_market_price_sources_submission ON market_price_sources(submission_id);
CREATE INDEX idx_market_price_sources_source ON market_price_sources(source_name);
CREATE INDEX idx_market_price_sources_freshness ON market_price_sources(data_freshness);

CREATE INDEX idx_market_analysis_submission ON market_analysis(submission_id);
CREATE INDEX idx_market_analysis_updated ON market_analysis(last_updated);

CREATE INDEX idx_price_history_submission ON price_history(submission_id);
CREATE INDEX idx_price_history_recorded ON price_history(recorded_at);

CREATE INDEX idx_comparable_vehicles_submission ON comparable_vehicles(submission_id);
CREATE INDEX idx_comparable_vehicles_similarity ON comparable_vehicles(similarity_score);

CREATE INDEX idx_research_jobs_status ON market_research_jobs(status);
CREATE INDEX idx_research_jobs_priority ON market_research_jobs(priority DESC);

-- Comments for Documentation
COMMENT ON TABLE market_price_sources IS 'Stores individual pricing data points from each market source (CarGurus, AutoTrader, KBB, etc.)';
COMMENT ON TABLE market_analysis IS 'Aggregated market analysis combining all sources for a submission';
COMMENT ON TABLE price_history IS 'Tracks how market prices change over time for a submission';
COMMENT ON TABLE comparable_vehicles IS 'Stores similar vehicle listings for comparison and validation';
COMMENT ON TABLE market_research_jobs IS 'Queue for background market research tasks';
