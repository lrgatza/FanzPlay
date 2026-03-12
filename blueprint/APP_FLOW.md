# APP_FLOW: FanzPlay User Journeys & State Transitions

## 1. Authentication Flow
1. **Entry**: User opens app -> Check Firebase Auth state.
2. **Unauthenticated**: Redirect to `src/app/(auth)/login`.
    - Options: Login or Sign Up.
    - **Sign Up**: Must include "Marketing Opt-in" checkbox and Team selection.
3. **Authenticated**: Proceed to **Role-Based Gatekeeper**.

## 2. Role-Based Routing (Gatekeeper)
- **Identify Role**: Fetch `users/{uid}` document.
- **IF `role == 'admin'`**: Redirect to `src/app/(admin)/dashboard`.
- **IF `role == 'fan'`**: Redirect to `src/app/(fan)/game-selection`.

---

## 3. Fan Journey (Live Synchronous Play)

### Phase A: The Lobby
1. **Game Selection**: Fan views list of "Active" or "Lobby" sessions.
2. **Team Confirmation**: (Optional) If no team is set in profile, force Team Selection.
3. **Waiting Room**: Screen shows:
    - Sponsor Branding.
    - "Waiting for Admin to start the game..."
    - Live Team Standings (Current Session Score).

### Phase B: Active Gameplay Loop
1. **State Trigger**: Admin sets `game_sessions/{id}/questionActive` to `true`.
2. **Question Screen**: 
    - UI automatically switches to Question view.
    - Starts local countdown timer synced to `questionStartTime`.
    - Fan selects an answer.
3. **Post-Answer Waiting**:
    - **Immediately** upon selection, navigate to `src/app/(fan)/waiting`.
    - UI shows: "Answer Recorded! Waiting for next question..."
    - *Constraint:* Block "Back" navigation to prevent re-submission.
4. **Result Reveal**: 
    - Once timer hits zero or Admin closes question, show Correct Answer and updated Team Scores.
    - Return to "Waiting Room" state.

### Phase C: Game End
1. **Final Summary**: Display winning team and individual points.
2. **Reward Qualification**: 
    - IF `isWinner == true` AND `marketingOptIn == true`: Show "Claim Reward" button.
    - **Reward Screen**: Collect/Confirm contact info -> Write to `rewards_claims`.

---

## 4. Admin Journey (The Orchestrator)

### Phase A: Setup
1. **Session Management**: Create new session, select Question Set, and assign Sponsor.
2. **Control Panel**: View number of connected Fans.

### Phase B: Live Control
1. **Trigger Question**: Manual button to "Push" the next question.
2. **Monitoring**: View real-time bar chart of answer distributions (optional/internal).
3. **Close Question**: Manually end timer early or wait for countdown.

### Phase C: Wrap Up
1. **End Session**: Set status to `completed`.
2. **Export**: Button to trigger CSV generation of `rewards_claims` for the session.

---

## 5. Navigation Constraints for Cursor
- **Stack Protection**: Use `router.replace` for role redirects to prevent users from "Backing" into the wrong role's layout.
- **State Synchronization**: Use a global `useGameState` hook to listen to the `game_sessions` document; this hook should drive the navigation programmatically (e.g., if `questionActive` changes, redirect the user).