# GitHub & Railway Secrets

## GitHub Actions secrets (for Deploy processor workflow)

Add these in **GitHub** → **Settings** → **Secrets and variables** → **Actions**:

| Secret name             | Where to get it                                                                 | Used by          |
|-------------------------|----------------------------------------------------------------------------------|------------------|
| `RAILWAY_TOKEN`         | Railway → your project → **Settings** → **Tokens** → **Create Project Token**   | `deploy-processor.yml` |
| `RAILWAY_SERVICE_ID`    | Railway → your **processor service** → **Settings** (or from the service URL). Required when the project has multiple services. | `deploy-processor.yml` |

---

## Railway service variables (processor runtime)

These are set in **Railway** → your processor service → **Variables**, not in GitHub.  
Use this as a checklist; values come from your `.env.railway` (or Railway dashboard).

| Variable                   | In .env.railway |
|---------------------------|-----------------|
| `R2_ACCOUNT_ID`           | ✓               |
| `R2_ENDPOINT`             | ✓               |
| `R2_BUCKET_NAME`          | ✓               |
| `R2_ACCESS_KEY_ID`        | ✓               |
| `R2_SECRET_ACCESS_KEY`    | ✓               |
| `API_KEY`                 | ✓               |
| `ALLOWED_ORIGINS`         | ✓               |
| `PORT`                    | ✓               |
| `DEFAULT_SEGMENT_DURATION`| ✓               |
| `OUTPUT_FORMAT`           | ✓               |
| `PROCESSING_QUALITY`      | ✓               |

Optional (not in your .env.railway): `PROCESSING_PRESET`, `TEMP_DIR`.

---

## Copy‑paste: variable names

### For GitHub Secrets (Actions)

Both are used by `deploy-processor.yml` (required if the project has multiple Railway services):

```
RAILWAY_TOKEN
RAILWAY_SERVICE_ID
```

### For Railway Variables (processor service)

Copy from your `.env.railway` into Railway → service → **Variables**:

```
R2_ACCOUNT_ID
R2_ENDPOINT
R2_BUCKET_NAME
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
API_KEY
ALLOWED_ORIGINS
PORT
DEFAULT_SEGMENT_DURATION
OUTPUT_FORMAT
PROCESSING_QUALITY
```
