# GitHub & Railway Secrets

## GitHub Actions secrets (for Deploy processor workflow)

Add these in **GitHub** → **Settings** → **Secrets and variables** → **Actions**:

| Secret name             | Where to get it                                                                 | Used by          |
|-------------------------|----------------------------------------------------------------------------------|------------------|
| `RAILWAY_TOKEN`         | **Project Token** from the Railway project that contains the processor (Railway → that project → **Settings** → **Tokens** → Create Project Token). If the token is from a different project, deploys will go to the wrong place or fail. | `deploy-processor.yml` |
| `RAILWAY_SERVICE_ID`    | Railway → the service that runs **story-wise-processor** → **Settings** (or from the service URL). In this project that service is named **"story-wise"**. | `deploy-processor.yml` |

**If CI deploys to the wrong place:** (1) Ensure `RAILWAY_TOKEN` is a **Project Token** from the same Railway project that contains the "story-wise" service. (2) Ensure `RAILWAY_SERVICE_ID` is that service’s ID (from its Settings or URL). (3) In the workflow run, check the `railway up --verbose` logs to see which project/service/environment is targeted.

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

Both are used by `deploy-processor.yml`. Target the service that runs the processor (named "story-wise" in this project):

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
