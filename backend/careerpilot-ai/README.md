# CareerPilot AI — Backend

Production-ready Node.js backend for CareerPilot AI.

**Stack:** Node.js · Express.js · MongoDB Atlas · Mongoose · JWT · Cloudinary · Multer

---

## 📁 Project Structure

```
src/
├── config/
│   ├── database.js          # MongoDB Atlas connection
│   └── cloudinary.js        # Cloudinary configuration
│
├── controllers/
│   └── healthController.js  # Health check handler
│
├── middleware/
│   ├── errorHandler.js      # Global error handler
│   └── notFound.js          # 404 handler
│
├── models/                  # Mongoose schemas (add here)
├── routes/
│   └── healthRoutes.js      # GET /api/health
│
├── services/                # Business logic layer (add here)
├── utils/
│   ├── apiResponse.js       # Centralized response format
│   ├── asyncHandler.js      # Async error wrapper
│   └── AppError.js          # Custom error class
│
├── jobs/                    # Background/scheduled jobs (add here)
├── app.js                   # Express app config
└── server.js                # Server bootstrap + graceful shutdown
```

---

## ⚙️ Setup & Installation

### 1. Clone and install
```bash
git clone https://github.com/Sharanya1310/CareerPilot.git
cd CareerPilot/backend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/careerpilot-ai
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Run the server
```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

---

## 🔗 API Endpoints

### Health Check
| Method | Endpoint     | Auth | Description              |
|--------|--------------|------|--------------------------|
| GET    | `/api/health`| ❌   | Server + DB status check |

#### Response
```json
{
  "success": true,
  "message": "CareerPilot AI is healthy 🚀",
  "data": {
    "server": "online",
    "database": "connected",
    "environment": "development",
    "timestamp": "2025-06-11T10:00:00.000Z",
    "uptime": "42s",
    "memoryUsage": {
      "rss": "45.12 MB",
      "heapUsed": "22.34 MB"
    }
  }
}
```

---

## 📐 Architecture Patterns

### Centralized Response Format
All endpoints use `ApiResponse` utilities:
```js
ApiResponse.ok(res, "Jobs fetched", jobs);
ApiResponse.created(res, "Job added", newJob);
ApiResponse.notFound(res, "Job not found");
```

### Async Handler
No try/catch needed in controllers:
```js
export const getJobs = asyncHandler(async (req, res) => {
  const jobs = await JobService.getAll(req.user._id);
  ApiResponse.ok(res, "Jobs fetched", jobs);
});
```

### AppError
Throw clean errors from anywhere:
```js
throw new AppError("User not found", 404);
```

---

## 🔌 Adding New Modules

1. **Model** → `src/models/Job.js`
2. **Service** → `src/services/jobService.js`
3. **Controller** → `src/controllers/jobController.js`
4. **Route** → `src/routes/jobRoutes.js`
5. **Mount** in `src/app.js`:
   ```js
   app.use("/api/jobs", jobRoutes);
   ```

---

## 🛡️ Error Handling

The global error handler (`src/middleware/errorHandler.js`) automatically handles:
- Mongoose `CastError` → 400
- Mongoose `ValidationError` → 400 with field errors
- Duplicate key (`code 11000`) → 409
- `JsonWebTokenError` → 401
- `TokenExpiredError` → 401
- All other errors → 500 (stack trace hidden in production)
