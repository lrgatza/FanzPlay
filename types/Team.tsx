// Interface for a Team document

import { doc, DocumentReference } from 'firebase/firestore';
import { FIRESTORE } from '../FirebaseConfig';
export interface Team {
    teamID: DocumentReference;
    color1: string;
    color2: string;
    logo: string;
    name: string;
}

export const DEFAULT_TEAM: Team = {
    teamID: doc(FIRESTORE, 'teams/' + 'defaultTeamId'),
    color1: 'gray',
    color2: 'gray',
    logo: 'default_logo_url',
    name: 'Unknown Team'
};
