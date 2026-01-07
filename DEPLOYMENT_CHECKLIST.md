# 🚀 Quick Deployment Checklist

Use this checklist to ensure you don't miss any steps during deployment.

## Before Deployment

- [ ] Code is committed to GitHub
- [ ] `.env` files are in `.gitignore`
- [ ] MongoDB Atlas is accessible
- [ ] Razorpay credentials are ready

## Backend Deployment (Render)

- [ ] Created Web Service on Render
- [ ] Connected GitHub repository
- [ ] Set Root Directory to `Backend`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Added all environment variables:
  - [ ] JWT_KEY
  - [ ] EXPRESS_SESSION_SECRET
  - [ ] RAZORPAY_KEY_ID
  - [ ] RAZORPAY_KEY_SECRET
  - [ ] MONGODB_URI
  - [ ] NODE_ENV=production
  - [ ] PORT=3001
  - [ ] FRONTEND_URL (placeholder initially)
  - [ ] CORS_ORIGIN (placeholder initially)
- [ ] Deployment successful
- [ ] Copied backend URL: ****************\_\_\_****************

## Frontend Deployment (Vercel)

- [ ] Updated `Frontend-vite/.env.production` with Render backend URL
- [ ] Committed changes
- [ ] Created project on Vercel
- [ ] Set Root Directory to `Frontend-vite`
- [ ] Added environment variable:
  - [ ] VITE_API_URL=<your-render-url>
- [ ] Deployment successful
- [ ] Copied frontend URL: ****************\_\_\_****************

## Final Configuration

- [ ] Updated `FRONTEND_URL` in Render with Vercel URL
- [ ] Updated `CORS_ORIGIN` in Render with Vercel URL
- [ ] Backend redeployed automatically
- [ ] Waited 2-3 minutes for propagation

## Testing

- [ ] Frontend loads without errors
- [ ] Can register new user
- [ ] Can login as user
- [ ] Can view products
- [ ] Can add items to cart
- [ ] Can update cart
- [ ] Can remove from cart
- [ ] Can login as admin
- [ ] Can create new product
- [ ] Can edit product
- [ ] Can delete product
- [ ] Images display correctly
- [ ] No CORS errors in console
- [ ] Cookies are working
- [ ] Payment flow works (test mode)

## Browser Console Check

- [ ] No CORS errors
- [ ] No 404 errors
- [ ] No authentication errors
- [ ] Cookies are being set

## Optional (Production Ready)

- [ ] Generated new JWT_KEY
- [ ] Generated new EXPRESS_SESSION_SECRET
- [ ] Updated to Razorpay live keys (when ready)
- [ ] Set up custom domain
- [ ] Enabled HTTPS everywhere
- [ ] Set up MongoDB backup
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Set up analytics (Google Analytics, etc.)

## URLs for Reference

**Backend (Render)**: ******************\_\_\_******************

**Frontend (Vercel)**: ******************\_\_\_******************

**MongoDB Atlas**: https://cloud.mongodb.com

**Razorpay Dashboard**: https://dashboard.razorpay.com

## Common URLs to Test

After deployment, test these URLs:

1. Frontend Home: `https://your-app.vercel.app/`
2. Shop Page: `https://your-app.vercel.app/shop`
3. Admin Auth: `https://your-app.vercel.app/admin-auth`
4. Backend Health: `https://your-backend.onrender.com/`
5. Backend API: `https://your-backend.onrender.com/api/products`

## Troubleshooting

If something doesn't work:

1. Check Render logs
2. Check Vercel deployment logs
3. Check browser console
4. Verify environment variables
5. Wait 2-3 minutes and try again (Render free tier spins down)

## Notes

- Render free tier: First request may take 30-60 seconds (cold start)
- Vercel: Instant responses, excellent performance
- All CORS issues should be resolved with the updated configuration
- Cookies require HTTPS in production (both Render and Vercel provide this)

---

**Date Deployed**: **********\_\_\_**********

**Deployed By**: **********\_\_\_**********

**Status**: ⬜ Success / ⬜ Needs Review
