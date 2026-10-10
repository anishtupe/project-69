# InfludeAI

InfludeAI is an Expo mobile app project for a two-sided creator and brand campaign marketplace. The intended roles are:

- **Creator:** create a creator profile, show social-platform statistics, find campaigns, apply, and message brands.
- **Brand:** create a brand profile, find and save creators, publish campaigns, review applications, and message creators.

The repository currently contains TypeScript types, Supabase data hooks for these records, shared UI components, and auth state code. **It does not currently contain the app screens or navigation for these flows.** The root `App.tsx` still displays the Expo starter screen, so the role capabilities above describe the intended product and supporting code, not a usable end-to-end app.

## Tech stack

These packages and versions/ranges are from `package.json`:

- Expo `~57.0.11`, Expo Router `~57.0.11`, React Native `0.86.2`, React `19.2.3`, TypeScript `~6.0.3`
- NativeWind `^4.2.6`, Tailwind CSS `^3.4.19`
- Supabase JS `^2.112.2`, React Native Async Storage `2.2.0`, React Native URL polyfill `^4.0.0`
- TanStack React Query `^5.101.4`, Zustand `^5.0.14`
- React Hook Form `^7.84.0`, `@hookform/resolvers` `^5.7.1`, Zod `^4.4.3`
- Expo Google Fonts: DM Sans `^0.4.2` and Syne `^0.4.2`
- Expo Font `^57.0.1`, Expo Image `^57.0.2`, Expo Image Picker `^57.0.8`, Expo Secure Store `~57.0.1`, Expo Status Bar `~57.0.1`
- React Native Gesture Handler `^3.1.0`, Reanimated `^4.5.3`, Safe Area Context `~5.7.0`, Screens `~4.26.0`, SVG `^15.15.5`
- React Native Paper `^5.15.3`, Victory Native `^41.26.0`
- Development dependencies: `@types/react` `~19.2.2` and TypeScript `~6.0.3`

Supabase is the configured backend client. There is no Razorpay package or integration in the current dependencies.

## Prerequisites

- **Node.js:** React Native `0.86.2` declares support for Node `^20.19.4`, `^22.13.0`, `^24.3.0`, or `>=25.0.0`. Use a supported LTS release such as Node `22.13.0+` or `24.3.0+`.
- **npm:** npm is recommended; the repository includes `package-lock.json`. Yarn can also install packages, but there is no Yarn lockfile.
- **Expo CLI:** no global install is needed; use the project CLI through `npx expo`.
- **To run the app:** install Expo Go on a compatible physical iOS or Android phone, or install Android Studio (Android emulator) / Xcode (iOS Simulator; macOS only).
- **Backend configuration:** a Supabase account and a Supabase project.

## Setup

1. **Clone the repository.** Replace `<repository-url>` with the Git URL for this project.

   ```sh
   git clone <repository-url>
   cd influde-ai
   ```

2. **Install dependencies.** Use npm to respect the committed lockfile.

   ```sh
   npm ci
   ```

3. **Create a Supabase project.** In the Supabase dashboard, create a project and wait for it to finish provisioning.

4. **Set up the database schema.** There is currently **no SQL schema or Supabase migrations in this repository**. The app's data hooks reference tables including `profiles`, `creators`, `brands`, `campaigns`, `campaign_deliverables`, `applications`, `saved_creators`, `conversations`, and `messages`; no script to create these tables, relationships, policies, or Realtime configuration is included.

   **TODO:** add and maintain the database setup under `supabase/schema.sql` (or as Supabase migrations under `supabase/migrations/`). Until that schema and its access policies exist, the app's Supabase data operations cannot be set up from this repository alone. When a schema is supplied, run it in the Supabase dashboard's **SQL Editor** against the new project, or use the Supabase CLI if the project is configured for it. Do not disable Row Level Security to work around missing policies.

5. **Enable Email authentication.** In the Supabase dashboard, open **Authentication → Sign In / Providers** (the dashboard may label this **Auth Providers**) and enable **Email**. Decide whether to require email confirmation; if enabled, new accounts must confirm their email before they can sign in.

