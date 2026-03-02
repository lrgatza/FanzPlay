import React from 'react';
import { Text, StyleSheet, SafeAreaView, View, Image } from 'react-native';
import { Game } from '../types/Game';
import { Team } from '../types/Team';
import teamLogos, { normalizeTeamName } from '../assets/config/teamLogos';


interface LobbyProps {
    game: Game;
    team: Team;
}

const LobbyScreen: React.FC<LobbyProps> = ({ game, team }) => {
    const opponent =
        team.teamID === game.team1.teamID ? game.team2.name : game.team1.name;
        const icon = teamLogos[normalizeTeamName(team.name)] || require('../assets/temp/unc_logo.png'); 

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.text}>
                <View style={styles.underline}>
                    <Text style={styles.lobby}>Game Lobby</Text>
                </View>
                <Text style={styles.welcome}>
                    Welcome to the FanzPlay trivia game!
                </Text>
                <Text style={styles.intro}>
                    You're playing on {team.name}'s team.
                </Text>
                <View style={styles.card}>
                    <Image style={styles.logo} source={icon} />
                </View>
                <Text style={styles.intro}>Get ready to beat {opponent}!</Text>
            </View>

            <Text style={styles.waiting}>Waiting for others to join...</Text>
        </SafeAreaView>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#253031',
        width: '100%'
    },
    text: {
        flex: 1,
        alignItems: 'center'
    },
    underline: {
        borderBottomColor: 'white',
        borderBottomWidth: 2,
        marginBottom: 5,
        width: 220,
        paddingTop: 10
    },
    lobby: {
        fontSize: 40,
        fontWeight: '600',
        textAlign: 'center',
        color: 'white',
        borderBottomColor: 'white',
        borderBottomWidth: 2
    },
    welcome: {
        fontSize: 30,
        fontWeight: '500',
        textAlign: 'center',
        color: 'white',
        borderBottomColor: 'white',
        borderBottomWidth: 2,
        padding: 20,
        paddingBottom: 40
    },
    intro: {
        fontSize: 30,
        fontWeight: '300',
        textAlign: 'center',
        color: 'white',
        padding: 5
    },
    waiting: {
        fontSize: 30,
        fontWeight: '200',
        textAlign: 'center',
        color: 'white',
        padding: 40
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
        padding: 20
    },
    teamName: {
        color: '#253031',
        textAlign: 'center',
        fontSize: 40,
        fontWeight: '800',
        padding: 10
    }
});

//make this component available to the app
export default LobbyScreen;
