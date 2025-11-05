# Scatch - Online Shopping Platform

A full-stack e-commerce application where users can browse products, manage their cart, and make purchases. Built with React and Node.js.

## What's Inside

This project has two main parts:

- **Backend** - Handles user accounts, products, and payments
- **Frontend** - The shopping interface users interact with

## Features

**For Shoppers:**

- Create an account and log in
- Browse products with images
- Add items to cart
- Make payments with Razorpay

**For Admins:**

- Separate admin login
- Add new products
- Manage product listings
- Upload product images

## Tech Stack

**Backend:**

- Node.js + Express
- MongoDB with Mongoose
- JWT for authentication
- Razorpay for payments
- Multer for image uploads

**Frontend:**

- React with Vite
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling

## Getting Started

### What You Need

- Node.js installed on your computer
- MongoDB running (local or cloud)
- Razorpay account for payments

### Setup Instructions

1. **Clone the project**

   ```bash
   git clone https://github.com/RitikTiwari7379/scatch_MERN_Project.git
   cd scatch_MERN_Project
   ```

2. **Setup Backend**

   ```bash
   cd Backend
   npm install
   ```

   Create a `.env` file in the Backend folder:

   ```
   JWT_KEY=your_secret_key
   EXPRESS_SESSION_SECRET=another_secret
   MONGODB_URI=your_mongodb_connection_string
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_SECRET=your_razorpay_secret
   ```

3. **Setup Frontend**
   ```bash
   cd ../Frontend-vite
   npm install
   ```

### Running the App

Open two terminals:

**Terminal 1 - Start Backend:**

```bash
cd Backend
npm run dev
```

Backend runs on `http://localhost:3001`

**Terminal 2 - Start Frontend:**

```bash
cd Frontend-vite
npm run dev
```

Frontend runs on `http://localhost:3000`

## How It Works

1. Users register or log in on the home page
2. After login, they can browse products in the shop
3. Add items to cart and proceed to checkout
4. Complete payment through Razorpay
5. Admins can log in separately to manage products

## Project Structure

```
Backend/
├── models/          # Database schemas
├── routes/          # API endpoints
├── controllers/     # Business logic
├── middlewares/     # Auth checks
└── config/          # Database and file uploads

Frontend-vite/
├── src/
│   ├── pages/       # Main screens
│   ├── components/  # Reusable UI parts
│   └── context/     # Auth state management
```

## API Endpoints

- `POST /users/register` - Create new account
- `POST /users/login` - User login
- `POST /owners/login` - Admin login
- `GET /api/products` - Get all products
- `POST /products/create` - Add product (admin)
- `POST /api/payments/create` - Payment processing

