# DealerTrade Media Upload - Quick Test Guide

## Quick Start

To run the automated test at any time:

```bash
cd /Users/brandonin/drl
./test-media-upload.sh
```

## What Gets Tested

The automated test script validates the complete media upload workflow:

1. Creates a new vehicle submission (2023 BMW, VIN: WBSMW9C50PCA63726)
2. Uploads 7 photos + 1 video file
3. Verifies files are saved to `backend/uploads/`
4. Verifies database records are created
5. Tests HTTP access to uploaded files
6. Retrieves submission with all media

## Expected Output

```
==================================
DealerTrade E2E Media Upload Test
==================================

[INFO] Running pre-flight checks...
[SUCCESS] Backend is running
[SUCCESS] All test files found (7 images + 1 video)

[INFO] Step 1: Creating new submission...
[SUCCESS] Submission created successfully
  Submission ID: <uuid>
  Ticket Number: DT-2025-XXXXX

[INFO] Step 2: Uploading media files (7 photos + 1 video)...
[SUCCESS] Media upload successful
  Files uploaded: 8

[INFO] Step 3: Verifying files in uploads directory...
[SUCCESS] All 8 files found in uploads directory

[INFO] Step 4: Verifying database records...
[SUCCESS] All 8 media records found in database

[INFO] Step 5: Testing HTTP access to uploaded files...
[SUCCESS] Files are accessible via HTTP

[INFO] Step 6: Testing submission retrieval by ticket number...
[SUCCESS] Submission retrieved successfully with media

==================================
Test Summary
==================================

[INFO] Tests Passed: 6
[INFO] Tests Failed: 0
[SUCCESS] All tests passed! Media upload system is working correctly.
```

## Manual Testing

### Create Test Images (if needed)

```bash
cd /Users/brandonin/drl/test-data
python3 create-test-images.py
python3 create-test-video.py
```

### Test API Endpoints Manually

1. **Create Submission:**
```bash
curl -X POST http://localhost:3000/api/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "vin": "WBSMW9C50PCA63726",
    "mileage": 4000,
    "name": "Test User",
    "email": "test@example.com",
    "phone": "5551234567"
  }'
```

2. **Upload Media (replace SUBMISSION_ID):**
```bash
curl -X POST http://localhost:3000/api/submissions/SUBMISSION_ID/media \
  -F "front=@/Users/brandonin/drl/test-data/front.jpg" \
  -F "rear=@/Users/brandonin/drl/test-data/rear.jpg" \
  -F "driver_side=@/Users/brandonin/drl/test-data/driver_side.jpg" \
  -F "passenger_side=@/Users/brandonin/drl/test-data/passenger_side.jpg" \
  -F "steering_wheel=@/Users/brandonin/drl/test-data/steering_wheel.jpg" \
  -F "front_seat=@/Users/brandonin/drl/test-data/front_seat.jpg" \
  -F "back_seat=@/Users/brandonin/drl/test-data/back_seat.jpg" \
  -F "video=@/Users/brandonin/drl/test-data/test-video.mp4"
```

3. **Retrieve Submission (replace TICKET_NUMBER):**
```bash
curl http://localhost:3000/api/submissions/TICKET_NUMBER | python3 -m json.tool
```

## Verify Results

### Check Uploaded Files
```bash
ls -lh /Users/brandonin/drl/backend/uploads/
```

### Query Database
```bash
# Count all media records
sqlite3 /Users/brandonin/drl/backend/prisma/dev.db \
  "SELECT COUNT(*) FROM media;"

# View recent submissions with media counts
sqlite3 -header -column /Users/brandonin/drl/backend/prisma/dev.db \
  "SELECT s.ticket_number, s.vin, s.year, s.make, COUNT(m.id) as media_count
   FROM submissions s
   LEFT JOIN media m ON s.id = m.submission_id
   GROUP BY s.id
   ORDER BY s.created_at DESC
   LIMIT 5;"
```

### Test HTTP Access
```bash
# Access a file directly (replace with actual filename)
curl -I http://localhost:3000/uploads/front-1234567890-123456789.jpg
```

## Test Data Files

Location: `/Users/brandonin/drl/test-data/`

- `front.jpg` (2.2 KB) - Front view
- `rear.jpg` (2.3 KB) - Rear view
- `driver_side.jpg` (2.3 KB) - Driver side
- `passenger_side.jpg` (2.5 KB) - Passenger side
- `steering_wheel.jpg` (2.8 KB) - Steering wheel
- `front_seat.jpg` (2.2 KB) - Front seat
- `back_seat.jpg` (2.0 KB) - Back seat
- `test-video.mp4` (50 KB) - Test video

## API Endpoints

### Submissions
- `POST /api/submissions` - Create new submission
- `GET /api/submissions/:ticketNumber` - Get submission by ticket

### Media Upload
- `POST /api/submissions/:submissionId/media` - Upload media files

### Static Files
- `GET /uploads/:filename` - Access uploaded file

## File Upload Limits

- Images: 10 MB per file (actual limit is 500MB to allow videos)
- Video: 500 MB per file
- Total: 8 files (7 photos + 1 video)

## Supported File Types

**Images:**
- JPEG/JPG
- PNG
- HEIC
- WebP

**Video:**
- MP4
- MOV
- AVI

## Troubleshooting

### Backend Not Running
```bash
cd /Users/brandonin/drl/backend
npm run dev
```

### Test Files Missing
```bash
cd /Users/brandonin/drl/test-data
python3 create-test-images.py
python3 create-test-video.py
```

### Database Issues
```bash
cd /Users/brandonin/drl/backend
npx prisma migrate reset
npx prisma migrate dev
```

### Clear Uploads Directory
```bash
rm -rf /Users/brandonin/drl/backend/uploads/*
```

## Key Files

- **Test Script:** `/Users/brandonin/drl/test-media-upload.sh`
- **Test Report:** `/Users/brandonin/drl/TEST-REPORT.md`
- **Test Data:** `/Users/brandonin/drl/test-data/`
- **Uploads:** `/Users/brandonin/drl/backend/uploads/`
- **Database:** `/Users/brandonin/drl/backend/prisma/dev.db`

## Next Steps

1. Run automated test regularly during development
2. Test with real vehicle photos
3. Test with larger video files (up to 500MB)
4. Test error cases (invalid files, oversized files, etc.)
5. Test concurrent uploads
6. Performance testing with multiple submissions
