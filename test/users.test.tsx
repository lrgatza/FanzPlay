import * as firebase from '@firebase/testing';
import {
    userAuth,
    getFirestore,
    getAdminFirestore,
    cleanupFirestore
} from './testUtils';

beforeEach(cleanupFirestore);

// Tests read, create, update, and delete functions for our Users Firestore collection
describe('Users Firestore collection', () => {
    it('Allows authenticated users to read user documents', async () => {
        const db = getFirestore(userAuth);
        const testDoc = db.collection('users').doc('testDoc1');
        await firebase.assertSucceeds(testDoc.get());
    });

    it('Allows unauthenticated users to read user documents', async () => {
        const db = getFirestore();
        const testDoc = db.collection('users').doc('users');
        await firebase.assertSucceeds(testDoc.get());
    });

    it('Allows authenticated users to write to the users collection', async () => {
        const db = getFirestore(userAuth);
        const testDoc = db.collection('users').doc('testDoc2');
        await firebase.assertSucceeds(testDoc.set({ username: 'user_1' }));
    });

    it('Prevents unauthenticated users to write to the users collection', async () => {
        const db = getFirestore();
        const testDoc = db.collection('users').doc('testDoc2');
        await firebase.assertFails(testDoc.set({ username: 'test' }));
    });

    it('Allows authenticated users to update user documents', async () => {
        const adminDb = getAdminFirestore();
        const userId = 'test_user_id1';
        const setupDoc = adminDb.collection('users').doc(userId);
        await setupDoc.set({ userID: userId, username: 'username1' });

        const db = getFirestore(userAuth);
        const testDoc = db.collection('users').doc(userId);
        await firebase.assertSucceeds(
            testDoc.update({ username: 'newUsername1' })
        );
    });

    it('Prevents unauthenticated users from updating user documents', async () => {
        const adminDb = getAdminFirestore();
        const userId = 'test_user_id2';
        const setupDoc = adminDb.collection('users').doc(userId);
        await setupDoc.set({ userID: userId, username: 'username2' });

        const db = getFirestore();
        const testDoc = db.collection('users').doc(userId);
        await firebase.assertFails(
            testDoc.update({ username: 'newUsername2' })
        );
    });

    it('Allows authenticated users to delete user documents', async () => {
        const adminDb = getAdminFirestore();
        const userId = 'test_user_id3';
        const setupDoc = adminDb.collection('users').doc(userId);
        await setupDoc.set({ userID: userId, username: 'username3' });

        const db = getFirestore(userAuth);
        const testDoc = db.collection('users').doc(userId);
        await firebase.assertSucceeds(testDoc.delete());
    });

    it('Prevents unauthenticated users from deleting user documents', async () => {
        const adminDb = getAdminFirestore();
        const userId = 'test_user_id4';
        const setupDoc = adminDb.collection('users').doc(userId);
        await setupDoc.set({ userID: userId, username: 'username4' });

        const db = getFirestore();
        const testDoc = db.collection('users').doc(userId);
        await firebase.assertFails(testDoc.delete());
    });
});

afterAll(cleanupFirestore);
