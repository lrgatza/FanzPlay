// Interface for a Question document
export interface Question {
    questionID: string;
    answers: string[];
    points: number;
    question: string;
    questionTime: number;
    correctAnswer: number; //index of correct answer choice
}

export const DEFAULT_QUESTION: Question = {
    questionID: '',
    question: '',
    answers: [''],
    correctAnswer: 0,
    questionTime: 0,
    points: 0
};
