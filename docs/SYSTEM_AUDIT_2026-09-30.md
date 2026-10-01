# Labora / Trade Match: full system audit

**Date:** 30 Sep 2026
**Repo:** `b16yes/laboraTradeMatch` (public), `master` @ `f566d20`
**Live site:** https://laboratradesmen.com (Firebase Hosting, project `laboratradesmen`)

## How this was audited

- **Live site.** The audit sandbox's network policy blocks `laboratradesmen.com`, `laboratradesmen.web.app` and `laboratradesmen.firebaseapp.com`, so the site was not loaded directly. Instead:
  - Firebase Hosting serves the committed `dist/` folder (`firebase.json` → `hosting.public: "dist"`).
  - A fresh `npx expo export -p web` of `master` produces a bundle **byte-identical** to the committed `dist/`: same content hash, `AppEntry-f947a025649f81a7cdb5e958c4aa3a22.js`.
  - So `dist/` is exactly what `master` deploys.
  - **Caveat:** we can't prove the live host was last deployed from `master`. Opening DevTools → Network on the live site and checking for that bundle filename would confirm it.
- **Code.** Every screen, component, service, context and config file was read. Every interactive element was classified by what it actually does.
- **Checks run:**
  - `npm ci`, `tsc --noEmit`, `expo export` and `npm audit`
  - functions ESLint (this is the Firebase predeploy hook)
  - string searches of the deployed bundle
  - a secrets sweep
  - GitHub branches, PRs, issues and Actions

Legend used throughout:

| Verdict | Meaning |
|---|---|
| **REAL** | Talks to a backend, network or device API and would work |
| **LOCAL** | Updates React state only; lost on reload |
| **MOCK** | Fake data, simulated success, or a hard-coded value |
| **STUB** | Only an `Alert`, a `console.log`, or a fake "success" label |
| **NO-OP** | The control has no handler |
| **BROKEN** | Throws, gets stuck, or can't work on web |

---

## TL;DR

1. **The live site is a clickable prototype with no backend.**
   - The deployed bundle contains **zero Firebase code**: 0 hits for `initializeApp`, `firestore.googleapis`, `identitytoolkit` or `AIza`.
   - Every visitor is "signed in" as the hard-coded mock user **Marcus Vance**.
   - All data is mock arrays in memory. Nothing a user does survives a page reload.
   - No element in the live app is REAL.
2. **Only 4 of 13 screens ship: Radar, Diary, Messages and Profile.** None of the features in the first commit's title are live:
   - escrow
   - QR / code sign-off
   - notifications
   - payments and subscriptions
   - registration
   - reviews
   - referrals and the lottery
   - the legal pages
3. **The live Profile tab shows fabricated trust signals to real visitors:**
   - "✓ ID VERIFIED" and "Passport & Driving License Verified"
   - "£5M Public Liability (Active)"
   - "48 Verified Jobs" and a 4.9 score
   - 5-star testimonials

   This is a consumer-protection risk for a UK marketplace (see §8).
4. **The live site has no Privacy Policy or Terms.** `web/privacy.html` and `web/terms.html` are never copied into `dist/`, so `/privacy.html` and `/terms.html` fall through to the app shell.
5. **The primary call to action on Radar, "Quick Apply ➔", does nothing.** It has no `onPress`.
6. **Visible bugs on the live site:**
   - Every sent chat message appears twice.
   - The Diary auto-availability switch doesn't visibly toggle.
   - Every `Alert.alert` is silent on web (react-native-web implements it as a no-op). Because of this, the Diary "Add booking" modal never closes after Save.
7. **A fresh clone can't build, and a full `firebase deploy` fails:**
   - `npm ci` fails: `react-leaflet@5` needs React 19, but the app pins 18.2. Leaflet isn't even used.
   - The functions lint fails, which aborts `firebase deploy`.
   - There is no CI and there are no tests.
8. **The unshipped code needs redesign before it goes live:**
   - Escrow "release" is a client-side string compare with a hard-coded master code `8942`.
   - Sign-off codes are 4-digit `Math.random()` values that are never stored.
   - Users could self-review.
   - Referral rewards are trivially farmable.
   - The referral "Lottery" needs legal review under the Gambling Act 2005.

---

## 1. What's live (the 4 shipped tabs)

`App.tsx` is the entry point (`expo/AppEntry.js`). It mounts a bottom-tab navigator with 4 tabs, has no stack navigator and no auth gate, and wraps only `AuthProvider` and `ChatProvider`.

