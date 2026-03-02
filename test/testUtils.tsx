import * as firebase from '@firebase/testing';

interface Auth {
    uid: string;
    email: string;
}
const PROJECT_ID = 'fanzplay-6229f';
export const userAuth: Auth = { uid: 'user1', email: 'user1@gmail.com' };
export const adminAuth: Auth = { uid: 'admin1', email: 'admin1@gmail.com' };

// initializes test app with optional user authorization on Firestore Emulator
export function getFirestore(auth?: Auth) {
    return firebase
        .initializeTestApp({ projectId: PROJECT_ID, auth: auth })
        .firestore();
}

// initializes test app with admin authorization on Firestore Emulator
export function getAdminFirestore(auth?: Auth) {
    return firebase.initializeAdminApp({ projectId: PROJECT_ID }).firestore();
}

export async function cleanupFirestore() {
    await firebase.clearFirestoreData({ projectId: PROJECT_ID });

    firebase.apps().forEach((app) => app.delete());
}
