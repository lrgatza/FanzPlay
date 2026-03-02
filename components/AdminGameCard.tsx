import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, Image, Alert } from 'react-native';
import { Game } from '../types/Game';
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    updateDoc
} from 'firebase/firestore';
import { FIRESTORE } from '../FirebaseConfig';
import AdminEditGame from './AdminEditGame';
import AdminSelectQuestion from './AdminSelectQuestion';
import AdminManageGame from './AdminManageGame';
import teamLogos, {TeamName} from '../assets/config/teamLogos';
import { Team } from '../types/Team';
import { normalizeTeamName } from '../assets/config/teamLogos';

interface AdminGameCardProps {
    game: Game;
}

const formatDate = (timestamp: { toDate: () => any }) => {
    const date = timestamp.toDate();
    const options = {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
};

const AdminGameCard: React.FC<AdminGameCardProps> = ({ game }) => {
    const [showAdminManageGame, setShowAdminManageGame] = useState(false);
    const [gameState, setGameState] = useState(game.gameState);
    const [isFirstQuestion, setIsFirstQuestion] = useState(
        game.currentQuestion === 0
    );
    const [showAdminEditGame, setShowAdminEditGame] = useState(false);
    const [showAdminSelectQuestion, setShowAdminSelectQuestion] =
        useState(false);

    const updateGameState = async (newState: string) => {
        setGameState(newState);
        const gameRef = doc(FIRESTORE, 'games', game.gameID);
        await updateDoc(gameRef, { gameState: newState });
    };

    const handleStartGame = async () => {
        updateGameState('lobby');
    };

    const handleResetGame = async () => {
        updateGameState('inactive');
        const gameRef = doc(FIRESTORE, 'games', game.gameID);
        await updateDoc(gameRef, { currentQuestion: 0 });
        setIsFirstQuestion(true);
    };

    const handleEditGame = () => {
        setShowAdminEditGame(true);
    };

    const handleEditQuestions = () => {
        setShowAdminSelectQuestion(true);
    };

    const confirmDelete = () => {
        Alert.alert(
            'Delete Game',
            'Are you sure you want to delete this game?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Deletion cancelled'),
                    style: 'cancel'
                },
                { text: 'Yes', onPress: () => deleteGame() }
            ],
            { cancelable: false }
        );
    };

    const deleteGame = async () => {
        const gameQuestionsRef = collection(
            FIRESTORE,
            'games',
            game.gameID,
            'questions'
        );
        const querySnapshot = await getDocs(gameQuestionsRef);
        for (const docSnapshot of querySnapshot.docs) {
            // delete all questions first to avoid orphaned data
            await deleteDoc(
                doc(
                    FIRESTORE,
                    'games',
                    game.gameID,
                    'questions',
                    docSnapshot.id
                )
            );
        }
        const gameRef = doc(FIRESTORE, 'games', game.gameID);
        await deleteDoc(gameRef);
    };
    
    const icon1 = teamLogos[normalizeTeamName(game.team1.name)] || require('../assets/temp/unc_logo.png'); 
    const icon2 = teamLogos[normalizeTeamName(game.team2.name)] || require('../assets/temp/duke_logo.png');
    

    
    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>
                    {game.team1.name + ' vs. ' + game.team2.name}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={styles.logo} source={icon1} />
                    <View style={styles.divider} />
                    <Image style={styles.logo} source={icon2} />
                    <View style={styles.timeAndDate}>
                        <Text style={styles.dateTime}>
                            {formatDate(game.startTime)}
                        </Text>
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    {gameState === 'inactive' && (
                        <Pressable
                            style={({ pressed }) => [
                                styles.button,
                                styles.startButton,
                                pressed && styles.buttonPressed
                            ]}
                            onPress={handleStartGame}
                        >
                            <Text style={styles.buttonText}>Start</Text>
                        </Pressable>
                    )}
                    {gameState !== 'inactive' && (
                        <Pressable
                            style={({ pressed }) => [
                                styles.button,
                                styles.manageButton,
                                pressed && styles.buttonPressed
                            ]}
                            onPress={() => setShowAdminManageGame(true)}
                        >
                            <Text style={styles.buttonText}>Manage</Text>
                        </Pressable>
                    )}
                    <Pressable
                        style={({ pressed }) => [
                            styles.button,
                            styles.editButton,
                            pressed && styles.buttonPressed
                        ]}
                        onPress={() => {
                            // Display options to choose which part to edit
                            Alert.alert(
                                'Edit Options',
                                'What do you want to edit?',
                                [
                                    {
                                        text: 'Questions',
                                        onPress: handleEditQuestions
                                    },
                                    {
                                        text: 'Game Time',
                                        onPress: handleEditGame
                                    }
                                ],
                                { cancelable: true }
                            );
                        }}
                    >
                        <Text style={styles.buttonText}> Edit</Text>
                    </Pressable>
                    <Pressable
                        style={({ pressed }) => [
                            styles.button,
                            styles.resetButton,
                            pressed && styles.buttonPressed
                        ]}
                        onPress={handleResetGame}
                    >
                        <Text style={styles.buttonText}>Reset</Text>
                    </Pressable>
                    <Pressable
                        style={({ pressed }) => [
                            styles.button,
                            styles.deleteButton,
                            pressed && styles.buttonPressed
                        ]}
                        onPress={confirmDelete}
                    >
                        <Text style={styles.buttonText}>Delete</Text>
                    </Pressable>
                </View>
            </View>

            <AdminManageGame
                visible={showAdminManageGame}
                onClose={() => setShowAdminManageGame(false)}
                game={game}
                updateGameState={updateGameState}
                isFirstQuestion={isFirstQuestion}
                setIsFirstQuestion={setIsFirstQuestion}
            />

            <AdminSelectQuestion
                visible={showAdminSelectQuestion}
                onClose={() => setShowAdminSelectQuestion(false)}
                gameID={game.gameID}
                questions={game.questions}
            />
            <AdminEditGame
                visible={showAdminEditGame}
                onClose={() => setShowAdminEditGame(false)}
                game={game}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 10
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.5,
        shadowRadius: 6,
        elevation: 4,
        width: 360
    },
    title: {
        color: '#000',
        fontSize: 28,
        fontStyle: 'normal',
        fontWeight: '400',
        padding: 10
    },
    dateTime: {
        color: '#000',
        textAlign: 'center',
        fontSize: 20,
        fontStyle: 'normal',
        fontWeight: '300',
        width: 85
    },
    timeAndDate: {
        flexShrink: 0,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        padding: 10
    },
    logo: {
        width: 100,
        height: 65,
        resizeMode: 'contain',
        marginLeft: 5,
        marginBottom: 10
    },
    divider: {
        height: '90%',
        width: 2,
        marginHorizontal: 10,
        shadowColor: '#000',
        backgroundColor: '#FFF',
        shadowOpacity: 0.6,
        shadowRadius: 7,
        elevation: 2,
        marginBottom: 10,
        alignSelf: 'center'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalText: {
        color: 'white',
        fontSize: 20,
        marginBottom: 20
    },
    modalButton: {
        backgroundColor: '#DDE819',
        shadowColor: '#000',
        padding: 10,
        margin: 10,
        borderRadius: 5
    },
    modalButtonText: {
        color: '#000',
        fontSize: 24,
        fontWeight: '500'
    },
    modalBackground: {
        flex: 1
    },
    modalGradient: {
        flex: 1
    },
    manageButton: {
        backgroundColor: 'orange'
    },
    editButton: {
        backgroundColor: 'purple'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10
    },
    button: {
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 80,
        marginHorizontal: 5
    },
    startButton: {
        backgroundColor: 'green'
    },
    resetButton: {
        backgroundColor: 'red'
    },
    continueButton: {
        backgroundColor: 'blue'
    },
    deleteButton: {
        backgroundColor: 'red'
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    },
    buttonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.96 }]
    }
});

export default AdminGameCard;