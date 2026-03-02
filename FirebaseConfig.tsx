import { initializeApp } from 'firebase/app';
import {
    getAuth,
    initializeAuth,
    getReactNativePersistence
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_APP_ID
};

const FIREBASE_APP = initializeApp(firebaseConfig);
//const FIREBASE_AUTH = getAuth(FIREBASE_APP);
const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const FIRESTORE = getFirestore(FIREBASE_APP);

export { FIREBASE_AUTH, FIRESTORE };
