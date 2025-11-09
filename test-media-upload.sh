#!/bin/bash

################################################################################
# DealerTrade Media Upload End-to-End Test Script
# Tests the complete submission + media upload flow
################################################################################

set -e  # Exit on error

# Configuration
API_BASE="http://localhost:3000"
TEST_DATA_DIR="/Users/brandonin/drl/test-data"
BACKEND_DIR="/Users/brandonin/drl/backend"
UPLOADS_DIR="$BACKEND_DIR/uploads"
DB_PATH="$BACKEND_DIR/prisma/dev.db"

# Test data
VIN="WBSMW9C50PCA63726"
MILEAGE="4000"
NAME="Test User"
EMAIL="test@example.com"
PHONE="5551234567"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

################################################################################
# Pre-flight checks
################################################################################

echo "=================================="
echo "DealerTrade E2E Media Upload Test"
echo "=================================="
echo ""

log_info "Running pre-flight checks..."

# Check if backend is running
if ! curl -s "$API_BASE/health" > /dev/null 2>&1; then
    log_error "Backend is not running on $API_BASE"
    log_error "Please start the backend first: cd backend && npm run dev"
    exit 1
fi
log_success "Backend is running"

# Check if test files exist
if [ ! -d "$TEST_DATA_DIR" ]; then
    log_error "Test data directory not found: $TEST_DATA_DIR"
    exit 1
fi