`src/navigation/AppNavigator.tsx` is an unused duplicate. It has the unread-message badge that `App.tsx` lacks.

| Tab | What users see | Reality |
|---|---|---|
| **Radar** | "GPS Job Radar", "RADAR LIVE", 4 nearby jobs, radius chips, a Post Job form | Hard-coded `INITIAL_MOCK_JOBS`. No GPS. Radius filters a precomputed `distanceMiles`. Posting a job adds it to local state only. |
| **Diary** | Week view, bookings, "Automatically use my diary to set availability", manual booking form | In-memory `mockScheduleStore`. Locked to 18–24 Aug 2026 with no week navigation. Says "Mark Block as BUSY in Firestore", but nothing touches Firestore. |
| **Messages** | "Peer-to-peer live chat" with Dave Higgins and Elena Rostova | In-memory `mockMessages`. Nothing is sent anywhere, and the other party never replies. |
| **Profile** | Marcus Vance, verified badges, insurance, reviews, trade chips, availability switch | Every value is hard-coded inline in `ProfileScreen.tsx`. It doesn't even read `AuthContext`. |

Branding: the site says **"Trade Match"** (`<title>`, `app.json`). "Labora" appears nowhere in the live bundle.

## 2. Button and interaction inventory: live tabs

### Radar (`src/screens/RadarScreen.tsx`)

| Element | Line | Verdict | Notes |
|---|---|---|---|
| "+ Post Job" (header) | 162 | LOCAL | Opens the modal |
| "Within 5/10/15/25 mi" chips | 172–180 | MOCK | Filters hard-coded distances |
| **"Quick Apply ➔"** | 243 | **NO-OP** | No `onPress`. This is the core marketplace CTA. |
| "+ Post New Job" (FAB) | 252 | LOCAL | Opens the modal |
| Modal ✕ / Esc | 262 / 257 | LOCAL | |
| Title / Number Needed / Budget / Location / Description inputs | 269–325 | LOCAL | No validation. Negative numbers are accepted, so "£-500" is possible. |
| Trade chips (6) | 281 | LOCAL | "Roofer" and "General Contractor" exist in the type but aren't offered |
| "Broadcast to Local Radar" | 334 | LOCAL | Prepends to local state. Every job gets `distanceMiles: 1.5` and `urgency: 'Immediate'`. An empty title fails silently. |
| Trade filter | 108, 120 | Dead state | `selectedTrade` has no UI setter |

### Diary (`src/screens/DiaryScreen.tsx`)

| Element | Line | Verdict | Notes |
|---|---|---|---|
| "+ Manual Entry" / "+ Add Entry" | 119 / 222 | LOCAL | Opens the modal |
| **Auto-availability Switch** | 149–154 | **BROKEN** | `scheduleService.ts:143–150` mutates the settings object in place and returns the same reference, so `setSettings` doesn't re-render. The switch appears stuck. |
| MON–SUN day tiles | 188–196 | LOCAL | Fixed week, 18–24 Aug 2026 |
| Booking title, time, location and notes inputs | 285–339 | LOCAL | Times are free text ("25:99" is accepted, end-before-start is allowed) |
| Existing Work / Personal Time Off | 295 / 304 | LOCAL | |
| **"Mark Block as BUSY in Firestore"** | 347 | **MOCK + BROKEN (web)** | Saves to an in-memory array only. The modal only closes from the success `Alert`'s OK button, and `Alert` is a no-op on web, so the modal stays open. Empty-title validation is also silent. |

### Messages (`src/screens/MessagesScreen.tsx`, `ChatInput.tsx`, `ChatContext.tsx`)

| Element | Line | Verdict | Notes |
|---|---|---|---|
| Conversation chips | MessagesScreen 31–35 | LOCAL | The unread badge doesn't clear when a conversation is opened |
| 📷 attach | ChatInput 19 | NO-OP | |
| Message input | ChatInput 23 | LOCAL | Multiline with no submit, so Enter adds a newline on web |
| **➔ Send** | ChatInput 32 → ChatContext 34 | **MOCK + BUG** | **Every message shows twice.** `getMessages` returns the live `mockMessages[id]` array as state (ChatContext 28). `sendMessage` pushes into that array, then `setActiveMessages(prev => [...prev, newMsg])` appends it again (ChatContext 41). Also: `receiverName` is always "Dave Higgins", even in Elena's chat (firestoreService 159). |
| "ONLINE" badge | 68–71 | MOCK | Hard-coded presence |

