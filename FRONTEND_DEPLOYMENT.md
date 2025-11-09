# Frontend Deployment Guide - DealerTrade

## 🌐 Current Backend API
**URL**: https://automatedrive-production.up.railway.app

---

## 🚀 Deploy Frontend to Railway

### Prerequisites
- ✅ Backend is deployed and running
- ✅ GitHub repository: https://github.com/brandon687/automatedrive
- ✅ Frontend code in `/frontend` directory

---

## Method 1: Railway Dashboard (Recommended)

### Step 1: Create New Service
1. Go to: https://railway.com/project/3b065918-e2c0-4551-a7b4-2c73720afdde
2. Click the **"+ New"** button in the top right
3. Select **"GitHub Repo"**
4. Choose repository: **brandon687/automatedrive**
5. Click **"Add Service"**

### Step 2: Configure Service Settings
1. Click on the newly created service
2. Go to **"Settings"** tab
3. Set the following:

   **Service Name**: `frontend`

   **Root Directory**: `/frontend`

   **Build Command**:
   ```bash
   npm install && npm run build
   ```

   **Start Command**:
   ```bash
   npm run preview -- --host 0.0.0.0 --port $PORT
   ```

### Step 3: Set Environment Variables
1. Go to **"Variables"** tab
2. Click **"+ New Variable"**
3. Add:
   ```
   VITE_API_URL=https://automatedrive-production.up.railway.app/api
   ```
4. Click **"Add"**

### Step 4: Generate Public Domain
1. Go to **"Settings"** tab
2. Scroll to **"Public Networking"**
3. Click **"Generate Domain"**
4. Copy the generated URL (e.g., `frontend-production-xxxx.up.railway.app`)
5. **Save this URL** - this is your live frontend!

### Step 5: Deploy
- Railway will automatically start deploying
- Monitor progress in the **"Deployments"** tab
- Wait 2-3 minutes for build to complete

### Step 6: Verify Deployment
Visit your frontend URL and check:
- ✅ Page loads successfully
- ✅ Can connect to backend API
- ✅ Forms are functional

---

## Method 2: Railway CLI

### Prerequisites
```bash
# Ensure you're in the frontend directory
cd /Users/brandonin/drl/frontend

# Verify Railway CLI is installed
railway --version
```

### Deploy Steps
```bash
# 1. Deploy frontend
railway up --detach

# 2. Set environment variable
railway variables --set VITE_API_URL=https://automatedrive-production.up.railway.app/api

# 3. Generate domain
railway domain

# 4. Check deployment status
railway logs
```

---

## 📋 Frontend Configuration

### Current Configuration Files

#### `/frontend/package.json`
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  }
}
```

#### `/frontend/railway.json`
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm run preview -- --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### `/frontend/.env` (Local Development)
```
VITE_API_URL=http://localhost:3000/api
```

#### Environment Variable for Railway (Production)
```
VITE_API_URL=https://automatedrive-production.up.railway.app/api
```

---

## 🔧 Post-Deployment Configuration

### Update Backend CORS

After getting your frontend URL, update the backend to allow CORS from your frontend domain.

#### In Railway Dashboard (Backend Service):
1. Go to: https://railway.com/project/3b065918-e2c0-4551-a7b4-2c73720afdde/service/f988fe11-34e1-44fa-ba5e-ff095a8d49ba
2. Go to **"Variables"** tab
3. Add variable:
   ```
   FRONTEND_URL=https://your-frontend-url.up.railway.app
   ```
4. Railway will auto-redeploy backend

---

## ✅ Verification Checklist

After deployment, verify:

### 1. Frontend Health
```bash
# Replace with your frontend URL
curl https://your-frontend-url.up.railway.app
```
Expected: HTML page with React app

### 2. API Connection
Open browser console on frontend and check:
- No CORS errors
- API calls succeeding
- Network tab shows requests to backend

### 3. Test User Flow
- [ ] Homepage loads
- [ ] Can submit vehicle information
- [ ] VIN lookup works
- [ ] License plate lookup works
- [ ] Images/videos upload successfully
- [ ] Dealer registration works
- [ ] Dealer login works

---

## 🐛 Troubleshooting

### Issue: Build Fails

**Check**: package.json scripts are correct
```bash
railway logs
```

Look for TypeScript errors or missing dependencies.

**Fix**: Ensure all dependencies are in package.json, not just devDependencies.

---

### Issue: Frontend Shows "Cannot Connect to API"

**Check**: VITE_API_URL is correctly set
```bash
railway variables
```

Should show:
```
VITE_API_URL=https://automatedrive-production.up.railway.app/api
```

**Fix**: Update variable and redeploy.

---

### Issue: CORS Error in Browser Console

**Error**: `Access to fetch at 'https://automatedrive-production.up.railway.app/api/...' from origin 'https://your-frontend.up.railway.app' has been blocked by CORS policy`

**Fix**: Add FRONTEND_URL to backend environment variables:
```bash
# In backend service
railway variables --set FRONTEND_URL=https://your-frontend-url.up.railway.app
```

---

### Issue: Preview Command Not Working

**Error**: `npm run preview` fails or returns errors

**Check**: Vite preview server configuration in vite.config.ts

**Fix**: Ensure preview command uses correct host/port:
```json
"preview": "vite preview --host 0.0.0.0 --port $PORT"
```

---

## 📊 Expected Build Output

### Successful Build Log:
```
> npm install
✓ Dependencies installed

