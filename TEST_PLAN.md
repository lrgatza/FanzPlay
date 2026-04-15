# FanzPlay Test Plan

## Project Information

- **Project**: FanzPlay
- **Prepared by**: FanzPlay development team
- **Date prepared**: April 15, 2026
- **Due date**: April 23, 2026

---

## Purpose

This document defines two test plans:

1. **Ideal test plan**: what would be tested with unlimited time/resources.
2. **Actual test plan**: what will be tested before the project due date.

This plan is written so that a TA, professor, or engineer modifying the code can run and evaluate tests with clear pass/fail criteria.

---

## Submission Checklist (Complete Before Turn-In)

- Fill every remaining `**TODO**` value in this document.
- Add real tester names/initials for developer executions from 4/15 to 4/22.
- Record TA/Professor execution date on acceptance checklist (4/23).
- Confirm manual test data exists in Firebase: 2 teams, 1+ questions, 1 sponsor.
- Confirm test credentials are valid and shared in Section 7.
- Re-run `npm run test` and `npm run lint` on final submission day.

---

## System Under Test

FanzPlay is an Expo/React Native application with Firebase backend services that supports:

- Fan account signup/login
- Team selection and score contribution
- Admin session creation and live game control
- Real-time question answering with timer constraints
- Session results and sponsor reward claim workflows

Primary source directories:

- `src/features/auth`
- `src/features/game`
- `src/features/admin`
- `src/features/rewards`
- `src/features/teams`

---

## Test Stakeholders (Who Tests)

- **Development team members**: execute unit tests, integration checks, and manual regression throughout development.
- **TA/Professor**: execute acceptance and grading checks using the concrete manual test scripts and expected outcomes defined in this document.

---

## Part 1: Ideal Test Plan (Unlimited Time/Resources)

## 1) Unit Testing (Automated, High Coverage)

### Objective

Validate all business logic and error handling at function level using automated suites.

### Scope

- `authService`: sign up, sign in, sign out, team update
- `sessionService`: create session, subscribe/update state, question transitions
- `submissionService`: answer persistence, idempotent scoring, point increments
- `rewardService`: claim creation and duplicate detection
- `teamService`, `questionService`, `sponsorService`: create/subscription/update behavior
- deterministic hooks such as countdown and data transformations

### Ideal tooling

- Jest or Vitest for test runner
- React Native Testing Library for component behavior
- Firebase Emulator Suite for deterministic backend integration in tests
- Coverage reporter integrated in CI

### Ideal success criteria

- 85%+ line and branch coverage on service logic
- All bug fixes include a regression test
- Unit tests run on every pull request

---

## 2) Integration and System Testing (UI + Backend)

### Objective

Verify full workflows across UI, routing, and Firebase persistence.

### Ideal scenarios

- Fan flow end-to-end (signup/login/team/gameplay/results/reward claim)
- Admin flow end-to-end (login/session setup/live control/end session)
- Multi-user timing behavior with concurrent fan submissions
- Data consistency between Firestore documents and UI state

### Ideal tooling

- Browser automation (Playwright/Cypress) for web flow
- Device/simulator scripted runs for Expo Go
- Firebase emulator and seeded fixtures for repeatable test runs

---

## 3) Reliability and Performance Testing

### Objective

Measure performance and robustness under realistic and stress conditions.

### Ideal checks

- Timely rendering of question updates and countdown state
- Submission latency under multiple concurrent users
- Firestore listener reconnect behavior after network interruption
- Stability across long-running session control

### Ideal metrics

- `p50` and `p95` latency for:
  - answer submit
  - next question push
  - results rendering

---

## 4) Acceptance Testing

### Objective

Map all user stories to observable pass/fail outcomes in a reproducible checklist.

### Ideal approach

- Every user story has:
  - preconditions
  - test steps
  - expected outputs (oracle)
  - pass/fail checkbox
- Acceptance run performed by non-developer grader (TA/Professor)

---

## Part 2: Actual Test Plan (Committed Before 4/23)

## 1) Test Schedule

- **4/15 to 4/20**: Developers implement and execute core unit tests for service logic.
- **4/20 to 4/22**: Developers perform integration/manual system tests across fan/admin/reward flows and run regression checks.
- **4/22**: Final internal regression pass and documentation freeze.
- **4/23**: TA/Professor executes acceptance checklist for grading.

