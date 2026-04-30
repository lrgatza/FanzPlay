# FanzPlay Deployment Runbook

This runbook is a technical, operator-focused checklist for deploying FanzPlay web and mobile builds.

For user-facing procedures, see the [User Handbook](./user-handbook.md). For datastore and architecture internals, see the [Database Handbook](./database-handbook.md) and [Codebase Handbook](./codebase-handbook.md).

## Scope

- Deploy static web builds via Expo/EAS
- Build Android and iOS artifacts via EAS
- Validate production readiness with smoke checks
- Provide rollback actions for common deployment failures

## Required Access

- Git access to this repository
- Expo account with access to the linked EAS project
- Firebase project access for config/rules/index verification
- Local Node.js and npm installed
- EAS CLI installed globally

## Environment And Config Checklist

Before deploying, verify:

- `app.json` points to the intended Expo project ID and updates URL
- `eas.json` has the correct build profile/channel mapping
- `.env.local` is populated with Firebase public config values
- Firestore rules and indexes in repo match intended production state

## Standard Deployment Checklist

### 1) Prepare Local Workspace

```bash
git pull
npm install
npm run lint
```

If lint fails, fix issues before continuing.

### 2) Authenticate Tooling

```bash
eas login
```

If running on a new machine, also run:

```bash
eas init
```

### 3) Deploy Web (Production)

```bash
npx expo export --platform web
npx eas deploy --prod
```

Capture the output URL and deployment ID in release notes.

### 4) Build Mobile Artifacts (Production)

```bash
eas build --platform android --profile production
eas build --platform ios --profile production
```

Track build URLs/status in EAS dashboard until complete.

### 5) Optional Store Submission

```bash
eas submit --platform android --latest
eas submit --platform ios --latest
```

Use only when release is approved for store rollout.

## Post-Deployment Smoke Test Checklist

Perform in production web and at least one mobile build:

- Login works for both fan and admin test accounts
- Fan can see available session list
- Admin dashboard loads and opens session setup
- Live Control can push and close a question in test session
- Fan answer submission succeeds
- Session can be ended and results screen appears
- Reward claim can be created by eligible fan
- Admin CSV export completes

If any check fails, stop rollout and run rollback procedure.

## Rollback Procedures

### Web Rollback

Preferred fast path:

1. Re-deploy the previous known-good commit:
  ```bash
   git checkout <known-good-commit>
   npm install
   npx expo export --platform web
   npx eas deploy --prod
  ```
2. Verify critical smoke tests.

Then return local branch to normal development state.

### OTA Update Rollback (If Used)

If a bad `eas update` was shipped, publish a corrective update on the same channel:

```bash
eas update --channel production --message "Rollback to known-good behavior"
```

### Mobile Binary Rollback

You cannot instantly replace store binaries already downloaded by users. Use this sequence:

1. Halt active rollout in App Store Connect / Play Console if possible
2. Submit a fixed build with incremented version/build number
3. Communicate incident and workaround to support/admin teams

## Incident Quick Actions

### Web deploy succeeds but app is broken

- Confirm correct branch/commit was deployed
- Verify `.env`-backed Firebase values are valid in runtime
- Check Firestore rules/indexes for drift
- Roll back to last known-good commit if user impact is high

### Build fails in EAS

- Inspect build logs in EAS dashboard
- Validate profile used (`production`) and credentials status
- Re-run build once after fixing identified issue

### Auth or data failures after release

- Verify Firebase project target is correct
- Confirm `firestore.rules` and `firestore.indexes.json` are applied
- Validate admin/fan role behavior with test accounts

## Change Record Template

Record each deployment with:

- Date/time (UTC)
- Operator
- Commit SHA
- Target (`web`, `android`, `ios`)
- EAS link(s)
- Smoke test result
- Rollback needed (`yes/no`)
- Notes

## Glossary

- **EAS Build**: Cloud build pipeline for Android/iOS binaries
- **EAS Deploy**: Web hosting deployment for static export
- **Profile**: Build configuration in `eas.json` (development/preview/production)
- **Channel**: Release stream used for updates, such as `production`
- **Smoke Test**: Minimal high-value checks to confirm deployment health

## Ownership And Review Cadence

- **Owner**: Technical operations lead
- **Review cadence**: Monthly and before major releases/events
- **Trigger updates**: Any change to Expo config, EAS profiles, auth flow, or release process

