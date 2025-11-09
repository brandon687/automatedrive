#!/bin/bash
# Project Initialization Hook
# Automatically runs when Claude Code starts in this project

PROJECT_ROOT="/Users/brandonin/drl"
CHANGELOG="$PROJECT_ROOT/PROJECT_CHANGELOG.md"
SESSION_LOG="$PROJECT_ROOT/.claude/session-notes.md"

# Get current date and time
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
DATE_ONLY=$(date "+%Y-%m-%d")

# Create session notes file if it doesn't exist
if [ ! -f "$SESSION_LOG" ]; then
    cat > "$SESSION_LOG" << EOF
# Development Session Notes

## Session: $DATE_ONLY

**Started:** $TIMESTAMP
**Project:** DealerTrade

### Tasks for This Session
- [ ]

### Changes Made
-

### Files Modified
-

### Notes
-

---
EOF
    echo "✅ Created session notes file: $SESSION_LOG"
fi

# Ensure changelog exists
if [ ! -f "$CHANGELOG" ]; then
    echo "⚠️  Warning: PROJECT_CHANGELOG.md not found. Creating template..."
    cat > "$CHANGELOG" << EOF
# Project Changelog

**Project:** DealerTrade
**Created:** $DATE_ONLY

## Current Session: $DATE_ONLY

### Changes
-

---
EOF
fi

echo "📝 Project initialization complete"
echo "📍 Session notes: .claude/session-notes.md"
echo "📍 Changelog: PROJECT_CHANGELOG.md"
echo "🤖 UI/UX Designer agent available"
