import { View, Text, StyleSheet } from 'react-native';
import { Game } from '../types/Game';
import { Team } from '../types/Team';
import React from 'react';

interface LeaderboardScreenProps {
    game: Game;
    team: Team;
    playerScore: number;
    currentQuestion: number;
}

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({
    game,
    team,
    playerScore,
    currentQuestion,
}) => {
    const team1Score = (game.team1score / game.team1responses * 100).toFixed(2);
    const team2Score = (game.team2score / game.team2responses * 100).toFixed(2);

    // Calculate total points available up to the current question
    const totalPointsAvailable = game.questions.slice(0, currentQuestion + 1)
        .reduce((sum, question) => sum + question.points, 0);

    // Calculate the user's score as a percentage
    const userScorePercentage = ((playerScore / totalPointsAvailable) * 100).toFixed(2);

    return (
        <View style={[styles.container, styles.dark]}>
            <View style={styles.header}>
                <Text style={styles.leaderboardText}>Leaderboard</Text>
            </View>
            <Text style={styles.questionText}>
                Question: {game.questions[currentQuestion].question}
            </Text>
            <Text style={styles.answerText}>
                The correct answer to the previous question was:
            </Text>
            <Text style={styles.answer}>
                {game.questions[currentQuestion].answers[game.questions[currentQuestion].correctAnswer]}
            </Text>
            <Text style={styles.currentScoreText}>Current Scores:</Text>
            <Text style={styles.scoreText}>
                {game.team1.name}: {team1Score}% 
            </Text>
            <Text style={styles.scoreText}>
                {game.team2.name}: {team2Score}%
            </Text>
            <Text style={styles.userScoreText}>
                Your score: {userScorePercentage}%
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    dark: {
        backgroundColor: '#253031',
    },
    header: {
        borderBottomColor: 'white',
        borderBottomWidth: 2,
        marginBottom: 10,
    },
    leaderboardText: {
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
        color: 'white',
    },
    questionText: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 5,
        fontWeight: '500',
    },
    answerText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '400',
        marginTop: 10,
        marginBottom: 10,
    },
    answer: {
        color: 'white',
        textAlign: 'center',
        fontWeight: '400',
        marginBottom: 20,
        fontSize: 20,
    },
    currentScoreText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 22,
        fontWeight: '500',
        marginBottom: 10,
    },
    scoreText: {
        color: 'white',
        fontSize: 20,
        fontWeight: '500',
        margin: 5,
        textAlign: 'center',
    },
    userScoreText: {
        color: 'white',
        fontSize: 20,
        fontWeight: '500',
        textAlign: 'center',
        marginTop: 10,
    },
});

export default LeaderboardScreen;