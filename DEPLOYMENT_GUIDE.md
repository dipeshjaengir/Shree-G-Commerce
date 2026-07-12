# Production Deployment Guide

### 1. Database - MongoDB Atlas
1. Create a MongoDB Atlas account.
2. Build a new Shared Cluster and whitelist all connection IPs (`0.0.0.0/0`).
3. Capture your connection string (`mongodb+srv://...`).

### 2. Backend - Render Hosting
1. Connect your repository to Render.
2. Set Environment Variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `COOKIE_EXPIRES_IN`
   - `NODE_ENV=production`
3. Set build command to `npm install` and start command to `node server.js`.

### 3. Frontend - Vercel Hosting
1. Select the project in Vercel.
2. Set build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
3. Deploy!