---

## 2) Exact Test Environments

Fill all `**TODO**` values before submission:

- **Desktop web**
  - OS: **TODO** (OS name + version, e.g., macOS 15.x / Windows 11)
  - Browser: Chrome `147.0.7727.102` (stable, mac channel)
  - Browser: Safari `26.4` (released Mar 24, 2026)
  - Browser: Firefox `149.0` (release channel)
- **Mobile web**
  - Device model: **TODO**
  - Mobile OS: **TODO** (iOS/Android exact version)
  - Browser: Chrome `147.0.7727.102` (Android target)
  - Browser: Safari `26.4` (iOS target)
- **Expo Go mobile app**
  - Device model: **TODO**
  - Mobile OS: **TODO** (iOS/Android exact version)
  - Expo Go: **TODO** (exact version)

Project runtime/environment references:

- Node.js: `v22.18.0`
- npm: `10.9.3`

---

## 3) Test Types and What Will Actually Be Tested

## 3.1 Unit Testing (Automated, Required)

Automated tests are implemented and executed for these modules:

- `src/features/auth/services/authService.ts`
  - sign up success path creates user profile data
  - sign in success and invalid credential failure behavior
  - sign out success path
- `src/features/admin/services/sessionService.ts`
  - create session persists expected initial state
  - push next question increments index and updates current question
  - close question sets `questionActive` false and stores `correctOptionId`
- `src/features/game/services/submissionService.ts`
  - submit answer persists submission payload
  - score computation marks correct/incorrect correctly
  - idempotency guard prevents duplicate score increments
- `src/features/rewards/services/rewardService.ts`
  - create reward claim persists claim payload
  - existing-claim check returns expected boolean

Regression rule:

- Any bug found in development must add or update an automated unit test before merge.

---

## 3.2 Integration/System Testing (Manual UI + Data Validation)

### Fan flow tests

1. Sign up new fan account.
2. Log in with created account.
3. Select/join a team.
4. Join an active session.
5. Answer a live question before timer expiration.
6. Verify only one submission is accepted per question.
7. Verify waiting/transition/results screens appear correctly.

### Admin flow tests

1. Log in as admin.
2. Create session with:
   - exactly 2 teams
   - at least 1 question
   - 1 sponsor
3. Push next question live.
4. Close question and verify state transition.
5. End session and verify completed status.

### Reward flow tests

1. Reach winner-eligible state.
2. Submit reward claim contact information.
3. Verify duplicate claim attempt is blocked.

---

## 3.3 Error and Data-Specific Testing

The following edge/error cases will be explicitly tested:

- Invalid login credentials
- Missing required form data (team/sponsor/question/session setup)
- Timer expiration before answer submission
- Duplicate answer attempt for same user/question/session
- Duplicate reward claim for same user/session
- Invalid or missing session IDs in fan routes
- Network interruption during submission (expected visible error and safe retry behavior)

---

## 4) End User Types Included in Testing

- **New fan**: creates account and participates in first game
- **Returning fan**: logs in and continues gameplay
- **Team participant fan**: ensures points contribute to team score
- **Admin**: configures session and controls live gameplay
- **TA/Professor (grader)**: verifies acceptance outcomes against documented expected results

---

## 5) Acceptance Testing Matrix (User Stories to Validation)

The following user stories are in acceptance scope:

### Account & Profile

- Fan signup
- Returning fan secure login
- Team join/representation
- Admin secure login

### Game Setup & Management

- Admin creates/manages sessions
- Admin selects/displays live questions
- Admin controls time limits
- Fan sees clear current question
- Fan submits one answer before timer
- Fan prevented from multiple submissions
- Fan sees real-time countdown
- Fan sees submission confirmation
- Fan sees final scores

### Sponsor Reward

- Winning fan receives eligibility outcome
- Sponsor contact info is collected for winners
- Sponsor name is displayed during game context

For each user story above, acceptance execution must include:

- Preconditions
- Exact action steps
- Expected output/oracle
- Pass/fail result
- Tester name and execution date

---

## 6) Tools Used

