# DealerTrade Testing Guide

## Quick Start

### 1. Verify Servers are Running

```bash
# Check backend
curl http://localhost:3000/health

# Check frontend
curl -I http://localhost:5173
```

Expected: Both should return 200 OK

### 2. Test the Complete Flow

```bash
cd /Users/brandonin/drl
./test-complete-flow.sh
```

This script tests:
- Backend health
- VIN decoding
- Submission creation
- Data retrieval
- Frontend accessibility

---

## Test Data

Use this data for consistent testing:

```
VIN: WBSMW9C50PCA63726
Vehicle: 2026 BMW M4 - M4 xDrive Competition
Mileage: 4000
Name: brandon in
Email: inbrandon98@gmail.com
Phone: 6613424394
```

---

## Browser Testing Steps

### Step 1: Open Application
1. Navigate to http://localhost:5173
2. Open DevTools Console (F12)

### Step 2: VIN Entry
1. Enter VIN: `WBSMW9C50PCA63726`
2. Click "Continue"
3. Check console for:
   ```
   [API Request] { method: 'get', url: '/vin/decode/...' }
   [API Response Success] { status: 200, data: {...} }
   ```

### Step 3: Form Submission
1. Enter Mileage: `4000`
2. Enter Name: `brandon in`
3. Enter Email: `inbrandon98@gmail.com`
4. Enter Phone: `6613424394`
5. Click "Continue"
6. Check console for:
   ```
   [createSubmission] Called with: {...}
   [API Request] { method: 'post', url: '/submissions' }
   [API Response Success] { status: 201, data: {...} }
   [createSubmission] Success: { ticketNumber: '...', submissionId: '...' }
   [SubmissionForm] Mutation success, data: {...}
   ```

### Step 4: Verify Success
1. Should advance to Photo Upload step (Step 3)
2. Ticket number should be stored in state
3. No error messages should appear

---

## Console Output Reference

### Successful Submission
```javascript
[createSubmission] Called with: {
  vin: "WBSMW9C50PCA63726",
  mileage: 4000,
  name: "brandon in",
  email: "inbrandon98@gmail.com",
  phone: "6613424394"
}

[API Request] {
  method: "post",
  url: "/submissions",
  baseURL: "http://localhost:3000/api",
  data: {...}
}

[API Response Success] {
  status: 201,
  data: {
    success: true,
    ticketNumber: "DT-2025-00015",
    submissionId: "13f4040a-dc30-4400-8ebc-a7ca8c00602f",
    vehicle: { vin: "...", year: 2023, make: "BMW" }
  }
}

[createSubmission] Success: { success: true, ticketNumber: "...", submissionId: "..." }

[SubmissionForm] Mutation success, data: { success: true, ticketNumber: "...", submissionId: "..." }
```

### Error Scenario
```javascript
[API Error] {
  message: "Network Error",
  code: "ERR_NETWORK",
  url: "/submissions",
  method: "post",
  status: undefined,
  data: undefined
}

[createSubmission] Failed: Network Error

[SubmissionForm] Mutation error: {
  message: "Network Error",
  response: undefined,
  status: undefined
}
```

---

## API Testing with curl

### Test VIN Decoder
```bash
curl -s http://localhost:3000/api/vin/decode/WBSMW9C50PCA63726 | jq .
```

Expected output:
```json
{
  "success": true,
  "data": {
    "vin": "WBSMW9C50PCA63726",
    "year": 2023,
    "make": "BMW",
    "vehicleType": "PASSENGER CAR",
    ...
  }
}
```

### Test Submission
```bash
curl -X POST http://localhost:3000/api/submissions \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{
    "vin": "WBSMW9C50PCA63726",
    "mileage": 4000,
    "name": "brandon in",
    "email": "inbrandon98@gmail.com",
    "phone": "6613424394"
  }' | jq .
```

Expected output:
```json
{
  "success": true,
  "ticketNumber": "DT-2025-00015",
  "submissionId": "13f4040a-dc30-4400-8ebc-a7ca8c00602f",
  "vehicle": {
    "vin": "WBSMW9C50PCA63726",
    "year": 2023,
    "make": "BMW"
  }
}
```

### Test Retrieval
```bash
# Use the ticket number from submission
curl -s http://localhost:3000/api/submissions/DT-2025-00015 | jq .
```

---

## Troubleshooting

### Backend Not Running
```bash
cd /Users/brandonin/drl/backend
npm run dev
```

### Frontend Not Running
```bash
cd /Users/brandonin/drl/frontend
npm run dev
```

### Check Backend Logs
```bash
tail -f /Users/brandonin/drl/backend/backend.log
```

### Clear Browser Cache
1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

### Check Database
```bash
cd /Users/brandonin/drl/backend
npx prisma studio
```

This opens a GUI at http://localhost:5555 to inspect the database.

---

## Common Issues and Solutions

### Issue: "Failed to submit"
**Check:**
1. Backend is running (curl http://localhost:3000/health)
2. Console shows detailed error message
3. Network tab shows request status

### Issue: VIN decode fails
**Check:**
1. VIN is exactly 17 characters
2. Backend NHTSA API is accessible
3. Console shows decode error details

### Issue: CORS errors
**Check:**
1. Frontend URL is http://localhost:5173
2. Backend .env has correct FRONTEND_URL
3. No browser extensions blocking requests

### Issue: Type errors
**Check:**
1. Run: `cd /Users/brandonin/drl/frontend && npx tsc --noEmit`
2. Fix any TypeScript errors shown
3. Rebuild: `npm run build`

---

## Performance Testing

### Load Test Submissions
```bash
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/submissions \
    -H "Content-Type: application/json" \
    -d '{"vin":"WBSMW9C50PCA63726","mileage":4000,"email":"test'$i'@test.com","name":"Test User '$i'"}' &
done
wait
echo "All submissions completed"
```

### Check Rate Limiting
```bash
# Should show rate limit headers
curl -i http://localhost:3000/health | grep -i ratelimit
```

Expected headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1762329896
```

---

## Files to Monitor

### Backend Logs
```bash
tail -f /Users/brandonin/drl/backend/backend.log
```

### Database File
```
/Users/brandonin/drl/backend/prisma/dev.db
```

### Uploads Directory
```bash
ls -lh /Users/brandonin/drl/backend/uploads/
```

---

## Success Criteria

A successful submission should:
1. ✓ Decode VIN correctly
2. ✓ Create submitter record (if email/phone provided)
3. ✓ Create submission record with ticket number
4. ✓ Send confirmation email (console mode)
5. ✓ Send admin notification (console mode)
6. ✓ Return 201 status with complete response
7. ✓ Advance form to photo upload step
8. ✓ Display no error messages
9. ✓ Show all success logs in console

---

## Need Help?

1. Check the DEBUG_REPORT.md for detailed analysis
2. Review console logs for detailed error information
3. Check backend logs for server-side issues
4. Verify all environment variables are set correctly
5. Ensure all dependencies are installed (npm install)

---

**Last Updated:** 2025-11-04
**Version:** 1.0
