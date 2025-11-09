#!/usr/bin/env python3
"""Generate a test video for DealerTrade media upload testing"""

import os
import subprocess

# Check if we can use ffmpeg (might be in different location)
ffmpeg_paths = [
    '/usr/local/bin/ffmpeg',
    '/opt/homebrew/bin/ffmpeg',
    'ffmpeg'
]

ffmpeg = None
for path in ffmpeg_paths:
    try:
        result = subprocess.run([path, '-version'], capture_output=True, timeout=5)
        if result.returncode == 0:
            ffmpeg = path
            print(f"Found ffmpeg at: {path}")
            break
    except:
        continue

if ffmpeg:
    # Create a test video using ffmpeg
    cmd = [
        ffmpeg,
        '-f', 'lavfi',
        '-i', 'testsrc=duration=10:size=1280x720:rate=30',
        '-f', 'lavfi',
        '-i', 'sine=frequency=1000:duration=10',
        '-pix_fmt', 'yuv420p',
        '-c:v', 'libx264',
        '-c:a', 'aac',
        '-y',
        'test-video.mp4'
    ]

    print("Creating test video with ffmpeg...")
    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode == 0 and os.path.exists('test-video.mp4'):
        size = os.path.getsize('test-video.mp4')
        print(f"Created test-video.mp4: {size:,} bytes ({size/1024/1024:.2f} MB)")
    else:
        print("Failed to create video with ffmpeg")
        print(result.stderr)
else:
    print("ffmpeg not found, creating placeholder video file...")
    # Create a minimal valid MP4 file (this won't be playable but will pass file checks)
    # For testing purposes, we'll create a very small file
    with open('test-video.mp4', 'wb') as f:
        # Write minimal MP4 header
        f.write(b'\x00\x00\x00\x18ftypmp42\x00\x00\x00\x00mp42isom')
        f.write(b'\x00' * (1024 * 50))  # Pad to ~50KB

    size = os.path.getsize('test-video.mp4')
    print(f"Created placeholder test-video.mp4: {size:,} bytes")
    print("Note: This is a placeholder file for testing upload functionality")
