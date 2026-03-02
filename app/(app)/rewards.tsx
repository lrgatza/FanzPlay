import React, { useState } from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    Button,
    TextInput,
    Alert,
    Modal,
    Pressable
} from 'react-native';
import { updateUser } from '../../services/userUpdater';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { useRouter } from 'expo-router';
import { User } from '../../types/User';
import { handleDeleteAccount } from '../../services/deleteAccount';
import { LinearGradient } from 'expo-linear-gradient';
import getUser from '../../services/userFetcher';
import { Image } from 'react-native';




const auth = FIREBASE_AUTH;


const RewardsPage: React.FC = () => {
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rewardPoints, setRewardPoints] = useState(0);
    const { user, loading } = getUser(auth.currentUser?.uid!);


    const handleUpdate = async () => {
        if (!firstName.trim() || !lastName.trim() || !username.trim()) {
            Alert.alert('Error', 'All fields are required.');
            return;
        }


        const userData: Partial<User> = {
            firstName,
            lastName,
            username,
            rewardPoints
        };


        await updateUser(auth.currentUser?.uid, userData);
        resetFields();
        setIsUpdating(false);
    };


    const handleCancel = () => {
        resetFields();
        setIsUpdating(false);
    };


    const resetFields = () => {
        setFirstName('');
        setLastName('');
        setUsername('');
        setRewardPoints(0);
    };


    const handleDelete = () => {
        setIsDeleting(true);
    };


    const confirmDelete = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Error', 'Please enter your email and password.');
            return;
        }


        try {
            await handleDeleteAccount(auth, email, password);
            Alert.alert('Account Deleted', 'Your account has been successfully deleted.');
            setIsDeleting(false); // Close the modal
            router.replace('/'); // Redirect to root
        } catch (error) {
            Alert.alert('Error', 'Failed to delete account. Try again');
        }
    };


    return (
        <ScrollView style={styles.background} contentContainerStyle={{ flexGrow: 1 }}>
            <LinearGradient colors={['#000000', '#253031']} style={styles.gradient}>
                <View style={styles.container}>
                    <Image
                        source={require('../../assets/fanzplay_logo_transparent.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    {!isUpdating && !loading && user && (
                        <Text style={styles.prizes}>Your Points: {user.rewardPoints}</Text>
                    )}
                    <Image
                source={require('../../assets/mock_rewards.png')}
                style={styles.image}/>
                </View>
            </LinearGradient>
        </ScrollView>
    );
};




const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    logo: {
        width: 200, // Adjust the width as needed
        height: 100, // Adjust the height as needed
        marginTop: 20, // Add some space above the logo
        alignSelf: 'center', // Center the logo horizontally
    },
    background: {
        flex: 1
    },
    gradient: {
        flex: 1
    },
    deleteButton: {
        backgroundColor: 'red'
    },


    input: {
        backgroundColor: 'white',
        color: 'black',
        borderBottomWidth: 2,
        borderBottomColor: '#DDE819',
        padding: 10,
        width: 300,
        fontSize: 16,
        borderRadius: 5,
        marginBottom: 15
    },
    button: {
        backgroundColor: '#DDE819',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        minWidth: 80,
        marginHorizontal: 10
    },
    buttonText: {
        color: '#000',
        fontSize: 19,
        fontWeight: '500'
    },
    space: {
        height: 10
    },


    textInput: {
        fontWeight: '300',
        color: 'white',
        width: 340,
        paddingLeft: 20,
        fontSize: 18
    },


    header: {
        color: '#DDE819',
        position: 'absolute',
        top: 20,
        alignSelf: 'center',
        fontSize: 24
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        width: '80%',
        borderRadius: 10
    },
    buttonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.96 }]
    }, 
    prizes: {
        fontSize: 30,
        fontWeight: '600',
        textAlign: 'center',
        color: 'white',
        padding: 5,
        borderBottomColor: 'white',
        borderBottomWidth: 2,
        width: 360
    },
    image: {
        margin: 15
    }
});


export default RewardsPage;