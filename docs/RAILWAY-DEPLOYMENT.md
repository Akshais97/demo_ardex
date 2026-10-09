# Deploy the ARDEX demo on Railway

1. In Railway choose **New Project → Deploy from GitHub repo** and select `Akshais97/demo_ardex`, branch `main`. Allow Railway access to the repository if prompted.
2. Use the repository root (`/`). Railway detects the Dockerfile, builds the frontend, and runs the Node server. No custom build or start command is needed.
3. Add a **Volume** to the app service and mount it at `/data`. SQLite and its WAL files live here. Use one replica with this SQLite deployment.
4. Under **Settings → Networking → Public Networking**, click **Generate Domain**. Railway supplies `PORT` and `RAILWAY_PUBLIC_DOMAIN`; the app accepts that HTTPS origin automatically.
5. For a custom domain, set `PUBLIC_ORIGIN=https://your-domain.example` (no trailing slash). Apply changes and redeploy.
6. Open the generated domain for the app, `/admin.html` for administration, `/business-analytics.html` for analytics, and `/api/health` to verify the server.

The container uses Node 24, binds to `0.0.0.0:$PORT`, and stores its database in `/data`. The first start seeds fresh demo accounts and sample jobs; the laptop database is not uploaded. The Railway volume preserves changes across redeployments. Take backups before replacing or deleting the volume.

App and admin sessions use separate cookies on the same domain; keep the default browser referrer policy so API requests from `/admin.html` select the admin cookie. Cookies use HTTPS in production. Demo accounts and the prefilled demo password remain as documented in `LOGIN-DETAILS.md`; this deployment retains the existing demonstration access model.

For a local deployment check after `pnpm run build`, set `PORT=8080`, `HOST=127.0.0.1`, `PUBLIC_ORIGIN=http://127.0.0.1:8080`, and optionally `DATA_DIR` to a separate test directory, then run `npm start`. Use `NODE_ENV=production` only behind HTTPS for browser sign-in.
