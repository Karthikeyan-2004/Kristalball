# Military Asset Management System - Backend API

A secure, role-based backend API for managing military assets with MongoDB Atlas integration.

## 🚀 Features

### Role-Based Access Control (RBAC)
- **Admin**: Full access to all data and operations
- **Base Commander**: Access to data and operations for their assigned base
- **Logistics Officer**: Limited access to purchases and transfers

### Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Audit logging
- Input validation

### Asset Management
- Create, read, update, delete assets
- Transfer assets between bases
- Assign assets to personnel
- Track asset history
- Dashboard statistics

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection & logging
│   │   └── seedData.js          # Initial data seeding
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   └── assetController.js   # Asset management logic
│   ├── middleware/
│   │   └── auth.js              # Authentication & authorization middleware
│   ├── models/
│   │   ├── User.js              # User model with RBAC
│   │   └── Asset.js             # Asset model
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   └── assets.js            # Asset management routes
│   └── server.js                # Main server file
├── logs/                        # Application logs
├── .env                         # Environment variables
├── .env.example                 # Environment template
└── package.json                 # Dependencies & scripts
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. MongoDB Atlas Setup

1. Create a MongoDB Atlas account at https://www.mongodb.com/atlas
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address
5. Get your connection string

### 3. Environment Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update `.env` with your MongoDB Atlas credentials:
```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.mongodb.net/military_asset_db?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

### 4. Seed Initial Data

```bash
npm run seed
```

This will create:
- Admin user
- Base commanders for each base
- Logistics officers
- Sample assets across different bases

### 5. Start the Server

Development mode with auto-restart:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## 🔐 Default User Credentials

After running the seed script, you'll have these default users:

### Admin
- **Email**: admin@military.gov
- **Password**: Admin@123
- **Access**: Full system access

### Base Commanders
- **John Smith (Base Alpha)**: john.smith@military.gov / Password@123
- **Sarah Johnson (Base Beta)**: sarah.johnson@military.gov / Password@123
- **Mike Davis (Base Gamma)**: mike.davis@military.gov / Password@123

### Logistics Officers
- **Lisa Brown**: lisa.brown@military.gov / Password@123
- **Robert Wilson**: robert.wilson@military.gov / Password@123

## 📚 API Endpoints

### Authentication
```
POST   /api/auth/login           # User login
GET    /api/auth/logout          # User logout
GET    /api/auth/me              # Get current user
PUT    /api/auth/updateprofile   # Update user profile
PUT    /api/auth/updatepassword  # Update password

# Admin only
POST   /api/auth/register        # Register new user
GET    /api/auth/users           # Get all users
PUT    /api/auth/users/:id       # Update user
DELETE /api/auth/users/:id       # Delete user
```

### Assets
```
GET    /api/assets               # Get assets (filtered by user's bases)
POST   /api/assets               # Create new asset (Admin/Base Commander)
GET    /api/assets/:id           # Get single asset
PUT    /api/assets/:id           # Update asset (Admin/Base Commander)
DELETE /api/assets/:id           # Delete asset (Admin only)

# Asset Operations
PUT    /api/assets/:id/transfer  # Transfer asset (Admin/Logistics Officer)
PUT    /api/assets/:id/assign    # Assign asset (Admin/Base Commander)
PUT    /api/assets/:id/return    # Return asset (Admin/Base Commander)

# Dashboard
GET    /api/assets/dashboard/stats # Get dashboard statistics
```

### Health Check
```
GET    /health                   # Server health status
```

## 🔒 RBAC Implementation

### Permission Matrix

| Operation | Admin | Base Commander | Logistics Officer |
|-----------|-------|----------------|-------------------|
| View Dashboard | ✅ | ✅ (Own Base) | ✅ |
| Manage Assets | ✅ | ✅ (Own Base) | ❌ |
| Manage Purchases | ✅ | ❌ | ✅ |
| Manage Transfers | ✅ | ❌ | ✅ |
| Manage Assignments | ✅ | ✅ (Own Base) | ❌ |
| View All Bases | ✅ | ❌ | ❌ |
| Manage Users | ✅ | ❌ | ❌ |

### Base Access Control

- **Admin**: Access to all bases
- **Base Commander**: Access only to their assigned base
- **Logistics Officer**: Access to all bases for transfers/purchases only

## 🔍 Testing the API

### 1. Login as Admin
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@military.gov", "password": "Admin@123"}'
```

### 2. Use the JWT Token
```bash
curl -X GET http://localhost:5000/api/assets \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Create a New Asset
```bash
curl -X POST http://localhost:5000/api/assets \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "assetId": "TEST001",
    "name": "Test Asset",
    "category": "Other",
    "currentBase": "Base Alpha",
    "quantity": 1,
    "unitValue": 1000,
    "description": "Test asset for API testing"
  }'
```

## 📊 Monitoring & Logging

- Application logs are stored in the `logs/` directory
- Error logs: `logs/error.log`
- Combined logs: `logs/combined.log`
- Console logging in development mode

## 🚀 Deployment

### Production Environment Variables
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-strong-production-secret
ALLOWED_ORIGINS=https://your-frontend-domain.com
PORT=5000
```

### PM2 Deployment (Recommended)
```bash
npm install -g pm2
pm2 start src/server.js --name "military-asset-api"
pm2 save
pm2 startup
```

## 🔧 Development

### Running Tests
```bash
npm test
```

### Code Linting
```bash
npm run lint
```

### Database Reset
```bash
npm run seed
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Support

For support and questions, please contact the development team.
