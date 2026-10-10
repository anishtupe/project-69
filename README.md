# InfludeAI

InfludeAI is a two-sided mobile marketplace for creators and brands. In the repo as it exists today, the implemented code is mostly a design system, auth state, Supabase client setup, and data hooks for creators, campaigns, applications, and messages. The app flow is not fully wired up yet, so the README below describes both the intended product and the actual working state of the codebase.

## What is in the repo right now

- Creator side: shared creator profile UI, creator cards, platform stats, and hooks for creator data.
- Brand side: brand/campaign data models and hooks for campaigns, applications, and saved creators.
- Shared app pieces: auth state, shared buttons/inputs/cards, and design tokens.
- Backend: Supabase client setup and React Query hooks.

The repo does not currently include a complete runnable app flow, route screens, or SQL migration files.

## Tech stack

From `package.json`:

- Expo `~57.0.11`
- Expo Router `~57.0.11`
- React Native `0.86.2`
- React `19.2.3`
- TypeScript `~6.0.3`
- NativeWind `^4.2.6`
- Tailwind CSS `^3.4.19`
- @supabase/supabase-js `^2.112.2`
- @tanstack/react-query `^5.101.4`
- zustand `^5.0.14`
- react-hook-form `^7.84.0`
- zod `^4.4.3`
- @react-native-async-storage/async-storage `2.2.0`
- expo-image-picker `^57.0.8`
- expo-secure-store `~57.0.1`
- expo-font `^57.0.1`
- expo-image `^57.0.2`
- react-native-paper `^5.15.3`
- react-native-reanimated `^4.5.3`
- react-native-safe-area-context `~5.7.0`
- react-native-screens `~4.26.0`
- react-native-svg `^15.15.5`
- react-native-url-polyfill `^4.0.0`
- victory-native `^41.26.0`
- @expo-google-fonts/dm-sans `^0.4.2`
- @expo-google-fonts/syne `^0.4.2`

## Prerequisites

- Node.js: use a supported React Native version. The installed React Native package declares support for Node `^20.19.4`, `^22.13.0`, `^24.3.0`, or `>=25.0.0`.
- npm or yarn: this repo includes `package-lock.json`, so `npm` is the default choice.
- Expo CLI or `npx expo`: no global install is required.
- Expo Go on a phone, or Android Studio/Xcode simulators for local testing.
- A Supabase project and account.

## Setup

1. Clone the repo

```bash
git clone <repo-url>
cd influde-ai
```

2. Install dependencies

```bash
npm install
```

If you want to respect the lockfile exactly:

```bash
npm ci
```

3. Create a Supabase project

Go to the Supabase dashboard and create a new project. Wait for it to finish provisioning before continuing.

4. Run the SQL schema

There is no SQL schema file or migration folder in this repo right now.

TODO: create a schema file such as `supabase/schema.sql` or `supabase/migrations/` and run it in the Supabase SQL Editor before the app can work against the database.

The hooks in `hooks/` reference tables such as:

- `profiles`
- `creators`
- `brands`
- `campaigns`
- `campaign_deliverables`
- `applications`
- `saved_creators`
- `conversations`
- `messages`

Those tables are expected by the code, but they are not created in the repository.

5. Enable Email auth in Supabase

In the Supabase dashboard:

- Open Authentication
- Go to Providers
- Enable Email
- Optionally enable email confirmation if your team wants that workflow

6. Create `.env` from `.env.example`

The repo already contains `.env.example`.

On macOS/Linux:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Then fill in the values:

```dotenv
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

What each variable means:

- `EXPO_PUBLIC_SUPABASE_URL`: project URL from the Supabase dashboard. Find it in Project Settings → API.
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`: public/anon key from Project Settings → API Keys. This is the key that should be exposed to the mobile app.

Important:

- Do not use the Supabase service role key in a mobile app.
- Do not commit `.env` to source control.
- The repo currently does not hide `.env` in `.gitignore`; that should be fixed before using a real project.

## Run the app

Use the script from `package.json`:

```bash
npm start
```

or directly:

```bash
npx expo start
```

To clear Metro cache when the app is acting stale:

```bash
npx expo start --clear
```

Open the app in one of these ways:

- iOS Simulator: open Xcode, start an iPhone simulator, then press `i` in the Expo terminal.
- Android Emulator: open Android Studio, start an emulator, then press `a` in the Expo terminal.
- Physical phone: install Expo Go, connect the phone and computer to the same network, then scan the QR code in the Expo terminal.

If the phone cannot access the local Metro server through LAN, use:

```bash
npx expo start --tunnel
```

## Folder structure

This is the real folder structure in the repo today:

