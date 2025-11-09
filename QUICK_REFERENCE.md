# DealerTrade - Quick Reference Card

## 🚀 Quick Start (5 Minutes)

```bash
# 1. Set up database (use Supabase - free!)
# Go to supabase.com, create project, copy connection string

# 2. Configure backend
cd backend
cp .env.example .env
# Edit .env - add DATABASE_URL and SMTP settings

# 3. Initialize database
npm run prisma:generate
npm run prisma:migrate

# 4. Start backend (Terminal 1)
npm run dev

# 5. Start frontend (Terminal 2)
cd ../frontend
npm run dev

# 6. Visit http://localhost:5173
```

## 📁 Project Structure

```
drl/
├── backend/           ← Node.js + Express + TypeScript
│   ├── prisma/        ← Database schema & migrations
│   ├── src/
│   │   ├── controllers/  ← Request handlers
│   │   ├── routes/       ← API endpoints
│   │   ├── services/     ← Business logic
│   │   ├── middleware/   ← Custom middleware
│   │   └── utils/        ← Helper functions
│   └── .env           ← Configuration
│
└── frontend/          ← React + TypeScript + Vite
    ├── src/
    │   ├── components/   ← React components
    │   └── lib/          ← API client
    └── .env           ← Configuration
```

## 🔑 Key Files

| File | Purpose |
|------|---------|
| `backend/prisma/schema.prisma` | Database models |
| `backend/src/index.ts` | Server entry point |
| `backend/src/services/vin.service.ts` | VIN decoding |
| `backend/.env` | Backend config |
| `frontend/src/components/SubmissionForm.tsx` | Main form |
| `frontend/src/lib/api.ts` | API client |
| `frontend/.env` | Frontend config |

## 🌐 API Endpoints

### Public
```
GET  /api/vin/decode/:vin              - Decode VIN
POST /api/submissions                  - Create submission
POST /api/submissions/:id/media        - Upload files
GET  /api/submissions/:ticketNumber    - Get submission
```

### Admin (TODO: Add auth)
```
GET   /api/admin/submissions           - List all
GET   /api/admin/submissions/:id       - View details
PATCH /api/admin/submissions/:id/status - Update status
POST  /api/admin/submissions/:id/forward - Forward to dealers
```

### Dealer (TODO: Add auth)
```
GET  /api/dealer/submissions                - View assigned
POST /api/dealer/submissions/:id/quote      - Submit quote
```

## 🛠 Common Commands

### Backend
```bash
npm run dev              # Start dev server (port 3000)
npm run build            # Compile TypeScript
npm start                # Run production build
npm run prisma:studio    # Open database GUI
npm run prisma:migrate   # Create new migration
```

### Frontend
```bash
npm run dev              # Start dev server (port 5173)
npm run build            # Build for production
npm run preview          # Preview production build
```

### Database
```bash
npx prisma studio        # Open database GUI
npx prisma migrate dev   # Run migrations
npx prisma generate      # Generate Prisma Client
npx prisma db push       # Push schema (dev only)
```

## 🧪 Test VINs

Use these for testing:
- `1HGBH41JXMN109186` - 2020 Honda Accord
- `1FTFW1ET5BFC10966` - 2011 Ford F-150
- `WBADT43452G922100` - 2002 BMW 325i
- `2HGFG12648H542422` - 2008 Honda Civic

## 📧 Email Setup (Gmail)

```bash
# 1. Enable 2FA in Google Account
# 2. Generate App Password:
#    https://myaccount.google.com/apppasswords
# 3. Add to backend/.env:

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
```

## 🗄 Database Setup Options

### Option A: Supabase (Recommended)
```
1. Go to supabase.com
2. Create account + project
3. Get connection string from Settings > Database
4. Add to backend/.env:
   DATABASE_URL="postgresql://..."
```

### Option B: Local PostgreSQL
```bash
brew install postgresql
brew services start postgresql
createdb dealertrade

# In backend/.env:
DATABASE_URL="postgresql://username@localhost:5432/dealertrade"
```

## 🔒 Environment Variables

### Backend (.env)
```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://..."
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=app-password
SMTP_FROM=noreply@dealertrade.com
FRONTEND_URL=http://localhost:5173
JWT_SECRET=change-this-secret
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
```

## 🚨 Troubleshooting

### Backend won't start
```bash
# Check database connection
cd backend
npm run prisma:generate
npm run prisma:migrate

# Verify .env file exists and has DATABASE_URL
cat .env | grep DATABASE_URL
```

