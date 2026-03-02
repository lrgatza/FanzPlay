import { Stack } from 'expo-router';
import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AdminPage from './admin';
import ProfilePage from './profile';
import GamesPage from './games';

const Tab = createBottomTabNavigator();

const Layout = () => {
    return (
        <Tab.Navigator
            initialRouteName="admin"
            screenOptions={{ headerShown: false }}
        >
            <Tab.Screen
                name="Admin"
                component={AdminPage}
                options={{
                    title: 'Admin Page',
                    headerShown: false,
                    tabBarLabel: 'Admin',
                    tabBarIcon: ({ size, color }) => (
                        <Ionicons name="checkbox" size={size} color={color} />
                    )
                }}
            />
            <Tab.Screen
                name="Games"
                component={GamesPage}
                options={{
                    title: 'Games Page',
                    headerShown: false,
                    tabBarLabel: 'Games',
                    tabBarIcon: ({ size, color }) => (
                        <Ionicons
                            name="game-controller"
                            size={size}
                            color={color}
                        />
                    )
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfilePage}
                options={{
                    title: 'Profile Page',
                    headerShown: false,
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ size, color }) => (
                        <Ionicons name="person" size={size} color={color} />
                    )
                }}
            />
        </Tab.Navigator>
    );
};

export default Layout;
