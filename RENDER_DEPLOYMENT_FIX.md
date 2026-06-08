# Render Deployment Fix Guide

## Problem Analysis

The build failure on Render was caused by:

1. **Missing `render.yaml` configuration** - Render needs explicit deployment configuration
2. **Incorrect build command path** - The deployment was looking for frontend in wrong location
3. **Missing environment variables** - Build-time variables not configured in Render dashboard

## Error Details from Render Log

```
npm error path /opt/render/project/src/frontend
npm error command failed
npm error command sh -c next build
error Command failed with exit code 1.
```

This error occurred because:

- Render couldn't find the proper build configuration
- Environment variables (NEXT_PUBLIC_API_URL) were not set
- The workspace structure wasn't properly recognized during build

## Solution 1: Add render.yaml (✅ COMPLETED)

A `render.yaml` file has been created at the project root with:

### Frontend Service Configuration

- Runtime: Node.js 20.9.0
- Build command: `npm install && npm run build --workspace=frontend`
- Start command: `npm start --workspace=frontend`
- Environment variables properly configured
- Auto-deploy: disabled (manual control recommended)

### Backend Service Configuration

- Runtime: Node.js 20.9.0
- Build command includes Prisma client generation
- Proper start command for Express server
- Database integration configured

### Database Configuration

- PostgreSQL database with automatic connection string injection
- Proper region settings

## Solution 2: Environment Variables Configuration

You MUST set these in Render Dashboard → Environment Variables:

### Frontend Variables

```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
NEXT_PUBLIC_APP_NAME=AmaniYield
BACKEND_API_URL=https://your-backend-url.onrender.com
```

### Backend Variables

```
NODE_ENV=production
DATABASE_URL=<auto-injected from database service>
JWT_SECRET=your-secure-random-key-32-chars-min
ALLOWED_ORIGINS=https://your-frontend-url.onrender.com
WEATHER_API_KEY=your-openweathermap-key
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890
LOG_LEVEL=info
```

## Deployment Steps

### Step 1: Connect GitHub Repository

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New+" → "Web Service"
3. Connect your GitHub repository
4. Select branch to deploy from

### Step 2: Configure Deployment

1. In the service configuration, select "Build and deploy from render.yaml"
2. Click "Create Web Service"
3. Render will automatically:
   - Detect `render.yaml`
   - Set up frontend and backend services
   - Create PostgreSQL database
   - Configure auto-scaling

### Step 3: Set Environment Variables

1. Go to each service's Settings → Environment
2. Add all required variables listed above
3. Make sure secrets use Render's secret management (set `sync: false` in render.yaml)

### Step 4: Deploy

1. Click "Deploy" in the web service dashboard
2. Monitor build logs in real-time
3. Check both frontend and backend service logs

## Key Differences from Vercel/Netlify

| Feature             | Vercel           | Render           |
| ------------------- | ---------------- | ---------------- |
| Config File         | `vercel.json`    | `render.yaml`    |
| Build Definition    | JSON             | YAML             |
| Workspace Support   | Limited          | Native           |
| Database            | Integration      | Service creation |
| Environment Secrets | Render dashboard | Render dashboard |

## Common Issues & Fixes

### Issue 1: "next is not recognized"

**Cause**: Dependencies not installed
**Fix**: Ensure `npm install` is in build command

### Issue 2: Environment variables undefined

**Cause**: Not set in Render dashboard
**Fix**: Set all `NEXT_PUBLIC_*` vars in Environment section

### Issue 3: Build timeout

**Cause**: Large dependency tree
**Fix**: Increase timeout in render.yaml if needed

### Issue 4: Database connection failed

**Cause**: DATABASE_URL not set
**Fix**: Render injects this automatically; verify in logs

## Testing Locally Before Deploy

```bash
# Install dependencies
npm install

# Build frontend only
npm run build --workspace=frontend

# Build backend only
npm run build --workspace=backend

# Run Prisma setup for backend
npm run prisma:generate -w backend
```

## Monitoring Deployment

1. **Frontend Service Logs**: Check for Next.js build errors
2. **Backend Service Logs**: Check for Express/database errors
3. **Database Logs**: Verify connection and migrations
4. **Render Events**: Check deployment timeline

## Rollback Procedure

If deployment fails:

1. Click "Cancel Deployment"
2. Fix the issue in code
3. Push to Git (if auto-deploy enabled)
4. Or manually click "Deploy" again

## Next Steps

1. Commit `render.yaml` to repository
2. Push to GitHub
3. Configure environment variables in Render dashboard
4. Trigger deployment from Render dashboard
5. Monitor logs for successful build and deployment

## Support Resources

- [Render Documentation](https://render.com/docs)
- [Render YAML Specification](https://render.com/docs/blueprint-spec)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Prisma Database Guide](https://www.prisma.io/docs/guides/database)

---

**Last Updated**: 2026-06-08
**Status**: Fix Plan Complete ✅
