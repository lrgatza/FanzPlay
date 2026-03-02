import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { FIRESTORE } from '../FirebaseConfig';
import { User } from '../types/User';

const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true); // Added loading state

    useEffect(() => {
        const usersCollection = collection(FIRESTORE, 'users');

        const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
            const newUsers = snapshot.docs.map((doc) => doc.data() as User);
            setUsers(newUsers);
            setLoading(false); // Set loading to false once data is loaded
        });

        return () => unsubscribe();
    }, []);

    return { users, loading }; // Return both games and loading state
};

export default useUsers;
