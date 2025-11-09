# DealerTrade - Vehicle Appraisal Platform

A modern, streamlined vehicle appraisal submission system that allows users to easily submit their vehicle information and media for dealer quotes. Features include VIN decoding, multi-file uploads, ticketing system, and dealer partner portal.

## Features

### User Portal
- ✅ Shareable submission links for viral growth
- ✅ Automatic VIN decoding with NHTSA database
- ✅ Multi-image upload (7 required photos)
- ✅ Optional video upload for better quotes
- ✅ Instant ticket number generation
- ✅ Email confirmation with tracking

### Admin Dashboard (To Be Built)
- View all submissions with filtering
- VIN-decoded vehicle specifications
- Media gallery viewer
- Forward submissions to dealers
- Track quote statuses

### Dealer Portal (To Be Built)
- Receive forwarded submissions
- View vehicle data and media
- Submit competitive quotes
- Track quote history

## Tech Stack

### Frontend
- **React 19** with **TypeScript**
- **Vite** - Fast build tool
- **TailwindCSS** - Utility-first styling
- **TanStack Query** - Data fetching/caching
- **React Hook Form** - Form management
- **React Dropzone** - File uploads
- **Axios** - HTTP client

### Backend
- **Node.js** with **Express**
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **Prisma ORM** - Type-safe database access
- **Multer** - File upload handling
- **Sharp** - Image processing
- **Nodemailer** - Email notifications
- **NHTSA vPIC API** - Free VIN decoding

## Project Structure

```
drl/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── src/
│   │   ├── controllers/           # Request handlers
│   │   ├── routes/                # API routes
│   │   ├── services/              # Business logic
│   │   ├── middleware/            # Custom middleware
│   │   ├── utils/                 # Helper functions
│   │   └── index.ts               # Server entry point
│   ├── .env.example               # Environment variables template
│   ├── tsconfig.json              # TypeScript config
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/            # React components
│   │   │   ├── SubmissionForm.tsx # Main submission form
│   │   │   ├── MediaUpload.tsx    # File upload component
│   │   │   └── SuccessModal.tsx   # Success screen
│   │   ├── lib/
│   │   │   └── api.ts             # API client
│   │   ├── App.tsx                # Main app component
│   │   └── index.css              # Global styles
│   ├── .env.example               # Environment variables template
│   ├── tailwind.config.js         # Tailwind configuration
│   └── package.json
│
└── PROJECT_PLAN.md                # Detailed project documentation
```

## Getting Started

### Prerequisites
- **Node.js** 18+ and npm
- **PostgreSQL** 14+
- **Git**

### 1. Clone the Repository

```bash
cd drl
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration:
# - DATABASE_URL: Your PostgreSQL connection string
# - SMTP settings for email notifications
# - Other configuration values
```

#### Database Setup

You have two options:

**Option A: Use Local PostgreSQL**
```bash
# Create a database
createdb dealertrade

# Update DATABASE_URL in .env
DATABASE_URL="postgresql://username:password@localhost:5432/dealertrade?schema=public"

# Run migrations
npm run prisma:migrate

# Generate Prisma Client
npm run prisma:generate
```

**Option B: Use Supabase (Recommended for quick start)**
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Get the connection string from Settings > Database
4. Update DATABASE_URL in .env
5. Run migrations

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

#### Start Backend Server

```bash
npm run dev
```

Server will run on http://localhost:3000

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env:
VITE_API_URL=http://localhost:3000/api

