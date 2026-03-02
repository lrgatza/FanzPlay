# User


## Running the app as a User


To run the app as an admin, you need to log in using a user email and password. Those roles are defined in the Firestore db inside the users' collection. For example, you can use this login:

- Email: test@gmail.com 
- Password: 123456


The user role has three main pages available:
- The home page
- The rewards page
- The profile page


All relevant modals for these pages can be found inside the services folder or the screens folder.


### home page


This is the most important page from the user side of the app. On this page, you can click the game cards to join a game, which will be managed by an admin. There is a special modal that displays for each state the game is set to be in. Playing the game is as simple as waiting for the question page to appear and choosing the answer. You can view current progress on the leaderboard page. The final leaderboard page contains the final score, and this is where the user can share it on social media.


The home page is implemented inside the home.tsx file inside the (app) folder. The modals that respond to different states are all implemented in the screens folder.


### rewards page


This page is currently a non-functional image inside the rewards page. In the future, this would be the page where the user can select rewards after a game. The implementation is inside the rewards.tsx file inside the (app) folder.


### profile page


This is where the user can log out, edit, and delete their profile. The code for this page is implemented in the (app) folder inside the app folder. The file with the code for this page is profile.tsx


## Limitations


- Non-functional rewards page.
- Users are not prevented from entering or reentering a game which allows them to cheat the score.
- Logos are hardcoded to appear as either UNC or Duke teams. There is no way currently to accommodate other teams. They don't appear correctly if there are other teams or the order of UNC and Duke is switched. The option to add this feature is available as the logo is already part of the Team object and the teams' collection.
- Sharing on Instagram is not functional and the button currently does nothing.
- Social media sharing cannot currently include photos and the user needs to screenshot manually to share an image. Only text is sent to the social media platform.
- The option to enter a code to join a game is not functional and the button does nothing.