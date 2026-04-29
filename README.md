# FanzPlay

FanzPlay is a **real-time trivia app** for phones, tablets, and web. Fans join a live game, pick a team, answer questions as an **Admin** runs the show, and see scores update live. The app includes **sponsor branding**, **marketing opt-in** for fans who want rewards, and **admin tools** to create sessions, manage questions, and export winner contact info as a spreadsheet.

**Who uses it**

| Role | What they do |
|------|----------------|
| **Fan** | Sign up, optionally opt in to marketing, join a team, enter the lobby, answer questions during the game, see results and claim rewards if they qualify. |
| **Admin** | Sign in with an admin account, create game sessions and questions, run **live control** (start questions, reveal answers, end the game), export reward claims as CSV. |
| **Sponsor** | Represented in the app by name, logo, and reward messaging; winners’ contact details go to organizers via the export flow (not a separate sponsor login in this app). |

**Tech stack (short version)**  
The app is built with **Expo** and **React Native** (one codebase for iOS, Android, and web). **Firebase** handles sign-in and the live database (**Firestore**). **EAS (Expo Application Services)** is used to build installable apps and host the web version.

---

## Table of contents

1. [What you need on your computer](#what-you-need-on-your-computer)
2. [Get the project from GitHub](#get-the-project-from-github)
3. [Open the project in a code editor](#open-the-project-in-a-code-editor)
4. [Install and run the app on your machine](#install-and-run-the-app-on-your-machine)
5. [Connect Firebase (required for real sign-in and data)](#connect-firebase-required-for-real-sign-in-and-data)
6. [Deploy with EAS (web and app builds)](#deploy-with-eas-web-and-app-builds)
7. [Publishing to the Apple App Store and Google Play](#publishing-to-the-apple-app-store-and-google-play)
8. [Useful commands](#useful-commands)
9. [Project layout (for curious readers)](#project-layout-for-curious-readers)

---

## What you need on your computer

You do **not** need a computer science degree. You do need:

1. **A computer** (Mac, Windows, or Linux).
2. **Node.js** (the “JavaScript runtime” the project uses).  
   - Download the **LTS** version from [https://nodejs.org](https://nodejs.org).  
   - Install it using the installer’s default options.  
   - After installing, you can check it worked: open **Terminal** (Mac) or **Command Prompt / PowerShell** (Windows) and type:
     ```bash
     node -v
     ```
     You should see a version number like `v20.x.x` or `v22.x.x`.
3. **Git** (to copy the project from GitHub), *or* use GitHub’s “Download ZIP” method below.  
   - Mac: Git is often already installed.  
   - Windows: install [Git for Windows](https://git-scm.com/download/win) if you plan to use `git clone`.

Optional but helpful:

- **A phone** with the **Expo Go** app if you want to preview on a real device without building a store app.
- For **submitting to Apple’s App Store**, you typically need a **Mac** and an **Apple Developer** account (paid yearly).

---

## Get the project from GitHub

**Option A — Download as a ZIP (easiest if you don’t know Git)**

1. Open the FanzPlay repository page on GitHub in your browser.
2. Click the green **Code** button.
3. Choose **Download ZIP**.
4. Unzip the folder somewhere you can find it (for example your **Documents** folder).
5. The folder name might be `FanzPlay-main` — you can rename it to `FanzPlay` if you like.

**Option B — Clone with Git (good if you will pull updates often)**

1. Open **Terminal** (Mac) or **Git Bash** / **PowerShell** (Windows).
2. Go to the folder where you keep projects, for example:
   ```bash
   cd Documents
   ```
3. Run (replace with your real repository URL if it’s a fork):
   ```bash
   git clone https://github.com/YOUR_ORG_OR_USER/FanzPlay.git
   cd FanzPlay
   ```

You now have a full copy of the code on your computer.

---

## Open the project in a code editor

A **code editor** is an app that shows the project files and lets you change them. Popular choices:

- **Visual Studio Code** (“VS Code”) — [https://code.visualstudio.com](https://code.visualstudio.com)
- **Cursor** — [https://cursor.com](https://cursor.com) (VS Code–like, with AI features)

**Steps**

1. Install the editor if you haven’t already.
2. Open the editor.
3. Use **File → Open Folder** (or **Open…**).
4. Select the **FanzPlay** folder (the one that contains `package.json` and a `src` folder).
5. You should see folders like `src`, `assets`, and `blueprint` in the sidebar.

You do **not** have to edit anything to run the app locally if you only want to try it—but you **do** need Firebase configuration (see below) for login and live data to work.

---

## Install and run the app on your machine

All commands below are run in **Terminal** (Mac) or **PowerShell / Command Prompt** (Windows). First, go into the project folder:

```bash
cd path/to/FanzPlay
```

(Replace `path/to/FanzPlay` with the real path, e.g. `cd ~/Documents/FanzPlay`.)

**1. Install dependencies** (downloads the libraries the app needs; only needed once per clone, or after big updates):

```bash
npm install
```

**2. Start the development server**

```bash
npm start
```

or:

```bash
npx expo start
```

**3. Choose how to open the app**

- Press **`w`** in the terminal to open the **web** version in your browser.
- Press **`i`** for **iOS simulator** (Mac + Xcode only).
- Press **`a`** for **Android emulator** (Android Studio setup required).
- Scan the **QR code** with the **Expo Go** app on your phone (same Wi‑Fi as the computer often helps).

**Stopping the server:** click in the terminal and press **Ctrl+C**.

---

## Connect Firebase (required for real sign-in and data)

The app talks to **Firebase** for accounts and the live game database.

1. In the project root, find **`.env.example`**.  
2. Make a copy named **`.env.local`** in the same folder.  
3. Open **`.env.local`** in your editor.  
4. Fill in the values from your Firebase project (**Project settings** in the [Firebase console](https://console.firebase.google.com)):  
   - `EXPO_PUBLIC_FIREBASE_API_KEY`  
   - `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`  
   - `EXPO_PUBLIC_FIREBASE_PROJECT_ID`  
   - `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`  
   - `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`  
   - `EXPO_PUBLIC_FIREBASE_APP_ID`  
   - `EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID` (if you use Analytics)

5. Deploy **Firestore rules** and **indexes** from this repo (`firestore.rules`, `firestore.indexes.json`) to your Firebase project so reads/writes match what the app expects.

Without these variables, the app may open but **login and game data will not work correctly**.

---

## Deploy with EAS (web and app builds)

**EAS** is Expo’s cloud service for **building** installable apps and **hosting** the web version. You need a free **Expo account**: [https://expo.dev](https://expo.dev).

**1. Install the EAS command-line tool** (one-time on your machine)

```bash
npm install -g eas-cli
```

**2. Log in**

```bash
eas login
```

**3. Link the project** (if this repo was freshly cloned and not yet linked on your machine)

```bash
eas init
```

Follow the prompts to connect to the correct Expo project (or create a new one). The app’s `app.json` may already reference an `extra.eas.projectId`—your team should use **one** canonical Expo project for production builds.

### Deploy the **website** (static web) to Expo Hosting

This publishes the web build so anyone can open it in a browser.

```bash
npx expo export --platform web
npx eas deploy --prod
```

- After it finishes, Expo prints a **Production URL** (often `https://YOUR_SLUG.expo.app`).  
- If changes don’t show up immediately, try a **hard refresh** or an **incognito/private** window (browsers cache aggressively).

### Build **Android** or **iOS** installers (for testers or stores)

These commands create `.apk` / `.aab` (Android) or an iOS build in the cloud—you do **not** need to own a Mac for the Android cloud build.

```bash
eas build --platform android --profile production
eas build --platform ios --profile production
```

- **`production`** profile is defined in **`eas.json`** and uses the **`production`** update channel.  
- The first time, EAS may ask you to create or upload **signing credentials**—follow the on-screen wizard.

### Push **JavaScript-only** updates to installed apps (optional)

If users already have a store build and you only changed JavaScript/assets (not native code), you can publish an over-the-air update:

```bash
eas update --channel production --message "Describe your change"
```

This only applies to builds that were produced with **EAS Update** configured and a matching **runtime version** policy (see `app.json` → `runtimeVersion` and `updates`).

---

## Publishing to the Apple App Store and Google Play

Store submission is a **separate** step from `eas build`. It involves **Apple** and **Google** developer accounts, store listings, and review. Below is a simplified checklist; exact screens change over time, so also read [Expo’s submit guide](https://docs.expo.dev/submit/introduction/).

### Before you start

| Requirement | Apple (iOS) | Google (Android) |
|-------------|-------------|------------------|
| Paid developer account | **Apple Developer Program** (annual fee) | **Google Play Console** (one-time registration fee) |
| Legal / business | App privacy details, support URL often required | Similar; content rating questionnaire |
| Computer | **Mac** recommended for local iOS tooling; EAS can still build iOS in the cloud | Any OS for building via EAS |

### Typical flow with EAS

**1. Build store-ready binaries**

```bash
eas build --platform ios --profile production
eas build --platform android --profile production
```

**2. Submit to the stores** (EAS can upload for you if credentials are set up)

```bash
eas submit --platform ios --latest
eas submit --platform android --latest
```

You can also download the build artifacts from the **Expo dashboard** and upload manually in **App Store Connect** or **Google Play Console**.

**3. In the store consoles**

- **Apple — App Store Connect**  
  - Create the app record, **bundle ID**, screenshots, description, privacy policy URL, age rating.  
  - Attach the build EAS uploaded (or upload via Transporter).  
  - Submit for **App Review**.

- **Google — Play Console**  
  - Create the app, complete the **store listing**, **content rating**, **target audience**, **privacy policy**.  
  - Upload the **AAB** (Android App Bundle), roll out to **internal testing** first if you want, then **production**.

**4. Wait for review**  
Apple and Google review times vary (often from hours to several days for the first release).

**5. After launch**  
For quick fixes that don’t need native changes, use **`eas update`** on the same **channel** your production app uses (see `eas.json`).

---

## Useful commands

| Command | What it does |
|---------|----------------|
| `npm install` | Install dependencies |
| `npm start` | Start Expo dev server |
| `npx expo export --platform web` | Build static files into `dist/` |
| `npx eas deploy --prod` | Upload `dist/` and promote to production web |
| `eas build --platform ios` | Cloud build for iOS |
| `eas build --platform android` | Cloud build for Android |
| `eas submit --platform ios --latest` | Submit latest iOS build to App Store Connect |
| `eas submit --platform android --latest` | Submit latest Android build to Play Console |
| `eas update --channel production` | Publish OTA update to production channel |
| `npm run lint` | Run ESLint (code quality) |

---

## Project layout (for curious readers)

| Path | Purpose |
|------|---------|
| `src/app/` | Screens and navigation (Expo Router) |
| `src/features/` | Feature code: auth, game, admin, teams, rewards |
| `src/components/` | Shared UI (buttons, layout, etc.) |
| `src/providers/` | App-wide state (auth, game session) |
| `src/api/` | Firebase initialization |
| `src/types/` | TypeScript types matching Firestore |
| `blueprint/` | Product and technical specifications |
| `firestore.rules` / `firestore.indexes.json` | Security rules and database indexes for Firebase |
| `eas.json` | EAS build profiles (development, preview, production) |
| `app.json` | Expo app name, icons, web output, EAS project id |

---

## Getting help

- **Expo documentation:** [https://docs.expo.dev](https://docs.expo.dev)  
- **EAS Build:** [https://docs.expo.dev/build/introduction/](https://docs.expo.dev/build/introduction/)  
- **EAS Submit:** [https://docs.expo.dev/submit/introduction/](https://docs.expo.dev/submit/introduction/)  
- **Firebase console:** [https://console.firebase.google.com](https://console.firebase.google.com)

If something fails, copy the **full error message** from the terminal—searching that text in Expo or Firebase docs usually leads to a fix.
