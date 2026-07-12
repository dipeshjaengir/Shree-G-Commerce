# Environment Variables Configuration

The following properties must exist in your `.env` file:

| Variable | Description | Example Value |
|---|---|---|
| `PORT` | Port to bind server | `5000` |
| `MONGO_URI` | MongoDB Connection String | `mongodb+srv://...` |
| `JWT_SECRET` | Encryption key for JSON web tokens | `secure_secret_key` |
| `JWT_EXPIRES_IN` | Timeframe for JWT validation | `7d` |
| `COOKIE_EXPIRES_IN` | Expiration delay for cookies | `7` |
| `CLIENT_URL` | Target allowed host origin for CORS | `http://localhost:5173` |
| `STORAGE_PROVIDER` | Active uploads engine | `local` (or `cloudinary`) |
