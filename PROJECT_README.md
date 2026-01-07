# 🛍️ Scatch - E-Commerce MERN Platform

A full-stack e-commerce application built with MongoDB, Express.js, React (Vite), and Node.js.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Local Development](#local-development)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)

---

## ✨ Features

### Customer Features

- 👤 User Registration & Authentication
- 🛒 Shopping Cart Management
- 🛍️ Product Browsing & Search
- 💳 Secure Payment Integration (Razorpay)
- 📦 Order History
- 🔐 JWT-based Authentication

### Admin Features

- 📊 Admin Dashboard
- ➕ Create, Edit, Delete Products
- 🖼️ Image Upload for Products
- 💰 Revenue Tracking
- 📈 Product Management

---

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI Library
- **Vite** - Build Tool
- **React Router v7** - Routing
- **Axios** - HTTP Client
- **Context API** - State Management

### Backend

- **Node.js** - Runtime
- **Express.js** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password Hashing
- **Multer** - File Upload
- **Razorpay** - Payment Gateway
- **CORS** - Cross-Origin Resource Sharing

---

## 📁 Project Structure

```
scatch_MERN_Project/
├── Backend/
│   ├── config/
│   │   ├── keys.js                 # JWT keys
│   │   ├── mongoose-connection.js  # MongoDB setup
│   │   └── multer-config.js        # File upload config
│   ├── controllers/
│   │   ├── authController.js       # User auth logic
│   │   └── paymentController.js    # Payment handling
│   ├── middlewares/
│   │   ├── isLoggedIn.js          # User auth middleware
│   │   └── isOwnerLoggedIn.js     # Admin auth middleware
│   ├── models/
│   │   ├── user-model.js          # User schema
│   │   ├── owner-model.js         # Admin schema
│   │   ├── product-model.js       # Product schema
│   │   └── order-model.js         # Order schema
│   ├── routes/
│   │   ├── api.js                 # API routes
│   │   ├── index.js               # Main routes
│   │   ├── userRouter.js          # User routes
│   │   ├── ownerRouter.js         # Admin routes
│   │   ├── productRouter.js       # Product routes
│   │   └── paymentRouter.js       # Payment routes
│   ├── utils/
│   │   └── generateToken.js       # JWT helper
│   ├── .env.example               # Environment template
│   ├── .env.production            # Production env template
│   ├── app.js                     # Express app
│   └── package.json
│
└── Frontend-vite/
    ├── src/
    │   ├── components/
    │   │   ├── Header.js          # Navigation header
    │   │   ├── AdminRoute.js      # Protected admin routes
    │   │   └── PrivateRoute.js    # Protected user routes
    │   ├── context/
    │   │   └── AuthContext.js     # Authentication context
    │   ├── pages/
    │   │   ├── Home.js            # Landing page
    │   │   ├── Shop.js            # Products listing
    │   │   ├── Cart.js            # Shopping cart
    │   │   ├── AdminAuth.js       # Admin login
    │   │   └── AdminDashboard.js  # Admin panel
    │   ├── App.jsx                # Main app component
    │   └── main.jsx               # Entry point
    ├── .env.example               # Environment template
    ├── .env.production            # Production env template
    ├── vite.config.js             # Vite configuration
    ├── vercel.json                # Vercel config
    └── package.json
```

---

## 💻 Local Development

### Prerequisites

- Node.js v16+ installed
- MongoDB Atlas account (or local MongoDB)
- Razorpay test account

### Setup Instructions

#### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd scatch_MERN_Project
```

#### 2. Backend Setup

```bash
cd Backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials
# See Environment Variables section below
```

#### 3. Frontend Setup

```bash
cd ../Frontend-vite
npm install

# Create .env file
cp .env.example .env

# Edit .env
echo "VITE_API_URL=http://localhost:3001" > .env
```

#### 4. Run the Application

**Terminal 1 - Backend:**

```bash
cd Backend
npm start
# Backend runs on http://localhost:3001
```

**Terminal 2 - Frontend:**

```bash
cd Frontend-vite
npm run dev
# Frontend runs on http://localhost:3000
```

#### 5. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Test: http://localhost:3001/api/products

---

## 🚀 Deployment

### Quick Deployment Guide

This project is configured for deployment on:

- **Backend**: Render (https://render.com)
- **Frontend**: Vercel (https://vercel.com)

📖 **See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** for complete step-by-step instructions.

✅ **See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** for a quick checklist.

### Deployment Files Created

- ✅ `Backend/.env.example` - Environment variables template
- ✅ `Backend/.env.production` - Production environment template
- ✅ `Backend/render.json` - Render configuration
- ✅ `Frontend-vite/.env.example` - Frontend environment template
- ✅ `Frontend-vite/.env.production` - Production environment template
- ✅ `Frontend-vite/vercel.json` - Vercel configuration

---

## 🔐 Environment Variables

### Backend (.env)

```env
# JWT Secret (Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_KEY=your_jwt_secret_key

# Session Secret
EXPRESS_SESSION_SECRET=your_session_secret

# Razorpay (Get from https://dashboard.razorpay.com)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# MongoDB (Get from MongoDB Atlas)
MONGODB_URI=your_mongodb_connection_string

# Environment
NODE_ENV=development  # or 'production'

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000  # or your Vercel URL
CORS_ORIGIN=http://localhost:3000   # or your Vercel URL

# Port
PORT=3001
```

### Frontend (.env)

```env
# Backend API URL
VITE_API_URL=http://localhost:3001  # Local development
# VITE_API_URL=https://your-backend.onrender.com  # Production
```

---

## 📡 API Documentation

### Authentication Endpoints

#### Register User

```http
POST /users/register
Content-Type: application/json

{
  "fullname": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User

```http
POST /users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Logout User

```http
GET /users/logout
```

### Product Endpoints

#### Get All Products

```http
GET /api/products
```

#### Create Product (Admin Only)

```http
POST /products/create
Authorization: Bearer <admin-token>
Content-Type: multipart/form-data

{
  "name": "Product Name",
  "price": 1999,
  "discount": 10,
  "bgcolor": "#ffffff",
  "textcolor": "#000000",
  "panelcolor": "#f5f5f5",
  "image": <file>
}
```

#### Update Product (Admin Only)

```http
PUT /products/update/:id
Authorization: Bearer <admin-token>
Content-Type: multipart/form-data
```

#### Delete Product (Admin Only)

```http
DELETE /products/delete/:id
Authorization: Bearer <admin-token>
```

### Cart Endpoints

#### Get Cart

```http
GET /api/cart
Authorization: Bearer <user-token>
```

#### Add to Cart

```http
GET /addtocart/:productId
Authorization: Bearer <user-token>
```

#### Update Cart

```http
POST /updatecart/:productId
Authorization: Bearer <user-token>
Content-Type: application/json

{
  "action": "increment"  // or "decrement"
}
```

#### Remove from Cart

```http
GET /removefromcart/:productId
Authorization: Bearer <user-token>
```

### Payment Endpoints

#### Create Order

```http
POST /api/payments/create-order
Authorization: Bearer <user-token>
Content-Type: application/json

{
  "amount": 1999
}
```

#### Verify Payment

```http
POST /api/payments/verify
Authorization: Bearer <user-token>
Content-Type: application/json

{
  "razorpay_order_id": "order_id",
  "razorpay_payment_id": "payment_id",
  "razorpay_signature": "signature"
}
```

### Admin Endpoints

#### Admin Login

```http
POST /owners/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "adminpass"
}
```

#### Get Revenue (Admin Only)

```http
GET /api/payments/owner-revenue
Authorization: Bearer <admin-token>
```

#### Get Admin Products

```http
GET /api/admin/products
Authorization: Bearer <admin-token>
```

---

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ HTTP-only cookies for token storage
- ✅ Password hashing with bcrypt
- ✅ CORS configuration for cross-origin requests
- ✅ Secure cookie settings (SameSite, Secure in production)
- ✅ Environment variable protection
- ✅ MongoDB connection security

---

## 🐛 Common Issues & Solutions

### CORS Errors

**Problem**: "CORS policy" errors in browser console

**Solution**:

1. Ensure `FRONTEND_URL` and `CORS_ORIGIN` are set correctly in backend
2. Verify URLs don't have trailing slashes
3. Both frontend and backend should use HTTPS in production
4. Check backend logs for "Origin not allowed" messages

### Cookie Issues

**Problem**: Login works but immediately logs out

**Solution**:

1. Ensure `NODE_ENV=production` in production
2. Both URLs must use HTTPS
3. Check `sameSite` and `secure` cookie settings
4. Clear browser cookies and try again

### API Connection Failed

**Problem**: Frontend can't connect to backend

**Solution**:

1. Verify `VITE_API_URL` in frontend matches backend URL
2. Check if backend service is running
3. Test backend directly: `curl https://your-backend.com/api/products`
4. Check for network/firewall issues

### Images Not Loading

**Problem**: Products display but images are broken

**Solution**:

1. Images are stored as Buffer in MongoDB
2. Check MongoDB connection
3. Verify product creation includes image upload
4. Check API response for base64 image data

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Ritik Tiwari**

---

## 🙏 Acknowledgments

- MongoDB Atlas for database hosting
- Render for backend hosting
- Vercel for frontend hosting
- Razorpay for payment integration

---

## 📞 Support

For issues and questions:

1. Check [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
2. Check [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
3. Review browser console for errors
4. Check backend logs on Render
5. Check frontend logs on Vercel

---

**Live Demo**: https://your-app.vercel.app (after deployment)

**Backend API**: https://your-backend.onrender.com (after deployment)

---

**Last Updated**: January 2026
