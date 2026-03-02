import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Button,
    TouchableOpacity,
    Share,
    Image,
    Linking
} from 'react-native';
import { Game } from '../types/Game';
import { Team } from '../types/Team';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import teamLogos, { normalizeTeamName } from '../assets/config/teamLogos';


interface FinalLeaderboardScreenProps {
    game: Game;
    team: Team;
    playerScore: number; //not sure if we want to display this here
}

const FinalLeaderboardScreen: React.FC<FinalLeaderboardScreenProps> = ({
    game,
    team,
    playerScore
}) => {
    const team1Score = (game.team1score / game.team1responses) * 100;
    const team2Score = (game.team2score / game.team2responses) * 100;
    const finalPlayerScore = (playerScore / game.questions.length) * 100;
    const winner = team1Score > team2Score ? game.team1.name : game.team2.name;
    const isUserOnWinningTeam = team.name === winner;

    

    const getShareMessage = () => {
        if (isUserOnWinningTeam) {
            return `We won!! Go ${team.name}! #fanzplay`;
        } else {
            return "We'll get 'em next time!! #fanzplay";
        }
    };

    const winnerTeam = team1Score > team2Score ? game.team1 : game.team2;
    const winnerLogo = teamLogos[normalizeTeamName(winnerTeam.name)];

    

    const openSocialMedia = (platform: string) => {
        const message = encodeURIComponent(getShareMessage());
        let url = '';

        switch (platform) {
            case 'twitter':
                url = `https://twitter.com/intent/tweet?text=${message}`;
                break;
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    'https://yourgameapp.com'
                )}&quote=${message}`;
                break;
            case 'instagram':
                // nothing here because instagram only allows pictures, this is currently not being implemented
                break;
            default:
                url = '';
        }

        if (url) {
            Linking.openURL(url);
        }
    };

    return (
        <View style={styles.background}>
            <LinearGradient
                colors={['#000000', '#253031']}
                style={styles.gradient}
            >
                <View style={styles.container}>
                    <Text style={styles.header}>Final Leaderboard</Text>
                    {isUserOnWinningTeam && (
                        <Text style={styles.congratsText}>
                            Congratulations on your victory!
                        </Text>
                    )}
                    <Text style={styles.winnerText}>{winner} won!!!!</Text>
                    <Image source={winnerLogo} style={styles.logo} />
                    <Text style={styles.scoreText}>
                        {game.team1.name} Score: {team1Score.toFixed(2)}
                    </Text>
                    <Text style={styles.scoreText}>
                        {game.team2.name} Score: {team2Score.toFixed(2)}
                    </Text>
                    <Text style={styles.scoreText}>
                        Your Final Score: {finalPlayerScore.toFixed(2)}
                    </Text>
                    <View style={styles.shareContainer}>
                        <Text style={styles.shareText}>
                            Screenshot and Share
                        </Text>
                        <View style={styles.socialMediaIcons}>
                            <TouchableOpacity
                                onPress={() => openSocialMedia('twitter')}
                            >
                                <Icon
                                    name="twitter"
                                    size={30}
                                    color="#1DA1F2"
                                    style={styles.icon}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => openSocialMedia('facebook')}
                            >
                                <Icon
                                    name="facebook"
                                    size={30}
                                    color="#3b5998"
                                    style={styles.icon}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => openSocialMedia('instagram')}
                            >
                                <Icon
                                    name="instagram"
                                    size={30}
                                    color="#C13584"
                                    style={styles.icon}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    background: {
        flex: 1
    },
    gradient: {
        flex: 1
    },
    congratsText: {
        color: 'white',
        fontSize: 24,
        marginBottom: 12
    },

    shareContainer: {
        alignItems: 'center',
        marginTop: 24
    },
    shareText: {
        fontSize: 19,
        color: 'white',
        marginBottom: 12
    },
    socialMediaIcons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 80,
        paddingVertical: 24
    },
    icon: {
        marginHorizontal: 30
    },
    header: {
        color: '#DDE819',
        fontSize: 28,
        marginBottom: 24
    },
    winnerText: {
        color: 'white',
        fontSize: 26,
        fontWeight: 'bold',
        marginVertical: 12
    },
    scoreText: {
        color: 'white',
        fontSize: 21,
        marginVertical: 6
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginVertical: 10
    }
});

export default FinalLeaderboardScreen;