```text
.
├── .claude/                 # local Claude project settings
├── .vscode/                # editor settings
├── assets/                 # app icons and splash assets
├── components/
│   ├── creator/            # creator cards, profile header, and platform data UI
│   └── shared/             # shared inputs, card, button, badge, and empty-state components
├── hooks/                  # Supabase + React Query hooks for auth, creators, campaigns, applications, and messages
├── lib/                    # Supabase client, design tokens, constants, types, and helpers
├── store/                  # Zustand auth state
├── .env.example            # sample env file
├── .gitignore              # git ignores
├── .npmrc                  # npm config
├── AGENTS.md               # agent instruction file
├── App.tsx                 # current Expo starter app
├── app.json                # Expo app config
├── babel.config.js         # Babel config
├── global.css              # NativeWind CSS entry
├── index.ts                # root app entry that registers App.tsx
├── metro.config.js         # Metro + NativeWind config
├── package-lock.json       # lockfile
├── package.json            # project scripts and dependencies
├── tailwind.config.js     # Tailwind config
├── tsconfig.json           # TypeScript config
├── README.md               # project instructions
```

Note: there is no `app/` directory, and there is no `supabase/` folder.

## Main flow to test when the app is completed

This is the intended end-to-end flow, based on the code and data model:

1. Sign up as a Creator.
2. Finish creator onboarding and profile setup.
3. Sign up as a Brand.
4. Create a campaign.
5. As the Creator, find the brand campaign and apply.
6. Message between the creator and brand.

This flow is described by the models and hooks in the code, but it is not fully implemented in the current repo.

## Troubleshooting

### Expo / Metro

- If the app is stale or shows old code, run:

```bash
npx expo start --clear
```

- If the QR code does not show or Metro will not start, stop the server and restart it.
- If the app cannot connect on a physical device, try `--tunnel`.

### Environment variables

- If `EXPO_PUBLIC_SUPABASE_URL` or `EXPO_PUBLIC_SUPABASE_ANON_KEY` is undefined, check that `.env` exists at the repo root and the names match exactly.
- Restart the Expo server after editing `.env`.

### Supabase / RLS

- If you get missing table or permission errors, the schema has not been created yet.
- The code expects tables such as `profiles`, `creators`, `brands`, `campaigns`, `applications`, and `messages`.
- Do not use a service role key in the mobile app; use the anon key and configure proper row-level security.

### NativeWind / styling

- Ensure the project uses the NativeWind Babel plugin and Metro config.
- Check that `global.css` exists and is wired up in Metro.
- The starter app is not using NativeWind yet, so styling issues are expected until the real app entry is created.

### Fonts

- The project includes Google font packages, but there is no explicit font-loading setup in the current app entry.
- If the app does not show the expected typeface, add the font loading logic before using those custom fonts.

### Network on real devices

- Make sure the phone and computer are on the same network.
- Use `npx expo start --tunnel` if LAN discovery fails.
- Check that the firewall is not blocking Metro.

## Roadmap / not built yet

The following are not implemented in the repo today:

- AI features
- Live Razorpay payment flow
- Real social API integrations
- Full creator onboarding screens
- Full brand onboarding screens
- Complete campaign application flow
- Real messaging UI and app navigation
- SQL schema and RLS setup

## TODO notes

This repo is missing key pieces before it can run properly:

- no `supabase/` folder
- no SQL schema or migration file
- no `app/` router folder
- no complete sign-up/onboarding screens
- no real environment security handling in `.gitignore`

The README above is intentionally conservative and only documents what is actually present in the codebase.

## Getting Started

Follow these steps to set up and run Influde AI locally.

### 1. Configure Environment Variables

Copy the example environment file:

```powershell
Copy-Item .env.example .env
```

Open the `.env` file and add your Supabase project credentials. You can find them in your [Supabase Dashboard](https://supabase.com/dashboard) under **Project Settings → API**.

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace the placeholder values with your actual Supabase project URL and anon key.

### 2. Set Up the Database

1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Navigate to **SQL Editor**.
3. Open the `20261011000000_initial_schema.sql` file in the project.
4. Copy its contents and paste them into the SQL Editor.
5. Click **Run** to execute the migration.

This migration creates the required database tables, triggers, and Row Level Security (RLS) policies.

### 3. Install Dependencies and Start the App

Open PowerShell or a terminal and navigate to the project directory:

```powershell
cd C:\Users\tupea\OneDrive\Desktop\project69\influde-ai
```

Install the required dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npx expo start
```

### 4. Run the App

Once the Metro bundler starts, use one of the following options:

- **Physical device (Android/iOS):** Install Expo Go, then scan the QR code displayed in your terminal.
- **Android emulator:** Press `a` in the terminal to launch the app.
- **iOS simulator:** Press `i` to launch the simulator (requires macOS).

Make sure your physical device and computer are connected to the same Wi-Fi network when using Expo Go.

### Troubleshooting

- **Supabase connection errors:** Verify the project URL and anon key in `.env`.
- **Database errors:** Ensure the SQL migration ran successfully in the Supabase SQL Editor.
- **Dependency issues:** Run `npm install` again and restart Expo.
- **QR code connection issues:** Ensure both devices are on the same network. If needed, start Expo using `npx expo start --tunnel`.

**Note:** Never commit your `.env` file or expose secret keys in your repository. Ensure `.env` is listed in `.gitignore`.