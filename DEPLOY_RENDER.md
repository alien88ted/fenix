# Render Deployment Guide for Fenix Wallet

## Prerequisites

Before deploying to Render, you need:

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **PostgreSQL Database**: You can use Render's PostgreSQL or an external service
3. **Privy Account**: Get your App ID and Secret from [privy.io](https://privy.io)

## Step-by-Step Deployment

### 1. Set Up Database

#### Option A: Use Render PostgreSQL
1. In Render Dashboard, click "New +" → "PostgreSQL"
2. Configure:
   - Name: `fenix-wallet-db`
   - Database: Leave default
   - User: Leave default
   - Region: Choose closest to your users
   - Instance Type: Free tier is fine for testing
3. Click "Create Database"
4. Copy the "Internal Database URL" for later

#### Option B: Use External Database (Supabase, Neon, etc.)
1. Create a PostgreSQL database on your preferred service
2. Get the connection string

### 2. Deploy the Application

1. **Connect GitHub Repository**
   - Go to Render Dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub account
   - Select your repository

2. **Configure Build Settings**
   - Name: `fenix-wallet`
   - Runtime: Node
   - Build Command: `npm ci && npx prisma generate && npm run build`
   - Start Command: `npm start`
   - Node Version: 20.18.1 (set in Environment Variables)
   - Auto-Deploy: Yes (optional)

3. **Set Environment Variables**
   
   Click "Advanced" and add these environment variables:

   ```
   DATABASE_URL=<your-postgresql-connection-string>
   NEXT_PUBLIC_PRIVY_APP_ID=<your-privy-app-id>
   PRIVY_APP_SECRET=<your-privy-app-secret>
   NEXTAUTH_URL=https://fenix-wallet.onrender.com
   NODE_ENV=production
   ```

   Optional variables:
   ```
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=<if-using-walletconnect>
   NEXT_PUBLIC_VERCEL_ANALYTICS_ID=<if-using-analytics>
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for the build to complete (5-10 minutes first time)

### 3. Initialize Database

After first deployment, you need to run migrations:

1. Go to your Render service dashboard
2. Click "Shell" tab
3. Run: `npx prisma migrate deploy`

### 4. Verify Deployment

1. Visit `https://your-app.onrender.com/api/health`
2. You should see a JSON response with health status
3. Visit your main app URL to test the application

## Common Issues and Solutions

### Issue: Build fails immediately / Deploy status 1 with no logs
**Solution**: 
- Ensure using `npm` (not `pnpm`) in render.yaml
- Check that `package-lock.json` is committed
- Verify all environment variables are set correctly
- Clear build cache and redeploy

### Issue: "Database connection failed"
**Solution**: 
- Verify DATABASE_URL is correct
- Ensure database allows connections from Render
- Check if migrations have been run

### Issue: "Privy authentication error"
**Solution**:
- Verify NEXT_PUBLIC_PRIVY_APP_ID and PRIVY_APP_SECRET
- Ensure Privy app is configured for your domain

### Issue: "Module not found" errors
**Solution**:
- Ensure all dependencies are in package.json
- Try using `npm ci` instead of `npm install`

### Issue: Build timeout
**Solution**:
- Render free tier has a 15-minute build limit
- Consider upgrading or optimizing build

## Performance Optimization

1. **Enable Build Caching**: Already configured in render.yaml
2. **Use Production Database**: Don't use SQLite in production
3. **Set up CDN**: Consider using Cloudflare for static assets
4. **Monitor Performance**: Use Render's metrics dashboard

## Security Checklist

- [ ] All environment variables are set
- [ ] Database has strong password
- [ ] NEXTAUTH_SECRET is randomly generated
- [ ] Privy credentials are kept secret
- [ ] HTTPS is enforced (automatic on Render)
- [ ] Rate limiting is configured
- [ ] CORS is properly configured

## Monitoring

1. **Health Check**: Render will ping `/api/health` every 30 seconds
2. **Logs**: Available in Render dashboard
3. **Metrics**: CPU, Memory, and Response time in dashboard
4. **Alerts**: Set up email alerts for failures

## Updating Your App

### Automatic Deploys (if enabled)
- Push to main branch
- Render automatically rebuilds and deploys

### Manual Deploy
1. Go to Render dashboard
2. Click "Manual Deploy"
3. Select "Clear build cache" if needed
4. Click "Deploy"

## Rollback

If deployment fails:
1. Go to Render dashboard
2. Click "Events" tab
3. Find previous successful deployment
4. Click "Rollback"

## Support

- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com
- Status Page: https://status.render.com