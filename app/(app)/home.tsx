import { Href, Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    TextInput,
    ScrollView, // Import ScrollView
    ActivityIndicator,
    Image
} from 'react-native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import GameCard from '../../components/GameCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useGames from '../../services/gamesFetcher';
import { Game } from '../../types/Game';
import GameModal from '../../screens/GameModal';

const auth = FIREBASE_AUTH;

const HomePage = () => {
    const router = useRouter();
    const { games, loading: gamesLoading } = useGames();
    const [text, onChangeText] = React.useState('');
    const [showGameModal, setShowGameModal] = useState(false);
    const [game, setGame] = useState<Game>();

    return (
        <ScrollView style={styles.dark} contentContainerStyle={[styles.container, { flexGrow: 1 }]}>
            <Image
                source={require('../../assets/fanzplay_logo_transparent.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <View style={styles.input}>
                <MaterialCommunityIcons
                    name="key-variant"
                    size={20}
                    color="white"
                />
                <TextInput
                    style={styles.textInput}
                    value={text}
                    placeholder={'Enter a code to join the game'}
                    placeholderTextColor="white"
                    onChangeText={onChangeText}
                />
            </View>
            <Pressable
                onPress={() => console.log('Button Pressed')}
                style={({ pressed }) => [
                    styles.button,
                    pressed && styles.buttonPressed
                ]}
            >
                <Text style={styles.buttonText}>Join</Text>
            </Pressable>
            <View
                style={{
                    borderBottomColor: 'white',
                    borderBottomWidth: 2,
                    marginBottom: 5
                }}
            >
                <Text style={styles.upcoming}>Upcoming Games</Text>
            </View>
            <View style={styles.games}>
                {games.map((game, index) => (
                    <GameCard
                        key={index}
                        game={game}
                        onPress={() => {
                            setGame(game);
                            setShowGameModal(true);
                        }}
                    />
                ))}
            </View>
            {game && (
                <GameModal
                    visible={showGameModal}
                    onClose={() => setShowGameModal(false)}
                    gameID={game.gameID}
                />
            )}
        </ScrollView>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        padding: 20
    },
    dark: {
        flex: 1,
        backgroundColor: '#253031',
    },
    input: {
        borderBottomColor: 'white',
        borderBottomWidth: 2,
        padding: 10,
        width: 360,
        flexDirection: 'row'
    },
    textInput: {
        fontWeight: '300',
        color: 'white',
        width: 340,
        paddingLeft: 20,
        fontSize: 18
    },
    logo: {
        width: 200,
        height: 100,
        marginTop: 20,
        alignSelf: 'center',
    },
    button: {
        backgroundColor: '#DDE819',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.5,
        shadowRadius: 6,
        elevation: 4,
        width: 360,
        height: 50,
        alignContent: 'center',
        justifyContent: 'center',
        margin: 20
    },
    buttonText: {
        fontSize: 24,
        color: '#253031',
        alignContent: 'center',
        textAlign: 'center',
        padding: 5,
        fontWeight: '500'
    },
    buttonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.96 }]
    },
    upcoming: {
        fontSize: 30,
        fontWeight: '600',
        textAlign: 'center',
        color: 'white',
        padding: 5,
        borderBottomColor: 'white',
        borderBottomWidth: 2,
        width: 360
    },
    games: {
        justifyContent: 'flex-start',
        flex: 1
    }
});

//make this component available to the app
export default HomePage;