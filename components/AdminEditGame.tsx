import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    Pressable,
    StyleSheet,
    SafeAreaView
} from 'react-native';
import DateTimePicker, {
    DateTimePickerEvent
} from '@react-native-community/datetimepicker';
import { updateDoc, doc, Timestamp } from 'firebase/firestore';
import { FIRESTORE } from '../FirebaseConfig';
import { Game } from '../types/Game';
import { LinearGradient } from 'expo-linear-gradient';

interface AdminEditGameProps {
    visible: boolean;
    onClose: () => void;
    game: Game;
}

const AdminEditGame: React.FC<AdminEditGameProps> = ({
    visible,
    onClose,
    game
}) => {
    const [date, setDate] = useState(game.startTime.toDate());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(false);
        setDate(currentDate);
    };

    const onChangeTime = (event: DateTimePickerEvent, selectedTime?: Date) => {
        const currentTime = selectedTime || date;
        setShowTimePicker(false);
        setDate(currentTime);
    };

    const handleSave = async () => {
        const gameRef = doc(FIRESTORE, 'games', game.gameID);
        const firestoreTimestamp = Timestamp.fromDate(date);
        await updateDoc(gameRef, { startTime: firestoreTimestamp });
        onClose();
    };

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={visible}
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.modalBackground}>
                <LinearGradient
                    colors={['#000000', '#253031']}
                    style={styles.modalGradient}
                >
                    <View style={styles.modalContainer}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.modalButton,
                                pressed && styles.buttonPressed
                            ]}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text style={styles.modalButtonText}>
                                Change Date
                            </Text>
                        </Pressable>

                        {showDatePicker && (
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display="default"
                                onChange={onChangeDate}
                                themeVariant={'dark'}
                                style={styles.dateTimePicker}
                            />
                        )}

                        <Pressable
                            style={({ pressed }) => [
                                styles.modalButton,
                                pressed && styles.buttonPressed
                            ]}
                            onPress={() => setShowTimePicker(true)}
                        >
                            <Text style={styles.modalButtonText}>
                                Change Time
                            </Text>
                        </Pressable>

                        {showTimePicker && (
                            <DateTimePicker
                                value={date}
                                mode="time"
                                is24Hour={true}
                                display="default"
                                onChange={onChangeTime}
                                themeVariant={'dark'}
                                style={styles.dateTimePicker}
                            />
                        )}

                        <Text style={styles.selectedLabel}>
                            Selected: {date.toLocaleString()}
                        </Text>

                        <Pressable
                            style={({ pressed }) => [
                                styles.modalButton,
                                pressed && styles.buttonPressed
                            ]}
                            onPress={handleSave}
                        >
                            <Text style={styles.modalButtonText}>
                                Save Changes
                            </Text>
                        </Pressable>
                        <Pressable
                            style={({ pressed }) => [
                                styles.modalButton,
                                pressed && styles.buttonPressed
                            ]}
                            onPress={onClose}
                        >
                            <Text style={styles.modalButtonText}>Close</Text>
                        </Pressable>
                    </View>
                </LinearGradient>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1
    },
    modalGradient: {
        flex: 1
    },
    modalContainer: {
        padding: 20
    },
    label: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10
    },
    selectedLabel: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10
    },
    modalButton: {
        backgroundColor: '#DDE819',
        padding: 10,
        margin: 10,
        borderRadius: 5,
        alignItems: 'center'
    },
    modalButtonText: {
        color: '#000',
        fontSize: 24,
        fontWeight: '500'
    },
    buttonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.96 }]
    },
    dateTimePicker: {
        alignSelf: 'center'
    }
});

export default AdminEditGame;
