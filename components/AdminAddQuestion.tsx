import React, { useState } from 'react';
import {
    Modal,
    View,
    SafeAreaView,
    Text,
    TextInput,
    Pressable,
    ScrollView,
    StyleSheet
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, addDoc, updateDoc } from 'firebase/firestore';
import { FIRESTORE } from '../FirebaseConfig';
import { DEFAULT_QUESTION, Question } from '../types/Question';

interface AdminAddQuestionProps {
    visible: boolean;
    onClose: () => void;
    gameID: string;
}

const AdminAddQuestion: React.FC<AdminAddQuestionProps> = ({
    visible,
    onClose,
    gameID
}) => {
    const [newQuestion, setNewQuestion] = useState<Question>(DEFAULT_QUESTION);

    const handleSave = async () => {
        const questionsRef = collection(
            FIRESTORE,
            'games',
            gameID,
            'questions'
        );

        // Create the document without the questionID
        const docRef = await addDoc(questionsRef, {
            ...newQuestion,
            questionID: '' // Temporarily set as an empty string
        });

        // Now update the document with its own ID
        await updateDoc(docRef, { questionID: docRef.id });

        onClose();
        setNewQuestion(DEFAULT_QUESTION); // Reset form after saving
    };

    const handleAnswerChange = (text: string, index: number) => {
        const updatedAnswers = [...newQuestion.answers];
        updatedAnswers[index] = text;
        setNewQuestion({ ...newQuestion, answers: updatedAnswers });
    };

    const addAnswerField = () => {
        setNewQuestion({
            ...newQuestion,
            answers: [...newQuestion.answers, '']
        });
    };

    const handleCancel = () => {
        setNewQuestion(DEFAULT_QUESTION); // Reset the form
        onClose();
    };

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={visible}
            onRequestClose={handleCancel}
        >
            <SafeAreaView style={styles.modalBackground}>
                <LinearGradient
                    colors={['#000000', '#253031']}
                    style={styles.modalGradient}
                >
                    <ScrollView style={styles.modalContainer}>
                        <Text style={styles.label}>Question:</Text>
                        <TextInput
                            style={styles.input}
                            value={newQuestion.question}
                            onChangeText={(text) =>
                                setNewQuestion({
                                    ...newQuestion,
                                    question: text
                                })
                            }
                        />

                        <Text style={styles.label}>Answers:</Text>
                        {newQuestion.answers.map((answer, index) => (
                            <View key={index} style={styles.answerContainer}>
                                <Text style={styles.answerIndex}>{index}:</Text>
                                <TextInput
                                    value={answer}
                                    style={styles.input}
                                    onChangeText={(text) =>
                                        handleAnswerChange(text, index)
                                    }
                                />
                            </View>
                        ))}

                        <Pressable
                            style={({ pressed }) => [
                                styles.addButton,
                                pressed && styles.buttonPressed
                            ]}
                            onPress={addAnswerField}
                        >
                            <Text style={styles.addButtonText}>
                                + Add Answer
                            </Text>
                        </Pressable>

                        <Text style={styles.label}>Correct Answer Index:</Text>
                        <TextInput
                            style={styles.input}
                            value={newQuestion.correctAnswer.toString()}
                            keyboardType="numeric"
                            onChangeText={(text) =>
                                setNewQuestion({
                                    ...newQuestion,
                                    correctAnswer: parseInt(text) || 0
                                })
                            }
                        />

                        <Text style={styles.label}>Points:</Text>
                        <TextInput
                            style={styles.input}
                            value={newQuestion.points.toString()}
                            keyboardType="numeric"
                            onChangeText={(text) =>
                                setNewQuestion({
                                    ...newQuestion,
                                    points: parseInt(text) || 0
                                })
                            }
                        />

                        <Text style={styles.label}>
                            Question Time (seconds):
                        </Text>
                        <TextInput
                            style={styles.input}
                            value={newQuestion.questionTime.toString()}
                            keyboardType="numeric"
                            onChangeText={(text) =>
                                setNewQuestion({
                                    ...newQuestion,
                                    questionTime: parseInt(text) || 0
                                })
                            }
                        />
                        <Pressable
                            style={({ pressed }) => [
                                styles.modalButton,
                                pressed && styles.buttonPressed
                            ]}
                            onPress={handleSave}
                        >
                            <Text style={styles.modalButtonText}>
                                Add Question
                            </Text>
                        </Pressable>
                        <Pressable
                            style={({ pressed }) => [
                                styles.modalButton,
                                pressed && styles.buttonPressed
                            ]}
                            onPress={handleCancel}
                        >
                            <Text style={styles.modalButtonText}>Close</Text>
                        </Pressable>
                    </ScrollView>
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
    input: {
        backgroundColor: 'white',
        marginBottom: 10,
        padding: 10,
        borderRadius: 5
    },
    addButton: {
        backgroundColor: '#DDE819',
        marginBottom: 10,
        padding: 5,
        alignItems: 'center',
        borderRadius: 5
    },
    addButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '500'
    },
    modalButton: {
        backgroundColor: '#DDE819',
        padding: 5,
        margin: 7,
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
    answerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5
    },
    answerIndex: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
        marginRight: 10
    }
});

export default AdminAddQuestion;
