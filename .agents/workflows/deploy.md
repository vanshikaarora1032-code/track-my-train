---
description: How to deploy the Track My Train project to Vercel
---

# Deploying to Vercel

Follow these steps to deploy your full-stack application to Vercel.

## 1. Push your code to GitHub
Make sure all your changes (including `vercel.json` and the `api/` folder) are committed and pushed to a GitHub repository.

## 2. Link to Vercel
1. Go to the [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New** > **Project**.
3. Import your GitHub repository.

## 3. Configure Project Settings
In the **Configure Project** screen, set the following:

- **Framework Preset**: Vite (should be auto-detected)
- **Root Directory**: `./` (Keep as root)

### Build and Output Settings
- **Build Command**: `npm run build` (Run from root, you might need a root `package.json` script)
- **Output Directory**: `client/dist`

## 4. Environment Variables
Add the following Environment Variables in the Vercel dashboard:

### Server Variables
- `RAPIDAPI_KEY`: Your RapidAPI Key
- `RAPIDAPI_HOST`: `real-time-pnr-status-api-for-indian-railways.p.rapidapi.com`
- `SUPABASE_URL`: Your Supabase URL
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Key
- `NODE_ENV`: `production`

### Client Variables
- `VITE_API_URL`: (Leave empty or set to your Vercel URL, e.g., `https://your-app.vercel.app`)
- `VITE_SUPABASE_URL`: Your Supabase URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key

## 5. Deploy
Click **Deploy**. Vercel will build your Vite frontend and host your Express backend as a Serverless Function.
