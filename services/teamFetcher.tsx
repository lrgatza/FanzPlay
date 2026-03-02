import { useState, useEffect } from 'react';
import { query, collection, where, onSnapshot } from 'firebase/firestore';
import { FIRESTORE } from '../FirebaseConfig';
import { Team } from '../types/Team';

const useFetchTeam = (teamID: string) => {
    const [team, setTeam] = useState<Team | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!teamID) {
            setTeam(null);
            setLoading(false);
            return;
        }

        const teamsCollection = query(
            collection(FIRESTORE, 'teams'),
            where('__name__', '==', teamID)
        );
        const unsubscribe = onSnapshot(
            teamsCollection,
            (snapshot) => {
                const newTeam = snapshot.docs.map(
                    (doc) => doc.data() as Team
                )[0];
                setTeam(newTeam);
                setLoading(false);
            },
            (error) => {
                console.error('Error fetching team data: ', error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [teamID]);

    return { team, loading };
};

export default useFetchTeam;
