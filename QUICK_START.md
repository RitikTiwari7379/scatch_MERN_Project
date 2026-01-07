# ⚡ Quick Start Guide - Deploy in 30 Minutes

Follow these steps to deploy your Scatch MERN project quickly.

---

## 📦 What You'll Need

Have these ready before starting:

- [ ] GitHub account
- [ ] Render account (free: https://render.com/register)
- [ ] Vercel account (free: https://vercel.com/signup)
- [ ] Your MongoDB connection string (you already have it)
- [ ] Your Razorpay keys (you already have them)

---

## 🚀 Step-by-Step Deployment

### STEP 1: Push to GitHub (5 minutes)

```bash
cd "/Users/ritiktiwari/Downloads/scatch versions/scatch_MERN_Project"

# Initialize git if not already done
git init
git add .
git commit -m "Ready for deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git branch -M main
git push -u origin main
```

✅ **Checkpoint**: Your code is on GitHub

---

### STEP 2: Deploy Backend on Render (10 minutes)

1. **Go to Render**: https://dashboard.render.com/

2. **Click "New +" → "Web Service"**

3. **Connect GitHub** and select your repository

4. **Configure Service**:

   ```
   Name: scatch-backend
   Region: (Choose closest to you)
   Branch: main
   Root Directory: Backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

5. **Add Environment Variables** (click "Advanced" → "Add Environment Variable"):

   ```
   JWT_KEY = sgfdsgfdgrfsdvdrdffgfd
   EXPRESS_SESSION_SECRET = keyboard cat
   RAZORPAY_KEY_ID = rzp_test_RL9lwSRIRPjYQT
   RAZORPAY_KEY_SECRET = mu0BZUZOcqMQuDuq9ya4V9yZ
   MONGODB_URI = mongodb+srv://ritikamethi7379_db_user:xRghAmo3Tf6vI9tz@cluster0.gnudh7w.mongodb.net/scatch
   NODE_ENV = production
   FRONTEND_URL = https://temp-placeholder.vercel.app
   CORS_ORIGIN = https://temp-placeholder.vercel.app
   PORT = 3001
   ```

   _(We'll update FRONTEND_URL and CORS_ORIGIN after deploying frontend)_

6. **Click "Create Web Service"**

7. **Wait for deployment** (5-10 minutes)

8. **Copy your backend URL**: Example: `https://scatch-backend-xyz.onrender.com`

   **WRITE IT HERE**: ************************\_\_\_************************

✅ **Checkpoint**: Backend is deployed on Render

---

### STEP 3: Update Frontend Configuration (2 minutes)

1. **Update the file**: `Frontend-vite/.env.production`

2. **Replace the content** with your actual Render URL:

   ```env
   VITE_API_URL=https://YOUR-ACTUAL-BACKEND-URL.onrender.com
   ```

   _(Use the URL you just copied from Render)_

3. **Commit and push**:
   ```bash
   git add Frontend-vite/.env.production
   git commit -m "Update production API URL"
   git push
   ```

✅ **Checkpoint**: Frontend is configured with backend URL

---

### STEP 4: Deploy Frontend on Vercel (8 minutes)

#### Option A: Using Vercel Website (Easier)

1. **Go to Vercel**: https://vercel.com/dashboard

2. **Click "Add New" → "Project"**

3. **Import your GitHub repository**

4. **Configure Project**:

   ```
   Project Name: scatch-frontend (or your choice)
   Framework Preset: Vite
   Root Directory: Frontend-vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

5. **Add Environment Variable**:

   - Click "Environment Variables"
   - Key: `VITE_API_URL`
   - Value: `https://your-backend.onrender.com` _(your Render URL)_
   - Click "Add"

6. **Click "Deploy"**

7. **Wait for deployment** (2-5 minutes)

8. **Copy your Vercel URL**: Example: `https://scatch-frontend.vercel.app`

   **WRITE IT HERE**: ************************\_\_\_************************

#### Option B: Using Vercel CLI (Faster)

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd Frontend-vite

# Deploy
vercel --prod

# Follow prompts and copy the URL
```

✅ **Checkpoint**: Frontend is deployed on Vercel

---

### STEP 5: Connect Frontend & Backend (5 minutes)

1. **Go back to Render Dashboard**: https://dashboard.render.com/

2. **Select your backend service** (`scatch-backend`)

3. **Click "Environment" tab**

4. **Update these two variables** with your Vercel URL:

   ```
   FRONTEND_URL = https://your-actual-app.vercel.app
   CORS_ORIGIN = https://your-actual-app.vercel.app
   ```

   _(Use the exact Vercel URL you copied)_

5. **Click "Save Changes"**

6. **Render will automatically redeploy** (2-3 minutes)

✅ **Checkpoint**: Frontend and backend are connected

---

### STEP 6: Test Your Application (5 minutes)

Open your Vercel URL in a browser and test:

1. **Home Page**: ✅ Loads without errors

2. **Shop Page**:

   - ✅ Products display
   - ✅ Images load correctly

3. **User Registration**:

   - ✅ Can create new account
   - ✅ Redirects after registration

4. **User Login**:

   - ✅ Can login successfully
   - ✅ Stays logged in on refresh

5. **Shopping Cart**:

   - ✅ Can add items to cart
   - ✅ Can increase/decrease quantity
   - ✅ Can remove items

6. **Admin Login**:

   - Go to: `https://your-app.vercel.app/admin-auth`
   - ✅ Can login as admin

7. **Admin Dashboard**:

   - ✅ Can create products
   - ✅ Can edit products
   - ✅ Can delete products

8. **Browser Console**:
   - ✅ No CORS errors
   - ✅ No 404 errors
   - ✅ No authentication errors

---

## 🎉 You're Done!

**Your application is live!**

**Frontend URL**: https://your-app.vercel.app

**Backend URL**: https://your-backend.onrender.com

---

## 🐛 Quick Troubleshooting

### Problem: CORS Errors

**Check**:

1. FRONTEND_URL in Render = Your Vercel URL (exact match)
2. CORS_ORIGIN in Render = Your Vercel URL (exact match)
3. No trailing slashes in URLs
4. Backend has redeployed after updating env vars

**Fix**:

```bash
# Check Render logs
Go to Render → Your Service → Logs
Look for "Origin not allowed" messages
```

### Problem: Can't Login / Cookies Not Working

**Check**:

1. NODE_ENV=production in Render
2. Both URLs use HTTPS (not HTTP)
3. Clear browser cookies and try again

### Problem: Images Not Loading

**Check**:

1. MongoDB connection is working (check Render logs)
2. Products are being fetched (open browser dev tools → Network tab)

### Problem: Backend Slow on First Request

**This is normal!**

- Render free tier "sleeps" after 15 minutes of inactivity
- First request takes 30-60 seconds to "wake up"
- Subsequent requests are fast
- This is expected behavior

---

## 📱 Share Your App

Once everything is working, share your app:

**Frontend**: `https://your-app.vercel.app`

---

## 🔐 Security Note

**For production use, generate new secrets**:

```bash
# Generate new JWT_KEY
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate new EXPRESS_SESSION_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Update in Render environment variables
```

---

## 📚 More Information

- **Complete Guide**: See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Detailed Checklist**: See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
- **Project Info**: See [PROJECT_README.md](PROJECT_README.md)
- **All Changes**: See [CHANGES_SUMMARY.md](CHANGES_SUMMARY.md)

---

## ⏱️ Timeline

- **Push to GitHub**: 5 minutes
- **Deploy Backend**: 10 minutes
- **Update Frontend Config**: 2 minutes
- **Deploy Frontend**: 8 minutes
- **Connect & Test**: 10 minutes

**Total**: ~35 minutes

---

## ✅ Success Criteria

Your deployment is successful when:

- ✅ No errors in browser console
- ✅ Can register and login
- ✅ Can add items to cart
- ✅ Admin dashboard works
- ✅ Images load correctly
- ✅ No CORS errors

---

**Good luck! You've got this! 🚀**

**Need help?** Check [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed troubleshooting.
