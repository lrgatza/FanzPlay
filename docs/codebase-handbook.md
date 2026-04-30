# FanzPlay Codebase Handbook

This handbook explains how the codebase is organized, where responsibilities live, and how to safely implement changes.

For deployment operations, see the [Deployment Runbook](./deployment-runbook.md). For datastore operations, see the [Database Handbook](./database-handbook.md). For non-technical app usage, see the [User Handbook](./user-handbook.md).

## Architecture Overview

FanzPlay is an Expo + React Native app using Expo Router and Firebase.

Core architecture rules:

- App code lives under `src/`
- Route files in `src/app/` are thin wrappers
- Business logic is grouped by feature in `src/features/`
- Shared providers live in `src/providers/`

## Top-Level Structure

- `src/app/`: Route entry points and navigation groups (`(auth)`, `(fan)`, `(admin)`)
- `src/features/`: Feature modules with components, hooks, and services
- `src/providers/`: App-level state providers (`AuthProvider`, `GameStateProvider`)
- `src/api/`: Firebase initialization and API wiring
- `src/constants/`: Shared constants (including Firestore collection names)
- `src/types/`: Shared TypeScript domain models

## Routing Pattern (Expo Router)

Route groups:

- `src/app/(auth)/`: Login/signup routes
- `src/app/(fan)/`: Fan gameplay routes (selection, lobby, question, waiting, results, reward claim)
- `src/app/(admin)/`: Admin routes (dashboard, session setup, live control)

`src/app/_layout.tsx` provides:

- Theme provider setup
- Auth-wrapped root
- Role-based route gating (fan/admin/auth redirects)

## Feature Module Ownership

### Auth (`src/features/auth`)

- Account lifecycle: login, signup, logout
- User profile updates (team selection, marketing opt-in)
- Works with `AuthProvider` to hydrate user role/state

### Game (`src/features/game`)

- Session subscriptions and real-time gameplay state
- Question presentation and response timing
- Results and session state transitions

### Admin (`src/features/admin`)

- Session setup and live control actions
- Question lifecycle controls (push/close/end)
- Reward export services for post-session operations

### Teams (`src/features/teams`)

- Team lookup and subscription helpers
- Team score updates and team metadata access

### Rewards (`src/features/rewards`)

- Reward claim submission and status-driven UX

## Providers And State Flow

### AuthProvider (`src/providers/AuthProvider.tsx`)

- Listens to Firebase auth state changes
- Fetches corresponding `users` document
- Exposes user, loading state, and auth actions through context

### GameStateProvider (`src/providers/GameStateProvider.tsx`)

- Subscribes to selected session in Firestore
- Subscribes to relevant team documents
- Exposes derived game state (current question, active status, correct option, etc.)

## Service Layer Conventions

Services should:

- Encapsulate Firebase calls and query logic
- Return typed data mapped to shared domain types
- Use real-time listeners (`onSnapshot`) for live state
- Keep UI components free of Firestore query details

## Implementation Rules For New Work

When adding or changing functionality:

1. Add/modify route wrappers only in `src/app/`
2. Put feature logic in the correct `src/features/<feature>` module
3. Keep Firestore collection names sourced from `src/constants/firestore.ts`
4. Reuse or extend provider context only for app-wide state
5. Update docs and tests/checklists when workflows change

## Quality Gates

Before merging:

- Run lint: `npm run lint`
- Ensure route wrappers remain thin and delegate to features
- Confirm admin/fan role flows still gate correctly
- Validate critical happy-path flows manually (auth, session, questions, rewards)

## Common Extension Scenarios

### Add A New Fan Screen

1. Create component in relevant feature module
2. Add thin route file in `src/app/(fan)/`
3. Connect service/hook layer, not direct inline Firestore calls

### Add A New Admin Action

1. Implement service behavior in `src/features/admin/services/`
2. Wire action UI in admin component
3. Validate role restrictions and resulting Firestore access

### Add A New Firestore Collection

1. Add constant key in `src/constants/firestore.ts`
2. Add/update typed models in `src/types/`
3. Implement service access layer
4. Update `firestore.rules` and `firestore.indexes.json` as needed
5. Document in [Database Handbook](./database-handbook.md)

## Glossary

- **Thin Route Wrapper**: Route file that imports/renders feature component only
- **Feature Module**: Domain-focused folder containing components/hooks/services
- **Provider**: React context boundary for app-level state and actions
- **Service Layer**: Functions that own Firebase read/write/subscription logic
- **Role Gatekeeping**: Route redirection and access behavior by user role

## Ownership And Review Cadence

- **Owner**: Technical lead for app architecture
- **Review cadence**: Quarterly and during any major refactor
- **Trigger updates**: New feature domains, routing changes, provider changes, or data-model shifts