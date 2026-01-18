# Story Wise Processor

Video processing microservice for Story Wise. Uses FFmpeg for server-side video splitting.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `R2_ACCOUNT_ID` | Yes | Cloudflare R2 account ID |
| `R2_ENDPOINT` | Yes | R2 endpoint URL |
| `R2_BUCKET_NAME` | Yes | R2 bucket name |
| `R2_ACCESS_KEY_ID` | Yes | R2 access key |
| `R2_SECRET_ACCESS_KEY` | Yes | R2 secret key |
| `API_KEY` | No | API key for authentication |
| `ALLOWED_ORIGINS` | No | Comma-separated allowed origins |
| `PORT` | No | Server port (default: 3001) |

## Deployment

### Railway (Recommended)

1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Setup environment:
   ```bash
   cd apps/story-wise-processor
   cp .railway.env.example .railway.env
   # Edit .railway.env with your values
   ```
4. Create project and deploy:
   ```bash
   railway init
   railway up
   ```
5. Set environment variables from your .railway.env file:
   ```bash
   # Option A: Use the helper script
   ./scripts/set-railway-vars.sh

   # Option B: Set via Railway dashboard at https://railway.app

   # Option C: Set via CLI manually
   railway variables set R2_ACCOUNT_ID=xxx
   ```

**Note:** `.railway.env` is gitignored for security.

### Fly.io

1. Install Fly CLI: `brew install flyctl`
2. Login: `fly auth login`
3. Launch (first time):
   ```bash
   cd apps/story-wise-processor
   fly launch --no-deploy
   ```
4. Set secrets:
   ```bash
   fly secrets set R2_ACCOUNT_ID=xxx R2_ENDPOINT=xxx R2_BUCKET_NAME=xxx \
     R2_ACCESS_KEY_ID=xxx R2_SECRET_ACCESS_KEY=xxx \
     ALLOWED_ORIGINS=https://your-app.vercel.app API_KEY=your-secret-api-key
   ```
5. Deploy: `fly deploy`

### Render

1. Create a new Web Service
2. Connect your GitHub repo
3. Set:
   - Root Directory: `apps/story-wise-processor`
   - Runtime: Docker
4. Add environment variables in dashboard
5. Deploy

### Docker (Self-hosted)

```bash
cd apps/story-wise-processor

# Build
docker build -t story-wise-processor .

# Run
docker run -p 3001:3001 \
  -e R2_ACCOUNT_ID=xxx \
  -e R2_ENDPOINT=xxx \
  -e R2_BUCKET_NAME=xxx \
  -e R2_ACCESS_KEY_ID=xxx \
  -e R2_SECRET_ACCESS_KEY=xxx \
  -e ALLOWED_ORIGINS=https://your-app.vercel.app \
  -e API_KEY=your-secret-api-key \
  story-wise-processor
```

## API Endpoints

### Health Check
```
GET /health
```

### Process Video
```
POST /process
Authorization: Bearer <API_KEY>
Content-Type: application/json

{
  "sessionId": "uuid",
  "segmentDuration": 59,
  "outputFormat": "mp4",
  "quality": "medium"
}
```

### Get Download URL
```
GET /download/:sessionId/:segmentIndex
Authorization: Bearer <API_KEY>
```

## Local Development

```bash
cd apps/story-wise-processor
npm install
npm run dev
```
