# 🚀 Deploy to Railway NOW - Quick Start

## Your Code is Ready! Just Run These Commands:

### Option 1: Automated Deployment Script (Easiest!)

```bash
cd /Users/brandonin/drl
./deploy-railway.sh
```

Choose option 3 (Deploy Both) and follow the prompts!

---

### Option 2: Manual Step-by-Step

#### Step 1: Deploy Backend

```bash
cd /Users/brandonin/drl/backend

# Create new Railway project
railway init

# Deploy backend
railway up

# Set environment variables
railway variables set PORT=3000
railway variables set NODE_ENV=production
railway variables set AUTO_DEV_API_KEY=sk_ad_i8ttO7rJHcoeeRHVUMHver41

# Add PostgreSQL database
railway add

# Run migrations
railway run npx prisma migrate deploy

# Get your backend URL
railway open
```

Copy your backend URL (e.g., `https://xxx.railway.app`)

#### Step 2: Deploy Frontend

```bash
cd /Users/brandonin/drl/frontend

# Link to same project
railway link

# Set backend URL (replace with YOUR backend URL from Step 1)
railway variables set VITE_API_URL=https://YOUR-BACKEND-URL.railway.app/api

# Deploy frontend
railway up

# Get your frontend URL
railway open
```

#### Step 3: Update Backend CORS

```bash
cd /Users/brandonin/drl/backend

# Set frontend URL (replace with YOUR frontend URL from Step 2)
railway variables set FRONTEND_URL=https://YOUR-FRONTEND-URL.railway.app

# Restart to apply changes
railway up
```

---

## ✅ Verify Deployment

### Test Backend
```bash
curl https://YOUR-BACKEND-URL.railway.app/health
```

Should return: `{"status":"ok","timestamp":"..."}`

### Test Frontend
Open in browser: `https://YOUR-FRONTEND-URL.railway.app/`

### Test License Plate Lookup
1. Go to your frontend URL
2. Click "License Plate" tab
3. Enter `7MGU382` and select `California`
4. Click Continue - should auto-populate!

### Test Admin Dashboard
Open: `https://YOUR-FRONTEND-URL.railway.app/admin`
Click "API Management" tab to see all APIs!

---

## 🔧 Troubleshooting

### Backend won't start?
```bash
cd backend
railway logs
```

Look for errors. Common fixes:
- Make sure DATABASE_URL is set (Railway auto-sets this when you add PostgreSQL)
- Run migrations: `railway run npx prisma migrate deploy`

### Frontend can't connect to backend?
```bash
cd frontend
railway variables
```

Make sure `VITE_API_URL` is set correctly!

### License plate lookup not working?
Check backend has `AUTO_DEV_API_KEY` set:
```bash
cd backend
railway variables | grep AUTO_DEV
```

---

## 📝 Important URLs to Save

After deployment, save these URLs:

- **Backend API**: `https://xxx.railway.app`
- **Frontend App**: `https://yyy.railway.app`
- **Admin Dashboard**: `https://yyy.railway.app/admin`
- **Railway Dashboard**: https://railway.app/

---

## 💰 Cost

- **First Month**: FREE ($5 credit)
- **After**: ~$5-10/month (Hobby plan)

---

## 🎉 You're Live!

Once deployed:
1. Share your frontend URL with customers
2. Access admin dashboard to manage submissions
3. Monitor usage on Railway dashboard
4. Enjoy your always-live DealerTrade platform!

**Questions?** Check `RAILWAY_DEPLOYMENT.md` for full details.