6. **Create the local environment file.** `.env.example` is present in the repository. Copy it to `.env` from PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

   Set the values in `.env` using your Supabase project's dashboard. The file should contain:

   ```dotenv
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-project-anon-or-publishable-key
   ```

   - `EXPO_PUBLIC_SUPABASE_URL`: the project URL shown in **Project Settings → API** (or **Data API**).
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`: the project's client-side anon/public key shown in **Project Settings → API Keys**. Use only the public/anon key in a mobile app. **Never put a `service_role` or secret key in an `EXPO_PUBLIC_` variable.**

   Expo inlines `EXPO_PUBLIC_` variables into the client app; they are not private credentials. Database access must be protected with correctly configured Row Level Security policies. Also note: `.gitignore` currently does **not** ignore `.env`; do not commit your populated local file. **TODO:** add `.env` to `.gitignore`.

## Run

The scripts declared in `package.json` are `start`, `android`, `ios`, and `web`. Start Metro with:

```sh
npm start
```

This runs `expo start`. Alternatively, the platform scripts are:

```sh
npm run ios
npm run android
npm run web
```

To start using the CLI directly, as requested:

```sh
npx expo start
```

- **iOS Simulator:** with Xcode and an iOS simulator installed on macOS, press `i` in the Expo terminal, or run `npm run ios`.
- **Android emulator:** start an emulator in Android Studio, then press `a` in the Expo terminal, or run `npm run android`.
- **Physical phone with Expo Go:** install Expo Go, connect the phone and development computer to the same network, start Expo, then scan the QR code with Expo Go (Android) or the iPhone Camera app.
- If the phone cannot reach Metro on the local network, try tunnel mode:

  ```sh
  npx expo start --tunnel
  ```

- If Metro is serving stale bundles or assets, clear its cache:

  ```sh
  npx expo start --clear
  ```

**Current limitation:** starting the project loads the starter screen in `App.tsx`; there are no role-selection, sign-up, onboarding, campaign, application, or messaging screens to navigate to yet. See [Main flow status](#main-flow-status).

## Folder structure

These are the folders currently present in the repository (excluding generated dependencies and Git metadata):

```text
.
├── .claude/                 # Claude Code project settings
├── .vscode/                 # VS Code project metadata
│   └── .react/              # React tooling metadata
├── assets/                  # App icon, splash, and Android/web icon images
├── components/
│   ├── creator/             # Reusable creator cards, profile header, and platform stats
│   └── shared/              # Shared buttons, inputs, badges, cards, and other UI pieces
├── hooks/                   # Supabase/React Query auth, creator, campaign, application, and message hooks
├── lib/                     # Supabase client, types, constants, theme, and utilities
└── store/                   # Zustand authentication state
```

There is **no `app/` directory**, despite Expo Router being configured in `app.json` and `package.json`. Other root files include `App.tsx` (the current starter screen), `index.ts` (currently registers `App.tsx`), `app.json`, `package.json`, and the Babel, Metro, Tailwind, and TypeScript configuration files.

## Main flow status

The intended manual acceptance flow is:

1. Sign up with Email as a **Creator**.
2. Finish creator onboarding and save a profile.
3. Sign up with Email as a **Brand**.
4. Create and publish a campaign.
5. Return to the creator account, find the campaign, and apply.
6. Open the conversation and exchange messages between the two accounts.

**This flow cannot currently be completed or tested in the app.** The repository has no screens or routes for any of these steps, and it has no SQL schema/policies to create the backend tables the data hooks expect. `hooks/useAuth.ts` contains sign-up/sign-in functions, and other hooks contain campaign, application, and message operations, but they are not wired to a user-facing app flow here.

## Troubleshooting

- **Metro or Expo shows stale files:** stop the development server and restart with `npx expo start --clear`.
- **Environment variables are `undefined`:** check that `.env` is at the repository root, variable names exactly match `.env.example`, and values have no surrounding quotes or extra spaces. Restart Expo after changing `.env`; a reload alone may not refresh the bundle's environment.
- **Supabase reports missing tables, permission denied, or RLS errors:** this repository has no SQL schema or policies. Create the required schema and least-privilege policies before using these hooks. Do not disable RLS or use a service-role key in the mobile app.
- **NativeWind classes do not appear:** check that `babel.config.js` includes the NativeWind Babel plugin, `metro.config.js` wraps the Expo config with NativeWind and points to `global.css`, and the stylesheet is imported by the app entry. The current starter `App.tsx` does not import `global.css`, and there is no `app/` directory despite the Tailwind content path referring to it.
- **Custom fonts do not load:** the Google Font packages are installed and theme tokens name Syne/DM Sans, but this repository has no screen/root font-loading setup. Add Expo font loading before relying on those custom font family names.
- **A physical phone cannot connect:** confirm both devices are on the same Wi-Fi, allow the development server through the computer firewall, and use `npx expo start --tunnel` if LAN discovery is blocked.
- **The app opens to a starter screen or has no marketplace navigation:** this is the current state of the repository, not a Metro cache issue. `index.ts` registers `App.tsx`, which renders the Expo starter placeholder; route screens are not present.

## Roadmap / not implemented

- Creator and brand screens, role-based navigation, and onboarding.
- SQL schema, Supabase migrations, and Row Level Security policies.
- A complete, runnable campaign-to-application-to-messaging flow (the repository only has supporting hooks/types).
- AI features; none are implemented.
- Live Razorpay payments; there is no Razorpay package or payment implementation in the repository.
- Social account OAuth/API connections; platform names and data types exist, but no connection integration is implemented.
- Font-loading setup for the included Google Font packages.
#   p r o j e c t - 6 9  
 