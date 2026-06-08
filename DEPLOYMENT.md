# AmaniYield - Production Deployment Guide

## Deployment Architecture

AmaniYield is a full-stack application designed for production deployment on Vercel:

- **Frontend**: Next.js 16.2.4 deployed to Vercel
- **Backend**: Express.js API (can be deployed separately on Railway, Heroku, or as serverless functions)
- **Database**: PostgreSQL with Prisma ORM
- **Mobile**: React Native screens (separate deployment)

## Prerequisites

1. Vercel Account (https://vercel.com)
2. PostgreSQL database (e.g., from Railway, Supabase, or AWS RDS)
3. Environment variables configured
4. GitHub repository with your code

## Environment Variables

Create environment variables in your Vercel dashboard for production:

### Required Variables

```
# Database
DATABASE_URL=postgresql://user:password@host:5432/amani_yield

# Backend API (if deployed separately)
BACKEND_API_URL=https://your-backend-api.com

# JWT
JWT_SECRET=your_production_jwt_secret_key_change_this

# Frontend
NEXT_PUBLIC_API_URL=https://your-frontend.vercel.app
NEXT_PUBLIC_APP_NAME=AmaniYield

# External APIs
WEATHER_API_KEY=your_openweathermap_api_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890
```

## Deployment Steps

### Option 1: Deploy to Vercel (Recommended)

#### Frontend Only

1. Connect your GitHub repository to Vercel
2. Select the `frontend` directory as the root directory
3. Add environment variables in Vercel dashboard
4. Vercel will automatically build and deploy on every push to main

```bash
# CLI deployment
cd frontend
vercel deploy --prod
```

#### Full Stack with Backend on Vercel

1. Ensure `vercel.json` is in the root directory
2. Configure all required environment variables in Vercel
3. Deploy entire monorepo:

```bash
vercel deploy --prod
```

### Option 2: Deploy Backend Separately

If you prefer to keep backend separate (recommended for scalability):

**Backend Deployment (Railway/Heroku):**

```bash
cd backend
npm install
npm run build
npm start
```

Configure these environment variables on your backend platform:
- `DATABASE_URL`
- `JWT_SECRET`
- `WEATHER_API_KEY`
- `NODE_ENV=production`
- `PORT=3000`

**Frontend Configuration:**

Set `BACKEND_API_URL` to your backend deployment URL in Vercel environment variables.

## Database Setup

### Prisma Migrations

Before first deployment, run migrations on your production database:

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npx prisma migrate deploy --schema=database/schema.prisma
```

Or use Vercel's environment to run these during build:

```json
{
  "buildCommand": "cd backend && npm run prisma:generate && cd ../frontend && npm run build"
}
```

## Security Checklist

- [x] JWT_SECRET set to strong random value
- [x] DATABASE_URL uses environment variables (not hardcoded)
- [x] Content Security Policy headers configured
- [x] CORS properly configured for production domains
- [x] HTTPS enforced
- [x] Security headers added (X-Frame-Options, X-Content-Type-Options, etc.)
- [x] Environment variables not logged or exposed

## Performance Optimizations

1. **Image Optimization**: Next.js automatic image optimization enabled
2. **Code Splitting**: Automatic by Next.js
3. **Database Indexing**: Ensure proper indexes on frequently queried columns
4. **Caching**: Configure cache headers in next.config.mjs
5. **API Rate Limiting**: Implement in backend routes

## Monitoring & Logging

### Vercel Analytics

1. Enable Web Analytics in Vercel dashboard
2. Monitor performance metrics
3. Set up alerts for failures

### Logging

Configure structured logging in production:

```typescript
// Example: Backend
console.log(JSON.stringify({
  timestamp: new Date().toISOString(),
  level: 'info',
  message: 'Event description',
  userId: user.id
}));
```

## Database Backups

Set up automated backups:
- Railway: Automatic daily backups
- Supabase: Free daily backups
- AWS RDS: Configure backup retention policy

## Rollback Procedure

### Vercel Rollback

1. Go to Vercel Dashboard → Deployments
2. Find the previous stable deployment
3. Click "Promote to Production"

### Database Rollback

If migrations cause issues:
```bash
npx prisma migrate resolve --rolled-back MIGRATION_NAME
npx prisma migrate deploy
```

## Common Issues & Solutions

### Issue: API calls failing from frontend

**Solution**: 
- Verify `BACKEND_API_URL` environment variable is set
- Check CORS configuration in backend
- Verify authentication tokens are valid

### Issue: Database connection timeout

**Solution**:
- Check DATABASE_URL is correct
- Verify database is accessible from Vercel IPs
- Check connection pool settings

### Issue: Images not loading

**Solution**:
- Ensure image domains are whitelisted in next.config.mjs
- Check CDN/blob storage permissions

## Maintenance

### Regular Tasks

- Monitor error logs weekly
- Update dependencies monthly
- Review database performance
- Test backup restoration monthly

### Update Procedure

```bash
# Test locally
npm run dev

# Deploy to staging first if available
vercel deploy

# Deploy to production
vercel deploy --prod
```

## Support & Documentation

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs
- Express Docs: https://expressjs.com

## Contact

For deployment issues or questions, contact the development team.
