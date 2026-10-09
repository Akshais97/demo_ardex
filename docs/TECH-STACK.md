# Repository tech stack

Reviewed against the current source on 2026-10-08. Application: `ardex-pro-demo`, version `0.3.0`. Historical files under `release/` are packaged snapshots; this summary describes the current source.

| Layer | Technology | Use in this repository |
| --- | --- | --- |
| Frontend | React and React DOM 19.3.0 locked (`^19.2.0` declared) | Customer conversation, applicator phone, dealer interface, guided presentation, admin control room and public Passport page |
| Languages | TypeScript/TSX and JavaScript ES modules (`.mjs`) | Typed UI and adapters; shared business rules and Node service |
| Build and development | Vite 8.3.2; TypeScript `^5.9.3`; npm and `package-lock.json` | Development servers, API proxy, type checking and production bundles |
| Styling | Custom CSS in `src/ui/styles.css` | Responsive layouts and phone/conversation presentation; no declared component framework or Tailwind dependency |
| Backend | Node.js built-in `node:http` | Custom JSON HTTP API and server-side role checks; no Express dependency |
| Database | SQLite via built-in `node:sqlite` / `DatabaseSync` | Local `.runtime/ardex-demo.sqlite`; workspaces, users, sessions, pack registry, settings and audit records; WAL mode |
| Authentication | `node:crypto`, scrypt password hashes, random session tokens | Eight-hour sessions; SHA-256 token hashes in SQLite; HTTP-only, SameSite=Strict cookies; six demo roles |
| Browser persistence | IndexedDB and localStorage | Active workspace selection in IndexedDB; pending scan/photo outbox in localStorage |
| Synchronization | Fetch API and periodic polling | Workspace polling every 1.5 seconds; admin summaries every 2.5 seconds; command IDs and revision checks protect retries |
| QR scanning | `@zxing/browser` `^0.2.1` | Browser camera decoding of sample product labels |
| QR generation | `qrcode` `^1.5.4` | Sample stickers and completion-record verification QR codes |
| PDF export | `jspdf` `^4.2.1`, `jspdf-autotable` `^5.0.8` | Quote and Water Passport downloads |
| Device APIs | Browser camera/media and geolocation APIs | Live JPEG capture and GPS, with explicitly labelled sample alternatives |
| Rules and configuration | Pure JavaScript domain modules and local JSON catalogs | Diagnosis, package eligibility, quantities, prices, curing, evidence, rewards and issuance gates |
| Verification | Node built-in test runner; custom browser check scripts | `npm test`, `npm run validate`, `npm run build`; browser scripts use Playwright (not declared in package.json) |

Caret ranges above are the declarations in `package.json`. The lockfile resolves React/React DOM to 19.3.0, TypeScript to 5.9.3, ZXing Browser to 0.2.1, jsPDF to 4.2.1, AutoTable to 5.0.8 and qrcode to 1.5.4. Vite is pinned and locked to 8.3.2. Browser check scripts reference Playwright through another developer's absolute runtime path, so they require local setup before they are portable.

## Runtime and entry points

The README requires Node **26.7+** for the built-in SQLite runtime. From the repository root:

```powershell
npm run demo
```

| Address | Purpose |
| --- | --- |
| http://127.0.0.1:5173 | Presenter, applicator, homeowner and dealer UI |
| http://127.0.0.1:5175/admin.html | Admin and Super Admin UI |
| http://127.0.0.1:5174/api/health | Node service health |
| http://127.0.0.1:5173/passport.html?token=ISSUED_TOKEN | Public completion-record verification |

Vite builds three HTML entry points: `index.html`, `admin.html` and `passport.html`. `npm run demo:preview` uses compiled frontend assets on 4173 and 5175. `node scripts/serve-release.mjs` is the compiled local fallback after stopping conflicting servers. `npm run dev` alone does not start the backend or admin server.

## Architecture and current boundaries

The React UI submits role-owned commands to the Node service. The service checks authentication and grants, runs domain rules, checks workspace revision/job identity, and saves state and audit history in SQLite. Event hashes and state digests support local integrity checks. Product consumption is shared across workspaces.

This is a connected local prototype. The chat is scripted and WhatsApp delivery is simulated; there is no connected language-model service. Product authentication uses a synthetic serial registry. Payments are reported or acknowledged by people, without a payment gateway. Care preferences are saved without a scheduler. Commercial warranty activation, ad-platform delivery, claims automation and production media storage are not connected. Catalog technical and commercial values are illustrative.

## Source references

- [Dependencies and commands](../package.json), [Vite configuration](../vite.config.ts), [TypeScript configuration](../tsconfig.json)
- [HTTP API and permissions](../server/index.mjs), [SQLite and accounts](../server/database.mjs)
- [Workspace synchronization and outbox](../src/adapters/useWorkspace.ts), [IndexedDB sessions](../src/adapters/session.mjs)
- [Domain rules](../src/domain/), [Catalog](../config/catalog.json), [Production handoff](../PRODUCTION-HANDOFF.md)
