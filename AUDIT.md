# InfludeAI Codebase & Security Audit

## Summary
No, this app is not healthy enough to build AI features on.
The project cannot bundle or run due to a broken Babel transformer (`react-native-worklets`), missing peer dependencies, and unresolved imports.
There is zero app navigation or screen UI (`app/` directory does not exist; only a default starter `App.tsx` is present).
The backend has no SQL schema, no database migrations, and no RLS policies in the repository, creating complete data exposure risks.
The foundational mobile shell, authentication lifecycles, and database layer must be stabilized before any AI features can be integrated.

---

## 1. Installation & Runtime Verification

- **`npm install`**: Succeeded (exit code 0), but flagged **38 security vulnerabilities** (12 moderate, 25 high, 1 critical) in the dependency tree.
- **`npx expo start` / `expo export`**: **FAILED (Fatal Crash)**. Metro bundler immediately crashes during Babel transformation with `Error: [BABEL]: Cannot find module 'react-native-worklets/plugin'`.
- **`expo-doctor` (2 failed checks)**:
  - Missing peer dependency `expo-constants` (required by `expo-router`).
  - Missing peer dependency `expo-linking` (required by `expo-router`).
  - Missing peer dependency `react-native-worklets` (required by `react-native-reanimated` v4).
  - Missing peer dependency `@shopify/react-native-skia` (required by `victory-native`).
  - Out of date and mismatched native packages (`react-native-gesture-handler` major mismatch: found `3.1.0`, expected `~2.32.0`).

---

## 2. TypeScript Compilation Errors (`tsc --noEmit`)

Found **7 TypeScript compilation errors** across **6 files**:

| File | Line & Column | Error Code | Description |
| :--- | :--- | :--- | :--- |
| `components/creator/CreatorCard.tsx` | Line 4, Col 40 | `TS2307` | Cannot find module `@expo/vector-icons` or its corresponding type declarations. |
| `components/creator/CreatorProfileHeader.tsx` | Line 3, Col 40 | `TS2307` | Cannot find module `@expo/vector-icons` or its corresponding type declarations. |
| `components/creator/PlatformStatRow.tsx` | Line 3, Col 40 | `TS2307` | Cannot find module `@expo/vector-icons` or its corresponding type declarations. |
| `components/shared/EmptyState.tsx` | Line 3, Col 40 | `TS2307` | Cannot find module `@expo/vector-icons` or its corresponding type declarations. |
| `components/shared/Input.tsx` | Line 11, Col 40 | `TS2307` | Cannot find module `@expo/vector-icons` or its corresponding type declarations. |
| `components/shared/ScreenHeader.tsx` | Line 4, Col 40 | `TS2307` | Cannot find module `@expo/vector-icons` or its corresponding type declarations. |
| `components/shared/ScreenHeader.tsx` | Line 6, Col 39 | `TS2305` | Module `'../../lib/theme'` has no exported member `'HEADER_HEIGHT'`. |

---

## 3. Routes & Navigation Audit

- **Files under `app/`**: **NONE**. The `app/` folder does not exist in this repository.
- **Entry Point**: `package.json` sets `"main": "index.ts"`, which mounts the default template `App.tsx` ("Open up App.tsx to start working on your app!"). Expo Router entry point (`expo-router/entry`) is completely unconfigured.
- **Route Status**:
  - `app/`: **MISSING** (0 screens implemented).
  - `App.tsx`: **STUB** (Default React Native boilerplate).
- **Broken Navigation Links / Unresolved Route Targets**:
  - `components/creator/CreatorCard.tsx:24`: `router.push('/(brand)/discovery/${creator.handle}')` points to a non-existent route (`/(brand)/discovery/[handle]`).
  - `components/shared/ScreenHeader.tsx:36`: `router.back()` will fail or do nothing as no navigation stack is mounted.

---

## 4. Data Layer & Mock Data Audit

