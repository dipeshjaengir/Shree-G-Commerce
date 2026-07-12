# Shree G Commerce

Enterprise-grade, full-stack commerce platform built with a luxury monochrome aesthetic. Features a fully functional grocery storefront and administrative control panel.

## Key Features
- **Monochrome Design**: High-contrast, clean, responsive customer interface.
- **Modular Commerce Architecture**: Clean separation between grocery catalog and system configs.
- **Robust Role RBAC**: Security policies isolating Super Admin, Manager, Staff, and Customers.
- **Winston Request Logger**: Request auditing using unique Request IDs.
- **MongoDB Transactions**: Checkout calculations wrapped in native atomic sessions.

## Quick Start
1. **Configure Environment**: Copy `.env.example` to `.env` and populate variables.
2. **Install Dependencies**:
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```
3. **Seed Database**:
   ```bash
   cd ../backend
   npm run seed
   ```
4. **Launch Local Server**:
   ```bash
   npm run dev
   # Launches backend on port 5000 and frontend on port 5173
   ```
