import { doc, updateDoc } from 'firebase/firestore';
import { FIRESTORE } from '../FirebaseConfig';
import { User } from '../types/User';

export const updateUser = async (
    userId: string | undefined,
    userData: Partial<User>
): Promise<void> => {
    if (!userId) {
        console.error('No user ID provided');
        return;
    }

    const userRef = doc(FIRESTORE, 'users', userId);

    try {
        await updateDoc(userRef, userData);
        console.log('User updated successfully');
    } catch (error) {
        console.error('Error updating user: ', error);
    }
};
