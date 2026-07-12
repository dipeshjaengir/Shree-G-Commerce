# Database Schemas & Models Reference

### 1. User (`User`)
- `name` (String, required)
- `email` (String, unique, index)
- `password` (String, select: false)
- `role` (Enum: super_admin, admin, manager, staff, customer)
- `passwordResetToken` / `passwordResetExpires` (For secure recovery)

### 2. Settings (`Settings`)
- Configures 18 operational constraints (storeName, contactNumber, freeDeliveryLimit, maintenanceMode).

### 3. Product (`Product`)
- `name` (String), `sku` (String, unique), `stock` (Number), `isDeleted` (Boolean).
