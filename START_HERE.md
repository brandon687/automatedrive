# 🚀 START HERE - DealerTrade Localhost Setup

## ✨ You're Ready to Go!

Everything is set up and ready to run on your local machine. The system uses:
- **SQLite** - Zero-configuration database (file-based, no server needed)
- **Local file storage** - Photos/videos saved to `backend/uploads/`
- **Console email** - Email notifications logged to terminal (no SMTP needed for testing)

## 🎯 Quick Start (30 seconds)

### 1. Open Terminal and Run:

```bash
cd /Users/brandonin/drl
./start-local.sh
```

**That's it!** The script will:
- Check dependencies
- Set up database
- Start backend (port 3000)
- Start frontend (port 5173)
- Show you the URLs

### 2. Access the App:

**On your computer:**
- **Submit a Vehicle:** http://localhost:5173
- **Admin Dashboard:** http://localhost:5173/admin

**On your phone** (must be on same WiFi):
1. Find your computer's IP:
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   # Example output: inet 192.168.1.100
   ```

2. Update `frontend/.env`:
   ```env
   VITE_API_URL=http://192.168.1.100:3000/api
   ```

3. Restart frontend, then visit from phone:
   - http://192.168.1.100:5173

## 📱 Test the Full Flow (5 minutes)

### Step 1: Submit a Vehicle

1. Go to http://localhost:5173
2. Enter VIN: `1HGBH41JXMN109186`
3. Click "Continue" → See vehicle info auto-populate
4. Enter mileage: `50000`
5. Enter your name, email, phone (optional)
6. Click "Continue"
7. Upload 7 photos:
   - **On desktop:** Click each box, select image
   - **On mobile:** Tap box → "Take Photo" → Camera opens!
8. (Optional) Upload a video
9. Click "Submit"
10. Get your ticket number: `DT-2025-00001` ✅

### Step 2: View in Admin Dashboard

1. Go to http://localhost:5173/admin
2. See your submission in the table
3. Click "View" to see full details
4. Verify all photos are there

### Step 3: Check Backend Logs

In your backend terminal, you'll see:
```
📧 EMAIL (console mode - SMTP not configured):
To: your-email@example.com
Subject: Vehicle Appraisal Received - DT-2025-00001
Vehicle: 2020 Honda Accord
✅ Email logged to console
```

## 🎨 Features to Test

### Mobile-Optimized
- ✅ Camera capture directly from app
- ✅ Touch-friendly buttons (easy to tap)
- ✅ Progress tracking (1→2→3→4)
- ✅ Smooth scrolling
- ✅ Responsive design

### VIN Decoder (Free NHTSA API)
- ✅ Automatic year/make/model lookup
- ✅ 145+ vehicle attributes
- ✅ Instant validation

### File Uploads
- ✅ 7 required photos
- ✅ Optional video (up to 500MB)
- ✅ Drag & drop on desktop
- ✅ Camera on mobile

### Admin Dashboard
- ✅ View all submissions
- ✅ Filter by status
- ✅ See uploaded media
- ✅ Track submission stats

## 🧪 Test VINs

Use these for testing:
| VIN | Vehicle |
|-----|---------|
| `1HGBH41JXMN109186` | 2020 Honda Accord |
| `1FTFW1ET5BFC10966` | 2011 Ford F-150 |
| `WBADT43452G922100` | 2002 BMW 325i |
| `2HGFG12648H542422` | 2008 Honda Civic |

## 📂 Project Structure

```
drl/
├── backend/
│   ├── prisma/
│   │   └── dev.db              ← Your database (SQLite file)
│   ├── uploads/                ← Uploaded photos/videos
│   ├── src/                    ← Backend code
│   └── .env                    ← Configuration
│
├── frontend/
│   ├── src/
│   │   ├── components/         ← React components
│   │   └── lib/api.ts          ← API client
│   └── .env                    ← Configuration
│
├── start-local.sh              ← Quick start script
├── LOCALHOST_GUIDE.md          ← Detailed testing guide
└── README.md                   ← Full documentation
```

## 🛠 Useful Commands

```bash
# Start everything
./start-local.sh

# Or manually:
cd backend && npm run dev           # Terminal 1
cd frontend && npm run dev          # Terminal 2

# View database
cd backend && npx prisma studio     # Opens GUI at localhost:5555

# Reset database
cd backend
rm prisma/dev.db
npx prisma migrate dev

# Clear uploads
rm -rf backend/uploads/*
mkdir backend/uploads
```

## 🐛 Troubleshooting

### "Cannot find module" errors
```bash
cd backend && npm install
cd frontend && npm install
```

### Backend won't start
```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

### Frontend can't connect to backend
```bash
# Check backend is running
curl http://localhost:3000/health

# Should return: {"status":"ok"}
```

### Photos won't upload
```bash
mkdir -p backend/uploads
chmod 755 backend/uploads
```

## 📚 Documentation

- **LOCALHOST_GUIDE.md** - Complete testing guide
- **README.md** - Full project documentation
- **NEXT_STEPS.md** - Setup instructions
- **PROJECT_PLAN.md** - Architecture details
- **ARCHITECTURE.md** - System design
- **QUICK_REFERENCE.md** - Cheat sheet

## 🎯 What Works Now

✅ **User Submission Flow**
- VIN decode with NHTSA API
- Multi-step form (4 steps)
- File uploads (7 photos + video)
- Ticket generation (DT-2025-00001)
- Email notifications (console mode)

✅ **Mobile Optimization**
- Camera capture
- Touch-friendly UI
- Responsive design
- Progress tracking

✅ **Admin Dashboard**
- View all submissions
- Submission details
- Media gallery
- Status tracking

✅ **Backend API**
- 10 working endpoints
- SQLite database
- File storage
- Security (rate limiting, validation)

## 🚀 Next Steps

1. **Test locally** - Follow the flow above
2. **Test on mobile** - Use your phone's camera
3. **Try admin dashboard** - View submissions
4. **Add real email** (optional):
   - Get Gmail app password
   - Update `backend/.env`:
     ```env
     SMTP_USER=your-email@gmail.com
     SMTP_PASS=your-16-char-app-password
     ```
   - Restart backend

5. **Deploy to production** (optional):
   - See README.md for deployment guide
   - Recommended: Vercel (frontend) + Railway (backend)
   - Cost: Can start with $0-5/month

## 💡 Tips

### For Best Mobile Experience:
1. Use real device (not simulator)
2. Same WiFi network as computer
3. Test camera capture
4. Try portrait and landscape
5. Test touch interactions

### For Testing:
1. Open admin dashboard in separate tab
2. Submit from main page
3. Refresh admin to see new submission
4. Check backend logs for emails

### For Development:
1. Backend auto-restarts on file changes
2. Frontend hot-reloads instantly
3. Database persists between restarts
4. Use Prisma Studio to view/edit data

## ✨ Cool Features

**Automatic VIN Decode:**
- Type VIN → Instant vehicle info
- 145+ attributes from NHTSA
- Free forever

**Smart Photo Upload:**
- Desktop: Drag & drop
- Mobile: Camera or gallery
- Progress indicators
- Error handling

**Ticket System:**
- Format: DT-2025-00001
- Auto-incrementing
- Unique per year
- Easy to reference

**Admin Dashboard:**
- Real-time stats
- Clean interface
- Detail modal
- Status badges

## 🎉 You're All Set!

Your localhost environment is ready. Start with:

```bash
./start-local.sh
```

Then visit: **http://localhost:5173**

**Have fun testing!** 🚀

---

**Questions?** Check LOCALHOST_GUIDE.md or README.md
