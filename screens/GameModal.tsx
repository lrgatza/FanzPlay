import React, { useEffect, useState } from 'react';
import {
    Modal,
    Text,
    View,
    SafeAreaView,
    Pressable,
    Image,
    StyleSheet
} from 'react-native';
import { Game } from '../types/Game';
import { Team } from '../types/Team';
import LobbyScreen from './LobbyScreen';
import QuestionScreen from './QuestionScreen';
import LeaderboardScreen from './LeaderboardScreen';
import FinalLeaderboardScreen from './FinalLeaderboardScreen';
import CountdownToQuestionScreen from './CountdownToQuestionScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import useGame from '../services/useGame';
import teamLogos, { normalizeTeamName } from '../assets/config/teamLogos';

interface GameModalProps {
    visible: boolean;
    onClose: () => void;
    gameID: string;
}

const GameModal: React.FC<GameModalProps> = ({ visible, onClose, gameID }) => {
    const { game, loading } = useGame(gameID);
    const [team, setTeam] = useState<Team | undefined>(undefined);
    const [playerScore, setPlayerScore] = useState(0);
    const [showCountdown, setShowCountdown] = useState(false);

    const onQuestionStart = () => {
        console.log('New question is starting');
    };

    useEffect(() => {
        if (game?.gameState === 'question' && !showCountdown) {
            setShowCountdown(true);
            setTimeout(() => {
                setShowCountdown(false);
            }, 5000); 
        }
    }, [game?.currentQuestion, game?.gameState]);

    const handleCountdownComplete = () => {
        setShowCountdown(false);
    };

    const updatePlayerScore = (points: number) => {
        setPlayerScore(playerScore + points);
    };

    if (!game || game.gameState === undefined) {
        return (
            <Modal visible={visible} onRequestClose={onClose} animationType="slide">
                <SafeAreaView style={styles.modalBackground}>
                    <Text>Game data is unavailable.</Text>
                    <Pressable onPress={onClose}>
                        <Text>Close</Text>
                    </Pressable>
                </SafeAreaView>
            </Modal>
        );
    }

    return (
        <Modal visible={visible} onRequestClose={onClose} animationType="slide">
            <SafeAreaView style={styles.modalBackground}>
                {team && (
                    <View style={styles.container}>
                        <Pressable onPress={onClose}>
                            <MaterialCommunityIcons name="window-close" size={30} color="white" />
                        </Pressable>
                        <Text style={styles.question}>
                            Question {game.currentQuestion + 1} of {game.questions.length}
                        </Text>
                        <Text style={styles.question}>
                            {playerScore} / {game.currentQuestion + 1}
                        </Text>
                    </View>
                )}

                {team === undefined && (
                    <Modal visible={true}>
                        <SafeAreaView style={styles.modalBackground}>
                            <LinearGradient
                                colors={['#000000', '#253031']}
                                style={styles.gradient}
                            >
                                <Text style={styles.joinTeam}>Select a team:</Text>
                                <View style={styles.card}>
                                    <Pressable onPress={() => setTeam(game.team1)}>
                                        <Image style={styles.logo} source={teamLogos[normalizeTeamName(game.team1.name)] || require('../assets/temp/unc_logo.png')} />
                                        <Text style={styles.teamName}>{game.team1.name}</Text>
                                    </Pressable>
                                </View>
                                <View style={styles.card}>
                                    <Pressable onPress={() => setTeam(game.team2)}>
                                        <Image style={styles.logo} source={teamLogos[normalizeTeamName(game.team2.name)] || require('../assets/temp/duke_logo.png')} />
                                        <Text style={styles.teamName}>{game.team2.name}</Text>
                                    </Pressable>
                                </View>
                            </LinearGradient>
                        </SafeAreaView>
                    </Modal>
                )}

                {showCountdown ? (
                    <CountdownToQuestionScreen onCountdownComplete={handleCountdownComplete} />
                ) : (
                    <>
                        {game.gameState === 'lobby' && team !== undefined && <LobbyScreen game={game} team={team} />}
                        {game.gameState === 'question' && team !== undefined && <QuestionScreen
                            game={game}
                            team={team}
                            updatePlayerScore={updatePlayerScore}
                            currentQuestion={game.currentQuestion}
                            onQuestionStart={onQuestionStart}
                        />}
                        {game.gameState === 'leaderboard' && team !== undefined && <LeaderboardScreen
                            game={game}
                            team={team}
                            playerScore={playerScore}
                            currentQuestion={game.currentQuestion}
                        />}
                        {game.gameState === 'finalLeaderboard' && team !== undefined && <FinalLeaderboardScreen
                            game={game}
                            team={team}
                            playerScore={playerScore}
                        />}
                    </>
                )}
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'flex-start'
    },
    selectTeamPopup: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%'
    },
    gradient: {
        flex: 1,
        width: '100%',
        alignItems: 'center'
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#253031',
        width: '100%'
    },
    buttonText: {
        fontSize: 20,
        color: 'white'
    },
    question: {
        fontSize: 25,
        color: 'white',
        fontWeight: '200'
    },
    joinTeam: {
        color: 'white',
        fontSize: 35,
        fontWeight: '500',
        textAlign: 'center',
        padding: 30
    },
    logo: {
        width: 250,
        height: 200,
        resizeMode: 'contain',
        padding: 20
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
        width: 300,
        alignItems: 'center',
        margin: 20,
        paddingTop: 20
    },
    teamName: {
        color: '#253031',
        textAlign: 'center',
        fontSize: 40,
        fontWeight: '800',
        padding: 10
    },
    button: {
        backgroundColor: '#DDE819',
        padding: 10,
        borderRadius: 5,
        alignSelf: 'center',
        minWidth: 80,
        marginHorizontal: 10
    },
    leaveButton: {
        backgroundColor: 'red'
    },
    buttonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.96 }]
    }
});

export default GameModal;
