# Deployment Guide

## Vercel Deployment

### Quick Start
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign up/login
3. Click "New Project" and import your GitHub repository
4. Vercel will automatically detect it's a Next.js project and configure it

### Manual Setup Steps

#### 1. Connect to Vercel
```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to your account
vercel login

# Deploy from project root
vercel

# For production deployment
vercel --prod
```

#### 2. Configure Environment Variables
In your Vercel dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the following variables:

**Required:**
- `NODE_ENV` = `production`
- `NEXT_PUBLIC_SITE_URL` = `https://your-domain.vercel.app`

**Optional:**
- `NEXT_PUBLIC_ADSENSE_CLIENT_ID` = your AdSense client ID
- `NEXT_PUBLIC_GA_TRACKING_ID` = your Google Analytics ID

#### 3. Custom Domain (Optional)
1. In Vercel dashboard, go to project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Configure DNS records as shown

### Automatic Deployment
Once connected, Vercel will automatically:
- Deploy on every push to `main` branch
- Create preview deployments for pull requests
- Run build checks and tests
- Generate deployment URLs

### Build Settings
The project uses these build settings (configured in `vercel.json`):
- **Framework:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`
- **Development Command:** `npm run dev`

### Performance Optimizations
- Static generation for all pages
- Automatic image optimization
- CDN distribution
- Edge functions for API routes
- Gzip compression

### Monitoring
Monitor your deployments:
1. Vercel Dashboard - deployment logs and metrics
2. Vercel Analytics - performance insights
3. GitHub Actions - CI/CD pipeline status

### Rollback
To rollback to a previous deployment:
1. Go to Vercel dashboard
2. Select "Deployments" tab
3. Find the deployment you want to promote
4. Click "Promote to Production"

### Environment Branches
- `main` → Production deployment
- `develop` → Preview deployment
- Feature branches → Preview deployments

### Troubleshooting
- Check build logs in Vercel dashboard
- Verify environment variables are set
- Ensure all dependencies are in `package.json`
- Check for TypeScript errors: `npm run type-check`