# D1 Specifications

## User Stories

### Account & Profile

1. As a fan, I want to sign up for a FanzPlay account so that I can participate in games and compete for sponsored rewards.
2. As a returning fan, I want to log in securely so that I can access my account and continue participating in games.
3. As a fan, I want to join or represent a team so that my points contribute to a larger group score.
4. As an admin, I want to be able to log in securely so that I can manage game questions and oversee gameplay.

### Game Setup & Management

5. As an admin, I want to create and manage game sessions so that fans can participate during live events.
6. As an admin, I want to select and display questions during the game so that fans can answer them in real time.
7. As an admin, I want to set a time limit for each question so that gameplay remains fast-paced and fair.
8. As a fan, I want to see the current question clearly displayed so that I understand what I am answering.
9. As a fan, I want to select one answer choice before the timer expires so that I can earn points for my team.
10. As a fan, I want to be prevented from submitting multiple answers to the same question so that the game is fair.
11. As a fan, I want to see a real-time countdown timer so that I know how much time I have left to answer.
12. As a fan, I want to see confirmation that my answer was submitted so that I know it was recorded successfully.
13. As a fan, I want to see final scores at the end of the game so that I know which fans won and which fans lost.

### Sponsor Reward

14. As a winning fan, I want to be notified if I qualify for a sponsored reward so that I know I am eligible to receive a prize.
15. As a sponsor, I want winning fans' contact information securely collected so that rewards can be delivered.
16. As a fan, I want to see the sponsor's name displayed during the game so that I know who is providing the reward.

## Functional Requirements

### Definite

| # | Description | Users | Technical Notes |
|---|---|---|---|
| 1 | The app should allow fans to opt-in to be marketed to by certain sponsors to win possible rewards. | Fan |  |
| 2 | The app should allow already registered fans and admin to log in securely. | All |  |
| 3 | The app should allow fans to join or represent a team and associate their earned points with that team. | Fan | Team ID linked to user profile |
| 4 | The app should allow fans to create accounts using secure authentication credentials. | Fan | Firebase handles storing the credentials securely |
| 5 | The app should allow users to log in with their created accounts. | Fan |  |
| 6 | The app should allow administrators to create and manage game sessions. | Admin | Admin dashboard required |
| 7 | The app should allow the admin to create, edit, and select questions for a game session. | Admin |  |
| 8 | The app should display one active question at a time to all participating fans. | Fan | Real-time update mechanism required |
| 9 | The app should allow fans to select exactly one answer per question before the timer expires. | Fan | Disable multiple selections |
| 10 | The app should take the fan to a waiting page after selecting an answer so that selecting multiple choices or changing is not allowed. | Fan |  |
| 11 | The app should enforce a time limit for each question that the admin can set. | All | Timer controlled by admin settings |
| 12 | The app should display a real-time countdown timer during each question. | Fan | Frontend timer synced with server |
| 13 | The app should display the correct answer and the amount of points each team has after every game/question. | Fan |  |
| 14 | The app should calculate and update team scores based on correct answers. | Fan | Scoring logic needed |
| 15 | The app should identify eligible winning fans and allow them to claim their reward. | Fan |  |
| 16 | The app should securely collect and store contact information for winning fans. | Fan, Sponsor | Secure storage and restricted admin access |
| 17 | The app should display sponsor branding. | Fan | Sponsor name/logo displayed in the UI |

### Perhaps

| # | Description | Users | Technical Notes |
|---|---|---|---|
| 1 | The app should allow administrators to assign different point values to each question. | Admin |  |
| 2 | The app should allow admin to export a list of eligible winners. | Admin | CSV export capability |
| 3 | The app should prevent multiple submissions for the same question from the same fan. | Fan | One submission per user per question needs to be enforced in the backend |

### Improbable

| # | Description | Users | Technical Notes |
|---|---|---|---|
| 1 | The app should integrate directly with sponsor systems for automated prize fulfillment. | Sponsor | External API integration required |

## Non-Functional Requirements

| # | Description | Users | Technical Notes | Priority |
|---|---|---|---|---|
| 1 | This app needs to be a mobile app. | N/A | We plan to use React Native to meet this requirement. | Definite |
| 2 | The MVP is a prototype to show to UNC team. | N/A |  | Definite |
| 3 | The app will be responsive on the web. | All | Usability | Perhaps |
| 4 | The app must be usable on common platforms: Windows, MacOS, iOS, Android. | All |  | Perhaps |
| 5 | Meets accessibility standard. | All |  | Perhaps |
| 6 | The app should preserve user session state during brief disconnections. | Fans | Reliability | Perhaps |
| 7 | The app has to be able to handle high amounts of traffic at once. | All |  | Improbable |
| 8 | Can support multiple languages. | All |  | Improbable |
| 9 | This app needs to ensure users are unable to produce multiple accounts. | Fans | Number verification | Improbable |

## Interfaces

| # | Description | Users | Technical Notes | Priority |
|---|---|---|---|---|
| 1 | Login Screen | Fan | Sign into account | Definite |
| 2 | Sign Up Screen | Fan | User info and opt in to marketing + rewards | Definite |
| 3 | Game Selection | Fan | Buttons for different active games | Perhaps |
| 4 | Team Selection | Fan | Buttons to select team | Definite |
| 5 | Waiting Screen | Fan | Waiting on question activation, shows current score | Definite |
| 6 | Question Screen | Fan | Multiple-choice question with countdown timer | Definite |
| 7 | Win/Lose Screen | Fan | End of game, shows which team won and score | Definite |
| 8 | Reward Screen | Fan | Link to sponsor rewards for winning team | Definite |
| 9 | Trigger Next Question | Admin | Real-time activation for questions | Perhaps |
| 10 | Game Setup | Admin | Customize game, team, questions, sponsors | Perhaps |