- **Lint/format quality gates**: ESLint + Prettier via project scripts/hooks
- **Manual execution**: Expo web and Expo Go
- **Automated unit tests**: Jest + jest-expo with module-level mocks
- **Backend test setup**: Firebase SDK calls mocked in Jest unit tests (no emulator required for these service-level tests)

---

## 7) Test Data Required

Before TA/Professor testing, provide:

- Test fan account credentials:
  - Email: **TODO**
  - Password: **TODO**
- Test admin account credentials:
  - Email: **TODO**
  - Password: **TODO**
- Session data:
  - 2 valid teams
  - 1+ configured question(s)
  - 1 configured sponsor

---

## 8) How to Run Tests (Engineer/Grader Repro Steps)

1. Install dependencies.
2. Set required environment variables for Firebase.
3. Run lint checks.
4. Run automated unit tests.
5. Launch web and Expo Go clients.
6. Execute manual scripts and record outcomes.

Command template:

- Install: `npm install`
- Lint: `npm run lint`
- Unit tests: `npm run test`
- Start web: `npm run web`
- Start Expo for mobile: `npm run start`

Required Firebase environment variables:

- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`
- `EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID`

---

## 9) Pass/Fail Criteria

- **Unit**: all automated unit tests pass.
- **Integration/system**: all required flow tests pass in listed environments.
- **Acceptance**: each in-scope user story has documented pass/fail result and expected outputs verified by TA/Professor.
- **Release readiness**: no blocking defects in auth, question submission, session control, or reward claim flows.

---

## 10) Risks and Constraints

- Current project timeline (4/15 to 4/23) limits breadth of automation.
- Prioritization focuses on highest-risk game and scoring paths.
- Exact software versions must be filled in before final submission to keep grading reproducible.

---

## 11) TA/Professor Execution Script (Concrete Manual Tests + Oracle)

Use this section as the grading script for acceptance and system testing.

### Test Case A1: Fan Sign Up and Login

- **Tester**: TA/Professor
- **Environment**: Desktop web (Section 2 versions)
- **Preconditions**: Test fan account does not already exist.
- **Input/Steps**:
  1. Open app and navigate to sign up.
  2. Enter valid new fan email/password/display name.
  3. Submit sign up.
  4. Log out if auto-logged in, then log in with same credentials.
- **Expected output (oracle)**:
  - Signup succeeds with no error banner.
  - Login succeeds and user is routed to fan game selection or fan flow screen.
  - Invalid credential message appears when wrong password is used.
- **Pass/Fail**: **TODO**

### Test Case A2: Admin Session Creation

- **Tester**: TA/Professor
- **Environment**: Desktop web
- **Preconditions**: Admin credentials available; at least 2 teams, 1+ questions, 1 sponsor exist.
- **Input/Steps**:
  1. Log in as admin.
  2. Open New Session setup.
  3. Select exactly 2 teams, at least 1 question, and 1 sponsor.
  4. Click Create Session.
- **Expected output (oracle)**:
  - Session creation succeeds without error.
  - Admin returns to dashboard.
  - Newly created session appears in session list with lobby status.
- **Pass/Fail**: **TODO**

### Test Case A3: Fan Answer Submission and Anti-Duplicate Behavior

- **Tester**: TA/Professor
- **Environment**: Expo Go mobile or mobile web
- **Preconditions**: Active session exists with live question.
- **Input/Steps**:
  1. Log in as fan and join active session.
  2. Select one answer before timer reaches zero.
  3. Attempt to submit again/tap another option.
- **Expected output (oracle)**:
  - First answer is accepted and user transitions to waiting state.
  - Additional submission attempts are blocked for same question.
  - If timer expires before answering, user is moved to waiting without submission.
- **Pass/Fail**: **TODO**

### Test Case A4: Reward Claim and Duplicate Claim Guard

- **Tester**: TA/Professor
- **Environment**: Desktop web or Expo Go
- **Preconditions**: Fan is in winner-eligible flow for session.
- **Input/Steps**:
  1. Open reward claim screen.
  2. Submit valid email/phone.
  3. Attempt second claim for same user/session.
- **Expected output (oracle)**:
  - First claim is accepted and stored as pending.
  - Duplicate claim is blocked or prevented by UI logic.
  - Sponsor context remains visible in reward flow UI.
- **Pass/Fail**: **TODO**
