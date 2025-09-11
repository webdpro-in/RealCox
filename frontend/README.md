# Property Management System

A full-stack property management application with separate frontend and backend.

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Tailwind CSS (Vite)
- **Backend**: Node.js + Express + MongoDB + Cloudinary
- **Deployment**: Frontend (Lovable) + Backend (Railway)

## 📁 Project Structure

```
property-management/
├── src/                    # Frontend React application
├── backend/                # Backend Node.js API
└── README.md              # This file
```

## 🚀 Quick Start

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in your MongoDB, Cloudinary, and other credentials.

4. **Run development server**
   ```bash
   npm run dev
   ```

## 🌐 Deployment

### Backend Deployment on Railway

1. **Connect Repository**
   - Go to [Railway](https://railway.app)
   - Create new project from GitHub repo
   - Set root directory to `/backend`

2. **Environment Variables**
   Add all variables from `backend/.env` to Railway

3. **Deploy**
   Railway will automatically build and deploy

4. **Update Frontend**
   Update the production API URL in `src/lib/api.ts`:
   ```typescript
   const API_URL = process.env.NODE_ENV === 'production' 
     ? 'https://your-railway-app.railway.app/api'  // Update this
     : 'http://localhost:5000/api'
   ```

Created complete backend with Node.js, Express, MongoDB, and Cloudinary integration. Frontend now uses new API endpoints. Start backend server to test functionality.