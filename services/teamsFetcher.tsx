import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { FIRESTORE } from '../FirebaseConfig';
import { Team } from '../types/Team';

const useTeams = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true); // Added loading state

    useEffect(() => {
        const teamsCollection = collection(FIRESTORE, 'teams');

        const unsubscribe = onSnapshot(teamsCollection, (snapshot) => {
            const newTeams = snapshot.docs.map((doc) => doc.data() as Team);
            setTeams(newTeams);
            setLoading(false); // Set loading to false once data is loaded
        });

        return () => unsubscribe();
    }, []);

    return { teams, loading }; // Return both games and loading state
};

export default useTeams;
