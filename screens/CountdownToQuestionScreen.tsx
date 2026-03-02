import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';

interface CountdownToQuestionScreenProps {
    onCountdownComplete: () => void;
}

const CountdownToQuestionScreen: React.FC<CountdownToQuestionScreenProps> = ({ onCountdownComplete }) => {
    const colors: [string, string, string, string] = ['#004777', '#F7B801', '#A30000', '#A30000'];

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Next question starts in:</Text>
            <CountdownCircleTimer
                isPlaying
                duration={5} // Countdown duration in seconds
                colors={colors as any}
                onComplete={onCountdownComplete}
                size={120}
            >
                {({ remainingTime }) => (
                    <Text style={styles.timerText}>{remainingTime}</Text>
                )}
            </CountdownCircleTimer>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#253031', 
    },
    text: {
        fontSize: 20,
        marginBottom: 20,
        color: 'white', 
    },
    timerText: {
        fontSize: 30,
        color: 'white', 
    }
});

export default CountdownToQuestionScreen;