### Profile (`src/screens/ProfileScreen.tsx`)

| Element | Line | Verdict | Notes |
|---|---|---|---|
| "Available for Instant Work" switch | 172 | LOCAL | Doesn't call `AuthContext.toggleAvailability`. No GPS despite the label. |
| "Sync with Digital Diary" switch | 189 | LOCAL | No calendar integration |
| 9 trade chips | 239 | LOCAL | Doesn't call `updateTrades` |
| License / Insurance inputs | 273 / 284 | LOCAL | There is no Save button |
| "+ Add Photo" | 298 | NO-OP | |
| Verification, insurance, rating and reviews (display) | 131, 130, 207–350 | **MOCK** | `isIdentityVerified = true` is hard-coded, as are the "48 Verified Jobs" and 5-star references |
| Sign in / sign out / edit profile | — | Missing | Nothing exists |

## 3. Built but not shipped (dead code)

None of these files are imported from `App.tsx`, and none of their text is in the deployed bundle.

| Screen / component | What it claims | Status | Blockers if you wire it up |
|---|---|---|---|
| `DashboardScreen` + `FilterModal`, `JobCard`, `JobRadarMap` | Radar feed with filters | Dead | Uses `useJobs()`, but no `JobsProvider` exists, so it gets an empty context. "💬 Chat" would throw (`navigation` is undefined). Category names don't match `TradeCategory`. |
| `PostJobScreen` + `jobService` | Post job to Firestore | Dead | In-memory `jobsDatabase`. Lat/lng are always central London. The success path relies on `Alert`. |
| `ChatScreen` + `CompletionCodeModal` | Escrow, 4-digit sign-off, Stripe payout | Dead | See §5. Escrow starts "Active" with nothing funded. Master code `8942`. `Alert`-only flow. |
| `ReviewScreen` | Mutual vetting | Dead | Ratings default to 5 and are never submitted. Stuck on web because of `Alert`. |
| `RegisterScreen` + `TermsScreen` / `PrivacyScreen` | Sign-up | Dead | No password field and no Firebase Auth. `setTimeout` then `Alert`. |
| `profilesetupmodal.js` | KYC / profile setup ("Labora") | Dead, **won't bundle** | Imports a non-existent `../../firebaseConfig` and an uninstalled `expo-image-picker`. Uses `storage`, which `config.ts` doesn't export. Uses `updateDoc` on a doc nothing creates. Would let the client set its own `kycStatus`. |
| `SubscriptionScreen` + `stripeEscrowService` | Stripe plans (£0 / £29 / £79) | Dead | No Stripe SDK and no network calls. Fake `cs_test_…` / `po_stripe_…` IDs. Defaults every user to "Pro". |
| `LotteryScreen` + `ProfileQRCode` + `referralService` | Referral QR and prize draw | Dead | The QR is a decorative dot grid that encodes nothing. "Copy Link" copies nothing. It links to `tradematch.app` (not our domain) with no `/invite` handler. There's a "⚡ Test: Simulate Friend Scanning" button in the UI. |
| `AvailabilityToggle`, `CalendarSyncPlaceholder`, `PortfolioGrid`, `RatingStars`, `ReferenceList`, `TradeSelector`, `Button`, `Card` | Reusable UI | Dead | `ProfileScreen` re-implements most of these inline |
| `AppNavigator.tsx` | Tab navigator with badges | Dead | Duplicates `App.tsx` |

There are **five conflicting mock datasets**: Radar, jobService, firestoreService, scheduleService and ProfileScreen. For example, `job-101` is posted by "Marcus Vance" in one and by "Liam Carter" in another; units are miles in one and km in another.

## 4. Connectors and integrations

