import { Link, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import AdminGameCard from '../../components/AdminGameCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useGames from '../../services/gamesFetcher';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'react-native';

const auth = FIREBASE_AUTH;

const GamesPage = () => {
    const router = useRouter();
    const { games, loading: gamesLoading } = useGames();
    const [text, onChangeText] = React.useState('');

    return (
        <View style={styles.background}>
            <LinearGradient colors={['#000000', '#253031']} style={styles.gradient}>
                <Image
                    source={require('../../assets/fanzplay_logo_transparent.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <ScrollView contentContainerStyle={styles.games}>
                    {games.map((game, index) => (
                        <AdminGameCard key={index} game={game} />
                    ))}
                </ScrollView>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1
    },
    gradient: {
        flex: 1
    },
    logo: {
        width: 200, // Adjust the width as needed
        height: 100, // Adjust the height as needed
        marginTop: 20, // Adjust the margin as needed
        alignSelf: 'center', // Center the logo
    },
    games: {
        justifyContent: 'flex-start',
        alignItems: 'center', // Ensure the games are centered in the scroll view
    }
});

export default GamesPage;