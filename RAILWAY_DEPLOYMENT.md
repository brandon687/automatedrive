# Railway Deployment Guide - DealerTrade Platform

## 🚀 Quick Deploy to Railway

Your DealerTrade platform is ready to deploy! Follow these steps to get it live.

---

## Prerequisites

- ✅ Railway CLI installed (already done!)
- ✅ Logged in to Railway as brandon@scalmob.com
- ✅ Git repository initialized

---

## Step 1: Create Railway Project

```bash
# Navigate to your project root
cd /Users/brandonin/drl

# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - DealerTrade platform"

# Create Railway project
railway init
```

**Choose**: "Create new project"
**Name**: dealertrade (or your preferred name)

---

## Step 2: Deploy Backend

```bash
# Navigate to backend
cd backend

# Link to Railway project
railway link

# Set environment variables
railway variables set PORT=3000
railway variables set NODE_ENV=production
railway variables set AUTO_DEV_API_KEY=sk_ad_i8ttO7rJHcoeeRHVUMHver41
railway variables set DATABASE_URL='postgresql://user:password@host:port/database'
railway variables set JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-please

# Deploy
railway up
```

### Important: Database Setup

Railway will automatically provision a PostgreSQL database. To get the connection string:

```bash
# Add PostgreSQL database (if not auto-added)
railway add

# Get database URL
railway variables
```

Copy the `DATABASE_URL` and ensure it's set in your backend environment.

---

## Step 3: Deploy Frontend

```bash
# Navigate to frontend
cd ../frontend

# Create new service in same project
railway service

# Set environment variables
railway variables set VITE_API_URL=https://your-backend-url.railway.app/api

# Deploy
railway up
```

**Note**: Replace `your-backend-url` with your actual backend Railway URL from Step 2.

---

## Step 4: Configure Environment Variables

### Backend Environment Variables (Required)

| Variable | Value | Description |
|----------|-------|-------------|
| `PORT` | `3000` | Server port |
| `NODE_ENV` | `production` | Environment |
| `DATABASE_URL` | (Railway provides) | PostgreSQL connection string |
| `AUTO_DEV_API_KEY` | `sk_ad_i8ttO7rJHcoeeRHVUMHver41` | Auto.dev API key |
| `JWT_SECRET` | (generate secure value) | JWT signing secret |
| `FRONTEND_URL` | `https://your-frontend.railway.app` | Frontend URL for CORS |

### Frontend Environment Variables (Required)

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_API_URL` | `https://your-backend.railway.app/api` | Backend API URL |

---

## Step 5: Run Database Migrations

After backend is deployed:

```bash
cd backend
railway run npx prisma migrate deploy
```

This will apply all database migrations to your production database.

---

## Alternative: Deploy via Railway Dashboard

### Option A: Deploy from GitHub (Recommended)

1. **Push to GitHub**:
```bash
cd /Users/brandonin/drl
git remote add origin https://github.com/your-username/dealertrade.git
git push -u origin main
```

2. **Connect to Railway**:
   - Go to https://railway.app/
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will detect both backend and frontend

3. **Configure Services**:
   - **Backend Service**:
     - Root Directory: `/backend`
     - Build Command: `npm run build`
     - Start Command: `npm run start:railway`

   - **Frontend Service**:
     - Root Directory: `/frontend`
     - Build Command: `npm run build`
     - Start Command: `npm run preview -- --host 0.0.0.0 --port $PORT`

4. **Add PostgreSQL Database**:
   - In your project, click "New"
   - Select "Database" → "Add PostgreSQL"
   - Railway will automatically set `DATABASE_URL` for backend

5. **Set Environment Variables**:
   - Backend: Add all variables from table above
   - Frontend: Add `VITE_API_URL` pointing to backend

---

## Step 6: Verify Deployment

### Check Backend Health
```bash
curl https://your-backend-url.railway.app/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-09T..."
}
```

### Check Frontend
Visit: `https://your-frontend-url.railway.app/`

You should see the customer submission form with license plate option!

### Check Admin Dashboard
Visit: `https://your-frontend-url.railway.app/admin`

You should see the admin dashboard with API Management tab!

---

## Step 7: Test License Plate Lookup

1. Go to your live frontend URL
2. Click "License Plate" tab
3. Enter: `7MGU382` and select `California`
4. Click "Continue"
5. Should auto-populate vehicle info!

---

## Environment Variable Generation

### Generate Secure JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it for `JWT_SECRET`.

---

