# Localhost URLs and admin logins

Started and checked on 2026-10-09. The app runs in background processes on this computer and is reachable at the addresses below. Use `127.0.0.1` consistently when following links and switching between the app and control panel.

## URLs

| Page / service | URL | Access |
| --- | --- | --- |
| Main application | http://127.0.0.1:5173/ | Presenter, Applicator, Homeowner or Dealer sign-in |
| Admin and Super Admin control panel | http://127.0.0.1:5175/admin.html | Select Admin or Super Admin |
| Interactive application user flows | http://127.0.0.1:5173/userflow.html | No login required |
| CRM / AI caller business analytics concept | http://127.0.0.1:5173/business-analytics.html | No login required; fictional sample data and proposed integrations |
| Backend health | http://127.0.0.1:5174/api/health | No login required; JSON service status |
| Existing sample Water Passport | http://127.0.0.1:5173/passport.html?token=7b068d99-dafb-47b9-b135-a1989e1dfad5 | Public verification for an existing demo record |

Public verification for another issued record uses `http://127.0.0.1:5173/passport.html?token=ISSUED_TOKEN`. A bare Passport URL without a valid token does not identify a record. The sample link above depends on retaining the existing local database and is a demonstration without an active commercial warranty.

## Admin credentials

Both accounts sign in at **http://127.0.0.1:5175/admin.html**.

| Role to select | Account ID | Password | Permissions |
| --- | --- | --- | --- |
| Admin | `admin` | `ArdexDemo!2026` | Job operations, certification, technical clearance, evidence assessment/redo, product corrections, support, invoice reconciliation, six checks, Passport issuance and voiding |
| Super Admin | `superadmin` | `ArdexDemo!2026` | Admin permissions plus catalog pack pricing, account enablement/disablement with session revocation, routing preview and proposed pilot settings |

Select the role card, keep the prefilled password or enter the password above, then click **Enter control panel**. No email or separate username field is required. Both credentials and authenticated admin API access were verified against the running service.

Admin and Super Admin on the same browser origin share their sign-in cookie. Use **Sign out** to switch, or separate browser profiles/private contexts to keep both signed in. App and admin use separate cookies, so Presenter and Admin can stay open together.

## Supporting application accounts

At **http://127.0.0.1:5173/**, select `presenter`, `applicator`, `homeowner` or `dealer`. All four source-default accounts use `ArdexDemo!2026`. Presenter is the easiest way to walk through the connected demonstration. Applicator onboarding, when requested, uses the simulated code `456123`; homeowner START/CLOSE codes are generated separately for each job.

See [all login and code details](docs/LOGIN-DETAILS.md).

## Open the same customer record

- Main app: `http://127.0.0.1:5173/?session=WORKSPACE_ID`
- Admin: `http://127.0.0.1:5175/admin.html?session=WORKSPACE_ID`

Use the workspace ID from the current app/control-panel link; it is different from the displayed `PRO-...` job code. **Inspect this record** and **Open connected phones** preserve this association.

## Restart and runtime notes

The backend listens on 5174, the main Vite server on 5173, and the admin Vite server on 5175. The current background launcher is Node running `scripts/start-demo.mjs`, with its process ID saved in `.runtime/localhost-demo.pid`. Logs are saved in `.runtime/localhost-demo.stdout.log` and `.runtime/localhost-demo.stderr.log`.

After stopping the current launcher, restart from a terminal:

```powershell
Set-Location G:\Demo_Ardex_Endura\ArdexEndura
npm run demo
```

Do not start another copy while these ports are occupied. A reboot stops the current processes; this setup does not install an auto-start service. Closing a foreground restart terminal also stops that run.

The current launch uses installed Node **24.15.0**; its built-in SQLite support and the running HTTP endpoints were checked successfully. The existing repository README specifies Node **26.7+** as its documented requirement; successful startup here is not a complete compatibility certification of Node 24.

Persistent demo records remain in `.runtime/ardex-demo.sqlite`. These addresses are local to this computer, not a public or phone-accessible deployment. CRM, real WhatsApp, email delivery and AI calling remain proposed integrations.
