# DealerTrade - Localhost Testing Guide

## 🚀 Quick Start (2 Minutes)

### Option 1: Automatic Start (Recommended)
```bash
cd /Users/brandonin/drl
./start-local.sh
```

This script will:
- Install dependencies if needed
- Set up the SQLite database
- Start both frontend and backend servers
- Show you the URLs to access

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd /Users/brandonin/drl/backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd /Users/brandonin/drl/frontend
npm run dev
```

## 📱 Access URLs

### Desktop/Laptop Testing
- **Frontend (User Portal):** http://localhost:5173
- **Admin Dashboard:** http://localhost:5173/admin
- **Backend API:** http://localhost:3000
- **API Health Check:** http://localhost:3000/health

### Mobile Device Testing

#### Find Your Local IP:
```bash
# Mac/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# Output example: inet 192.168.1.100
```

#### Update Frontend Config:
1. Edit `frontend/.env`:
   ```env
   VITE_API_URL=http://192.168.1.100:3000/api
   ```

2. Restart frontend server

3. Access from mobile:
   - **Submission Form:** http://192.168.1.100:5173
   - **Admin Dashboard:** http://192.168.1.100:5173/admin

**Note:** Your phone must be on the same WiFi network!

## 🧪 Testing Flow

### 1. Test VIN Decoder (Backend)

```bash
# Test VIN decode endpoint
curl http://localhost:3000/api/vin/decode/1HGBH41JXMN109186

# Should return Honda Accord info
```

### 2. Submit a Vehicle (Frontend)

**Test VINs to use:**
- `1HGBH41JXMN109186` - 2020 Honda Accord
- `1FTFW1ET5BFC10966` - 2011 Ford F-150
- `WBADT43452G922100` - 2002 BMW 325i
- `2HGFG12648H542422` - 2008 Honda Civic

**Steps:**
1. Go to http://localhost:5173
2. Enter VIN (use one above)
3. Click "Continue"
4. See vehicle info auto-populated
5. Enter mileage: `50000`
6. Enter contact info (optional):
   - Name: `Test User`
   - Email: `test@example.com`
   - Phone: `555-1234`
7. Click "Continue"
8. Upload photos:
   - Use any 7 images from your computer
   - Or take photos if testing on mobile
9. (Optional) Upload a video
10. Click "Submit"
11. See your ticket number (e.g., `DT-2025-00001`)

### 3. View in Admin Dashboard

1. Go to http://localhost:5173/admin
2. See your submission in the table
3. Click "View" to see details
4. Check all photos uploaded correctly

### 4. Check Backend Logs

In the backend terminal, you should see:
```
📧 EMAIL (console mode - SMTP not configured):
To: test@example.com
Subject: Vehicle Appraisal Received - DT-2025-00001
Vehicle: 2020 Honda Accord
Ticket: DT-2025-00001
✅ Email logged to console
```

## 📂 Database Location

Your data is stored in:
```
backend/prisma/dev.db
```

### View Database with Prisma Studio

```bash
cd backend
npx prisma studio
```

This opens a GUI at http://localhost:5555 where you can:
- View all submissions
- Edit records
- Delete test data
- See media records

## 🔧 Configuration Files

### Backend (.env)
```env
PORT=3000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
MAX_FILE_SIZE=10485760
MAX_VIDEO_SIZE=524288000
UPLOAD_DIR=./uploads
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=noreply@dealertrade.com
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
```

## 📸 Mobile Camera Testing

The app is optimized for mobile photo capture:

1. **On iPhone/Android:**
   - Tap any photo box
   - Choose "Take Photo" (camera will open)
   - Take picture
   - Accept/Done
   - Photo appears in the box

2. **Camera Features:**
   - Uses rear camera by default (better quality)
   - Direct capture integration
   - No need to save to gallery first
   - Instant upload

## 🐛 Troubleshooting

### Backend won't start

**Error: "Cannot find module"**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

**Error: "Database not found"**
```bash
cd backend
export DATABASE_URL="file:./dev.db"
npx prisma migrate dev --name init
```

### Frontend won't start

**Error: "Failed to fetch"**
```bash
# Check backend is running
curl http://localhost:3000/health

