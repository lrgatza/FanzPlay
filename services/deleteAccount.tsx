import {
    Auth,
    EmailAuthProvider,
    reauthenticateWithCredential,
    deleteUser
} from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import { FIRESTORE } from '../FirebaseConfig';

export const handleDeleteAccount = async (
    auth: Auth,
    email: string,
    password: string
) => {
    if (!auth.currentUser) {
        throw new Error('User not found');
    }

    try {
        // Reauthenticate the user
        const credential = EmailAuthProvider.credential(email, password);
        await reauthenticateWithCredential(auth.currentUser, credential);

        // Delete the user's document from Firestore
        const userDocRef = doc(FIRESTORE, 'users', auth.currentUser.uid);
        await deleteDoc(userDocRef);

        // Delete the user from Firebase Authentication
        await deleteUser(auth.currentUser);
    } catch (error) {
        throw error;
    }
};
