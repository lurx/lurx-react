# How to Create R2 API Tokens

You need to create R2 API tokens to get your `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY`.

## Steps

1. **Go to Cloudflare Dashboard**
   - Visit [dash.cloudflare.com](https://dash.cloudflare.com)
   - Make sure you're logged in

2. **Navigate to R2**
   - Click **R2** in the left sidebar
   - You should see your bucket "story-wise-videos"

3. **Create API Token**
   - Click **Manage R2 API Tokens** (usually in the top right or in a menu)
   - Or go directly to: [dash.cloudflare.com → R2 → Manage R2 API Tokens](https://dash.cloudflare.com/?to=/:account/r2/api-tokens)

4. **Create New Token**
   - Click **Create API Token** button
   - Give it a name: `Story Wise Production` (or any name you prefer)

5. **Set Permissions**
   - **Permissions:** Select **Object Read & Write**
   - **TTL:** Leave as "Never expire" (or set expiration if preferred)
   - **Allow listing:** You can enable this if you want to list bucket contents

6. **Create Token**
   - Click **Create API Token**
   - ⚠️ **IMPORTANT:** Copy both values immediately:
     - **Access Key ID** → This is your `R2_ACCESS_KEY_ID`
     - **Secret Access Key** → This is your `R2_SECRET_ACCESS_KEY`
   - ⚠️ **You won't be able to see the Secret Access Key again!** Save it securely.

7. **Get Your Account ID**
   - Your **Account ID** is shown in the R2 overview page
   - It's usually visible at the top of the R2 dashboard
   - Or in the URL: `https://dash.cloudflare.com/<account-id>/r2/...`

8. **Build Your Endpoint URL**
   - Format: `https://<account-id>.r2.cloudflarestorage.com`
   - Example: If your account ID is `abc123def456`, your endpoint is:
     `https://abc123def456.r2.cloudflarestorage.com`

## What You'll Have After This

✅ **R2_ACCOUNT_ID** - Your Cloudflare account ID
✅ **R2_ACCESS_KEY_ID** - From the API token you just created
✅ **R2_SECRET_ACCESS_KEY** - From the API token you just created
✅ **R2_BUCKET_NAME** - `story-wise-videos` (you already have this)
✅ **R2_ENDPOINT** - `https://<account-id>.r2.cloudflarestorage.com`

## Next Steps

After creating the tokens, add them to:
- **Vercel Environment Variables** (for deployment)
- **Local `.env.local` file** (for development)

See `VERCEL_ENV_SETUP.md` for instructions on adding them to Vercel.
