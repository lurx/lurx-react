# Vercel Environment Variables Setup

Quick guide for setting up environment variables in Vercel for cloud video processing.

## Steps

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your **story-wise** project

2. **Navigate to Environment Variables**
   - Click **Settings** → **Environment Variables**

3. **Add Required Variables**

   Add these one by one (click **Add New** for each):

   | Variable Name | Value | Environment |
   |--------------|-------|-------------|
   | `R2_ACCOUNT_ID` | Your Cloudflare R2 Account ID | Production, Preview |
   | `R2_ACCESS_KEY_ID` | Your R2 API Token Access Key ID | Production, Preview |
   | `R2_SECRET_ACCESS_KEY` | Your R2 API Token Secret Access Key | Production, Preview |
   | `R2_BUCKET_NAME` | Your R2 bucket name (e.g., `story-wise-videos`) | Production, Preview |
   | `R2_ENDPOINT` | `https://<account-id>.r2.cloudflarestorage.com` | Production, Preview |
   | `CLOUD_PROCESSING_ENABLED` | `true` | Production, Preview |

4. **Optional Variables** (with defaults)

   | Variable Name | Default Value | Description |
   |--------------|---------------|-------------|
   | `MAX_FILE_SIZE` | `2147483648` | Max file size in bytes (2GB) |
   | `DEFAULT_SEGMENT_DURATION` | `59` | Segment duration in seconds |
   | `OUTPUT_FORMAT` | `mp4` | Output format (`mp4` or `webm`) |
   | `PROCESSING_QUALITY` | `medium` | Quality preset (`high`, `medium`, `low`) |
   | `SIGNED_URL_EXPIRATION` | `3600` | Signed URL expiration in seconds |

5. **Redeploy**
   - After adding variables, go to **Deployments**
   - Click the **⋯** menu on the latest deployment
   - Select **Redeploy** (or push a new commit)

## Getting R2 Credentials

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **R2** → **Manage R2 API Tokens**
3. Click **Create API Token**
4. Name it (e.g., "Story Wise Production")
5. Set permissions: **Object Read & Write**
6. Copy:
   - **Access Key ID** → Use for `R2_ACCESS_KEY_ID`
   - **Secret Access Key** → Use for `R2_SECRET_ACCESS_KEY` (⚠️ shown only once!)
7. Find your **Account ID** in R2 Overview page → Use for `R2_ACCOUNT_ID`
8. Build endpoint: `https://<account-id>.r2.cloudflarestorage.com` → Use for `R2_ENDPOINT`

## Security Notes

- ✅ Environment variables in Vercel are encrypted
- ✅ They're only accessible in server-side code (API routes)
- ✅ Never commit `.env` files with real values
- ✅ Use different credentials for Production vs Preview if needed

## Testing

After setup, test by:
1. Deploying to Vercel
2. Checking the deployment logs for any errors
3. Testing video upload in your app
4. Verifying files appear in your R2 bucket
