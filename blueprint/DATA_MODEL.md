# DATA_MODEL: FanzPlay Firestore Schema (Revised)

## 1. `users` (Collection)
- `uid`: string (PK)
- `email`: string
- `displayName`: string
- `role`: "fan" | "admin"
- `teamId`: string (Ref to `teams`)
- `marketingOptIn`: boolean (Required for reward eligibility)
- `totalPoints`: number
- `createdAt`: timestamp

## 2. `game_sessions` (Collection)
- `id`: string
- `status`: "lobby" | "active" | "completed"
- `currentQuestionId`: string
- `questionActive`: boolean
- `questionStartTime`: timestamp
- `sponsorId`: string (Ref to `sponsors`)
- `settings`: { "showTeamScores": boolean, "allowLateJoin": boolean }

## 3. `questions` (Collection)
- `id`: string
- `text`: string
- `options`: [{ "id": "A", "text": "..." }, ...]
- `correctOptionId`: string
- `points`: number (Variable per question)
- `timerSeconds`: number

## 4. `submissions` (Collection)
**Document ID:** `{sessionId}_{questionId}_{uid}` (Enforces single submission)
- `uid`: string
- `sessionId`: string
- `questionId`: string
- `teamId`: string
- `selectedOptionId`: string
- `isCorrect`: boolean
- `answeredAt`: timestamp

## 5. `teams` (Collection)
- `id`: string
- `name`: string
- `currentSessionScore`: number (Reset per game)
- `allTimeScore`: number

## 6. `sponsors` (Collection)
- `id`: string
- `name`: string
- `logoUrl`: string
- `rewardDescription`: string

## 7. `rewards_claims` (Collection)
- `id`: string
- `uid`: string
- `sessionId`: string
- `sponsorId`: string
- `contactInfo`: { "email": string, "phone": string }
- `status`: "pending" | "fulfilled"

---

### Implementation Guardrails
- **Atomic Operations**: Use `increment()` for `currentSessionScore` and `totalPoints`.
- **Validation**: Firebase Security Rules must check `marketingOptIn` before allowing a write to `rewards_claims`.
- **Querying**: Use a composite index on `submissions` for `sessionId` + `teamId` to calculate real-time standings.