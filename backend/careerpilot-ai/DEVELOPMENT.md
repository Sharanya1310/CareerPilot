# Backend Setup Checklist & Development Guidelines

## ✅ Initial Setup Checklist

- [ ] Clone the repository
- [ ] Install Node.js 18+ (check with `node --version`)
- [ ] Install dependencies: `npm install`
- [ ] Copy `.env.example` to `.env`
- [ ] Fill in all `.env` variables (see guide below)
- [ ] Create MongoDB Atlas cluster
- [ ] Create Cloudinary account
- [ ] Start dev server: `npm run dev`
- [ ] Verify health check: `curl http://localhost:5000/api/health`

---

## 🔑 Environment Variables Setup

### MongoDB Atlas
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free account
3. Create a cluster (M0 free tier is fine)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Paste into `MONGODB_URI` in `.env`

**Example:**
```
MONGODB_URI=mongodb+srv://sharanya:Pass123@cluster0.xyz.mongodb.net/careerpilot-ai?retryWrites=true&w=majority
```

### Cloudinary
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up (free account)
3. Go to Dashboard
4. Copy:
   - Cloud Name → `CLOUDINARY_CLOUD_NAME`
   - API Key → `CLOUDINARY_API_KEY`
   - API Secret → `CLOUDINARY_API_SECRET`

**Example:**
```
CLOUDINARY_CLOUD_NAME=dxyz123abc
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=abcdefghijk_secret_key
```

### JWT Secret
Generate a strong 32+ character random string:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Example:**
```
JWT_SECRET=a7f3d9c2e1b4f6a8d5c3e2b1a9f8d7c6e5b4a3f2d1c0e9b8a7f6e5d4c3b2a1
```

---

## 🏗️ Architecture Principles

### MVC Pattern
```
Request → Route → Controller → Service → Model → Database
```

### Separation of Concerns
- **Controller** — Handle HTTP requests/responses only
- **Service** — Contains all business logic
- **Model** — Database schema and queries only

### Error Handling
Always throw `AppError`:
```javascript
import AppError from "../utils/AppError.js";

if (!user) throw new AppError("User not found", 404);
```

### Async Operations
Always use `asyncHandler` in routes:
```javascript
import asyncHandler from "../utils/asyncHandler.js";

export const getUser = asyncHandler(async (req, res) => {
  const user = await UserService.findById(req.params.id);
  ApiResponse.ok(res, "User fetched", user);
});
```

---

## 📝 Code Style Guidelines

### Naming Conventions
```javascript
// Files
UserService.js        // PascalCase for classes/services
jobController.js      // camelCase for other files
userRoutes.js         // descriptive names

// Variables
const userName = "John";       // camelCase
const MAX_RETRIES = 3;         // UPPER_SNAKE for constants
const isActive = true;         // boolean prefix with is/has

// Functions
async function fetchUser() {}  // descriptive, start with verb
const handleError = () => {};  // verb + noun pattern
```

### Import Order
```javascript
// 1. Node modules
import mongoose from "mongoose";

// 2. Internal absolute paths
import AppError from "../utils/AppError.js";

// 3. Local relative paths
import { apiResponse } from "./apiResponse.js";
```

### Comment Style
```javascript
/**
 * Service method to fetch user by ID
 * @param {string} id - User MongoDB ID
 * @returns {Promise<Object>} User document
 * @throws {AppError} 404 if user not found
 */
static async findById(id) {
  // Implementation
}
```

---

## 🧩 Module Development Template

### 1. Model (src/models/Resource.js)
```javascript
import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
  // fields
}, { timestamps: true });

export default mongoose.model("Resource", resourceSchema);
```

### 2. Service (src/services/ResourceService.js)
```javascript
import Resource from "../models/Resource.js";
import AppError from "../utils/AppError.js";

class ResourceService {
  static async findById(id) { }
  static async findAll(filters) { }
  static async create(data) { }
  static async update(id, data) { }
  static async delete(id) { }
}

export default ResourceService;
```

### 3. Controller (src/controllers/resourceController.js)
```javascript
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import ResourceService from "../services/ResourceService.js";

export const getResources = asyncHandler(async (req, res) => {
  const resources = await ResourceService.findAll();
  ApiResponse.ok(res, "Resources fetched", resources);
});
```

### 4. Routes (src/routes/resourceRoutes.js)
```javascript
import { Router } from "express";
import { getResources, createResource } from "../controllers/resourceController.js";

const router = Router();

router.get("/", getResources);
router.post("/", createResource);

export default router;
```

### 5. Mount in app.js
```javascript
import resourceRoutes from "./routes/resourceRoutes.js";
app.use("/api/resources", resourceRoutes);
```

---

## 🧪 Testing Your Endpoints

### Using Postman
1. Import → Paste raw JSON → Select "Raw" option
2. Set headers: `Content-Type: application/json`
3. Send request

### Using Thunder Client (VS Code)
- Install extension
- Create new request
- Select method, paste URL
- Add JSON body if needed
- Click Send

### Using curl
```bash
# GET
curl http://localhost:5000/api/health

# POST with data
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{"title": "Backend Developer", "company": "Google"}'
```

---

## 🐛 Debugging Tips

### Enable Debug Logs
```javascript
import { logger } from "../utils/logger.js";

logger.debug("User fetched", { userId, email });
```

### Check Request ID
Every response includes `X-Request-ID` header:
```bash
curl -v http://localhost:5000/api/health
# Look for: X-Request-ID: 1718079600000-a1b2c3d4
```

### MongoDB Connection Issues
```javascript
// In server.js
mongoose.connection.on("error", (err) => {
  logger.error("MongoDB error", { error: err.message });
});
```

### Environment Variable Logging
```bash
# Check all env vars are loaded
node -e "console.log(process.env)"
```

---

## 📦 Package Management

### Add New Dependency
```bash
npm install package-name
```

### Update Dependency
```bash
npm update package-name
```

### Remove Dependency
```bash
npm uninstall package-name
```

### View Installed Versions
```bash
npm list
```

---

## 🚀 Deployment Checklist

- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Ensure all env vars are set on server
- [ ] Test database connection
- [ ] Test file uploads to Cloudinary
- [ ] Run health check: `/api/health`
- [ ] Monitor error logs
- [ ] Setup auto-restart (PM2, systemd, Docker)
- [ ] Enable HTTPS (let's encrypt)
- [ ] Setup monitoring/alerting

---

## 🆘 Getting Help

**Issue:** Server won't start
- Check `.env` file exists and is correct
- Ensure MongoDB URI is valid
- Check if port 5000 is already in use

**Issue:** Database connection fails
- Verify MongoDB URI
- Check MongoDB Atlas IP whitelist
- Ensure cluster is running

**Issue:** Cloudinary upload fails
- Verify Cloudinary credentials in `.env`
- Check file size (max 5MB)
- Ensure file type is allowed

**Issue:** Tests failing
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node version: `node --version`
- Restart dev server

---

## 📚 Resources

- [Express Best Practices](https://expressjs.com/en/advanced/best-practices-performance.html)
- [MongoDB Mongoose](https://mongoosejs.com/)
- [REST API Design](https://restfulapi.net/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8949)
