# Vercel Deployment Guide

This guide will help you deploy the Military Asset Management System to Vercel with separate frontend and backend deployments.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **MongoDB Atlas**: Ensure your MongoDB Atlas cluster is running

## 🚀 Backend Deployment

### Step 1: Deploy Backend to Vercel

1. **Connect Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `backend` folder as the root directory

2. **Configure Environment Variables**:
   In your Vercel project settings, add these environment variables:

   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d
   PORT=5000
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   LOG_LEVEL=info
   ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
   ADMIN_EMAIL=admin@military.gov
   ADMIN_PASSWORD=Admin@123
   ADMIN_NAME=System Administrator
   ```

3. **Deploy**:
   - Click "Deploy"
   - Note your backend URL (e.g., `https://your-backend.vercel.app`)

### Step 2: Update CORS Settings

Make sure your `ALLOWED_ORIGINS` includes your frontend domain.

## 🎨 Frontend Deployment

### Step 1: Update Environment Variables

1. Create `.env` file in frontend root:
   ```
   VITE_API_URL=https://your-backend.vercel.app
   ```

2. Update your AuthContext and any API calls to use the environment variable:
   ```javascript
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
   ```

### Step 2: Deploy Frontend to Vercel

1. **Connect Repository**:
   - Create a new Vercel project
   - Import your GitHub repository
   - Select the root folder (frontend)

2. **Configure Environment Variables**:
   ```
   VITE_API_URL=https://your-backend.vercel.app
   ```

3. **Deploy**:
   - Click "Deploy"
   - Your frontend will be available at your Vercel domain

## ⚙️ Configuration Details

### Backend Configuration (`backend/vercel.json`)
- Configures Node.js runtime for Express server
- Sets up API routes
- Defines environment variables
- Sets function timeout to 30 seconds

### Frontend Configuration (`vercel.json`)
- Configures Vite build process
- Sets up SPA routing with rewrites
- Adds security headers
- Defines build and output directories

## 🔧 Local Development vs Production

### Local Development:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

### Production:
- Frontend: `https://your-frontend.vercel.app`
- Backend: `https://your-backend.vercel.app`

## 🛠️ Troubleshooting

### Common Issues:

1. **CORS Errors**:
   - Ensure `ALLOWED_ORIGINS` includes your frontend domain
   - Check that environment variables are set correctly

2. **Database Connection**:
   - Verify MongoDB Atlas connection string
   - Ensure your IP is whitelisted in MongoDB Atlas

3. **Build Failures**:
   - Check that all dependencies are in `package.json`
   - Verify Node.js version compatibility

4. **Environment Variables**:
   - Double-check all environment variable names
   - Ensure sensitive data is not in your repository

## 📝 Post-Deployment Steps

1. **Test Authentication**:
   - Try logging in with demo credentials
   - Verify role-based access control

2. **Seed Database** (if needed):
   - Run the seed script from your local environment
   - Or create a separate endpoint for seeding

3. **Monitor Logs**:
   - Check Vercel function logs for any errors
   - Monitor MongoDB Atlas for connection issues

## 🔐 Security Considerations

1. **Environment Variables**: Never commit sensitive data to your repository
2. **CORS**: Only allow your frontend domain in ALLOWED_ORIGINS
3. **Rate Limiting**: Configure appropriate rate limits for production
4. **JWT Secret**: Use a strong, unique JWT secret for production

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Express.js on Vercel](https://vercel.com/guides/using-express-with-vercel)

---

**Note**: Remember to update your API URLs in the frontend code to point to your deployed backend URL instead of localhost.
