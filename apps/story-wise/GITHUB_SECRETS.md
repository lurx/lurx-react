# Environment Variables Configuration

This document lists all the environment variables needed for cloud video processing.

## For Vercel Deployments (Recommended)

Add these as environment variables in: **Vercel Dashboard → Your Project → Settings → Environment Variables**

You can set them for:
- **Production** - Live production environment
- **Preview** - Preview deployments (optional)
- **Development** - Local development (optional)

## For GitHub Actions CI/CD (Optional)

If you have GitHub Actions workflows that need these values, add them as: **GitHub Repository → Settings → Secrets and variables → Actions → New repository secret**

<!-- secret ak 469d554ee41d036a0681facd85cb27ac7f03860179059b61622375cb9a6fddfc -->

### Core R2 Configuration

| Secret Name | Description | Example |
|------------|-------------|---------|
| `R2_ACCOUNT_ID` | Your Cloudflare R2 Account ID | `abc123def456...` |
| `R2_ACCESS_KEY_ID` | R2 API Token Access Key ID | `abc123def456...` |
| `R2_SECRET_ACCESS_KEY` | R2 API Token Secret Access Key | `xyz789...` (keep this secret!) |
| `R2_BUCKET_NAME` | Name of your R2 bucket | `story-wise-videos` |
| `R2_ENDPOINT` | R2 endpoint URL | `https://abc123def456.r2.cloudflarestorage.com` |

### Optional Configuration

| Secret Name | Description | Default | Required |
|------------|-------------|---------|----------|
| `CLOUD_PROCESSING_ENABLED` | Enable cloud processing | `false` | No |
| `CLOUD_STORAGE_PROVIDER` | Storage provider | `r2` | No |
| `R2_PUBLIC_URL` | Custom public URL (if using custom domain) | - | No |
| `R2_FORCE_PATH_STYLE` | Force path-style URLs | `false` | No |
| `MAX_FILE_SIZE` | Maximum file size in bytes | `2147483648` (2GB) | No |
| `DEFAULT_SEGMENT_DURATION` | Default segment duration in seconds | `59` | No |
| `OUTPUT_FORMAT` | Output format | `mp4` | No |
| `PROCESSING_QUALITY` | Processing quality | `medium` | No |
| `GENERATE_THUMBNAILS` | Generate thumbnails | `false` | No |
| `SIGNED_URL_EXPIRATION` | Signed URL expiration in seconds | `3600` (1 hour) | No |
| `CLEANUP_DELETE_AFTER_DAYS` | Auto-delete files after days | `7` | No |
| `CLEANUP_INTERVAL_HOURS` | Cleanup job interval | `24` | No |

## How to Get R2 Credentials

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **R2** → **Manage R2 API Tokens**
3. Click **Create API Token**
4. Give it a name (e.g., "Story Wise Production")
5. Set permissions:
   - **Object Read & Write** (for uploading/reading files)
6. Copy the **Access Key ID** and **Secret Access Key** (you'll only see the secret once!)
7. Your **Account ID** is shown in the R2 overview page
8. Your **Endpoint** is typically: `https://<account-id>.r2.cloudflarestorage.com`

## Quick Setup for Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **story-wise** project
3. Go to **Settings** → **Environment Variables**
4. Add each variable below (click **Add New** for each)
5. Set the **Environment** (Production, Preview, Development)
6. Click **Save**

**Important:** After adding environment variables, you'll need to **redeploy** your project for them to take effect.

## Security Notes

- ⚠️ **Never commit** `.env` files or secrets to git
- ✅ The `.env.example` file is safe to commit (it has no real values)
- ✅ Use GitHub Secrets for CI/CD
- ✅ Use Vercel Environment Variables for production deployments
- ✅ Use local `.env.local` for development (gitignored)
