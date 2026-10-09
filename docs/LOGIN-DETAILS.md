# All demo login details

Source-verified on 2026-10-08 against `src/ui/Auth.tsx`, `server/database.mjs`, `server/index.mjs`, `src/domain/profile.mjs` and `src/domain/kit.mjs`. These are the repository's deliberately shared demo credentials.

## Start and sign in

Run `npm run demo` from the repository root using Node 26.7+. Open the relevant URL, select the role, keep or enter its password, and click **Enter workspace** or **Enter control panel**. There is no email/username input in the UI: selecting the role supplies the account ID.

| Account ID | Display name | Password | Login URL | Access |
| --- | --- | --- | --- | --- |
| `presenter` | Pitch presenter | `ArdexDemo!2026` | http://127.0.0.1:5173 | Guided story, connected role actions, supervisor demonstration, checkpoints and demo clock |
| `applicator` | Ravi Kumar | `ArdexDemo!2026` | http://127.0.0.1:5173 | Assigned visits, own customers, diagnosis, quote, kit requests, scans, photos, confirmations and payment reporting |
| `homeowner` | Demo homeowner | `ArdexDemo!2026` | http://127.0.0.1:5173 | Enquiry replies, quote decisions, confirmation-code conversation, support, payment acknowledgement, rating and care preferences |
| `dealer` | Akshaya dealer | `ArdexDemo!2026` | http://127.0.0.1:5173 | Tagged dealer's kit readiness, shortages, replacement supply and invoice declaration |
| `admin` | Operations administrator | `ArdexDemo!2026` | http://127.0.0.1:5175/admin.html | Operational review, certification, technical decisions, corrections, evidence, issuance, voiding and reconciliation |
| `superadmin` | System owner | `ArdexDemo!2026` | http://127.0.0.1:5175/admin.html | Admin operations plus pack pricing, routing/pilot previews and account enablement/disablement |

The password is prefilled. The six accounts are seeded with `INSERT OR IGNORE`; the credentials above describe the source defaults. Existing accounts may be disabled in the persisted database. This documentation does not claim a live sign-in test of the current database.

## Other codes and identifiers

| Item | Value or how to obtain it | Meaning |
| --- | --- | --- |
| Applicator onboarding login code | `456123` | After account sign-in, choose **Send login code**, enter this simulated code, then **Complete onboarding**. Valid for five minutes of the demo clock after requesting it. Guided stories/checkpoints may already have onboarding completed. |
| Homeowner START code | Generated six-digit value in the current job's homeowner conversation | Created when the dealer marks the kit ready. Ravi enters it under **Homeowner start code** and selects **Confirm job start**. |
| Homeowner CLOSE code | Generated six-digit value in the current job's homeowner conversation | Requested by Ravi after the first five proof checks and start confirmation pass. Ravi enters it under **Homeowner closing code** and selects **Confirm handover**. |
| Stage challenge code | Generated for the next eligible stage | An in-frame photo challenge, not an account password. Valid for 15 demo minutes. |
| Ananya's sample phone | `DEMO-0001` | Terrace customer fixture; not a login or reachable phone number. |
| Meera's sample phone | `DEMO-0002` | Bathroom customer fixture; not a login or reachable phone number. |
| Applicator member ID | `app-ravi` | Assigned applicator identity within demo records. |
| Tagged dealer ID | `dealer-001` | Akshaya Building Supplies; not a separate login. |
| Public Passport token | Generated on issuance; use the issued record's verification link or PDF QR | Public record access without signing in; no fixed universal token. |

START/CLOSE codes expire after 30 demo minutes, are bound to the job and purpose, and cannot be reused after verification. The implementation allows five failed attempts per issued code, a one-minute resend cooldown, and three code requests within a rolling demo hour. Applicator and dealer responses redact homeowner START/CLOSE codes; read the code in the homeowner conversation. Never substitute `456123` for these generated codes.

## Sessions and switching roles

- Account sessions last eight real hours. App and admin use separate cookies (`ardex_app_auth` and `ardex_admin_auth`), allowing Presenter and Admin to remain open together.
- Different roles on the same app origin share its sign-in cookie. Use **Switch role** for sequential handoffs, or separate browser profiles/private contexts for simultaneous sessions.
- Preserve the same workspace using `http://127.0.0.1:5173/?session=WORKSPACE_ID`. The control link uses `http://127.0.0.1:5175/admin.html?session=WORKSPACE_ID`. The workspace ID is different from the visible `PRO-...` job code.
- Role selection in an Experience dropdown does not change permissions. Server-side grants enforce actions.
- A disabled account cannot sign in; disabling or enabling an account revokes its existing sessions. Super Admin cannot disable itself through the implemented control.
- There are no separate Ananya/Meera passwords: the homeowner account is shared in this prototype. Production identity/ownership isolation remains future work.

SQLite is local and has no separate database username/password in this implementation. No connected third-party service login is required for the implemented local demo. Do not use these known demo passwords as production credentials.

See [all user flows](user-flows/README.md).
