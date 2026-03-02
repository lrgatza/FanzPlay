# FanzPlay

## Overview

*Changing the way we play*

FanzPlay is a mobile application that allows fans to compete in live trivia matches during their favorite team’s sporting events. Whether you’re watching the game at home or in the stadium, you can compete against opposing teams' fans for the chance to win bragging rights and prizes from sponsors.

Fans can play the game by answering trivia questions, specific to every matchup, on their screens before the time runs out. Answering correctly can help your team beat the opposing team, and the leaderboard displays which team is winning. FanzPlay provides a fun and engaging experience for every type of fan!!

Visit our project website [here](https://tarheels.live/comp523teami/)!

## Platform Components

This project was made using TypeScript as the main programming language, React Native for the frontend technology, Firebase for our backend technology, and Expo for our development environment. Our final product combines the two apps created by the previous team for fans and admins.

You can find information about the structure and design of our app in our [Design Document](https://tarheels.live/comp523teami/architecture-diagram/)!

## Accessing and Running FanzPlay

For detailed information on how to run the app, please refer to both the User Manual and the Adminstrator Manual on our app website in the section of [Documentation Plan](https://tarheels.live/comp523teami/documentation-plan/).

You can also refer to your [Handoff Plan](https://tarheels.live/comp523teami/handoff-plan/) which includes helpful videos on how to access and run the app.

## Implementation Details

For an overview of the implementation, code interactions, and discussed limitations please view the docs folder:

- [Admin implementation supplementary documentation](https://github.com/stefanodongowski/FanzPlay/blob/stage/docs/admin.md)
- [User implementation supplementary documentation](https://github.com/stefanodongowski/FanzPlay/blob/stage/docs/user.md)

## Testing
Check out our [Test Plan](https://tarheels.live/comp523teami/test-plan/)! This includes tests we planned and tests we were able to do. You can use this as a guide to the testing requirements of the app in general.
The testing is done inside the [test folder](https://github.com/stefanodongowski/FanzPlay/tree/stage/test) in this repo.

This app has unit testing for our database operations. To test our Firestore database functionality, we use a Firestore Emulator. This emulator allows us to test without worrying about modifying our live database. 
### Prerequisites (one time setup): 
1. Ensure you are an editor or owner for the FanzPlay (if you do not have access, request access by emailing brennamehl@gmail.com and sharing the Google account you would like to use).
2. Ensure your Node.js version is >=18.0.0 || >=20.0.0
3. Install Firebase CLI: `npm install -g firebase-tools`
4. Install all project dependencies (including testing modules): `npm install`
### Initialize the Emulator (one time setup):
1. In the terminal, login to Firebase: `firebase login`
2. Initialize Firebase: `firebase init`
3. Select  `firestore` and `emulators`
4. Select `use an existing project`
5. Choose `fanzplay-6229f`
6. Choose `Firestore Emulator`
7. Use default port
8. Select `download now`
### Launch Emulator and Run Tests:
1. In a terminal, login to Firebase: 
```firebase login```
2. Start emulators:
```firebase emulators:start``` 
3. Open a separate terminal and run the tests: 
```npm test```
4. Restart the emulators each time you test

## Linting
This respository is set up for linting using ESLint. Not all linting suggestions have been implemented yet. To lint the repository, run`npm run lint`

## Code Formatting
To make your changes comply with this repository's code styling, run  `npm run prettier:write` in the terminal before commintting your code to maintain code readability and consistency.

## Maintainability

As mentioned in the Admin Manual, it is critical to monitor and test the app regularly or the app may become dysfunctional. Here is an overview of how to properly maintain this app to avoid that:

### Keep Up

Keep up with updates on the technologies used for this app. Major changes or updates may happen that make certain parts of the app dysfunctional. This needs to be identified ASAP.

### Frequent App State Monitoring

Frequently and consistently monitor the state of FanzPlay's functionality to ensure that no libraries or dependencies get deprecated without finding alternatives. This can get very complicated quickly as too many libraries being dysfunctional can break intertwined functions within the code, eventually breaking all parts of the app. In summary, don't allow errors to stack.

Also, check Firebase to ensure it is continuing to be active.

### Compatibility Testing

Ensure that both Android and iOS are functional and function as similarly as possible. While React Native is made to be cross-compatible, advanced functions and libraries may behave differently between iOS and Android. There may be different ways data is pulled from Firebase between the two platforms, creating unexpected and hard-to-find bugs. For every test or change, both platforms need to be accounted for.

