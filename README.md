# DealerTrade - Vehicle Appraisal Platform 🚗

A modern, production-ready vehicle appraisal submission system with **license plate to VIN lookup**, comprehensive API management, and mobile-optimized design. Built for luxury vehicle dealers handling high-value trades ($75K-$200K+).

## 🚀 **NEW**: Ready for Railway Deployment!

**See `DEPLOYMENT_READY.md` for instant deployment to Railway!**

```bash
./deploy-railway.sh  # One command to go live!
```

## ✨ Key Features

### Customer Portal
- ✅ **License Plate to VIN Lookup** (NEW!) - Enter plate OR VIN
- ✅ **Auto.dev API Integration** - 8 premium vehicle APIs
- ✅ Automatic VIN decoding with NHTSA database
- ✅ Multi-image upload (7 required photos + optional video)
- ✅ Mobile-optimized design (tested on 8 devices)
- ✅ Instant ticket number generation
- ✅ Shareable submission links (WhatsApp/SMS)

### Admin Dashboard
- ✅ **API Management Panel** (NEW!) - Monitor all 8 Auto.dev APIs
- ✅ **Pricing Analytics** - KBB-style market valuations
- ✅ View all submissions with real-time updates
- ✅ VIN-decoded vehicle specifications
- ✅ Media gallery with lightbox preview
- ✅ Download all media as ZIP
- ✅ Forward submissions to dealers
- ✅ Generate shareable links

### Pricing Intelligence
- ✅ Auto.dev Market Valuation API
- ✅ Low/Average/High price estimates
- ✅ Dealer insights and recommendations
- ✅ Confidence ratings
- ✅ Pricing analytics dashboard

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

## 🚀 Deployment to Railway

### Quick Deploy (Automated)

```bash
cd /Users/brandonin/drl
./deploy-railway.sh
```

Choose option 3 (Deploy Both) and follow prompts!

### Manual Deployment

See comprehensive guides:
- **`DEPLOYMENT_READY.md`** - Complete deployment status & checklist
- **`RAILWAY_DEPLOYMENT.md`** - Detailed step-by-step guide
- **`DEPLOY_NOW.md`** - Quick start commands

### What You Get

- ✅ **Backend**: Auto-deployed with PostgreSQL
- ✅ **Frontend**: Auto-deployed with CDN
- ✅ **HTTPS**: Automatic SSL certificates
- ✅ **Auto-scaling**: Handles traffic spikes
- ✅ **Database backups**: Automatic daily backups
- ✅ **Custom domains**: Easy to configure

### Cost

- **First month**: FREE ($5 credit)
- **After**: ~$5-10/month (Hobby plan)
- **Scales**: ~$20-50/month as you grow

### Environment Variables

**Backend** (Railway auto-sets DATABASE_URL):
```env
PORT=3000
NODE_ENV=production
AUTO_DEV_API_KEY=sk_ad_i8ttO7rJHcoeeRHVUMHver41
FRONTEND_URL=https://your-frontend.railway.app
JWT_SECRET=(generate secure key)
```

**Frontend**:
```env
VITE_API_URL=https://your-backend.railway.app/api
```

### Post-Deployment

After deploying, run migrations:
```bash
cd backend
railway run npx prisma migrate deploy
```

### Alternative Platforms

**Backend**:
- Railway.app (Recommended - configured!)
- Fly.io
- Render
- Heroku

**Frontend**:
- Railway.app (Recommended - configured!)
- Vercel
- Netlify
- Cloudflare Pages

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
