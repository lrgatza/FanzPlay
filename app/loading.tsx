//import liraries
import { useRouter } from 'expo-router';
import React, { Component, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import getUser from '../services/userFetcher';
import { ActivityIndicator } from 'react-native';

// create a component
const Loading = () => {
    const router = useRouter();
    const uid = FIREBASE_AUTH.currentUser?.uid;
    const { loading, user } = getUser(uid as string);

    useEffect(() => {
        if (!loading) {
            if (user.role == 'admin') {
                router.replace('/(admin)/admin');
            } else {
                router.replace('/(app)/home');
            }
        }
    }, [loading]);

    return (
        <ActivityIndicator
            size="large"
            color="#0000ff"
            style={styles.container}
        />
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

//make this component available to the app
export default Loading;
