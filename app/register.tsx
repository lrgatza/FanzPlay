import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH, FIRESTORE } from '../FirebaseConfig';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FirebaseError } from 'firebase/app';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [rewardPoints, setRewardPoints] = useState(0);
  const auth = FIREBASE_AUTH;

  const signUp = async () => {
    setLoading(true);

    const usernameQuery = query(
      collection(FIRESTORE, 'users'),
      where('username', '==', username)
    );
    const usernameSnapshot = await getDocs(usernameQuery);

    if (!usernameSnapshot.empty) {
      Alert.alert('Username already exists', 'Please choose a different one.');
      setLoading(false);
      return;
    }

    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(FIRESTORE, 'users', response.user.uid), {
        email: email,
        firstName: firstName,
        lastName: lastName,
        role: 'normal',
        userID: response.user.uid,
        username: username,
        rewardPoints: 0
      });
    } catch (e) {
      if (e instanceof FirebaseError) {
        handleAuthError(e.code);
      } else {
        Alert.alert('An unexpected error occurred', 'Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAuthError = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        Alert.alert('Email is already in use', 'Please use a different email.');
        break;
      case 'auth/invalid-email':
        Alert.alert('Invalid email format', 'Please enter a valid email address.');
        break;
      case 'auth/weak-password':
        Alert.alert('Password is too weak', 'Please enter a stronger password.');
        break;
      default:
        Alert.alert('An unexpected error occurred', 'Please try again.');
        break;
    }
  };

  return (
    <LinearGradient colors={['#000000', '#253031']} style={styles.gradient}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.background}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.container}>
            <Image source={require('../assets/fanzplay_logo_transparent.png')} style={styles.logo} />
            <View style={styles.input}>
              <MaterialCommunityIcons name="email-outline" size={24} color="white" />
              <TextInput
                placeholder="Email"
                placeholderTextColor="white"
                autoCapitalize="none"
                style={styles.textInput}
                onChangeText={setEmail}
              />
            </View>
            <View style={styles.input}>
              <MaterialCommunityIcons name="account-outline" size={24} color="white" />
              <TextInput
                placeholder="First Name"
                placeholderTextColor="white"
                autoCapitalize="none"
                style={styles.textInput}
                onChangeText={setFirstName}
              />
            </View>
            <View style={styles.input}>
              <MaterialCommunityIcons name="account-outline" size={24} color="white" />
              <TextInput
                placeholder="Last Name"
                placeholderTextColor="white"
                autoCapitalize="none"
                style={styles.textInput}
                onChangeText={setLastName}
              />
            </View>
            <View style={styles.input}>
              <MaterialCommunityIcons name="at" size={24} color="white" />
              <TextInput
                placeholder="Username"
                placeholderTextColor="white"
                autoCapitalize="none"
                style={styles.textInput}
                onChangeText={setUsername}
              />
            </View>
            <View style={styles.input}>
              <MaterialCommunityIcons name="lock-outline" size={24} color="white" />
              <TextInput
                placeholder="Password"
                secureTextEntry={true}
                placeholderTextColor="white"
                autoCapitalize="none"
                style={styles.textInput}
                onChangeText={setPassword}
              />
            </View>

            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <Pressable onPress={signUp} style={styles.button}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </Pressable>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom: 100,
  },
  logo: {
    width: 230,
    height: 210,
  },
  container: {
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderBottomColor: 'white',
    borderBottomWidth: 2,
    flexDirection: 'row',
    marginBottom: 20,
    width: '100%',
  },
  textInput: {
    color: 'white',
    paddingLeft: 20,
    flex: 1,
  },
  button: {
    backgroundColor: '#DDE819',
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 24,
    color: '#000',
  },
});

export default Register;