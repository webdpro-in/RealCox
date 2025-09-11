# Property Management Backend

This is the backend for the property management system built with Node.js, Express, MongoDB, and Cloudinary.

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** with Mongoose - Database
- **Cloudinary** - Image upload and management
- **Railway** - Deployment platform
- **JWT** - Authentication

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```

3. **MongoDB Setup**
   - Create a MongoDB cluster (Atlas recommended)
   - Get your connection string
   - Add it to `MONGODB_URI` in `.env`

4. **Cloudinary Setup**
   - Create a Cloudinary account
   - Get your cloud name, API key, and API secret
   - Add them to `.env`

5. **Run Development Server**
   ```bash
   npm run dev
   ```

## Deployment on Railway

1. **Connect Repository**
   - Go to [Railway](https://railway.app)
   - Create new project
   - Connect your GitHub repository
   - Select the `backend` folder as root

2. **Environment Variables**
   Add all variables from `.env` to Railway's environment variables

3. **Deploy**
   Railway will automatically deploy your app

## API Endpoints

### Admin
- `POST /api/admin/login` - Admin login

### Companies
- `GET /api/companies` - Get all companies
- `POST /api/companies` - Create company
- `PUT /api/companies` - Update company
- `DELETE /api/companies` - Delete company

### Lands
- `GET /api/lands` - Get all lands
- `GET /api/lands?companyId=id` - Get lands by company
- `POST /api/lands` - Create land
- `PUT /api/lands` - Update land
- `DELETE /api/lands` - Delete land

### Requirements
- `GET /api/requirements` - Get all requirements
- `POST /api/requirements` - Create requirement

### Upload
- `POST /api/upload` - Upload image to Cloudinary

## Project Structure

```
backend/
├── models/          # Mongoose models
├── routes/          # Express routes
├── server.js        # Main server file
├── package.json     # Dependencies
└── .env.example     # Environment variables template
```