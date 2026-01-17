# Local Development Setup

## Environment Variables

The `.env.local` file has been created in `apps/story-wise/`. Update it with your actual R2 credentials:

### Required Values to Update:

1. **R2_ACCOUNT_ID** - Your Cloudflare R2 Account ID
   - Find it in: Cloudflare Dashboard → R2 → Overview

2. **R2_ACCESS_KEY_ID** - Your R2 API Token Access Key ID
   - Get it from: Cloudflare Dashboard → R2 → Manage R2 API Tokens

3. **R2_SECRET_ACCESS_KEY** - Your R2 API Token Secret Access Key
   - Get it from the same place (shown only once when creating token)

4. **R2_BUCKET_NAME** - Your bucket name
   - Should be: `story-wise-videos` (or whatever you named it)

5. **R2_ENDPOINT** - Your R2 endpoint URL
   - Format: `https://<your-account-id>.r2.cloudflarestorage.com`
   - Replace `<your-account-id>` with your actual account ID

## Testing Locally

### Prerequisites:

1. **FFmpeg installed** (required for video processing)
   ```bash
   # macOS
   brew install ffmpeg

   # Linux
   sudo apt-get install ffmpeg

   # Windows
   # Download from https://ffmpeg.org/download.html
   ```

2. **Environment variables set** in `.env.local`

### Running the App:

```bash
# From project root
nx serve story-wise
```

The app will:
- Try cloud processing first (uploads to R2, processes on server)
- Fall back to client-side processing if cloud fails

### Testing Cloud Processing:

1. Make sure `CLOUD_PROCESSING_ENABLED=true` in `.env.local`
2. Start the dev server
3. Upload a video
4. Check your R2 bucket to see uploaded files

### Troubleshooting:

- **"Cloud processing is not enabled"** → Check `CLOUD_PROCESSING_ENABLED=true`
- **"R2 credentials are not configured"** → Check all R2_* variables are set
- **"FFmpeg is not installed"** → Install FFmpeg (see above)
- **Upload fails** → Check R2 credentials and bucket name

## File Locations:

- `.env.local` - Your local environment variables (gitignored)
- `.env.example` - Example file (safe to commit)