- **Mock Data in Screens**: There are no route screens, so no mock screens exist.
- **Static / Hardcoded Data**:
  - `lib/constants.ts:5-159`: Static configuration tables for `NICHES`, `PLATFORMS`, `INDUSTRIES`, `OBJECTIVES`, `DELIVERABLE_TYPES`, `LANGUAGES`, `LOCATIONS`, `FOLLOWER_RANGES`, `GENDER_OPTIONS`, status labels, and heights.
  - `components/shared/Skeleton.tsx:61,69,91`: Hardcoded array loops (`[1, 2, 3]`, `[1, 2]`) for skeleton loading placeholders.
- **Supabase Integration**: Hooks in `hooks/` directly query Supabase tables, but all queries fail at runtime because the remote tables do not exist and no database migrations are provided.

---

## 5. Supabase Schema Comparison

**SQL Schema Status**: **0 SQL migration files or schema definitions exist in the repo.**

The codebase queries 10 database tables and 1 storage bucket that must be created:
1. `profiles` (`id`, `email`, `role`, `created_at`) — Queried in `hooks/useAuth.ts:37,58`.
2. `creators` (`id`, `user_id`, `handle`, `name`, `avatar`, `bio`, `is_verified`, `niches` (text[]), `location`, `languages` (text[]), `profile_strength`, `total_followers`, `avg_engagement_rate`, `avg_reach`, `posts_per_week`, `total_earned`, `rate_reel`, `rate_story`, `rate_post`, `rate_youtube_video`, `rate_tiktok`, `created_at`) — Queried in `hooks/useCreators.ts`.
3. `creator_platforms` (`id`, `creator_id`, `platform`, `handle`, `followers`, `engagement_rate`, `avg_reach`, `connected`, `created_at`) — Queried in `hooks/useCreators.ts:7`.
4. `creator_audience` (`id`, `creator_id`, `age_ranges` (jsonb), `gender_split` (jsonb), `top_cities` (jsonb), `updated_at`) — Queried in `hooks/useCreators.ts:8`.
5. `creator_posts` (`id`, `creator_id`, `platform`, `thumbnail`, `post_type`, `likes`, `comments`, `shares`, `saves`, `reach`, `engagement_rate`, `posted_at`, `created_at`) — Queried in `hooks/useCreators.ts:9`.
6. `creator_past_campaigns` (`id`, `creator_id`, `brand_name`, `brand_logo`, `campaign_name`, `deliverables`, `completed_at`, `rating`, `created_at`) — Queried in `hooks/useCreators.ts:10`.
7. `brands` (`id`, `user_id`, `name`, `logo`, `industry`, `website`, `description`, `total_campaigns`, `total_spend`, `created_at`) — Queried in `hooks/useCampaigns.ts:153`.
8. `campaigns` (`id`, `brand_id`, `name`, `objective`, `status`, `platforms` (text[]), `niches` (text[]), `budget_min`, `budget_max`, `target_age_min`, `target_age_max`, `target_gender`, `target_locations` (text[]), `target_languages` (text[]), `start_date`, `end_date`, `brief`, `dos` (text[]), `donts` (text[]), `applicant_count`, `created_at`) — Queried in `hooks/useCampaigns.ts`.
9. `campaign_deliverables` (`id`, `campaign_id`, `type`, `quantity`, `notes`, `created_at`) — Queried in `hooks/useCampaigns.ts:95`.
10. `applications` (`id`, `campaign_id`, `creator_id`, `pitch`, `proposed_rate`, `portfolio_links` (text[]), `status`, `applied_at`, `updated_at`) — Queried in `hooks/useApplications.ts`.
11. `saved_creators` (`id`, `brand_id`, `creator_id`, `created_at`) — Queried in `hooks/useCreators.ts:105,124,140`.
12. `conversations` (`id`, `brand_id`, `creator_id`, `campaign_id`, `last_message`, `last_message_at`, `created_at`) — Queried in `hooks/useMessages.ts:11,109,124`.
13. `messages` (`id`, `conversation_id`, `sender_id`, `sender_role`, `content`, `read`, `sent_at`) — Queried in `hooks/useMessages.ts:39,59,79,146`.
14. Storage Bucket: `avatars` bucket referenced in `lib/constants.ts:158`.

