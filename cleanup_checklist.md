# 🧹 AWS Cleanup Checklist

Use this checklist to ensure you have a "fresh start" before deploying.

## 1. 🖥️ EC2 (Backend Server)
*   [ ] Go to **AWS Console** -> **EC2** -> **Instances**.
*   [ ] Select your old instance (e.g., `Mahalaxmi-Tailors-Backend`).
*   [ ] Click **Instance State** -> **Terminate Instance**.
*   [ ] *Wait for the status to change to `Terminated`.*

## 2. 🪣 S3 (Frontend Hosting)
*   [ ] Go to **AWS Console** -> **S3**.
*   [ ] Select your old bucket (e.g., `mahalaxmi-frontend...`).
*   [ ] Click **Empty** (You must delete all files inside first).
*   [ ] Type *permanently delete* to confirm.
*   [ ] Click **Delete** to remove the bucket itself.
*   [ ] Type the bucket name to confirm.

## 3. ⚡ CloudFront (CDN)
*   [ ] Go to **AWS Console** -> **CloudFront**.
*   [ ] Select your distribution (ID starts with `E...`).
*   [ ] Click **Disable**.
*   [ ] *Wait (approx. 5 mins) for it to deploy the "Disabled" state.*
*   [ ] Once disabled, select it again and click **Delete**.

## 4. 🌐 Route 53 (Domains) - OPTIONAL
*   *If you want to keep your domain settings, SKIP THIS.*
*   *Only delete if you want to re-configure DNS from scratch.*
*   [ ] Go to **AWS Console** -> **Route 53**.
*   [ ] Select your **Hosted Zone**.
*   [ ] Delete any `A` records or `CNAME` records pointing to the old EC2 IP or CloudFront.

---
**✅ READY!** Once these are done, you can proceed to the **Deployment Guide** to create new resources.
