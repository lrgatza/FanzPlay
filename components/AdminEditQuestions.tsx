import React, { useEffect, useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    StyleSheet,
    Pressable,
    ScrollView,
    SafeAreaView
} from 'react-native';
import { updateDoc, doc } from 'firebase/firestore';
import { FIRESTORE } from '../FirebaseConfig';
import { Question } from '../types/Question';
import { LinearGradient } from 'expo-linear-gradient';

interface AdminEditQuestionsProps {
    visible: boolean;
    onClose: () => void;
    gameID: string;
    question: Question | null;
}

const AdminEditQuestions: React.FC<AdminEditQuestionsProps> = ({
    visible,
    onClose,
    gameID,
    question
}) => {
    if (!question) {
        return null;
    }
    const [editedQuestion, setEditedQuestion] = useState(question);

    useEffect(() => {
        setEditedQuestion(question); // Update editedQuestion whenever question changes
    }, [question]);

    const handleSave = async () => {
        const questionRef = doc(
            FIRESTORE,
            'games',
            gameID,
            'questions',
            question.questionID
        );
        await updateDoc(questionRef, {
            questionID: editedQuestion.questionID,
            answers: editedQuestion.answers,
            points: editedQuestion.points,
            question: editedQuestion.question,
            questionTime: editedQuestion.questionTime,
            correctAnswer: editedQuestion.correctAnswer
        });
        onClose();
    };

    const handleClose = () => {
        setEditedQuestion(question); // Reset editedQuestion to the original question
        onClose();
    };

    const handleAnswerChange = (text: string, index: number) => {
        const newAnswers = [...editedQuestion.answers];
        newAnswers[index] = text;
        setEditedQuestion({ ...editedQuestion, answers: newAnswers });
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
                    <ScrollView style={styles.modalContainer}>
                        <Text style={styles.label}>Question:</Text>
                        <TextInput
                            style={styles.input}
                            value={editedQuestion.question}
                            onChangeText={(text) =>
                                setEditedQuestion({
                                    ...editedQuestion,
                                    question: text
                                })
                            }
                        />

                        <Text style={styles.label}>Answers:</Text>
                        {editedQuestion.answers.map((answer, index) => (
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

                        <Text style={styles.label}>Correct Answer Index:</Text>
                        <TextInput
                            style={styles.input}
                            value={editedQuestion.correctAnswer.toString()}
                            keyboardType="numeric"
                            onChangeText={(text) =>
                                setEditedQuestion({
                                    ...editedQuestion,
                                    correctAnswer: parseInt(text) || 0
                                })
                            }
                        />

                        <Text style={styles.label}>Points:</Text>
                        <TextInput
                            style={styles.input}
                            value={editedQuestion.points.toString()}
                            keyboardType="numeric"
                            onChangeText={(text) =>
                                setEditedQuestion({
                                    ...editedQuestion,
                                    points: parseInt(text) || 0
                                })
                            }
                        />

                        <Text style={styles.label}>
                            Question Time (seconds):
                        </Text>
                        <TextInput
                            style={styles.input}
                            value={editedQuestion.questionTime.toString()}
                            keyboardType="numeric"
                            onChangeText={(text) =>
                                setEditedQuestion({
                                    ...editedQuestion,
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
                                Save Changes
                            </Text>
                        </Pressable>
                        <Pressable
                            style={({ pressed }) => [
                                styles.modalButton,
                                pressed && styles.buttonPressed
                            ]}
                            onPress={handleClose}
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
        borderRadius: 5,
        flex: 1
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
    }
});

export default AdminEditQuestions;