**Schema & PostgREST Relationship Mismatches**:
- `hooks/useCreators.ts:140`: Uses `creators(*, ...)` nested inside `saved_creators`. Requires foreign key `saved_creators.creator_id -> creators.id` (not `profiles.id`).
- `hooks/useApplications.ts:4`: Joins `campaigns(*, brands(*)), creators(*)`. Requires explicit foreign key constraints `applications.campaign_id -> campaigns.id`, `campaigns.brand_id -> brands.id`, and `applications.creator_id -> creators.id`.
- `hooks/useApplications.ts:73`: Updates `updated_at` manually, but database lacks an automatic `trigger` for `updated_at`.
- `hooks/useCampaigns.ts:95`: Inserts into `campaign_deliverables` in a secondary request without a transaction; if it fails, an orphaned campaign remains.

---

## 6. Row Level Security (RLS) & Security Vulnerabilities

Since no SQL schema exists, **zero RLS policies are defined**. If deployed naively:
1. **Brand Campaign Tampering**: Any authenticated user can modify or delete any brand's campaign via `useUpdateCampaign` (`hooks/useCampaigns.ts:120`) and `useDeleteCampaign` (`hooks/useCampaigns.ts:138`) because client-side updates only filter by `id`.
2. **Draft Campaign Leaks**: `useCampaigns` (`hooks/useCampaigns.ts:11`) allows filtering by `status`, but does not restrict drafts to the owning brand; any creator can query unpublished draft campaigns.
3. **Creator Profile Hijacking**: `useUpdateCreator` (`hooks/useCreators.ts:84`) updates `creators` by `id` without verifying `auth.uid() = user_id`.
4. **Application Rate & Pitch Leakage**: Creators can read competing creators' confidential pitches and proposed rates via `useApplications` (`hooks/useApplications.ts:10`).
5. **Unauthorized Status Escalation**: A creator can execute `useUpdateApplicationStatus` (`hooks/useApplications.ts:70`) to mark their own application as `'hired'`.
6. **Chat Eavesdropping**: Any user can query all messages or mark messages as read across arbitrary conversations (`hooks/useMessages.ts:57,145`).
7. **Realtime Broadcast Leak**: Realtime postgres changes (`hooks/useMessages.ts:31`) without RLS and `REPLICA IDENTITY FULL` will broadcast private chat payloads to unauthorized listeners.

---

## 7. Authentication & Onboarding Flow Audit

- **Signup Flaw**: `hooks/useAuth.ts:52-61` signs up via `supabase.auth.signUp`, then performs a client-side insert into `profiles`.
  - If Supabase email confirmation is enabled, `signUp` does not return an authenticated session; the subsequent insert into `profiles` will immediately fail under RLS.
  - Profile creation should be handled via a Postgres trigger on `auth.users` (`on auth.user_created`), not client-side.
- **Half-Onboarded Deadlock**:
  - `signUp` only writes to `profiles`. It does not create a row in `creators` or `brands`.
  - If a user signs up and closes the app before filling out setup forms, they are stuck in a zombie state on next login: `useAuth` loads their profile, but `useCreatorByUserId` / `useBrandByUserId` returns `null`.
  - There are no route guards, onboarding redirect middleware, or state checks to guide an un-onboarded user back to profile setup.

---

## 8. Secrets & Environment Configuration

- **Hardcoded Secrets**: No secret keys are hardcoded in source code (`lib/supabase.ts` properly uses `process.env.EXPO_PUBLIC_*`).
- **Critical `.gitignore` Flaw**:
  - `.gitignore:34` contains `.env*.local`.
  - **`.env` and `.env.production` are NOT ignored**.
  - Following the `README.md` instructions (`Copy-Item .env.example .env`) will cause git to track and commit `.env` with live Supabase credentials.

---

## 9. Realtime Messaging Audit

