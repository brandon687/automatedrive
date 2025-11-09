# Frontend Deployment Instructions

## Deployment Status

The frontend has been configured for deployment on multiple platforms. All configuration files have been created and pushed to the repository.

---

## Option 1: GitHub Pages (RECOMMENDED - NO AUTH REQUIRED)

### Setup Steps:

1. **Enable GitHub Pages in your repository:**
   - Go to: https://github.com/brandon687/automatedrive/settings/pages
   - Under "Build and deployment":
     - Source: Select "GitHub Actions"
   - Click "Save"

2. **Trigger deployment:**
   - The GitHub Actions workflow has been created at `.github/workflows/deploy-frontend.yml`
   - It will automatically run on push to main branch
   - You can also manually trigger it from: https://github.com/brandon687/automatedrive/actions/workflows/deploy-frontend.yml

3. **Your site will be available at:**
   ```
   https://brandon687.github.io/automatedrive/
   ```

4. **Update backend CORS:**
   ```bash
   cd /Users/brandonin/drl/backend
   railway variables --set FRONTEND_URL=https://brandon687.github.io/automatedrive
   ```

### Configuration:
- Build command: `npm run build`
- Output directory: `frontend/dist`
- Environment: `VITE_API_URL=https://automatedrive-production.up.railway.app/api`

---

## Option 2: Vercel (REQUIRES AUTH)

### Setup Steps:

1. **Login to Vercel:**
   ```bash
   cd /Users/brandonin/drl/frontend
   vercel login
   ```
   - Visit the URL provided and authenticate
   - Press ENTER after authentication

2. **Deploy:**
   ```bash
   vercel --prod
   ```
   - Follow the prompts to create a new project
   - The configuration is already set in `vercel.json`

3. **Set environment variable:**
   ```bash
   vercel env add VITE_API_URL production
   # When prompted, enter: https://automatedrive-production.up.railway.app/api
   ```

4. **Update backend CORS:**
   ```bash
   cd /Users/brandonin/drl/backend
   railway variables --set FRONTEND_URL=https://your-app.vercel.app
   ```

### Configuration File:
Location: `/Users/brandonin/drl/frontend/vercel.json`

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm ci",
  "devCommand": "npm run dev",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "env": {
    "VITE_API_URL": "https://automatedrive-production.up.railway.app/api"
  }
}
```

---

## Option 3: Netlify (REQUIRES AUTH)

### Setup Steps:

1. **Login to Netlify:**
   ```bash
   cd /Users/brandonin/drl/frontend
   netlify login
   ```

2. **Deploy:**
   ```bash
   netlify deploy --prod --dir=dist
   ```
   - Choose "Create & configure a new site"
   - The configuration is already set in `netlify.toml`

3. **Update backend CORS:**
   ```bash
   cd /Users/brandonin/drl/backend
   railway variables --set FRONTEND_URL=https://your-app.netlify.app
   ```

### Configuration File:
Location: `/Users/brandonin/drl/frontend/netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "22.12.0"
  VITE_API_URL = "https://automatedrive-production.up.railway.app/api"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[context.production.environment]
  VITE_API_URL = "https://automatedrive-production.up.railway.app/api"
```

**Note:** Netlify CLI has compatibility issues with Node 24. You may need to use their web interface instead:
1. Go to https://app.netlify.com
2. Drag and drop the `/Users/brandonin/drl/frontend/dist` folder
3. Set environment variable `VITE_API_URL=https://automatedrive-production.up.railway.app/api` in site settings

---

## Option 4: Vercel Web Interface (NO CLI REQUIRED)

1. **Go to:** https://vercel.com/new
2. **Import your GitHub repository:** `brandon687/automatedrive`
3. **Configure:**
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables:
     - Name: `VITE_API_URL`
     - Value: `https://automatedrive-production.up.railway.app/api`
4. **Click "Deploy"**

---

## Option 5: Netlify Web Interface (NO CLI REQUIRED)

### Method A - Drag and Drop:
1. **Build locally first:**
   ```bash
   cd /Users/brandonin/drl/frontend
   npm run build
   ```
2. **Go to:** https://app.netlify.com/drop
3. **Drag and drop** the `dist` folder
4. **After deployment:**
   - Go to Site settings > Environment variables
   - Add: `VITE_API_URL=https://automatedrive-production.up.railway.app/api`
   - Trigger a new deploy

### Method B - Git Integration:
1. **Go to:** https://app.netlify.com/start
2. **Connect your GitHub repository:** `brandon687/automatedrive`
3. **Configure:**
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
   - Environment variables:
     - `VITE_API_URL=https://automatedrive-production.up.railway.app/api`
4. **Click "Deploy site"**

---

## Verification Checklist

After deployment, verify:

1. **Site is accessible:**
   - Visit the deployment URL
   - Check for HTTP 200 status

2. **Application loads:**
   - Homepage renders correctly
   - No console errors

3. **API connectivity:**
   - Open browser console
   - Check that API calls go to `https://automatedrive-production.up.railway.app/api`
   - Test VIN decoding or form submission

4. **Backend CORS:**
   - Ensure backend accepts requests from your new frontend URL
   - Update `FRONTEND_URL` environment variable on Railway if needed

---

## Files Created

1. **`.github/workflows/deploy-frontend.yml`** - GitHub Pages deployment workflow
2. **`frontend/vercel.json`** - Vercel configuration
3. **`frontend/netlify.toml`** - Netlify configuration
4. **`frontend/dist/CNAME`** - Domain configuration for static hosts

---

## Current Status

- Backend API: https://automatedrive-production.up.railway.app/api (WORKING)
- Frontend build: SUCCESSFUL (408.23 kB JavaScript, 46.08 kB CSS)
- Configuration files: COMMITTED AND PUSHED
- GitHub Actions workflow: READY TO RUN

---

## Next Steps

1. **IMMEDIATE:** Enable GitHub Pages in repository settings (Option 1)
2. **OR:** Use Vercel/Netlify web interface (Options 4 or 5)
3. **THEN:** Update backend CORS with new frontend URL
4. **VERIFY:** Test the deployed application

---

## Troubleshooting

### GitHub Pages 404 errors:
- Ensure GitHub Pages is enabled with "GitHub Actions" as the source
- Check Actions tab for deployment status

### API CORS errors:
- Update `FRONTEND_URL` environment variable on Railway
- Restart backend service

### Build failures:
- Check Node version (should be 22.x)
- Verify all dependencies are installed
- Check build logs in deployment platform

---

## Contact

If you encounter issues:
1. Check the GitHub Actions logs
2. Verify environment variables are set correctly
3. Test API connectivity from the deployed site