# Start development server
npm run dev
```

Frontend will run on http://localhost:5173

## API Endpoints

### Public Endpoints

#### Decode VIN
```
GET /api/vin/decode/:vin
```
Decode a VIN using NHTSA database.

**Response:**
```json
{
  "success": true,
  "data": {
    "vin": "1HGBH41JXMN109186",
    "year": 2020,
    "make": "Honda",
    "model": "Accord",
    "trim": "EX-L",
    "vehicleType": "Sedan",
    ...
  }
}
```

#### Create Submission
```
POST /api/submissions
```
Create a new vehicle appraisal submission.

**Body:**
```json
{
  "vin": "1HGBH41JXMN109186",
  "mileage": 50000,
  "email": "user@example.com",
  "phone": "(555) 123-4567",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "ticketNumber": "DT-2025-00001",
  "submissionId": "uuid",
  "vehicle": {
    "vin": "1HGBH41JXMN109186",
    "year": 2020,
    "make": "Honda",
    "model": "Accord"
  }
}
```

#### Upload Media
```
POST /api/submissions/:submissionId/media
Content-Type: multipart/form-data
```
Upload photos and video for a submission.

**Form Fields:**
- `front` - Front view photo
- `rear` - Rear view photo
- `driver_side` - Driver side photo
- `passenger_side` - Passenger side photo
- `steering_wheel` - Steering wheel photo
- `front_seat` - Front seat photo
- `back_seat` - Back seat photo
- `video` - Optional video walkthrough

#### Get Submission
```
GET /api/submissions/:ticketNumber
```
Retrieve submission details by ticket number.

### Admin Endpoints (TODO: Add authentication)

#### Get All Submissions
```
GET /api/admin/submissions?status=pending&search=Honda&page=1&limit=20
```

#### Update Submission Status
```
PATCH /api/admin/submissions/:id/status
```

#### Forward to Dealers
```
POST /api/admin/submissions/:id/forward
```

### Dealer Endpoints (TODO: Add authentication)

#### Get Assigned Submissions
```
GET /api/dealer/submissions?dealerId=uuid
```

#### Submit Quote
```
POST /api/dealer/submissions/:submissionId/quote
```

## Database Schema

See `backend/prisma/schema.prisma` for the complete schema.

**Main Models:**
- `Submitter` - User contact information
- `Submission` - Vehicle appraisal submissions
- `Media` - Uploaded photos and videos
- `Dealer` - Dealer partner information
- `Quote` - Dealer quotes on submissions
- `Referral` - Referral tracking

## Email Notifications

The system sends email notifications for:
- **User confirmation** - When submission is received
- **Admin notification** - When new submission arrives
- **Dealer notification** - When submission is forwarded (TODO)
- **Quote notification** - When dealer submits quote (TODO)

Configure SMTP settings in `.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@dealertrade.com
```

For Gmail, you'll need to:
1. Enable 2-factor authentication
2. Generate an "App Password"
3. Use the app password in SMTP_PASS

## External APIs Used

### NHTSA vPIC API (Free)
- **Purpose:** VIN decoding
- **Endpoint:** https://vpic.nhtsa.dot.gov/api/
- **Rate Limits:** Automatic traffic control (unspecified)
- **Cost:** FREE
- **Documentation:** https://vpic.nhtsa.dot.gov/api/

### Recommended Additional APIs

#### Vehicle Valuation
- **KBB InfoDriver Web Service (IDWS)** - Official KBB API (Enterprise pricing)
- **Edmunds API** - Vehicle pricing and specs
- **Black Book** - Wholesale values
- **VinAudit** - Budget alternative ($4.99-$9.99/report)

#### Vehicle History
- **CARFAX API** - Enterprise only
- **AutoCheck** - Experian-backed alternative
- **VinAudit** - Budget-friendly option

## Development Tools

### Prisma Studio
View and edit database records:
```bash
cd backend
npm run prisma:studio
```

### Database Migrations
```bash
# Create a new migration
npm run prisma:migrate

# Reset database (⚠️ deletes all data)
npx prisma migrate reset
```

## Deployment

### Backend Deployment

**Recommended platforms:**
- **Railway.app** - Easy PostgreSQL + Node.js hosting
- **Fly.io** - Low-latency global deployment
- **Render** - Free tier available
- **Heroku** - Classic PaaS

**Environment variables to set:**
- `DATABASE_URL`
- `PORT`
- `NODE_ENV=production`
- `SMTP_*` settings
- `FRONTEND_URL`
- `JWT_SECRET`

### Frontend Deployment

**Recommended platforms:**
- **Vercel** - Optimized for Vite/React
- **Netlify** - Easy CDN deployment
- **Cloudflare Pages** - Fast global CDN

**Environment variables:**
- `VITE_API_URL` - Your backend API URL

### Build Commands

```bash
# Frontend
cd frontend
npm run build
# Output: dist/

# Backend
cd backend
npm run build
# Output: dist/
npm start
```

## Security Considerations

- ✅ Rate limiting on API endpoints
- ✅ File type validation for uploads
- ✅ VIN format validation
- ✅ CORS configuration
- ✅ Helmet security headers
- ⏳ Authentication for admin/dealer portals (TODO)
- ⏳ File malware scanning (TODO)
- ⏳ HTTPS enforcement in production (TODO)

## Future Enhancements

### Phase 2
- [ ] Admin dashboard UI
- [ ] Dealer partner portal UI
- [ ] SMS notifications (Twilio)
- [ ] Advanced referral tracking
- [ ] Analytics dashboard

### Phase 3
- [ ] Mobile app (React Native)
- [ ] Live chat support
- [ ] Automated valuation estimates (KBB API)
- [ ] Customer portal for tracking submissions
- [ ] Integration with dealer management systems
- [ ] Multi-language support

## Cost Estimates

### Development/MVP (Small scale)
- Hosting: $20-50/month (Railway/Vercel)
- Database: $10-25/month (Supabase/Neon)
- Storage: $5-20/month (for 1000 submissions)
- Email: $0-15/month (SendGrid free tier)
- Domain: $1/month
- **Total: ~$35-110/month**

### Growth Phase (1000 submissions/month)
- Hosting: $100-200/month
- Database: $50-100/month
- Storage: $50-100/month
- Email: $50/month
- SMS: $50-100/month (optional)
- APIs: $100-500/month (KBB/Carfax)
- **Total: ~$400-1050/month**

## Troubleshooting

### Backend won't start
- Check DATABASE_URL is correct
- Ensure PostgreSQL is running
- Run `npm run prisma:generate`

### Frontend API errors
- Verify VITE_API_URL in `.env`
- Check backend is running on correct port
- Check browser console for CORS errors

### File uploads failing
- Check UPLOAD_DIR exists and is writable
- Verify file size limits
- Check disk space

### Emails not sending
- Verify SMTP credentials
- Check firewall/security settings
- Test with a different SMTP provider

## Contributing

This is a private project. For questions or feature requests, contact the development team.

## License

Proprietary - All rights reserved.

---

**Built with ❤️ for DealerTrade**

For support, contact: support@dealertrade.com