| Integration | In code | Live? | Notes |
|---|---|---|---|
| **Firebase Auth** | `config.ts` inits it; `authService` imports but never uses `auth` | ❌ | The unused import is stripped at build time, so `config.ts` and the whole SDK are never bundled. There is no sign-in anywhere. |
| **Firestore** | Only `profilesetupmodal.js` (dead) writes `users/{uid}` | ❌ | Services named "Firestore…" are all in-memory arrays. |
| **Firebase config** | `EXPO_PUBLIC_FIREBASE_*` env vars, with a **fallback to a fake project `tradesman-app`** | ❌ | Doesn't match `.firebaserc` (`laboratradesmen`). If Firebase is wired up and built without `.env`, the site will point at a non-existent project. |
| **Cloud Storage** | `profilesetupmodal.js` (dead) | ❌ | `storage/rules.txt` is **not referenced in `firebase.json`**, so it has never been deployed |
| **Cloud Functions** | `functions/index.js` | ❌ | Unmodified template with **0 exported functions**. Lint fails (4 errors), which aborts `firebase deploy`. |
| **Stripe / Stripe Connect** | `stripeEscrowService.ts` | ❌ | No SDK, keys or HTTP. All IDs are fabricated. The Terms and Privacy text describe Stripe escrow as if it exists. |
| **GPS / expo-location** | Dependency only | ❌ | Never imported. "GPS Radar" is cosmetic. |
| **Maps (Leaflet / react-leaflet)** | Dependencies only | ❌ | Never imported, yet they **break `npm ci`** |
| **Push notifications (expo-notifications)** | Dependency only | ❌ | Never imported |
| **NFC (react-native-nfc-manager)** | Dependency + `app.json` plugin | ❌ | Never imported. Native-only. The committed `android/` predates the plugin, so it has no NFC permission. |
| **Calendar sync (Google / Apple / Outlook)** | `CalendarSyncPlaceholder` (dead) | ❌ | Sets `isSynced = true`. No OAuth. |
| **QR codes** | `ProfileQRCode` (dead) | ❌ | Fake static pattern. No QR library. |
| **Clipboard** | `ProfileQRCode` (dead) | ❌ | Not called |
| **Referral links** | `https://tradematch.app/invite?ref=<uid>` | ❌ | Wrong domain (ownership unverified). No route handler. Exposes raw user IDs. |
| **Images** | Unsplash hot-links | ✅ | Only live external dependency: profile and portfolio photos from `images.unsplash.com` |
| **EAS Build** | `eas.json` | ⚠️ | `projectId: "tradematch-app-build-id"` is a placeholder. The `development` profile needs `expo-dev-client`, which isn't installed. |

## 5. Backend and security

**Security rules**

| Area | Finding | Severity |
|---|---|---|
| `firestore.rules` | Only `/jobs/{id}` has a rule: `allow read, write: if request.auth != null`. Any signed-in user could edit or delete any job, including escrow status. Everything else is default-deny, so users, messages, schedules and reviews would all fail once wired. | High, when wired |
| Storage rules | Never deployed. The bucket's actual current rules are unverified; check them in the Firebase console. | Medium |

**Escrow and sign-off**

| Area | Finding | Severity |
|---|---|---|
| Release check (unshipped) | Release is a client-side string compare of two values the client supplies (`stripeEscrowService.ts:121`). | Critical, if shipped |
| Master code (unshipped) | `ChatScreen.tsx:98` falls back to `'8942'`, so anyone can "release" funds. | Critical, if shipped |
| Code generation (unshipped) | `Math.floor(1000 + Math.random()*9000)`: only 9,000 values, no attempt limit, never stored (despite "STORED IN FIRESTORE" in the UI). | Critical, if shipped |
| Payout tier (unshipped) | Always charged at "Pro" 3%. | Medium |

**Other unshipped features**

| Area | Finding | Severity |
|---|---|---|
| KYC (unshipped) | The client writes its own `kycStatus`, `canPostJobs` and `isTradesman`. | High, if shipped |
| Reviews (unshipped) | No reviewer identity, ratings default to 5, and `AuthContext.addReference` writes to the *current user's own* profile with a caller-supplied author name, so users could self-endorse. | High, if shipped |
| Referrals (unshipped) | No duplicate check, no self-referral check, no referrer-exists check; +1 ticket per call; all client-side; one global history shared by all users. | High, if shipped |

**Repo, secrets and Android**

| Area | Finding | Severity |
|---|---|---|
| Secrets | **None found** in tracked files or the bundle. The only key-like string is the mock fallback `AIzaSyMock…`. | OK |
| Repo visibility | **Public.** Fine as long as secrets stay in env / Secret Manager, but note that all business logic and plans are visible. | Info |
| Android signing | `android/app/build.gradle:135` signs **release** builds with the committed public `debug.keystore`. | High, before any Play upload |
| Android manifest | Requests `SYSTEM_ALERT_WINDOW`, `READ/WRITE_EXTERNAL_STORAGE` and `FOREGROUND_SERVICE`, none of which are used. | Low |

## 6. Build, deploy and CI

