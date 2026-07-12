import fs from 'fs';
import path from 'path';

const DOCS = {
  'README.md': `
# Shree G Commerce

Enterprise-grade, full-stack commerce platform built with a luxury monochrome aesthetic. Features a fully functional grocery storefront and administrative control panel.

## Key Features
- **Monochrome Design**: High-contrast, clean, responsive customer interface.
- **Modular Commerce Architecture**: Clean separation between grocery catalog and system configs.
- **Robust Role RBAC**: Security policies isolating Super Admin, Manager, Staff, and Customers.
- **Winston Request Logger**: Request auditing using unique Request IDs.
- **MongoDB Transactions**: Checkout calculations wrapped in native atomic sessions.

## Quick Start
1. **Configure Environment**: Copy \`.env.example\` to \`.env\` and populate variables.
2. **Install Dependencies**:
   \`\`\`bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   \`\`\`
3. **Seed Database**:
   \`\`\`bash
   cd ../backend
   npm run seed
   \`\`\`
4. **Launch Local Server**:
   \`\`\`bash
   npm run dev
   # Launches backend on port 5000 and frontend on port 5173
   \`\`\`
`,

  'API_DOCUMENTATION.md': `
# API Documentation (v1 Router)

All endpoints are versioned under \`/api/v1/\` with backward compatibility support on \`/api/\`.

### 1. Authentication Endpoints
- **POST** \`/auth/signup\` - Public sign up
- **POST** \`/auth/login\` - Public login (returns JWT token in secure cookie)
- **POST** \`/auth/logout\` - Clears cookies
- **POST** \`/auth/forgot-password\` - Generates password reset token
- **POST** \`/auth/reset-password/:token\` - Resets credentials using token
- **PATCH** \`/auth/change-password\` - Updates credentials for logged-in user

### 2. Product Catalog
- **GET** \`/products\` - Lists items with pagination and query filters
- **GET** \`/products/:id\` - Retrieves single product details
- **POST** \`/products\` - Admin product creation (\`products:write\`)
- **PUT** \`/products/:id\` - Admin product update (\`products:write\`)
- **DELETE** \`/products/:id\` - Admin soft delete (\`products:write\`)

### 3. Orders & Placement
- **POST** \`/orders\` - Places checkout orders wrapped in MongoDB Transaction session
- **GET** \`/orders/:id\` - Retrieves order tracker timeline
- **PATCH** \`/orders/:id/status\` - Admin order status transition & stock adjuster
`,

  'DEPLOYMENT_GUIDE.md': `
# Production Deployment Guide

### 1. Database - MongoDB Atlas
1. Create a MongoDB Atlas account.
2. Build a new Shared Cluster and whitelist all connection IPs (\`0.0.0.0/0\`).
3. Capture your connection string (\`mongodb+srv://...\`).

### 2. Backend - Render Hosting
1. Connect your repository to Render.
2. Set Environment Variables:
   - \`MONGO_URI\`
   - \`JWT_SECRET\`
   - \`JWT_EXPIRES_IN\`
   - \`COOKIE_EXPIRES_IN\`
   - \`NODE_ENV=production\`
3. Set build command to \`npm install\` and start command to \`node server.js\`.

### 3. Frontend - Vercel Hosting
1. Select the project in Vercel.
2. Set build settings:
   - Build command: \`npm run build\`
   - Output directory: \`dist\`
3. Deploy!
`,

  'ENVIRONMENT_VARIABLES.md': `
# Environment Variables Configuration

The following properties must exist in your \`.env\` file:

| Variable | Description | Example Value |
|---|---|---|
| \`PORT\` | Port to bind server | \`5000\` |
| \`MONGO_URI\` | MongoDB Connection String | \`mongodb+srv://...\` |
| \`JWT_SECRET\` | Encryption key for JSON web tokens | \`secure_secret_key\` |
| \`JWT_EXPIRES_IN\` | Timeframe for JWT validation | \`7d\` |
| \`COOKIE_EXPIRES_IN\` | Expiration delay for cookies | \`7\` |
| \`CLIENT_URL\` | Target allowed host origin for CORS | \`http://localhost:5173\` |
| \`STORAGE_PROVIDER\` | Active uploads engine | \`local\` (or \`cloudinary\`) |
`,

  'DATABASE_SCHEMA.md': `
# Database Schemas & Models Reference

### 1. User (\`User\`)
- \`name\` (String, required)
- \`email\` (String, unique, index)
- \`password\` (String, select: false)
- \`role\` (Enum: super_admin, admin, manager, staff, customer)
- \`passwordResetToken\` / \`passwordResetExpires\` (For secure recovery)

### 2. Settings (\`Settings\`)
- Configures 18 operational constraints (storeName, contactNumber, freeDeliveryLimit, maintenanceMode).

### 3. Product (\`Product\`)
- \`name\` (String), \`sku\` (String, unique), \`stock\` (Number), \`isDeleted\` (Boolean).
`,

  'ADMIN_MANUAL.md': `
# Admin Dashboard User Manual

### 1. Catalog Control
- Navigate to **Products** and select **Add Product** to create catalog items.
- Fill in fields (price, weight, brand, SKU). Ensure name matches target catalog slug filters.

### 2. Order Processing
- View incoming placements inside **Orders**.
- Use the status dropdown to transition through Confirmed, Packed, and Delivered. Remarks will append to order timeline history.
`,

  'CLIENT_USER_GUIDE.md': `
# Customer Storefront User Guide

### 1. Cart & Checkout
- Browse products inside the Mart listing, add items to cart, and select checkout.
- Multi-step address forms capture shipping locations. GST and delivery fees apply dynamically based on threshold logic.
- Tracking numbers display upon checkout completion.
`,

  'BACKUP_GUIDE.md': `
# Backup & Recovery Guide

### 1. Mongoose Database Dump
Execute \`mongodump\` to export active database collections:
\`\`\`bash
mongodump --uri="mongodb://127.0.0.1:27017/shree-g-commerce" --out="./backup"
\`\`\`

### 2. Mongoose Recovery
Execute \`mongorestore\` to restore data:
\`\`\`bash
mongorestore --uri="mongodb://127.0.0.1:27017/shree-g-commerce" "./backup/shree-g-commerce"
\`\`\`
`,

  'RELEASE_CHECKLIST.md': `
# Release Candidate Checklist

- [x] Environment Variables configured
- [x] MongoDB Atlas Connection Verified
- [x] Compilation Build Success (\`npm run build\`)
- [x] Seeder Database script executed
- [x] Dynamic Settings Form Verified
- [x] Uptime Probe (/api/health) Returns 200 OK
`,

  'DEMO_CREDENTIALS.md': `
# Demo Credentials

Local testing default logins:
- **Super Admin**: \`superadmin@shreeg.com\` / \`SuperAdmin@123\`
- **Manager**: \`manager@shreeg.com\` / \`Manager@123\`
- **Staff**: \`staff@shreeg.com\` / \`Staff@123\`
- **Customer**: \`customer@shreeg.com\` / \`Customer@123\`
`,

  'CHANGELOG.md': `
# Changelog

### [1.0.0] - 2026-07-12
- Completed Phase 1-4.
- Implemented Phase 4.5 feature completions.
- Refactored server versioning routes, logging middleware request-ids, seeder scripts, and storage layers.
`,

  'CLIENT_HANDOVER_CHECKLIST.md': `
# Client Handover Verification Checklist

Confirming active functional states for handover:

- [x] Website running and compiled without exceptions
- [x] Admin Login validated
- [x] Customer login validated
- [x] Product catalog seeded with 100+ Indian grocery entries
- [x] Checkout transactions validated under Mongoose sessions
- [x] Order trackings and updates log correctly
- [x] Database seeder scripts validated
`
};

const writeDocs = () => {
  const rootDir = 'C:\\Users\\Dipesh\\OneDrive\\Desktop\\Shree-G-Commerce';
  console.log(`Writing handover packages to root directory: ${rootDir}`);
  
  Object.entries(DOCS).forEach(([filename, content]) => {
    const targetPath = path.join(rootDir, filename);
    fs.writeFileSync(targetPath, content.trim() + '\n');
    console.log(`Successfully generated: ${filename}`);
  });
  
  console.log('All handover documents generated successfully.');
};

writeDocs();