### Frontend API errors
```bash
# Check backend is running
curl http://localhost:3000/health

# Should return: {"status":"ok","timestamp":"..."}

# Check VITE_API_URL in frontend/.env
cd frontend
cat .env
```

### Database errors
```bash
# Reset database (⚠️ deletes all data)
cd backend
npx prisma migrate reset

# Regenerate Prisma Client
npm run prisma:generate
```

### File uploads failing
```bash
# Create uploads directory
mkdir backend/uploads

# Check permissions
ls -la backend/uploads
```

## 📊 Database Schema (Quick)

```sql
submitters
  ├─ id (UUID)
  ├─ email
  ├─ phone
  └─ name

submissions
  ├─ id (UUID)
  ├─ ticketNumber (DT-2025-00001)
  ├─ vin
  ├─ year, make, model, mileage
  ├─ status (pending/forwarded/quoted/closed)
  └─ vehicleSpecs (JSON)

media
  ├─ id (UUID)
  ├─ submissionId → submissions.id
  ├─ type (front/rear/video/etc)
  └─ filePath

dealers
  ├─ id (UUID)
  ├─ name, email, phone
  └─ isActive

quotes
  ├─ id (UUID)
  ├─ submissionId → submissions.id
  ├─ dealerId → dealers.id
  ├─ amount (DECIMAL)
  └─ status
```

## 🎯 User Flow

1. **Enter VIN** → Auto-decode vehicle info
2. **Enter Details** → Mileage + contact info
3. **Upload Photos** → 7 required + optional video
4. **Submit** → Get ticket number + email confirmation
5. **Admin Reviews** → Forwards to dealers
6. **Dealers Quote** → Submit offers
7. **User Notified** → Best quotes sent via email

## 📦 Tech Stack

**Frontend:** React 19, TypeScript, Vite, TailwindCSS, TanStack Query
**Backend:** Node.js, Express, TypeScript, Prisma
**Database:** PostgreSQL
**APIs:** NHTSA vPIC (VIN decode)
**Email:** Nodemailer (SMTP)

## 🔗 Important Links

- **NHTSA API Docs:** https://vpic.nhtsa.dot.gov/api/
- **Prisma Docs:** https://prisma.io/docs
- **TanStack Query:** https://tanstack.com/query/latest
- **Supabase:** https://supabase.com

## 📝 Next Steps

1. ✅ Read **NEXT_STEPS.md** for detailed setup
2. ✅ Read **README.md** for comprehensive docs
3. ✅ Read **PROJECT_PLAN.md** for architecture
4. ✅ Read **ARCHITECTURE.md** for system design

## 🎨 UI Components

```
SubmissionForm
├─ Step 1: VIN Entry
│  └─ Auto-decode on continue
├─ Step 2: Details
│  ├─ Vehicle info (decoded)
│  ├─ Mileage input
│  └─ Contact form
├─ Step 3: Media Upload
│  ├─ 7 photo boxes (drag & drop)
│  └─ Video upload (optional)
└─ Step 4: Success
   ├─ Ticket number display
   └─ Share buttons
```

## 💰 Cost Estimate

**Development (Free Tier):**
- Supabase: $0/month (500MB)
- Vercel: $0/month
- Railway: $0/month ($5 credit)
- SendGrid: $0/month (100 emails/day)
- **Total: ~$1/month (domain only)**

**Production (1K submissions/month):**
- Database: $50/month
- Hosting: $100/month
- Storage: $50/month
- Email: $50/month
- **Total: ~$250/month**

## 🔐 Security Checklist

- ✅ Rate limiting (100 req/15min)
- ✅ Helmet.js security headers
- ✅ CORS configuration
- ✅ Input validation
- ✅ File type validation
- ✅ SQL injection prevention (Prisma)
- ⏳ Authentication (TODO)
- ⏳ HTTPS in production (TODO)

## 📱 Browser Support

✅ Chrome/Edge (latest)
✅ Firefox (latest)
✅ Safari (latest)
✅ Mobile browsers (iOS/Android)

## 🎓 Resources

- **Project Docs:** See README.md, NEXT_STEPS.md
- **API Examples:** See PROJECT_PLAN.md
- **Architecture:** See ARCHITECTURE.md
- **Support:** Check troubleshooting sections

---

**Quick tip:** Start with **NEXT_STEPS.md** for step-by-step instructions!
