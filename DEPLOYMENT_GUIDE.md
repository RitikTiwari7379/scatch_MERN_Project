# Scatch MERN Project - Deployment Guide

## 🚀 Complete Deployment Guide

This guide will walk you through deploying your MERN stack e-commerce application with:

- **Backend**: Render (https://render.com)
- **Frontend**: Vercel (https://vercel.com)

---

## 📋 Prerequisites

Before starting, ensure you have:

1. ✅ GitHub account (to push your code)
2. ✅ Render account (sign up at render.com)
3. ✅ Vercel account (sign up at vercel.com)
4. ✅ MongoDB Atlas account (your database is already set up)
5. ✅ Razorpay account (you have test credentials)

---

## 🔧 Part 1: Backend Deployment on Render

### Step 1: Prepare Your Repository

1. **Push your code to GitHub** (if not already done):

```bash
cd "/Users/ritiktiwari/Downloads/scatch versions/scatch_MERN_Project"
git init
git add .
git commit -m "Prepare for deployment"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `scatch-backend` (or your preferred name)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `Backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free` (or paid if you need)

### Step 3: Add Environment Variables in Render

In the **Environment Variables** section, add these:

```
JWT_KEY=sgfdsgfdgrfsdvdrdffgfd
EXPRESS_SESSION_SECRET=keyboard cat
RAZORPAY_KEY_ID=rzp_test_RL9lwSRIRPjYQT
RAZORPAY_KEY_SECRET=mu0BZUZOcqMQuDuq9ya4V9yZ
MONGODB_URI=mongodb+srv://ritikamethi7379_db_user:xRghAmo3Tf6vI9tz@cluster0.gnudh7w.mongodb.net/scatch
NODE_ENV=production
FRONTEND_URL=https://your-frontend-app.vercel.app
CORS_ORIGIN=https://your-frontend-app.vercel.app
PORT=3001
```

**⚠️ IMPORTANT**:

- Leave `FRONTEND_URL` and `CORS_ORIGIN` as placeholder for now
- You'll update them after deploying the frontend
- Save your Render URL (e.g., `https://scatch-backend.onrender.com`)

### Step 4: Deploy Backend

1. Click **"Create Web Service"**
2. Wait for deployment to complete (usually 5-10 minutes)
3. **Copy your backend URL** (e.g., `https://scatch-backend.onrender.com`)

---

## 🎨 Part 2: Frontend Deployment on Vercel

### Step 1: Update Frontend Environment Variables

1. Update the file `Frontend-vite/.env.production`:

```env
VITE_API_URL=https://your-actual-backend-url.onrender.com
```

Replace `your-actual-backend-url.onrender.com` with your Render backend URL.

2. **Commit and push** this change:

```bash
git add Frontend-vite/.env.production
git commit -m "Update production API URL"
git push
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)

1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Navigate to frontend folder:

```bash
cd Frontend-vite
```

3. Deploy:

```bash
vercel --prod
```

4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Choose your account
   - Link to existing project? **N**
   - What's your project's name? `scatch-frontend` (or your choice)
   - In which directory is your code located? `./`
   - Override settings? **N**

#### Option B: Using Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Configure the project:

   - **Framework Preset**: `Vite`
   - **Root Directory**: `Frontend-vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add Environment Variable:

   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com`

6. Click **"Deploy"**

### Step 3: Get Your Vercel URL

After deployment completes, copy your Vercel URL (e.g., `https://scatch-frontend.vercel.app`)

---

## 🔄 Part 3: Connect Frontend and Backend

### Step 1: Update Backend Environment Variables

1. Go back to your **Render Dashboard**
2. Select your backend service
3. Go to **"Environment"** tab
4. Update these variables with your actual Vercel URL:
   - `FRONTEND_URL` = `https://your-actual-app.vercel.app`
   - `CORS_ORIGIN` = `https://your-actual-app.vercel.app`
5. Click **"Save Changes"**
6. Render will automatically redeploy your backend

### Step 2: Test Your Application

1. Open your Vercel URL in a browser
2. Test these features:
   - ✅ User Registration
   - ✅ User Login
   - ✅ Browse Products
   - ✅ Add to Cart
   - ✅ Admin Login
   - ✅ Admin Dashboard
   - ✅ Create/Edit Products

---

## 🔐 Security Recommendations

### 1. Update Secrets (IMPORTANT!)

For production, you should generate new secure secrets:

**JWT_KEY**: Generate a new strong key

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**EXPRESS_SESSION_SECRET**: Generate another strong key

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Update these in Render's environment variables.

### 2. Razorpay Production Keys

Currently using test keys. When going live:

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Switch to **Live Mode**
3. Get production keys
4. Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in Render

### 3. MongoDB Security

Your current MongoDB connection is good, but ensure:

- ✅ Network Access is properly configured in MongoDB Atlas
- ✅ Database user has appropriate permissions (not admin if not needed)

---

## 🐛 Troubleshooting Common Issues

### Issue 1: CORS Errors

**Symptoms**: Browser console shows CORS policy errors

**Solution**:

1. Verify `FRONTEND_URL` and `CORS_ORIGIN` in Render match your Vercel URL exactly
2. Make sure URLs don't have trailing slashes
3. Check Render logs for "Origin not allowed" messages
4. Redeploy backend after changing environment variables

### Issue 2: Cookies Not Working

**Symptoms**: Login works but immediately logs out, or cart doesn't persist

**Solution**:

1. Ensure `NODE_ENV=production` in Render
2. Verify both URLs use HTTPS (not HTTP)
3. Check browser console for cookie warnings
4. Clear browser cookies and try again

### Issue 3: API Calls Failing

**Symptoms**: Frontend shows "Network Error" or 404 errors

**Solution**:

1. Verify `VITE_API_URL` in Vercel matches your Render URL exactly
2. Check if Render service is running (green status)
3. Test backend directly: `curl https://your-backend.onrender.com/api/products`
4. Check Render logs for errors

### Issue 4: Images Not Loading

**Symptoms**: Products display but images are broken

**Solution**:

1. Images are stored as Buffer in MongoDB, should work automatically
2. Check Render logs for errors when fetching products
3. Verify MongoDB connection is working
4. Test API endpoint: `https://your-backend.onrender.com/api/products`

### Issue 5: Build Failures

**Backend Build Fails**:

- Check `package.json` has all dependencies
- Ensure Node version compatibility
- Check Render build logs for specific errors

**Frontend Build Fails**:

- Verify `vite.config.js` is correct
- Check for TypeScript/ESLint errors
- Ensure all imports are correct

---

## 📊 Monitoring Your Application

### Backend (Render)

1. Go to Render Dashboard
2. Click on your service
3. View **"Logs"** tab for real-time logs
4. View **"Metrics"** tab for performance

### Frontend (Vercel)

1. Go to Vercel Dashboard
2. Click on your project
3. View **"Analytics"** for traffic data
4. View **"Deployments"** for build logs

---

## 🔄 Making Updates

### Updating Backend

1. Make changes to your code
2. Commit and push to GitHub
3. Render automatically redeploys (if auto-deploy is enabled)

### Updating Frontend

1. Make changes to your code
2. Commit and push to GitHub
3. Vercel automatically redeploys

---

## 📝 Environment Variables Reference

### Backend (.env on Render)

```env
JWT_KEY=<your-jwt-secret>
EXPRESS_SESSION_SECRET=<your-session-secret>
RAZORPAY_KEY_ID=<your-razorpay-key>
RAZORPAY_KEY_SECRET=<your-razorpay-secret>
MONGODB_URI=<your-mongodb-connection-string>
NODE_ENV=production
FRONTEND_URL=<your-vercel-url>
CORS_ORIGIN=<your-vercel-url>
PORT=3001
```

### Frontend (.env.production or Vercel Environment Variables)

```env
VITE_API_URL=<your-render-backend-url>
```

---

## ✅ Post-Deployment Checklist

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] CORS configured correctly
- [ ] Environment variables set in both platforms
- [ ] FRONTEND_URL updated in Render
- [ ] VITE_API_URL updated in Vercel
- [ ] User registration works
- [ ] User login works
- [ ] Products display correctly
- [ ] Cart functionality works
- [ ] Admin login works
- [ ] Admin can create/edit/delete products
- [ ] Payment integration tested (test mode)
- [ ] All images loading correctly
- [ ] No console errors in browser
- [ ] Mobile responsiveness checked

---

## 🆘 Need Help?

If you encounter issues:

1. Check Render logs (Backend)
2. Check Vercel deployment logs (Frontend)
3. Check browser console (Developer Tools → Console)
4. Verify all environment variables are correct
5. Ensure MongoDB Atlas allows connections from 0.0.0.0/0 (or specific IPs)

---

## 🎉 Success!

Once everything is working:

1. Share your live URL: `https://your-app.vercel.app`
2. Consider setting up a custom domain
3. Monitor your application regularly
4. Keep your dependencies updated

---

**Your Backend URL**: `https://your-backend-name.onrender.com`
**Your Frontend URL**: `https://your-app-name.vercel.app`

**Remember**:

- Render free tier spins down after inactivity (takes 30-60s to wake up)
- Vercel has excellent uptime and performance
- Always keep your environment variables secure
- Never commit .env files to GitHub

Good luck with your deployment! 🚀
