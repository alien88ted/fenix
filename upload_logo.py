#!/usr/bin/env python3
"""
Upload Fenix logo to a temporary file hosting service for easy mobile download
"""

import base64
import json
import urllib.request
import urllib.parse
import ssl
import os

def upload_to_fileio():
    """Upload the logo to file.io temporary hosting service"""
    
    # Read the logo file
    logo_path = '/workspace/public/fenix-logo.png'
    
    if not os.path.exists(logo_path):
        print("❌ Error: fenix-logo.png not found!")
        return None
    
    with open(logo_path, 'rb') as f:
        file_data = f.read()
    
    # Prepare the multipart form data
    boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW'
    
    # Build the request body
    body = []
    body.append(f'--{boundary}'.encode())
    body.append(b'Content-Disposition: form-data; name="file"; filename="fenix-logo.png"')
    body.append(b'Content-Type: image/png')
    body.append(b'')
    body.append(file_data)
    body.append(f'--{boundary}--'.encode())
    body.append(b'')
    
    body_bytes = b'\r\n'.join(body)
    
    # Create the request
    req = urllib.request.Request(
        'https://file.io/?expires=1d',
        data=body_bytes,
        headers={
            'Content-Type': f'multipart/form-data; boundary={boundary}',
            'User-Agent': 'Mozilla/5.0'
        }
    )
    
    try:
        # Disable SSL verification for simplicity (not recommended for production)
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        
        with urllib.request.urlopen(req, context=ctx) as response:
            result = json.loads(response.read().decode())
            
            if result.get('success'):
                download_link = result.get('link')
                print("✅ Upload successful!")
                print(f"\n🔗 Download Link (expires in 24 hours):")
                print(f"   {download_link}")
                print(f"\n📱 Mobile Instructions:")
                print("   1. Click the link above on your phone")
                print("   2. The image will open or download automatically")
                print("   3. Save it to your phone's gallery")
                print("   4. Use it as your Twitter profile picture")
                return download_link
            else:
                print("❌ Upload failed:", result)
                return None
                
    except Exception as e:
        print(f"❌ Error uploading file: {e}")
        return None

def upload_to_tmpfiles():
    """Alternative: Upload to tmpfiles.org"""
    
    logo_path = '/workspace/public/fenix-logo.png'
    
    with open(logo_path, 'rb') as f:
        file_data = f.read()
    
    # Create request for tmpfiles.org
    boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW'
    
    body = []
    body.append(f'--{boundary}'.encode())
    body.append(b'Content-Disposition: form-data; name="file"; filename="fenix-logo.png"')
    body.append(b'Content-Type: image/png')
    body.append(b'')
    body.append(file_data)
    body.append(f'--{boundary}--'.encode())
    body.append(b'')
    
    body_bytes = b'\r\n'.join(body)
    
    req = urllib.request.Request(
        'https://tmpfiles.org/api/v1/upload',
        data=body_bytes,
        headers={
            'Content-Type': f'multipart/form-data; boundary={boundary}',
            'User-Agent': 'Mozilla/5.0'
        }
    )
    
    try:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        
        with urllib.request.urlopen(req, context=ctx) as response:
            result = json.loads(response.read().decode())
            
            if result.get('status') == 'success':
                # Convert the URL to direct download link
                url = result['data']['url']
                # Change tmpfiles.org/12345/file.png to tmpfiles.org/dl/12345/file.png
                download_link = url.replace('tmpfiles.org/', 'tmpfiles.org/dl/')
                
                print("✅ Upload successful to tmpfiles.org!")
                print(f"\n🔗 Direct Download Link:")
                print(f"   {download_link}")
                print(f"\n📱 Mobile Instructions:")
                print("   1. Click the link above on your phone")
                print("   2. The image will download automatically")
                print("   3. Find it in your Downloads folder")
                print("   4. Upload to Twitter as profile picture")
                return download_link
            else:
                print("❌ Upload failed:", result)
                return None
                
    except Exception as e:
        print(f"❌ Error with tmpfiles.org, trying file.io instead...")
        return upload_to_fileio()

if __name__ == "__main__":
    print("🚀 Uploading Fenix logo for mobile download...")
    print("-" * 50)
    
    # Try tmpfiles.org first, fallback to file.io
    link = upload_to_tmpfiles()
    
    if link:
        print("\n" + "=" * 50)
        print("📲 COPY THIS LINK TO YOUR PHONE:")
        print(f"   {link}")
        print("=" * 50)