| Check | Result |
|---|---|
| `npm ci` (clean clone) | ❌ **ERESOLVE**: `react-leaflet@5.0.0` needs `react@^19`, and the app is on 18.2.0. It succeeds only with `--legacy-peer-deps`. The fix is to remove `leaflet` and `react-leaflet` (unused), or pin `react-leaflet@4.2.1`. |
| `tsc --noEmit` | ❌ 29 errors, of which 23 are real. 6 are caused by `tsconfig` pulling in `dist/`, because there's no `include`. Real causes: `TradeCategory` drift ('Electrical' vs 'Electrician'…, 18 errors), missing `JobListing` export (4) and missing `DashboardScreenProps` (1). |
| `expo export -p web` | ✅ Builds, and the output is byte-identical to the committed `dist/` |
| Functions lint (predeploy) | ❌ 4 errors, so `firebase deploy` aborts. `--only hosting` still works. |
| Functions runtime | `node: 24` is supported (GA) by the current firebase-tools |
| `npm audit --omit=dev` | 49 issues (1 critical, 13 high), mostly Expo CLI build tooling. None reach the browser bundle today. |
| Tests | None |
| CI / GitHub Actions | None |
| Native (`android/`) | Stale versus `app.json`: the NFC plugin was added after `android/` was generated. Because `android/` is committed, EAS won't re-run prebuild. |
| Assets | `favicon.png` and `splash.png` are **1×1 placeholders**, so the live favicon is blank. `icon.png` and `adaptive-icon.png` are 2.6 MB JPEGs named `.png`. |
| `index.html` | No meta description, Open Graph tags, `theme-color` or web manifest |
| `dist/` back-icon PNGs | Excluded by the `node_modules/` gitignore rule and hosting ignore. Low impact, since headers are hidden. |

## 7. GitHub

| Item | State |
|---|---|
| Branches | `master` only (plus this audit branch). **Not protected.** |
| Commits | 2 in total, both authored as the placeholder `Your Name <your-email@example.comb16>`. Fix with `git config --global user.name` / `user.email`. |
| PRs / Issues / Actions | 0 / 0 / 0 |
| Commit message vs code | f566d20 says "Fix web map view dependencies, storage rules, and UI updates", but there is no map view code and the storage rules aren't wired up. There may be uncommitted local work. |
| Committed build and cache artifacts | `.expo/` (its own README says not to commit it) and `dist/`. `.gitignore` is the Firebase template with no Expo entries. |
| Duplicated tooling | `.agents/skills/` and `.claude/skills/` hold the same 88 Firebase skill files twice (byte-identical) |

## 8. Legal and compliance flags

These need professional review. They describe the facts, not a legal ruling.

- **No privacy policy or terms on the live site.** You collect nothing yet, because there's no backend, but these must be live before sign-up ships.
- **Fabricated trust signals on the live Profile tab:** ID verified, £5M insurance, "48 Verified Jobs", and testimonials from named people. The DMCC Act 2024 made fake reviews a banned practice. Either remove these or clearly label the page as a demo.
- **The legal text describes features that don't exist:** Stripe Connect escrow, GPS collection, calendar sync, dispute evidence, strike/suspension and auto-renewing billing.
- **The legal pages have no identity details:** no company name or number, registered address, ICO registration, data controller or contact email. They're branded "Trade Match / tradematch.app".
- **UK GDPR gaps in the Privacy text:** no lawful basis per purpose, retention periods, data-subject rights, processor list, international-transfers section, or cookies/PECR section.
- **Referral "Lottery":** prizes (a £1,000 tool bundle) allocated by chance, where the only entry route is recruiting users. There's no free entry route, no closing date, no promoter details and no draw mechanism. Get advice under the Gambling Act 2005 and CAP Code §8 before launch.
- **Escrow wording:** "Holding funds in suspense" may bring in the Payment Services Regulations 2017 unless it's fully delegated to Stripe Connect.

## 9. Consolidated bug list

**Live** (these affect the site today):

