# Auto.dev API Setup Guide

## What's New? 🚀

Your DealerTrade platform now includes:

### 1. License Plate to VIN Lookup (Customer-Facing)
- **Location**: Customer submission form at http://localhost:5173/
- **Feature**: Customers can now enter their license plate instead of VIN
- **Benefit**: Easier for customers who don't know their VIN

### 2. API Management Dashboard (Admin)
- **Location**: Admin dashboard → "API Management" tab at http://localhost:5173/admin
- **Feature**: Complete overview of all available Auto.dev APIs
- **APIs Available**:
  - ✓ Global VIN Decode (Currently Active - Free NHTSA API)
  - Plate-to-VIN API (License plate to VIN conversion)
  - Vehicle Pricing/Valuation (Market pricing estimates)
  - Vehicle Photos API (Stock vehicle photos)
  - Vehicle Specifications (Detailed specs)
  - Vehicle Recalls (Safety recalls)
  - Total Cost of Ownership (TCO estimates)
  - OEM Build Data (Factory build info)

## How to Enable Auto.dev APIs

### Free Tier: 1,000 API Calls/Month (Perfect for MVP!)

#### Step 1: Sign Up for Auto.dev
1. Visit https://www.auto.dev/pricing
2. Click "Sign Up Free" or "Get Started"
3. Create your account (no credit card required)

#### Step 2: Get Your API Key
1. Log into your Auto.dev dashboard
2. Navigate to API Keys section
3. Copy your API key

#### Step 3: Add API Key to Backend
1. Open `/Users/brandonin/drl/backend/.env`
2. Find the line:
   ```
   AUTO_DEV_API_KEY=
   ```
3. Paste your API key:
   ```
   AUTO_DEV_API_KEY=your_actual_api_key_here
   ```
4. Save the file

#### Step 4: Restart Backend Server
```bash
cd /Users/brandonin/drl/backend
npm start
```

#### Step 5: Test It! ✓
1. Go to http://localhost:5173/
2. Click "License Plate" tab
3. Enter a license plate and state
4. Click Continue - it will automatically look up the VIN!

## Current Status

### ✅ Already Working (No API Key Needed)
- **VIN Decode**: Using free NHTSA vPIC API
- **Price Estimates**: Fallback estimation algorithm
- **All Core Features**: Submission, uploads, admin dashboard

### 🔐 Requires API Key (Optional Upgrade)
- **License Plate Lookup**: Need Auto.dev API key
- **Enhanced Pricing**: KBB-style market values
- **Vehicle Photos**: Stock imagery
- **Recalls & Specs**: Safety and technical data

## API Endpoints Created

### Backend Routes
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/license-plate/lookup` | POST | Convert license plate to VIN |
| `/api/license-plate/states` | GET | Get list of US states |
| `/api/valuation/:vin` | GET | Get vehicle pricing |
| `/api/valuation/submission/:id` | GET | Get submission pricing |

### Frontend Components
| Component | Location | Purpose |
|-----------|----------|---------|
| `SubmissionForm.tsx` | Customer form | Added license plate input tabs |
| `APIManagement.tsx` | Admin dashboard | API status and setup guide |
| `AdminDashboard.tsx` | Admin panel | Added "API Management" tab |

## Files Modified/Created

### Backend
- ✅ `backend/src/services/licensePlate.service.ts` (NEW)
- ✅ `backend/src/controllers/licensePlate.controller.ts` (NEW)
- ✅ `backend/src/routes/licensePlate.routes.ts` (NEW)
- ✅ `backend/src/index.ts` (MODIFIED - added license plate routes)
- ✅ `backend/.env` (Has AUTO_DEV_API_KEY placeholder)

### Frontend
- ✅ `frontend/src/components/SubmissionForm.tsx` (MODIFIED - added plate input)
- ✅ `frontend/src/components/APIManagement.tsx` (NEW)
- ✅ `frontend/src/components/AdminDashboard.tsx` (MODIFIED - added API tab)
- ✅ `frontend/src/lib/api.ts` (MODIFIED - added license plate API calls)

## Testing the Features

### Test License Plate Lookup (Without API Key)
1. Go to http://localhost:5173/
2. Click "License Plate" tab
3. Enter any plate and state
4. Click Continue
5. **Expected**: Error message saying "License plate not found. Please try entering VIN manually."
6. **This is correct!** The feature works, it just needs an API key to actually find the data

### Test with API Key (After Setup)
1. Complete setup steps above
2. Go to http://localhost:5173/
3. Click "License Plate" tab
4. Enter a REAL license plate (e.g., "ABC1234" in "California")
5. Click Continue
6. **Expected**: Vehicle info auto-populates and you move to step 2!

### Check API Status
1. Go to http://localhost:5173/admin
2. Click "API Management" tab
3. See all 8 available APIs
4. Status shows which are active

## Cost Breakdown

### Free Tier (Current)
- **Cost**: $0/month
- **VIN Decode**: Unlimited (NHTSA free API)
- **License Plate**: 0 lookups (needs API key)
- **Pricing**: Basic estimates only

### With Auto.dev Free Tier
- **Cost**: $0/month
- **API Calls**: 1,000/month total across all APIs
- **Estimate**: ~30-50 submissions per day
- **Perfect for**: MVP and initial testing

### When to Upgrade
- When you hit 1,000 API calls/month
- When you need >50 submissions/day
- Check Auto.dev pricing page for paid tiers

## Benefits of Each API

### Plate-to-VIN API
- **Customer Experience**: Easier than finding VIN
- **Conversion**: More customers complete form
- **Mobile**: Better for phone users

### Vehicle Pricing/Valuation
- **Dealer Value**: Make better offers
- **Transparency**: Show customers fair market value
- **Profit**: Know vehicle worth instantly

### Vehicle Photos API
- **Presentation**: Show stock photos alongside customer photos
- **Marketing**: Better listing presentations
- **Professional**: Enhance dealer communications

### Vehicle Recalls API
- **Safety**: Alert customers to recalls
- **Value**: Factor recalls into pricing
- **Trust**: Show thoroughness

### Specifications API
- **Details**: Complete vehicle specs
- **Accuracy**: Verify customer-provided info
- **Listings**: Create comprehensive dealer listings

### Total Cost of Ownership
- **Financing**: Show ownership costs
- **Comparison**: Compare similar vehicles
- **Value**: Help customers understand total costs

## Need Help?

### Error: "License plate not found"
- **Cause**: API key not configured
- **Fix**: Follow setup steps above

### Error: "Failed to decode VIN"
- **Cause**: Invalid VIN or network issue
- **Fix**: Check VIN is 17 characters, check internet connection

### Backend won't start
- **Fix**: Run `cd /Users/brandonin/drl/backend && npm run build && npm start`

### Frontend shows error
- **Fix**: Run `cd /Users/brandonin/drl/frontend && npm install && npm run dev`

## Quick Links

- 🌐 Customer Form: http://localhost:5173/
- 🔐 Admin Dashboard: http://localhost:5173/admin
- 📊 API Management: http://localhost:5173/admin (click "API Management" tab)
- 📖 Auto.dev Docs: https://api.auto.dev/docs
- 💰 Auto.dev Pricing: https://www.auto.dev/pricing

## What's Next?

1. **Sign up for Auto.dev** (5 minutes)
2. **Add API key** to `.env` file
3. **Test license plate lookup** with real plates
4. **Explore other APIs** in the management dashboard
5. **Monitor usage** on Auto.dev dashboard

---

**Note**: The platform works perfectly without Auto.dev API key. You get full VIN decode, submissions, uploads, and admin features. The Auto.dev integration is an optional enhancement that adds convenience features!
