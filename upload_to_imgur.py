#!/usr/bin/env python3
"""
Upload Fenix logo to image hosting services for easy viewing and download
"""

import base64
import json
import urllib.request
import urllib.parse
import ssl
import os

def upload_to_imgbb():
    """Upload to ImgBB (no auth required for temporary hosting)"""
    
    logo_path = '/workspace/public/fenix-logo.png'
    
    if not os.path.exists(logo_path):
        print("❌ Error: fenix-logo.png not found!")
        return None
    
    # Read and encode the image
    with open(logo_path, 'rb') as f:
        image_base64 = base64.b64encode(f.read()).decode('utf-8')
    
    # ImgBB free API key (public key for demo purposes)
    api_key = "6d207e02198a847aa98d0a2a901485a5"  # Public demo key
    
    # Prepare the request
    data = urllib.parse.urlencode({
        'key': api_key,
        'image': image_base64,
        'name': 'fenix-logo',
        'expiration': 86400  # 24 hours
    }).encode('utf-8')
    
    req = urllib.request.Request(
        'https://api.imgbb.com/1/upload',
        data=data,
        headers={'User-Agent': 'Mozilla/5.0'}
    )
    
    try:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        
        with urllib.request.urlopen(req, context=ctx) as response:
            result = json.loads(response.read().decode())
            
            if result.get('success'):
                image_url = result['data']['url']
                display_url = result['data']['display_url']
                delete_url = result['data']['delete_url']
                
                print("✅ Upload successful to ImgBB!")
                print(f"\n🖼️ VIEW IMAGE:")
                print(f"   {display_url}")
                print(f"\n📱 DIRECT LINK (for mobile):")
                print(f"   {image_url}")
                print(f"\n💾 To save on mobile:")
                print("   1. Open the link above")
                print("   2. Tap and hold the image")
                print("   3. Select 'Save Image' or 'Download'")
                print(f"\n🗑️ Delete link (if needed):")
                print(f"   {delete_url}")
                
                return display_url
            else:
                print("❌ ImgBB upload failed:", result)
                return None
                
    except Exception as e:
        print(f"❌ Error with ImgBB: {e}")
        return None

def upload_to_freeimage():
    """Alternative: Upload to FreeImage.host"""
    
    logo_path = '/workspace/public/fenix-logo.png'
    
    with open(logo_path, 'rb') as f:
        image_base64 = base64.b64encode(f.read()).decode('utf-8')
    
    # FreeImage.host API
    data = urllib.parse.urlencode({
        'key': '6d207e02198a847aa98d0a2a901485a5',
        'action': 'upload',
        'source': image_base64,
        'format': 'json'
    }).encode('utf-8')
    
    req = urllib.request.Request(
        'https://freeimage.host/api/1/upload',
        data=data,
        headers={'User-Agent': 'Mozilla/5.0'}
    )
    
    try:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        
        with urllib.request.urlopen(req, context=ctx) as response:
            result = json.loads(response.read().decode())
            
            if result.get('status_code') == 200:
                image_url = result['image']['url']
                
                print("✅ Upload successful to FreeImage.host!")
                print(f"\n🖼️ VIEW IMAGE:")
                print(f"   {image_url}")
                
                return image_url
            else:
                print("❌ FreeImage upload failed")
                return None
                
    except Exception as e:
        print(f"❌ Error with FreeImage.host: {e}")
        return None

def create_data_url_html():
    """Create an HTML file with embedded image as fallback"""
    
    logo_path = '/workspace/public/fenix-logo.png'
    
    with open(logo_path, 'rb') as f:
        image_base64 = base64.b64encode(f.read()).decode('utf-8')
    
    html_content = f"""<!DOCTYPE html>
<html>
<head>
    <title>Fenix Logo - Twitter Profile Picture</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {{
            margin: 0;
            padding: 20px;
            background: #1a1a1a;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            font-family: Arial, sans-serif;
        }}
        .container {{
            text-align: center;
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            max-width: 90%;
        }}
        img {{
            max-width: 400px;
            width: 100%;
            height: auto;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        }}
        h1 {{
            color: #333;
            margin-bottom: 20px;
        }}
        .download-btn {{
            display: inline-block;
            margin-top: 20px;
            padding: 12px 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            transition: transform 0.3s;
        }}
        .download-btn:hover {{
            transform: scale(1.05);
        }}
        .instructions {{
            margin-top: 20px;
            padding: 15px;
            background: #f0f0f0;
            border-radius: 8px;
            text-align: left;
        }}
        .instructions h3 {{
            margin-top: 0;
            color: #555;
        }}
        .instructions ol {{
            color: #666;
            line-height: 1.8;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>🔥 Fenix Logo</h1>
        <img src="data:image/png;base64,{image_base64}" alt="Fenix Logo">
        <br>
        <a href="data:image/png;base64,{image_base64}" download="fenix-logo.png" class="download-btn">
            📥 Download PNG
        </a>
        
        <div class="instructions">
            <h3>📱 Mobile Download Instructions:</h3>
            <ol>
                <li>Tap and hold on the image above</li>
                <li>Select "Save Image" from the menu</li>
                <li>Or click the Download button</li>
                <li>The image will be saved to your gallery</li>
                <li>Open Twitter and update your profile picture</li>
            </ol>
        </div>
    </div>
</body>
</html>"""
    
    with open('/workspace/fenix_logo_viewer.html', 'w') as f:
        f.write(html_content)
    
    print("📄 Created local HTML viewer: fenix_logo_viewer.html")
    print("   (This can be opened directly in a browser)")

if __name__ == "__main__":
    print("🚀 Uploading Fenix logo to image hosting service...")
    print("-" * 50)
    
    # Try ImgBB first
    link = upload_to_imgbb()
    
    if not link:
        print("\n🔄 Trying alternative service...")
        link = upload_to_freeimage()
    
    # Also create local HTML as backup
    print("\n" + "-" * 50)
    create_data_url_html()
    
    if link:
        print("\n" + "=" * 50)
        print("✅ SUCCESS! Your Fenix logo is ready to view:")
        print(f"\n🔗 CLICK THIS LINK: {link}")
        print("=" * 50)
    else:
        print("\n⚠️ Online upload failed, but local HTML file created successfully")