- **Cleanup Bug**: `hooks/useMessages.ts:49` calls `supabase.removeChannel(channel)` synchronously inside `useEffect` cleanup; `removeChannel` is async and returns a promise.
- **Missing Event Subscriptions**: `useMessages` only subscribes to `INSERT` events (`hooks/useMessages.ts:36`). Message updates (e.g. `read: true` via `useMarkMessagesRead`) will not update in realtime on the sender's screen.
- **Conversation List Stale**: `useConversations` (`hooks/useMessages.ts:5`) has no realtime subscription; incoming conversations or updated `last_message_at` timestamps will not show up until manual query invalidation or screen remount.
- **Supabase Realtime Publication**: Postgres Realtime will silently fail unless `messages` is added to the `supabase_realtime` publication in Supabase SQL.

---

## 10. Dead Code, Unused Components & TODOs

- **TODOs Remaining**:
  - `README.md:82`: `TODO: create a schema file such as supabase/schema.sql or supabase/migrations/...`
  - `README.md:275`: `## TODO notes... no app/ router folder, no complete sign-up/onboarding screens...`
- **Orphaned / Dead Components**:
  - `components/creator/*` (3 files) and `components/shared/*` (9 files) are completely unused across the app because there are no route screens.
  - `hooks/*` (5 files) and `store/authStore.ts` are completely unreferenced by the current entry point.
- **Code Duplication & Symbol Inconsistencies**:
  - `lib/constants.ts:155` exports `HEADER_HEIGHT = 56`.
  - `components/shared/ScreenHeader.tsx:6` attempts to import `HEADER_HEIGHT` from `../../lib/theme` (causing a TS compile error), then duplicates it locally as `const HEADER_H = 56` (line 9).
  - `lib/utils.ts:9` (`formatFollowers`) and `lib/utils.ts:33` (`formatNumber`) contain duplicate numerical shortening logic.

---

## 11. Dependencies & Package Configuration

- **Missing from `package.json` (Directly imported in code)**:
  - `@expo/vector-icons` (imported in 6 component files).
  - `react-native-worklets` (required by `react-native-reanimated` v4 Babel plugin).
  - `expo-constants` (required by `expo-router`).
  - `expo-linking` (required by `expo-router`).
  - `@shopify/react-native-skia` (required by `victory-native`).
- **Unused Installed Packages**:
  - `react-native-paper` (v5.15.3 — not imported anywhere).
  - `victory-native` (v41.26.0 — not imported anywhere).
  - `@hookform/resolvers`, `react-hook-form`, `zod` (installed but 0 forms implemented).
  - `@expo-google-fonts/dm-sans`, `@expo-google-fonts/syne` (installed but font loading via `useFonts` is never invoked).
- **Version Mismatches & Expo SDK Conflicts**:
  - `react-native-gesture-handler`: `3.1.0` installed; Expo SDK 57 requires `~2.32.0` (major mismatch).
  - `package.json` specifies `"typescript": "~6.0.3"` (invalid version).
  - `package.json` entry point is `"main": "index.ts"` instead of `"expo-router/entry"`.

---

## Categorized Action Items

### Critical (Blocks running or is a security hole)
1. `package.json`: Missing `@expo/vector-icons` and `react-native-worklets`.
   *Suggested fix: Run `npx expo install @expo/vector-icons react-native-worklets expo-constants expo-linking`.*
2. `package.json`: Major version mismatch on `react-native-gesture-handler` (`3.1.0` vs expected `~2.32.0`).
   *Suggested fix: Run `npx expo install --fix` to align all packages with Expo SDK 57.*
3. `package.json` & `index.ts`: Entry point points to starter `App.tsx` instead of Expo Router.
   *Suggested fix: Set `"main": "expo-router/entry"` in `package.json` and create the `app/` root layout.*
4. `.gitignore:34`: `.env` is not ignored and will be committed to git.
   *Suggested fix: Add `.env`, `.env.*`, and `.env.local` to `.gitignore`.*
5. Database: Missing SQL schema, migration files, and RLS policies.
   *Suggested fix: Create `supabase/migrations/001_initial_schema.sql` defining all 13 tables, foreign keys, triggers, and strict RLS policies.*
6. `hooks/useAuth.ts:56-60`: Client-side profile insertion fails on unconfirmed emails and bypasses database integrity.
   *Suggested fix: Replace client-side profile insert with a Supabase database trigger on `auth.users`.*

