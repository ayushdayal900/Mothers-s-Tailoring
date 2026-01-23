# 🚀 AWS MERN Deployment Guide

This guide lists the step-by-step instructions to deploy your MERN application to AWS.
**Backend**: EC2 (Ubuntu) running Node.js + PM2 + Nginx.
**Frontend**: S3 (Hosting) + CloudFront (CDN + SSL).

---

## 🏗️ Phase 1: Backend Deployment (EC2)

### 1. Launch EC2 Instance
1.  Log in to AWS Console -> **EC2** -> **Launch Instance**.
2.  **Name**: `Mahalaxmi-Tailors-Backend`
3.  **OS Image**: **Ubuntu Server 24.04 LTS**.
4.  **Instance Type**: `t2.micro` (Free Tier eligible) or `t3.small` (Recommended for better performance).
5.  **Key Pair**: Create a new key pair (`mahalaxmi-key`), download the `.pem` file.
6.  **Network Settings**:
    *   Allow SSH (Port 22) from `My IP`.
    *   Allow HTTP (Port 80) from `Anywhere`.
    *   Allow HTTPS (Port 443) from `Anywhere`.
7.  **Launch**.

### 2. Setup Server Environment
Open your terminal (in VS Code or PowerShell) where your `.pem` key is located.

```bash
# Set permissions (only if using Git Bash/Mac/Linux, skip for Windows PowerShell)
chmod 400 mahalaxmi-key.pem

# Connect (Replace 1.2.3.4 with your EC2 Public IP)
ssh -i mahalaxmi-key.pem ubuntu@1.2.3.4
```

Run these commands inside the EC2 terminal:

```bash
# Update System
sudo apt update && sudo apt upgrade -y

# Install Node.js (v20)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx
sudo apt install -y nginx

# Install PM2 (Process Manager)
sudo npm install -g pm2
```

### 3. Deploy Backend Code
```bash
# Clone Repository
git clone https://github.com/ayushdayal900/Mothers-s-Tailoring.git
cd Mothers-s-Tailoring/backend

# Install Dependencies
npm install

# Create Environment File
nano .env
```
👉 **Paste your production `.env` variables here.** (Use right-click to paste).
Make sure `NODE_ENV=production`.
Press `Ctrl+X`, then `Y`, then `Enter` to save.

### 4. Start Backend with PM2
I have already added `ecosystem.config.js` to your project.
```bash
# Start the app
pm2 start ecosystem.config.js --env production

# Save the process list so it restarts on reboot
pm2 save
pm2 startup
# (Run the command output by pm2 startup)
```

### 5. Configure Nginx (Reverse Proxy)
```bash
# Remove default config
sudo rm /etc/nginx/sites-enabled/default

# Create new config
sudo nano /etc/nginx/sites-available/mahalaxmi
```
**Paste this configuration**:
```nginx
server {
    listen 80;
    server_name api.mahalaxmi-tailors.shop; # 👈 REPLACE WITH YOUR DOMAIN

    location / {
        proxy_pass http://localhost:5000; # Assuming your backend runs on 5000
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
**Enable the site:**
```bash
sudo ln -s /etc/nginx/sites-available/mahalaxmi /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🎨 Phase 2: Frontend Deployment (S3 + CloudFront)

### 1. Build Frontend Source
Run this **on your local machine**:
```powershell
cd d:\Projects\Mahalxmi-Tailors\frontend

# Ensure VITE_API_URL points to your EC2/Domain
# Example in .env.production: VITE_API_URL=https://api.mahalaxmi-tailors.shop

npm run build
```
This creates a `dist` folder.

### 2. Upload to S3
1.  AWS Console -> **S3** -> **Create Bucket**.
2.  **Name**: `mahalaxmi-frontend-prod` (must be unique).
3.  **Uncheck** "Block all public access" (We will secure it via Policy or CloudFront, but for simple hosting, unblocking is easiest initially, OR preferably keep blocked and use CloudFront OAC).
    *   *Recommendation*: Keep "Block all public access" **ON** and use **CloudFront**.
4.  **Create Bucket**.
5.  Upload the **contents** of the `dist` folder to the root of the bucket.

### 3. Configure CloudFront (CDN & SSL)
1.  AWS Console -> **CloudFront** -> **Create Distribution**.
2.  **Origin Domain**: Select your S3 bucket.
3.  **Origin Access**: choose **Origin access control settings (recommended)**.
    *   Create control setting (default verified).
    *   **IMPORTANT**: After creating distribution, AWS will give you a Policy Statement to copy into your S3 Bucket Policy.
4.  **Viewer Protocol Policy**: Redirect HTTP to HTTPS.
5.  **Price Class**: Use North America and Europe (Cheapest) or All Edge Locations (Best Performance).
6.  **Create Distribution**.

### 4. Update S3 Policy (for CloudFront Access)
1.  Go back to your S3 Bucket -> Permissions -> **Bucket Policy**.
2.  Paste the policy provided by CloudFront (it allows CloudFront to read your files).

### 5. Handle React Routing (SPA)
In CloudFront -> **Error Pages**:
*   Create Custom Error Response.
*   **HTTP Error Code**: `403` (and `404`).
*   **Customize Error Response**: Yes.
*   **Response Page Path**: `/index.html`.
*   **HTTP Response Code**: `200`.
*   *This ensures refreshing a page like /contact works.*

---

## 🌐 Phase 3: Domain & SSL (Route 53)

1.  **Backend SSL (Certbot)**:
    On EC2:
    ```bash
    sudo apt install certbot python3-certbot-nginx -y
    sudo certbot --nginx -d api.mahalaxmi-tailors.shop
    ```
2.  **Frontend Custom Domain**:
    *   In CloudFront settings, add Alternate Domain Name (CNAME): `www.mahalaxmi-tailors.shop`.
    *   Request an SSL certificate in AWS ACM (us-east-1 region) and attach it.
3.  **DNS Records (Route 53 or your provider)**:
    *   `api.mahalaxmi-tailors.shop` -> A Record -> EC2 Public IP.
    *   `www.mahalaxmi-tailors.shop` -> CNAME -> CloudFront Distribution Domain (`d1234.cloudfront.net`).

---
**🎉 Deployment Complete!**
