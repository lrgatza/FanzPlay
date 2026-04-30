# FanzPlay User Handbook

This handbook is for day-to-day client operators and game admins. It explains how to run a FanzPlay game session without needing engineering support.

For technical deployment steps, use the [Deployment Runbook](./deployment-runbook.md). For data and code internals, use the [Database Handbook](./database-handbook.md) and [Codebase Handbook](./codebase-handbook.md).

## Who This Is For

- Fan users who join and play games
- Admin users who set up and run live sessions
- Operations staff who support game-day workflows

## What FanzPlay Does

FanzPlay is a live trivia experience where:

- Fans sign in, pick a team, and answer timed questions
- Admins create sessions and questions, then run live controls
- Winners can claim rewards, and admins can export winner data

## Fan Workflow (Step-By-Step)

### 1) Sign Up Or Log In

1. Open the app.
2. Create an account or log in with your existing account.
3. If prompted, choose marketing opt-in preference.

If login fails, see [Troubleshooting](#troubleshooting-what-to-do-when).

### 2) Choose A Session

1. Go to the game selection screen.
2. Pick an available live or lobby session.
3. Join the session and continue.

### 3) Choose A Team

1. Select your team from the team list.
2. Confirm your selection.
3. Enter the lobby.

### 4) Wait In Lobby

1. Stay on the lobby screen until the admin starts.
2. Watch for countdowns and status updates.

### 5) Answer Questions

1. Read each question quickly.
2. Select one option before time expires.
3. Wait for answer reveal and scoring.

### 6) View Results And Claim Reward

1. Review final results when session ends.
2. If eligible, continue to reward claim.
3. Submit claim details and wait for follow-up from organizers.

## Admin Workflow (Step-By-Step)

### 1) Log In As Admin

1. Sign in with an admin account.
2. Confirm you land on the Admin Dashboard.

### 2) Create Or Prepare Session

1. Open Session Setup.
2. Add or select sponsor, teams, and question set.
3. Confirm session settings and save.

### 3) Launch Live Control

1. Open the target session in Live Control.
2. Verify status is ready (lobby or active).
3. Keep Live Control open for the entire game.

### 4) Run The Game

Use these core controls in order:

1. **Push Question** to start each question.
2. **Close Question & Reveal Answer** when timer ends.
3. Repeat until all questions are complete.

### 5) End Session

1. Click **End Session**.
2. If a question is active, choose whether to score it before ending.
3. Confirm session completion.

### 6) Export Winners

1. After session completion, use **Export Winners CSV**.
2. Save the CSV locally.
3. Send results to your reward fulfillment contact.

## Troubleshooting (What To Do When)

### A fan cannot log in

- Confirm they are using the correct email/password
- Ask them to retry on stable internet
- Have them fully close and reopen the app
- If still blocked, escalate to technical support

### A fan cannot join session

- Confirm the session is active or lobby status
- Confirm fan account is authenticated
- Ask fan to refresh game selection and retry

### Questions are not advancing

- Confirm admin is in Live Control for the correct session
- Retry the action once
- If still failing, end and restart session only if approved by event lead

### Results or rewards look incorrect

- Confirm session was fully ended
- Re-export winners CSV
- Escalate to technical ops for Firestore data review

## Security And Access Expectations

- Fan accounts should never be shared
- Admin access should be limited to trained operators
- Only authorized admins should export winner data
- CSV exports may contain personal contact details and must be handled securely

## Glossary

- **Session**: A single trivia game instance with teams and questions
- **Lobby**: Waiting state before questions begin
- **Live Control**: Admin screen used to run question flow
- **Reward Claim**: Winner submission used for fulfillment
- **CSV Export**: Spreadsheet file of reward claim data for operations

## Ownership And Review Cadence

- **Owner**: Client operations lead (primary), product owner (secondary)
- **Review cadence**: Before each event cycle and after any major workflow change
- **Escalation**: If steps in this handbook fail repeatedly, use technical docs and involve engineering

