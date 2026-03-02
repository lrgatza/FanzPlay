import * as firebase from '@firebase/testing';
import {
    userAuth,
    getFirestore,
    getAdminFirestore,
    cleanupFirestore
} from './testUtils';

beforeEach(cleanupFirestore);

// Tests read, create, update, and delete functions for our Teams Firestore collection
describe('Teams Firestore collection', () => {
    it('Allows authenticated users to read team documents', async () => {
        const db = getFirestore(userAuth);
        const testDoc = db.collection('teams').doc('testDoc1');
        await firebase.assertSucceeds(testDoc.get());
    });

    it('Allows unauthenticated users to read team documents', async () => {
        const db = getFirestore();
        const testDoc = db.collection('teams').doc('teams');
        await firebase.assertSucceeds(testDoc.get());
    });

    it('Allows authenticated users to write to the teams collection', async () => {
        const db = getFirestore(userAuth);
        const testDoc = db.collection('teams').doc('testDoc2');
        await firebase.assertSucceeds(testDoc.set({ color1: 'red' }));
    });

    it('Prevents unauthenticated users to write to the teams collection', async () => {
        const db = getFirestore();
        const testDoc = db.collection('teams').doc('testDoc2');
        await firebase.assertFails(testDoc.set({ color1: 'test' }));
    });

    it('Allows authenticated users to update team documents', async () => {
        const adminDb = getAdminFirestore();
        const teamId = 'test_user_id1';
        const setupDoc = adminDb.collection('teams').doc(teamId);
        await setupDoc.set({ teamID: teamId, color1: 'red' });

        const db = getFirestore(userAuth);
        const testDoc = db.collection('teams').doc(teamId);
        await firebase.assertSucceeds(testDoc.update({ color1: 'blue' }));
    });

    it('Prevents unauthenticated users from updating team documents', async () => {
        const adminDb = getAdminFirestore();
        const teamId = 'test_user_id2';
        const setupDoc = adminDb.collection('teams').doc(teamId);
        await setupDoc.set({ teamID: teamId, color1: 'red' });

        const db = getFirestore();
        const testDoc = db.collection('teams').doc(teamId);
        await firebase.assertFails(testDoc.update({ color1: 'blue' }));
    });

    it('Allows authenticated users to delete team documents', async () => {
        const adminDb = getAdminFirestore();
        const teamId = 'test_user_id3';
        const setupDoc = adminDb.collection('teams').doc(teamId);
        await setupDoc.set({ teamID: teamId, color1: 'red' });

        const db = getFirestore(userAuth);
        const testDoc = db.collection('teams').doc(teamId);
        await firebase.assertSucceeds(testDoc.delete());
    });

    it('Prevents unauthenticated users from deleting team documents', async () => {
        const adminDb = getAdminFirestore();
        const teamId = 'test_user_id4';
        const setupDoc = adminDb.collection('teams').doc(teamId);
        await setupDoc.set({ teamID: teamId, color1: 'red' });

        const db = getFirestore();
        const testDoc = db.collection('teams').doc(teamId);
        await firebase.assertFails(testDoc.delete());
    });
});

afterAll(cleanupFirestore);
