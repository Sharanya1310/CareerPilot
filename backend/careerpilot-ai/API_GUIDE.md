# CareerPilot AI Backend — Complete Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (free tier available)
- Cloudinary account (free tier available)

### Step 1: Install Dependencies
```bash
cd careerpilot-ai-backend
npm install
```

### Step 2: Setup Environment Variables
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/careerpilot-ai
JWT_SECRET=your_secret_key_min_32_characters
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

### Step 3: Start the Server
```bash
# Development (auto-reload on file changes)
npm run dev

# Production
npm start
```

Server starts at: `http://localhost:5000`

---

## 📁 Project Architecture

```
src/
├── config/
│   ├── database.js          # MongoDB connection
│   ├── cloudinary.js        # Cloudinary setup
│   ├── upload.js            # Multer configuration
│   └── validateEnv.js       # Env var validation
│
├── controllers/
│   └── healthController.js  # Example controller
│
├── middleware/
│   ├── errorHandler.js      # Global error handling
│   ├── notFound.js          # 404 handler
│   ├── requestId.js         # Request tracing
│   └── securityHeaders.js   # Security headers
│
├── models/
│   └── ExampleModel.js      # Example model pattern
│
├── routes/
│   └── healthRoutes.js      # Example routes
│
├── services/
│   └── ExampleService.js    # Example service pattern
│
├── utils/
│   ├── apiResponse.js       # Centralized API responses
│   ├── asyncHandler.js      # Async error wrapper
│   ├── AppError.js          # Custom error class
│   ├── logger.js            # Logging utility
│   ├── constants.js         # App constants
│   └── validators.js        # Input validators
│
├── jobs/                    # Scheduled/background jobs
│
├── app.js                   # Express app config
└── server.js                # Server entry point
```

---

## 🔌 API Endpoints

### Health Check
```
GET /api/health
```

**Response:**
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

## 🛠️ Development Guide

### Adding a New Feature

#### 1. Create the Model
File: `src/models/Job.js`
```javascript
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  status: { type: String, enum: ["Applied", "Saved"], default: "Saved" },
}, { timestamps: true });

export default mongoose.model("Job", jobSchema);
```

#### 2. Create the Service
File: `src/services/jobService.js`
```javascript
import Job from "../models/Job.js";
import AppError from "../utils/AppError.js";

class JobService {
  static async findById(id) {
    const job = await Job.findById(id);
    if (!job) throw new AppError("Job not found", 404);
    return job;
  }

  static async create(data) {
    return await Job.create(data);
  }
}

export default JobService;
```

#### 3. Create the Controller
File: `src/controllers/jobController.js`
```javascript
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import JobService from "../services/jobService.js";

export const getJob = asyncHandler(async (req, res) => {
  const job = await JobService.findById(req.params.id);
  ApiResponse.ok(res, "Job fetched", job);
});

export const createJob = asyncHandler(async (req, res) => {
  const job = await JobService.create(req.body);
  ApiResponse.created(res, "Job created", job);
});
```

#### 4. Create the Routes
File: `src/routes/jobRoutes.js`
```javascript
import { Router } from "express";
import { getJob, createJob } from "../controllers/jobController.js";

const router = Router();

router.post("/", createJob);
router.get("/:id", getJob);

export default router;
```

#### 5. Mount Routes
File: `src/app.js`
```javascript
import jobRoutes from "./routes/jobRoutes.js";

app.use("/api/jobs", jobRoutes);
```

---

## 📊 Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* actual data */ },
  "meta": { /* optional pagination/metadata */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ /* optional field-level errors */ ]
}
```

---

## 🔐 Error Handling

The global error handler automatically catches and transforms errors:

- **CastError** → 400 Bad Request
- **ValidationError** → 400 with field errors
- **Duplicate Key** → 409 Conflict
- **JWT Errors** → 401 Unauthorized
- **Unknown Errors** → 500 Internal Server Error

Throw errors like:
```javascript
throw new AppError("User not found", 404);
```

---

## ✅ Middleware Overview

### requestIdMiddleware
Assigns unique ID to each request for tracing:
```
X-Request-ID: 1718079600000-a1b2c3d4
```

### securityHeadersMiddleware
Adds security headers:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`

### errorHandler
Global error transformation and logging

### notFound
Catches 404s and forwards to error handler

---

## 📦 File Upload Setup

Multer is configured to upload directly to Cloudinary:

```javascript
import { uploadProfile, uploadResume } from "../config/upload.js";

router.post("/profile-pic", uploadProfile.single("image"), (req, res) => {
  // req.file.secure_url contains Cloudinary URL
  ApiResponse.created(res, "Image uploaded", { url: req.file.secure_url });
});
```

---

## 🧪 Testing Endpoints

### Using curl
```bash
curl http://localhost:5000/api/health
```

### Using Postman/Insomnia
1. Import the collection
2. Set `{{BASE_URL}}` to `http://localhost:5000`
3. Send requests

### Using Thunder Client (VS Code)
Install "Thunder Client" extension and use it to test

---

## 📝 Useful Commands

```bash
# Development with auto-reload
npm run dev

# Start production server
npm start

# Run linter (when configured)
npm run lint

# View MongoDB connection info
console.log(process.env.MONGODB_URI)
```

---

## 🚨 Common Issues

**Issue:** `Cannot find module 'dotenv'`
- **Solution:** Run `npm install dotenv`

**Issue:** `MongoDB connection failed`
- **Solution:** Check MONGODB_URI in .env, ensure IP whitelist is set in Atlas

**Issue:** `Cloudinary upload fails`
- **Solution:** Verify CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET in .env

**Issue:** Port already in use
- **Solution:** Change PORT in .env or kill process: `lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9`

---

## 🔗 Useful Links

- [Express.js Docs](https://expressjs.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [JWT.io](https://jwt.io/)
- [Multer Docs](https://github.com/expressjs/multer)

---

## 📚 Next Steps

1. **Add Authentication Module** — JWT login/signup
2. **Add User Model** — User profile, email verification
3. **Add Job Tracking** — CRUD operations for job applications
4. **Add Task Management** — To-dos linked to jobs
5. **Add File Uploads** — Resume/portfolio uploads
6. **Add Email Notifications** — Nodemailer integration
7. **Add Testing** — Jest/Mocha test suite
8. **Add API Documentation** — Swagger/OpenAPI
