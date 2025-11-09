# QUICK DEPLOYMENT GUIDE - Frontend to Alternative Platform

## FASTEST OPTION: GitHub Pages (Zero Authentication Required)

### Step 1: Enable GitHub Pages
1. Go to: **https://github.com/brandon687/automatedrive/settings/pages**
2. Under "Build and deployment":
   - **Source:** Select "GitHub Actions"
3. Click **"Save"**

### Step 2: Trigger Deployment
The workflow will automatically run. Check progress at:
**https://github.com/brandon687/automatedrive/actions**

### Step 3: Access Your Site
Once deployment completes (2-3 minutes), your site will be live at:
**https://brandon687.github.io/automatedrive/**

### Step 4: Update Backend CORS
```bash
cd /Users/brandonin/drl/backend
railway variables --set FRONTEND_URL=https://brandon687.github.io/automatedrive
railway up
```

---

## ALTERNATIVE: Vercel Web Interface (Fastest for Manual Deploy)

### Step 1: Import Project
1. Go to: **https://vercel.com/new**
2. Connect your GitHub account if needed
3. Select repository: **brandon687/automatedrive**
4. Click **"Import"**

### Step 2: Configure Build Settings
- **Framework Preset:** Vite
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### Step 3: Add Environment Variable
- **Name:** `VITE_API_URL`
- **Value:** `https://automatedrive-production.up.railway.app/api`

### Step 4: Deploy
Click **"Deploy"** and wait 2-3 minutes

### Step 5: Update Backend CORS
```bash
cd /Users/brandonin/drl/backend
railway variables --set FRONTEND_URL=https://your-app.vercel.app
railway up
```

---

## ALTERNATIVE: Netlify Drag & Drop (No Git Required)

### Step 1: Build Locally
```bash
cd /Users/brandonin/drl/frontend
npm run build
```

### Step 2: Deploy
1. Go to: **https://app.netlify.com/drop**
2. Drag and drop the **`dist`** folder

### Step 3: Configure Environment
1. Go to: **Site settings > Environment variables**
2. Add: `VITE_API_URL` = `https://automatedrive-production.up.railway.app/api`
3. Click **"Trigger deploy"** to rebuild with env var

### Step 4: Update Backend CORS
```bash
cd /Users/brandonin/drl/backend
railway variables --set FRONTEND_URL=https://your-site.netlify.app
railway up
```

---

## What's Been Done

1. ✅ Created GitHub Actions workflow for automatic deployment
2. ✅ Created Vercel configuration (`frontend/vercel.json`)
3. ✅ Created Netlify configuration (`frontend/netlify.toml`)
4. ✅ Built frontend successfully (408KB JS + 46KB CSS)
5. ✅ Pushed all configurations to GitHub
6. ✅ Backend API is working at: https://automatedrive-production.up.railway.app/api

---

## What You Need to Do

**CHOOSE ONE OPTION ABOVE** and follow the steps. GitHub Pages is recommended as it requires zero authentication and deploys automatically from your repository.

---

## Verification

After deployment, test:
1. Visit the deployed URL
2. Check that the site loads
3. Test VIN decoding or form submission
4. Verify API calls in browser console

---

## Support

- **Full Documentation:** `/Users/brandonin/drl/DEPLOYMENT_INSTRUCTIONS.md`
- **GitHub Actions Logs:** https://github.com/brandon687/automatedrive/actions
- **Railway Backend:** https://railway.app/dashboard
