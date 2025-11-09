#!/usr/bin/env python3
"""Generate test images for DealerTrade media upload testing"""

from PIL import Image, ImageDraw, ImageFont
import os

# Image configurations
images = [
    ('front.jpg', 'Front View', (70, 130, 180)),      # Steel Blue
    ('rear.jpg', 'Rear View', (220, 20, 60)),         # Crimson
    ('driver_side.jpg', 'Driver Side', (34, 139, 34)), # Forest Green
    ('passenger_side.jpg', 'Passenger Side', (255, 140, 0)), # Dark Orange
    ('steering_wheel.jpg', 'Steering Wheel', (148, 0, 211)), # Dark Violet
    ('front_seat.jpg', 'Front Seat', (184, 134, 11)),  # Dark Goldenrod
    ('back_seat.jpg', 'Back Seat', (72, 61, 139)),     # Dark Slate Blue
]

# Create each test image
for filename, label, color in images:
    # Create a 100x100 image with colored background
    img = Image.new('RGB', (100, 100), color)
    draw = ImageDraw.Draw(img)

    # Add text label
    try:
        # Try to use a default font
        font = ImageFont.load_default()
    except:
        font = None

    # Draw white border
    draw.rectangle([2, 2, 97, 97], outline='white', width=2)

    # Add text in center (simplified - will be small)
    text_bbox = draw.textbbox((0, 0), label, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    position = ((100 - text_width) / 2, (100 - text_height) / 2)
    draw.text(position, label, fill='white', font=font)

    # Save the image
    img.save(filename, 'JPEG', quality=85)
    file_size = os.path.getsize(filename)
    print(f"Created {filename}: {file_size:,} bytes")

print("\nAll test images created successfully!")