### Important (Will break once real users arrive)
1. `app/`: No routes exist for authentication, onboarding, creator feeds, campaign management, or messaging.
   *Suggested fix: Scaffold Expo Router route groups `app/(auth)/`, `app/(creator)/`, and `app/(brand)/`.*
2. `components/shared/ScreenHeader.tsx:6`: Invalid import of `HEADER_HEIGHT` from `../../lib/theme`.
   *Suggested fix: Import `HEADER_HEIGHT` from `../../lib/constants`.*
3. `hooks/useAuth.ts:44`: Half-onboarded users with missing creator/brand profiles get trapped without redirection.
   *Suggested fix: Implement auth state guard in `app/_layout.tsx` to force redirection to onboarding when role profile is missing.*
4. `hooks/useMessages.ts:31-50`: Realtime subscription only listens to `INSERT` and cleanup is unhandled asynchronously.
   *Suggested fix: Listen to `*` (or `INSERT` + `UPDATE`) on `messages` table and enable Supabase Realtime publication in SQL.*
5. `components/creator/CreatorCard.tsx:24`: Hardcoded push to `/(brand)/discovery/${creator.handle}` fails if route doesn't match structure.
   *Suggested fix: Ensure matching dynamic route `app/(brand)/discovery/[handle].tsx` exists.*
6. Font Loading: Google Fonts are defined in theme but never loaded at runtime.
   *Suggested fix: Add `useFonts` with `Syne_700Bold` and `DMSans_400Regular` in root `app/_layout.tsx` with a splash screen hold.*

### Minor
1. `lib/utils.ts:9,33`: Duplicate number formatting logic in `formatFollowers` and `formatNumber`.
   *Suggested fix: Consolidate `formatFollowers` and `formatNumber` into a single helper.*
2. `components/shared/ScreenHeader.tsx:9`: Redundant local `const HEADER_H = 56`.
   *Suggested fix: Remove local constant and use `HEADER_HEIGHT` from `lib/constants`.*
3. `package.json:37`: Non-existent TypeScript version `~6.0.3`.
   *Suggested fix: Change `"typescript"` devDependency to `^5.3.3` or `~5.3.0`.*
4. `package.json:24,31`: Unused dependencies `react-native-paper` and `victory-native` bloat bundle size.
   *Suggested fix: Uninstall unused dependencies or implement the corresponding UI/charts.*

---

## Ready for AI work?

**NO.**

The application cannot execute, lacks all navigation and screen infrastructure, and has no functional database or RLS security layer. Building AI features on top of this state will fail immediately.

### Exact list of prerequisites before starting AI development:
1. **Fix package dependencies**: Install `@expo/vector-icons`, `react-native-worklets`, `expo-constants`, `expo-linking`, and run `npx expo install --fix`.
2. **Configure Expo Router**: Switch `package.json` `"main"` to `"expo-router/entry"`, delete `App.tsx`, and build `app/_layout.tsx` with font loading (`Syne` and `DM Sans`).
3. **Fix `.gitignore`**: Add `.env` and `.env.*` to `.gitignore` to prevent credential leakage.
4. **Fix TypeScript bugs**: Fix `HEADER_HEIGHT` import in `components/shared/ScreenHeader.tsx`.
5. **Create & deploy Supabase SQL migrations**: Create tables (`profiles`, `creators`, `creator_platforms`, `creator_audience`, `creator_posts`, `creator_past_campaigns`, `brands`, `campaigns`, `campaign_deliverables`, `applications`, `saved_creators`, `conversations`, `messages`), setup `auth.users` trigger for automatic profile generation, and write comprehensive RLS policies.
6. **Implement Core Auth & Role Onboarding Screens**: Build `app/(auth)/login.tsx`, `app/(auth)/signup.tsx`, `app/(auth)/onboarding-creator.tsx`, and `app/(auth)/onboarding-brand.tsx` with role redirection guards.
7. **Implement Base Tab Shells**: Scaffold placeholder tabs for both Creator (`feed`, `applications`, `messages`, `profile`) and Brand (`discovery`, `campaigns`, `messages`, `profile`) so AI feature components have actual screens and routes to attach to.
