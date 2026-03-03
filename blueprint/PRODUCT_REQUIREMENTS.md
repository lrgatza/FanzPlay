# PRODUCT_REQUIREMENTS: FanzPlay (Revised)

## 1. System Overview
FanzPlay is a real-time, synchronous trivia application for mobile/web. It facilitates live competitive play between Fans representing Teams, managed by an Admin, with integrated Sponsor marketing and reward fulfillment.

## 2. Actor Definitions
- **FAN**: Registers, opts into marketing, joins a team, and answers questions in real-time.
- **ADMIN**: Orchestrates the game, manages questions/sessions, and exports winner data.
- **SPONSOR**: Provides branding and receives secure contact info for opted-in winners.

## 3. Functional Requirements

### A. Authentication & Onboarding
- **Secure Entry**: Login/Signup via Firebase Auth.
- **Marketing Opt-in**: Fans MUST have an option to opt-in for sponsor marketing during signup/onboarding to be eligible for rewards.
- **Team Selection**: Fans must select a team (e.g., UNC vs. Duke) to participate. Individual points aggregate to this team score.

### B. Live Game Engine (Synchronous Logic)
- **Game Discovery**: Fans select an active game session from a "Game Selection" screen.
- **State-Based UI**:
    1. **Waiting State**: Fans see current scores/team standings while waiting for the Admin to trigger a question.
    2. **Question State**: Displays question, countdown timer, and options.
    3. **Post-Answer State**: Immediately upon selection, the Fan is moved to a waiting page to prevent multiple submissions or changes.
- **Admin Control**: Admins manually trigger the "Active" question. Admins can assign variable point values per question.
- **Time Constraints**: Hard enforcement of timers. Submissions after `timer_seconds` are invalid.

### C. Scoring & Winners
- **Real-Time Aggregation**: Team scores must update and be displayed after every question.
- **Winner Identification**: System identifies fans who qualify for rewards based on performance and "Marketing Opt-in" status.
- **Data Export**: Admin has the capability to export a CSV of eligible winners' contact information.

## 4. Technical Constraints
- **Platform**: React Native (Web responsive, cross-platform iOS/Android).
- **Backend**: Firebase (Auth, Firestore, Hosting).
- **Concurrency**: Must handle high traffic during live events (atomic increments for scores).

## 5. Interface Map
1. **Auth**: Login, Sign Up (with Marketing Opt-in).
2. **Lobby**: Game Selection & Team Selection.
3. **Live HUD**: Waiting Screen (Standings) <-> Question Screen (Countdown) <-> Post-Answer Waiting.
4. **End Game**: Win/Lose Summary & Reward Claim Screen.
5. **Admin Console**: Game Setup, Question Triggering, Winner Export.