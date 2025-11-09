# Manual Railway Deployment Steps

## ✅ What's Already Done:

1. ✅ Railway project created: **dealertrade**
2. ✅ Backend service deployed
3. ✅ Project URL: https://railway.com/project/4ed977a7-234c-453a-8ad9-c373e81e82bb

---

## 🎯 Complete These Steps:

### Step 1: Add PostgreSQL Database (via Dashboard)

1. **Open your Railway project**:
   - Visit: https://railway.com/project/4ed977a7-234c-453a-8ad9-c373e81e82bb
   - Or run: `railway open`

2. **Add PostgreSQL**:
   - Click "+ New" button
   - Select "Database" → "Add PostgreSQL"
   - Railway will automatically provision it
   - DATABASE_URL will be auto-set for your backend service

### Step 2: Set Backend Environment Variables

1. **In Railway Dashboard**, click on your **backend service**

2. **Go to "Variables" tab**

3. **Add these variables**:
   ```
   PORT=3000
   NODE_ENV=production
   AUTO_DEV_API_KEY=sk_ad_i8ttO7rJHcoeeRHVUMHver41
   JWT_SECRET=<generate-a-secure-random-string>
   ```

4. **Generate JWT_SECRET** (run locally):
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Copy the output and paste as JWT_SECRET value

5. **Save variables** - Backend will auto-redeploy

### Step 3: Run Database Migrations

After backend redeploys with DATABASE_URL:

```bash
cd /Users/brandonin/drl/backend
railway service  # Select your backend service
railway run npx prisma migrate deploy
```

### Step 4: Get Backend URL

```bash
railway open
```

Click on your backend service, copy the public URL (looks like: `https://backend-production-xxxx.up.railway.app`)

---

### Step 5: Deploy Frontend

1. **Create frontend service**:
```bash
cd /Users/brandonin/drl/frontend
railway service
# Choose "+ Create New Service"
# Name it "frontend" or "dealertrade-frontend"
```

2. **Deploy frontend**:
```bash
railway up
```

3. **Set frontend environment variables**:

In Railway Dashboard → Frontend Service → Variables:
```
VITE_API_URL=https://your-backend-url.railway.app/api
```

Replace `your-backend-url` with the actual backend URL from Step 4

4. **Redeploy** (automatically happens when you save variables)

---

### Step 6: Update Backend FRONTEND_URL

1. Go to Railway Dashboard → Backend Service → Variables

2. Add:
```
FRONTEND_URL=https://your-frontend-url.railway.app
```

3. Backend will auto-redeploy with updated CORS

---

## 🎉 Verification

### Test Backend
```bash
curl https://your-backend-url.railway.app/health
```

Should return: `{"status":"ok","timestamp":"..."}`

### Test Frontend
Open in browser: `https://your-frontend-url.railway.app/`

### Test License Plate Lookup
1. Go to frontend URL
2. Click "License Plate" tab
3. Enter `7MGU382` and select `California`
4. Should auto-populate vehicle info!

---

## 🔧 Quick Railway Commands

```bash
# Open project in browser
railway open

# View logs (live)
railway logs --follow

# Check variables
railway variables

# Run command in Railway environment
railway run <command>

# Link to specific service
railway service

# Check deployment status
railway status
```

---

## 📊 Your Project Details

- **Project Name**: dealertrade
- **Project ID**: 4ed977a7-234c-453a-8ad9-c373e81e82bb
- **Project URL**: https://railway.com/project/4ed977a7-234c-453a-8ad9-c373e81e82bb
- **Workspace**: brandon687's Projects

---

## 💡 Tips

1. **Watch the build logs**: Click "View Logs" in Railway to see deployment progress

2. **Database takes ~1-2 minutes**: Wait for PostgreSQL to be ready before running migrations

3. **Service URLs**: Each service gets a unique Railway domain (e.g., `xxx.up.railway.app`)

4. **Custom domains**: Can be added later in service settings

5. **Costs**: First month free ($5 credit), then ~$5-10/month

---

## 🚨 Troubleshooting

### Backend build fails?
- Check logs in Railway dashboard
- Ensure all environment variables are set
- DATABASE_URL should be auto-set by PostgreSQL database

### Migrations fail?
- Make sure PostgreSQL database is fully provisioned (green checkmark)
- Verify DATABASE_URL is set in backend service
- Wait 2-3 minutes after adding database

### Frontend can't connect?
- Double-check VITE_API_URL in frontend variables
- Make sure backend URL is correct and includes `/api` suffix
- Check backend FRONTEND_URL for CORS

---

## 📖 Alternative: Railway Dashboard Only

You can do everything via the Railway dashboard:

1. Visit https://railway.com/project/4ed977a7-234c-453a-8ad9-c373e81e82bb
2. Click "+ New" → "Database" → "Add PostgreSQL"
3. Click backend service → Variables → Add all env vars
4. Click "+ New" → "Empty Service" → Deploy frontend
5. Configure frontend variables
6. Done!

---

**Your DealerTrade project is live at Railway! 🚀**

Just complete the steps above to finish deployment.
