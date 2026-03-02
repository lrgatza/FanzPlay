import { Timestamp } from 'firebase/firestore';
import { Question } from './Question';
import { Team } from './Team';

// Interface for a Game document with resolved references
export interface Game {
    gameID: string;
    /*Possible States: inactive, lobby, question,
     leaderboard, finalLeaderboard*/
    gameState: string;
    currentQuestion: number; //index of the current question
    questions: Question[]; // An array of resolved Question documents
    startTime: Timestamp;
    team1: Team; // Resolved Team document
    team2: Team; // Resolved Team document
    team1score: number;
    team2score: number;
    team1responses: number;
    team2responses: number;
}