> npm run build
✓ TypeScript compiled
✓ Vite build completed
✓ Output: dist/ directory

> npm run preview -- --host 0.0.0.0 --port $PORT
✓ Preview server started on port 3000
```

### Deployment Timeline:
- **Install**: ~30-60 seconds
- **Build**: ~30-60 seconds
- **Start**: ~5-10 seconds
- **Total**: ~1-2 minutes

---

## 🌐 Final URLs Structure

After deployment, you'll have:

### Backend
- API: `https://automatedrive-production.up.railway.app`
- Health: `https://automatedrive-production.up.railway.app/health`

### Frontend
- App: `https://frontend-production-xxxx.up.railway.app`
- (Exact URL generated by Railway)

### Communication Flow
```
User Browser
    ↓
Frontend (Railway)
    ↓ API calls
Backend (Railway)
    ↓ Database queries
PostgreSQL (Railway)
```

---

## 🎯 Environment Variables Summary

### Backend Service (`automatedrive`)
```
DATABASE_URL=<auto-from-postgres>
PORT=<auto-from-railway>
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.up.railway.app
JWT_SECRET=<generate-random>
AUTO_DEV_API_KEY=sk_ad_i8ttO7rJHcoeeRHVUMHver41
```

### Frontend Service (`frontend`)
```
VITE_API_URL=https://automatedrive-production.up.railway.app/api
```

---

## 📱 Custom Domain Setup (Optional)

### Add Custom Domain to Frontend

1. Go to Railway frontend service → Settings
2. Scroll to "Custom Domain"
3. Click "Add Custom Domain"
4. Enter your domain (e.g., `app.dealertrade.com`)
5. Update DNS records as shown by Railway:
   ```
   Type: CNAME
   Name: app
   Value: <railway-provided-domain>
   ```
6. Wait for DNS propagation (5-60 minutes)
7. SSL certificate auto-generated by Railway

### Add Custom Domain to Backend

1. Go to Railway backend service → Settings
2. Add custom domain (e.g., `api.dealertrade.com`)
3. Update DNS records
4. Update frontend VITE_API_URL to new domain

---

## 📚 Additional Resources

### Railway Documentation
- **Deployments**: https://docs.railway.app/guides/deployments
- **Environment Variables**: https://docs.railway.app/guides/variables
- **Custom Domains**: https://docs.railway.app/guides/domains

### Vite Documentation
- **Build**: https://vitejs.dev/guide/build.html
- **Preview**: https://vitejs.dev/guide/cli.html#vite-preview
- **Env Variables**: https://vitejs.dev/guide/env-and-mode.html

---

## 🎉 Success Criteria

Frontend is successfully deployed when:
- ✅ Public URL is accessible
- ✅ React app loads in browser
- ✅ No CORS errors in console
- ✅ API calls reach backend successfully
- ✅ All features functional
- ✅ Health checks passing
- ✅ Response times < 500ms

---

*Document created: November 9, 2025*
*Last updated: November 9, 2025*