# Should return: {"status":"ok",...}
```

**Error: "Module not found"**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### CORS errors

Update `backend/.env`:
```env
FRONTEND_URL=http://localhost:5173
```

Restart backend server.

### Photos won't upload

**Check uploads directory exists:**
```bash
mkdir -p backend/uploads
chmod 755 backend/uploads
```

### Can't access from mobile

1. **Check firewall:**
   - Allow ports 3000 and 5173
   - On Mac: System Settings > Network > Firewall

2. **Check same WiFi:**
   - Phone and computer must be on same network
   - Some public WiFi blocks device-to-device communication

3. **Try with IP:**
   ```bash
   # Get your IP
   ifconfig | grep "inet " | grep -v 127.0.0.1

   # Update frontend/.env
   VITE_API_URL=http://YOUR_IP:3000/api
   ```

## 🗑️ Reset Everything

**Clear database:**
```bash
cd backend
rm prisma/dev.db
npx prisma migrate dev --name init
```

**Clear uploads:**
```bash
cd backend
rm -rf uploads/*
mkdir uploads
```

**Fresh install:**
```bash
# Backend
cd backend
rm -rf node_modules dist prisma/dev.db uploads
npm install
npx prisma generate
npx prisma migrate dev

# Frontend
cd ../frontend
rm -rf node_modules dist
npm install
```

## 📊 Test API Endpoints Manually

### Decode VIN
```bash
curl http://localhost:3000/api/vin/decode/1HGBH41JXMN109186 | jq
```

### Create Submission
```bash
curl -X POST http://localhost:3000/api/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "vin": "1HGBH41JXMN109186",
    "mileage": 50000,
    "email": "test@example.com",
    "name": "Test User"
  }' | jq
```

### Get All Submissions
```bash
curl http://localhost:3000/api/admin/submissions | jq
```

## 🎯 What to Test

### ✅ User Flow
- [ ] VIN decode works
- [ ] Vehicle info displays correctly
- [ ] Form validation works
- [ ] Can upload all 7 photos
- [ ] Can upload video (optional)
- [ ] Submission succeeds
- [ ] Ticket number shown
- [ ] Email logged to console

### ✅ Mobile Features
- [ ] Camera opens when tapping photo box
- [ ] Can take photos directly
- [ ] Touch targets are easy to tap
- [ ] Form scrolls smoothly
- [ ] No accidental form submission
- [ ] Progress bar visible
- [ ] Success screen readable

### ✅ Admin Dashboard
- [ ] Can view all submissions
- [ ] Stats show correctly
- [ ] Can click to view details
- [ ] Media count is correct
- [ ] Can switch back to submit form

### ✅ Edge Cases
- [ ] Invalid VIN shows error
- [ ] Missing required fields shows validation
- [ ] Large files upload successfully
- [ ] Multiple submissions work
- [ ] Page refresh doesn't lose progress (until submit)

## 📝 Sample Test Data

**Valid VINs:**
| VIN | Year | Make | Model |
|-----|------|------|-------|
| 1HGBH41JXMN109186 | 2020 | Honda | Accord |
| 1FTFW1ET5BFC10966 | 2011 | Ford | F-150 |
| WBADT43452G922100 | 2002 | BMW | 325i |
| 2HGFG12648H542422 | 2008 | Honda | Civic |
| 5FNRL5H40BB000001 | 2011 | Honda | Odyssey |

**Invalid VINs (for error testing):**
- `ABC123` - Too short
- `1HGBH41JXMN10918I` - Contains letter I
- `00000000000000000` - Invalid checksum

## 🚀 Performance Tips

**Backend faster startup:**
```bash
# Use tsx instead of ts-node
cd backend
npm run dev  # Already configured with tsx
```

**Frontend faster builds:**
```bash
# Vite is already optimized, but you can:
cd frontend
npm run dev -- --host  # Allow network access
```

## 📱 Mobile Testing Checklist

- [ ] Form fits screen without horizontal scroll
- [ ] Text is readable (minimum 16px)
- [ ] Buttons are easy to tap (minimum 44px)
- [ ] Camera capture works
- [ ] Photo preview looks good
- [ ] Can delete and retake photos
- [ ] Progress saves between steps
- [ ] Success screen is mobile-optimized
- [ ] Share buttons work on mobile

## 🎉 Success!

If you can complete a full submission flow and see it in the admin dashboard, you're ready to go!

**Next steps:**
1. Test on your mobile device
2. Share the link with a friend
3. Monitor submissions in admin panel
4. Set up real email (optional)
5. Deploy to production (see README.md)

---

**Need help?** Check the main README.md or troubleshooting sections above.
