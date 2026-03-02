import { useEffect, useState } from 'react';
import {
    doc,
    onSnapshot,
    getDoc,
    collection,
    getDocs,
    Timestamp,
    Unsubscribe
} from 'firebase/firestore';
import { FIRESTORE } from '../FirebaseConfig';
import { Game } from '../types/Game';
import { Team, DEFAULT_TEAM } from '../types/Team';
import { Question } from '../types/Question';

const useGame = (gameID: string) => {
    const [game, setGame] = useState<Game | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // resolves render error if no game
        if (!gameID) {
            setGame(null);
            setLoading(false);
            return;
        }

        const gameRef = doc(FIRESTORE, 'games', gameID);
        const unsubscribeGame = onSnapshot(gameRef, async (docSnapshot) => {
            if (!docSnapshot.exists()) {
                setGame(null);
                setLoading(false);
                return;
            }

            const gameData = docSnapshot.data() as Game;

            // Resolve team references
            const team1Ref = docSnapshot.get('team1ID');
            const team2Ref = docSnapshot.get('team2ID');

            const team1 = team1Ref
                ? ((await getDoc(team1Ref)).data() as Team)
                : DEFAULT_TEAM;
            const team2 = team2Ref
                ? ((await getDoc(team2Ref)).data() as Team)
                : DEFAULT_TEAM;

            // Fetch questions
            const questionsSnapshot = await getDocs(
                collection(docSnapshot.ref, 'questions')
            );
            const questions = questionsSnapshot.docs.map(
                (doc) => doc.data() as Question
            );

            const initialGame: Game = {
                ...gameData,
                team1: team1,
                team2: team2,
                questions: questions
            };

            setGame(initialGame);

            // Set up real-time listener for questions
            const questionsRef = collection(docSnapshot.ref, 'questions');
            const unsubscribeQuestions = onSnapshot(
                questionsRef,
                (questionsSnapshot) => {
                    const updatedQuestions = questionsSnapshot.docs.map(
                        (doc) => doc.data() as Question
                    );
                    setGame((currentGame) => {
                        if (currentGame && currentGame.gameID === gameID) {
                            return {
                                ...currentGame,
                                questions: updatedQuestions
                            };
                        }
                        return currentGame;
                    });
                }
            );

            setLoading(false);

            // Return a function to unsubscribe both listeners when the component unmounts
            return () => {
                unsubscribeGame();
                unsubscribeQuestions();
            };
        });
    }, [gameID]);

    return { game, loading };
};

export default useGame;