| # | Where | Bug | Severity |
|---|---|---|---|
| L1 | ChatContext.tsx:28, :41 | Every sent message renders twice (duplicate React keys) | High |
| L2 | RadarScreen.tsx:243 | "Quick Apply" has no handler | High |
| L3 | DiaryScreen.tsx:63–66 + scheduleService.ts:143–150 | Auto-availability switch doesn't visibly toggle (same-reference state update) | Medium |
| L4 | DiaryScreen.tsx:88–92 | Booking modal never closes after Save on web (close only happens inside an `Alert`) | Medium |
| L5 | DiaryScreen.tsx:69–71; RadarScreen.tsx:127 | Validation fails silently on web | Medium |
| L6 | ProfileScreen.tsx:130–131, 207–350 | Fabricated verification, insurance and reviews shown as real | High (trust/legal) |
| L7 | dist/ | No `/privacy` or `/terms` | High (legal) |
| L8 | DiaryScreen.tsx:22–35 | Diary is locked to 18–24 Aug 2026 | Low |
| L9 | MessagesScreen / ChatContext:23 | Unread badge never clears on open | Low |
| L10 | RadarScreen.tsx:132–137 | Negative worker count or budget accepted; every posted job is "1.5 mi, Immediate" | Low |
| L11 | ChatInput.tsx:29 | Enter doesn't send on web | Low |
| L12 | assets/favicon.png | 1×1 placeholder favicon | Low |

**Latent** (in unshipped code; fix before wiring):
- the `8942` master code
- client-side escrow release
- `Math.random` codes
- `Alert`-only success paths (Register, Review, CompletionCode and Subscription all get stuck on web)
- the `Subscription` default tier of "Pro"
- the fee calculator's parsing and rounding ("1,500" is read as £1, and £42.5 isn't formatted as £42.50)
- the Lottery's "Need -1 more tickets"
- the hard-coded "August 2026 … 11 Days Left"
- `DashboardScreen` "Chat" throwing a `TypeError`
- `profilesetupmodal.js` breaking the bundle

## 10. Recommended plan

**Phase 0: live-site hygiene (hours)**
1. Remove the fabricated verification, insurance and review content from Profile, or add a clear "Demo" banner.
2. Publish the legal pages: move `web/*.html` → `public/` (Expo copies `public/` into `dist/`), fill in the entity and contact details, and remove claims about unbuilt features.
3. Fix L1 (chat duplicate), L3 (Diary switch) and L4/L5 (replace `Alert.alert` with an in-app toast/modal that works on web).
4. Either wire up or hide "Quick Apply".
5. Pick one brand (Labora vs Trade Match) across `app.json`, `<title>`, legal pages and referral URLs. Replace the placeholder favicon, splash and icon.

**Phase 1: make the repo buildable and safe (about a day)**
1. Remove `leaflet`, `react-leaflet` and `react-native-nfc-manager` (all unused) so that `npm ci` passes.
2. Fix the functions lint so `firebase deploy` works.
3. Add `include: ["App.tsx", "src"]` to `tsconfig.json` and fix the 23 type errors (the `TradeCategory` drift is the main one).
4. Add Expo entries to `.gitignore`. Untrack `.expo/`. Decide whether `dist/` stays committed; better to build in CI instead.
5. Add GitHub Actions for `npm ci`, `tsc` and `expo export`, and optionally a deploy-to-Hosting job on `master`. Protect `master`.
6. Fix the git author identity.
7. Delete the dead duplicates: `AppNavigator.tsx` or the tab setup in `App.tsx`, and the unused components or ProfileScreen's inline copies of them.

**Phase 2: make it real (the backend)**
1. Real Firebase Auth: an auth gate plus `RegisterScreen` with password or email-link sign-in. Fail the build if the `EXPO_PUBLIC_FIREBASE_*` env vars are missing, instead of falling back to the mock project.
2. Design the Firestore model (`users`, `jobs`, `applications`, `schedules`, `conversations/messages`, `reviews`) and write least-privilege rules with owner checks and field allow-lists. Add `storage` to `firebase.json`.
3. Replace the in-memory services with Firestore reads and writes. Add a stack navigator so Chat, PostJob and the other screens are reachable.

**Phase 3: money and trust (Cloud Functions)**
1. Stripe Connect onboarding, Checkout and PaymentIntents, all created server-side, plus webhooks.
2. Sign-off codes generated server-side with `crypto`, stored hashed, with expiry and attempt limits. Escrow release happens only in a Function after verification.
3. Reviews written only by a Function, tied to a completed job, one per party.
4. KYC fields writable only by the server or admins.

**Phase 4: compliance**
Legal review of the Terms and Privacy policy, the Lottery (or redesign it as a free prize draw with a free entry route and full T&Cs), escrow and payments wording, and ICO registration.

## Open questions for the owner

1. Was the live site deployed from `master`? (Check for bundle `AppEntry-f947a025…js` in DevTools.)
2. Is there uncommitted local work? The last commit message mentions a map view that isn't in the repo.
3. Which brand is canonical: **Labora** / laboratradesmen.com, or **Trade Match** / tradematch.app? Do you own `tradematch.app`?
