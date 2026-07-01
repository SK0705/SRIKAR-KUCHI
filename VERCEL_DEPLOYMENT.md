# Vercel Deployment Guide

This project is now configured for deployment on Vercel. Follow these steps to deploy your portfolio.

## Prerequisites
- Node.js 18+ installed locally
- A GitHub, GitLab, or Bitbucket account with your code repository
- A Vercel account (create one at https://vercel.com)

## Deployment Steps

### Option 1: Deploy via Vercel CLI (Recommended for Testing)
1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Navigate to your project directory:
   ```bash
   cd your-project-folder
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Follow the prompts to connect your account and set project settings

### Option 2: Deploy via GitHub Integration (Recommended for Production)
1. Push your code to a GitHub repository
2. Go to https://vercel.com and click "New Project"
3. Import your GitHub repository
4. Configure project settings:
   - **Framework**: Vite
   - **Build Command**: `npm run build` (should be auto-detected)
   - **Output Directory**: `dist` (should be auto-detected)
   - **Install Command**: `npm install`
5. Click "Deploy"

Vercel will automatically redeploy whenever you push to the main branch.

## Project Configuration

The following files have been created to optimize Vercel deployment:

### `vercel.json`
- Specifies build command and output directory
- Configures routing for SPA (Single Page Application)
- Sets up caching for static assets
- Adds security headers (X-Content-Type-Options, X-Frame-Options, etc.)

### `.vercelignore`
- Excludes unnecessary files from deployment to reduce build time and size

### `.gitignore`
- Standard Node.js/frontend project ignore patterns

### `vite.config.js`
- Optimized Vite configuration for production builds
- Enables minification and terser compression
- Removes console logs in production

## Local Testing

To test your build locally before deploying:

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

If your project uses environment variables:

1. Create a `.env.local` file locally (not committed to git)
2. In Vercel dashboard, go to Settings → Environment Variables
3. Add your environment variables there

## Vercel Features You Can Now Use

- **Automatic HTTPS**: All deployments get HTTPS by default
- **Automatic Deployments**: Push to main branch to auto-deploy
- **Preview Deployments**: Every pull request gets a preview URL
- **Analytics**: Built-in Web Analytics available in dashboard
- **Monitoring**: Performance and error tracking
- **Custom Domain**: Add your custom domain in Project Settings

## Troubleshooting

### Build Fails
1. Check the build logs in Vercel dashboard
2. Ensure all dependencies are in package.json
3. Run `npm run build` locally to test

### Asset Not Found (404)
1. Verify asset paths are relative, not absolute
2. Check file names match exactly (case-sensitive on Vercel)
3. Ensure assets are in the dist folder after build

### Environment Variables Not Working
1. Verify variable names in code match Vercel settings
2. Redeploy after adding variables
3. Check variable values don't have quotes unless intended

## Next Steps

1. Commit these changes to your repository
2. Deploy using one of the methods above
3. Test all functionality on the production URL
4. Set up custom domain (if you have one)
5. Enable analytics and monitoring

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev)
- [Vercel CLI Documentation](https://vercel.com/cli)
