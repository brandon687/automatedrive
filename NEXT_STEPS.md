# Next Steps - DealerTrade Setup Guide

## Immediate Actions Required

### 1. Database Setup (Choose One Option)

#### Option A: Local PostgreSQL (For Development)
```bash
# Install PostgreSQL if not installed
# macOS:
brew install postgresql
brew services start postgresql

# Create database
createdb dealertrade

# Update backend/.env
DATABASE_URL="postgresql://YOUR_USERNAME@localhost:5432/dealertrade?schema=public"
```

#### Option B: Supabase (Recommended - Free & Easy)
1. Go to https://supabase.com
2. Create a free account
3. Click "New Project"
4. Copy the "Connection String" from Settings > Database
5. Update `backend/.env` with the connection string

### 2. Configure Backend Environment

Edit `backend/.env`:

```env
# Database - REQUIRED
DATABASE_URL="your-connection-string-here"

# Email Configuration - REQUIRED for notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
SMTP_FROM=noreply@dealertrade.com

# Optional: Admin email for notifications
ADMIN_EMAIL=admin@dealertrade.com

# Frontend URL (update in production)
FRONTEND_URL=http://localhost:5173
```

**For Gmail SMTP:**
1. Enable 2-Factor Authentication in Google Account
2. Go to: https://myaccount.google.com/apppasswords
3. Generate "App Password" for "Mail"
4. Use this password in SMTP_PASS

**Alternative Email Services:**
- SendGrid (sendgrid.com) - 100 emails/day free
- Resend (resend.com) - 3000 emails/month free
- Mailgun (mailgun.com) - 5000 emails/month free

### 3. Run Database Migrations

```bash
cd backend

# Generate Prisma Client
npm run prisma:generate

# Run migrations to create tables
npm run prisma:migrate
# When prompted, name your migration: "init"
```

### 4. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Visit: http://localhost:5173

## Testing the Application

### Test VIN Decoding
Use these sample VINs for testing:
- `1HGBH41JXMN109186` - 2020 Honda Accord
- `1FTFW1ET5BFC10966` - 2011 Ford F-150
- `WBADT43452G922100` - 2002 BMW 325i
- `2HGFG12648H542422` - 2008 Honda Civic

### Test Complete Flow
1. Enter a VIN
2. Fill in mileage and contact info
3. Upload 7 required photos (any images for testing)
4. (Optional) Upload a video
5. Submit and note your ticket number
6. Check your email for confirmation

## Database Management

### View Your Data with Prisma Studio
```bash
cd backend
npm run prisma:studio
```
This opens a GUI at http://localhost:5555 to view/edit your database.

### Seed Sample Data (Optional)

Create `backend/prisma/seed.ts`:
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample dealers
  await prisma.dealer.createMany({
    data: [
      {
        name: 'Premium Auto Group',
        email: 'quotes@premiumauto.com',
        phone: '(555) 100-1000',
      },
      {
        name: 'Quality Motors',
        email: 'sales@qualitymotors.com',
        phone: '(555) 200-2000',
      },
    ],
  });

  console.log('✅ Database seeded');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
```

Then run:
```bash
npx tsx prisma/seed.ts
```

## Production Deployment Checklist

### Backend
- [ ] Set up production database (Supabase/Railway/Render)
- [ ] Update DATABASE_URL in production
- [ ] Set NODE_ENV=production
- [ ] Configure production SMTP
- [ ] Set secure JWT_SECRET
- [ ] Enable HTTPS
- [ ] Configure CORS for production frontend URL
- [ ] Set up file storage (AWS S3/Cloudflare R2)

### Frontend
- [ ] Build: `npm run build`
- [ ] Deploy to Vercel/Netlify/Cloudflare Pages
- [ ] Set VITE_API_URL to production backend
- [ ] Configure custom domain
- [ ] Set up analytics (optional)

### Recommended Services

**Hosting:**
- **Backend:** Railway.app (has free tier with PostgreSQL)
- **Frontend:** Vercel (free for personal projects)
- **Storage:** Cloudflare R2 (10GB free, no egress fees)

**Quick Deploy with Railway:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy backend
cd backend
railway init
railway up
```

## Building Admin Dashboard (Next Phase)

The backend API is ready. To build the admin dashboard:

1. Create new routes in `frontend/`:
   - `/admin` - Main dashboard
   - `/admin/submissions` - List all submissions
   - `/admin/submissions/:id` - View details

2. Add authentication:
   - Install `jsonwebtoken`
   - Create auth middleware
   - Add login/logout endpoints
   - Protect admin routes

3. Create admin components:
   - SubmissionList.tsx
   - SubmissionDetail.tsx
   - DealerManagement.tsx
   - QuoteTracking.tsx

## Building Dealer Portal (Next Phase)

Similar to admin dashboard but with dealer-specific views:

1. Dealer authentication
2. View assigned submissions
3. Submit quote form
4. Quote history

## Useful Commands

```bash
# Backend
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Run production build
npm run prisma:studio    # Open database GUI
npm run prisma:migrate   # Create migration

# Frontend
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Database
npx prisma migrate reset # Reset database (⚠️ deletes data)
npx prisma db push       # Quick sync schema (dev only)
npx prisma db pull       # Pull schema from existing DB
```

## Troubleshooting

### "Module not found" errors
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install
npm run prisma:generate

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Database connection fails
- Check DATABASE_URL format
- Ensure database exists
- Check firewall/network settings
- Verify credentials

### CORS errors
- Verify FRONTEND_URL in backend/.env
- Check VITE_API_URL in frontend/.env
- Restart both servers

### File upload issues
- Check UPLOAD_DIR exists: `mkdir backend/uploads`
- Verify permissions
- Check file size limits

## Getting Help

### Documentation
- Prisma: https://prisma.io/docs
- Express: https://expressjs.com
- React Query: https://tanstack.com/query/latest
- React Hook Form: https://react-hook-form.com

### APIs
- NHTSA vPIC: https://vpic.nhtsa.dot.gov/api/

## Recommended VS Code Extensions

- Prisma (official)
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Thunder Client (API testing)

---

## Quick Start Summary

```bash
# 1. Set up database (Supabase recommended)

# 2. Configure .env files
backend/.env - Add DATABASE_URL and SMTP settings
frontend/.env - Verify API URL

# 3. Initialize database
cd backend
npm run prisma:generate
npm run prisma:migrate

# 4. Start servers (2 terminals)
cd backend && npm run dev
cd frontend && npm run dev

# 5. Test at http://localhost:5173
```

## What's Working Now

✅ Full submission form with 4-step wizard
✅ VIN decoding with NHTSA API
✅ Multi-file upload (images + video)
✅ Automatic ticket number generation
✅ Email notifications
✅ Database with all models
✅ Complete backend API
✅ Type-safe codebase
✅ Mobile-responsive UI

## What Needs Building

⏳ Admin dashboard UI
⏳ Dealer portal UI
⏳ Authentication system
⏳ Quote management interface
⏳ Analytics dashboard
⏳ SMS notifications

---

Ready to start? Follow step 1 above!
