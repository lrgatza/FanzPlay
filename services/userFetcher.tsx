import { User } from 'firebase/auth';
import { query, collection, where, onSnapshot } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { FIRESTORE } from '../FirebaseConfig';

const getUser = (userID: string) => {
    const [user, setUser] = useState<any>();
    const [loading, setLoading] = useState(true); // Added loading state

    useEffect(() => {
        const usersCollection = query(
            collection(FIRESTORE, 'users'),
            where('__name__', '==', userID)
        );

        return onSnapshot(usersCollection, (snapshot) => {
            const newUser = snapshot.docs.map((doc) => doc.data() as User)[0];
            setUser(newUser);
            setLoading(false); // Set loading to false once data is loaded
        });
    }, []);

    return { user, loading }; // Return both games and loading state
};

export default getUser;
