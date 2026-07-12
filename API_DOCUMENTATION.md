# API Documentation (v1 Router)

All endpoints are versioned under `/api/v1/` with backward compatibility support on `/api/`.

### 1. Authentication Endpoints
- **POST** `/auth/signup` - Public sign up
- **POST** `/auth/login` - Public login (returns JWT token in secure cookie)
- **POST** `/auth/logout` - Clears cookies
- **POST** `/auth/forgot-password` - Generates password reset token
- **POST** `/auth/reset-password/:token` - Resets credentials using token
- **PATCH** `/auth/change-password` - Updates credentials for logged-in user

### 2. Product Catalog
- **GET** `/products` - Lists items with pagination and query filters
- **GET** `/products/:id` - Retrieves single product details
- **POST** `/products` - Admin product creation (`products:write`)
- **PUT** `/products/:id` - Admin product update (`products:write`)
- **DELETE** `/products/:id` - Admin soft delete (`products:write`)

### 3. Orders & Placement
- **POST** `/orders` - Places checkout orders wrapped in MongoDB Transaction session
- **GET** `/orders/:id` - Retrieves order tracker timeline
- **PATCH** `/orders/:id/status` - Admin order status transition & stock adjuster
