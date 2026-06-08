# AmaniYield - Production Getting Started Guide

## 🎯 Quick Start for Production Deployment

This guide will help you get AmaniYield production-ready on Vercel in 15 minutes.

### Step 1: Prepare Your Project (5 minutes)

1. **Ensure GitHub Repository is Ready**
   ```bash
   git add .
   git commit -m "Production-ready setup"
   git push origin main
   ```

2. **Create a PostgreSQL Database**
   - Recommended: Railway, Supabase, or AWS RDS
   - Note your connection string: `postgresql://user:password@host:5432/dbname`

### Step 2: Deploy to Vercel (10 minutes)

#### Option A: Frontend Only (Easiest - Recommended)

```bash
# 1. Login to Vercel
npm install -g vercel
vercel login

# 2. Deploy frontend
cd frontend
vercel --prod
```

Then configure environment variables in Vercel Dashboard:
- Go to: Settings → Environment Variables
- Add: `NEXT_PUBLIC_API_URL`

#### Option B: Full Stack Deployment

```bash
# From root directory
vercel --prod
```

### Step 3: Configure Environment Variables (2 minutes)

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add these variables:

```
DATABASE_URL = your_postgresql_connection_string
JWT_SECRET = generate-random-string-32-chars
NEXT_PUBLIC_API_URL = https://your-backend.vercel.app
WEATHER_API_KEY = from openweathermap.org
```

### Step 4: Setup Database (2 minutes)

If deploying with database integration:

```bash
# Run migrations on production database
DATABASE_URL="your_prod_db_url" npm run db:migrate -w backend
```

### Step 5: Verify Deployment

1. Visit your Vercel URL
2. Test login functionality
3. Check backend health: `https://your-domain/api/health`
4. Monitor logs in Vercel Dashboard

---

## 🚨 Common Issues & Fixes

### Issue: 404 on API routes
**Fix**: Check `BACKEND_API_URL` environment variable is set correctly

### Issue: Database connection timeout
**Fix**: Verify DATABASE_URL and ensure database allows Vercel IPs

### Issue: Build fails
**Fix**: Run `npm run build` locally first to catch errors

---

## 📚 Full Documentation

- Full deployment guide: See [DEPLOYMENT.md](DEPLOYMENT.md)
- Environment setup: See [.env.example](.env.example)
- Deployment checklist: See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

## ✅ Your System is Now Production-Ready!

The following has been configured:

✓ Frontend: Next.js optimized for Vercel
✓ Backend: Express API ready for serverless or dedicated deployment
✓ Security: Production-grade security headers
✓ Database: Prisma ORM configured
✓ Deployment: vercel.json configured
✓ Environment: .env.example and .env.production templates
✓ Documentation: Complete deployment guides
✓ Scripts: Automated deployment scripts

---

**Next Action**: Follow Step 1-5 above to deploy your application!
