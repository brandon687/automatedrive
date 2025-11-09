# Dealer Trade - Vehicle Appraisal Platform

## Project Overview
A streamlined vehicle appraisal submission system allowing users to submit vehicle information and media for dealer quotes. Features viral sharing capability, ticketing system, and dealer partner portal.

## Core Features

### 1. User Submission Portal
- Shareable link system for viral growth
- Mobile-optimized upload interface
- Multi-image upload (7 required photos)
- Optional video upload for better quotes
- Instant submission number/ticket generation
- Email confirmation with tracking number

### 2. Required Data Collection
- **VIN** (primary identifier)
- **Year**
- **Mileage**
- **Media Requirements:**
  - Front view
  - Rear view
  - Driver side
  - Passenger side
  - Steering wheel
  - Front seat
  - Back seat
  - Optional: Video walkthrough

### 3. Admin Dashboard
- View all submissions (ticketing system)
- Filter/search by VIN, date, status
- View decoded vehicle specs
- Access manufacturer options
- Review uploaded media
- Forward to dealer partners
- Track quote status

### 4. Dealer Partner Portal
- Receive forwarded submissions
- View all vehicle data and media
- Submit quotes
- Track quote history

## Technology Stack Recommendations

### Frontend
- **React** with **Vite** - Fast, modern build tool
- **TypeScript** - Type safety
- **TailwindCSS** - Rapid UI development
- **React Query** - Data fetching/caching
- **React Hook Form** - Form management
- **Zustand** - State management
- **React Dropzone** - File uploads

### Backend
- **Node.js** with **Express** or **Fastify**
- **TypeScript** - Type safety
- **PostgreSQL** - Relational database for structured data
- **Prisma** - Type-safe ORM
- **AWS S3** or **Cloudflare R2** - Media storage
- **Sharp** - Image optimization
- **Nodemailer** - Email notifications

### Infrastructure
- **Vercel** or **Railway** - Frontend hosting
- **Railway** or **Fly.io** - Backend hosting
- **Cloudflare** - CDN and DDoS protection
- **Supabase** - Alternative all-in-one (DB + Storage + Auth)

## API Integration Plan

### 1. VIN Decoding (Free)
**NHTSA vPIC API** - https://vpic.nhtsa.dot.gov/api/
- **Endpoints:**
  - `DecodeVinValues` - Get year, make, model, trim, specs
  - `GetCanadianVehicleSpecifications` - Dimensions/weight
  - `GetManufacturerDetails` - OEM information
- **Rate Limits:** Automated traffic control (unspecified)
- **Format:** JSON/XML/CSV
- **Cost:** FREE

### 2. Vehicle History Check (Free)
**NICB VINCheck** - https://www.nicb.org/vincheck
- Check stolen vehicle records
- Check total loss records
- Free for consumers (5 searches per day per IP)
- Manual scraping or API if available

### 3. Vehicle Valuation Options

**Option A: KBB InfoDriver Web Service (IDWS)**
- Official KBB API
- Weekly updated values
- VIN decode capability
- RESTful API
- **Cost:** Enterprise pricing (contact sales)
- **Contact:** b2b.kbb.com/contact/

**Option B: Alternative APIs (Cost-Effective)**
- **Edmunds API** - Vehicle pricing/specs
- **Black Book** - Wholesale values
- **VinAudit** - Budget-friendly alternative ($4.99-$9.99/report)
- **Vehicle Databases API** - Aggregated pricing data

**Option C: Third-Party Aggregators**
- **RapidAPI Marketplace** - Various vehicle data APIs
- **Marketcheck API** - Real-time market pricing
- **ClearVin** - VIN decoder + valuations

### 4. CARFAX Integration
- **Official API:** Enterprise only (contact business development)
- **Alternatives:**
  - VinAudit ($4.99/report)
  - AutoCheck (Experian)
  - VehicleHistory.com
  - InstaVIN
  - CheapCarfax.net

## Database Schema

```sql
-- Users/Submitters
CREATE TABLE submitters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255),
  phone VARCHAR(20),
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Vehicle Submissions (Tickets)
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number VARCHAR(20) UNIQUE NOT NULL, -- e.g., "DT-2024-00001"
  submitter_id UUID REFERENCES submitters(id),

  -- Vehicle Info
  vin VARCHAR(17) NOT NULL,
  year INTEGER,
  make VARCHAR(100),
  model VARCHAR(100),
  trim VARCHAR(100),
  mileage INTEGER NOT NULL,

  -- Decoded VIN Data (JSON)
  vehicle_specs JSONB,

  -- Status
  status VARCHAR(50) DEFAULT 'pending', -- pending, forwarded, quoted, closed

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Media Files
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL, -- front, rear, driver_side, passenger_side, steering_wheel, front_seat, back_seat, video
  file_path VARCHAR(500) NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Dealer Partners
CREATE TABLE dealers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Quotes from Dealers
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES submissions(id),
  dealer_id UUID REFERENCES dealers(id),
  amount DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- pending, accepted, rejected
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- Referral Tracking
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES submitters(id),
  referee_id UUID REFERENCES submitters(id),
  submission_id UUID REFERENCES submissions(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## File Upload Strategy

### Image Upload Requirements
- **Max size per image:** 10MB
- **Accepted formats:** JPEG, PNG, HEIC, WebP
- **Processing:**
  - Compress to 1920x1080 max
  - Generate thumbnails (300x200)
  - Convert HEIC to JPEG
  - Store original + compressed versions

### Video Upload
- **Max size:** 500MB
- **Accepted formats:** MP4, MOV, AVI
- **Processing:**
  - Generate thumbnail from first frame
  - Compress if over 100MB
  - Optional: Transcode to web-friendly format

### Storage Options
1. **AWS S3** - Industry standard, ~$0.023/GB
2. **Cloudflare R2** - No egress fees, ~$0.015/GB
3. **Supabase Storage** - Integrated with DB, free tier 1GB

### Upload Flow
```
1. User selects files → Client-side validation
2. Generate presigned URLs (S3) or direct upload (R2)
3. Upload directly to storage (bypass server)
4. On success, save metadata to database
5. Generate thumbnails asynchronously
```

## Ticket Number Generation

Format: `DT-YYYY-#####`
- **DT** = Dealer Trade
- **YYYY** = Year
- **#####** = Zero-padded sequential number