## Troubleshooting

### Issue: Backend won't start
**Solution**: Check logs with `railway logs`
- Ensure `DATABASE_URL` is set
- Verify Prisma migrations ran successfully

### Issue: Frontend can't connect to backend
**Solution**:
- Check `VITE_API_URL` in frontend environment variables
- Ensure backend CORS is configured with correct frontend URL
- Update `FRONTEND_URL` in backend to match your frontend Railway URL

### Issue: License plate lookup not working
**Solution**:
- Verify `AUTO_DEV_API_KEY` is set in backend
- Check backend logs for API errors
- Test API key at https://api.auto.dev/

### Issue: Database errors
**Solution**:
```bash
cd backend
railway run npx prisma migrate reset
railway run npx prisma migrate deploy
```

---

## Cost Estimate

### Railway Pricing (as of Nov 2025)

**Hobby Plan** (Recommended for starting):
- $5/month base
- Includes $5 usage credit
- Additional: ~$0.000231/GB-hour for resources

**Estimated Monthly Cost**:
- Backend service: ~$3-5/month
- Frontend service: ~$2-3/month
- PostgreSQL: Included in Hobby plan
- **Total**: ~$5-10/month

**Free Trial**: Railway offers $5 free credit to start!

---

## Post-Deployment Checklist

- [ ] Backend health check returns 200 OK
- [ ] Frontend loads without errors
- [ ] Admin dashboard accessible
- [ ] License plate lookup working
- [ ] VIN decode working
- [ ] Image uploads working
- [ ] Database migrations applied
- [ ] Environment variables all set
- [ ] Auto.dev API key working
- [ ] CORS configured correctly

---

## Updating Your Deployment

### Method 1: Git Push (if using GitHub integration)
```bash
git add .
git commit -m "Update feature"
git push origin main
```

Railway will automatically rebuild and redeploy!

### Method 2: Railway CLI
```bash
cd backend  # or frontend
railway up
```

---

## Monitoring & Logs

### View Logs
```bash
# Backend logs
cd backend && railway logs

# Frontend logs
cd frontend && railway logs

# Follow logs in real-time
railway logs --follow
```

### View Metrics
Visit Railway dashboard: https://railway.app/project/your-project

---

## Custom Domain (Optional)

1. Go to Railway project settings
2. Click on your service (backend or frontend)
3. Go to "Settings" → "Domains"
4. Click "Generate Domain" or "Add Custom Domain"
5. For custom domain: Add DNS records as shown

Example setup:
- Backend: `api.dealertrade.com`
- Frontend: `dealertrade.com`

---

## Backup Strategy

### Database Backups
Railway automatically backs up PostgreSQL databases.

**Manual backup**:
```bash
cd backend
railway run pg_dump $DATABASE_URL > backup.sql
```

**Restore backup**:
```bash
railway run psql $DATABASE_URL < backup.sql
```

---

## Security Recommendations

### Before Going Public

1. **Change JWT Secret**: Generate a new secure secret
2. **Review CORS**: Ensure only your frontend can access backend
3. **Add Rate Limiting**: Already configured, but review limits
4. **Enable HTTPS**: Railway provides this automatically
5. **Add Authentication**: Protect admin routes
6. **Review API Keys**: Rotate sensitive keys
7. **Set up Monitoring**: Use Railway metrics or external service

---

## Quick Command Reference

```bash
# Initialize project
railway init

# Link to existing project
railway link

# Set environment variable
railway variables set KEY=value

# Deploy
railway up

# View logs
railway logs

# Open in browser
railway open

# Run command in Railway environment
railway run <command>

# List all services
railway status

# Delete service
railway service delete
```

---

## Support & Resources

- **Railway Docs**: https://docs.railway.app/
- **Railway Discord**: https://discord.gg/railway
- **Auto.dev Docs**: https://api.auto.dev/docs
- **Project Docs**: See `API_SETUP_GUIDE.md` and `TEST_RESULTS_SUMMARY.md`

---

## Your Deployment is Ready! 🎉

Once deployed, share these URLs:
- **Customer Form**: `https://your-frontend.railway.app/`
- **Admin Dashboard**: `https://your-frontend.railway.app/admin`
- **API Docs**: `https://your-backend.railway.app/api`

**Next Steps**:
1. Test all features on live site
2. Share with beta users
3. Monitor logs for any issues
4. Set up custom domain
5. Add analytics/monitoring

Good luck with your DealerTrade platform launch! 🚗💨
