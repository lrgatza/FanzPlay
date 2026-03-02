//import liraries
import React, { Component, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Button,
    Pressable,
    Modal,
    TextInput
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FIRESTORE } from '../../FirebaseConfig';
import {
    addDoc,
    collection,
    doc,
    Firestore,
    setDoc,
    Timestamp,
    getDocs,
    updateDoc
} from 'firebase/firestore';
import getTeam from '../../services/teamFetcher';
import { Team } from '../../types/Team';
import { Game } from '../../types/Game';
import DateTimePicker, {
    DateTimePickerEvent
} from '@react-native-community/datetimepicker';
import useFetchTeam from '../../services/teamFetcher';
import RNPickerSelect from 'react-native-picker-select';
import { Image } from 'react-native';

interface TeamOption {
    label: string;
    value: string;
}

// create a component
const AdminPage = () => {
    const db = FIRESTORE;
    // create game states
    const [createGameModalVisible, setCreateGameModalVisible] = useState(false);
    const [team1ID, setTeam1ID] = useState('');
    const [team2ID, setTeam2ID] = useState('');
    const { team: team1, loading: loadingTeam1 } = useFetchTeam(team1ID);
    const { team: team2, loading: loadingTeam2 } = useFetchTeam(team2ID);
    const [date, setDate] = useState(new Date());
    // create team states
    const [createTeamModalVisible, setCreateTeamModalVisible] = useState(false);
    const [teamName, setTeamName] = useState('');
    const [color1, setColor1] = useState('');
    const [color2, setColor2] = useState('');
    const [logo, setLogo] = useState('');
    //  edit team states
    const [editTeamModalVisible, setEditTeamModalVisible] = useState(false);
    const [oldTeamID, setOldTeamID] = useState('');
    const [newTeamName, setNewTeamName] = useState('');
    const [newColor1, setNewColor1] = useState('');
    const [newColor2, setNewColor2] = useState('');
    const [newLogo, setNewLogo] = useState('');

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const showTimePicker = () => {
        setTimePickerVisibility(true);
    };

    const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setDatePickerVisibility(false); // Hide the date picker after selection
        const currentDate = selectedDate || date;
        setDate(currentDate);
    };

    const onChangeTime = (event: DateTimePickerEvent, selectedTime?: Date) => {
        setTimePickerVisibility(false); // Hide the time picker after selection
        const currentTime = selectedTime || date;
        setDate(currentTime);
    };
    const handleAddGame = async (db: Firestore, startTime: Timestamp) => {
        if (team1 && team2 && startTime) {
            const docRef = await addDoc(collection(db, 'games'), {
                gameID: '',
                gameState: 'inactive',
                currentQuestion: 0,
                startTime: startTime,
                team1ID: doc(db, 'teams/' + team1.teamID),
                team1Responses: 0,
                team1Score: 0,
                team2ID: doc(db, 'teams/' + team2.teamID),
                team2Responses: 0,
                team2Score: 0
            });
            await updateDoc(docRef, { gameID: docRef.id });
        } else {
            alert('Make sure all fields are filled!');
            console.log(team1ID);
            console.log(team2ID);
            console.log(startTime);
        }
    };

    const [teams, setTeams] = useState<TeamOption[]>([]);

    const pickerSelectStyles = StyleSheet.create({
        inputIOS: styles.pickerInputIOS,
        inputAndroid: styles.pickerInputAndroid,
    });
    useEffect(() => {
        const fetchTeams = async () => {
            const querySnapshot = await getDocs(collection(FIRESTORE, 'teams'));
            const fetchedTeams: TeamOption[] = querySnapshot.docs.map(doc => ({
                label: doc.data().teamName, // Make sure 'teamName' is the correct field name
                value: doc.id,
            }));
            setTeams(fetchedTeams);
        };

        fetchTeams();
    }, []);


    const handleAddTeam = async (
        db: Firestore,
        teamName: string,
        color1: string,
        color2: string,
        logo: string
    ) => {
        if (teamName && color1 && color2 && logo) {
            const docRef = await addDoc(collection(db, 'teams'), {
                teamID: '',
                teamName: teamName,
                color1: color1,
                color2: color2,
                logo: logo
            });
            await updateDoc(docRef, { teamID: docRef.id });
        } else {
            alert('Make sure all fields are filled!');
        }
    };

    const handleEditTeam = async (
        db: Firestore,
        teamID: string,
        teamName: string,
        color1: string,
        color2: string,
        logo: string
    ) => {
        if (teamID) {
            if (teamName) {
                const docRef = await updateDoc(doc(db, 'teams/' + teamID), {
                    name: teamName
                });
            }
            if (color1) {
                const docRef = await updateDoc(doc(db, 'teams/' + teamID), {
                    color1: color1
                });
            }
            if (color2) {
                const docRef = await updateDoc(doc(db, 'teams/' + teamID), {
                    color2: color2
                });
            }
            if (logo) {
                const docRef = await updateDoc(doc(db, 'teams/' + teamID), {
                    logo: logo
                });
            }
        } else {
            alert('Fill at least one field!');
        }
    };

    return (
        <View style={styles.background}>
            <LinearGradient
                colors={['#000000', '#253031']}
                style={styles.gradient}
            >
                <Image
                    source={require('../../assets/fanzplay_logo_transparent.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <View style={styles.container}>
                    <Pressable
                        style={styles.button}
                        onPress={() => setCreateGameModalVisible(true)}
                    >
                        <Text style={styles.buttonText}>Create new game</Text>
                    </Pressable>
                    {/* Modal for creating a new game */}
                    {createGameModalVisible && (
                        <Modal
                            transparent={true}
                            visible={createGameModalVisible}
                        >
                            <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                    {/* Date and Time Picker */}
                                    <Pressable onPress={showDatePicker}>
                                        <Text>Select Date</Text>
                                    </Pressable>
                                    {isDatePickerVisible && (
                                        <View style={styles.dateAndTime}>
                                            <DateTimePicker
                                                value={date}
                                                mode="date"
                                                display="default"
                                                onChange={onChangeDate}
                                            />
                                        </View>
                                    )}
    
                                    <Pressable onPress={showTimePicker}>
                                        <Text>Select Time</Text>
                                    </Pressable>
                                    {isTimePickerVisible && (
                                        <View style={styles.dateAndTime}>
                                            <DateTimePicker
                                                value={date}
                                                mode="time"
                                                is24Hour={true}
                                                display="default"
                                                onChange={onChangeTime}
                                            />
                                        </View>
                                    )}
                                    <RNPickerSelect
                                        onValueChange={(value) => setTeam1ID(value)}
                                        items={teams}
                                        placeholder={{ label: "Select Team 1", value: null }}
                                        style={pickerSelectStyles}
                                        value={team1ID}
                                    />
                                    <RNPickerSelect
                                        onValueChange={(value) => setTeam2ID(value)}
                                        items={teams}
                                        placeholder={{ label: "Select Team 2", value: null }}
                                        style={pickerSelectStyles}
                                        value={team2ID}
                                    />
                                    <Button
                                        title="Add Game"
                                        onPress={() =>
                                            handleAddGame(
                                                db,
                                                new Timestamp(
                                                    date.getTime() / 1000,
                                                    0
                                                )
                                            )
                                        }
                                        color="red"
                                    />
                                    <Button
                                        title="Cancel"
                                        onPress={() =>
                                            setCreateGameModalVisible(false)
                                        }
                                        color="blue"
                                    />
                                </View>
                            </View>
                        </Modal>
                    )}
    
                    {/* Buttons for creating a new team and editing a team */}
                    <Pressable
                        style={styles.button}
                        onPress={() => setCreateTeamModalVisible(true)}
                    >
                        <Text style={styles.buttonText}>Create new team</Text>
                    </Pressable>
                    {/* Modal for creating a new team */}
                    {createTeamModalVisible && (
                        <Modal
                            transparent={true}
                            visible={createTeamModalVisible}
                        >
                            <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                    <TextInput
                                        placeholder="Team name"
                                        value={teamName}
                                        style={styles.input}
                                        onChangeText={(text) =>
                                            setTeamName(text)
                                        }
                                    />
                                    <TextInput
                                        placeholder="Color 1"
                                        value={color1}
                                        style={styles.input}
                                        onChangeText={(text) => setColor1(text)}
                                    />
                                    <TextInput
                                        placeholder="Color 2"
                                        value={color2}
                                        style={styles.input}
                                        onChangeText={(text) => setColor2(text)}
                                    />
                                    <TextInput
                                        placeholder="Logo"
                                        value={logo}
                                        style={styles.input}
                                        onChangeText={(text) => setLogo(text)}
                                    />
                                    <Button
                                        title="Add Team"
                                        onPress={() =>
                                            handleAddTeam(
                                                db,
                                                teamName,
                                                color1,
                                                color2,
                                                logo
                                            )
                                        }
                                        color="red"
                                    />
                                    <Button
                                        title="Cancel"
                                        onPress={() =>
                                            setCreateTeamModalVisible(false)
                                        }
                                        color="blue"
                                    />
                                </View>
                            </View>
                        </Modal>
                    )}
    
                    <Pressable
                        style={styles.button}
                        onPress={() => setEditTeamModalVisible(true)}
                    >
                        <Text style={styles.buttonText}>Edit a team</Text>
                    </Pressable>
                    {/* Modal for editing a team */}
                    {editTeamModalVisible && (
                        <Modal
                            transparent={true}
                            visible={editTeamModalVisible}
                        >
                            <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                    <TextInput
                                        placeholder="Team ID"
                                        value={oldTeamID}
                                        style={styles.input}
                                        onChangeText={(text) =>
                                            setOldTeamID(text)
                                        }
                                    />
                                    <TextInput
                                        placeholder="New team name"
                                        value={newTeamName}
                                        style={styles.input}
                                        onChangeText={(text) =>
                                            setNewTeamName(text)
                                        }
                                    />
                                    <TextInput
                                        placeholder="New color 1"
                                        value={newColor1}
                                        style={styles.input}
                                        onChangeText={(text) =>
                                            setNewColor1(text)
                                        }
                                    />
                                    <TextInput
                                        placeholder="New color 2"
                                        value={newColor2}
                                        style={styles.input}
                                        onChangeText={(text) =>
                                            setNewColor2(text)
                                        }
                                    />
                                    <TextInput
                                        placeholder="New Logo"
                                        value={newLogo}
                                        style={styles.input}
                                        onChangeText={(text) =>
                                            setNewLogo(text)
                                        }
                                    />
                                    <Button
                                        title="Submit changes"
                                        onPress={() =>
                                            handleEditTeam(
                                                db,
                                                oldTeamID,
                                                newTeamName,
                                                newColor1,
                                                newColor2,
                                                newLogo
                                            )
                                        }
                                        color="red"
                                    />
                                    <Button
                                        title="Cancel"
                                        onPress={() =>
                                            setEditTeamModalVisible(false)
                                        }
                                        color="blue"
                                    />
                                </View>
                            </View>
                        </Modal>
                    )}
                </View>
            </LinearGradient>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    background: {
        flex: 1
    },
    gradient: {
        flex: 1
    },
    buttonText: {
        fontSize: 24,
        color: '#000',
        alignContent: 'center',
        textAlign: 'center',
        padding: 5,
        fontWeight: '500'
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
        width: 340,
        height: 50,
        alignContent: 'center',
        justifyContent: 'center',
        margin: 20
    },
    logo: {
        width: 200, // Adjust the width as needed
        height: 100, // Adjust the height as needed
        marginTop: 20, // Adjust the margin as needed
        alignSelf: 'center', // Center the logo
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)' // Dimmed background
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        width: '80%',
        borderRadius: 10
    },
    input: {
        backgroundColor: 'white',
        color: 'black',
        borderBottomWidth: 2,
        borderBottomColor: '#DDE819',
        padding: 10,
        width: 250,
        fontSize: 16,
        borderRadius: 5,
        marginBottom: 15
    },
    selectedLabel: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10
    },
    dateAndTime: {
        flexDirection: 'row'
    },
    pickerInputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
        marginBottom: 15, // Add some margin if needed
    },
    pickerInputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
        marginBottom: 15, // Add some margin if needed
    },
});

//make this component available to the app
export default AdminPage;
