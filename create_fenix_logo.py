#!/usr/bin/env python3
"""
Create a Fenix/Phoenix logo for Twitter profile picture
Creates a 400x400px PNG with a stylized phoenix design
"""

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import math

def create_fenix_logo():
    # Create a square canvas for Twitter profile picture
    size = 400
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Center point
    cx, cy = size // 2, size // 2
    
    # Colors - fiery phoenix theme
    primary_color = (255, 94, 20)  # Orange-red
    secondary_color = (255, 170, 0)  # Golden yellow
    accent_color = (255, 215, 0)  # Gold
    dark_accent = (139, 0, 0)  # Dark red
    
    # Background circle (optional - can be transparent)
    # Gradient effect background
    for i in range(180, 0, -2):
        alpha = int(255 * (i / 180) * 0.3)
        color = (*primary_color, alpha)
        draw.ellipse([cx-i, cy-i, cx+i, cy+i], fill=color)
    
    # Draw stylized phoenix
    # Body
    body_points = [
        (cx, cy - 80),  # Head
        (cx - 40, cy - 40),  # Left shoulder
        (cx - 30, cy + 20),  # Left body
        (cx, cy + 40),  # Bottom
        (cx + 30, cy + 20),  # Right body
        (cx + 40, cy - 40),  # Right shoulder
    ]
    draw.polygon(body_points, fill=primary_color)
    
    # Wings - left wing
    left_wing = [
        (cx - 40, cy - 40),
        (cx - 120, cy - 60),
        (cx - 140, cy - 20),
        (cx - 130, cy + 20),
        (cx - 100, cy + 30),
        (cx - 60, cy + 20),
        (cx - 30, cy),
    ]
    draw.polygon(left_wing, fill=secondary_color)
    
    # Wings - right wing
    right_wing = [
        (cx + 40, cy - 40),
        (cx + 120, cy - 60),
        (cx + 140, cy - 20),
        (cx + 130, cy + 20),
        (cx + 100, cy + 30),
        (cx + 60, cy + 20),
        (cx + 30, cy),
    ]
    draw.polygon(right_wing, fill=secondary_color)
    
    # Wing details - feathers
    # Left wing feathers
    for i in range(3):
        x_offset = -120 + i * 20
        y_offset = -40 + i * 15
        feather = [
            (cx + x_offset, cy + y_offset),
            (cx + x_offset - 15, cy + y_offset + 25),
            (cx + x_offset - 5, cy + y_offset + 30),
            (cx + x_offset + 5, cy + y_offset + 20),
        ]
        draw.polygon(feather, fill=accent_color)
    
    # Right wing feathers
    for i in range(3):
        x_offset = 120 - i * 20
        y_offset = -40 + i * 15
        feather = [
            (cx + x_offset, cy + y_offset),
            (cx + x_offset + 15, cy + y_offset + 25),
            (cx + x_offset + 5, cy + y_offset + 30),
            (cx + x_offset - 5, cy + y_offset + 20),
        ]
        draw.polygon(feather, fill=accent_color)
    
    # Head crest
    crest_points = [
        (cx, cy - 80),
        (cx - 15, cy - 110),
        (cx, cy - 100),
        (cx + 15, cy - 110),
        (cx, cy - 80),
    ]
    draw.polygon(crest_points, fill=accent_color)
    
    # Tail feathers
    tail_points = [
        (cx, cy + 40),
        (cx - 20, cy + 80),
        (cx - 10, cy + 90),
        (cx, cy + 70),
        (cx + 10, cy + 90),
        (cx + 20, cy + 80),
    ]
    draw.polygon(tail_points, fill=secondary_color)
    
    # Eye
    draw.ellipse([cx - 15, cy - 65, cx - 5, cy - 55], fill=(255, 255, 255))
    draw.ellipse([cx - 12, cy - 62, cx - 8, cy - 58], fill=(0, 0, 0))
    
    draw.ellipse([cx + 5, cy - 65, cx + 15, cy - 55], fill=(255, 255, 255))
    draw.ellipse([cx + 8, cy - 62, cx + 12, cy - 58], fill=(0, 0, 0))
    
    # Add some glow effect
    img = img.filter(ImageFilter.SMOOTH_MORE)
    
    # Save the image
    img.save('/workspace/fenix_logo.png', 'PNG')
    print("✅ Fenix logo created successfully!")
    print("📁 File saved as: fenix_logo.png")
    print("📐 Size: 400x400 pixels (perfect for Twitter)")
    print("🎨 Style: Modern phoenix with fiery colors")
    print("\n📱 To download on mobile:")
    print("   1. The file 'fenix_logo.png' is now in your workspace")
    print("   2. You can download it directly from there")
    print("   3. It's optimized for Twitter profile pictures")
    
    # Also create a version with white background for better visibility
    img_white_bg = Image.new('RGBA', (size, size), (255, 255, 255, 255))
    img_white_bg.paste(img, (0, 0), img)
    img_white_bg.save('/workspace/fenix_logo_white_bg.png', 'PNG')
    print("\n🎨 Also created 'fenix_logo_white_bg.png' with white background")

if __name__ == "__main__":
    create_fenix_logo()