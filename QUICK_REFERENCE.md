# DealerTrade Project - Quick Reference

## 🌐 Live Application URLs

### Backend API
- **Production URL**: https://automatedrive-production.up.railway.app
- **Health Check**: https://automatedrive-production.up.railway.app/health
- **API Docs**: https://automatedrive-production.up.railway.app/

### Railway Dashboard
- **Project**: https://railway.com/project/3b065918-e2c0-4551-a7b4-2c73720afdde
- **Backend Service**: https://railway.com/project/3b065918-e2c0-4551-a7b4-2c73720afdde/service/f988fe11-34e1-44fa-ba5e-ff095a8d49ba
- **Database**: https://railway.com/project/3b065918-e2c0-4551-a7b4-2c73720afdde/service/postgres

### GitHub
- **Repository**: https://github.com/brandon687/automatedrive
- **Latest Deployment Commit**: 193df0c

---

## 🚀 Quick Commands

### Deploy to Railway
```bash
railway up --detach
```

### View Logs
```bash
railway logs --service automatedrive
```

### Check Variables
```bash
railway variables --service automatedrive
```

### Test API
```bash
# Health check
curl https://automatedrive-production.up.railway.app/health

# API root
curl https://automatedrive-production.up.railway.app/
```

---

## 📋 API Endpoints

Base URL: https://automatedrive-production.up.railway.app

### Core
- GET / - API info
- GET /health - Health check

### Submissions
- POST /api/submissions - Create submission
- GET /api/submissions/:id - Get submission
- GET /api/submissions - List all (admin)

### Lookups
- GET /api/vin/:vin - VIN decode
- GET /api/license-plate/:plate - Plate lookup

### Dealer
- POST /api/dealer/register - Register
- POST /api/dealer/login - Login
- GET /api/dealer/profile - Get profile

### Admin
- POST /admin/login - Admin login
- GET /admin/dashboard - Dashboard
- GET /admin/submissions - All submissions
- GET /admin/dealers - All dealers

---

## 🔑 Environment Variables (Set in Railway)

### Currently Set
- ✅ DATABASE_URL - Auto from Postgres
- ✅ PORT - Auto from Railway
- ✅ NODE_ENV - production

### Need to Add
JWT_SECRET=<generate-random-string>
AUTO_DEV_API_KEY=sk_ad_i8ttO7rJHcoeeRHVUMHver41
FRONTEND_URL=<your-frontend-url>

---

## 🔧 Critical Configuration Files

### Build Config
- /nixpacks.toml - Railway build settings (BUILD-TIME DATABASE_URL)
- /backend/railway.json - Service config
- /backend/package.json - Build scripts

### Database
- /backend/prisma/schema.prisma - Schema definition
- /backend/prisma/migrations/ - Migration history

---

## 🐛 Quick Troubleshooting

### Build Fails
Check: /nixpacks.toml line 8 has placeholder DATABASE_URL

### Runtime Crashes
Check: Railway variables for correct DATABASE_URL (not DATABASE_URl)

### 502 Errors
Wait 30-60s for startup, then check:
railway logs --service automatedrive

---

## 📚 Full Documentation
- Detailed deployment success: /DEPLOYMENT_SUCCESS_2025-11-09.md
- Setup guide: /RAILWAY_DEPLOYMENT.md
- Backend API docs: /backend/README.md

---

Last Updated: November 9, 2025 - Deployment Successful ✅