REQUIRED_FILES=(
    "front.jpg"
    "rear.jpg"
    "driver_side.jpg"
    "passenger_side.jpg"
    "steering_wheel.jpg"
    "front_seat.jpg"
    "back_seat.jpg"
    "test-video.mp4"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$TEST_DATA_DIR/$file" ]; then
        log_error "Required test file not found: $file"
        exit 1
    fi
done
log_success "All test files found (7 images + 1 video)"

# Check if uploads directory exists
if [ ! -d "$UPLOADS_DIR" ]; then
    log_warning "Uploads directory doesn't exist, creating it..."
    mkdir -p "$UPLOADS_DIR"
fi

echo ""

################################################################################
# Step 1: Create a new submission
################################################################################

log_info "Step 1: Creating new submission..."

SUBMISSION_RESPONSE=$(curl -s -X POST "$API_BASE/api/submissions" \
    -H "Content-Type: application/json" \
    -d "{
        \"vin\": \"$VIN\",
        \"mileage\": $MILEAGE,
        \"name\": \"$NAME\",
        \"email\": \"$EMAIL\",
        \"phone\": \"$PHONE\"
    }")

# Check if submission was successful
if echo "$SUBMISSION_RESPONSE" | grep -q "\"success\":true"; then
    SUBMISSION_ID=$(echo "$SUBMISSION_RESPONSE" | grep -o '"submissionId":"[^"]*"' | cut -d'"' -f4)
    TICKET_NUMBER=$(echo "$SUBMISSION_RESPONSE" | grep -o '"ticketNumber":"[^"]*"' | cut -d'"' -f4)

    log_success "Submission created successfully"
    log_info "  Submission ID: $SUBMISSION_ID"
    log_info "  Ticket Number: $TICKET_NUMBER"
    echo ""
    ((TESTS_PASSED++))
else
    log_error "Failed to create submission"
    echo "$SUBMISSION_RESPONSE" | jq . 2>/dev/null || echo "$SUBMISSION_RESPONSE"
    ((TESTS_FAILED++))
    exit 1
fi

################################################################################
# Step 2: Upload all media files
################################################################################

log_info "Step 2: Uploading media files (7 photos + 1 video)..."

# Count files before upload
FILES_BEFORE=$(ls -1 "$UPLOADS_DIR" 2>/dev/null | wc -l | tr -d ' ')

# Upload all files at once using multipart form data
UPLOAD_RESPONSE=$(curl -s -X POST "$API_BASE/api/submissions/$SUBMISSION_ID/media" \
    -F "front=@$TEST_DATA_DIR/front.jpg" \
    -F "rear=@$TEST_DATA_DIR/rear.jpg" \
    -F "driver_side=@$TEST_DATA_DIR/driver_side.jpg" \
    -F "passenger_side=@$TEST_DATA_DIR/passenger_side.jpg" \
    -F "steering_wheel=@$TEST_DATA_DIR/steering_wheel.jpg" \
    -F "front_seat=@$TEST_DATA_DIR/front_seat.jpg" \
    -F "back_seat=@$TEST_DATA_DIR/back_seat.jpg" \
    -F "video=@$TEST_DATA_DIR/test-video.mp4")

# Check if upload was successful
if echo "$UPLOAD_RESPONSE" | grep -q "\"success\":true"; then
    UPLOADED_COUNT=$(echo "$UPLOAD_RESPONSE" | grep -o '"uploaded":[0-9]*' | cut -d':' -f2)
    log_success "Media upload successful"
    log_info "  Files uploaded: $UPLOADED_COUNT"
    echo ""
    ((TESTS_PASSED++))
else
    log_error "Failed to upload media"
    echo "$UPLOAD_RESPONSE" | jq . 2>/dev/null || echo "$UPLOAD_RESPONSE"
    ((TESTS_FAILED++))
    exit 1
fi

################################################################################
# Step 3: Verify files were saved to backend/uploads/
################################################################################

log_info "Step 3: Verifying files in uploads directory..."

sleep 1  # Give filesystem a moment to sync

FILES_AFTER=$(ls -1 "$UPLOADS_DIR" 2>/dev/null | wc -l | tr -d ' ')
NEW_FILES=$((FILES_AFTER - FILES_BEFORE))

if [ $NEW_FILES -eq 8 ]; then
    log_success "All 8 files found in uploads directory"
    log_info "  Files before: $FILES_BEFORE"
    log_info "  Files after: $FILES_AFTER"
    log_info "  New files: $NEW_FILES"
    echo ""
    ((TESTS_PASSED++))
else
    log_error "Expected 8 new files, found $NEW_FILES"
    ((TESTS_FAILED++))
fi

# List the uploaded files
log_info "Uploaded files:"
ls -lh "$UPLOADS_DIR" | tail -n +2 | tail -n 8

echo ""

################################################################################
# Step 4: Verify database has media records
################################################################################

log_info "Step 4: Verifying database records..."

# Query database for media records
if command -v sqlite3 &> /dev/null; then
    MEDIA_COUNT=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM media WHERE submission_id = '$SUBMISSION_ID';")

    if [ "$MEDIA_COUNT" -eq 8 ]; then
        log_success "All 8 media records found in database"
        echo ""

        # Show details of media records
        log_info "Media records details:"
        sqlite3 -header -column "$DB_PATH" "SELECT type, file_size, mime_type FROM media WHERE submission_id = '$SUBMISSION_ID';"

        echo ""
        ((TESTS_PASSED++))
    else
        log_error "Expected 8 media records, found $MEDIA_COUNT"
        ((TESTS_FAILED++))
    fi
else
    log_warning "sqlite3 not found, skipping database verification"
fi

################################################################################
# Step 5: Test HTTP access to uploaded files
################################################################################

log_info "Step 5: Testing HTTP access to uploaded files..."

# Get one of the uploaded file paths from the response
SAMPLE_FILE=$(echo "$UPLOAD_RESPONSE" | grep -o '"filePath":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -n "$SAMPLE_FILE" ]; then
    FILENAME=$(basename "$SAMPLE_FILE")
    HTTP_URL="$API_BASE/uploads/$FILENAME"

    HTTP_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$HTTP_URL")

    if [ "$HTTP_RESPONSE" = "200" ]; then
        log_success "Files are accessible via HTTP"
        log_info "  Test URL: $HTTP_URL"
        log_info "  HTTP Status: $HTTP_RESPONSE"
        echo ""
        ((TESTS_PASSED++))
    else
        log_error "Failed to access file via HTTP"
        log_error "  Test URL: $HTTP_URL"
        log_error "  HTTP Status: $HTTP_RESPONSE"
        ((TESTS_FAILED++))
    fi
else
    log_warning "Could not extract file path for HTTP test"
fi

################################################################################
# Step 6: Verify submission retrieval
################################################################################

log_info "Step 6: Testing submission retrieval by ticket number..."

RETRIEVAL_RESPONSE=$(curl -s "$API_BASE/api/submissions/$TICKET_NUMBER")

if echo "$RETRIEVAL_RESPONSE" | grep -q "\"ticketNumber\":\"$TICKET_NUMBER\""; then
    MEDIA_IN_RESPONSE=$(echo "$RETRIEVAL_RESPONSE" | grep -o '"media":\[' | wc -l | tr -d ' ')

    if [ "$MEDIA_IN_RESPONSE" -gt 0 ]; then
        log_success "Submission retrieved successfully with media"
        echo ""

        # Pretty print the submission (if jq is available)
        if command -v jq &> /dev/null; then
            log_info "Full submission data:"
            echo "$RETRIEVAL_RESPONSE" | jq '{ticketNumber, vin, year, make, model, mileage, status, mediaCount: (.media | length)}'
        fi

        echo ""
        ((TESTS_PASSED++))
    else
        log_error "Submission retrieved but no media found"
        ((TESTS_FAILED++))
    fi
else
    log_error "Failed to retrieve submission"
    ((TESTS_FAILED++))
fi

################################################################################
# Test Summary
################################################################################

echo "=================================="
echo "Test Summary"
echo "=================================="
echo ""

log_info "Tests Passed: $TESTS_PASSED"
if [ $TESTS_FAILED -gt 0 ]; then
    log_error "Tests Failed: $TESTS_FAILED"
else
    log_info "Tests Failed: $TESTS_FAILED"
fi

echo ""

# Upload directory summary
log_info "Upload Directory: $UPLOADS_DIR"
log_info "Total Files: $(ls -1 "$UPLOADS_DIR" 2>/dev/null | wc -l | tr -d ' ')"
log_info "Total Size: $(du -sh "$UPLOADS_DIR" 2>/dev/null | cut -f1)"

echo ""

# Database summary
if command -v sqlite3 &> /dev/null; then
    TOTAL_SUBMISSIONS=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM submissions;")
    TOTAL_MEDIA=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM media;")

    log_info "Database Summary:"
    log_info "  Total Submissions: $TOTAL_SUBMISSIONS"
    log_info "  Total Media Records: $TOTAL_MEDIA"
fi

echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    log_success "All tests passed! Media upload system is working correctly."
    exit 0
else
    log_error "Some tests failed. Please review the output above."
    exit 1
fi
