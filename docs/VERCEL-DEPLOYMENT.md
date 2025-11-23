# Vercel Deployment Guide

## Prerequisites

- GitHub account
- Vercel account (sign up at https://vercel.com)
- Repository pushed to GitHub

## Step 1: Link Repository to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Select your GitHub repository
4. Click **"Import"**

### Option B: Via CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Link project (run from project root)
vercel link
```

## Step 2: Configure Environment Variables

### Required Variables

Copy these from your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://vtnlrnjpmjajujjuchnm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

### Add to Vercel Dashboard

1. In your project settings, go to **Settings** → **Environment Variables**
2. Add each variable:
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: `https://vtnlrnjpmjajujjuchnm.supabase.co`
   - **Environment**: Select all (Production, Preview, Development)
   - Click **"Save"**
3. Repeat for:
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### Add via CLI (Alternative)

```bash
# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
```

## Step 3: Deploy

### Option A: Auto-deploy (Recommended)

- Push to `main` branch → Auto-deploys to Production
- Push to `staging` branch → Auto-deploys to Preview
- Open PR → Creates Preview deployment

```bash
git add .
git commit -m "feat: initial deployment"
git push origin main
```

### Option B: Manual Deploy via CLI

```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel
```

## Step 4: Verify Deployment

1. **Check Build Logs**

   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on the latest deployment
   - Check "Building" and "Deployment" logs

2. **Test the App**

   - Visit the deployment URL (e.g., `https://your-app.vercel.app`)
   - Test login flow
   - Check if Supabase connection works

3. **Verify Cron Jobs**
   - Go to **Settings** → **Cron Jobs**
   - Ensure `/api/scheduler/tick` is listed
   - Check execution logs after 5 minutes

## Step 5: Configure Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Click **"Add"**
3. Enter your domain (e.g., `marketing-os.yourdomain.com`)
4. Follow DNS configuration instructions
5. Wait for SSL certificate provisioning (~5 minutes)

## Troubleshooting

### Build Fails

- Check build logs for errors
- Verify all dependencies are in `package.json`
- Ensure TypeScript compiles locally: `pnpm typecheck`

### Environment Variables Not Working

- Ensure variables are added to correct environment (Production/Preview)
- Redeploy after adding new variables
- Check variable names match exactly (case-sensitive)

### Supabase Connection Issues

- Verify Supabase URL and keys are correct
- Check Supabase project is not paused
- Test connection locally first

### Cron Jobs Not Running

- Cron jobs only work on Production deployments
- Check Vercel plan supports cron (Hobby plan: max 1 cron)
- Verify cron syntax in `vercel.json`

## Useful Commands

```bash
# View deployment logs
vercel logs <deployment-url>

# List all deployments
vercel ls

# Remove a deployment
vercel rm <deployment-url>

# Check project info
vercel inspect
```

## Next Steps After Deployment

1. ✅ Test authentication flow
2. ✅ Verify database connection
3. ✅ Check cron job execution
4. ✅ Monitor error logs in Vercel Dashboard
5. ✅ Set up custom domain (optional)
6. ✅ Configure staging environment
