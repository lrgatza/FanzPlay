# FanzPlay Design Document

**Author:** [Your Name]  
**Date:** [Insert Date]  
**Project:** FanzPlay  
**Repository:** [https://github.com/lrgatza/FanzPlay](https://github.com/lrgatza/FanzPlay)

---

## Table of Contents
1. Purpose  
2. Architecture  
3. Code Repository  
4. Detailed Data Definitions  
5. Design Rationale and Major Decisions  
6. Developer Handoff Workflow  
7. References to Other Deliverables  
8. Future Considerations  

---

## 1. Purpose

The purpose of this design document is to help a developer quickly understand how FanzPlay is structured so they can maintain it, extend it, or reuse parts of it effectively. While implementation details are present in the codebase, the reasoning behind the architecture, the key data relationships, and the operational flow are not immediately obvious from code alone. This document serves as a tutorial-style guide for onboarding a new developer, including what the system does, how core modules interact, where critical logic lives, and what design decisions shaped the final product.

---

## 2. Architecture

### 2.1 System Overview
FanzPlay is a mobile-first interactive fan engagement platform built with React Native (Expo) and Firebase. It supports two user roles:
- **Admin:** Configures and runs live sessions (teams, questions, sponsors, rewards, exports).
- **Fan:** Joins sessions, picks a team, submits answers, sees results, and claims rewards.

### 2.2 Architecture Diagram (Insert in doc)
Use this as your final architecture figure.

```mermaid
flowchart LR
  A[Fan UI] --> B[Feature Screens + Hooks]
  C[Admin UI] --> B
  B --> D[Service Layer]
  D --> E[Firebase Auth]
  D --> F[Cloud Firestore]
  D --> G[CSV Export]

  subgraph Client App (Expo / React Native / TypeScript)
    A
    C
    B
    D
  end

  subgraph Firebase
    E
    F
  end
```

### 2.3 Architectural Notes
- UI components are organized by feature domain (`admin`, `game`, `rewards`).
- Services encapsulate Firestore reads/writes and business rules.
- Shared types keep app and data contracts aligned.
- Providers/hooks coordinate real-time gameplay state and navigation transitions.

---

## 3. Code Repository

### 3.1 Repository Access
- **GitHub:** [https://github.com/lrgatza/FanzPlay](https://github.com/lrgatza/FanzPlay)
- **Primary integration branch:** `main` (or current team standard)

### 3.2 Build and Run
Include the `README` from the repository in this section (or hyperlink it), specifically:
- prerequisites
- environment setup
- install/run commands
- deployment steps

### 3.3 Language and Module Mapping
- **TypeScript:** primary app logic and type definitions  
- **React Native + Expo:** mobile UI/runtime  
- **Firebase SDK:** authentication and database integration  

### 3.4 Major Module Structure
- `src/features/admin`: admin setup, live controls, exports  
- `src/features/game`: fan gameplay journey  
- `src/features/rewards`: reward claims and related flow  
- `src/providers`: shared session/game state providers  
- `src/types`: common data contracts  
- `src/constants`: shared config (Firestore collection names, theme constants)

---

## 4. Detailed Data Definitions

This section documents core Firestore collections and constraints.

### 4.1 `sessions`
Represents each game event/session.

Typical fields:
- `id`, `title`, `status`
- `teamIds[]`, `questionOrder[]`
- `sponsorId` and/or `sponsorIds[]`
- timestamps

Constraints:
- `teamIds` must reference valid teams  
- `questionOrder` must reference valid question IDs  
- session lifecycle transitions should follow lobby -> active -> completed  

### 4.2 `session_participants`
Stores per-session fan participation.

Fields:
- `id = ${sessionId}_${uid}`
- `sessionId`, `uid`, `teamId`
- `joinedAt`, `updatedAt`

Constraints:
- `teamId` must be one of that session's `teamIds`
- team can be changed only before first answer submission

### 4.3 `submissions`
Fan answers per question/session.

Fields:
- `sessionId`, `uid`, `questionId`, `selectedOptionId`, `teamId`, `createdAt`

Constraints:
- one submission per user/question/session
- submission team should match session participant team

### 4.4 `reward_claims`
Fan reward claim records.

Fields:
- `id = ${uid}_${sessionId}`
- `uid`, `sessionId`, `sponsorId`
- `firstName`, `lastName`, `email`, `phone`
- `status`, `createdAt`

Constraints:
- one claim per user per session
- email required; phone optional
- sponsor should reference existing sponsor document

### 4.5 `sponsors`
Sponsor metadata and reward description.

Fields:
- `id`, `name`, `rewardDescription`
- optional branding fields
- `createdAt`

Constraints:
- referenced by sessions and reward claims

---

## 5. Design Rationale and Major Decisions

### 5.1 Session-scoped Team Selection
**Decision:** Team choice is tied to each session (`session_participants`) instead of only global user profile.  
**Reason:** Fans can join multiple sessions; team selection must be isolated per session.  
**Result:** Correct first-join behavior and clean multi-session support.

### 5.2 Team Locking Rule
**Decision:** Fans can only change team before first submission in that session.  
**Reason:** Preserves competitive fairness and prevents post-answer switching.  
**Result:** Consistent scoring and predictable gameplay logic.

### 5.3 Session-Constrained Team Picker
**Decision:** Fan picker shows only teams configured on that session.  
**Reason:** Prevents invalid selections and setup mismatches.  
**Result:** Admin configuration is accurately enforced in fan UI.

### 5.4 Reward Claim and CSV Enhancements
**Decision:** Capture first/last name on claim and include sponsor metadata in exports.  
**Reason:** Improves sponsor fulfillment quality and reporting clarity.  
**Result:** More complete and business-usable exports.

### 5.5 Dependencies
- Expo/React Native for cross-platform speed  
- Firebase Auth/Firestore for managed auth + real-time data  
- ESLint/Prettier/Husky for code quality consistency  

---

## 6. Developer Handoff Workflow

A new developer should follow this order:

1. Read this document and repository README.  
2. Run project locally and verify fan/admin baseline flows.  
3. Review `src/features` and `src/types` to map business logic.  
4. For changes:
   - update types
   - update service logic
   - update UI/hook usage
   - verify Firestore constraints
5. Run lint/tests/manual checks.
6. Open PR with change summary and test evidence.

---

## 7. References to Other Deliverables

- Functional Specification: [Insert link/path]  
- User Manual (Admin/Fan): [Insert link/path]  
- Test Plan / QA Checklist: [Insert link/path]  
- Deployment Runbook: [Insert link/path]  
- Code Repository: [https://github.com/lrgatza/FanzPlay](https://github.com/lrgatza/FanzPlay)

---

## 8. Future Considerations

- Add end-to-end automation for session lifecycle and reward export.
- Formalize schema evolution notes for Firestore changes.
- Add analytics for fan funnel conversion and sponsor outcomes.
- Maintain an operational rollback/incident guide for production releases.
