import { Stack } from 'expo-router';
import React from 'react';
import { View, Text } from 'react-native';

const Layout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="register"
                options={{
                    headerShown: true,
                    title: 'Sign up'
                }}
            />
            <Stack.Screen
                name="loading"
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen name="(app)" options={{ headerShown: false }} />
        </Stack>
    );
};

export default Layout;