Example: `DT-2025-00042`

```typescript
async function generateTicketNumber() {
  const year = new Date().getFullYear();
  const prefix = `DT-${year}-`;

  const lastTicket = await db.submission.findFirst({
    where: { ticket_number: { startsWith: prefix } },
    orderBy: { created_at: 'desc' }
  });

  const lastNumber = lastTicket
    ? parseInt(lastTicket.ticket_number.split('-')[2])
    : 0;

  const nextNumber = (lastNumber + 1).toString().padStart(5, '0');
  return `${prefix}${nextNumber}`;
}
```

## User Journey

### Submission Flow
1. User receives shareable link: `dealertrade.com/submit?ref=ABC123`
2. Opens mobile-friendly form
3. Enters VIN → Auto-decodes vehicle info
4. Confirms/edits Year, Mileage
5. Takes/uploads 7 required photos
6. (Optional) Uploads video
7. Enters contact info (email/phone)
8. Submits → Receives ticket number instantly
9. Gets confirmation email with tracking link

### Admin Flow
1. Dashboard shows all submissions (table view)
2. Click submission → Full detail view
3. View vehicle specs from VIN decoder
4. View all media (gallery)
5. Check KBB/market value estimates
6. Forward to selected dealers
7. Track dealer quotes
8. Notify customer when quotes arrive

### Dealer Flow
1. Receives email: "New appraisal request"
2. Logs into dealer portal
3. Views submission details + media
4. Reviews vehicle specs and history
5. Submits quote with notes
6. System notifies admin

## Additional Features to Consider

### Phase 1 (MVP)
- ✅ Submission form with media upload
- ✅ VIN decoder integration
- ✅ Ticket generation
- ✅ Basic admin dashboard
- ✅ Email notifications

### Phase 2
- 🔄 Dealer partner portal
- 🔄 Quote management system
- 🔄 SMS notifications (Twilio)
- 🔄 Referral tracking
- 🔄 Analytics dashboard

### Phase 3
- ⏳ Mobile app (React Native)
- ⏳ Live chat support
- ⏳ Automated valuation estimates
- ⏳ Customer portal (track submissions)
- ⏳ Integration with dealer management systems

## Recommended Tools & Services

### Development
- **VS Code** - IDE
- **Postman** - API testing
- **Prisma Studio** - Database GUI
- **React DevTools** - Frontend debugging

### Monitoring & Analytics
- **Sentry** - Error tracking
- **PostHog** - Product analytics
- **LogRocket** - Session replay
- **Mixpanel** - User behavior

### Communication
- **SendGrid** or **Resend** - Email delivery
- **Twilio** - SMS notifications
- **Slack** - Internal notifications

### SEO & Marketing
- **Next.js** - If SEO is priority
- **Google Analytics** - Traffic tracking
- **Meta Pixel** - Ad tracking

## Cost Estimates (Monthly)

### MVP Phase
- **Hosting:** $20-50 (Railway/Vercel)
- **Database:** $10-25 (Neon/Supabase)
- **Storage:** $5-20 (R2/S3 for 1000 submissions)
- **Email:** $0-15 (SendGrid free tier)
- **Domain:** $1/month
- **Total:** ~$35-110/month

### Growth Phase (1000 submissions/month)
- **Hosting:** $100-200
- **Database:** $50-100
- **Storage:** $50-100
- **Email:** $50
- **SMS:** $50-100 (optional)
- **APIs:** $100-500 (KBB/Carfax)
- **Total:** ~$400-1050/month

## Security Considerations

1. **Rate Limiting** - Prevent spam submissions
2. **File Validation** - Scan for malicious uploads
3. **HTTPS Only** - Encrypt all traffic
4. **CORS Configuration** - Restrict API access
5. **Authentication** - Secure admin/dealer portals
6. **PII Protection** - Encrypt sensitive data
7. **Backup Strategy** - Daily database backups

## Next Steps

1. ✅ Finalize technology stack
2. ⏳ Set up development environment
3. ⏳ Initialize frontend and backend projects
4. ⏳ Set up database with Prisma
5. ⏳ Configure file storage
6. ⏳ Build submission form
7. ⏳ Integrate VIN decoder
8. ⏳ Build admin dashboard
9. ⏳ Set up email notifications
10. ⏳ Deploy to staging environment
11. ⏳ Test with real submissions
12. ⏳ Launch MVP
