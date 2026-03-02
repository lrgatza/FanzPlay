import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  TextInput,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useRouter } from 'expo-router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.replace('/loading');
      }
    });

    return unsubscribe;
  }, []);

  const signIn = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      Alert.alert('Failed to Sign In', 'Please make sure you entered all information correctly');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#000000', '#253031']} style={styles.gradient}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Image source={require('../assets/fanzplay_logo_transparent.png')} style={styles.logo} />
          <Text style={styles.text}>Sign in to your account:</Text>

          <View style={styles.input}>
            <MaterialCommunityIcons name="email-outline" size={24} color="white" />
            <TextInput
              style={styles.textInput}
              autoCapitalize="none"
              placeholder="Email"
              placeholderTextColor="white"
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.input}>
            <MaterialCommunityIcons name="lock-outline" size={24} color="white" />
            <TextInput
              style={styles.textInput}
              secureTextEntry={true}
              autoCapitalize="none"
              placeholder="Password"
              placeholderTextColor="white"
              onChangeText={setPassword}
            />
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Pressable onPress={signIn} style={styles.button}>
              <Text style={styles.buttonText}>Login</Text>
            </Pressable>
          )}

          <Text style={styles.text}>Don't have an account?</Text>
          <Link href="/register" asChild>
            <Pressable onPress={() => router.push('/register')} style={styles.button}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </Pressable>
          </Link>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  logo: {
    width: 230,
    height: 210,
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: '300',
    margin: 20,
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

export default Login;