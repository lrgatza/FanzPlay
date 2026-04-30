# FanzPlay Database Handbook

This handbook describes Firestore data structures, access controls, operational procedures, and safe change management.

For deployment operations, see the [Deployment Runbook](./deployment-runbook.md). For user workflows, see the [User Handbook](./user-handbook.md). For architecture ownership and feature boundaries, see the [Codebase Handbook](./codebase-handbook.md).

## Datastore Overview

FanzPlay uses Firebase Firestore as the primary real-time datastore. Collection names are centralized in `src/constants/firestore.ts`.

Primary collections:

- `users`
- `game_sessions`
- `session_participants`
- `questions`
- `submissions`
- `teams`
- `sponsors`
- `rewards_claims`

## Collection Responsibilities

### `users`

- One document per authenticated user
- Stores role (`fan` or `admin`) and profile fields
- Security rules enforce owner-only updates and prevent changing `role` and `uid`

### `game_sessions`

- Session metadata and game state
- Contains status (`lobby`, `active`, `completed`) and current question tracking
- Readable by authenticated users; writable by admins

### `questions`

- Canonical question bank, including correct answer metadata
- Admin-only read/write by rule to protect answer keys

### `submissions`

- Fan answers for each session/question/user combination
- Compound document ID format: `{sessionId}_{questionId}_{uid}`
- Create allows only the owner; update allows owner changes only to scoring fields

### `teams`

- Team definitions and session-scoped score values
- Authenticated users can read
- Admins manage lifecycle; fans can update only `currentSessionScore` per rules

### `sponsors`

- Sponsor branding and reward messaging metadata
- Authenticated users can read; admins write

### `rewards_claims`

- Reward claim records tied to user and session
- Compound document ID format: `{uid}_{sessionId}`
- Claim creation requires caller marketing opt-in
- Admin updates restricted to status changes

## Data Lifecycle Flows

### Session Lifecycle

1. Admin creates session in `game_sessions`
2. Session progresses through lobby -> active -> completed
3. Fans join, answer, and generate `submissions`
4. Final session state drives results and reward eligibility

### Reward Lifecycle

1. Eligible fan creates `rewards_claims` record
2. Admin reviews and updates claim `status`
3. Admin exports reward data to CSV from app flow

## Security Rules Operations

Rules source: `firestore.rules`.

Operational requirements:

- Treat `firestore.rules` in repo as source of truth
- Deploy rule changes through controlled release windows
- Validate with test accounts (fan and admin) after deployment

High-impact rule behaviors to preserve:

- Admin-only write access to sensitive collections
- No direct fan access to question answer keys
- Compound ID integrity checks for submissions and claims
- Immutable identity/role fields in user documents

## Indexes Operations

Indexes source: `firestore.indexes.json`.

Current composite indexes support:

- `submissions` by `sessionId + uid`
- `submissions` by `sessionId + teamId`
- `game_sessions` by `status + createdAt`
- `rewards_claims` by `sessionId + createdAt`

When adding query patterns in code, update indexes in lockstep.

## Backup And Recovery Guidance

- Schedule regular Firestore exports in Firebase/GCP for disaster recovery
- Keep export retention aligned to compliance and event replay needs
- Periodically test restore procedures in non-production project
- Record backup job ownership and alerting in operations docs

## Change Management Checklist

Before any schema/rules/index change:

1. Document intended change and affected collections
2. Verify read/write impact for fan and admin personas
3. Validate corresponding app code changes
4. Deploy to non-production and test flows end-to-end
5. Roll out to production with monitoring window

After change:

1. Run auth + gameplay + reward smoke checks
2. Monitor error reports and support tickets
3. Update this handbook if behavior changed

## Operational Risks

- Rule drift between repo and deployed project
- Missing indexes causing production query failures
- Breaking role assumptions in user documents
- Uncoordinated app + rules deployments

Mitigation:

- Enforce PR review for rules/index changes
- Include Firestore validation in release checklist
- Keep shared test accounts for fan/admin verification

## Glossary

- **Firestore Rules**: Authorization and validation layer for document access
- **Composite Index**: Query accelerator required for multi-field filtering/sorting
- **Compound Document ID**: Deterministic ID built from multiple business keys
- **Rule Drift**: Deployed rules diverge from repository version
- **Data Lifecycle**: How records are created, updated, and finalized over time

## Ownership And Review Cadence

- **Owner**: Backend/data technical lead
- **Review cadence**: Monthly, plus mandatory review before schema/rules/index changes
- **Trigger updates**: New collections, new query patterns, role/access changes